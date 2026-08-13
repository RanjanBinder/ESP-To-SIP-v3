// Embedded PIM track-correction workspace.
//
// This module intentionally exports a workspace component rather than a page.
// Station Hub mounts it inside the existing Review Assets step so the shared
// breadcrumb, asset stepper and category navigation remain in control.

(() => {
  const { useCallback, useEffect, useMemo, useRef, useState } = React;
  const D = window.PIM_TRACKS_MOCK;

  if (!D) return;

  const SCHEMA_VERSION = 2;
  const FIT_VIEW = { x: 0, y: 60, w: 1600, h: 700 };
  const TRACK_TYPES = [
    ["MAIN_LINE", "Main Line"],
    ["LOOP_LINE", "Loop Line"],
    ["SIDING", "Siding"],
    ["OTHER", "Other"],
  ];
  const DIRECTIONS = [
    ["UP", "UP"],
    ["DN", "DN"],
    ["BIDIRECTIONAL", "Bidirectional"],
    ["NA", "Not Applicable"],
  ];
  const FILTERS = [
    ["ALL", "All"],
    ["NEEDS_REVIEW", "Needs Review"],
    ["MODIFIED", "Modified"],
    ["MANUALLY_ADDED", "Manually Added"],
    ["VERIFIED", "Verified"],
    ["REJECTED", "Rejected"],
  ];
  const REJECTION_REASONS = [
    "Incorrect Extraction",
    "Duplicate Track",
    "Not a Railway Track",
    "Other",
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const unique = (items) => Array.from(new Set((items || []).filter(Boolean)));
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const samePoint = (a, b, tolerance = 0.1) => distance(a, b) <= tolerance;
  const finitePoint = (point) => Array.isArray(point) && point.length >= 2 && Number.isFinite(point[0]) && Number.isFinite(point[1]);
  const nextTrackId = (tracks) => {
    const max = tracks.reduce((value, track) => {
      const match = String(track.id || "").match(/^TRK[-_]?(\d+)$/i);
      return Math.max(value, match ? Number(match[1]) : 0);
    }, 0);
    return `TRK-${String(max + 1).padStart(3, "0")}`;
  };
  const stationBaseChainage = (station) => {
    const candidate = station?.cll ?? station?.yardLimitStart ?? D.STATION?.yardLimitStart ?? 431.24;
    const parsed = Number.parseFloat(String(candidate).replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 431.24;
  };
  const chainageAt = (x, station = D.STATION) => (stationBaseChainage(station) + (x - 60) / 1000).toFixed(3);
  const rebaseChainage = (value, station) => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return value || "";
    return (stationBaseChainage(station) + parsed - stationBaseChainage(D.STATION)).toFixed(3);
  };
  const formatSource = (source) => ({
    AI_EXTRACTION: "AI Extracted",
    MANUAL: "Manual",
    MANUAL_MAPPING: "Manual Mapping",
  })[source] || source;
  const typeCode = (label) => {
    if (label === "Main Line") return "MAIN_LINE";
    if (label === "Loop Line") return "LOOP_LINE";
    if (String(label).includes("Siding")) return "SIDING";
    return "OTHER";
  };
  const directionCode = (label) => {
    if (label === "UP") return "UP";
    if (label === "DOWN" || label === "DN") return "DN";
    if (label === "Bidirectional") return "BIDIRECTIONAL";
    return "NA";
  };
  const statusLabel = (status) => ({
    EXTRACTED: "Extracted",
    NEEDS_REVIEW: "Needs Review",
    MODIFIED: "Modified",
    MANUALLY_ADDED: "Manually Added",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  })[status] || status;

  const sanitiseCoordinates = (coordinates) => {
    const next = [];
    (coordinates || []).forEach((point) => {
      if (!finitePoint(point)) return;
      const clean = [Number(point[0]), Number(point[1])];
      if (!next.length || !samePoint(next[next.length - 1], clean)) next.push(clean);
    });
    return next;
  };

  const validateCoordinates = (coordinates) => {
    if (!Array.isArray(coordinates) || coordinates.length < 2) return "Track geometry must contain at least two points.";
    if (coordinates.some((point) => !finitePoint(point))) return "Track geometry contains an invalid coordinate.";
    for (let index = 1; index < coordinates.length; index += 1) {
      if (distance(coordinates[index - 1], coordinates[index]) < 0.1) return "Track geometry contains a zero-length segment.";
    }
    return "";
  };

  const lineLength = (coordinates) => (coordinates || []).reduce((total, point, index) => (
    index ? total + distance(coordinates[index - 1], point) : total
  ), 0);

  const coordinatesForSegment = (segment) => {
    if (!segment) return [];
    const values = String(segment.d || "").match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number) || [];
    if (segment.geometryType === "Arc" && values.length >= 8) {
      const [x0, y0, x1, y1, x2, y2, x3, y3] = values;
      return Array.from({ length: 9 }, (_, index) => {
        const t = index / 8;
        const u = 1 - t;
        return [
          u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
          u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3,
        ];
      });
    }
    return sanitiseCoordinates([segment.start, segment.end]);
  };

  const combinePaths = (paths) => {
    const pool = (paths || []).map((path) => sanitiseCoordinates(path)).filter((path) => path.length >= 2);
    if (!pool.length) return [];
    const output = pool.shift().slice();
    while (pool.length) {
      const head = output[0];
      const tail = output[output.length - 1];
      let best = null;
      pool.forEach((path, index) => {
        const candidates = [
          { index, where: "tail", reverse: false, gap: distance(tail, path[0]) },
          { index, where: "tail", reverse: true, gap: distance(tail, path[path.length - 1]) },
          { index, where: "head", reverse: false, gap: distance(head, path[path.length - 1]) },
          { index, where: "head", reverse: true, gap: distance(head, path[0]) },
        ];
        candidates.forEach((candidate) => {
          if (!best || candidate.gap < best.gap) best = candidate;
        });
      });
      let path = pool.splice(best.index, 1)[0];
      if (best.reverse) path = path.slice().reverse();
      if (best.where === "tail") {
        if (samePoint(output[output.length - 1], path[0])) path = path.slice(1);
        output.push(...path);
      } else {
        if (samePoint(path[path.length - 1], output[0])) path = path.slice(0, -1);
        output.unshift(...path);
      }
    }
    return sanitiseCoordinates(output);
  };

  const coordinatesForTrack = (track) => {
    const paths = (track.segmentIds || []).map((segmentId) => {
      const segment = D.SEGMENTS.find((item) => item.id === segmentId);
      return coordinatesForSegment(segment);
    });
    return combinePaths(paths);
  };

  const issueCodesForTrack = (track) => {
    const issues = [];
    if ((track.confidenceScore || 0) < 75) issues.push("LOW_CONFIDENCE");
    if (!track.endNodeId && !track.deadEnd) issues.push("DISCONNECTED");
    if (track.review) issues.push("MANUAL_REVIEW_REQUIRED");
    if ((track.review?.issues || []).some((issue) => /geometry|branch/i.test(issue))) issues.push("GEOMETRY_MISMATCH");
    return unique(issues);
  };

  const normaliseTrack = (track, station = D.STATION) => ({
    id: track.id,
    name: track.name || "",
    trackType: typeCode(track.trackType),
    direction: directionCode(track.trafficDirection),
    geometry: { type: "LineString", coordinates: coordinatesForTrack(track) },
    originalGeometry: { type: "LineString", coordinates: coordinatesForTrack(track) },
    startChainage: rebaseChainage(track.startChainage, station),
    endChainage: rebaseChainage(track.endChainage, station),
    connectedAssetIds: unique([...(track.connectedTracks || []), ...(track.connectedTurnouts || [])]),
    deadEnd: !!track.deadEnd,
    bufferStop: !!track.bufferStop,
    source: track.sourceType === "User Created" ? "MANUAL" : track.sourceType === "User Corrected" ? "MANUAL_MAPPING" : "AI_EXTRACTION",
    sourceGeometryIds: (track.segmentIds || []).slice(),
    confidence: track.confidenceScore,
    status: track.validationStatus === "Needs Review" || track.review ? "NEEDS_REVIEW" : "EXTRACTED",
    issues: issueCodesForTrack(track),
    rejectionReason: "",
    rejectedBy: "",
    rejectedAt: "",
    version: 1,
    parentTrackId: null,
    mergedAssetIds: [],
  });

  const buildInitialTopology = (tracks) => {
    const topology = [];
    const byId = new Map(tracks.map((track) => [track.id, track]));
    const seenTrackPairs = new Set();
    D.TRACKS.forEach((source) => {
      const track = byId.get(source.id);
      if (!track) return;
      if (source.startNodeId) topology.push({ id: `TOP-NODE-${track.id}-START`, sourceAssetId: track.id, sourceEndpointRole: "START", destinationAssetId: source.startNodeId, destinationEndpointRole: null, relationship: "TERMINATES_AT_NODE" });
      if (source.endNodeId) topology.push({ id: `TOP-NODE-${track.id}-END`, sourceAssetId: track.id, sourceEndpointRole: "END", destinationAssetId: source.endNodeId, destinationEndpointRole: null, relationship: "TERMINATES_AT_NODE" });
      (source.connectedTracks || []).forEach((destinationId) => {
        const destination = byId.get(destinationId);
        const pairKey = [track.id, destinationId].sort().join(":");
        if (!destination || seenTrackPairs.has(pairKey)) return;
        seenTrackPairs.add(pairKey);
        topology.push({ id: `TOP-SOURCE-${pairKey}`, sourceAssetId: track.id, sourceEndpointRole: null, destinationAssetId: destination.id, destinationEndpointRole: null, relationship: "NETWORK_ADJACENT" });
      });
      (source.connectedTurnouts || []).forEach((turnoutId) => {
        const turnout = D.TURNOUTS.find((item) => item.id === turnoutId);
        if (!turnout) return;
        const point = [turnout.x, turnout.y];
        const projection = projectPointToPolyline(point, track.geometry.coordinates);
        topology.push({ id: `TOP-SOURCE-${track.id}-${turnout.id}`, sourceAssetId: track.id, sourceEndpointRole: null, sourceSegmentIndex: projection?.segmentIndex ?? null, connectionPoint: projection?.point || point, destinationAssetId: turnout.id, destinationEndpointRole: null, relationship: "CONNECTED_AT" });
      });
      if (source.bufferStop && D.BUFFER_STOPS.length) {
        const coordinates = track.geometry.coordinates;
        const candidates = D.BUFFER_STOPS.flatMap((buffer) => [0, coordinates.length - 1].map((endpointIndex) => ({ buffer, endpointIndex, gap: distance([buffer.x, buffer.y], coordinates[endpointIndex]) })));
        const nearest = candidates.sort((one, two) => one.gap - two.gap)[0];
        topology.push({ id: `TOP-SOURCE-${track.id}-${nearest.buffer.id}`, sourceAssetId: track.id, sourceEndpointRole: nearest.endpointIndex === 0 ? "START" : "END", destinationAssetId: nearest.buffer.id, destinationEndpointRole: null, relationship: "TERMINATES_AT" });
      }
    });
    return topology;
  };

  const buildInitialDocument = (station = D.STATION, sourceDocument = null) => {
    const tracks = D.TRACKS.map((track) => normaliseTrack(track, station));
    const topology = buildInitialTopology(tracks);
    tracks.forEach((track) => {
      const relationIds = topology.flatMap((relation) => relation.sourceAssetId === track.id ? [relation.destinationAssetId] : relation.destinationAssetId === track.id ? [relation.sourceAssetId] : []);
      track.connectedAssetIds = unique([...track.connectedAssetIds, ...relationIds]);
    });
    return {
      schemaVersion: SCHEMA_VERSION,
      station: {
        code: station?.code || D.STATION?.code || "STATION",
        name: station?.name || D.STATION?.name || "Station",
        baseChainage: stationBaseChainage(station),
      },
      sourceDocument: {
        id: sourceDocument?.id || D.DOCUMENT?.id || "esp-source",
        fileName: sourceDocument?.fileName || D.DOCUMENT?.fileName || "ESP source",
        previewImage: sourceDocument?.previewImage || "assets/track-esp.png",
      },
      tracks,
      unmapped: D.ELEMENT_GROUPS.map((group) => ({
      id: group.id,
      label: group.label,
      sourceElementIds: group.elementIds.slice(),
      paths: group.elementIds.map((elementId) => {
        const segment = D.SEGMENTS.find((item) => item.id === elementId);
        return coordinatesForSegment(segment);
      }).filter((path) => path.length >= 2),
      aiConfidence: group.aiConfidence,
      sourceLayer: D.SEGMENTS.find((item) => group.elementIds.includes(item.id))?.sourceLayer || "0-UNCLASSIFIED",
      suggestedAction: group.suggestedAction || "",
      suggestedReason: group.suggestedReason || "",
      suggestionReason: group.suggestionReason || "",
      status: "UNMAPPED",
      })),
      topology,
      archive: [],
      audit: [],
    };
  };

  const sourceIdentityFor = (sourceDocument) => String(sourceDocument?.id || sourceDocument?.fileName || D.DOCUMENT?.id || "esp-source");
  const storageKeyFor = (station, sourceDocument) => `pim-track-correction:${encodeURIComponent(station?.code || "station")}:${encodeURIComponent(sourceIdentityFor(sourceDocument))}:v${SCHEMA_VERSION}`;
  const isReviewDocument = (value) => value?.schemaVersion === SCHEMA_VERSION
    && Array.isArray(value.tracks)
    && value.tracks.every((track) => track?.id && track.geometry?.type === "LineString" && !validateCoordinates(track.geometry.coordinates))
    && Array.isArray(value.unmapped)
    && Array.isArray(value.topology)
    && Array.isArray(value.archive)
    && Array.isArray(value.audit);
  const documentMatchesContext = (value, station, sourceDocument) => {
    if (station?.code && value?.station?.code && value.station.code !== station.code) return false;
    if (sourceDocument && sourceIdentityFor(value?.sourceDocument) !== sourceIdentityFor(sourceDocument)) return false;
    return true;
  };
  const hydrateReviewDocument = (value, station, sourceDocument) => {
    const hydrated = clone(value);
    hydrated.station = {
      code: station?.code || hydrated.station?.code || D.STATION?.code || "STATION",
      name: station?.name || hydrated.station?.name || D.STATION?.name || "Station",
      baseChainage: Number.isFinite(hydrated.station?.baseChainage) ? hydrated.station.baseChainage : stationBaseChainage(station),
    };
    hydrated.sourceDocument = {
      id: sourceDocument?.id || hydrated.sourceDocument?.id || D.DOCUMENT?.id || "esp-source",
      fileName: sourceDocument?.fileName || hydrated.sourceDocument?.fileName || D.DOCUMENT?.fileName || "ESP source",
      previewImage: sourceDocument?.previewImage || hydrated.sourceDocument?.previewImage || "assets/track-esp.png",
    };
    hydrated.tracks = hydrated.tracks.map((track) => {
      const geometry = { type: "LineString", coordinates: sanitiseCoordinates(track.geometry.coordinates) };
      const originalGeometry = track.originalGeometry?.type === "LineString" && !validateCoordinates(track.originalGeometry.coordinates)
        ? { type: "LineString", coordinates: clone(track.originalGeometry.coordinates) }
        : clone(geometry);
      return {
        ...track,
        name: typeof track.name === "string" ? track.name : "",
        trackType: TRACK_TYPES.some(([code]) => code === track.trackType) ? track.trackType : "OTHER",
        direction: DIRECTIONS.some(([code]) => code === track.direction) ? track.direction : "NA",
        geometry,
        originalGeometry,
        startChainage: track.startChainage ?? chainageAt(geometry.coordinates[0][0], station),
        endChainage: track.endChainage ?? chainageAt(geometry.coordinates[geometry.coordinates.length - 1][0], station),
        connectedAssetIds: unique(track.connectedAssetIds || []),
        deadEnd: !!track.deadEnd,
        bufferStop: !!track.bufferStop,
        source: ["AI_EXTRACTION", "MANUAL", "MANUAL_MAPPING"].includes(track.source) ? track.source : "AI_EXTRACTION",
        sourceGeometryIds: Array.isArray(track.sourceGeometryIds) ? track.sourceGeometryIds.slice() : [],
        confidence: Number.isFinite(track.confidence) ? track.confidence : null,
        status: ["EXTRACTED", "NEEDS_REVIEW", "MODIFIED", "MANUALLY_ADDED", "VERIFIED", "REJECTED"].includes(track.status) ? track.status : "NEEDS_REVIEW",
        issues: unique(track.issues || []),
        rejectionReason: typeof track.rejectionReason === "string" ? track.rejectionReason : "",
        rejectedBy: typeof track.rejectedBy === "string" ? track.rejectedBy : "",
        rejectedAt: typeof track.rejectedAt === "string" ? track.rejectedAt : "",
        version: Number.isFinite(track.version) && track.version > 0 ? track.version : 1,
        parentTrackId: typeof track.parentTrackId === "string" ? track.parentTrackId : null,
        mergedAssetIds: unique(track.mergedAssetIds || []),
      };
    });
    hydrated.unmapped = hydrated.unmapped.map((geometry, index) => {
      const item = geometry || {};
      return {
        ...item,
        id: item.id || `UNMAPPED-${index + 1}`,
        label: item.label || item.id || `Unmapped geometry ${index + 1}`,
        sourceElementIds: Array.isArray(item.sourceElementIds) ? item.sourceElementIds.slice() : [],
        paths: Array.isArray(item.paths) ? item.paths.map((path) => sanitiseCoordinates(path)).filter((path) => path.length >= 2) : [],
        status: typeof item.status === "string" ? item.status : "UNMAPPED",
      };
    });
    hydrated.topology = hydrated.topology.filter((relation) => relation?.sourceAssetId && relation?.destinationAssetId);
    return hydrated;
  };
  const loadDocument = (station, suppliedDocument = null, sourceDocument = null) => {
    if (isReviewDocument(suppliedDocument) && documentMatchesContext(suppliedDocument, station, sourceDocument)) return hydrateReviewDocument(suppliedDocument, station, sourceDocument);
    try {
      const raw = window.localStorage.getItem(storageKeyFor(station, sourceDocument));
      const saved = raw ? JSON.parse(raw) : null;
      if (isReviewDocument(saved) && documentMatchesContext(saved, station, sourceDocument)) return hydrateReviewDocument(saved, station, sourceDocument);
    } catch (error) {
      // Local storage may be disabled; the in-memory history remains functional.
    }
    return buildInitialDocument(station, sourceDocument);
  };

  const boundsForCoordinates = (coordinates) => {
    const points = (coordinates || []).filter(finitePoint);
    if (!points.length) return FIT_VIEW;
    const xs = points.map((point) => point[0]);
    const ys = points.map((point) => point[1]);
    return {
      x1: Math.min(...xs), y1: Math.min(...ys),
      x2: Math.max(...xs), y2: Math.max(...ys),
    };
  };

  const projectPointToSegment = (point, start, end) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared ? Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared)) : 0;
    const projected = [start[0] + t * dx, start[1] + t * dy];
    return { point: projected, t, distance: distance(point, projected) };
  };

  const projectPointToPolyline = (point, coordinates) => {
    let best = null;
    for (let index = 0; index < coordinates.length - 1; index += 1) {
      const candidate = projectPointToSegment(point, coordinates[index], coordinates[index + 1]);
      if (!best || candidate.distance < best.distance) best = { ...candidate, segmentIndex: index };
    }
    return best;
  };

  const splitCoordinatesAt = (coordinates, projection) => {
    if (!projection) return null;
    const left = sanitiseCoordinates([
      ...coordinates.slice(0, projection.segmentIndex + 1),
      projection.point,
    ]);
    const right = sanitiseCoordinates([
      projection.point,
      ...coordinates.slice(projection.segmentIndex + 1),
    ]);
    if (left.length < 2 || right.length < 2) return null;
    return { left, right };
  };

  const nearestEndpointPair = (first, second) => {
    const a = first.geometry.coordinates;
    const b = second.geometry.coordinates;
    const pairs = [
      { aIndex: 0, bIndex: 0, a: a[0], b: b[0] },
      { aIndex: 0, bIndex: b.length - 1, a: a[0], b: b[b.length - 1] },
      { aIndex: a.length - 1, bIndex: 0, a: a[a.length - 1], b: b[0] },
      { aIndex: a.length - 1, bIndex: b.length - 1, a: a[a.length - 1], b: b[b.length - 1] },
    ];
    return pairs.sort((one, two) => distance(one.a, one.b) - distance(two.a, two.b))[0];
  };

  const mergeTrackCoordinates = (first, second, pair) => {
    let a = first.geometry.coordinates.slice();
    let b = second.geometry.coordinates.slice();
    if (pair.aIndex === 0) a = a.reverse();
    if (pair.bIndex === b.length - 1) b = b.reverse();
    if (samePoint(a[a.length - 1], b[0])) b = b.slice(1);
    return sanitiseCoordinates([...a, ...b]);
  };

  const lineIntersection = (a, b, c, d) => {
    const denominator = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]);
    if (Math.abs(denominator) < 1e-8) return null;
    const x = ((a[0] * b[1] - a[1] * b[0]) * (c[0] - d[0]) - (a[0] - b[0]) * (c[0] * d[1] - c[1] * d[0])) / denominator;
    const y = ((a[0] * b[1] - a[1] * b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] * d[1] - c[1] * d[0])) / denominator;
    const inside = (point, one, two) => point[0] >= Math.min(one[0], two[0]) - 0.1 && point[0] <= Math.max(one[0], two[0]) + 0.1 && point[1] >= Math.min(one[1], two[1]) - 0.1 && point[1] <= Math.max(one[1], two[1]) + 0.1;
    const point = [x, y];
    return inside(point, a, b) && inside(point, c, d) ? point : null;
  };

  const buildSnapTargets = (tracks) => {
    const targets = [];
    tracks.filter((track) => track.status !== "REJECTED").forEach((track) => {
      track.geometry.coordinates.forEach((point, index, coordinates) => {
        targets.push({
          id: `${track.id}:${index}`,
          assetId: track.id,
          type: index === 0 || index === coordinates.length - 1 ? "TRACK_ENDPOINT" : "TRACK_CONTROL_POINT",
          point,
          label: `${track.name || track.id} ${index === 0 ? "start" : index === coordinates.length - 1 ? "end" : "control point"}`,
          endpointIndex: index === 0 ? 0 : index === coordinates.length - 1 ? coordinates.length - 1 : null,
        });
      });
    });
    D.TURNOUTS.forEach((turnout) => targets.push({
      id: turnout.id,
      assetId: turnout.id,
      type: "TURNOUT",
      point: [turnout.x, turnout.y],
      label: `Turnout ${turnout.id}`,
    }));
    const segments = tracks.filter((track) => track.status !== "REJECTED").flatMap((track) => (
      track.geometry.coordinates.slice(0, -1).map((point, index) => ({ trackId: track.id, a: point, b: track.geometry.coordinates[index + 1] }))
    ));
    segments.forEach((first, firstIndex) => {
      segments.slice(firstIndex + 1).forEach((second) => {
        if (first.trackId === second.trackId) return;
        const point = lineIntersection(first.a, first.b, second.a, second.b);
        if (point) targets.push({
          id: `intersection:${first.trackId}:${second.trackId}:${Math.round(point[0])}:${Math.round(point[1])}`,
          assetId: second.trackId,
          type: "TRACK_INTERSECTION",
          point,
          label: `${first.trackId} / ${second.trackId} intersection`,
        });
      });
    });
    return targets;
  };

  const endpointRoleForIndex = (track, endpointIndex) => endpointIndex === 0 ? "START" : endpointIndex === track.geometry.coordinates.length - 1 ? "END" : null;
  const relationTouchesEndpoint = (relation, side, assetId, endpointIndex, endpointRole) => {
    const assetKey = side === "source" ? "sourceAssetId" : "destinationAssetId";
    const indexKey = side === "source" ? "sourceEndpointIndex" : "destinationEndpointIndex";
    const roleKey = side === "source" ? "sourceEndpointRole" : "destinationEndpointRole";
    if (relation[assetKey] !== assetId) return false;
    return endpointRole ? relation[roleKey] === endpointRole || (relation[roleKey] == null && relation[indexKey] === endpointIndex) : relation[indexKey] === endpointIndex;
  };

  const detachEndpointTopology = (document, assetId, endpointIndex) => {
    const track = document.tracks.find((item) => item.id === assetId);
    const endpointRole = track ? endpointRoleForIndex(track, endpointIndex) : null;
    const touches = (relation) => (
      relationTouchesEndpoint(relation, "source", assetId, endpointIndex, endpointRole)
      || relationTouchesEndpoint(relation, "destination", assetId, endpointIndex, endpointRole)
    );
    const detachedIds = unique(document.topology.filter(touches).map((relation) => (
      relation.sourceAssetId === assetId ? relation.destinationAssetId : relation.sourceAssetId
    )));
    document.topology = document.topology.filter((relation) => !touches(relation));
    const source = document.tracks.find((track) => track.id === assetId);
    if (source) source.connectedAssetIds = source.connectedAssetIds.filter((id) => !detachedIds.includes(id));
    document.tracks.forEach((track) => {
      if (detachedIds.includes(track.id)) track.connectedAssetIds = track.connectedAssetIds.filter((id) => id !== assetId);
    });
    return detachedIds;
  };

  const refreshConnectivity = (document, assetIds = null) => {
    const touched = assetIds ? new Set(assetIds) : null;
    document.tracks.forEach((track) => {
      if (track.status === "REJECTED" || (touched && !touched.has(track.id))) return;
      const lastIndex = track.geometry.coordinates.length - 1;
      const hasEndpointRelation = (endpointIndex) => {
        const role = endpointRoleForIndex(track, endpointIndex);
        return document.topology.some((relation) => relationTouchesEndpoint(relation, "source", track.id, endpointIndex, role) || relationTouchesEndpoint(relation, "destination", track.id, endpointIndex, role));
      };
      const missing = !hasEndpointRelation(0) || !hasEndpointRelation(lastIndex);
      const previouslyMissing = track.issues.some((issue) => ["DISCONNECTED", "MISSING_CONNECTION"].includes(issue));
      track.issues = track.issues.filter((issue) => !["DISCONNECTED", "MISSING_CONNECTION"].includes(issue));
      if (missing) track.issues = unique([...track.issues, "MISSING_CONNECTION"]);
      if (missing !== previouslyMissing && track.status === "VERIFIED") {
        track.status = "MODIFIED";
        track.version = (track.version || 1) + 1;
      }
    });
  };

  const syncConnectedAssetIds = (document) => {
    document.tracks.forEach((track) => {
      track.connectedAssetIds = unique(document.topology.flatMap((relation) => (
        relation.sourceAssetId === track.id ? [relation.destinationAssetId]
          : relation.destinationAssetId === track.id ? [relation.sourceAssetId]
            : []
      )));
    });
  };

  const ptcCSS = `
.sh-esp-scroll[data-track-correction="true"] { container-type:inline-size; overflow:hidden; min-height:0; padding-bottom:16px; }
.sh-esp-scroll[data-track-correction="true"] > .ptc-shell { flex:1 1 auto; height:auto; min-height:0; margin-top:0; }
.ptc-shell { height:clamp(560px,calc(100vh - 230px),780px); min-height:560px; margin-top:12px; display:grid; grid-template-columns:minmax(0,1fr) clamp(360px,30%,430px); grid-template-rows:minmax(0,1fr) auto; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; box-shadow:var(--shadow-xs); }
.ptc-canvas-col { min-width:0; min-height:0; display:flex; flex-direction:column; border-right:var(--hairline); background:var(--canvas); overflow:hidden; }
.ptc-preview-head { min-height:54px; flex:0 0 auto; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; border-bottom:var(--hairline); background:var(--paper); }
.ptc-head-copy { min-width:0; display:grid; gap:2px; }
.ptc-title { display:flex; align-items:center; gap:7px; color:var(--ink-900); font-size:14px; font-weight:800; }
.ptc-subtitle { color:var(--ink-500); font-size:11.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ptc-head-actions { display:flex; align-items:center; justify-content:flex-end; gap:6px; flex-wrap:wrap; }
.ptc-header-btn { min-height:30px; display:inline-flex; align-items:center; justify-content:center; gap:5px; padding:0 9px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-700); font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; }
.ptc-header-btn:hover { background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.ptc-header-btn[data-active="true"] { border-color:var(--accent); background:var(--accent-soft); color:var(--accent-text); }
.ptc-asset-count { min-height:28px; display:inline-flex; align-items:center; padding:0 9px; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-700); font-size:11px; font-weight:800; font-variant-numeric:tabular-nums; }
.ptc-stage { position:relative; flex:1; min-height:0; overflow:hidden; background:#fbfbf8; }
.ptc-svg { display:block; width:100%; height:100%; touch-action:none; user-select:none; }
.ptc-svg[data-mode="PAN"] { cursor:grab; }
.ptc-svg[data-mode="PAN"][data-dragging="true"] { cursor:grabbing; }
.ptc-svg[data-mode="DRAW"],.ptc-svg[data-mode="MAP"],.ptc-svg[data-mode="EXTEND"],.ptc-svg[data-mode="TRIM"],.ptc-svg[data-mode="SPLIT"],.ptc-svg[data-mode="CONNECT"] { cursor:crosshair; }
.ptc-track { fill:none; stroke:#263747; stroke-width:3.2; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; cursor:pointer; }
.ptc-track[data-rejected="true"] { stroke:var(--ink-400); stroke-width:2; stroke-dasharray:5 7; opacity:.52; }
.ptc-track-hit { fill:none; stroke:transparent; stroke-width:18; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; cursor:pointer; }
.ptc-track-hit[data-movable="true"] { cursor:move; }
.ptc-track-halo { fill:none; stroke:var(--accent); stroke-width:11; stroke-opacity:.22; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; pointer-events:none; }
.ptc-track-halo[data-tone="issue"] { stroke:#e48526; stroke-opacity:.28; }
.ptc-selected-line { fill:none; stroke:var(--accent); stroke-width:5.5; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; pointer-events:none; }
.ptc-unmapped { fill:none; stroke:#c17827; stroke-width:2.4; stroke-dasharray:9 6; stroke-linecap:round; vector-effect:non-scaling-stroke; cursor:pointer; }
.ptc-unmapped-hit { fill:none; stroke:transparent; stroke-width:18; vector-effect:non-scaling-stroke; cursor:pointer; }
.ptc-unmapped[data-active="true"] { stroke:var(--accent); stroke-width:4; stroke-dasharray:6 4; }
.ptc-source-label { font-family:var(--font-sans); font-size:var(--ptc-screen-font,11px); font-weight:800; fill:var(--ink-500); letter-spacing:.03em; pointer-events:none; }
.ptc-platform { fill:rgba(203,211,220,.48); stroke:var(--ink-400); stroke-width:1; }
.ptc-structure { fill:rgba(228,232,238,.72); stroke:var(--ink-400); stroke-width:1; stroke-dasharray:4 3; }
.ptc-source-image { opacity:.12; mix-blend-mode:multiply; pointer-events:none; }
.ptc-turnout { fill:var(--paper); stroke:var(--ink-700); stroke-width:1.7; vector-effect:non-scaling-stroke; }
.ptc-turnout[data-target="true"] { fill:var(--accent-soft); stroke:var(--accent); stroke-width:3; cursor:crosshair; }
.ptc-node-hit { fill:transparent; stroke:none; cursor:pointer; }
.ptc-control { fill:var(--paper); stroke:var(--accent); stroke-width:2; vector-effect:non-scaling-stroke; cursor:grab; }
.ptc-control[data-endpoint="true"] { fill:var(--accent); stroke:var(--paper); stroke-width:2.4; }
.ptc-control:hover { r:8; }
.ptc-operation-line { fill:none; stroke:var(--accent); stroke-width:3; stroke-dasharray:8 6; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; pointer-events:none; }
.ptc-operation-line[data-tone="remove"] { stroke:var(--danger); stroke-width:5; stroke-opacity:.65; }
.ptc-operation-line[data-tone="split-a"] { stroke:#6d5cd6; stroke-width:5; stroke-dasharray:none; }
.ptc-operation-line[data-tone="split-b"] { stroke:#1687a7; stroke-width:5; stroke-dasharray:none; }
.ptc-snap-marker { fill:var(--paper); stroke:var(--accent); stroke-width:2.5; vector-effect:non-scaling-stroke; pointer-events:none; }
.ptc-snap-label { font-family:var(--font-sans); font-size:var(--ptc-screen-font,10.5px); font-weight:800; fill:var(--accent-text); paint-order:stroke; stroke:var(--paper); stroke-width:4px; pointer-events:none; }
.ptc-issue-marker { fill:#e48526; stroke:var(--paper); stroke-width:2; vector-effect:non-scaling-stroke; pointer-events:none; }
.ptc-issue-text { fill:var(--paper); font-family:var(--font-sans); font-size:var(--ptc-screen-font,9px); font-weight:900; text-anchor:middle; dominant-baseline:middle; pointer-events:none; }
.ptc-mode-banner { position:absolute; left:12px; top:12px; z-index:10; max-width:360px; display:flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid color-mix(in srgb,var(--accent) 30%,var(--ink-200)); border-radius:var(--r-full); background:rgba(255,255,255,.95); color:var(--accent-text); font-size:11px; font-weight:800; box-shadow:var(--shadow-sm); backdrop-filter:blur(8px); }
.ptc-selection-note { position:absolute; right:12px; top:12px; z-index:10; min-height:29px; display:flex; align-items:center; gap:5px; padding:0 10px; border:var(--hairline); border-radius:var(--r-full); background:rgba(255,255,255,.95); color:var(--ink-700); font-size:11px; font-weight:800; box-shadow:var(--shadow-sm); }
.ptc-toolbar { position:absolute; z-index:20; left:50%; bottom:14px; transform:translateX(-50%); max-width:calc(100% - 24px); display:flex; align-items:center; gap:4px; padding:6px; border:var(--hairline); border-radius:var(--r-lg); background:rgba(255,255,255,.96); box-shadow:var(--shadow-lg); backdrop-filter:blur(10px); overflow:visible; }
.ptc-tool-group { display:inline-flex; align-items:center; gap:2px; flex:0 0 auto; }
.ptc-tool-divider { width:1px; height:24px; flex:0 0 auto; background:var(--ink-200); margin:0 2px; }
.ptc-tool { width:31px; height:30px; flex:0 0 auto; display:grid; place-items:center; border:1px solid transparent; border-radius:var(--r-sm); background:transparent; color:var(--ink-600); cursor:pointer; }
.ptc-tool:hover:not(:disabled) { border-color:var(--ink-200); background:var(--ink-50); color:var(--ink-900); }
.ptc-tool[data-active="true"] { border-color:var(--accent); background:var(--accent); color:var(--paper); }
.ptc-tool:disabled { opacity:.34; cursor:not-allowed; }
.ptc-tool:focus-visible,.ptc-header-btn:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.ptc-add-wrap { position:relative; }
.ptc-add-menu { position:absolute; z-index:80; top:calc(100% + 6px); right:0; width:214px; padding:6px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); box-shadow:var(--shadow-lg); }
.ptc-add-menu[data-toolbar="true"] { top:auto; right:auto; left:50%; bottom:58px; transform:translateX(-50%); }
.ptc-add-title { padding:5px 7px 7px; color:var(--ink-500); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
.ptc-add-option { width:100%; display:flex; align-items:flex-start; gap:8px; padding:8px; border:none; border-radius:var(--r-sm); background:transparent; color:var(--ink-800); font-family:inherit; font-size:11.5px; font-weight:700; text-align:left; cursor:pointer; }
.ptc-add-option:hover { background:var(--ink-50); color:var(--ink-900); }
.ptc-add-option small { display:block; margin-top:2px; color:var(--ink-500); font-size:10px; font-weight:500; line-height:1.35; }
.ptc-operation-confirm { position:absolute; z-index:30; left:50%; bottom:64px; transform:translateX(-50%); max-width:calc(100% - 28px); display:flex; align-items:center; gap:10px; padding:9px 10px 9px 13px; border:var(--hairline); border-radius:var(--r-lg); background:rgba(255,255,255,.98); box-shadow:var(--shadow-lg); }
.ptc-point-menu { position:absolute; z-index:45; min-width:132px; padding:5px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); box-shadow:var(--shadow-lg); }
.ptc-point-menu button { width:100%; display:flex; align-items:center; gap:7px; padding:7px 8px; border:none; border-radius:var(--r-sm); background:transparent; color:var(--danger-text); font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; }
.ptc-point-menu button:hover { background:var(--danger-soft); }
.ptc-operation-copy { min-width:0; display:grid; gap:2px; color:var(--ink-800); font-size:11.5px; font-weight:800; }
.ptc-operation-copy span { color:var(--ink-500); font-size:10.5px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ptc-inline-btn { min-height:29px; display:inline-flex; align-items:center; justify-content:center; gap:5px; padding:0 9px; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); color:var(--ink-700); font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; white-space:nowrap; }
.ptc-inline-btn:hover { background:var(--ink-50); border-color:var(--ink-300); }
.ptc-inline-btn[data-primary="true"] { border-color:var(--accent); background:var(--accent); color:var(--paper); }
.ptc-inline-btn[data-danger="true"] { border-color:color-mix(in srgb,var(--danger) 42%,var(--ink-200)); color:var(--danger-text); }
.ptc-statusbar { min-height:30px; flex:0 0 auto; display:flex; align-items:center; gap:10px; padding:5px 12px; border-top:var(--hairline); background:var(--paper); color:var(--ink-500); font-size:10.5px; }
.ptc-statusbar strong { color:var(--ink-800); font-weight:800; }
.ptc-status-spacer { flex:1; }
.ptc-save-state { display:inline-flex; align-items:center; gap:5px; color:var(--success-text); font-weight:700; }
.ptc-save-state[data-saving="true"] { color:var(--info-text); }
.ptc-save-state[data-error="true"] { color:var(--danger-text); }
.ptc-panel { min-width:0; min-height:0; display:flex; flex-direction:column; background:var(--paper); overflow:hidden; }
.ptc-panel-head { flex:0 0 auto; display:grid; gap:9px; padding:11px 12px; border-bottom:var(--hairline); background:var(--paper); }
.ptc-panel-title-row { display:flex; align-items:center; gap:8px; }
.ptc-panel-title { flex:1; color:var(--ink-900); font-size:15px; font-weight:800; }
.ptc-panel-actions { display:flex; align-items:center; gap:5px; }
.ptc-panel-actions .ptc-header-btn { min-height:28px; padding:0 7px; font-size:10.5px; }
.ptc-filter-row { display:flex; align-items:center; gap:8px; }
.ptc-filter { height:32px; min-width:150px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 30px 0 9px; color:var(--ink-800); font-family:inherit; font-size:11.5px; font-weight:700; outline:none; }
.ptc-filter:focus { border-color:var(--accent); box-shadow:var(--shadow-focus); }
.ptc-filter-summary { color:var(--ink-500); font-size:10.5px; }
.ptc-panel-scroll { flex:1; min-height:0; overflow:auto; overscroll-behavior:contain; padding:10px 12px 14px; display:grid; gap:8px; align-content:start; }
.ptc-empty { display:grid; justify-items:center; gap:6px; padding:36px 16px; color:var(--ink-500); font-size:11.5px; text-align:center; }
.ptc-empty strong { color:var(--ink-800); font-size:12.5px; }
.ptc-map-form { display:grid; gap:9px; padding:11px; border:1px solid color-mix(in srgb,var(--accent) 32%,var(--ink-200)); border-radius:var(--r-md); background:var(--accent-soft); }
.ptc-map-head { display:flex; align-items:flex-start; gap:8px; }
.ptc-map-head-copy { flex:1; min-width:0; display:grid; gap:2px; }
.ptc-map-head-copy strong { color:var(--ink-900); font-size:12px; }
.ptc-map-head-copy span { color:var(--ink-600); font-size:10.5px; }
.ptc-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
.ptc-field { min-width:0; display:grid; gap:4px; }
.ptc-field[data-full="true"] { grid-column:1 / -1; }
.ptc-field label { color:var(--ink-600); font-size:10px; font-weight:700; }
.ptc-field input,.ptc-field select { width:100%; height:32px; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); padding:0 8px; color:var(--ink-900); font-family:inherit; font-size:11.5px; outline:none; }
.ptc-field input:focus,.ptc-field select:focus { border-color:var(--accent); box-shadow:var(--shadow-focus); }
.ptc-form-actions { display:flex; justify-content:flex-end; gap:6px; }
.ptc-card { border:var(--hairline); border-radius:var(--r-md); background:var(--paper); overflow:hidden; transition:border-color 120ms,box-shadow 120ms; }
.ptc-card:hover { border-color:var(--ink-300); box-shadow:var(--shadow-sm); }
.ptc-card[data-active="true"] { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
.ptc-card[data-rejected="true"] { opacity:.72; }
.ptc-card-head { width:100%; display:flex; align-items:flex-start; gap:8px; padding:9px 9px 8px; border:none; background:transparent; color:inherit; font-family:inherit; text-align:left; cursor:pointer; }
.ptc-card-index { width:22px; height:22px; flex:0 0 auto; display:grid; place-items:center; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-600); font-family:var(--font-mono); font-size:9.5px; font-weight:800; }
.ptc-card[data-active="true"] .ptc-card-index { background:var(--accent); color:var(--paper); }
.ptc-card-heading { flex:1; min-width:0; display:grid; gap:3px; }
.ptc-card-name { color:var(--ink-900); font-size:12.5px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ptc-card-meta { display:flex; align-items:center; gap:5px; flex-wrap:wrap; color:var(--ink-500); font-size:10px; }
.ptc-badge { min-height:19px; display:inline-flex; align-items:center; gap:3px; padding:0 6px; border:1px solid transparent; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-600); font-size:9.5px; font-weight:800; white-space:nowrap; }
.ptc-badge[data-status="NEEDS_REVIEW"] { border-color:#ead6b7; background:var(--warning-soft); color:var(--warning-text); }
.ptc-badge[data-status="MODIFIED"],.ptc-badge[data-status="MANUALLY_ADDED"] { border-color:#d7d4f5; background:var(--accent-soft); color:var(--accent-text); }
.ptc-badge[data-status="VERIFIED"] { border-color:#cbe5d7; background:var(--success-soft); color:var(--success-text); }
.ptc-badge[data-status="REJECTED"] { border-color:#ead1ce; background:var(--danger-soft); color:var(--danger-text); }
.ptc-card-tools { display:flex; align-items:center; gap:3px; }
.ptc-card-icon { width:26px; height:26px; display:grid; place-items:center; border:1px solid transparent; border-radius:var(--r-sm); background:transparent; color:var(--ink-500); cursor:pointer; }
.ptc-card-icon:hover { border-color:var(--ink-200); background:var(--ink-50); color:var(--ink-900); }
.ptc-card-body { display:grid; gap:9px; padding:0 10px 10px 40px; border-top:var(--hairline); }
.ptc-card-body .ptc-form-grid { padding-top:9px; }
.ptc-readonly { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1px; border:var(--hairline); border-radius:var(--r-sm); background:var(--ink-200); overflow:hidden; }
.ptc-readonly-item { min-width:0; display:grid; gap:2px; padding:6px 7px; background:var(--ink-50); }
.ptc-readonly-item span { color:var(--ink-500); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; }
.ptc-readonly-item strong { color:var(--ink-800); font-size:10.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ptc-issues { display:flex; flex-wrap:wrap; gap:4px; }
.ptc-issue-chip { min-height:19px; display:inline-flex; align-items:center; padding:0 6px; border-radius:var(--r-full); background:var(--warning-soft); color:var(--warning-text); font-size:9.5px; font-weight:700; }
.ptc-rejection-note { padding:7px 8px; border-radius:var(--r-sm); background:var(--danger-soft); color:var(--danger-text); font-size:10.5px; line-height:1.4; }
.ptc-card-actions { display:flex; align-items:center; gap:6px; padding-top:1px; }
.ptc-card-actions .ptc-inline-btn:last-child { margin-left:auto; }
.ptc-nav { grid-column:1 / -1; min-height:54px; display:flex; align-items:center; justify-content:flex-end; gap:8px; padding:9px 12px; border-top:var(--hairline); background:var(--paper); }
.ptc-nav-context { margin-right:auto; color:var(--ink-500); font-size:10.5px; }
.ptc-toast { position:fixed; z-index:9999; left:50%; bottom:28px; transform:translateX(-50%); max-width:min(520px,calc(100vw - 32px)); display:flex; align-items:center; gap:7px; padding:9px 12px; border:var(--hairline); border-radius:var(--r-lg); background:var(--ink-900); color:var(--paper); font-size:11.5px; font-weight:700; box-shadow:var(--shadow-lg); }
.ptc-toast[data-tone="danger"] { background:var(--danger-text); }
.ptc-dialog-backdrop { position:fixed; z-index:9500; inset:0; display:grid; place-items:center; padding:20px; background:rgba(14,27,44,.38); backdrop-filter:blur(2px); }
.ptc-dialog { width:min(430px,100%); display:grid; gap:12px; padding:15px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); box-shadow:var(--shadow-lg); }
.ptc-dialog-head { display:flex; align-items:flex-start; gap:9px; }
.ptc-dialog-icon { width:32px; height:32px; flex:0 0 auto; display:grid; place-items:center; border-radius:var(--r-md); background:var(--danger-soft); color:var(--danger-text); }
.ptc-dialog-copy { display:grid; gap:3px; }
.ptc-dialog-title { color:var(--ink-900); font-size:14px; font-weight:800; }
.ptc-dialog-sub { color:var(--ink-500); font-size:11px; line-height:1.4; }
.ptc-reasons { display:grid; gap:5px; }
.ptc-reason { display:flex; align-items:center; gap:8px; padding:7px 8px; border:var(--hairline); border-radius:var(--r-sm); color:var(--ink-700); font-size:11.5px; cursor:pointer; }
.ptc-reason:hover { background:var(--ink-50); }
.ptc-dialog-actions { display:flex; justify-content:flex-end; gap:7px; }
@media (max-width:1180px) {
  .ptc-shell { grid-template-columns:minmax(0,1fr) 370px; }
  .ptc-head-actions .ptc-header-btn span { display:none; }
}
@container (max-width:900px) {
  .ptc-shell { height:auto; min-height:920px; grid-template-columns:1fr; grid-template-rows:560px 360px auto; }
  .ptc-canvas-col { border-right:none; border-bottom:var(--hairline); }
  .ptc-panel { grid-row:2; }
  .ptc-nav { grid-row:3; }
}
@container (max-width:650px) {
  .ptc-toolbar { max-width:none; transform:translateX(-50%) scale(.86); transform-origin:bottom center; }
}
@media (max-width:1100px) {
  .sh-esp-scroll[data-track-correction="true"] { overflow:auto; }
  .ptc-shell { height:auto; min-height:920px; grid-template-columns:1fr; grid-template-rows:560px 360px auto; }
  .ptc-canvas-col { border-right:none; border-bottom:var(--hairline); }
  .ptc-panel { grid-row:2; }
  .ptc-nav { grid-row:3; }
}
@media (prefers-reduced-motion:reduce) {
  .ptc-card,.ptc-track { transition:none; }
}
`;

  const ToolButton = ({ icon, label, active, disabled, onClick }) => (
    <button
      type="button"
      className="ptc-tool"
      data-active={active ? "true" : "false"}
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : !!active}
    >
      <Icon name={icon} size={15} />
    </button>
  );

  const AddTrackMenu = ({ toolbar, onDraw, onMap }) => (
    <div className="ptc-add-menu" data-toolbar={toolbar ? "true" : "false"} role="menu" aria-label="Add Track">
      <div className="ptc-add-title">Add Track</div>
      <button type="button" className="ptc-add-option" role="menuitem" onClick={onDraw}>
        <Icon name="edit" size={15} />
        <span>Draw Missing Track<small>Click points on the ESP and double-click to finish.</small></span>
      </button>
      <button type="button" className="ptc-add-option" role="menuitem" onClick={onMap}>
        <Icon name="target" size={15} />
        <span>Map Existing Geometry<small>Select an unidentified source line or polyline.</small></span>
      </button>
    </div>
  );

  const TrackToolbar = ({
    mode, selectedCount, snapEnabled, canUndo, canRedo, addOpen,
    onMode, onZoomIn, onZoomOut, onFit, onAddToggle, onDraw, onMap,
    onEdit, onExtend, onTrim, onJoin, onSplit, onConnect, onSnap,
    onReject, onUndo, onRedo,
  }) => {
    const one = selectedCount === 1;
    const two = selectedCount === 2;
    return (
      <div className="ptc-toolbar" role="toolbar" aria-label="Track canvas tools">
        <div className="ptc-tool-group">
          <ToolButton icon="hand" label="Pan" active={mode === "PAN"} onClick={() => onMode("PAN")} />
          <ToolButton icon="zoom_in" label="Zoom In" onClick={onZoomIn} />
          <ToolButton icon="zoom_out" label="Zoom Out" onClick={onZoomOut} />
          <ToolButton icon="fit_screen" label="Fit View" onClick={onFit} />
        </div>
        <span className="ptc-tool-divider" />
        <div className="ptc-tool-group">
          <ToolButton icon="cursor" label="Select" active={mode === "SELECT"} onClick={() => onMode("SELECT")} />
          <div className="ptc-add-wrap">
            <ToolButton icon="plus" label="Add Track" active={addOpen} onClick={onAddToggle} />
          </div>
        </div>
        <span className="ptc-tool-divider" />
        <div className="ptc-tool-group">
          <ToolButton icon="edit" label="Edit Geometry — drag control points; double-click a segment to add a point" active={mode === "EDIT_GEOMETRY"} disabled={!one} onClick={onEdit} />
          <ToolButton icon="arrow_right" label="Extend Track — choose an endpoint and destination" active={mode === "EXTEND"} disabled={!one} onClick={onExtend} />
          <ToolButton icon="scissors" label="Trim Track — click the trim location" active={mode === "TRIM"} disabled={!one} onClick={onTrim} />
          <ToolButton icon="link" label="Join Tracks — merge two disconnected track segments" disabled={!two} onClick={onJoin} />
          <ToolButton icon="unlink" label="Split Track — click the split location" active={mode === "SPLIT"} disabled={!one} onClick={onSplit} />
          <ToolButton icon="branch" label="Connect — store a track or turnout topology connection" active={mode === "CONNECT"} disabled={selectedCount < 1 || selectedCount > 2} onClick={onConnect} />
          <ToolButton icon="trash" label={selectedCount ? "Reject or delete selected Track" : "Select a Track to reject"} disabled={!selectedCount || selectedCount > 2} onClick={onReject} />
        </div>
        <span className="ptc-tool-divider" />
        <div className="ptc-tool-group">
          <ToolButton icon="target" label={`Snap ${snapEnabled ? "ON" : "OFF"} — endpoints, control points, turnouts and intersections`} active={snapEnabled} onClick={onSnap} />
          <ToolButton icon="undo" label="Undo (Ctrl/Cmd + Z)" disabled={!canUndo} onClick={onUndo} />
          <ToolButton icon="redo" label="Redo (Ctrl/Cmd + Shift + Z)" disabled={!canRedo} onClick={onRedo} />
        </div>
        {addOpen && <AddTrackMenu toolbar onDraw={onDraw} onMap={onMap} />}
      </div>
    );
  };

  const MappingForm = ({ geometry, onCancel, onMap, onReject }) => {
    const [value, setValue] = useState({ name: "", trackType: "MAIN_LINE", direction: "BIDIRECTIONAL" });
    return (
      <div className="ptc-map-form">
        <div className="ptc-map-head">
          <Icon name="target" size={16} />
          <div className="ptc-map-head-copy">
            <strong>Map Existing Geometry</strong>
            <span>{geometry.label} · {geometry.sourceElementIds.join(", ")}</span>
          </div>
        </div>
        <div className="ptc-form-grid">
          <div className="ptc-field" data-full="true">
            <label>Track Name</label>
            <input value={value.name} autoFocus onChange={(event) => setValue((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. DN MAIN LINE" />
          </div>
          <div className="ptc-field">
            <label>Track Type</label>
            <select value={value.trackType} onChange={(event) => setValue((current) => ({ ...current, trackType: event.target.value }))}>
              {TRACK_TYPES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </div>
          <div className="ptc-field">
            <label>Direction</label>
            <select value={value.direction} onChange={(event) => setValue((current) => ({ ...current, direction: event.target.value }))}>
              {DIRECTIONS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </div>
        </div>
        <div className="ptc-form-actions">
          <button type="button" className="ptc-inline-btn" data-danger="true" onClick={() => onReject(geometry.suggestedReason || "Not a Railway Track")}>Not a Track</button>
          <button type="button" className="ptc-inline-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="ptc-inline-btn" data-primary="true" disabled={!value.name.trim()} onClick={() => onMap(value)}>Map Track</button>
        </div>
      </div>
    );
  };

  const TrackCard = ({
    track, index, active, expanded, cardRef,
    onSelect, onToggle, onLocate, onCommitField, onReject, onConfirm,
  }) => {
    const [draft, setDraft] = useState({
      name: track.name || "",
      trackType: track.trackType,
      direction: track.direction,
      startChainage: track.startChainage || "",
      endChainage: track.endChainage || "",
    });
    useEffect(() => {
      setDraft({
        name: track.name || "",
        trackType: track.trackType,
        direction: track.direction,
        startChainage: track.startChainage || "",
        endChainage: track.endChainage || "",
      });
    }, [track.id, track.name, track.trackType, track.direction, track.startChainage, track.endChainage]);
    const set = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
    const commit = (field) => {
      if (draft[field] !== (track[field] || "")) onCommitField(track.id, field, draft[field]);
    };
    const issueLabel = (issue) => ({
      LOW_CONFIDENCE: "Low confidence",
      DISCONNECTED: "Disconnected",
      MISSING_CONNECTION: "Missing connection",
      MANUAL_REVIEW_REQUIRED: "Manual review",
      GEOMETRY_MISMATCH: "Geometry issue",
      UNMAPPED: "Unmapped",
    })[issue] || issue.replaceAll("_", " ").toLowerCase();
    return (
      <article className="ptc-card" data-active={active ? "true" : "false"} data-rejected={track.status === "REJECTED" ? "true" : "false"} ref={cardRef}>
        <div className="ptc-card-head" onClick={(event) => onSelect(track.id, event.shiftKey)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(track.id, event.shiftKey); }}>
          <span className="ptc-card-index">{index + 1}</span>
          <div className="ptc-card-heading">
            <div className="ptc-card-name">{track.name || "Unnamed Track"}</div>
            <div className="ptc-card-meta">
              <span className="mono">{track.id}</span>
              <span className="ptc-badge" data-status={track.status}>{track.status === "VERIFIED" && <Icon name="check" size={10} />}{statusLabel(track.status)}</span>
            </div>
          </div>
          <div className="ptc-card-tools">
            <button type="button" className="ptc-card-icon" title="Locate Track" aria-label={`Locate ${track.name || track.id}`} onClick={(event) => { event.stopPropagation(); onLocate(track.id); }}><Icon name="target" size={14} /></button>
            <button type="button" className="ptc-card-icon" title={track.source === "AI_EXTRACTION" ? "Reject Track" : "Delete Track"} aria-label={track.source === "AI_EXTRACTION" ? `Reject ${track.name || track.id}` : `Delete ${track.name || track.id}`} disabled={track.status === "REJECTED"} onClick={(event) => { event.stopPropagation(); onReject(track.id); }}><Icon name="trash" size={14} /></button>
            <button type="button" className="ptc-card-icon" title={expanded ? "Collapse" : "Expand"} aria-label={expanded ? "Collapse Track card" : "Expand Track card"} onClick={(event) => { event.stopPropagation(); onToggle(track.id); }}><Icon name={expanded ? "chevron_up" : "chevron_down"} size={14} /></button>
          </div>
        </div>
        {expanded && (
          <div className="ptc-card-body">
            <div className="ptc-form-grid">
              <div className="ptc-field" data-full="true">
                <label>Track Name</label>
                <input value={draft.name} onChange={set("name")} onBlur={() => commit("name")} list="ptc-track-names" disabled={track.status === "REJECTED"} />
              </div>
              <div className="ptc-field">
                <label>Track Type</label>
                <select value={draft.trackType} onChange={(event) => { set("trackType")(event); onCommitField(track.id, "trackType", event.target.value); }} disabled={track.status === "REJECTED"}>
                  {TRACK_TYPES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </div>
              <div className="ptc-field">
                <label>Direction</label>
                <select value={draft.direction} onChange={(event) => { set("direction")(event); onCommitField(track.id, "direction", event.target.value); }} disabled={track.status === "REJECTED"}>
                  {DIRECTIONS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </div>
              <div className="ptc-field">
                <label>Start Chainage</label>
                <input value={draft.startChainage} onChange={set("startChainage")} onBlur={() => commit("startChainage")} disabled={track.status === "REJECTED"} />
              </div>
              <div className="ptc-field">
                <label>End Chainage</label>
                <input value={draft.endChainage} onChange={set("endChainage")} onBlur={() => commit("endChainage")} disabled={track.status === "REJECTED"} />
              </div>
            </div>
            <div className="ptc-readonly">
              <div className="ptc-readonly-item"><span>Source</span><strong>{formatSource(track.source)}</strong></div>
              <div className="ptc-readonly-item"><span>Confidence</span><strong>{track.confidence == null ? "—" : `${track.confidence}%`}</strong></div>
              <div className="ptc-readonly-item"><span>Geometry</span><strong>{track.geometry.coordinates.length} points · {lineLength(track.geometry.coordinates).toFixed(1)} m</strong></div>
              <div className="ptc-readonly-item"><span>Connections</span><strong>{track.connectedAssetIds.length ? track.connectedAssetIds.join(", ") : "None"}</strong></div>
            </div>
            {!!track.issues.length && <div className="ptc-issues">{track.issues.map((issue) => <span className="ptc-issue-chip" key={issue}>{issueLabel(issue)}</span>)}</div>}
            {track.status === "REJECTED" && <div className="ptc-rejection-note"><strong>Rejected:</strong> {track.rejectionReason || "Incorrect extraction"}<br />{track.rejectedBy} · {track.rejectedAt}</div>}
            <div className="ptc-card-actions">
              <button type="button" className="ptc-inline-btn" data-danger="true" disabled={track.status === "REJECTED"} onClick={() => onReject(track.id)}>{track.source === "AI_EXTRACTION" ? "Reject Track" : "Delete Track"}</button>
              <button type="button" className="ptc-inline-btn" data-primary="true" disabled={track.status === "REJECTED" || track.status === "VERIFIED"} onClick={() => onConfirm(track.id)}><Icon name="check" size={12} />Confirm Track</button>
            </div>
          </div>
        )}
      </article>
    );
  };

  const RejectDialog = ({ tracks, onClose, onConfirm }) => {
    const [reason, setReason] = useState(REJECTION_REASONS[0]);
    const manualOnly = tracks.length && tracks.every((track) => track.source !== "AI_EXTRACTION");
    return (
      <div className="ptc-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
        <div className="ptc-dialog" role="dialog" aria-modal="true" aria-labelledby="ptc-reject-title">
          <div className="ptc-dialog-head">
            <div className="ptc-dialog-icon"><Icon name="trash" size={16} /></div>
            <div className="ptc-dialog-copy">
              <div className="ptc-dialog-title" id="ptc-reject-title">{manualOnly ? "Delete manually added Track?" : `Reject extracted Track${tracks.length > 1 ? "s" : ""}?`}</div>
              <div className="ptc-dialog-sub">{tracks.map((track) => track.id).join(", ")}. Extracted geometry and audit history are preserved when rejected.</div>
            </div>
          </div>
          {!manualOnly && <div className="ptc-reasons">{REJECTION_REASONS.map((item) => <label className="ptc-reason" key={item}><input type="radio" name="ptc-reason" value={item} checked={reason === item} onChange={() => setReason(item)} />{item}</label>)}</div>}
          <div className="ptc-dialog-actions">
            <button type="button" className="ptc-inline-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="ptc-inline-btn" data-danger="true" onClick={() => onConfirm(manualOnly ? "Deleted manual draft" : reason)}>{manualOnly ? "Delete" : "Reject"}</button>
          </div>
        </div>
      </div>
    );
  };

  const PIMTrackCorrectionWorkspace = ({
    station,
    initialDocument: suppliedDocument,
    sourceDocument,
    onPrevious,
    onNext,
    canPrevious = true,
    canNext = true,
    onStatusChange,
    onDocumentChange,
  }) => {
    const initialDocument = useRef(null);
    if (!initialDocument.current) initialDocument.current = loadDocument(station, suppliedDocument, sourceDocument);

    const [history, setHistory] = useState(() => ({ past: [], present: initialDocument.current, future: [] }));
    const [selectedIds, setSelectedIds] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState(() => initialDocument.current.tracks.some((track) => track.status !== "VERIFIED" && track.status !== "REJECTED") ? "NEEDS_REVIEW" : "ALL");
    const [mode, setMode] = useState("SELECT");
    const [view, setView] = useState(FIT_VIEW);
    const [snapEnabled, setSnapEnabled] = useState(true);
    const [highlightMode, setHighlightMode] = useState("NONE");
    const [addMenuOrigin, setAddMenuOrigin] = useState(null);
    const [drawPoints, setDrawPoints] = useState([]);
    const [cursorPoint, setCursorPoint] = useState(null);
    const [snapIndicator, setSnapIndicator] = useState(null);
    const [mappingTargetId, setMappingTargetId] = useState(null);
    const [extendDraft, setExtendDraft] = useState(null);
    const [connectDraft, setConnectDraft] = useState(null);
    const [operationConfirm, setOperationConfirm] = useState(null);
    const [pointMenu, setPointMenu] = useState(null);
    const [draftGeometry, setDraftGeometry] = useState(null);
    const [rejectIds, setRejectIds] = useState([]);
    const [saveState, setSaveState] = useState("Saved");
    const [lastSavedAt, setLastSavedAt] = useState("");
    const [toast, setToast] = useState(null);
    const [lastConnection, setLastConnection] = useState(null);

    const svgRef = useRef(null);
    const panelScrollRef = useRef(null);
    const cardRefs = useRef(new Map());
    const dragRef = useRef(null);
    const toastTimer = useRef(null);
    const saveTimer = useRef(null);
    const connectionTimer = useRef(null);
    const documentState = history.present;
    const latestDocumentRef = useRef(documentState);
    latestDocumentRef.current = documentState;

    const tracksById = useMemo(() => new Map(documentState.tracks.map((track) => [track.id, track])), [documentState.tracks]);
    const selectedTracks = useMemo(() => selectedIds.map((id) => tracksById.get(id)).filter(Boolean), [selectedIds, tracksById]);
    const snapTargets = useMemo(() => buildSnapTargets(documentState.tracks), [documentState.tracks]);

    const showToast = useCallback((message, tone = "default") => {
      window.clearTimeout(toastTimer.current);
      setToast({ message, tone });
      toastTimer.current = window.setTimeout(() => setToast(null), 2600);
    }, []);

    useEffect(() => () => {
      window.clearTimeout(toastTimer.current);
      window.clearTimeout(saveTimer.current);
      window.clearTimeout(connectionTimer.current);
      try {
        window.localStorage.setItem(storageKeyFor(station, latestDocumentRef.current?.sourceDocument || sourceDocument), JSON.stringify(latestDocumentRef.current));
      } catch (error) {
        // Preserve the in-memory draft if browser storage is unavailable.
      }
    }, [sourceDocument?.fileName, sourceDocument?.id, sourceDocument?.previewImage, station?.code]);

    const commit = useCallback((meta, mutate) => {
      setOperationConfirm(null);
      setDraftGeometry(null);
      setHistory((current) => {
        const before = current.present;
        const next = clone(before);
        const outcome = mutate(next, before);
        if (outcome === false) return current;
        const resolveValue = (value, state) => typeof value === "function" ? value(state) : value;
        next.audit = [...(next.audit || []), {
          assetId: meta.assetId || "MULTIPLE",
          assetType: meta.assetType || "TRACK",
          action: meta.action,
          previousValue: resolveValue(meta.previousValue, before) ?? null,
          newValue: resolveValue(meta.newValue, next) ?? null,
          userId: D.CURRENT_USER?.id || D.CURRENT_USER?.name || "PIM Reviewer",
          timestamp: new Date().toISOString(),
          source: meta.source || "MANUAL_CORRECTION",
        }];
        return {
          past: [...current.past.slice(-59), clone(before)],
          present: next,
          future: [],
        };
      });
    }, []);

    const resetOperationState = useCallback(() => {
      setDrawPoints([]);
      setCursorPoint(null);
      setSnapIndicator(null);
      setMappingTargetId(null);
      setExtendDraft(null);
      setConnectDraft(null);
      setOperationConfirm(null);
      setPointMenu(null);
      setDraftGeometry(null);
      dragRef.current = null;
    }, []);

    const undo = useCallback(() => {
      resetOperationState();
      setMode("SELECT");
      setHistory((current) => {
        if (!current.past.length) return current;
        const previous = current.past[current.past.length - 1];
        const restored = clone(previous);
        restored.audit = [...current.present.audit, {
          assetId: "MULTIPLE",
          assetType: "TRACK",
          action: "TRACK_CHANGE_UNDONE",
          previousValue: null,
          newValue: null,
          userId: D.CURRENT_USER?.id || D.CURRENT_USER?.name || "PIM Reviewer",
          timestamp: new Date().toISOString(),
          source: "MANUAL_CORRECTION",
        }];
        return {
          past: current.past.slice(0, -1),
          present: restored,
          future: [clone(current.present), ...current.future].slice(0, 60),
        };
      });
      showToast("Last Track correction undone.");
    }, [resetOperationState, showToast]);

    const redo = useCallback(() => {
      resetOperationState();
      setMode("SELECT");
      setHistory((current) => {
        if (!current.future.length) return current;
        const next = current.future[0];
        const restored = clone(next);
        restored.audit = [...current.present.audit, {
          assetId: "MULTIPLE",
          assetType: "TRACK",
          action: "TRACK_CHANGE_REDONE",
          previousValue: null,
          newValue: null,
          userId: D.CURRENT_USER?.id || D.CURRENT_USER?.name || "PIM Reviewer",
          timestamp: new Date().toISOString(),
          source: "MANUAL_CORRECTION",
        }];
        return {
          past: [...current.past, clone(current.present)].slice(-60),
          present: restored,
          future: current.future.slice(1),
        };
      });
      showToast("Track correction restored.");
    }, [resetOperationState, showToast]);

    useEffect(() => {
      onDocumentChange?.(clone(documentState));
    }, [documentState, onDocumentChange]);

    useEffect(() => {
      setSaveState("Saving...");
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        let didSave = true;
        try {
          window.localStorage.setItem(storageKeyFor(station, documentState.sourceDocument), JSON.stringify(documentState));
          window.dispatchEvent(new CustomEvent("pim-track-draft-saved", { detail: { stationCode: station?.code, auditCount: documentState.audit.length, document: clone(documentState) } }));
        } catch (error) {
          didSave = false;
        }
        setSaveState(didSave ? "Saved" : "Save failed");
        if (didSave) setLastSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }, 360);
      return () => window.clearTimeout(saveTimer.current);
    }, [documentState, station]);

    useEffect(() => {
      const active = documentState.tracks.filter((track) => track.status !== "REJECTED");
      const unresolved = active.filter((track) => track.status !== "VERIFIED");
      const issueTracks = active.filter((track) => track.status === "NEEDS_REVIEW" || track.issues.length);
      const issueCount = issueTracks.length + documentState.unmapped.length;
      const status = !unresolved.length && !documentState.unmapped.length ? "completed" : issueCount ? "has_issues" : "incomplete";
      onStatusChange?.({
        status,
        count: active.length,
        total: active.length,
        issueCount,
        verifiedCount: active.length - unresolved.length,
        rejectedCount: documentState.tracks.length - active.length,
      });
    }, [documentState.tracks, documentState.unmapped, onStatusChange]);

    useEffect(() => {
      setSelectedIds((current) => current.filter((id) => tracksById.has(id) && tracksById.get(id).status !== "REJECTED"));
    }, [tracksById]);

    useEffect(() => {
      if (!expandedId) return;
      const element = cardRefs.current.get(expandedId);
      const container = panelScrollRef.current;
      if (element && container) window.requestAnimationFrame(() => {
        const itemRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (itemRect.top < containerRect.top) container.scrollBy({ top: itemRect.top - containerRect.top - 8, behavior: "smooth" });
        else if (itemRect.bottom > containerRect.bottom) container.scrollBy({ top: itemRect.bottom - containerRect.bottom + 8, behavior: "smooth" });
      });
    }, [expandedId, filter]);

    const isIssueTrack = useCallback((track) => track.status !== "REJECTED" && (track.status !== "VERIFIED" || track.issues.length > 0), []);
    const matchesFilter = useCallback((track, value = filter) => {
      if (value === "ALL") return true;
      if (value === "NEEDS_REVIEW") return track.status === "NEEDS_REVIEW" || track.status === "EXTRACTED";
      return track.status === value;
    }, [filter]);
    const filteredTracks = useMemo(() => documentState.tracks.filter((track) => matchesFilter(track) || selectedIds.includes(track.id)), [documentState.tracks, matchesFilter, selectedIds]);
    const activeTrackCount = documentState.tracks.filter((track) => track.status !== "REJECTED").length;
    const issueCount = documentState.tracks.filter(isIssueTrack).length + documentState.unmapped.length;

    const eventPoint = useCallback((event) => {
      const svg = svgRef.current;
      const matrix = svg?.getScreenCTM?.();
      if (svg?.createSVGPoint && matrix) {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const local = point.matrixTransform(matrix.inverse());
        return [local.x, local.y];
      }
      const rect = svg?.getBoundingClientRect();
      if (!rect?.width || !rect?.height) return [view.x, view.y];
      return [
        view.x + ((event.clientX - rect.left) / rect.width) * view.w,
        view.y + ((event.clientY - rect.top) / rect.height) * view.h,
      ];
    }, [view]);

    const nearestSnap = useCallback((point, excludeId = "") => {
      if (!snapEnabled) return null;
      const matrix = svgRef.current?.getScreenCTM?.();
      const screenScale = matrix ? Math.hypot(matrix.a, matrix.b) : 0;
      const rect = svgRef.current?.getBoundingClientRect();
      const threshold = screenScale > 0 ? 14 / screenScale : rect?.width ? (view.w / rect.width) * 14 : 18;
      let match = null;
      snapTargets.forEach((target) => {
        if (target.id === excludeId) return;
        const gap = distance(point, target.point);
        if (gap <= threshold && (!match || gap < match.gap)) match = { ...target, gap };
      });
      return match;
    }, [snapEnabled, snapTargets, view.w]);

    const resolvePoint = useCallback((rawPoint, excludeId = "") => {
      const target = nearestSnap(rawPoint, excludeId);
      return { point: target ? target.point.slice() : rawPoint, target };
    }, [nearestSnap]);

    const clearTransient = resetOperationState;

    const changeMode = useCallback((nextMode) => {
      clearTransient();
      setAddMenuOrigin(null);
      setMode(nextMode);
    }, [clearTransient]);

    const cancelActiveOperation = useCallback(() => {
      const hadOperation = mode !== "SELECT" || drawPoints.length || extendDraft || connectDraft || operationConfirm || mappingTargetId;
      clearTransient();
      setAddMenuOrigin(null);
      setMode("SELECT");
      if (hadOperation) showToast("Track editing operation cancelled.", "info");
    }, [clearTransient, connectDraft, drawPoints.length, extendDraft, mappingTargetId, mode, operationConfirm, showToast]);

    const selectTrack = useCallback((trackId, additive = false) => {
      const track = tracksById.get(trackId);
      if (!track || track.status === "REJECTED") return;
      const changesSelection = additive || selectedIds.length !== 1 || selectedIds[0] !== trackId;
      if (operationConfirm && changesSelection) {
        setOperationConfirm(null);
        showToast("Pending Track operation cancelled because the selection changed.", "info");
      }
      if (mode !== "SELECT" && changesSelection) {
        clearTransient();
        setMode("SELECT");
      }
      setSelectedIds((current) => additive
        ? current.includes(trackId) ? current.filter((id) => id !== trackId) : [...current, trackId]
        : [trackId]);
      setExpandedId(trackId);
      if (!matchesFilter(track)) setFilter("ALL");
    }, [clearTransient, matchesFilter, mode, operationConfirm, selectedIds, showToast, tracksById]);

    const locateTrack = useCallback((trackId) => {
      const track = tracksById.get(trackId);
      if (!track) return;
      selectTrack(trackId, false);
      const bounds = boundsForCoordinates(track.geometry.coordinates);
      const width = Math.max(460, bounds.x2 - bounds.x1 + 150);
      const height = Math.max(240, bounds.y2 - bounds.y1 + 140);
      setView({ x: (bounds.x1 + bounds.x2 - width) / 2, y: (bounds.y1 + bounds.y2 - height) / 2, w: width, h: height });
      setHighlightMode("NONE");
    }, [selectTrack, tracksById]);

    const zoomBy = useCallback((factor) => {
      setView((current) => {
        const w = Math.max(260, Math.min(2600, current.w * factor));
        const h = Math.max(120, Math.min(1300, current.h * factor));
        return { x: current.x + (current.w - w) / 2, y: current.y + (current.h - h) / 2, w, h };
      });
    }, []);

    const commitField = useCallback((trackId, field, value) => {
      const track = tracksById.get(trackId);
      if (!track || track[field] === value) return;
      commit({
        action: "TRACK_ATTRIBUTE_UPDATED",
        assetId: trackId,
        previousValue: { [field]: track[field] ?? "" },
        newValue: { [field]: value },
        source: track.source,
      }, (next) => {
        const target = next.tracks.find((item) => item.id === trackId);
        target[field] = value;
        if (target.status !== "MANUALLY_ADDED") target.status = "MODIFIED";
        target.version = (target.version || 1) + 1;
        if (field === "name") {
          target.issues = value.trim() ? target.issues.filter((issue) => issue !== "MANUAL_REVIEW_REQUIRED") : unique([...target.issues, "MANUAL_REVIEW_REQUIRED"]);
        }
      });
    }, [commit, tracksById]);

    const commitGeometry = useCallback((trackId, coordinates, action = "TRACK_GEOMETRY_UPDATED", detail = null) => {
      const clean = sanitiseCoordinates(coordinates);
      const error = validateCoordinates(clean);
      if (error) { showToast(error, "danger"); return false; }
      const track = tracksById.get(trackId);
      if (!track) return false;
      const oldCoordinates = track.geometry.coordinates;
      const startChanged = !samePoint(clean[0], oldCoordinates[0]);
      const endChanged = !samePoint(clean[clean.length - 1], oldCoordinates[oldCoordinates.length - 1]);
      commit({
        action,
        assetId: trackId,
        previousValue: { geometry: track.geometry },
        newValue: { geometry: { type: "LineString", coordinates: clean }, detail },
        source: track.source,
      }, (next) => {
        const target = next.tracks.find((item) => item.id === trackId);
        const oldLastIndex = target.geometry.coordinates.length - 1;
        const relatedIds = [];
        if (startChanged) relatedIds.push(...detachEndpointTopology(next, trackId, 0));
        if (endChanged) relatedIds.push(...detachEndpointTopology(next, trackId, oldLastIndex));
        target.geometry = { type: "LineString", coordinates: clean };
        const newLastIndex = clean.length - 1;
        if (!endChanged && oldLastIndex !== newLastIndex) {
          next.topology = next.topology.map((relation) => ({
            ...relation,
            sourceEndpointIndex: relation.sourceAssetId === trackId && relation.sourceEndpointRole == null && relation.sourceEndpointIndex === oldLastIndex ? newLastIndex : relation.sourceEndpointIndex,
            destinationEndpointIndex: relation.destinationAssetId === trackId && relation.destinationEndpointRole == null && relation.destinationEndpointIndex === oldLastIndex ? newLastIndex : relation.destinationEndpointIndex,
          }));
        }
        target.startChainage = chainageAt(clean[0][0], station);
        target.endChainage = chainageAt(clean[clean.length - 1][0], station);
        target.status = "MODIFIED";
        target.version = (target.version || 1) + 1;
        target.issues = target.issues.filter((issue) => issue !== "GEOMETRY_MISMATCH");
        next.topology = next.topology.flatMap((relation) => {
          const mapped = { ...relation };
          let keep = true;
          ["source", "destination"].forEach((side) => {
            if (!keep) return;
            const assetKey = `${side}AssetId`;
            const segmentKey = `${side}SegmentIndex`;
            if (mapped[assetKey] !== trackId || !Number.isInteger(mapped[segmentKey]) || !finitePoint(mapped.connectionPoint)) return;
            const projection = projectPointToPolyline(mapped.connectionPoint, clean);
            if (!projection || projection.distance > 6) {
              keep = false;
              const adjacentId = side === "source" ? mapped.destinationAssetId : mapped.sourceAssetId;
              if (adjacentId) relatedIds.push(adjacentId);
              return;
            }
            mapped[segmentKey] = projection.segmentIndex;
            mapped.connectionPoint = projection.point;
          });
          return keep ? [mapped] : [];
        });
        syncConnectedAssetIds(next);
        refreshConnectivity(next, [trackId, ...relatedIds]);
      });
      return true;
    }, [commit, showToast, station, tracksById]);

    const startDraw = useCallback(() => {
      clearTransient();
      setSelectedIds([]);
      setMode("DRAW");
      setAddMenuOrigin(null);
      showToast("Draw Track mode: click points, double-click to complete, Esc to cancel.", "info");
    }, [clearTransient, showToast]);

    const startMap = useCallback(() => {
      clearTransient();
      setSelectedIds([]);
      setMode("MAP");
      setAddMenuOrigin(null);
      showToast("Select an unidentified line or polyline on the source ESP.", "info");
    }, [clearTransient, showToast]);

    const createDrawnTrack = useCallback((points) => {
      const coordinates = sanitiseCoordinates(points);
      const error = validateCoordinates(coordinates);
      if (error) { showToast(error, "danger"); return; }
      const id = nextTrackId([...documentState.tracks, ...documentState.archive]);
      const track = {
        id,
        name: "",
        trackType: "OTHER",
        direction: "NA",
        geometry: { type: "LineString", coordinates },
        originalGeometry: { type: "LineString", coordinates: clone(coordinates) },
        startChainage: chainageAt(coordinates[0][0], station),
        endChainage: chainageAt(coordinates[coordinates.length - 1][0], station),
        connectedAssetIds: [],
        deadEnd: false,
        bufferStop: false,
        source: "MANUAL",
        sourceGeometryIds: [],
        confidence: null,
        status: "MANUALLY_ADDED",
        issues: ["MANUAL_REVIEW_REQUIRED", "MISSING_CONNECTION"],
        rejectionReason: "",
        rejectedBy: "",
        rejectedAt: "",
        version: 1,
        parentTrackId: null,
        mergedAssetIds: [],
      };
      commit({ action: "TRACK_CREATED", assetId: id, previousValue: null, newValue: track, source: "MANUAL" }, (next) => { next.tracks.push(track); });
      setMode("SELECT");
      setDrawPoints([]);
      setSelectedIds([id]);
      setExpandedId(id);
      setFilter("MANUALLY_ADDED");
      showToast(`${id} created. Complete its properties in the Track panel.`);
    }, [commit, documentState.archive, documentState.tracks, showToast, station]);

    const mapExistingGeometry = useCallback((value) => {
      const geometry = documentState.unmapped.find((item) => item.id === mappingTargetId);
      if (!geometry) return;
      const coordinates = combinePaths(geometry.paths);
      const error = validateCoordinates(coordinates);
      if (error) { showToast(error, "danger"); return; }
      const id = nextTrackId([...documentState.tracks, ...documentState.archive]);
      const track = {
        id,
        name: value.name.trim(),
        trackType: value.trackType,
        direction: value.direction,
        geometry: { type: "LineString", coordinates },
        originalGeometry: { type: "LineString", coordinates: clone(coordinates) },
        sourceGeometry: { type: "MultiLineString", coordinates: clone(geometry.paths) },
        startChainage: chainageAt(coordinates[0][0], station),
        endChainage: chainageAt(coordinates[coordinates.length - 1][0], station),
        connectedAssetIds: [],
        deadEnd: false,
        bufferStop: false,
        source: "MANUAL_MAPPING",
        sourceGeometryIds: geometry.sourceElementIds.slice(),
        confidence: geometry.aiConfidence,
        status: "MANUALLY_ADDED",
        issues: ["MISSING_CONNECTION"],
        rejectionReason: "",
        rejectedBy: "",
        rejectedAt: "",
        version: 1,
        parentTrackId: null,
        mergedAssetIds: [],
      };
      commit({ action: "TRACK_CREATED", assetId: id, previousValue: { unmappedGeometry: geometry }, newValue: track, source: "MANUAL_MAPPING" }, (next) => {
        next.tracks.push(track);
        next.unmapped = next.unmapped.filter((item) => item.id !== geometry.id);
      });
      setMappingTargetId(null);
      setMode("SELECT");
      setSelectedIds([id]);
      setExpandedId(id);
      setFilter("MANUALLY_ADDED");
      showToast(`${geometry.id} mapped as ${id}.`);
    }, [commit, documentState.archive, documentState.tracks, documentState.unmapped, mappingTargetId, showToast, station]);

    const rejectUnmappedGeometry = useCallback((reason) => {
      const geometry = documentState.unmapped.find((item) => item.id === mappingTargetId);
      if (!geometry) return;
      commit({
        action: "SOURCE_GEOMETRY_REJECTED",
        assetId: geometry.id,
        assetType: "SOURCE_GEOMETRY",
        previousValue: geometry,
        newValue: { status: "NOT_A_TRACK", reason },
        source: "MANUAL_CORRECTION",
      }, (next) => {
        next.unmapped = next.unmapped.filter((item) => item.id !== geometry.id);
        next.archive.push({ ...geometry, status: "NOT_A_TRACK", rejectionReason: reason, archivedAt: new Date().toISOString() });
      });
      setMappingTargetId(null);
      setMode("SELECT");
      showToast(`${geometry.id} classified as not a Track.`);
    }, [commit, documentState.unmapped, mappingTargetId, showToast]);

    const requestReject = useCallback((ids = selectedIds) => {
      const candidates = ids.filter((id) => tracksById.has(id) && tracksById.get(id).status !== "REJECTED");
      if (!candidates.length) { showToast("Select a valid Track first.", "danger"); return; }
      clearTransient();
      setMode("SELECT");
      setRejectIds(candidates);
    }, [clearTransient, selectedIds, showToast, tracksById]);

    const confirmReject = useCallback((reason) => {
      const candidates = rejectIds.map((id) => tracksById.get(id)).filter(Boolean);
      if (!candidates.length) return;
      clearTransient();
      setMode("SELECT");
      const manualOnly = candidates.every((track) => track.source !== "AI_EXTRACTION");
      commit({
        action: manualOnly ? "TRACK_DELETED" : "TRACK_REJECTED",
        assetId: candidates.map((track) => track.id).join(","),
        previousValue: candidates,
        newValue: manualOnly ? null : { status: "REJECTED", reason },
        source: manualOnly ? "MANUAL" : "AI_EXTRACTION",
      }, (next) => {
        const removedIds = new Set(candidates.map((candidate) => candidate.id));
        const affectedIds = unique(candidates.flatMap((candidate) => candidate.connectedAssetIds));
        candidates.forEach((candidate) => {
          const index = next.tracks.findIndex((track) => track.id === candidate.id);
          if (index < 0) return;
          const target = next.tracks[index];
          if (target.source !== "AI_EXTRACTION") {
            next.archive.push({ ...target, archivedAction: "DELETED", archivedAt: new Date().toISOString() });
            next.tracks.splice(index, 1);
          } else {
            target.status = "REJECTED";
            target.rejectedConnections = target.connectedAssetIds.slice();
            target.connectedAssetIds = [];
            target.rejectionReason = reason;
            target.rejectedBy = D.CURRENT_USER?.name || "PIM Reviewer";
            target.rejectedAt = new Date().toLocaleString();
            target.version = (target.version || 1) + 1;
          }
        });
        next.topology = next.topology.filter((relation) => !removedIds.has(relation.sourceAssetId) && !removedIds.has(relation.destinationAssetId));
        syncConnectedAssetIds(next);
        refreshConnectivity(next, affectedIds);
      });
      setRejectIds([]);
      setSelectedIds([]);
      setExpandedId(null);
      showToast(manualOnly ? "Manual Track deleted." : "Extracted Track rejected; original geometry was preserved.");
    }, [clearTransient, commit, rejectIds, showToast, tracksById]);

    const confirmTrack = useCallback((trackId) => {
      const track = tracksById.get(trackId);
      if (!track) return;
      clearTransient();
      setMode("SELECT");
      if (!track.name.trim()) { showToast("Track Name is required before confirmation.", "danger"); return; }
      const geometryError = validateCoordinates(track.geometry.coordinates);
      if (geometryError) { showToast(geometryError, "danger"); return; }
      const lastEndpointIndex = track.geometry.coordinates.length - 1;
      const endpointConnected = (endpointIndex) => {
        const role = endpointRoleForIndex(track, endpointIndex);
        return documentState.topology.some((relation) => relationTouchesEndpoint(relation, "source", track.id, endpointIndex, role) || relationTouchesEndpoint(relation, "destination", track.id, endpointIndex, role));
      };
      if (!endpointConnected(0) || !endpointConnected(lastEndpointIndex)) {
        showToast("Resolve both Track endpoint connections before confirmation.", "danger");
        return;
      }
      const validTopologyIds = new Set([
        ...documentState.tracks.filter((item) => item.status !== "REJECTED").map((item) => item.id),
        ...D.TURNOUTS.map((item) => item.id),
        ...D.BUFFER_STOPS.map((item) => item.id),
        ...D.TRACKS.flatMap((item) => [item.startNodeId, item.endNodeId]).filter(Boolean),
      ]);
      const invalidReference = track.connectedAssetIds.find((id) => !validTopologyIds.has(id));
      if (invalidReference) { showToast(`Connection target ${invalidReference} does not exist.`, "danger"); return; }
      const currentIndex = documentState.tracks.findIndex((item) => item.id === trackId);
      const ordered = [...documentState.tracks.slice(currentIndex + 1), ...documentState.tracks.slice(0, currentIndex)];
      const nextUnresolved = ordered.find((item) => item.id !== trackId && item.status !== "VERIFIED" && item.status !== "REJECTED");
      commit({ action: "TRACK_VERIFIED", assetId: trackId, previousValue: { status: track.status }, newValue: { status: "VERIFIED" }, source: track.source }, (next) => {
        const target = next.tracks.find((item) => item.id === trackId);
        target.status = "VERIFIED";
        target.issues = [];
        target.version = (target.version || 1) + 1;
      });
      setExpandedId(nextUnresolved?.id || null);
      setSelectedIds(nextUnresolved ? [nextUnresolved.id] : []);
      if (nextUnresolved && !matchesFilter(nextUnresolved)) setFilter("ALL");
      showToast(`${track.name} verified.`);
    }, [clearTransient, commit, documentState.tracks, matchesFilter, showToast, tracksById]);

    const startEditGeometry = useCallback(() => {
      if (selectedIds.length !== 1) { showToast("Select one Track to edit its geometry.", "danger"); return; }
      changeMode("EDIT_GEOMETRY");
      showToast("Drag control points, double-click a segment to add a point, or right-click a point to remove it.", "info");
    }, [changeMode, selectedIds.length, showToast]);

    const startExtend = useCallback(() => {
      if (selectedIds.length !== 1) { showToast("Select one Track to extend.", "danger"); return; }
      changeMode("EXTEND");
      showToast("Select a Track endpoint, then click a destination.", "info");
    }, [changeMode, selectedIds.length, showToast]);

    const startTrim = useCallback(() => {
      if (selectedIds.length !== 1) { showToast("Select one Track to trim.", "danger"); return; }
      changeMode("TRIM");
      showToast("Click the selected Track where it should be trimmed.", "info");
    }, [changeMode, selectedIds.length, showToast]);

    const startSplit = useCallback(() => {
      if (selectedIds.length !== 1) { showToast("Select one Track to split.", "danger"); return; }
      changeMode("SPLIT");
      showToast("Click the selected Track at the split location.", "info");
    }, [changeMode, selectedIds.length, showToast]);

    const startJoin = useCallback(() => {
      if (selectedIds.length !== 2) { showToast("Select two Track segments to join.", "danger"); return; }
      const [first, second] = selectedTracks;
      if (!first || !second || first.status === "REJECTED" || second.status === "REJECTED") { showToast("Select two valid Tracks to join.", "danger"); return; }
      const pair = nearestEndpointPair(first, second);
      const coordinates = mergeTrackCoordinates(first, second, pair);
      const error = validateCoordinates(coordinates);
      if (error) { showToast(error, "danger"); return; }
      clearTransient();
      setMode("SELECT");
      setOperationConfirm({ type: "JOIN", firstId: first.id, secondId: second.id, pair, coordinates });
    }, [clearTransient, selectedIds.length, selectedTracks, showToast]);

    const startConnect = useCallback(() => {
      if (selectedIds.length < 1 || selectedIds.length > 2) { showToast("Select one or two Tracks to connect.", "danger"); return; }
      changeMode("CONNECT");
      showToast("Select a source Track endpoint, then a Track or turnout connection point.", "info");
    }, [changeMode, selectedIds.length, showToast]);

    const addControlPoint = useCallback((trackId, rawPoint) => {
      const track = tracksById.get(trackId);
      if (!track || mode !== "EDIT_GEOMETRY" || selectedIds.length !== 1 || selectedIds[0] !== trackId) return;
      const projection = projectPointToPolyline(rawPoint, track.geometry.coordinates);
      if (!projection) return;
      const coordinates = track.geometry.coordinates.slice();
      coordinates.splice(projection.segmentIndex + 1, 0, projection.point);
      if (commitGeometry(trackId, coordinates, "TRACK_GEOMETRY_UPDATED", { operation: "CONTROL_POINT_ADDED" })) showToast("Control point added.");
    }, [commitGeometry, mode, selectedIds, showToast, tracksById]);

    const removeControlPoint = useCallback((trackId, pointIndex) => {
      const track = tracksById.get(trackId);
      if (!track || track.geometry.coordinates.length <= 2) { showToast("A Track must keep at least two points.", "danger"); return; }
      const coordinates = track.geometry.coordinates.filter((_, index) => index !== pointIndex);
      if (commitGeometry(trackId, coordinates, "TRACK_GEOMETRY_UPDATED", { operation: "CONTROL_POINT_REMOVED", pointIndex })) showToast("Control point removed.");
    }, [commitGeometry, showToast, tracksById]);

    const chooseTrim = useCallback((track, rawPoint) => {
      const projection = projectPointToPolyline(rawPoint, track.geometry.coordinates);
      const split = splitCoordinatesAt(track.geometry.coordinates, projection);
      if (!split) { showToast("Choose a point away from the Track endpoints.", "danger"); return; }
      const leftLength = lineLength(split.left);
      const rightLength = lineLength(split.right);
      const keep = leftLength >= rightLength ? split.left : split.right;
      const remove = leftLength >= rightLength ? split.right : split.left;
      setOperationConfirm({ type: "TRIM", trackId: track.id, keep, remove, keepSide: leftLength >= rightLength ? "start" : "end" });
    }, [showToast]);

    const chooseSplit = useCallback((track, rawPoint) => {
      const projection = projectPointToPolyline(rawPoint, track.geometry.coordinates);
      const split = splitCoordinatesAt(track.geometry.coordinates, projection);
      if (!split || lineLength(split.left) < 1 || lineLength(split.right) < 1) { showToast("Choose a valid split point away from the endpoints.", "danger"); return; }
      setOperationConfirm({ type: "SPLIT", trackId: track.id, left: split.left, right: split.right, splitSegmentIndex: projection.segmentIndex });
    }, [showToast]);

    const confirmPendingOperation = useCallback(() => {
      if (!operationConfirm) return;
      if (operationConfirm.type === "TRIM") {
        const track = tracksById.get(operationConfirm.trackId);
        if (track && commitGeometry(track.id, operationConfirm.keep, "TRACK_TRIMMED", { removedGeometry: operationConfirm.remove })) showToast(`${track.name || track.id} trimmed.`);
        setOperationConfirm(null);
        setMode("SELECT");
        return;
      }
      if (operationConfirm.type === "JOIN") {
        const first = tracksById.get(operationConfirm.firstId);
        const second = tracksById.get(operationConfirm.secondId);
        if (!first || !second) return;
        commit({
          action: "TRACK_JOINED",
          assetId: first.id,
          previousValue: { primary: first, merged: second },
          newValue: { retainedTrackId: first.id, mergedTrackId: second.id, geometry: operationConfirm.coordinates },
          source: first.source,
        }, (next) => {
          const primary = next.tracks.find((track) => track.id === first.id);
          const retired = next.tracks.find((track) => track.id === second.id);
          primary.geometry = { type: "LineString", coordinates: operationConfirm.coordinates };
          primary.startChainage = chainageAt(operationConfirm.coordinates[0][0], station);
          primary.endChainage = chainageAt(operationConfirm.coordinates[operationConfirm.coordinates.length - 1][0], station);
          primary.connectedAssetIds = unique([...primary.connectedAssetIds, ...retired.connectedAssetIds]).filter((id) => id !== first.id && id !== second.id);
          primary.mergedAssetIds = unique([...(primary.mergedAssetIds || []), second.id, ...(retired.mergedAssetIds || [])]);
          primary.status = "MODIFIED";
          primary.version = (primary.version || 1) + 1;
          primary.issues = primary.issues.filter((issue) => !["DISCONNECTED", "GEOMETRY_MISMATCH"].includes(issue));
          next.archive.push({ ...retired, archivedAction: "MERGED", mergedInto: first.id, archivedAt: new Date().toISOString() });
          next.tracks = next.tracks.filter((track) => track.id !== second.id);
          const firstExternalRole = operationConfirm.pair.aIndex === 0 ? "END" : "START";
          const secondExternalRole = operationConfirm.pair.bIndex === 0 ? "END" : "START";
          const mergedLastIndex = operationConfirm.coordinates.length - 1;
          const firstWasReversed = operationConfirm.pair.aIndex === 0;
          const secondWasReversed = operationConfirm.pair.bIndex === second.geometry.coordinates.length - 1;
          const secondSegmentOffset = first.geometry.coordinates.length - (samePoint(operationConfirm.pair.a, operationConfirm.pair.b) ? 1 : 0);
          next.topology = next.topology.flatMap((relation) => {
            const mapped = { ...relation };
            let keep = true;
            ["source", "destination"].forEach((side) => {
              if (!keep) return;
              const assetKey = `${side}AssetId`;
              const roleKey = `${side}EndpointRole`;
              const indexKey = `${side}EndpointIndex`;
              const segmentKey = `${side}SegmentIndex`;
              const assetId = mapped[assetKey];
              if (assetId !== first.id && assetId !== second.id) return;
              const original = assetId === first.id ? first : second;
              const role = mapped[roleKey] || endpointRoleForIndex(original, mapped[indexKey]);
              if (!role) {
                if (Number.isInteger(mapped[segmentKey])) {
                  const segmentCount = original.geometry.coordinates.length - 1;
                  const wasReversed = assetId === first.id ? firstWasReversed : secondWasReversed;
                  const localSegmentIndex = wasReversed ? segmentCount - 1 - mapped[segmentKey] : mapped[segmentKey];
                  mapped[segmentKey] = localSegmentIndex + (assetId === second.id ? secondSegmentOffset : 0);
                }
                mapped[assetKey] = first.id;
                return;
              }
              const externalRole = assetId === first.id ? firstExternalRole : secondExternalRole;
              if (role !== externalRole) { keep = false; return; }
              mapped[assetKey] = first.id;
              mapped[roleKey] = assetId === first.id ? "START" : "END";
              mapped[indexKey] = assetId === first.id ? 0 : mergedLastIndex;
            });
            return keep && mapped.sourceAssetId !== mapped.destinationAssetId ? [mapped] : [];
          });
          syncConnectedAssetIds(next);
          refreshConnectivity(next, [first.id, ...primary.connectedAssetIds]);
        });
        setSelectedIds([first.id]);
        setExpandedId(first.id);
        setOperationConfirm(null);
        setMode("SELECT");
        showToast(`${second.id} joined into ${first.id}. Audit history was preserved.`);
        return;
      }
      if (operationConfirm.type === "SPLIT") {
        const track = tracksById.get(operationConfirm.trackId);
        if (!track) return;
        const newId = nextTrackId([...documentState.tracks, ...documentState.archive]);
        const newTrack = {
          ...clone(track),
          id: newId,
          name: track.name ? `${track.name} B` : `${track.id} B`,
          geometry: { type: "LineString", coordinates: operationConfirm.right },
          originalGeometry: clone(track.originalGeometry),
          startChainage: chainageAt(operationConfirm.right[0][0], station),
          endChainage: chainageAt(operationConfirm.right[operationConfirm.right.length - 1][0], station),
          connectedAssetIds: [track.id],
          status: "MODIFIED",
          issues: track.issues.filter((issue) => issue !== "GEOMETRY_MISMATCH"),
          version: 1,
          parentTrackId: track.id,
          mergedAssetIds: [],
        };
        commit({
          action: "TRACK_SPLIT",
          assetId: track.id,
          previousValue: { track },
          newValue: { primaryTrackId: track.id, newTrackId: newId, splitPoint: operationConfirm.right[0] },
          source: track.source,
        }, (next) => {
          const primary = next.tracks.find((item) => item.id === track.id);
          primary.geometry = { type: "LineString", coordinates: operationConfirm.left };
          primary.name = primary.name ? `${primary.name} A` : `${primary.id} A`;
          primary.startChainage = chainageAt(operationConfirm.left[0][0], station);
          primary.endChainage = chainageAt(operationConfirm.left[operationConfirm.left.length - 1][0], station);
          primary.status = "MODIFIED";
          primary.parentTrackId = track.parentTrackId || null;
          primary.version = (primary.version || 1) + 1;
          primary.issues = primary.issues.filter((issue) => issue !== "GEOMETRY_MISMATCH");
          const newRightLastIndex = operationConfirm.right.length - 1;
          next.topology = next.topology.map((relation) => {
            const mapped = { ...relation };
            ["source", "destination"].forEach((side) => {
              const assetKey = `${side}AssetId`;
              if (mapped[assetKey] !== track.id) return;
              const roleKey = `${side}EndpointRole`;
              const indexKey = `${side}EndpointIndex`;
              const segmentKey = `${side}SegmentIndex`;
              const role = mapped[roleKey] || endpointRoleForIndex(track, mapped[indexKey]);
              if (role === "END") {
                mapped[assetKey] = newId;
                mapped[roleKey] = "END";
                mapped[indexKey] = newRightLastIndex;
              } else if (role === "START") {
                mapped[roleKey] = "START";
                mapped[indexKey] = 0;
              } else if (Number.isInteger(mapped[segmentKey])) {
                const leftProjection = finitePoint(mapped.connectionPoint) ? projectPointToPolyline(mapped.connectionPoint, operationConfirm.left) : null;
                const rightProjection = finitePoint(mapped.connectionPoint) ? projectPointToPolyline(mapped.connectionPoint, operationConfirm.right) : null;
                const belongsRight = leftProjection && rightProjection
                  ? rightProjection.distance + 1e-6 < leftProjection.distance
                  : mapped[segmentKey] > operationConfirm.splitSegmentIndex;
                if (belongsRight) {
                  mapped[assetKey] = newId;
                  mapped[segmentKey] = rightProjection?.segmentIndex ?? Math.max(0, mapped[segmentKey] - operationConfirm.splitSegmentIndex);
                  if (rightProjection) mapped.connectionPoint = rightProjection.point;
                } else if (leftProjection) {
                  mapped[segmentKey] = leftProjection.segmentIndex;
                  mapped.connectionPoint = leftProjection.point;
                }
              }
            });
            return mapped;
          });
          next.topology.push({
            id: `TOP-${Date.now()}`,
            sourceAssetId: track.id,
            sourceEndpointIndex: operationConfirm.left.length - 1,
            sourceEndpointRole: "END",
            destinationAssetId: newId,
            destinationEndpointIndex: 0,
            destinationEndpointRole: "START",
            relationship: "SPLIT_CONTINUATION",
          });
          next.tracks.push(newTrack);
          syncConnectedAssetIds(next);
          refreshConnectivity(next, [track.id, newId]);
        });
        setSelectedIds([track.id, newId]);
        setExpandedId(track.id);
        setFilter("MODIFIED");
        setOperationConfirm(null);
        setMode("SELECT");
        showToast(`${track.id} split into ${track.id} and ${newId}.`);
      }
    }, [commit, commitGeometry, documentState.archive, documentState.tracks, operationConfirm, showToast, station, tracksById]);

    const chooseEndpoint = useCallback((trackId, pointIndex) => {
      const track = tracksById.get(trackId);
      if (!track) return;
      const lastIndex = track.geometry.coordinates.length - 1;
      if (pointIndex !== 0 && pointIndex !== lastIndex) return;
      if (mode === "EXTEND") {
        setExtendDraft({ trackId, pointIndex, point: track.geometry.coordinates[pointIndex] });
        showToast("Endpoint selected. Click the extension destination.", "info");
        return;
      }
      if (mode === "CONNECT") {
        if (!connectDraft) {
          if (!selectedIds.includes(trackId)) { showToast("Choose an endpoint on a selected source Track.", "danger"); return; }
          setConnectDraft({ trackId, pointIndex, point: track.geometry.coordinates[pointIndex] });
          showToast("Source endpoint selected. Choose a destination connection point.", "info");
          return;
        }
        if (connectDraft.trackId === trackId) { showToast("Choose a different Track or a turnout.", "danger"); return; }
        const targetPoint = track.geometry.coordinates[pointIndex];
        const sourceTrack = tracksById.get(connectDraft.trackId);
        if (!sourceTrack || track.status === "REJECTED") { showToast("The selected connection is not compatible.", "danger"); return; }
        commit({
          action: "TRACK_CONNECTED",
          assetId: `${sourceTrack.id},${track.id}`,
          previousValue: { source: sourceTrack, destination: track },
          newValue: { connectedTo: track.id, point: targetPoint },
          source: sourceTrack.source,
        }, (next) => {
          const displacedIds = unique([
            ...detachEndpointTopology(next, sourceTrack.id, connectDraft.pointIndex),
            ...detachEndpointTopology(next, track.id, pointIndex),
          ]);
          const source = next.tracks.find((item) => item.id === sourceTrack.id);
          const destination = next.tracks.find((item) => item.id === track.id);
          source.geometry.coordinates[connectDraft.pointIndex] = targetPoint.slice();
          source.startChainage = chainageAt(source.geometry.coordinates[0][0], station);
          source.endChainage = chainageAt(source.geometry.coordinates[source.geometry.coordinates.length - 1][0], station);
          source.connectedAssetIds = unique([...source.connectedAssetIds, track.id]);
          destination.connectedAssetIds = unique([...destination.connectedAssetIds, sourceTrack.id]);
          source.status = "MODIFIED";
          destination.status = "MODIFIED";
          source.version = (source.version || 1) + 1;
          destination.version = (destination.version || 1) + 1;
          source.issues = source.issues.filter((issue) => !["DISCONNECTED", "MISSING_CONNECTION"].includes(issue));
          destination.issues = destination.issues.filter((issue) => issue !== "MISSING_CONNECTION");
          next.topology = next.topology.filter((relation) => !(
            relation.sourceAssetId === sourceTrack.id && relation.sourceEndpointIndex === connectDraft.pointIndex && relation.destinationAssetId === track.id
          ));
          next.topology.push({
            id: `TOP-${Date.now()}`,
            sourceAssetId: sourceTrack.id,
            sourceEndpointIndex: connectDraft.pointIndex,
            sourceEndpointRole: endpointRoleForIndex(source, connectDraft.pointIndex),
            destinationAssetId: track.id,
            destinationEndpointIndex: pointIndex,
            destinationEndpointRole: endpointRoleForIndex(destination, pointIndex),
            relationship: "CONNECTED_TO",
          });
          syncConnectedAssetIds(next);
          refreshConnectivity(next, [sourceTrack.id, track.id, ...displacedIds]);
        });
        setLastConnection({ point: targetPoint, label: `${sourceTrack.id} connected to ${track.id}` });
        window.clearTimeout(connectionTimer.current);
        connectionTimer.current = window.setTimeout(() => setLastConnection(null), 2200);
        setMode("SELECT");
        setConnectDraft(null);
        showToast(`${sourceTrack.id} connected to ${track.id}.`);
      }
    }, [commit, connectDraft, mode, selectedIds, showToast, station, tracksById]);

    const connectToTurnout = useCallback((turnout) => {
      if (mode !== "CONNECT" || !connectDraft) { showToast("Select a source Track endpoint first.", "danger"); return; }
      const sourceTrack = tracksById.get(connectDraft.trackId);
      if (!sourceTrack) return;
      const targetPoint = [turnout.x, turnout.y];
      commit({
        action: "TRACK_CONNECTED",
        assetId: sourceTrack.id,
        previousValue: { connectedAssetIds: sourceTrack.connectedAssetIds, geometry: sourceTrack.geometry },
        newValue: { connectedTo: turnout.id, point: targetPoint },
        source: sourceTrack.source,
      }, (next) => {
        const displacedIds = detachEndpointTopology(next, sourceTrack.id, connectDraft.pointIndex);
        const source = next.tracks.find((track) => track.id === sourceTrack.id);
        source.geometry.coordinates[connectDraft.pointIndex] = targetPoint.slice();
        source.startChainage = chainageAt(source.geometry.coordinates[0][0], station);
        source.endChainage = chainageAt(source.geometry.coordinates[source.geometry.coordinates.length - 1][0], station);
        source.connectedAssetIds = unique([...source.connectedAssetIds, turnout.id]);
        source.status = "MODIFIED";
        source.version = (source.version || 1) + 1;
        source.issues = source.issues.filter((issue) => !["DISCONNECTED", "MISSING_CONNECTION"].includes(issue));
        next.topology = next.topology.filter((relation) => !(
          relation.sourceAssetId === sourceTrack.id && relation.sourceEndpointIndex === connectDraft.pointIndex && relation.destinationAssetId === turnout.id
        ));
        next.topology.push({
          id: `TOP-${Date.now()}`,
          sourceAssetId: sourceTrack.id,
          sourceEndpointIndex: connectDraft.pointIndex,
          sourceEndpointRole: endpointRoleForIndex(source, connectDraft.pointIndex),
          destinationAssetId: turnout.id,
          destinationEndpointRole: null,
          relationship: "CONNECTED_TO",
        });
        syncConnectedAssetIds(next);
        refreshConnectivity(next, [sourceTrack.id, ...displacedIds]);
      });
      setLastConnection({ point: targetPoint, label: `${sourceTrack.id} connected to ${turnout.id}` });
      window.clearTimeout(connectionTimer.current);
      connectionTimer.current = window.setTimeout(() => setLastConnection(null), 2200);
      setMode("SELECT");
      setConnectDraft(null);
      showToast(`${sourceTrack.id} connected to turnout ${turnout.id}.`);
    }, [commit, connectDraft, mode, showToast, station, tracksById]);

    const finishExtend = useCallback((rawPoint, explicitTarget = null) => {
      if (!extendDraft) { showToast("Select the Track endpoint to extend.", "danger"); return; }
      const track = tracksById.get(extendDraft.trackId);
      if (!track) return;
      const resolved = explicitTarget ? { point: explicitTarget.point.slice(), target: explicitTarget } : resolvePoint(rawPoint, `${track.id}:${extendDraft.pointIndex}`);
      if (resolved.target?.assetId === track.id) { showToast("Extend to a different Track, turnout, or free destination.", "danger"); return; }
      if (samePoint(resolved.point, extendDraft.point)) { showToast("Choose a destination away from the selected endpoint.", "danger"); return; }
      const coordinates = track.geometry.coordinates.slice();
      if (extendDraft.pointIndex === 0) coordinates.unshift(resolved.point);
      else coordinates.push(resolved.point);
      const error = validateCoordinates(coordinates);
      if (error) { showToast(error, "danger"); return; }
      commit({
        action: "TRACK_EXTENDED",
        assetId: track.id,
        previousValue: { geometry: track.geometry, connectedAssetIds: track.connectedAssetIds },
        newValue: { destination: resolved.point, snapTarget: resolved.target?.assetId || null },
        source: track.source,
      }, (next) => {
        const target = next.tracks.find((item) => item.id === track.id);
        const oldLastIndex = target.geometry.coordinates.length - 1;
        const extendedRole = endpointRoleForIndex(target, extendDraft.pointIndex);
        const touchesExtendedEndpoint = (relation) => relationTouchesEndpoint(relation, "source", track.id, extendDraft.pointIndex, extendedRole)
          || relationTouchesEndpoint(relation, "destination", track.id, extendDraft.pointIndex, extendedRole);
        const detachedAssetIds = next.topology.filter(touchesExtendedEndpoint).map((relation) => (
          relation.sourceAssetId === track.id ? relation.destinationAssetId : relation.sourceAssetId
        ));
        next.topology = next.topology.filter((relation) => !touchesExtendedEndpoint(relation)).map((relation) => {
          if (extendDraft.pointIndex !== 0) return relation;
          return {
            ...relation,
            sourceEndpointIndex: relation.sourceAssetId === track.id && relation.sourceEndpointIndex === oldLastIndex ? coordinates.length - 1 : relation.sourceEndpointIndex,
            destinationEndpointIndex: relation.destinationAssetId === track.id && relation.destinationEndpointIndex === oldLastIndex ? coordinates.length - 1 : relation.destinationEndpointIndex,
            sourceSegmentIndex: relation.sourceAssetId === track.id && Number.isInteger(relation.sourceSegmentIndex) ? relation.sourceSegmentIndex + 1 : relation.sourceSegmentIndex,
            destinationSegmentIndex: relation.destinationAssetId === track.id && Number.isInteger(relation.destinationSegmentIndex) ? relation.destinationSegmentIndex + 1 : relation.destinationSegmentIndex,
          };
        });
        target.geometry = { type: "LineString", coordinates };
        target.startChainage = chainageAt(coordinates[0][0], station);
        target.endChainage = chainageAt(coordinates[coordinates.length - 1][0], station);
        target.connectedAssetIds = target.connectedAssetIds.filter((id) => !detachedAssetIds.includes(id));
        next.tracks.forEach((item) => {
          if (detachedAssetIds.includes(item.id)) item.connectedAssetIds = item.connectedAssetIds.filter((id) => id !== track.id);
        });
        if (resolved.target?.assetId) {
          target.connectedAssetIds = unique([...target.connectedAssetIds, resolved.target.assetId]);
          const destination = next.tracks.find((item) => item.id === resolved.target.assetId);
          if (destination) {
            destination.connectedAssetIds = unique([...destination.connectedAssetIds, track.id]);
            destination.status = "MODIFIED";
            destination.version = (destination.version || 1) + 1;
            destination.issues = destination.issues.filter((issue) => issue !== "MISSING_CONNECTION");
          }
        }
        target.status = "MODIFIED";
        target.version = (target.version || 1) + 1;
        target.issues = resolved.target?.assetId
          ? target.issues.filter((issue) => !["DISCONNECTED", "MISSING_CONNECTION"].includes(issue))
          : unique([...target.issues, "MISSING_CONNECTION"]);
        if (resolved.target?.assetId) next.topology.push({
          id: `TOP-${Date.now()}`,
          sourceAssetId: track.id,
          sourceEndpointIndex: extendDraft.pointIndex === 0 ? 0 : coordinates.length - 1,
          sourceEndpointRole: extendDraft.pointIndex === 0 ? "START" : "END",
          destinationAssetId: resolved.target.assetId,
          destinationEndpointIndex: resolved.target.endpointIndex ?? null,
          destinationEndpointRole: resolved.target.type === "TRACK_ENDPOINT" ? (resolved.target.endpointIndex === 0 ? "START" : "END") : null,
          relationship: "CONNECTED_TO",
        });
        syncConnectedAssetIds(next);
        refreshConnectivity(next, [track.id, resolved.target?.assetId, ...detachedAssetIds].filter(Boolean));
      });
      setExtendDraft(null);
      setMode("SELECT");
      setSnapIndicator(null);
      showToast(`${track.name || track.id} extended${resolved.target ? ` to ${resolved.target.label}` : ""}.`);
    }, [commit, extendDraft, resolvePoint, showToast, station, tracksById]);

    const handleTrackClick = useCallback((event, track) => {
      event.stopPropagation();
      if (dragRef.current?.moved) return;
      const point = eventPoint(event);
      if (mode === "PAN" || mode === "DRAW") return;
      if (mode === "MAP") { showToast("That geometry is already classified as a Track.", "danger"); return; }
      if (mode === "TRIM") {
        if (selectedIds.length !== 1 || selectedIds[0] !== track.id) { showToast("Click the selected Track to trim it.", "danger"); return; }
        chooseTrim(track, point);
        return;
      }
      if (mode === "SPLIT") {
        if (selectedIds.length !== 1 || selectedIds[0] !== track.id) { showToast("Click the selected Track to split it.", "danger"); return; }
        chooseSplit(track, point);
        return;
      }
      if (mode === "EXTEND" && extendDraft) {
        const projection = projectPointToPolyline(point, track.geometry.coordinates);
        finishExtend(projection.point, { id: `${track.id}:point`, assetId: track.id, type: "TRACK_POINT", point: projection.point, label: track.name || track.id });
        return;
      }
      if (mode === "CONNECT") {
        if (!connectDraft) showToast("Select a source endpoint first.", "danger");
        else showToast("Choose a highlighted Track endpoint or turnout connection point.", "danger");
        return;
      }
      selectTrack(track.id, event.shiftKey);
    }, [chooseSplit, chooseTrim, connectDraft, eventPoint, extendDraft, finishExtend, mode, selectTrack, selectedIds, showToast]);

    const handleUnmappedClick = useCallback((event, geometry) => {
      event.stopPropagation();
      if (mode !== "MAP") { showToast("Use Add Track → Map Existing Geometry to classify this source element.", "info"); return; }
      setMappingTargetId(geometry.id);
      setSnapIndicator(null);
      setFilter("ALL");
    }, [mode, showToast]);

    const handleTrackPointerDown = useCallback((event, track) => {
      if (mode !== "SELECT" || selectedIds.length !== 1 || selectedIds[0] !== track.id || track.status === "REJECTED") return;
      event.stopPropagation();
      const start = eventPoint(event);
      dragRef.current = { kind: "TRACK", pointerId: event.pointerId, trackId: track.id, start, original: clone(track.geometry.coordinates), moved: false };
      svgRef.current?.setPointerCapture?.(event.pointerId);
    }, [eventPoint, mode, selectedIds]);

    const handleControlPointerDown = useCallback((event, track, pointIndex) => {
      if (mode !== "EDIT_GEOMETRY") return;
      event.stopPropagation();
      dragRef.current = { kind: "POINT", pointerId: event.pointerId, trackId: track.id, pointIndex, start: eventPoint(event), original: clone(track.geometry.coordinates), moved: false };
      svgRef.current?.setPointerCapture?.(event.pointerId);
    }, [eventPoint, mode]);

    const handleCanvasPointerDown = useCallback((event) => {
      if (mode !== "PAN") return;
      const matrix = svgRef.current?.getScreenCTM?.();
      const screenScale = matrix ? Math.hypot(matrix.a, matrix.b) : 0;
      dragRef.current = {
        kind: "PAN",
        pointerId: event.pointerId,
        startClient: [event.clientX, event.clientY],
        startView: { ...view },
        unitsPerPixel: screenScale > 0 ? 1 / screenScale : null,
        moved: false,
      };
      svgRef.current?.setPointerCapture?.(event.pointerId);
    }, [mode, view]);

    const handleCanvasPointerMove = useCallback((event) => {
      const raw = eventPoint(event);
      const drag = dragRef.current;
      if (drag?.kind === "PAN") {
        const rect = svgRef.current?.getBoundingClientRect();
        const fallbackX = rect?.width ? drag.startView.w / rect.width : 0;
        const fallbackY = rect?.height ? drag.startView.h / rect.height : 0;
        const dx = (event.clientX - drag.startClient[0]) * (drag.unitsPerPixel || fallbackX);
        const dy = (event.clientY - drag.startClient[1]) * (drag.unitsPerPixel || fallbackY);
        if (Math.abs(dx) + Math.abs(dy) > 0.5) drag.moved = true;
        setView({ ...drag.startView, x: drag.startView.x - dx, y: drag.startView.y - dy });
        return;
      }
      if (drag?.kind === "POINT") {
        const resolved = resolvePoint(raw, `${drag.trackId}:${drag.pointIndex}`);
        const coordinates = clone(drag.original);
        coordinates[drag.pointIndex] = resolved.point;
        if (distance(raw, drag.start) > 0.5) drag.moved = true;
        setDraftGeometry({ trackId: drag.trackId, coordinates });
        setSnapIndicator(resolved.target);
        return;
      }
      if (drag?.kind === "TRACK") {
        const dx = raw[0] - drag.start[0];
        const dy = raw[1] - drag.start[1];
        if (Math.abs(dx) + Math.abs(dy) > 0.5) drag.moved = true;
        setDraftGeometry({ trackId: drag.trackId, coordinates: drag.original.map((point) => [point[0] + dx, point[1] + dy]) });
        return;
      }
      setCursorPoint(raw);
      if (["DRAW", "EXTEND", "CONNECT"].includes(mode)) setSnapIndicator(resolvePoint(raw, connectDraft ? `${connectDraft.trackId}:${connectDraft.pointIndex}` : "")?.target || null);
      else setSnapIndicator(null);
    }, [eventPoint, mode, resolvePoint]);

    const handleCanvasPointerUp = useCallback((event) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (drag.kind === "POINT" || drag.kind === "TRACK") {
        const raw = eventPoint(event);
        let coordinates = drag.original;
        if (drag.kind === "POINT") {
          coordinates = clone(drag.original);
          coordinates[drag.pointIndex] = resolvePoint(raw, `${drag.trackId}:${drag.pointIndex}`).point;
        } else {
          const dx = raw[0] - drag.start[0];
          const dy = raw[1] - drag.start[1];
          coordinates = drag.original.map((point) => [point[0] + dx, point[1] + dy]);
        }
        if (drag.moved) commitGeometry(drag.trackId, coordinates, "TRACK_GEOMETRY_UPDATED", { operation: drag.kind === "POINT" ? "CONTROL_POINT_MOVED" : "TRACK_MOVED" });
      }
      setDraftGeometry(null);
      setSnapIndicator(null);
      dragRef.current = null;
      try { svgRef.current?.releasePointerCapture?.(event.pointerId); } catch (error) { /* pointer already released */ }
    }, [commitGeometry, eventPoint, resolvePoint]);

    const handleCanvasClick = useCallback((event) => {
      if (dragRef.current?.moved) return;
      const raw = eventPoint(event);
      if (mode === "DRAW") {
        const resolved = resolvePoint(raw);
        setDrawPoints((current) => [...current, resolved.point]);
        setSnapIndicator(resolved.target);
        return;
      }
      if (mode === "EXTEND" && extendDraft) { finishExtend(raw); return; }
      if (mode === "CONNECT") {
        const target = nearestSnap(raw, connectDraft ? `${connectDraft.trackId}:${connectDraft.pointIndex}` : "");
        if (target?.type === "TRACK_ENDPOINT") {
          chooseEndpoint(target.assetId, target.endpointIndex);
        } else if (connectDraft && target?.type === "TURNOUT") {
          const turnout = D.TURNOUTS.find((item) => item.id === target.assetId);
          if (turnout) connectToTurnout(turnout);
        } else showToast(connectDraft ? "Connect to a valid Track endpoint or turnout." : "Choose a source endpoint on a selected Track.", "danger");
        return;
      }
      if (mode === "SELECT" && !event.shiftKey) {
        setSelectedIds([]);
        setExpandedId(null);
      }
    }, [chooseEndpoint, connectDraft, connectToTurnout, eventPoint, extendDraft, finishExtend, mode, nearestSnap, resolvePoint, showToast]);

    const handleCanvasDoubleClick = useCallback((event) => {
      if (mode !== "DRAW") return;
      event.preventDefault();
      const raw = eventPoint(event);
      const resolved = resolvePoint(raw);
      createDrawnTrack([...drawPoints, resolved.point]);
    }, [createDrawnTrack, drawPoints, eventPoint, mode, resolvePoint]);

    useEffect(() => {
      const onKeyDown = (event) => {
        const target = event.target;
        const editingField = target instanceof HTMLElement && (target.matches("input,select,textarea") || target.isContentEditable);
        if (event.key === "Escape") {
          if (editingField) target.blur();
          cancelActiveOperation();
          return;
        }
        if (editingField) return;
        const command = event.metaKey || event.ctrlKey;
        if (command && event.key.toLowerCase() === "z") {
          event.preventDefault();
          if (event.shiftKey) redo();
          else undo();
          return;
        }
        if ((event.key === "Delete" || event.key === "Backspace") && selectedIds.length) {
          event.preventDefault();
          requestReject();
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [cancelActiveOperation, redo, requestReject, selectedIds.length, undo]);

    const modeInstruction = ({
      DRAW: "Draw Track · click points · double-click to finish · Esc cancels",
      MAP: mappingTargetId ? "Complete the Track mapping form in the right panel" : "Map Existing Geometry · select an unidentified line",
      EDIT_GEOMETRY: "Edit Geometry · drag points · double-click to add · right-click to remove",
      EXTEND: extendDraft ? "Extend · click a destination" : "Extend · select a Track endpoint",
      TRIM: "Trim · click the desired trimming point",
      SPLIT: "Split · click the split location",
      CONNECT: connectDraft ? "Connect · choose a destination Track endpoint or turnout" : "Connect · choose the source Track endpoint",
      PAN: "Pan · drag the ESP preview",
    })[mode];

    const renderCoordinates = (track) => draftGeometry?.trackId === track.id ? draftGeometry.coordinates : track.geometry.coordinates;
    const selectedTrack = selectedTracks.length === 1 ? selectedTracks[0] : null;
    const markerRadius = Math.max(4, view.w / 130);
    const hitRadius = Math.max(8, view.w / 65);
    const issueRadius = Math.max(7, view.w / 100);
    const sourceLabel = (item) => item.id === "TX-1"
      ? `KM ${stationBaseChainage(station).toFixed(3)}`
      : item.id === "TX-2"
        ? `KM ${(stationBaseChainage(station) + 1.48).toFixed(3)}`
        : item.text;
    const operationPreview = (() => {
      if (operationConfirm?.type === "JOIN") return <line className="ptc-operation-line" x1={operationConfirm.pair.a[0]} y1={operationConfirm.pair.a[1]} x2={operationConfirm.pair.b[0]} y2={operationConfirm.pair.b[1]} />;
      if (operationConfirm?.type === "TRIM") return <polyline className="ptc-operation-line" data-tone="remove" points={operationConfirm.remove.map((point) => point.join(",")).join(" ")} />;
      if (operationConfirm?.type === "SPLIT") return <>
        <polyline className="ptc-operation-line" data-tone="split-a" points={operationConfirm.left.map((point) => point.join(",")).join(" ")} />
        <polyline className="ptc-operation-line" data-tone="split-b" points={operationConfirm.right.map((point) => point.join(",")).join(" ")} />
      </>;
      return null;
    })();

    return (
      <div className="ptc-shell">
        <datalist id="ptc-track-names">
          {["UP MAIN LINE", "DN MAIN LINE", "LOOP LINE", "SIDING", "SHUNTING NECK"].map((name) => <option key={name} value={name} />)}
        </datalist>
        <section className="ptc-canvas-col" aria-label="Editable ESP Preview">
          <header className="ptc-preview-head">
            <div className="ptc-head-copy">
              <div className="ptc-title"><Icon name="track" size={16} />ESP Preview</div>
              <div className="ptc-subtitle">{station?.name || "Station"} · {documentState.sourceDocument?.fileName || "Uploaded ESP"} · Track geometry correction area</div>
            </div>
            <div className="ptc-head-actions">
              <button type="button" className="ptc-header-btn" title="Highlight All Extracted Tracks" aria-label="Highlight All Extracted Tracks" data-active={highlightMode === "ALL" ? "true" : "false"} onClick={() => setHighlightMode((current) => current === "ALL" ? "NONE" : "ALL")}><Icon name="eye" size={13} /><span>Highlight All Extracted</span></button>
              <button type="button" className="ptc-header-btn" title="Highlight Tracks with Issues" aria-label="Highlight Tracks with Issues" data-active={highlightMode === "ISSUES" ? "true" : "false"} onClick={() => setHighlightMode((current) => current === "ISSUES" ? "NONE" : "ISSUES")}><Icon name="alert_tri" size={13} /><span>Highlight Issues</span></button>
              <span className="ptc-asset-count">{activeTrackCount} assets</span>
            </div>
          </header>
          <div className="ptc-stage">
            <svg
              ref={svgRef}
              className="ptc-svg"
              data-mode={mode}
              data-dragging={dragRef.current ? "true" : "false"}
              viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
              style={{ "--ptc-screen-font": `${view.w / 70}px` }}
              aria-label="Station ESP track editing canvas"
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerCancel={handleCanvasPointerUp}
              onClick={handleCanvasClick}
              onDoubleClick={handleCanvasDoubleClick}
            >
              <defs>
                <pattern id="ptc-grid-small" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#e8ebef" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x={view.x - 500} y={view.y - 500} width={view.w + 1000} height={view.h + 1000} fill="#fbfbf8" />
              <rect x={view.x - 500} y={view.y - 500} width={view.w + 1000} height={view.h + 1000} fill="url(#ptc-grid-small)" />
              {documentState.sourceDocument?.previewImage && <image className="ptc-source-image" href={documentState.sourceDocument.previewImage} x="60" y="80" width="1480" height="370" preserveAspectRatio="none" />}
              {D.STRUCTURES.map((item) => <g key={item.id}><rect className="ptc-structure" x={item.x} y={item.y} width={item.w} height={item.h} /><text className="ptc-source-label" x={item.x + item.w / 2} y={item.y + item.h / 2 + 4} textAnchor="middle">{item.label}</text></g>)}
              {D.PLATFORMS.map((item) => <g key={item.id}><rect className="ptc-platform" x={item.x} y={item.y} width={item.w} height={item.h} /><text className="ptc-source-label" x={item.x + item.w / 2} y={item.y + 16} textAnchor="middle">{item.label}</text></g>)}
              {D.DIMENSIONS.map((item) => <g key={item.id} opacity=".52"><line x1={item.x1} y1={item.y} x2={item.x2} y2={item.y} stroke="#64748b" strokeWidth="1" /><text className="ptc-source-label" x={(item.x1 + item.x2) / 2} y={item.y - 5} textAnchor="middle">{item.label}</text></g>)}
              {D.TEXT_LABELS.filter((item) => item.text).map((item) => <text className="ptc-source-label" key={item.id} x={item.x} y={item.y} textAnchor={item.anchor}>{sourceLabel(item)}</text>)}
              {documentState.unmapped.map((geometry) => <g key={geometry.id}>
                {geometry.paths.map((path, pathIndex) => <g key={`${geometry.id}:${pathIndex}`}>
                  <polyline className="ptc-unmapped" data-active={mappingTargetId === geometry.id ? "true" : "false"} points={path.map((point) => point.join(",")).join(" ")} />
                  <polyline className="ptc-unmapped-hit" points={path.map((point) => point.join(",")).join(" ")} onClick={(event) => handleUnmappedClick(event, geometry)} />
                </g>)}
                {highlightMode === "ISSUES" && geometry.paths[0]?.[0] && <g transform={`translate(${geometry.paths[0][0][0]},${geometry.paths[0][0][1]})`}><circle className="ptc-issue-marker" r={issueRadius} /><text className="ptc-issue-text" y=".5">!</text></g>}
              </g>)}
              {documentState.tracks.map((track) => {
                const coordinates = renderCoordinates(track);
                const points = coordinates.map((point) => point.join(",")).join(" ");
                const selected = selectedIds.includes(track.id);
                const highlighted = highlightMode === "ALL" && track.source === "AI_EXTRACTION" && track.status !== "REJECTED" || highlightMode === "ISSUES" && isIssueTrack(track);
                const issuePoint = coordinates[Math.floor(coordinates.length / 2)];
                return <g key={track.id}>
                  {highlighted && <polyline className="ptc-track-halo" data-tone={highlightMode === "ISSUES" ? "issue" : "all"} points={points} />}
                  <polyline className="ptc-track" data-rejected={track.status === "REJECTED" ? "true" : "false"} points={points} />
                  {selected && <polyline className="ptc-selected-line" points={points} />}
                  <polyline
                    className="ptc-track-hit"
                    data-movable={mode === "SELECT" && selected && selectedIds.length === 1 ? "true" : "false"}
                    points={points}
                    style={{ pointerEvents: mode === "DRAW" ? "none" : "stroke" }}
                    tabIndex={track.status === "REJECTED" ? -1 : 0}
                    role="button"
                    aria-label={`Select ${track.name || track.id}`}
                    onClick={(event) => handleTrackClick(event, track)}
                    onPointerDown={(event) => handleTrackPointerDown(event, track)}
                    onDoubleClick={(event) => { event.stopPropagation(); addControlPoint(track.id, eventPoint(event)); }}
                    onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") selectTrack(track.id, event.shiftKey); }}
                  />
                  {highlightMode === "ISSUES" && isIssueTrack(track) && issuePoint && <g transform={`translate(${issuePoint[0]},${issuePoint[1]})`}><circle className="ptc-issue-marker" r={issueRadius} /><text className="ptc-issue-text" y=".5">!</text></g>}
                  {selected && mode === "EDIT_GEOMETRY" && coordinates.map((point, pointIndex) => <g
                    key={`${track.id}:control:${pointIndex}`}
                    onPointerDown={(event) => handleControlPointerDown(event, track, pointIndex)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      const rect = svgRef.current?.getBoundingClientRect();
                      setPointMenu({ trackId: track.id, pointIndex, left: event.clientX - (rect?.left || 0), top: event.clientY - (rect?.top || 0) });
                    }}
                  >
                    <circle className="ptc-node-hit" cx={point[0]} cy={point[1]} r={hitRadius} />
                    <circle className="ptc-control" data-endpoint={pointIndex === 0 || pointIndex === coordinates.length - 1 ? "true" : "false"} cx={point[0]} cy={point[1]} r={markerRadius} pointerEvents="none" />
                  </g>)}
                  {selected && ["EXTEND", "CONNECT"].includes(mode) && [0, coordinates.length - 1].map((pointIndex) => <g
                    key={`${track.id}:endpoint:${pointIndex}`}
                    onClick={(event) => { event.stopPropagation(); chooseEndpoint(track.id, pointIndex); }}
                  >
                    <circle className="ptc-node-hit" cx={coordinates[pointIndex][0]} cy={coordinates[pointIndex][1]} r={hitRadius} />
                    <circle className="ptc-control" data-endpoint="true" cx={coordinates[pointIndex][0]} cy={coordinates[pointIndex][1]} r={markerRadius} pointerEvents="none" />
                  </g>)}
                  {mode === "CONNECT" && connectDraft && !selected && track.status !== "REJECTED" && [0, coordinates.length - 1].map((pointIndex) => <g
                    key={`${track.id}:target:${pointIndex}`}
                    onClick={(event) => { event.stopPropagation(); chooseEndpoint(track.id, pointIndex); }}
                  >
                    <circle className="ptc-node-hit" cx={coordinates[pointIndex][0]} cy={coordinates[pointIndex][1]} r={hitRadius} />
                    <circle className="ptc-control" data-endpoint="true" cx={coordinates[pointIndex][0]} cy={coordinates[pointIndex][1]} r={markerRadius} pointerEvents="none" />
                  </g>)}
                </g>;
              })}
              {D.TURNOUTS.map((turnout) => <g key={turnout.id} onClick={(event) => { if (mode === "CONNECT") { event.stopPropagation(); connectToTurnout(turnout); } else if (mode === "EXTEND" && extendDraft) { event.stopPropagation(); finishExtend([turnout.x, turnout.y], { id: turnout.id, assetId: turnout.id, type: "TURNOUT", point: [turnout.x, turnout.y], label: `Turnout ${turnout.id}` }); } }}>
                <circle className="ptc-node-hit" cx={turnout.x} cy={turnout.y} r={hitRadius} />
                <circle className="ptc-turnout" data-target={(["CONNECT", "EXTEND"].includes(mode) && (connectDraft || extendDraft)) ? "true" : "false"} cx={turnout.x} cy={turnout.y} r={markerRadius} pointerEvents="none" />
                <text className="ptc-source-label" x={turnout.x + 9} y={turnout.y - 8}>{turnout.id}</text>
              </g>)}
              {D.BUFFER_STOPS.map((item) => <g key={item.id}><line x1={item.x} y1={item.y - 9} x2={item.x} y2={item.y + 9} stroke="#263747" strokeWidth="3" /><text className="ptc-source-label" x={item.x + 8} y={item.y + 4}>{item.id}</text></g>)}
              {drawPoints.length > 0 && <polyline className="ptc-operation-line" points={[...drawPoints, cursorPoint ? resolvePoint(cursorPoint).point : drawPoints[drawPoints.length - 1]].map((point) => point.join(",")).join(" ")} />}
              {drawPoints.map((point, index) => <circle className="ptc-control" key={`draw:${index}`} cx={point[0]} cy={point[1]} r={markerRadius} />)}
              {extendDraft && cursorPoint && <line className="ptc-operation-line" x1={extendDraft.point[0]} y1={extendDraft.point[1]} x2={resolvePoint(cursorPoint, `${extendDraft.trackId}:${extendDraft.pointIndex}`).point[0]} y2={resolvePoint(cursorPoint, `${extendDraft.trackId}:${extendDraft.pointIndex}`).point[1]} />}
              {connectDraft && cursorPoint && <line className="ptc-operation-line" x1={connectDraft.point[0]} y1={connectDraft.point[1]} x2={cursorPoint[0]} y2={cursorPoint[1]} />}
              {operationPreview}
              {snapIndicator && <g transform={`translate(${snapIndicator.point[0]},${snapIndicator.point[1]})`}><circle className="ptc-snap-marker" r={issueRadius} /><path d="M-12 0H12M0-12V12" stroke="var(--accent)" strokeWidth="1.5" /><text className="ptc-snap-label" x="12" y="-12">Snap: {snapIndicator.label}</text></g>}
              {lastConnection && <g transform={`translate(${lastConnection.point[0]},${lastConnection.point[1]})`}><circle className="ptc-snap-marker" r={issueRadius} /><path d="M-5 0l3 3 7-7" fill="none" stroke="var(--success-text)" strokeWidth="2.5" /><text className="ptc-snap-label" x="14" y="-14">{lastConnection.label}</text></g>}
            </svg>
            {modeInstruction && <div className="ptc-mode-banner"><Icon name={mode === "PAN" ? "hand" : mode === "MAP" ? "target" : mode === "CONNECT" ? "branch" : "edit"} size={13} />{modeInstruction}</div>}
            {!!selectedIds.length && <div className="ptc-selection-note"><Icon name="cursor" size={12} />{selectedIds.length} Track{selectedIds.length === 1 ? "" : "s"} Selected</div>}
            {operationConfirm && <div className="ptc-operation-confirm">
              <div className="ptc-operation-copy">
                {operationConfirm.type === "JOIN" ? "Join selected track segments?" : operationConfirm.type === "SPLIT" ? "Split Track at this location?" : "Trim highlighted Track portion?"}
                <span>{operationConfirm.type === "JOIN" ? `${operationConfirm.firstId} · ${operationConfirm.secondId}` : operationConfirm.trackId}</span>
              </div>
              {operationConfirm.type === "TRIM" && <button type="button" className="ptc-inline-btn" onClick={() => setOperationConfirm((current) => ({ ...current, keep: current.remove, remove: current.keep, keepSide: current.keepSide === "start" ? "end" : "start" }))}>Swap retained side</button>}
              <button type="button" className="ptc-inline-btn" onClick={() => setOperationConfirm(null)}>Cancel</button>
              <button type="button" className="ptc-inline-btn" data-primary="true" onClick={confirmPendingOperation}>{operationConfirm.type === "JOIN" ? "Join" : operationConfirm.type === "SPLIT" ? "Split" : "Trim"}</button>
            </div>}
            {pointMenu && <div className="ptc-point-menu" style={{ left: pointMenu.left, top: pointMenu.top }} role="menu">
              <button type="button" role="menuitem" onClick={() => { removeControlPoint(pointMenu.trackId, pointMenu.pointIndex); setPointMenu(null); }}><Icon name="trash" size={13} />Remove Point</button>
            </div>}
            <TrackToolbar
              mode={mode}
              selectedCount={selectedIds.length}
              snapEnabled={snapEnabled}
              canUndo={history.past.length > 0}
              canRedo={history.future.length > 0}
              addOpen={addMenuOrigin === "toolbar"}
              onMode={changeMode}
              onZoomIn={() => zoomBy(0.82)}
              onZoomOut={() => zoomBy(1.22)}
              onFit={() => setView(FIT_VIEW)}
              onAddToggle={() => setAddMenuOrigin((current) => current === "toolbar" ? null : "toolbar")}
              onDraw={startDraw}
              onMap={startMap}
              onEdit={startEditGeometry}
              onExtend={startExtend}
              onTrim={startTrim}
              onJoin={startJoin}
              onSplit={startSplit}
              onConnect={startConnect}
              onSnap={() => setSnapEnabled((current) => !current)}
              onReject={() => requestReject()}
              onUndo={undo}
              onRedo={redo}
            />
          </div>
          <div className="ptc-statusbar">
            <span>Mode <strong>{mode.replaceAll("_", " ")}</strong></span>
            <span>Snap <strong>{snapEnabled ? "ON" : "OFF"}</strong></span>
            <span>Zoom <strong>{Math.round((FIT_VIEW.w / view.w) * 100)}%</strong></span>
            <span>Audit <strong>{documentState.audit.length}</strong></span>
            <span className="ptc-status-spacer" />
            <span className="ptc-save-state" data-saving={saveState === "Saving..." ? "true" : "false"} data-error={saveState === "Save failed" ? "true" : "false"}><Icon name={saveState === "Saving..." ? "refresh" : saveState === "Save failed" ? "alert" : "check_circle"} size={12} />{saveState}{lastSavedAt && saveState === "Saved" ? ` ${lastSavedAt}` : ""}</span>
          </div>
        </section>

        <aside className="ptc-panel" aria-label="Track Review Panel">
          <div className="ptc-panel-head">
            <div className="ptc-panel-title-row">
              <div className="ptc-panel-title">Tracks</div>
              <div className="ptc-panel-actions">
                <button type="button" className="ptc-header-btn" title="Highlight All Extracted Tracks" aria-label="Highlight All Extracted Tracks" data-active={highlightMode === "ALL" ? "true" : "false"} onClick={() => setHighlightMode((current) => current === "ALL" ? "NONE" : "ALL")}><Icon name="eye" size={12} />Highlight All</button>
                <button type="button" className="ptc-header-btn" title="Highlight Tracks with Issues" aria-label="Highlight Tracks with Issues" data-active={highlightMode === "ISSUES" ? "true" : "false"} onClick={() => setHighlightMode((current) => current === "ISSUES" ? "NONE" : "ISSUES")}><Icon name="alert_tri" size={12} />Issues{issueCount ? ` ${issueCount}` : ""}</button>
                <div className="ptc-add-wrap">
                  <button type="button" className="ptc-header-btn" data-active={addMenuOrigin === "header" ? "true" : "false"} onClick={() => setAddMenuOrigin((current) => current === "header" ? null : "header")}><Icon name="plus" size={12} />Add</button>
                  {addMenuOrigin === "header" && <AddTrackMenu onDraw={startDraw} onMap={startMap} />}
                </div>
              </div>
            </div>
            <div className="ptc-filter-row">
              <select className="ptc-filter" aria-label="Filter Tracks" value={filter} onChange={(event) => { setFilter(event.target.value); setSelectedIds([]); setExpandedId(null); }}>
                {FILTERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <span className="ptc-filter-summary">{filteredTracks.length} shown · {activeTrackCount} active</span>
            </div>
          </div>
          <div className="ptc-panel-scroll" ref={panelScrollRef}>
            {mappingTargetId && documentState.unmapped.some((item) => item.id === mappingTargetId) && <MappingForm
              key={mappingTargetId}
              geometry={documentState.unmapped.find((item) => item.id === mappingTargetId)}
              onCancel={() => { setMappingTargetId(null); setMode("SELECT"); }}
              onMap={mapExistingGeometry}
              onReject={rejectUnmappedGeometry}
            />}
            {!filteredTracks.length && <div className="ptc-empty"><Icon name="inbox" size={20} /><strong>No Tracks in this filter</strong><span>Choose another status or add a missing Track.</span></div>}
            {filteredTracks.map((track) => {
              const originalIndex = documentState.tracks.findIndex((item) => item.id === track.id);
              return <TrackCard
                key={track.id}
                track={track}
                index={originalIndex}
                active={selectedIds.includes(track.id)}
                expanded={expandedId === track.id}
                cardRef={(element) => { if (element) cardRefs.current.set(track.id, element); else cardRefs.current.delete(track.id); }}
                onSelect={selectTrack}
                onToggle={(id) => setExpandedId((current) => current === id ? null : id)}
                onLocate={locateTrack}
                onCommitField={commitField}
                onReject={(id) => requestReject([id])}
                onConfirm={confirmTrack}
              />;
            })}
          </div>
        </aside>

        <footer className="ptc-nav">
          <span className="ptc-nav-context">Track navigation stays in the review panel. These controls move between asset categories.</span>
          <button type="button" className="ptc-inline-btn" disabled={!canPrevious} onClick={onPrevious}><Icon name="chevron_left" size={13} />Previous</button>
          <button type="button" className="ptc-inline-btn" data-primary="true" disabled={!canNext} onClick={onNext}>Next<Icon name="chevron_right" size={13} /></button>
        </footer>

        {!!rejectIds.length && <RejectDialog tracks={rejectIds.map((id) => tracksById.get(id)).filter(Boolean)} onClose={() => setRejectIds([])} onConfirm={confirmReject} />}
        {toast && <div className="ptc-toast" data-tone={toast.tone} role="status"><Icon name={toast.tone === "danger" ? "alert" : "check_circle"} size={14} />{toast.message}</div>}
      </div>
    );
  };

  window.PIMTrackCorrectionWorkspace = PIMTrackCorrectionWorkspace;
  window.PIMTrackCorrectionTestUtils = {
    sanitiseCoordinates,
    validateCoordinates,
    projectPointToPolyline,
    splitCoordinatesAt,
    nearestEndpointPair,
    mergeTrackCoordinates,
    buildInitialDocument,
    documentMatchesContext,
    hydrateReviewDocument,
    isReviewDocument,
    storageKeyFor,
  };

  const styleElement = document.createElement("style");
  styleElement.textContent = ptcCSS;
  document.head.appendChild(styleElement);
})();
