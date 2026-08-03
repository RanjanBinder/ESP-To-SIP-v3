// Generated from pim-tracks-data.jsx. Edit the .jsx source and regenerate if needed.
(() => {
  (() => {
    const STATION = {
      name: "Nellore",
      code: "NLR",
      zone: "SCR",
      division: "Vijayawada",
      yardLimitStart: "431.240 km",
      yardLimitEnd: "432.720 km"
    };
    const DOCUMENT = {
      id: "esp-nlr-v1",
      label: "ESP v1",
      fileName: "NLR_ESP_V1-R0-A0.dwg",
      fileType: "DWG",
      extractedAt: "31 Jul 2026, 09:14",
      engineVersion: "Track Extractor 3.2"
    };
    const LAYERS = [
      { id: "TRACK", label: "Tracks", icon: "track", source: "0-TRACK-CL", visible: true },
      { id: "UNIDENTIFIED", label: "Unidentified Elements", icon: "alert_tri", source: "0-UNCLASSIFIED", visible: true },
      { id: "PLATFORM", label: "Platforms", icon: "layers", source: "PLATFORM-EDGE", visible: true },
      { id: "DIMENSION", label: "Dimensions", icon: "ruler", source: "DIM-LINEAR", visible: true },
      { id: "TEXT", label: "Text", icon: "file", source: "ANNO-TEXT", visible: true },
      { id: "STRUCTURE", label: "Structures", icon: "cube", source: "STRUCT-BLDG", visible: true }
    ];
    const TRACKS = [
      {
        id: "TRK-001",
        name: "UP Main Line",
        roadNumber: "1",
        trackType: "Main Line",
        operationalStatus: "Existing",
        trafficDirection: "UP",
        passengerGoods: "Passenger",
        berthingTrack: true,
        segmentIds: ["SEG-101", "SEG-102", "SEG-103"],
        startNodeId: "ND-W1",
        endNodeId: "ND-E1",
        startChainage: "431.240",
        endChainage: "432.720",
        length: 1480,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 94,
        validationStatus: "Ready for Confirmation",
        curvature: "Straight",
        connectedTracks: ["TRK-003"],
        connectedTurnouts: ["P-101", "P-118"],
        associatedPlatform: "PF 1",
        deadEnd: false,
        bufferStop: false,
        foulingMarks: 2
      },
      {
        id: "TRK-002",
        name: "DOWN Main Line",
        roadNumber: "2",
        trackType: "Main Line",
        operationalStatus: "Existing",
        trafficDirection: "DOWN",
        passengerGoods: "Passenger",
        berthingTrack: true,
        segmentIds: ["SEG-104", "SEG-105"],
        startNodeId: "ND-W2",
        endNodeId: "ND-E2",
        startChainage: "431.240",
        endChainage: "432.720",
        length: 1480,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 92,
        validationStatus: "Ready for Confirmation",
        curvature: "Straight",
        connectedTracks: ["TRK-005"],
        connectedTurnouts: ["P-104", "P-122"],
        associatedPlatform: "PF 2",
        deadEnd: false,
        bufferStop: false,
        foulingMarks: 2
      },
      {
        id: "TRK-003",
        name: "Road No. 1",
        roadNumber: "3",
        trackType: "Loop Line",
        operationalStatus: "Existing",
        trafficDirection: "Bidirectional",
        passengerGoods: "Passenger",
        berthingTrack: true,
        segmentIds: ["SEG-106", "SEG-107", "SEG-108"],
        startNodeId: "ND-P101",
        endNodeId: "ND-P118",
        startChainage: "431.480",
        endChainage: "432.452",
        length: 1008,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 88,
        validationStatus: "Ready for Confirmation",
        curvature: "Curved",
        connectedTracks: ["TRK-001", "TRK-004"],
        connectedTurnouts: ["P-101", "P-118"],
        associatedPlatform: "PF 1",
        deadEnd: false,
        bufferStop: false,
        foulingMarks: 2
      },
      {
        id: "TRK-004",
        name: "Road No. 2",
        roadNumber: "4",
        trackType: "Loop Line",
        operationalStatus: "Existing",
        trafficDirection: "Bidirectional",
        passengerGoods: "Goods",
        berthingTrack: false,
        segmentIds: ["SEG-109", "SEG-110"],
        startNodeId: "ND-P106",
        endNodeId: null,
        startChainage: "431.650",
        endChainage: "432.180",
        length: 546,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 76,
        validationStatus: "Needs Review",
        curvature: "Curved",
        connectedTracks: ["TRK-003"],
        connectedTurnouts: ["P-106"],
        associatedPlatform: "\u2014",
        deadEnd: false,
        bufferStop: false,
        foulingMarks: 1
      },
      {
        id: "TRK-005",
        name: "Goods Line",
        roadNumber: "5",
        trackType: "Goods Line",
        operationalStatus: "Existing",
        trafficDirection: "Bidirectional",
        passengerGoods: "Goods",
        berthingTrack: false,
        segmentIds: ["SEG-111", "SEG-112", "SEG-113"],
        startNodeId: "ND-P104",
        endNodeId: "ND-P122",
        startChainage: "431.560",
        endChainage: "432.442",
        length: 918,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 90,
        validationStatus: "Ready for Confirmation",
        curvature: "Curved",
        connectedTracks: ["TRK-002"],
        connectedTurnouts: ["P-104", "P-122"],
        associatedPlatform: "PF 2",
        deadEnd: false,
        bufferStop: false,
        foulingMarks: 2
      },
      {
        id: "TRK-006",
        name: "Pit Line",
        roadNumber: "6",
        trackType: "Pit Line",
        operationalStatus: "Existing",
        trafficDirection: "Not Applicable",
        passengerGoods: "Not Applicable",
        berthingTrack: false,
        segmentIds: ["SEG-114", "SEG-115"],
        startNodeId: "ND-P112",
        endNodeId: "ND-BS1",
        startChainage: "431.840",
        endChainage: "432.358",
        length: 518,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 84,
        validationStatus: "Ready for Confirmation",
        curvature: "Curved",
        connectedTracks: ["TRK-005"],
        connectedTurnouts: ["P-112"],
        associatedPlatform: "\u2014",
        deadEnd: true,
        bufferStop: true,
        foulingMarks: 1
      },
      // ── Needs review ───────────────────────────────────────────────────────
      {
        id: "TRK-007",
        name: "",
        roadNumber: "",
        trackType: "Shunting Neck",
        operationalStatus: "Existing",
        trafficDirection: "Not Applicable",
        passengerGoods: "Not Applicable",
        berthingTrack: false,
        segmentIds: ["SEG-116", "SEG-117"],
        startNodeId: "ND-P116",
        endNodeId: null,
        startChainage: "432.020",
        endChainage: "432.358",
        length: 338,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 58,
        validationStatus: "Needs Review",
        curvature: "Curved",
        connectedTracks: ["TRK-006"],
        connectedTurnouts: ["P-116"],
        associatedPlatform: "\u2014",
        deadEnd: false,
        bufferStop: false,
        foulingMarks: 0,
        review: {
          issues: ["Track name missing", "Incomplete geometry", "Disconnected segment"],
          suggestion: "Shunting Neck continuing east \u2014 name it and extend with the disconnected stub G-205.",
          detail: "The extracted geometry ends at chainage 432.358 without a turnout, dead end or buffer stop. Two unmapped elements sit 50 m further east on the same alignment."
        }
      },
      {
        id: "TRK-008",
        name: "Sick Line (unconfirmed)",
        roadNumber: "",
        trackType: "Other",
        operationalStatus: "Existing",
        trafficDirection: "Not Applicable",
        passengerGoods: "Not Applicable",
        berthingTrack: false,
        segmentIds: ["SEG-118", "SEG-119", "SEG-120"],
        startNodeId: "ND-W8",
        endNodeId: "ND-P106",
        startChainage: "431.140",
        endChainage: "431.652",
        length: 508,
        sourceType: "AI Auto-Mapped",
        confidenceScore: 61,
        validationStatus: "Validation Failed",
        curvature: "Curved",
        connectedTracks: ["TRK-004"],
        connectedTurnouts: ["P-106"],
        associatedPlatform: "\u2014",
        deadEnd: true,
        bufferStop: true,
        foulingMarks: 0,
        review: {
          issues: ["Possible merged tracks", "Low confidence", "Uncertain classification"],
          suggestion: "Split into a Sick Line (west stub) and the connecting ramp into Road No. 2.",
          detail: "Two branches were detected in one extracted asset. The straight west portion terminates at a buffer stop, the east portion is a turnout ramp."
        }
      }
    ];
    const SEGMENTS = [
      // TRK-001 UP Main Line
      { id: "SEG-101", trackId: "TRK-001", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M60 330 H520", start: [60, 330], end: [520, 330], length: 460 },
      { id: "SEG-102", trackId: "TRK-001", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M520 330 H1060", start: [520, 330], end: [1060, 330], length: 540 },
      { id: "SEG-103", trackId: "TRK-001", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M1060 330 H1540", start: [1060, 330], end: [1540, 330], length: 480 },
      // TRK-002 DOWN Main Line
      { id: "SEG-104", trackId: "TRK-002", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M60 386 H640", start: [60, 386], end: [640, 386], length: 580 },
      { id: "SEG-105", trackId: "TRK-002", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M640 386 H1540", start: [640, 386], end: [1540, 386], length: 900 },
      // TRK-003 Road No. 1
      { id: "SEG-106", trackId: "TRK-003", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M300 330 C352 330 360 262 412 262", start: [300, 330], end: [412, 262], length: 130 },
      { id: "SEG-107", trackId: "TRK-003", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M412 262 H1160", start: [412, 262], end: [1160, 262], length: 748 },
      { id: "SEG-108", trackId: "TRK-003", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M1160 262 C1212 262 1220 330 1272 330", start: [1160, 262], end: [1272, 330], length: 130 },
      // TRK-004 Road No. 2 (east ramp missing → group G-201)
      { id: "SEG-109", trackId: "TRK-004", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M470 262 C522 262 530 200 582 200", start: [470, 262], end: [582, 200], length: 128 },
      { id: "SEG-110", trackId: "TRK-004", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M582 200 H1000", start: [582, 200], end: [1e3, 200], length: 418 },
      // TRK-005 Goods Line (west extension missing → group G-202)
      { id: "SEG-111", trackId: "TRK-005", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M380 386 C432 386 440 452 492 452", start: [380, 386], end: [492, 452], length: 130 },
      { id: "SEG-112", trackId: "TRK-005", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M492 452 H1150", start: [492, 452], end: [1150, 452], length: 658 },
      { id: "SEG-113", trackId: "TRK-005", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M1150 452 C1202 452 1210 386 1262 386", start: [1150, 452], end: [1262, 386], length: 130 },
      // TRK-006 Pit Line
      { id: "SEG-114", trackId: "TRK-006", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M660 452 C712 452 720 520 772 520", start: [660, 452], end: [772, 520], length: 130 },
      { id: "SEG-115", trackId: "TRK-006", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M772 520 H1160", start: [772, 520], end: [1160, 520], length: 388 },
      // TRK-007 Shunting Neck (needs review)
      { id: "SEG-116", trackId: "TRK-007", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M860 520 C912 520 920 586 972 586", start: [860, 520], end: [972, 586], length: 130 },
      { id: "SEG-117", trackId: "TRK-007", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M972 586 H1180", start: [972, 586], end: [1180, 586], length: 208 },
      // TRK-008 merged asset (needs review → split)
      { id: "SEG-118", trackId: "TRK-008", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M140 140 H360", start: [140, 140], end: [360, 140], length: 220 },
      { id: "SEG-119", trackId: "TRK-008", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Line", d: "M360 140 H520", start: [360, 140], end: [520, 140], length: 160 },
      { id: "SEG-120", trackId: "TRK-008", layer: "TRACK", sourceLayer: "0-TRACK-CL", geometryType: "Arc", d: "M520 140 C572 140 580 200 632 200", start: [520, 140], end: [632, 200], length: 128 },
      // ── Unidentified: G-201 · completes Road No. 2 to the east ──────────────
      { id: "ELM-201", trackId: null, groupId: "G-201", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Line", d: "M1000 200 H1090", start: [1e3, 200], end: [1090, 200], length: 90 },
      { id: "ELM-202", trackId: null, groupId: "G-201", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Arc", d: "M1090 200 C1142 200 1150 262 1202 262", start: [1090, 200], end: [1202, 262], length: 128 },
      { id: "ELM-203", trackId: null, groupId: "G-201", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Line", d: "M1202 262 H1250", start: [1202, 262], end: [1250, 262], length: 48 },
      // ── Unidentified: G-202 · west extension of the Goods Line ──────────────
      { id: "ELM-204", trackId: null, groupId: "G-202", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Line", d: "M150 452 H320", start: [150, 452], end: [320, 452], length: 170 },
      { id: "ELM-205", trackId: null, groupId: "G-202", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Line", d: "M320 452 H492", start: [320, 452], end: [492, 452], length: 172 },
      // ── Unidentified: G-203 · dimension line read as track ──────────────────
      { id: "ELM-206", trackId: null, groupId: "G-203", layer: "UNIDENTIFIED", sourceLayer: "DIM-LINEAR", geometryType: "Line", d: "M300 700 H1300", start: [300, 700], end: [1300, 700], length: 1e3 },
      // ── Unidentified: G-204 · platform edges read as track ──────────────────
      { id: "ELM-207", trackId: null, groupId: "G-204", layer: "UNIDENTIFIED", sourceLayer: "PLATFORM-EDGE", geometryType: "Line", d: "M430 292 H960", start: [430, 292], end: [960, 292], length: 530 },
      { id: "ELM-208", trackId: null, groupId: "G-204", layer: "UNIDENTIFIED", sourceLayer: "PLATFORM-EDGE", geometryType: "Line", d: "M430 316 H960", start: [430, 316], end: [960, 316], length: 530 },
      // ── Unidentified: G-205 · disconnected stub east of the shunting neck ───
      { id: "ELM-209", trackId: null, groupId: "G-205", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Line", d: "M1230 586 H1380", start: [1230, 586], end: [1380, 586], length: 150 },
      { id: "ELM-210", trackId: null, groupId: "G-205", layer: "UNIDENTIFIED", sourceLayer: "0-UNCLASSIFIED", geometryType: "Line", d: "M1382.4 586 H1520", start: [1382.4, 586], end: [1520, 586], length: 137.6 }
    ];
    const ELEMENT_GROUPS = [
      {
        id: "G-201",
        label: "Curved run east of Road No. 2",
        elementIds: ["ELM-201", "ELM-202", "ELM-203"],
        aiClassification: "Unclassified linear geometry",
        aiConfidence: 41,
        nearestTrackId: "TRK-004",
        nearestDistance: "0.0 m (touching)",
        suggestedAction: "map",
        suggestedTrackId: "TRK-004",
        suggestionReason: "Aligned and connected to the open east end of Road No. 2.",
        status: "Unidentified"
      },
      {
        id: "G-202",
        label: "West run below DOWN Main",
        elementIds: ["ELM-204", "ELM-205"],
        aiClassification: "Unclassified linear geometry",
        aiConfidence: 38,
        nearestTrackId: "TRK-005",
        nearestDistance: "0.0 m (touching)",
        suggestedAction: "map",
        suggestedTrackId: "TRK-005",
        suggestionReason: "Collinear with the Goods Line and touching its west start node.",
        status: "Unidentified"
      },
      {
        id: "G-203",
        label: "Long horizontal line below yard",
        elementIds: ["ELM-206"],
        aiClassification: "Possible dimension line",
        aiConfidence: 22,
        nearestTrackId: "TRK-007",
        nearestDistance: "114 m",
        suggestedAction: "reject",
        suggestedReason: "Dimension line",
        suggestionReason: "Drawn on DIM-LINEAR with witness ticks at both ends and a 1000.00 annotation.",
        status: "Unidentified"
      },
      {
        id: "G-204",
        label: "Parallel pair beside Platform 1",
        elementIds: ["ELM-207", "ELM-208"],
        aiClassification: "Possible platform boundary",
        aiConfidence: 27,
        nearestTrackId: "TRK-001",
        nearestDistance: "14 m",
        suggestedAction: "reject",
        suggestedReason: "Platform boundary",
        suggestionReason: "Drawn on PLATFORM-EDGE, 24 m apart, bounding the Platform 1 hatch.",
        status: "Unidentified"
      },
      {
        id: "G-205",
        label: "Disconnected stub east of shunting neck",
        elementIds: ["ELM-209", "ELM-210"],
        aiClassification: "Unclassified linear geometry",
        aiConfidence: 44,
        nearestTrackId: "TRK-007",
        nearestDistance: "50 m",
        suggestedAction: "create",
        suggestedTrackType: "Sick Line",
        suggestionReason: "On the shunting neck alignment but separated by a 50 m gap; contains an internal 2.4 m gap.",
        status: "Unidentified"
      }
    ];
    const TURNOUTS = [
      { id: "P-101", x: 300, y: 330 },
      { id: "P-118", x: 1272, y: 330 },
      { id: "P-104", x: 380, y: 386 },
      { id: "P-122", x: 1262, y: 386 },
      { id: "P-106", x: 470, y: 262 },
      { id: "P-112", x: 660, y: 452 },
      { id: "P-116", x: 860, y: 520 }
    ];
    const BUFFER_STOPS = [
      { id: "BS-1", x: 1160, y: 520 },
      { id: "BS-8", x: 140, y: 140 }
    ];
    const PLATFORMS = [
      { id: "PF-1", label: "PF 1", x: 430, y: 292, w: 530, h: 24 },
      { id: "PF-2", label: "PF 2", x: 520, y: 404, w: 460, h: 24 }
    ];
    const STRUCTURES = [
      { id: "ST-1", label: "Station Building", x: 200, y: 620, w: 250, h: 62 },
      { id: "ST-2", label: "FOB", x: 742, y: 168, w: 26, h: 400 },
      { id: "ST-3", label: "Relay Room", x: 1300, y: 620, w: 150, h: 52 }
    ];
    const DIMENSIONS = [
      { id: "DIM-1", x1: 60, x2: 1540, y: 736, label: "1480.00" },
      { id: "DIM-2", x1: 300, x2: 1300, y: 700, label: "1000.00" },
      { id: "DIM-3", x1: 430, x2: 960, y: 268, label: "530.00" }
    ];
    const TEXT_LABELS = [
      { id: "TX-1", x: 66, y: 322, text: "KM 431.240", anchor: "start" },
      { id: "TX-2", x: 1534, y: 322, text: "KM 432.720", anchor: "end" },
      { id: "TX-3", x: 66, y: 322 - 0, text: "", anchor: "start" },
      { id: "TX-4", x: 800, y: 322, text: "UP MAIN LINE", anchor: "middle" },
      { id: "TX-5", x: 800, y: 378, text: "DOWN MAIN LINE", anchor: "middle" },
      { id: "TX-6", x: 700, y: 254, text: "ROAD No. 1", anchor: "middle" },
      { id: "TX-7", x: 790, y: 192, text: "ROAD No. 2", anchor: "middle" },
      { id: "TX-8", x: 820, y: 444, text: "GOODS LINE", anchor: "middle" },
      { id: "TX-9", x: 966, y: 512, text: "PIT LINE", anchor: "middle" },
      { id: "TX-10", x: 1076, y: 578, text: "SHUNTING NECK", anchor: "middle" },
      { id: "TX-11", x: 250, y: 132, text: "SICK LINE ?", anchor: "middle" },
      { id: "TX-12", x: 250, y: 656, text: "STATION BUILDING", anchor: "start" }
    ];
    const SEED_VALIDATIONS = [
      {
        id: "V-E1",
        severity: "error",
        category: "Geometry",
        trackId: "TRK-008",
        message: "Two branches were detected. Select one path or create separate tracks.",
        detail: "TRK-008 contains a straight west portion and a turnout ramp in one asset.",
        resolveHint: "Use Split Track on TRK-008."
      },
      {
        id: "V-E2",
        severity: "error",
        category: "Mandatory Attributes",
        trackId: "TRK-007",
        message: "Track name is missing for TRK-007.",
        detail: "Track name and road number are mandatory before a track can be validated.",
        resolveHint: "Use Edit Attributes on TRK-007."
      },
      {
        id: "V-W1",
        severity: "warning",
        category: "Connectivity",
        trackId: "TRK-004",
        message: "The track ends without connecting to a turnout, dead end or another track.",
        detail: "Road No. 2 stops at chainage 432.180. Group G-201 continues on the same alignment.",
        resolveHint: "Map G-201 to Road No. 2."
      },
      {
        id: "V-W2",
        severity: "warning",
        category: "Geometry",
        groupId: "G-205",
        message: "The selected segments contain a gap of 2.4 m.",
        detail: "ELM-209 ends at 432.620 km and ELM-210 starts at 432.622 km.",
        resolveHint: "Acknowledge the gap or correct the geometry before creating a track."
      },
      {
        id: "V-W3",
        severity: "warning",
        category: "Duplicate Mapping",
        trackId: "TRK-006",
        message: "This track overlaps 18% with TRK-005 Goods Line near KM 432.400.",
        detail: "Overlapping centre lines were detected between chainage 432.290 and 432.358.",
        resolveHint: "Correct the geometry or confirm the overlap is intentional."
      },
      {
        id: "V-I1",
        severity: "information",
        category: "Track Naming",
        message: "2 unidentified groups match the Not a Track heuristic (dimension line, platform boundary).",
        detail: "Groups G-203 and G-204 are drawn on non-track CAD layers.",
        resolveHint: "Review and mark them as Not a Track."
      }
    ];
    const TRACK_TYPES = ["Main Line", "Loop Line", "Siding", "Goods Line", "Pit Line", "Sick Line", "Shunting Neck", "Dead-End Track", "Other"];
    const OPERATIONAL_STATUSES = ["Existing", "Proposed", "Temporary", "To Be Dismantled"];
    const TRAFFIC_DIRECTIONS = ["UP", "DOWN", "Bidirectional", "Not Applicable"];
    const PASSENGER_GOODS = ["Passenger", "Goods", "Mixed", "Not Applicable"];
    const REJECTION_REASONS = ["Dimension line", "Platform boundary", "Road", "Railway boundary", "Structure", "Drain", "Annotation", "Redundant rail", "Other"];
    const MAPPING_METHODS = ["AI Auto-Mapped", "User Confirmed", "User Corrected", "User Created", "Imported from CAD Layer"];
    const MAPPING_RECORDS = TRACKS.map((track, index) => ({
      id: `MAP-${String(index + 1).padStart(3, "0")}`,
      sourceElementIds: track.segmentIds.slice(),
      trackId: track.id,
      mappingMethod: "AI Auto-Mapped",
      mappedBy: "Track Extractor 3.2",
      mappedAt: DOCUMENT.extractedAt,
      remarks: `Auto-mapped at ${track.confidenceScore}% confidence`
    }));
    window.PIM_TRACKS_MOCK = {
      STATION,
      DOCUMENT,
      LAYERS,
      TRACKS,
      SEGMENTS,
      ELEMENT_GROUPS,
      TURNOUTS,
      BUFFER_STOPS,
      PLATFORMS,
      STRUCTURES,
      DIMENSIONS,
      TEXT_LABELS,
      SEED_VALIDATIONS,
      MAPPING_RECORDS,
      TRACK_TYPES,
      OPERATIONAL_STATUSES,
      TRAFFIC_DIRECTIONS,
      PASSENGER_GOODS,
      REJECTION_REASONS,
      MAPPING_METHODS,
      VIEWBOX: { x: 0, y: 60, w: 1600, h: 700 },
      CURRENT_USER: { name: "Sarath", role: "PIM Reviewer" }
    };
  })();
})();
