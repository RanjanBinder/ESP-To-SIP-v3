const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const plain = (value) => JSON.parse(JSON.stringify(value));

const approximately = (actual, expected, epsilon = 1e-9) => {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`
  );
};

const loadCorrectionUtilities = () => {
  const appendedNodes = [];
  const document = {
    createElement(tagName) {
      return { tagName: String(tagName).toUpperCase(), textContent: "" };
    },
    head: {
      appendChild(node) {
        appendedNodes.push(node);
        return node;
      }
    }
  };
  const window = {
    localStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {}
    },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; }
  };
  const React = {
    Fragment: Symbol("Fragment"),
    createElement() { return null; },
    useCallback(callback) { return callback; },
    useEffect() {},
    useMemo(factory) { return factory(); },
    useRef(value) { return { current: value }; },
    useState(value) { return [typeof value === "function" ? value() : value, () => {}]; }
  };

  window.window = window;
  window.document = document;
  const context = vm.createContext({
    console,
    document,
    React,
    window,
    clearTimeout,
    setTimeout
  });

  for (const fileName of ["pim-tracks-data.js", "pim-track-correction.js"]) {
    const filePath = path.join(__dirname, fileName);
    vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
  }

  return {
    data: window.PIM_TRACKS_MOCK,
    utils: window.PIMTrackCorrectionTestUtils,
    workspace: window.PIMTrackCorrectionWorkspace,
    appendedNodes
  };
};

const harness = loadCorrectionUtilities();
const { data, utils } = harness;

test("loads the generated data and correction utilities with minimal browser mocks", () => {
  assert.ok(data);
  assert.equal(typeof harness.workspace, "function");
  assert.deepEqual(Object.keys(utils).sort(), [
    "buildInitialDocument",
    "documentMatchesContext",
    "hydrateReviewDocument",
    "isReviewDocument",
    "mergeTrackCoordinates",
    "nearestEndpointPair",
    "projectPointToPolyline",
    "sanitiseCoordinates",
    "splitCoordinatesAt",
    "storageKeyFor",
    "validateCoordinates"
  ]);
  assert.equal(harness.appendedNodes.length, 1);
  assert.equal(harness.appendedNodes[0].tagName, "STYLE");
  assert.ok(harness.appendedNodes[0].textContent.length > 0);
});

test("normalizes the initial PIM document and preserves source traceability", () => {
  const document = utils.buildInitialDocument();
  const allowedTypes = new Set(["MAIN_LINE", "LOOP_LINE", "SIDING", "OTHER"]);
  const allowedDirections = new Set(["UP", "DN", "BIDIRECTIONAL", "NA"]);
  const allowedSources = new Set(["AI_EXTRACTION", "MANUAL", "MANUAL_MAPPING"]);
  const allowedStatuses = new Set(["EXTRACTED", "NEEDS_REVIEW"]);

  assert.equal(document.schemaVersion, 2);
  assert.equal(document.tracks.length, data.TRACKS.length);
  assert.equal(document.unmapped.length, data.ELEMENT_GROUPS.length);
  assert.ok(document.topology.length > 0);
  assert.ok(document.topology.every((relation) => relation.sourceAssetId && relation.destinationAssetId));
  assert.deepEqual(plain(document.archive), []);
  assert.deepEqual(plain(document.audit), []);

  for (const track of document.tracks) {
    assert.match(track.id, /^TRK-\d+$/);
    assert.ok(allowedTypes.has(track.trackType));
    assert.ok(allowedDirections.has(track.direction));
    assert.ok(allowedSources.has(track.source));
    assert.ok(allowedStatuses.has(track.status));
    assert.equal(track.geometry.type, "LineString");
    assert.equal(track.originalGeometry.type, "LineString");
    assert.equal(utils.validateCoordinates(track.geometry.coordinates), "");
    assert.deepEqual(plain(track.geometry), plain(track.originalGeometry));
    assert.notStrictEqual(track.geometry, track.originalGeometry);
    assert.notStrictEqual(track.geometry.coordinates, track.originalGeometry.coordinates);
    assert.equal(new Set(track.connectedAssetIds).size, track.connectedAssetIds.length);
    assert.ok(Array.isArray(track.sourceGeometryIds));
    assert.ok(Array.isArray(track.issues));
    assert.ok(Array.isArray(track.mergedAssetIds));
    assert.equal(track.rejectionReason, "");
    assert.equal(track.rejectedBy, "");
    assert.equal(track.rejectedAt, "");
    assert.equal(track.version, 1);
    assert.equal(track.parentTrackId, null);
  }

  const upMain = document.tracks.find((track) => track.id === "TRK-001");
  assert.deepEqual(plain(upMain.geometry.coordinates), [
    [60, 330],
    [520, 330],
    [1060, 330],
    [1540, 330]
  ]);
  assert.equal(upMain.trackType, "MAIN_LINE");
  assert.equal(upMain.direction, "UP");
  assert.equal(upMain.source, "AI_EXTRACTION");
  assert.equal(upMain.status, "EXTRACTED");
  assert.deepEqual(plain(upMain.connectedAssetIds), ["TRK-003", "P-101", "P-118", "ND-W1", "ND-E1"]);
  assert.deepEqual(plain(upMain.sourceGeometryIds), ["SEG-101", "SEG-102", "SEG-103"]);

  const validTopologyIds = new Set([
    ...document.tracks.map((track) => track.id),
    ...data.TURNOUTS.map((turnout) => turnout.id),
    ...data.BUFFER_STOPS.map((buffer) => buffer.id),
    ...data.TRACKS.flatMap((track) => [track.startNodeId, track.endNodeId]).filter(Boolean)
  ]);
  for (const relation of document.topology) {
    assert.ok(validTopologyIds.has(relation.sourceAssetId));
    assert.ok(validTopologyIds.has(relation.destinationAssetId));
    assert.ok([null, undefined, "START", "END"].includes(relation.sourceEndpointRole));
    assert.ok([null, undefined, "START", "END"].includes(relation.destinationEndpointRole));
    if (relation.relationship === "NETWORK_ADJACENT") {
      assert.equal(relation.sourceEndpointRole, null);
      assert.equal(relation.destinationEndpointRole, null);
    }
    if (relation.relationship === "CONNECTED_AT") {
      const sourceTrack = document.tracks.find((track) => track.id === relation.sourceAssetId);
      assert.ok(sourceTrack);
      assert.ok(Number.isInteger(relation.sourceSegmentIndex));
      assert.ok(Array.isArray(relation.connectionPoint));
      approximately(utils.projectPointToPolyline(relation.connectionPoint, sourceTrack.geometry.coordinates).distance, 0);
    }
  }

  const upMainEndpointRoles = new Set(document.topology.flatMap((relation) => {
    if (relation.sourceAssetId === upMain.id && relation.sourceEndpointRole) return [relation.sourceEndpointRole];
    if (relation.destinationAssetId === upMain.id && relation.destinationEndpointRole) return [relation.destinationEndpointRole];
    return [];
  }));
  assert.deepEqual([...upMainEndpointRoles].sort(), ["END", "START"]);

  const downMain = document.tracks.find((track) => track.id === "TRK-002");
  assert.equal(downMain.direction, "DN");

  const disconnected = document.tracks.find((track) => track.id === "TRK-004");
  assert.equal(disconnected.status, "NEEDS_REVIEW");
  assert.deepEqual(plain(disconnected.issues), ["DISCONNECTED"]);

  const lowConfidence = document.tracks.find((track) => track.id === "TRK-007");
  assert.equal(lowConfidence.name, "");
  assert.equal(lowConfidence.trackType, "OTHER");
  assert.equal(lowConfidence.direction, "NA");
  assert.equal(lowConfidence.status, "NEEDS_REVIEW");
  assert.deepEqual(plain(lowConfidence.issues), [
    "LOW_CONFIDENCE",
    "DISCONNECTED",
    "MANUAL_REVIEW_REQUIRED",
    "GEOMETRY_MISMATCH"
  ]);

  for (const group of document.unmapped) {
    assert.equal(group.status, "UNMAPPED");
    assert.ok(Array.isArray(group.sourceElementIds));
    assert.ok(Array.isArray(group.paths));
    assert.ok(group.paths.length > 0);
    for (const segment of group.paths) assert.equal(utils.validateCoordinates(segment), "");
  }
});

test("builds station-aware documents and samples curved source geometry", () => {
  const document = utils.buildInitialDocument({ name: "Aurangabad", code: "AWB", cll: "500.000" });
  assert.deepEqual(plain(document.station), { name: "Aurangabad", code: "AWB", baseChainage: 500 });
  assert.equal(document.tracks[0].startChainage, "500.000");
  assert.ok(document.tracks.some((track) => track.geometry.coordinates.length > track.sourceGeometryIds.length + 1));
});

test("isolates upload drafts and hydrates incomplete persisted track fields", () => {
  const station = { name: "Aurangabad", code: "AWB", cll: "500.000" };
  const sourceA = { id: "esp-upload-a", fileName: "AWB-A.dwg", previewImage: "a.png" };
  const sourceB = { id: "esp-upload-b", fileName: "AWB-B.dwg", previewImage: "b.png" };
  assert.notEqual(utils.storageKeyFor(station, sourceA), utils.storageKeyFor(station, sourceB));

  const incomplete = {
    schemaVersion: 2,
    station: { code: "AWB", name: "Aurangabad", baseChainage: 500 },
    sourceDocument: sourceA,
    tracks: [{ id: "TRK-101", geometry: { type: "LineString", coordinates: [[0, 0], [10, 0]] } }],
    unmapped: [null],
    topology: [],
    archive: [],
    audit: []
  };
  assert.equal(utils.isReviewDocument(incomplete), true);
  assert.equal(utils.documentMatchesContext(incomplete, station, sourceA), true);
  assert.equal(utils.documentMatchesContext(incomplete, station, sourceB), false);

  const hydrated = utils.hydrateReviewDocument(incomplete, station, sourceA);
  const track = hydrated.tracks[0];
  assert.equal(track.name, "");
  assert.equal(track.trackType, "OTHER");
  assert.equal(track.direction, "NA");
  assert.equal(track.status, "NEEDS_REVIEW");
  assert.equal(track.source, "AI_EXTRACTION");
  assert.deepEqual(plain(track.connectedAssetIds), []);
  assert.deepEqual(plain(track.issues), []);
  assert.equal(hydrated.unmapped[0].id, "UNMAPPED-1");
  assert.deepEqual(plain(hydrated.unmapped[0].paths), []);
});

test("sanitizes coordinates and reports invalid geometry", () => {
  assert.deepEqual(plain(utils.sanitiseCoordinates([
    [0, 0],
    [0.05, 0.05],
    [5, 0],
    [Number.NaN, 2],
    null,
    [10, 0]
  ])), [[0, 0], [5, 0], [10, 0]]);

  assert.equal(
    utils.validateCoordinates(null),
    "Track geometry must contain at least two points."
  );
  assert.equal(
    utils.validateCoordinates([[0, 0]]),
    "Track geometry must contain at least two points."
  );
  assert.equal(
    utils.validateCoordinates([[0, 0], [Number.POSITIVE_INFINITY, 2]]),
    "Track geometry contains an invalid coordinate."
  );
  assert.equal(
    utils.validateCoordinates([[0, 0], [0.05, 0.05], [2, 0]]),
    "Track geometry contains a zero-length segment."
  );
  assert.equal(utils.validateCoordinates([[0, 0], [5, 0], [5, 8]]), "");
});

test("projects a point onto the closest segment and splits at that projection", () => {
  const coordinates = [[0, 0], [10, 0], [10, 10]];
  const projection = utils.projectPointToPolyline([6, 2], coordinates);

  assert.equal(projection.segmentIndex, 0);
  assert.deepEqual(plain(projection.point), [6, 0]);
  approximately(projection.t, 0.6);
  approximately(projection.distance, 2);

  const split = utils.splitCoordinatesAt(coordinates, projection);
  assert.deepEqual(plain(split), {
    left: [[0, 0], [6, 0]],
    right: [[6, 0], [10, 0], [10, 10]]
  });
  assert.equal(utils.validateCoordinates(split.left), "");
  assert.equal(utils.validateCoordinates(split.right), "");
  assert.deepEqual(coordinates, [[0, 0], [10, 0], [10, 10]], "the input must remain unchanged");

  const verticalProjection = utils.projectPointToPolyline([13, 6], coordinates);
  assert.equal(verticalProjection.segmentIndex, 1);
  assert.deepEqual(plain(verticalProjection.point), [10, 6]);
  assert.equal(utils.splitCoordinatesAt(coordinates, null), null);
  assert.equal(
    utils.splitCoordinatesAt(coordinates, utils.projectPointToPolyline([-5, 0], coordinates)),
    null,
    "a clamped endpoint cannot produce two valid tracks"
  );
});

test("finds the nearest endpoints and merges tracks in join order", () => {
  const first = { geometry: { coordinates: [[10, 0], [0, 0]] } };
  const second = { geometry: { coordinates: [[20, 0], [10, 0]] } };
  const pair = utils.nearestEndpointPair(first, second);

  assert.equal(pair.aIndex, 0);
  assert.equal(pair.bIndex, 1);
  assert.deepEqual(plain(pair.a), [10, 0]);
  assert.deepEqual(plain(pair.b), [10, 0]);

  const merged = utils.mergeTrackCoordinates(first, second, pair);
  assert.deepEqual(plain(merged), [[0, 0], [10, 0], [20, 0]]);
  assert.equal(utils.validateCoordinates(merged), "");
  assert.deepEqual(plain(first.geometry.coordinates), [[10, 0], [0, 0]]);
  assert.deepEqual(plain(second.geometry.coordinates), [[20, 0], [10, 0]]);

  const separated = { geometry: { coordinates: [[12, 0], [20, 0]] } };
  const separatedPair = utils.nearestEndpointPair(
    { geometry: { coordinates: [[0, 0], [10, 0]] } },
    separated
  );
  assert.equal(separatedPair.aIndex, 1);
  assert.equal(separatedPair.bIndex, 0);
  assert.deepEqual(
    plain(utils.mergeTrackCoordinates(
      { geometry: { coordinates: [[0, 0], [10, 0]] } },
      separated,
      separatedPair
    )),
    [[0, 0], [10, 0], [12, 0], [20, 0]],
    "a non-coincident join retains both endpoints as an explicit connecting segment"
  );
});

test("builds independent, audit-ready documents with immutable source snapshots", () => {
  const document = utils.buildInitialDocument();
  const independentDocument = utils.buildInitialDocument();
  const track = document.tracks.find((item) => item.id === "TRK-001");
  const independentTrack = independentDocument.tracks.find((item) => item.id === "TRK-001");
  const originalMockTrack = data.TRACKS.find((item) => item.id === "TRK-001");
  const previousValue = plain(track);

  track.geometry.coordinates[0][0] = 61;
  track.status = "MODIFIED";
  track.version += 1;

  assert.equal(track.originalGeometry.coordinates[0][0], 60);
  assert.equal(independentTrack.geometry.coordinates[0][0], 60);
  assert.equal(originalMockTrack.segmentIds[0], "SEG-101");
  assert.equal(track.version, 2);
  assert.equal(track.parentTrackId, null);
  assert.deepEqual(plain(track.mergedAssetIds), []);

  const auditEntry = {
    assetId: track.id,
    assetType: "TRACK",
    action: "TRACK_GEOMETRY_UPDATED",
    previousValue,
    newValue: plain(track),
    userId: "test-user",
    timestamp: "2026-08-11T00:00:00.000Z",
    source: track.source
  };
  document.audit.push(auditEntry);

  assert.equal(document.audit.length, 1);
  assert.deepEqual(Object.keys(document.audit[0]).sort(), [
    "action",
    "assetId",
    "assetType",
    "newValue",
    "previousValue",
    "source",
    "timestamp",
    "userId"
  ]);
  assert.equal(document.audit[0].previousValue.geometry.coordinates[0][0], 60);
  assert.equal(document.audit[0].newValue.geometry.coordinates[0][0], 61);
  assert.equal(independentDocument.audit.length, 0);
  assert.equal(independentDocument.archive.length, 0);
  assert.equal(independentDocument.topology.length, document.topology.length);
  assert.ok(independentDocument.topology.length > 0);
});
