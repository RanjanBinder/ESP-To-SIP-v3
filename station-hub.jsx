(() => {
  const { useState: useStateHub } = React;
  const CURRENT_USER = {
    name: "Sarath",
    role: "Admin SCoR",
    zone: "SCR",
    division: "Nanded"
  };
  const STATION_HUB_BASE = {
    name: "Aurangabad",
    code: "AWB",
    stationTitle: "Aurangabad",
    stationId: "AWB-431240",
    cll: "431.240",
    trainDirection: "Up \u2194 Down",
    zone: "South Central Railway",
    division: "Nanded",
    section: "Aurangabad\u2013Ankai",
    stationClass: "A",
    kilometerRef: "KM 431.240",
    owner: "Sarath",
    lastUpdated: "Today, 10:42",
    currentBaseline: "ESP-AWB-V7",
    stationType: "Existing Yard",
    adjacentUp: "Daulatabad",
    adjacentDn: "Chikalthan",
    currentStage: "SIP Approval",
    pendingWith: "Approver",
    pendingSince: "2 days",
    latestComment: "SIP V1 is validated and waiting for final review.",
    nextAction: "Review and approve SIP V1"
  };
  const resolveStationHubBase = (source) => {
    const hasSource = !!source;
    const merged = { ...STATION_HUB_BASE, ...(source || {}) };
    return {
      ...merged,
      stationTitle: source?.stationTitle || merged.stationTitle || merged.name,
      stationId: source?.stationId || source?.idCode || source?.stationID || (hasSource ? "" : merged.stationId),
      cll: source?.cll || source?.centralLineLocation || (hasSource ? "" : merged.cll || merged.kilometerRef),
      trainDirection: source?.trainDirection || (hasSource ? "" : merged.trainDirection)
    };
  };
  const DOCUMENTS = [
    {
      id: "esp",
      name: "ESP",
      title: "Engineering Scale Plan",
      version: "V7",
      status: "Approved",
      lock: "Locked",
      validation: { sod: "Validated", zone: "Validated" },
      assetCount: 184,
      assets: [
        { name: "Tracks", count: 12, icon: "track" },
        { name: "Turnouts", count: 24, icon: "branch" },
        { name: "Platforms", count: 4, icon: "layers" },
        { name: "LC Gates", count: 2, icon: "pin" },
        { name: "Bridges / FOB", count: 8, icon: "layers" },
        { name: "Gradients", count: 16, icon: "chart" }
      ],
      action: "Open ESP"
    },
    {
      id: "sip",
      name: "SIP",
      title: "Signal Interlocking Plan",
      version: "V1",
      status: "Approver Pending Review",
      lock: "Working",
      validation: { sod: "Not required", zone: "Not required", help: "SIP does not require independent SOD or Zone Rules validation here. It follows the SIP approval workflow." },
      assetCount: 127,
      assets: [
        { name: "Signals", count: 42, icon: "alert" },
        { name: "Points", count: 18, icon: "branch" },
        { name: "Track Circuits", count: 36, icon: "track" },
        { name: "Axle Counters", count: 14, icon: "command" },
        { name: "Routes", count: 12, icon: "git" },
        { name: "LC Controls", count: 5, icon: "shield" }
      ],
      action: "Open SIP"
    },
    {
      id: "lop",
      name: "LOP",
      title: "OHE Layout Plan",
      version: "Not Generated",
      status: "Not Generated",
      lock: "Not Started",
      validation: { sod: "Not required", zone: "Not required", help: "LOP does not require SOD or Zone Rules validation. Clearance and obstruction checks apply after LOP generation." },
      assetCount: 0,
      assets: [
        { name: "OHE Poles", count: 0, icon: "pin" },
        { name: "Mast Locations", count: 0, icon: "layers" },
        { name: "Track Associations", count: 0, icon: "track" },
        { name: "Clearance Checks", count: 0, icon: "shield" }
      ],
      action: "Open LOP"
    }
  ];
  const UPLOADED_DOCUMENT_ROWS = [
    { id: "new-esp-v8", docId: "esp", docType: "ESP", fileType: "DWG", file: "AWB_ESP_V8-PIM.dwg", version: "V8", name: "Engineering Scale Plan", addedBy: "Sarath" },
    { id: "previous-esp-v7", docId: "esp", docType: "ESP", fileType: "DWG", file: "AWB_ESP_V7-R0-A0.dwg", version: "V7-R0-A0", name: "Engineering Scale Plan", addedBy: "Sarath" }
  ];
  const UPLOAD_DOC_ID = {
    ESP: "esp",
    SIP: "sip",
    LOP: "lop",
    "Survey Data": "survey"
  };
  const uploadedDocumentFromPayload = (payload) => {
    const docId = UPLOAD_DOC_ID[payload.docType] || "";
    const doc = DOCUMENTS.find((item) => item.id === docId);
    return {
      id: `upload-${Date.now()}`,
      docId,
      docType: payload.docType,
      fileType: payload.fileType,
      file: payload.fileName,
      version: payload.version,
      name: (doc == null ? void 0 : doc.title) || payload.docType,
      addedBy: CURRENT_USER.name
    };
  };
  const ARCHIVES = {
    ESP: [
      { version: "V7", status: "Approved / Frozen", created: "May 10, 2026", approved: "May 14, 2026", by: "Sarath", validation: "Validated", latest: true, actions: ["View", "Compare"] },
      { version: "V6", status: "Archived", created: "Apr 18, 2026", approved: "Apr 22, 2026", by: "S&T Team", validation: "Validated", latest: false, actions: ["View", "Compare"] }
    ],
    SIP: [
      { version: "V1", status: "Approver Pending Review", created: "May 15, 2026", approved: "-", by: "System", validation: "Validated", latest: true, actions: ["View", "Compare"] }
    ],
    LOP: [
      { version: "-", status: "Not Generated", created: "-", approved: "-", by: "-", validation: "Not required", latest: false, actions: ["View", "Compare"] }
    ],
    TOC: [
      { version: "-", status: "Waiting for SIP Approval", created: "-", approved: "-", by: "-", validation: "Not required", latest: false, actions: ["View", "Compare"] }
    ],
    Survey: [
      { version: "V2026.05", status: "Processed", created: "May 12, 2026", approved: "-", by: "Survey Team", validation: "Linked", latest: true, actions: ["View", "Compare"] },
      { version: "V2026.04", status: "Archived", created: "Apr 26, 2026", approved: "-", by: "Survey Team", validation: "Linked", latest: false, actions: ["View", "Compare"] }
    ]
  };
  const ESP_DETAIL = {
    title: "AWB_ESP_V7-R0-A0.dwg",
    documentType: "Engineering Scale Plan",
    version: "V7-R0-A0",
    status: "Validated / Approved",
    editable: true,
    espFile: "AWB_ESP_V7-R0-A0.dwg",
    lidarFile: "AWB_LiDAR_2026-05-12.las",
    surveyFile: "AWB_TotalStation_2026-05-11.csv",
    lastEdited: "17 May 2026, 14:20",
    lastEditedBy: "Sarath",
    stationContext: "Aurangabad (AWB), Nanded Division, South Central Railway"
  };
  const ESP_ASSETS = [
    { type: "Tracks", count: 12, validation: "Validated", icon: "track" },
    { type: "Turnouts & Crossings", count: 28, validation: "Needs Review", icon: "branch" },
    { type: "Platforms", count: 4, validation: "Validated", icon: "layers" },
    { type: "Buildings & Structures", count: 17, validation: "Validated", icon: "home" },
    { type: "Level Crossing Gates", count: 2, validation: "Validated", icon: "pin" },
    { type: "Bridges / FOB / ROB / RUB", count: 3, validation: "Validated", icon: "layers" },
    { type: "Curves", count: 9, validation: "Needs Review", icon: "chart" },
    { type: "Gradients", count: 6, validation: "Validated", icon: "chart" },
    { type: "Chainage Markers", count: 41, validation: "Validated", icon: "clock" },
    { type: "Boundary / Land Features", count: 62, validation: "Validated", icon: "shield" }
  ];
  const assetCodeFor = (assetType) => ({
    "Tracks": "TRK",
    "Turnouts & Crossings": "TNT",
    "Platforms": "PF",
    "Buildings & Structures": "STR",
    "Level Crossing Gates": "LCG",
    "Bridges / FOB / ROB / RUB": "BRG",
    "Curves": "CRV",
    "Gradients": "GRD",
    "Chainage Markers": "CHM",
    "Boundary / Land Features": "BND"
  })[assetType] || "AST";
  const assetUnitLabel = (assetType) => ({
    "Tracks": "Track",
    "Turnouts & Crossings": "Turnout",
    "Platforms": "Platform",
    "Buildings & Structures": "Structure",
    "Level Crossing Gates": "LC Gate",
    "Bridges / FOB / ROB / RUB": "Bridge",
    "Curves": "Curve",
    "Gradients": "Gradient",
    "Chainage Markers": "Chainage Marker",
    "Boundary / Land Features": "Boundary Feature"
  })[assetType] || "Asset";
  const assetConfigFor = (asset, instanceNumber = 1) => {
    const unitLabel = assetUnitLabel(asset.type);
    const assetId = `${assetCodeFor(asset.type)}-${String(instanceNumber).padStart(2, "0")}`;
    const trackNames = ["Main Line", "Loop Line No.1", "Loop Line No.2", "Loop Line No.3", "Through Siding", "Shunting Neck"];
    const trackDisplayNames = ["MAIN LINE CSR 848.00m (STR-STR)", "LOOP LINE NO.1 CSR 848.00m (STR-STR)", "LOOP LINE NO.2 CSR 765.10m (STR-STR)", "LOOP LINE NO.3 CSR 765.10m (STR-STR)", "THROUGH SIDING CSR 681.548m (FM-FM)", "SHUNTING NECK 410.0M (BS-TS)"];
    const trackTypes = ["Main Line", "Loop Line", "Loop Line", "Loop Line", "Through Siding", "Shunting Neck"];
    const trackCsrs = ["848.00m", "848.00m", "765.10m", "765.10m", "681.548m", "410.0m"];
    const trackRoadNums = ["TRK-01", "TRK-02", "TRK-03", "TRK-04", "TRK-05", "TRK-06"];
    const tIdx = instanceNumber - 1;
    const trackFields = [
      ["Track Name",            trackNames[tIdx] || ("Track " + instanceNumber)],
      ["Display Name",          trackDisplayNames[tIdx] || "—"],
      ["Road Number",           trackRoadNums[tIdx] || assetId],
      ["Track Type",            trackTypes[tIdx] || "Loop Line"],
      ["Csr",                   trackCsrs[tIdx] || "—"],
      ["Direction",             instanceNumber === 1 ? "DN / UP (Bidirectional)" : instanceNumber % 2 === 0 ? "DN (Down)" : "UP (Up)"],
      ["Start Location Km",     `${(431.240 + tIdx * 0.062).toFixed(3)} km`],
      ["Start Location Chainage", `${431}+${String(Math.round(240 + tIdx * 62)).padStart(3,"0")} m`],
      ["End Location Km",       `${(432.088 - tIdx * 0.083).toFixed(3)} km`],
      ["End Location Chainage", `${432}+${String(Math.round(88 + tIdx * 0)).padStart(3,"0")} m`]
    ];
    const defaultFields = [
      ["Asset group", asset.type],
      [`${unitLabel} ID`, assetId],
      [`${unitLabel} count`, String(asset.count)],
      ["Reference layer", "ESP-AWB-CIVIL"],
      ["Source survey", "LiDAR + Total Station"],
      ["Last updated", ESP_DETAIL.lastEdited],
      ["Owner", ESP_DETAIL.lastEditedBy],
      ["Revision note", "Aligned with ESP V7-R0-A0"]
    ];
    const adjacentStationFields = [
      ["Station Name",                   instanceNumber === 1 ? "Mudkhed Junction" : instanceNumber === 2 ? "Parbhani Junction" : "Purna Junction"],
      ["Station Code",                   instanceNumber === 1 ? "MUE" : instanceNumber === 2 ? "PBN" : "PA"],
      ["Junction Name",                  instanceNumber === 1 ? "Mudkhed Jn" : instanceNumber === 2 ? "Parbhani Jn" : "Purna Jn"],
      ["Distance Km",                    instanceNumber === 1 ? "10.03 km" : instanceNumber === 2 ? "38.20 km" : "52.14 km"],
      ["Center Line Location Km",        instanceNumber === 1 ? "123.18 km" : instanceNumber === 2 ? "290.44 km" : "314.60 km"],
      ["Center Line Location Chainage",  instanceNumber === 1 ? "123+180 m" : instanceNumber === 2 ? "290+440 m" : "314+600 m"],
      ["Connected Track Ids",            instanceNumber === 1 ? "TRK-01, TRK-02" : instanceNumber === 2 ? "TRK-01, TRK-03" : "TRK-02, TRK-04"]
    ];
    if (asset.type === "Adjacent Stations") return adjacentStationFields;
    const platformFields = [
      ["Platform Name",          instanceNumber === 1 ? "Pro Goods RL Platform" : instanceNumber === 2 ? "High Level Passenger Platform" : instanceNumber === 3 ? "Loop Line Goods Platform" : "Bay Platform"],
      ["Track Ids",              instanceNumber === 1 ? "TRK-01 (Goods Line)" : instanceNumber === 2 ? "TRK-02 (Main Line)" : instanceNumber === 3 ? "TRK-03 (Loop Line No.1)" : "TRK-04 (Loop Line No.2)"],
      ["Start Location Km",      instanceNumber === 1 ? "120.250 km" : instanceNumber === 2 ? "120.312 km" : instanceNumber === 3 ? "120.374 km" : "120.436 km"],
      ["Start Location Chainage",instanceNumber === 1 ? "120+250 m" : instanceNumber === 2 ? "120+312 m" : instanceNumber === 3 ? "120+374 m" : "120+436 m"],
      ["End Location Km",        instanceNumber === 1 ? "120.859 km" : instanceNumber === 2 ? "120.762 km" : instanceNumber === 3 ? "120.724 km" : "120.636 km"],
      ["End Location Chainage",  instanceNumber === 1 ? "120+859 m" : instanceNumber === 2 ? "120+762 m" : instanceNumber === 3 ? "120+724 m" : "120+636 m"]
    ];
    if (asset.type === "Platforms") return platformFields;
    const turnoutTypes = ["1 in 8.5", "1 in 12", "1 in 8.5ss", "1 in 8.5ss"];
    const turnoutFields = [
      ["Turnout Type",      turnoutTypes[instanceNumber - 1] || "1 in 8.5"],
      ["Turnout Angle",     instanceNumber <= 2 ? "6° 42\u2032 34\u2033" : "6° 42\u2032 34\u2033 (Special)"],
      ["Labels Label",      `P${instanceNumber + 24}` ],
      ["Labels Track Id",   instanceNumber % 2 === 1 ? "TRK-0" + instanceNumber + " / TRK-0" + (instanceNumber + 1) : "TRK-0" + instanceNumber],
      ["Location Km",       `${(431.240 + (instanceNumber - 1) * 0.045).toFixed(3)} km`],
      ["Location Chainage", `${431}+${String(Math.round(240 + (instanceNumber - 1) * 45)).padStart(3,"0")} m`],
      ["Geometry Pattern",  instanceNumber % 2 === 1 ? "Left Hand (LH)" : "Right Hand (RH)"]
    ];
    if (asset.type === "Points and Turnouts") return turnoutFields;
    const deadEndTypes = ["Buffer Stop (BS)", "Over Shoot Line", "Catch Siding End", "Sand Hump"];
    const deadEndDisplayNames = ["OVER SHOOT LINE (275 M.)", "BUFFER STOP (BS-42 TS)", "CATCH SIDING END", "SAND HUMP BS"];
    const deadEndTrackIds = ["TRK-01", "TRK-02", "TRK-03", "TRK-04"];
    const deIdx = instanceNumber - 1;
    const deadEndFields = [
      ["Display Name",      deadEndDisplayNames[deIdx] || ("Dead End " + instanceNumber)],
      ["Type",              deadEndTypes[deIdx] || "Buffer Stop (BS)"],
      ["Track Id",          deadEndTrackIds[deIdx] || "TRK-0" + instanceNumber],
      ["Location Km",       `${(431.892 + deIdx * 0.068).toFixed(3)} km`],
      ["Location Chainage", `${431}+${String(Math.round(892 + deIdx * 68)).padStart(3,"0")} m`]
    ];
    if (asset.type === "Dead Ends") return deadEndFields;
    const trapTypes = ["Catch Points (Fixed)", "Trap Points (Moveable)", "Catch Points (Fixed)"];
    const trapLabels = ["TP-01 (Catch)", "TP-02 (Trap)", "TP-03 (Catch)"];
    const trapTrackIds = ["TRK-02", "TRK-03", "TRK-04"];
    const tpIdx = instanceNumber - 1;
    const trapPointFields = [
      ["Label",            trapLabels[tpIdx] || ("TP-0" + instanceNumber)],
      ["Trap Point Type",  trapTypes[tpIdx] || "Catch Points (Fixed)"],
      ["Is Manual",        instanceNumber === 2 ? "Yes" : "No"],
      ["Track Id",         trapTrackIds[tpIdx] || "TRK-0" + instanceNumber],
      ["Location Km",      `${(431.560 + tpIdx * 0.055).toFixed(3)} km`],
      ["Location Chainage",`${431}+${String(Math.round(560 + tpIdx * 55)).padStart(3,"0")} m`]
    ];
    if (asset.type === "Trap Points") return trapPointFields;
    const gateIds   = ["LC-301", "LC-302", "LC-303"];
    const gateAlpha = ["GTA", "GTB", "GTC"];
    const gIdx = instanceNumber - 1;
    const gateFields = [
      ["Asset Id",                 `GATE-0${instanceNumber}`],
      ["Lc/Gate Id",               gateIds[gIdx] || `LC-30${instanceNumber}`],
      ["Lc Class",                 instanceNumber === 1 ? "Class C" : instanceNumber === 2 ? "Class B" : "Class C"],
      ["Lc Manning Type",          instanceNumber === 2 ? "Manned (Gateman)" : "Unmanned (Traffic)"],
      ["Lc Gate Alpha Id",         gateAlpha[gIdx] || ("GT" + String.fromCharCode(64 + instanceNumber))],
      ["Sliding Boom - Up",        instanceNumber <= 2 ? "Yes" : "No"],
      ["Sliding Boom - Down",      "No"],
      ["Sliding Boom Up Direction","Road (East-West)"],
      ["Sliding Boom Down Direction","N/A"]
    ];
    if (asset.type === "Gates") return gateFields;
    return asset.type === "Tracks" ? trackFields : defaultFields;
  };
  const SIP_DETAIL = {
    title: "AWB_SIP_V1-R0-A0.dwg",
    documentType: "Signal Interlocking Plan",
    version: "V1-R0-A0",
    status: "Approver Pending Review",
    sipFile: "AWB_SIP_V1-R0-A0.dwg",
    espVersion: "ESP V7-R0-A0",
    tocFile: "Not Generated",
    lastEdited: "17 May 2026, 16:10",
    lastEditedBy: "System",
    stationContext: "Aurangabad (AWB), Nanded Division, South Central Railway"
  };
  const SIP_VALIDATIONS = [
    {
      title: "SIP Workflow Validation",
      icon: "shield",
      status: "Passed",
      processed: 127,
      passed: 127,
      failed: 0,
      lastRun: "17 May 2026, 16:18",
      actions: ["View Report", "Re-run", "Download Report"]
    },
    {
      title: "Route and Signal Consistency",
      icon: "branch",
      status: "Passed",
      processed: 42,
      passed: 42,
      failed: 0,
      lastRun: "17 May 2026, 16:24",
      actions: ["Open Checks", "Re-run", "Download Report"]
    },
    {
      title: "ESP Dependency Check",
      icon: "file_check",
      status: "Up to date",
      processed: 184,
      passed: 184,
      failed: 0,
      lastRun: "17 May 2026, 16:28",
      actions: ["View Dependency", "Re-run", "Download Report"]
    }
  ];
  const SIP_ASSETS = [
    { type: "Signals", count: 42, validation: "Validated", icon: "alert" },
    { type: "Points", count: 18, validation: "Validated", icon: "branch" },
    { type: "Track Circuits", count: 36, validation: "Validated", icon: "track" },
    { type: "Axle Counters", count: 14, validation: "Validated", icon: "command" },
    { type: "Routes", count: 12, validation: "Validated", icon: "git" },
    { type: "LC Controls", count: 5, validation: "Validated", icon: "shield" }
  ];
  const SIP_RELATED_DOCS = [
    { type: "ESP", version: "V7-R0-A0", status: "Approved", source: "--", updated: "17 May 2026, 14:20", action: "Open", disabled: true },
    { type: "TOC", version: "Not Generated", status: "Pending", source: "SIP V1-R0-A0", updated: "--", action: "Open", disabled: true },
    { type: "LOP", version: "Not Generated", status: "Pending", source: "SIP V1-R0-A0", updated: "--", action: "Open", disabled: true }
  ];
  const SIP_VERSION_HISTORY = [
    { version: "V1-R0-A0", latest: true, status: "Pending", created: "17 May 2026", approved: "Pending approval", by: "System", actions: ["View", "Compare"] },
    { version: "Draft-02", latest: false, status: "Archived", created: "16 May 2026", approved: "-", by: "System", actions: ["View", "Compare"] },
    { version: "Draft-01", latest: false, status: "Archived", created: "15 May 2026", approved: "-", by: "System", actions: ["View", "Compare"] }
  ];
  const SIP_EDITOR_GROUPS = [
    { id: "signals", label: "Signals", icon: "alert", count: 42 },
    { id: "track-circuits", label: "Track Circuits", icon: "track", count: 36 },
    { id: "points", label: "Turnouts / Points", icon: "branch", count: 18 },
    { id: "gates", label: "Gates / LC Controls", icon: "shield", count: 5 },
    { id: "routes", label: "Routes", icon: "git", count: 12 },
    { id: "aspect", label: "Aspect Control Chart", icon: "chart", count: 1 },
    { id: "deviation", label: "Deviation Table", icon: "file_check", count: 1 },
    { id: "title", label: "Title Block", icon: "book", count: 1 },
    { id: "notes", label: "Notes", icon: "info", count: 6 },
    { id: "issues", label: "Validation Issues", icon: "warning", count: 1 }
  ];
  const SIP_EDITOR_ELEMENTS = [
    {
      id: "sig-s12",
      group: "signals",
      kind: "signal",
      label: "S12 Home",
      icon: "alert",
      left: 27,
      top: 45,
      status: "Valid",
      fields: {
        "Signal ID": "SIG-S12",
        "Signal number": "S12",
        "Signal type": "Home",
        "Signal category": "Main signal",
        "Associated track": "Main UP",
        "Direction": "UP",
        "Side of track": "Left-hand side",
        "Normal aspect": "Red",
        "Proceed aspect": "Green",
        "Controlled routes": "R-01, R-03",
        "Placement validation": "Within Green Zone"
      }
    },
    {
      id: "sig-s18",
      group: "signals",
      kind: "signal",
      label: "S18 Starter",
      icon: "alert",
      left: 66,
      top: 44,
      status: "Violation",
      violation: "Signal position outside valid range",
      fix: "Move 18 m toward DN end into Green Zone",
      fields: {
        "Signal ID": "SIG-S18",
        "Signal number": "S18",
        "Signal type": "Starter",
        "Signal category": "Main signal",
        "Associated track": "Loop Line 2",
        "Direction": "DN",
        "Side of track": "Right-hand side",
        "Distance from nearest point": "42 m",
        "Required range": "60 m - 95 m from P18",
        "Current position": "42 m from P18",
        "Placement validation": "Outside Green Zone"
      }
    },
    {
      id: "tc-t21",
      group: "track-circuits",
      kind: "circuit",
      label: "T21",
      icon: "track",
      left: 42,
      top: 53,
      status: "Valid",
      fields: {
        "Track circuit": "T21",
        "Length": "621 m",
        "Associated section": "Main UP reception",
        "Boundary": "GJ-04 to IJ-09",
        "Route dependency": "R-01, R-04",
        "Length validation": "Within range"
      }
    },
    {
      id: "pt-p18",
      group: "points",
      kind: "point",
      label: "P18",
      icon: "branch",
      left: 57,
      top: 49,
      status: "Valid",
      fields: {
        "Point number": "P18",
        "Associated track": "Loop Line 2",
        "Normal position": "Main",
        "Reverse position": "Loop",
        "Detection dependency": "TC T21",
        "Track circuit association": "T21 / T22"
      }
    },
    {
      id: "lc-2",
      group: "gates",
      kind: "gate",
      label: "LC-2",
      icon: "shield",
      left: 78,
      top: 57,
      status: "Valid",
      fields: {
        "LC gate": "LC-2",
        "Gate class": "Special",
        "Interlocking": "Interlocked",
        "Control details": "Gate panel GP-2",
        "Signal dependency": "S18, S20",
        "Track circuit dependency": "T22"
      }
    },
    {
      id: "route-r03",
      group: "routes",
      kind: "route",
      label: "R-03",
      icon: "git",
      left: 51,
      top: 32,
      status: "Valid",
      fields: {
        "Route": "R-03",
        "Route start": "S12",
        "Route end": "S18",
        "Associated points": "P18 normal",
        "Overlap section": "T22",
        "Approach locking": "Enabled"
      }
    }
  ];
  const shCSS = `
.sh-content { display:flex; flex-direction:column; flex:1; min-width:0; height:100vh; overflow:hidden; background:var(--canvas); }
.sh-record-head { background:linear-gradient(135deg,var(--accent-soft) 0%,var(--paper) 100%); border-bottom:none; padding:22px 28px 20px; flex-shrink:0; display:flex; align-items:center; gap:16px; box-shadow:0 3px 0 var(--accent),0 4px 20px rgba(14,27,44,.07); }
.sh-record-heading { min-width:0; display:grid; gap:5px; }
.sh-record-icon-badge { width:42px; height:42px; border-radius:12px; background:var(--accent-soft); color:var(--accent-text); display:grid; place-items:center; flex-shrink:0; border:1px solid rgba(55,55,200,.14); }
.sh-back-btn { height:34px; display:inline-flex; align-items:center; gap:8px; padding:0 12px; border:var(--hairline); border-radius:var(--r-md); background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:12.5px; font-weight:500; cursor:pointer; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-record-breadcrumb { margin:0; }
.sh-record-title { font-size:28px; font-weight:800; color:var(--ink-900); line-height:1.1; display:flex; align-items:center; gap:8px; letter-spacing:-0.5px; }
.sh-record-sub { color:var(--ink-500); font-size:13px; line-height:1.35; }
.sh-record-actions { display:flex; gap:8px; align-items:center; justify-content:flex-end; flex-wrap:wrap; margin-left:auto; flex-shrink:0; }
.sh-inline-actions { display:flex; gap:8px; align-items:center; justify-content:flex-end; flex-wrap:wrap; }
.sh-breadcrumb-link {
  border:none;
  border-radius:var(--r-sm);
  background:transparent;
  color:var(--ink-600);
  font-family:var(--font-sans);
  font-size:12px;
  font-weight:500;
  padding:4px 6px;
  cursor:pointer;
}
.sh-breadcrumb-link:hover { background:var(--ink-50); color:var(--ink-900); }
.sh-hub-tabs { flex-shrink:0; padding:0 28px; background:var(--canvas); border-bottom:var(--hairline); }
.sh-hub-tabs .ds-tabs { border-bottom:none; }
.sh-scroll { flex:1; overflow:auto; padding:16px 28px 28px; display:grid; gap:12px; align-content:start; grid-auto-rows:max-content; }
.sh-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); padding:14px; min-width:0; }
.sh-section-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:12px; }
.sh-section-title { font-size:16px; font-weight:800; color:var(--ink-900); letter-spacing:0; line-height:1.2; }
.sh-section-sub { margin-top:3px; font-size:12.5px; color:var(--ink-500); line-height:1.4; }
.sh-station-identity { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:0 0 12px; border-bottom:var(--hairline); margin-bottom:12px; }
.sh-identity-title { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:18px; font-weight:800; color:var(--ink-900); line-height:1.2; }
.sh-identity-meta { margin-top:5px; color:var(--ink-500); font-size:12.5px; line-height:1.4; }
.sh-detail-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:0; }
.sh-detail-chip { display:inline-flex; align-items:center; gap:6px; min-height:28px; padding:5px 9px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); font-size:12px; color:var(--ink-900); }
.sh-detail-chip strong { color:var(--ink-400); font-weight:500; }
.sh-doc-section { display:grid; gap:8px; }
.sh-doc-section-head { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; }
.sh-doc-section-copy { min-width:0; padding-top:1px; }
.sh-doc-section-title { font-size:18px; font-weight:800; color:var(--ink-900); line-height:1.15; letter-spacing:0; }
.sh-doc-section-sub { margin-top:7px; font-size:14px; color:var(--ink-600); line-height:1.35; }
.sh-doc-health { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
.sh-doc-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); padding:13px; display:grid; grid-template-rows:auto auto auto auto auto auto; gap:12px; min-width:0; }
.sh-doc-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.sh-doc-mark { width:42px; height:42px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); display:grid; place-items:center; font-family:var(--font-mono); font-size:11px; font-weight:800; flex-shrink:0; }
.sh-doc-name { font-size:14px; font-weight:700; color:var(--ink-900); }
.sh-doc-title { margin-top:2px; font-size:11.5px; color:var(--ink-500); }
.sh-doc-meta { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
.sh-v2-shell { display:grid; grid-template-columns:minmax(0,.72fr) minmax(560px,1.28fr); gap:12px; align-items:start; }
.sh-v2-panel { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); min-width:0; overflow:hidden; }
.sh-v2-panel-head { min-height:50px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:13px 14px; border-bottom:var(--hairline); }
.sh-v2-title { font-size:14px; font-weight:800; color:var(--ink-900); line-height:1.2; }
.sh-v2-sub { margin-top:3px; font-size:12px; color:var(--ink-500); line-height:1.35; }
.sh-v2-station { display:grid; gap:0; }
.sh-v2-station-main { padding:14px; display:grid; gap:11px; border-bottom:var(--hairline); }
.sh-v2-station-name { display:flex; align-items:center; flex-wrap:wrap; gap:8px; color:var(--ink-900); font-size:18px; font-weight:800; line-height:1.15; }
.sh-v2-station-meta { color:var(--ink-500); font-size:12.5px; line-height:1.35; }
.sh-v2-kv { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
.sh-v2-kv-item { min-height:54px; padding:10px 14px; border-bottom:var(--hairline); border-right:var(--hairline); min-width:0; }
.sh-v2-kv-item:nth-child(2n) { border-right:none; }
.sh-v2-kv-item:nth-last-child(-n+2) { border-bottom:none; }
.sh-v2-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-500); }
.sh-v2-value { margin-top:5px; color:var(--ink-900); font-size:12.5px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v2-action-strip { display:grid; gap:8px; padding:12px 14px; background:var(--ink-50); border-top:var(--hairline); }
.sh-v2-action-row { display:flex; align-items:center; justify-content:space-between; gap:12px; color:var(--ink-700); font-size:12.5px; line-height:1.35; }
.sh-v2-action-row strong { color:var(--ink-900); font-weight:700; }
.sh-v2-progress { height:5px; border-radius:var(--r-full); background:var(--ink-100); overflow:hidden; }
.sh-v2-progress-fill { height:100%; width:48%; background:var(--success); border-radius:var(--r-full); }
.sh-v2-doc-table-wrap { overflow-x:auto; }
.sh-v2-doc-table { min-width:820px; width:100%; border-collapse:collapse; }
.sh-v2-doc-table th { text-align:left; padding:8px 12px; border-bottom:var(--hairline); background:var(--ink-50); color:var(--ink-500); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; }
.sh-v2-doc-table td { padding:10px 12px; border-bottom:var(--hairline); color:var(--ink-700); font-size:12px; vertical-align:middle; }
.sh-v2-doc-table tr:last-child td { border-bottom:none; }
.sh-v2-doc-table th:last-child,
.sh-v2-doc-table td:last-child { text-align:right; }
.sh-v2-doc-name { display:flex; align-items:center; gap:10px; min-width:0; }
.sh-v2-doc-code { width:38px; height:30px; display:grid; place-items:center; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); font-family:var(--font-mono); font-size:10px; font-weight:900; flex-shrink:0; }
.sh-v2-doc-code[data-empty="true"] { background:var(--ink-100); color:var(--ink-500); }
.sh-v2-doc-copy { min-width:0; display:grid; gap:2px; }
.sh-v2-doc-copy strong { color:var(--ink-900); font-size:12.5px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v2-doc-copy span { color:var(--ink-500); font-size:11.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v2-availability { display:inline-flex; align-items:center; gap:6px; color:var(--ink-700); font-size:12px; font-weight:700; }
.sh-v2-availability::before { content:""; width:8px; height:8px; border-radius:50%; background:var(--success); }
.sh-v2-availability[data-available="false"] { color:var(--ink-500); }
.sh-v2-availability[data-available="false"]::before { background:var(--ink-300); }
.sh-v2-version { font-family:var(--font-mono); color:var(--ink-800); font-size:11.5px; font-weight:700; white-space:nowrap; }
.sh-v2-link { display:inline-flex; align-items:center; gap:6px; color:var(--ink-700); font-size:11.5px; font-weight:700; white-space:nowrap; }
.sh-v2-survey-list { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); border-top:var(--hairline); }
.sh-v2-survey-item { padding:11px 12px; border-right:var(--hairline); min-width:0; display:grid; gap:5px; }
.sh-v2-survey-item:last-child { border-right:none; }
.sh-v2-survey-item strong { color:var(--ink-900); font-size:12.5px; font-weight:700; }
.sh-v2-survey-item span { color:var(--ink-500); font-size:11.5px; line-height:1.35; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v3-page { display:grid; gap:12px; }
.sh-v3-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); min-width:0; overflow:hidden; }
.sh-v3-card-pad { padding:14px; }
.sh-v3-section-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; padding:14px; border-bottom:var(--hairline); }
.sh-v3-section-title { font-size:16px; font-weight:800; color:var(--ink-900); line-height:1.15; }
.sh-v3-section-sub { margin-top:4px; font-size:12.5px; color:var(--ink-500); line-height:1.35; }
.sh-v3-toolbar { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
.sh-v3-meta-top { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; padding:14px; border-bottom:var(--hairline); }
.sh-v3-station-title { display:flex; align-items:center; flex-wrap:wrap; gap:8px; color:var(--ink-900); font-size:19px; font-weight:800; line-height:1.15; }
.sh-v3-meta-sub { margin-top:5px; color:var(--ink-500); font-size:12.5px; line-height:1.35; }
.sh-v3-meta-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); }
.sh-v3-meta-item { min-height:58px; padding:10px 14px; border-right:var(--hairline); border-bottom:var(--hairline); min-width:0; }
.sh-v3-meta-item:nth-child(4n) { border-right:none; }
.sh-v3-meta-item:nth-last-child(-n+4) { border-bottom:none; }
.sh-v3-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-500); }
.sh-v3-value { margin-top:5px; color:var(--ink-900); font-size:12.5px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v3-seg { display:inline-flex; align-items:center; padding:3px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); }
.sh-v3-seg button { min-height:28px; padding:0 10px; border:none; border-radius:var(--r-sm); background:transparent; color:var(--ink-600); font-family:var(--font-sans); font-size:12px; font-weight:600; cursor:pointer; }
.sh-v3-seg button[data-active="true"] { background:var(--paper); color:var(--ink-900); box-shadow:var(--shadow-xs); }
.sh-v3-doc-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; padding:14px; }
.sh-v3-doc-card { min-height:290px; display:grid; grid-template-rows:auto auto 1fr auto; gap:12px; padding:13px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); }
.sh-v3-doc-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.sh-v3-doc-main { display:flex; align-items:flex-start; gap:10px; min-width:0; }
.sh-v3-doc-code { width:42px; height:42px; display:grid; place-items:center; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); font-family:var(--font-mono); font-size:10px; font-weight:900; flex-shrink:0; }
.sh-v3-doc-name { color:var(--ink-900); font-size:13px; font-weight:700; line-height:1.2; }
.sh-v3-doc-type { margin-top:3px; color:var(--ink-500); font-size:11.5px; }
.sh-v3-badge { display:inline-flex; align-items:center; gap:5px; min-height:22px; padding:2px 7px; border-radius:var(--r-full); font-size:10.5px; font-weight:600; line-height:1.1; white-space:nowrap; }
.sh-v3-badge::before { content:""; width:6px; height:6px; border-radius:50%; background:currentColor; opacity:0.65; flex-shrink:0; }
.sh-v3-badge[data-tone="success"] { background:var(--success-soft); color:var(--success-text); }
.sh-v3-badge[data-tone="warning"] { background:var(--warning-soft); color:var(--warning-text); }
.sh-v3-badge[data-tone="info"] { background:var(--info-soft); color:var(--info); }
.sh-v3-badge[data-tone="danger"] { background:var(--danger-soft); color:var(--danger-text); }
.sh-v3-badge[data-tone="neutral"] { background:var(--ink-100); color:var(--ink-700); }
.sh-v3-badge[data-tone="dark"] { background:var(--ink-800); color:var(--paper); }
.sh-v3-doc-kpis { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
.sh-v3-mini { min-width:0; padding:8px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); }
.sh-v3-mini strong { display:block; margin-top:4px; color:var(--ink-900); font-size:12px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v3-doc-rows { display:grid; gap:7px; align-content:start; }
.sh-v3-doc-row { display:flex; align-items:center; justify-content:space-between; gap:8px; color:var(--ink-600); font-size:11.5px; line-height:1.25; }
.sh-v3-doc-row strong { color:var(--ink-900); font-weight:700; text-align:right; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v3-table-tools { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; border-bottom:var(--hairline); flex-wrap:wrap; }
.sh-v3-search { min-width:260px; height:34px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 10px; font-family:var(--font-sans); font-size:12px; color:var(--ink-900); outline:none; }
.sh-v3-select { height:34px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); padding:0 10px; font-family:var(--font-sans); font-size:12px; color:var(--ink-900); outline:none; }
.sh-v3-table-wrap { overflow-x:auto; }
.sh-v3-table { min-width:1220px; width:100%; border-collapse:collapse; }
.sh-v3-table th { padding:8px 10px; border-bottom:var(--hairline); background:var(--ink-50); color:var(--ink-500); font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; text-align:left; white-space:nowrap; }
.sh-v3-table td { padding:9px 10px; border-bottom:var(--hairline); color:var(--ink-700); font-size:11.5px; vertical-align:middle; }
.sh-v3-table tr:last-child td { border-bottom:none; }
.sh-v3-table tbody tr:hover td { background:var(--ink-50); transition:background 100ms; }
.sh-v3-two-col { display:grid; grid-template-columns:minmax(0,1.28fr) minmax(330px,.72fr); gap:12px; align-items:stretch; }
.sh-v3-layout-card { display:flex; flex-direction:column; }
.sh-v3-layout-card .sh-v3-section-head { align-items:center; padding:16px; flex-shrink:0; }
.sh-v3-layout-actions { display:flex; align-items:center; justify-content:flex-end; gap:10px; flex-wrap:wrap; }
.sh-v3-layout-actions .sh-layer-toggle { min-width:48px; height:34px; border-radius:var(--r-full); padding:0 14px; font-weight:900; }
.sh-v3-layout-actions .sh-layer-toggle[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-v3-layout-actions .ds-btn { min-height:40px; }
.sh-v3-layout-body { flex:1; min-height:0; padding:0 16px 16px; display:grid; gap:0; }
.sh-v3-layer-row { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.sh-v3-schematic { position:relative; height:100%; min-height:360px; border:var(--hairline); border-radius:var(--r-md); background:linear-gradient(180deg,#fbfcfd,var(--ink-50)); overflow:hidden; }
.sh-v3-schematic::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:40px 40px; opacity:.6; }
.sh-v3-yard-line { position:absolute; z-index:2; left:16%; right:16%; height:4px; border-radius:var(--r-full); background:linear-gradient(90deg,var(--ink-500),var(--ink-900)); }
.sh-v3-yard-line::after { content:""; position:absolute; left:0; right:0; top:-10px; height:24px; background:repeating-linear-gradient(90deg,transparent 0 38px,var(--ink-300) 38px 40px,transparent 40px 82px); opacity:.88; }
.sh-v3-yard-line.main { top:47%; left:16%; right:16%; }
.sh-v3-yard-line.loop-a { top:34%; left:16%; right:16%; }
.sh-v3-yard-line.loop-b { top:61%; left:16%; right:16%; }
.sh-v3-yard-diagonal { position:absolute; z-index:2; left:15.5%; right:15%; top:47%; height:5px; border-radius:var(--r-full); background:var(--ink-500); transform:rotate(17deg); transform-origin:center center; opacity:.9; }
.sh-v3-platform { position:absolute; z-index:3; left:31%; right:31%; height:24px; display:grid; place-items:center; border:1px solid var(--warning); border-radius:7px; background:oklch(0.96 0.055 82); color:var(--warning-text); font-size:12px; font-weight:900; }
.sh-v3-platform.pf1 { top:38%; }
.sh-v3-platform.pf2 { top:53%; }
.sh-v3-station-building { position:absolute; z-index:3; left:50%; top:70%; transform:translateX(-50%); min-width:136px; height:34px; display:grid; place-items:center; border:var(--hairline); border-radius:7px; background:var(--paper); color:var(--ink-800); font-size:11.5px; font-weight:900; box-shadow:var(--shadow-xs); }
.sh-v3-yard-label { position:absolute; z-index:5; top:14px; padding:0; border:none; background:transparent; color:var(--ink-500); font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.06em; line-height:1.45; }
.sh-v3-yard-label strong { display:block; color:var(--ink-600); font-size:11.5px; }
.sh-v3-yard-label.up { left:18px; }
.sh-v3-yard-label.dn { right:18px; text-align:right; }
.sh-v3-yard-label.station { left:50%; top:14px; transform:translateX(-50%); min-width:134px; min-height:52px; display:grid; place-items:center; border-radius:8px; background:var(--ink-900); color:var(--paper); text-transform:none; letter-spacing:0; box-shadow:var(--shadow-xs); }
.sh-v3-yard-label.station strong { color:var(--paper); font-size:14px; line-height:1; }
.sh-v3-yard-label.station span { display:block; margin-top:4px; color:var(--paper); font-size:12px; font-weight:700; }
.sh-v3-signal { position:absolute; z-index:4; width:14px; height:34px; }
.sh-v3-signal::before { content:""; position:absolute; left:6px; top:12px; width:2px; height:24px; background:var(--ink-600); }
.sh-v3-signal::after { content:""; position:absolute; left:0; top:0; width:15px; height:15px; border-radius:50%; background:oklch(0.60 0.18 25); box-shadow:0 0 0 3px var(--danger-soft); }
.sh-v3-signal span { position:absolute; left:18px; top:0; color:var(--danger-text); font-size:11px; font-weight:900; white-space:nowrap; }
.sh-v3-signal.s1 { left:20.5%; top:22%; }
.sh-v3-signal.s2 { right:22.5%; top:58%; }
.sh-v3-ohe-line { position:absolute; z-index:1; left:8%; right:8%; top:75%; border-top:1px dashed var(--info); opacity:.85; }
.sh-v3-overlay-badges { position:absolute; z-index:7; left:16px; bottom:14px; display:flex; flex-wrap:wrap; gap:8px; max-width:calc(100% - 32px); }
.sh-v3-legend { display:flex; align-items:center; flex-wrap:wrap; gap:8px; color:var(--ink-700); font-size:11.5px; font-weight:900; }
.sh-v3-legend span { display:inline-flex; align-items:center; gap:6px; min-height:26px; padding:0 9px; border:var(--hairline); border-radius:var(--r-full); background:rgba(255,255,255,.9); }
.sh-v3-dot { width:8px; height:8px; border-radius:50%; background:var(--ink-700); }
.sh-v3-dot.sip { background:var(--danger); }
.sh-v3-dot.lop { background:var(--info); }
.sh-v3-survey-body { padding:14px; display:grid; gap:10px; }
.sh-v3-survey-item { display:grid; gap:7px; padding:10px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); }
.sh-v3-survey-top { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.sh-v3-survey-top strong { color:var(--ink-900); font-size:12.5px; font-weight:700; }
.sh-v3-survey-meta { color:var(--ink-600); font-size:11.5px; line-height:1.35; }
.sh-v3-survey-summary { display:grid; grid-template-columns:1fr; gap:8px; }
.sh-v3-summary-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-600); font-size:12px; }
.sh-v3-summary-row strong { color:var(--ink-900); font-weight:700; }
.sh-v3-workflow { display:grid; gap:0; }
.sh-v3-flow-summary { padding:12px 14px; border-bottom:var(--hairline); display:grid; gap:9px; }
.sh-v3-flow-row { display:flex; align-items:center; justify-content:space-between; gap:12px; color:var(--ink-600); font-size:12.5px; }
.sh-v3-flow-row strong { color:var(--ink-900); font-weight:700; }
.sh-v3-flow-track { height:5px; border-radius:var(--r-full); background:var(--ink-100); overflow:hidden; }
.sh-v3-flow-fill { height:100%; width:57.14%; background:var(--success); border-radius:var(--r-full); }
.sh-v3-stage-grid { display:grid; grid-template-columns:repeat(7,minmax(165px,1fr)); gap:10px; padding:14px; overflow-x:auto; }
.sh-v3-stage { min-height:158px; display:grid; gap:9px; align-content:start; padding:12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); }
.sh-v3-stage[data-state="Completed"] { background:var(--success-soft); border-color:oklch(0.84 0.08 155); }
.sh-v3-stage[data-state="Current"] { background:var(--warning-soft); border-color:var(--warning); box-shadow:0 0 0 2px oklch(0.94 0.07 78); }
.sh-v3-stage[data-state="Not Started"] { background:var(--ink-50); }
.sh-v3-stage[data-state="Blocked"] { background:var(--danger-soft); border-color:oklch(0.86 0.09 25); }
.sh-v3-stage-title { color:var(--ink-900); font-size:12.5px; font-weight:700; line-height:1.25; }
.sh-v3-stage-meta { color:var(--ink-600); font-size:11.5px; line-height:1.35; }
.sh-v3-role { display:grid; grid-template-columns:minmax(260px,.45fr) minmax(0,1fr); gap:0; }
.sh-v3-role-side { padding:14px; border-right:var(--hairline); display:grid; gap:10px; align-content:start; }
.sh-v3-role-main { padding:14px; display:grid; gap:12px; }
.sh-v3-role-message { color:var(--ink-700); font-size:13px; line-height:1.45; }
.sh-v3-metric-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
.sh-v3-metric { padding:10px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); min-width:0; }
.sh-v3-metric strong { display:block; margin-top:5px; color:var(--ink-900); font-size:14px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-v3-tag-row { display:flex; flex-wrap:wrap; gap:7px; }
.sh-v3-task-grid { display:grid; grid-template-columns:repeat(5,minmax(180px,1fr)); gap:10px; padding:14px; overflow-x:auto; }
.sh-v3-task { display:grid; gap:9px; align-content:start; min-height:166px; padding:12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); }
.sh-v3-task-title { color:var(--ink-900); font-size:12.5px; font-weight:700; line-height:1.3; }
.sh-v3-task-meta { display:grid; gap:5px; color:var(--ink-600); font-size:11.5px; }
.sh-v3-task-meta span { display:flex; justify-content:space-between; gap:10px; }
.sh-v3-task-meta strong { color:var(--ink-900); font-weight:700; text-align:right; }
.sh-v3-modal-wide { width:min(1120px,calc(100vw - 32px)); }
.sh-v3-readonly-note { color:var(--ink-500); font-size:10.5px; line-height:1.25; }
.sh-doc-hub { display:grid; gap:12px; }
.sh-hub-section { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; min-width:0; }
.sh-hub-section-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; padding:14px; border-bottom:var(--hairline); }
.sh-hub-section-title { color:var(--ink-900); font-size:16px; font-weight:800; line-height:1.15; }
.sh-hub-section-sub { margin-top:4px; color:var(--ink-500); font-size:12.5px; line-height:1.35; }
.sh-hub-grid-3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; padding:14px; }
.sh-hub-grid-4 { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; padding:14px; }
.sh-hub-doc-card { min-height:245px; display:grid; grid-template-rows:auto 1fr auto; gap:12px; padding:13px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); }
.sh-hub-doc-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; min-width:0; }
.sh-hub-doc-title { display:flex; align-items:flex-start; gap:10px; min-width:0; }
.sh-hub-doc-code { width:42px; height:42px; display:grid; place-items:center; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); font-family:var(--font-mono); font-size:11px; font-weight:900; flex-shrink:0; }
.sh-hub-doc-file { color:var(--ink-900); font-size:13px; font-weight:700; line-height:1.25; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-hub-doc-kind { margin-top:3px; color:var(--ink-500); font-size:11.5px; font-weight:700; }
.sh-hub-kv-list { display:grid; gap:8px; align-content:start; }
.sh-hub-kv { display:flex; align-items:center; justify-content:space-between; gap:10px; color:var(--ink-600); font-size:12px; line-height:1.25; min-width:0; }
.sh-hub-kv strong { color:var(--ink-900); font-weight:700; text-align:right; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-hub-survey-card { display:grid; gap:8px; padding:12px; border:var(--hairline); border-radius:var(--r-lg); background:var(--ink-50); min-width:0; }
.sh-hub-survey-top { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.sh-hub-survey-name { color:var(--ink-900); font-size:13px; font-weight:700; }
.sh-hub-survey-meta { color:var(--ink-600); font-size:12px; line-height:1.35; }
.sh-hub-flow { padding:14px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; align-items:stretch; }
.sh-hub-flow-step { position:relative; display:grid; gap:9px; align-content:start; padding:13px; border:var(--hairline); border-radius:var(--r-lg); background:var(--ink-50); min-height:142px; }
.sh-hub-flow-step[data-status="Approved"] { background:var(--success-soft); border-color:oklch(0.84 0.08 155); }
.sh-hub-flow-step[data-status="Pending"] { background:var(--warning-soft); border-color:var(--warning); }
.sh-hub-flow-step:not(:last-child)::after { content:""; position:absolute; right:-18px; top:50%; width:24px; height:2px; background:var(--ink-300); }
.sh-hub-flow-name { color:var(--ink-900); font-size:14px; font-weight:700; }
.sh-hub-flow-desc { color:var(--ink-700); font-size:12.5px; line-height:1.4; }
.sh-hub-helper { margin:0 14px 14px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-600); font-size:12.5px; line-height:1.4; }
.sh-hub-table-tools { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; border-bottom:var(--hairline); flex-wrap:wrap; }
.sh-hub-filter-group { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.sh-hub-search { min-width:260px; height:34px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 10px; color:var(--ink-900); font-family:var(--font-sans); font-size:12px; outline:none; }
.sh-hub-select { height:34px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); padding:0 10px; color:var(--ink-900); font-family:var(--font-sans); font-size:12px; outline:none; }
.sh-hub-table-wrap { overflow-x:auto; }
.sh-hub-chips-wrap { padding:14px; }
.sh-hub-table { min-width:920px; width:100%; border-collapse:collapse; }
.sh-hub-table th { padding:8px 10px; border-bottom:var(--hairline); background:var(--ink-50); color:var(--ink-500); font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; text-align:left; white-space:nowrap; }
.sh-hub-table td { padding:10px; border-bottom:var(--hairline); color:var(--ink-700); font-size:12px; vertical-align:middle; }
.sh-hub-table tr:last-child td { border-bottom:none; }
.sh-hub-table tbody tr:hover td { background:var(--ink-50); transition:background 100ms; }
.sh-hub-table th:last-child,
.sh-hub-table td:last-child { text-align:right; }
.sh-hub-file-cell { color:var(--ink-900); font-size:12.5px; font-weight:700; font-family:var(--font-mono); white-space:nowrap; }
.sh-hub-doc-page { display:grid; gap:12px; }
.sh-hub-doc-headline { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; padding:14px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); }
.sh-hub-summary-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; padding:14px; }
.sh-hub-summary-card { min-height:78px; display:grid; align-content:start; gap:6px; padding:11px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); min-width:0; }
.sh-hub-summary-label { color:var(--ink-500); font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
.sh-hub-summary-value { color:var(--ink-900); font-size:13px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-hub-metadata-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); }
.sh-hub-metadata-item { min-height:58px; padding:10px 14px; border-right:var(--hairline); border-bottom:var(--hairline); min-width:0; }
.sh-hub-metadata-item:nth-child(4n) { border-right:none; }
.sh-hub-metadata-item:nth-child(8n+5),.sh-hub-metadata-item:nth-child(8n+6),.sh-hub-metadata-item:nth-child(8n+7),.sh-hub-metadata-item:nth-child(8n+8) { background:var(--ink-50); }
.sh-hub-metadata-label { color:var(--ink-500); font-size:10px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
.sh-hub-metadata-value { margin-top:5px; color:var(--ink-900); font-size:12.5px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-hub-metadata-file { display:flex; align-items:center; gap:5px; white-space:nowrap; overflow:hidden; }
.sh-meta-file-actions { display:inline-flex; gap:3px; flex-shrink:0; }
.sh-meta-icon-btn { width:22px; height:22px; display:inline-grid; place-items:center; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); color:var(--ink-500); cursor:pointer; padding:0; }
.sh-meta-icon-btn:hover { border-color:var(--accent); background:var(--accent-soft); color:var(--accent-text); }
.sh-single-doc-cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; padding:14px; }
.sh-single-doc-card { position:relative; width:100%; min-height:282px; display:grid; grid-template-rows:auto 1fr auto; gap:12px; padding:13px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); text-align:left; cursor:pointer; transition:border-color .16s ease, box-shadow .16s ease, background .16s ease, transform .16s ease; }
.sh-single-doc-card:hover { border-color:var(--ink-300); box-shadow:var(--shadow-xs); transform:translateY(-1px); }
.sh-single-doc-card[data-selected="true"] { border-color:var(--accent); background:oklch(0.98 0.016 55); box-shadow:0 0 0 2px oklch(0.92 0.055 46); }
.sh-single-doc-card[data-selected="true"]::after { content:"Selected"; position:absolute; top:12px; right:12px; min-height:22px; display:inline-flex; align-items:center; padding:0 8px; border-radius:var(--r-full); background:var(--accent); color:var(--paper); font-size:10px; font-weight:900; }
.sh-single-doc-card .sh-hub-doc-head { padding-right:72px; }
.sh-single-card-action { justify-self:start; }
.sh-single-table-title { display:grid; gap:4px; }
.sh-single-upload-help { color:var(--ink-500); font-size:11.5px; line-height:1.35; }
.sh-single-empty { padding:16px; color:var(--ink-500); font-size:12.5px; }
.sh-workspace-panel { display:grid; gap:14px; }
.sh-station-status { display:grid; gap:16px; padding:18px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:visible; box-shadow:var(--shadow-xs); }
.sh-station-status-head { display:flex; align-items:center; justify-content:space-between; gap:14px; }
.sh-station-status-title { color:var(--ink-900); font-size:15px; font-weight:700; line-height:1.2; letter-spacing:-0.01em; display:flex; align-items:center; gap:8px; }
.sh-station-status-sub { margin-top:4px; color:var(--ink-500); font-size:12.5px; line-height:1.4; max-width:760px; }
.sh-station-status-grid { display:grid; grid-template-columns:minmax(140px,1fr) 28px minmax(140px,1fr) 28px minmax(140px,1fr) 28px minmax(140px,1fr); gap:0; overflow:visible; align-items:center; }
.sh-station-status-card { position:relative; min-height:96px; display:flex; flex-direction:column; gap:0; padding:0; border:1.5px solid var(--ink-200); border-radius:var(--r-lg); background:var(--paper); min-width:0; text-align:left; cursor:pointer; font-family:var(--font-sans); transition:all .2s ease; overflow:hidden; }
.sh-station-status-card:hover { border-color:var(--ink-300); box-shadow:var(--shadow-md); transform:translateY(-1px); }
.sh-station-status-card[data-status="Completed"] { background:var(--success-soft); border-color:oklch(0.86 0.08 155); }
.sh-station-status-card[data-status="Generated"] { background:var(--success-soft); border-color:oklch(0.86 0.08 155); }
.sh-station-status-card[data-status="Under Review"] { background:var(--warning-soft); border-color:oklch(0.86 0.09 80); }
.sh-station-status-card[data-status="Not Started"] { background:var(--ink-50); border-color:var(--ink-200); }
.sh-station-status-card[data-selected="true"] { border-color:var(--accent); background:var(--accent-soft); box-shadow:0 0 0 3px oklch(0.68 0.10 200 / 0.14), var(--shadow-md); transform:translateY(-1px); }
.sh-station-card-stripe { flex-shrink:0; width:100%; height:3px; border-radius:0; background:var(--ink-200); }
.sh-station-status-card[data-status="Completed"] .sh-station-card-stripe,.sh-station-status-card[data-status="Generated"] .sh-station-card-stripe { background:var(--success); }
.sh-station-status-card[data-status="Under Review"] .sh-station-card-stripe { background:var(--warning); }
.sh-station-status-card[data-status="Not Started"] .sh-station-card-stripe { background:var(--ink-300); }
.sh-station-status-card[data-selected="true"] .sh-station-card-stripe { background:var(--accent) !important; }
.sh-station-card-icon { flex-shrink:0; width:32px; height:32px; border-radius:var(--r-md); display:grid; place-items:center; background:var(--ink-100); color:var(--ink-500); transition:all .2s ease; }
.sh-station-status-card[data-status="Completed"] .sh-station-card-icon,.sh-station-status-card[data-status="Generated"] .sh-station-card-icon { background:oklch(0.90 0.08 155); color:var(--success-text); }
.sh-station-status-card[data-status="Under Review"] .sh-station-card-icon { background:oklch(0.92 0.07 80); color:var(--warning-text); }
.sh-station-status-card[data-selected="true"] .sh-station-card-icon { background:var(--accent); color:var(--paper); }
.sh-station-card-body { flex:1; min-width:0; display:flex; flex-direction:column; justify-content:space-between; gap:8px; padding:12px 14px 14px; }
.sh-station-card-top { display:flex; align-items:center; gap:8px; min-width:0; }
.sh-station-doc-code { color:var(--ink-900); font-size:14px; font-weight:700; line-height:1.1; letter-spacing:-0.005em; white-space:nowrap; flex-shrink:0; }
.sh-station-status-card[data-selected="true"] .sh-station-doc-code { color:var(--accent-text); }
.sh-station-status-name { color:var(--ink-500); font-size:11.5px; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; min-width:0; line-height:1.3; }
.sh-station-status-badge { display:inline-flex; align-items:center; gap:4px; height:20px; padding:0 8px; border-radius:var(--r-full); font-size:10.5px; font-weight:600; white-space:nowrap; letter-spacing:.02em; text-transform:uppercase; flex-shrink:0; border:1px solid transparent; }
.sh-station-status-badge[data-status="Completed"] { background:var(--success-soft); color:var(--success-text); border-color:oklch(0.9 0.06 155); }
.sh-station-status-badge[data-status="Generated"] { background:var(--success-soft); color:var(--success-text); border-color:oklch(0.9 0.06 155); }
.sh-station-status-badge[data-status="Under Review"] { background:var(--warning-soft); color:var(--warning-text); border-color:oklch(0.9 0.08 80); }
.sh-station-status-badge[data-status="Not Started"] { background:var(--ink-100); color:var(--ink-600); border-color:var(--ink-200); }
.sh-station-card-bottom { display:flex; align-items:center; justify-content:space-between; gap:6px; min-width:0; }
.sh-station-card-count { flex-shrink:0; display:inline-flex; align-items:center; gap:4px; color:var(--ink-600); font-size:11.5px; font-weight:600; white-space:nowrap; font-variant-numeric:tabular-nums; }
.sh-station-card-count svg { color:var(--ink-400); }
.sh-station-card-cta { display:none; }
.sh-station-status-top { display:none; }
.sh-station-selected-badge { width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; border-radius:var(--r-full); background:var(--accent); color:var(--paper); flex-shrink:0; box-shadow:0 1px 2px rgba(0,0,0,0.12); }
.sh-station-card-flow { display:flex; align-items:center; justify-content:center; width:28px; align-self:center; pointer-events:none; position:relative; }
.sh-station-card-flow::before { content:""; position:absolute; left:2px; right:10px; top:50%; height:0; border-top:1.5px dashed var(--ink-300); }
.sh-station-card-flow::after { content:""; position:absolute; right:4px; top:50%; width:7px; height:7px; border-top:2px solid var(--accent); border-right:2px solid var(--accent); transform:translateY(-50%) rotate(45deg); background:transparent; }
.sh-station-status-note { display:flex; align-items:flex-start; gap:8px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-600); font-size:12.5px; line-height:1.4; }
.sh-station-status-note svg { flex:0 0 auto; color:var(--ink-500); margin-top:1px; }
.sh-doc-files-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:2px 0 0; }
.sh-doc-files-title { color:var(--ink-900); font-size:16px; font-weight:800; line-height:1.2; }
.sh-doc-files-sub { margin-top:4px; color:var(--ink-500); font-size:12.5px; line-height:1.4; }
.sh-doc-tabs-row { display:flex; align-items:center; gap:22px; min-height:44px; border-bottom:var(--hairline); }
.sh-doc-tab { min-height:44px; display:inline-flex; align-items:center; gap:8px; padding:0 7px; border:none; border-bottom:2px solid transparent; background:transparent; color:var(--ink-600); font-family:var(--font-sans); font-size:13px; font-weight:600; cursor:pointer; }
.sh-doc-tab[data-active="true"] { color:var(--ink-900); border-bottom-color:var(--accent); }
.sh-doc-tab-count { min-width:20px; height:20px; display:inline-grid; place-items:center; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-700); font-size:11px; font-weight:600; padding:0 6px; }
.sh-doc-tab[data-active="true"] .sh-doc-tab-count { background:var(--accent); color:var(--paper); }
.sh-doc-table-notice { min-height:42px; display:flex; align-items:center; gap:9px; padding:0 14px; border:1px solid oklch(0.83 0.10 150); border-radius:var(--r-md); background:var(--success-soft); color:var(--success-text); font-size:12.5px; }
.sh-doc-table-notice strong { font-weight:700; }
.sh-doc-table-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.sh-doc-table-controls { display:flex; align-items:center; gap:8px; flex:1; min-width:280px; }
.sh-doc-search { height:34px; min-width:300px; flex:0 1 420px; display:flex; align-items:center; gap:9px; padding:0 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-500); }
.sh-doc-search input { width:100%; border:none; outline:none; background:transparent; color:var(--ink-900); font-family:var(--font-sans); font-size:12.5px; }
.sh-doc-search-dot { width:7px; height:7px; border-radius:var(--r-full); background:var(--ink-900); flex-shrink:0; }
.sh-doc-table-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; }
.sh-doc-table-scroll { overflow-x:auto; }
.sh-doc-table { min-width:1060px; width:100%; border-collapse:collapse; }
.sh-doc-table th { padding:10px 14px; border-bottom:var(--hairline); background:var(--ink-50); color:var(--ink-500); font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; text-align:left; white-space:nowrap; }
.sh-doc-table td { padding:13px 14px; border-bottom:var(--hairline); color:var(--ink-700); font-size:12.5px; vertical-align:middle; }
.sh-doc-table tr:last-child td { border-bottom:none; }
.sh-doc-table tbody tr:hover td { background:var(--ink-50); transition:background 100ms; }
.sh-doc-table th:last-child,.sh-doc-table td:last-child { text-align:right; }
.sh-doc-file-cell { display:flex; align-items:center; gap:10px; min-width:0; }
.sh-doc-file-ext { width:32px; height:32px; display:grid; place-items:center; border-radius:6px; color:var(--ink-900); font-size:9px; font-weight:900; text-transform:lowercase; flex-shrink:0; }
.sh-doc-file-ext[data-ext="pdf"] { background:oklch(0.94 0.045 25); color:var(--danger-text); }
.sh-doc-file-ext[data-ext="dwg"] { background:oklch(0.91 0.07 225); color:var(--info); }
.sh-doc-file-ext[data-ext="xlsx"] { background:oklch(0.91 0.09 150); color:var(--success-text); }
.sh-doc-file-ext[data-ext="las"],.sh-doc-file-ext[data-ext="tif"],.sh-doc-file-ext[data-ext="csv"] { background:oklch(0.94 0.04 85); color:var(--warning-text); }
.sh-doc-file-main { display:grid; gap:5px; min-width:0; }
.sh-doc-file-name { color:var(--ink-900); font-size:12.5px; font-weight:700; font-family:var(--font-mono); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-doc-name-cell { display:flex; align-items:center; gap:8px; min-width:0; }
.sh-doc-ft-badge { display:inline-flex; align-items:center; justify-content:center; min-width:34px; height:20px; padding:0 5px; border-radius:4px; font-size:9px; font-weight:800; font-family:var(--font-mono,monospace); letter-spacing:.04em; flex-shrink:0; border:1px solid transparent; }
.sh-doc-ft-badge[data-ft="DWG"] { background:var(--accent-soft); color:var(--accent-text); border-color:rgba(55,55,200,.18); }
.sh-doc-ft-badge[data-ft="PDF"] { background:oklch(0.95 0.05 25); color:oklch(0.42 0.20 25); border-color:oklch(0.88 0.07 25); }
.sh-doc-ft-badge[data-ft="XLS"],.sh-doc-ft-badge[data-ft="XLSX"] { background:var(--success-soft); color:var(--success-text); border-color:oklch(0.85 0.10 150); }
.sh-doc-ft-badge[data-ft="CSV"] { background:oklch(0.95 0.04 150); color:oklch(0.42 0.14 150); border-color:oklch(0.86 0.08 150); }
.sh-doc-ft-badge[data-ft="LAS"] { background:oklch(0.94 0.04 280); color:oklch(0.42 0.18 280); border-color:oklch(0.86 0.08 280); }
.sh-doc-ft-badge[data-ft="TIF"],.sh-doc-ft-badge[data-ft="TIFF"] { background:oklch(0.94 0.04 200); color:oklch(0.40 0.14 200); border-color:oklch(0.85 0.08 200); }
.sh-doc-ft-badge[data-ft="DXF"] { background:oklch(0.94 0.04 250); color:oklch(0.42 0.16 250); border-color:oklch(0.86 0.08 250); }
.sh-doc-file-meta { display:flex; align-items:center; flex-wrap:wrap; gap:7px; color:var(--ink-500); font-size:11px; }
.sh-doc-mini-chip { min-height:20px; display:inline-flex; align-items:center; gap:4px; padding:0 6px; border-radius:5px; background:var(--ink-100); color:var(--ink-700); font-size:10.5px; font-weight:600; }
.sh-doc-status { display:inline-flex; align-items:center; gap:6px; min-height:24px; padding:0 9px; border-radius:var(--r-full); color:var(--paper); font-size:11.5px; font-weight:600; white-space:nowrap; }
.sh-doc-status[data-tone="success"] { background:var(--success); }
.sh-doc-status[data-tone="info"] { background:var(--info); }
.sh-doc-status[data-tone="warning"] { background:var(--accent); }
.sh-doc-status[data-tone="purple"] { background:oklch(0.48 0.17 290); }
.sh-doc-status[data-tone="danger"] { background:var(--danger); }
.sh-doc-status[data-tone="neutral"] { background:var(--ink-500); }
.sh-doc-user-cell { display:flex; align-items:center; gap:10px; min-width:0; }
.sh-doc-avatar { width:28px; height:28px; display:grid; place-items:center; border-radius:var(--r-full); color:var(--paper); font-size:10px; font-weight:900; flex-shrink:0; }
.sh-doc-user-name { color:var(--ink-900); font-size:12.5px; font-weight:700; white-space:nowrap; }
.sh-doc-user-role { margin-top:2px; color:var(--ink-500); font-size:11px; white-space:nowrap; }
.sh-doc-actions { display:flex; justify-content:flex-end; align-items:center; gap:6px; }
.sh-doc-action-btn { min-height:28px; display:inline-flex; align-items:center; gap:6px; padding:0 9px; border:var(--hairline); border-radius:7px; background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:12px; font-weight:500; cursor:pointer; white-space:nowrap; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-doc-action-btn:hover { background:var(--ink-50); color:var(--ink-900); border-color:var(--ink-300); }
.sh-doc-action-btn[data-accent="true"] { border-color:oklch(0.82 0.08 150); background:var(--success-soft); color:var(--success-text); }
.sh-doc-action-icon { width:28px; min-height:28px; display:grid; place-items:center; border:var(--hairline); border-radius:7px; background:var(--paper); color:var(--ink-600); cursor:pointer; }
.sh-doc-menu-wrap { position:relative; display:inline-flex; }
.sh-doc-row-menu { position:absolute; z-index:30; top:calc(100% + 6px); right:0; min-width:150px; padding:6px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); box-shadow:var(--shadow-lg); }
.sh-doc-row-menu button { width:100%; min-height:30px; display:flex; align-items:center; gap:8px; padding:0 9px; border:none; border-radius:var(--r-sm); background:transparent; color:var(--ink-600); font-family:var(--font-sans); font-size:12px; font-weight:500; text-align:left; cursor:pointer; }
.sh-doc-row-menu button:hover { background:var(--ink-50); color:var(--ink-900); }
.sh-doc-pagination { border-top:var(--hairline); }
@media (max-width: 1180px) {
  .sh-hub-grid-3,.sh-hub-grid-4 { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .sh-hub-summary-grid,.sh-hub-metadata-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .sh-single-doc-cards { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .sh-station-status-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
  .sh-station-card-flow { display:none; }
}
@media (max-width: 760px) {
  .sh-hub-section-head,.sh-hub-doc-headline,.sh-hub-table-tools { flex-direction:column; }
  .sh-hub-grid-3,.sh-hub-grid-4,.sh-hub-flow,.sh-hub-summary-grid,.sh-hub-metadata-grid { grid-template-columns:1fr; }
  .sh-single-doc-cards { grid-template-columns:1fr; }
  .sh-station-status-grid { grid-template-columns:1fr; gap:10px; }
  .sh-hub-flow-step:not(:last-child)::after { display:none; }
  .sh-hub-search { min-width:0; width:100%; }
}
.sh-edit-field input:disabled { color:var(--ink-500); background:var(--ink-100); cursor:not-allowed; }
.sh-mini-stat { border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:8px; min-width:0; }
.sh-mini-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-500); }
.sh-mini-value { margin-top:4px; font-size:12.5px; font-weight:700; color:var(--ink-900); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-validation-row { display:flex; align-items:center; justify-content:space-between; gap:8px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:8px; font-size:12px; color:var(--ink-700); }
.sh-validation-label { display:inline-flex; align-items:center; gap:5px; min-width:0; }
.sh-validation-info { color:var(--ink-500); flex-shrink:0; cursor:help; }
.sh-asset-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
.sh-asset-tile { min-height:50px; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); min-width:0; }
.sh-asset-main { display:flex; align-items:center; gap:9px; min-width:0; color:var(--ink-800); font-size:13px; font-weight:700; }
.sh-asset-main span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-asset-count { color:var(--ink-900); font-size:14px; font-weight:700; font-variant-numeric:tabular-nums; flex-shrink:0; }
.sh-doc-workspace { display:grid; gap:12px; }
.sh-doc-workspace-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.sh-doc-workspace-actions { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
.sh-doc-lifecycle-list { display:grid; gap:10px; }
.sh-doc-lifecycle-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); padding:13px; display:grid; grid-template-columns:minmax(190px,.9fr) repeat(4,minmax(130px,1fr)) minmax(250px,1.1fr); gap:12px; align-items:center; }
.sh-doc-lifecycle-doc { min-width:0; display:flex; align-items:center; gap:10px; }
.sh-doc-lifecycle-mark { width:42px; height:42px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); display:grid; place-items:center; font-family:var(--font-mono); font-size:10px; font-weight:800; flex-shrink:0; }
.sh-doc-lifecycle-name { font-size:13px; font-weight:700; color:var(--ink-900); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-doc-lifecycle-sub { margin-top:3px; font-size:11.5px; color:var(--ink-500); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-doc-lifecycle-cell { min-width:0; display:grid; gap:4px; }
.sh-doc-lifecycle-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-500); }
.sh-doc-lifecycle-value { font-size:12.5px; font-weight:700; color:var(--ink-900); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-doc-lifecycle-actions { display:flex; align-items:center; justify-content:flex-end; gap:6px; flex-wrap:wrap; }
.sh-upload-table-card { padding:0; overflow:hidden; }
.sh-upload-table-scroll { overflow-x:auto; }
.sh-upload-table { min-width:720px; width:100%; }
.sh-upload-table th:last-child,
.sh-upload-table td:last-child { text-align:right; }
.sh-upload-table-actions { display:flex; justify-content:flex-end; }
.sh-upload-file { min-width:0; display:flex; align-items:center; gap:10px; }
.sh-upload-file-mark { width:38px; height:34px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); display:grid; place-items:center; font-family:var(--font-mono); font-size:10px; font-weight:800; flex-shrink:0; }
.sh-upload-file-name { color:var(--ink-900); font-size:12.5px; font-weight:700; font-family:var(--font-mono); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-two-col { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(320px,.7fr); gap:12px; align-items:stretch; }
.sh-preview { min-height:330px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); padding:14px; display:grid; grid-template-rows:auto 1fr; gap:12px; }
.sh-preview-top { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.sh-preview-controls { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
.sh-toggle-row { display:flex; flex-wrap:wrap; gap:6px; }
.sh-layer-toggle { min-height:28px; padding:0 10px; border:var(--hairline); border-radius:var(--r-full); background:var(--paper); color:var(--ink-700); font-family:var(--font-sans); font-size:12px; font-weight:700; cursor:pointer; }
.sh-layer-toggle[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-yard { position:relative; border:var(--hairline); border-radius:var(--r-md); background:linear-gradient(180deg,var(--ink-50),var(--paper)); overflow:hidden; min-height:235px; }
.sh-yard::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:36px 36px; opacity:.55; pointer-events:none; }
.sh-yard-label { position:absolute; top:12px; z-index:2; font-size:10px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-500); }
.sh-yard-label.up { left:16px; } .sh-yard-label.dn { right:16px; text-align:right; }
.sh-yard-station { position:absolute; left:50%; top:12px; transform:translateX(-50%); z-index:3; min-width:118px; padding:7px 11px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); text-align:center; box-shadow:var(--shadow-xs); }
.sh-yard-station strong { display:block; font-size:12px; line-height:1.1; }
.sh-yard-station span { display:block; margin-top:3px; color:var(--ink-200); font-size:10.5px; }
.sh-track { position:absolute; left:7%; right:7%; height:4px; z-index:2; border-radius:var(--r-full); background:linear-gradient(90deg,var(--ink-500),var(--ink-800)); box-shadow:0 6px 0 -5px var(--ink-400),0 -6px 0 -5px var(--ink-400); }
.sh-track::after { content:""; position:absolute; left:0; right:0; top:-7px; height:18px; background:repeating-linear-gradient(90deg,transparent 0 17px,var(--ink-300) 17px 19px,transparent 19px 36px); opacity:.55; }
.sh-track.main { top:47%; } .sh-track.loop-a { top:33%; left:16%; right:16%; } .sh-track.loop-b { top:61%; left:16%; right:16%; }
.sh-turnout { position:absolute; z-index:2; height:4px; width:18%; background:var(--ink-500); border-radius:var(--r-full); transform-origin:left center; }
.sh-turnout.a { left:16%; top:40%; transform:rotate(18deg); } .sh-turnout.b { right:16%; top:54%; transform:rotate(18deg); }
.sh-platform { position:absolute; z-index:3; left:31%; right:31%; min-height:22px; border-radius:var(--r-sm); background:var(--warning-soft); border:1px solid var(--warning); color:var(--warning-text); display:grid; place-items:center; font-size:10.5px; font-weight:800; }
.sh-platform.pf1 { top:37%; } .sh-platform.pf2 { top:52%; }
.sh-building { position:absolute; z-index:3; left:43%; top:70%; width:14%; min-width:90px; height:30px; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); color:var(--ink-700); font-size:10.5px; font-weight:700; }
.sh-signal { position:absolute; z-index:4; width:13px; height:32px; color:var(--danger); }
.sh-signal::before { content:""; position:absolute; left:5px; top:10px; width:2px; height:22px; background:var(--ink-600); }
.sh-signal::after { content:""; position:absolute; left:0; top:0; width:12px; height:12px; border-radius:50%; background:var(--danger); box-shadow:0 0 0 3px var(--danger-soft); }
.sh-signal span { position:absolute; top:-1px; left:16px; font-size:10px; font-weight:800; color:var(--danger-text); white-space:nowrap; }
.sh-signal.s1 { left:20%; top:22%; } .sh-signal.s2 { right:22%; top:61%; }
.sh-ohe-line { position:absolute; z-index:1; left:8%; right:8%; top:74%; border-top:1px dashed var(--info); opacity:.8; }
.sh-ohe { position:absolute; z-index:3; width:9px; height:9px; border-radius:50%; background:var(--info); box-shadow:0 0 0 3px var(--info-soft); top:72%; }
.sh-ohe.a { left:24%; } .sh-ohe.b { left:42%; } .sh-ohe.c { left:60%; } .sh-ohe.d { left:78%; }
.sh-issue { position:absolute; z-index:5; width:20px; height:20px; display:grid; place-items:center; border-radius:50%; background:var(--danger); color:var(--paper); font-size:12px; font-weight:900; box-shadow:0 0 0 4px var(--danger-soft); }
.sh-issue.one { left:27%; top:29%; } .sh-issue.two { right:29%; top:57%; }
.sh-archive-line { position:absolute; z-index:1; left:10%; right:10%; top:42%; border-top:2px dashed var(--accent); opacity:.75; }
.sh-yard-legend { position:absolute; left:14px; bottom:12px; z-index:4; display:flex; flex-wrap:wrap; gap:8px; max-width:calc(100% - 28px); }
.sh-legend-item { display:inline-flex; align-items:center; gap:5px; padding:3px 7px; border:var(--hairline); border-radius:var(--r-full); background:rgba(255,255,255,.86); color:var(--ink-700); font-size:10.5px; font-weight:700; }
.sh-legend-dot { width:8px; height:8px; border-radius:50%; background:var(--ink-500); }
.sh-legend-dot.sip { background:var(--danger); } .sh-legend-dot.lop { background:var(--info); } .sh-legend-dot.issue { background:var(--danger); } .sh-legend-dot.archive { background:var(--accent); }
.sh-survey-card { display:flex; flex-direction:column; gap:12px; }
.sh-survey-head { margin-bottom:0; }
.sh-survey-list { display:grid; gap:8px; }
.sh-survey-item { border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:10px; display:grid; gap:8px; min-width:0; }
.sh-survey-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
.sh-survey-name { font-size:13px; font-weight:700; color:var(--ink-900); }
.sh-survey-meta { display:flex; flex-wrap:wrap; gap:6px; font-size:11.5px; color:var(--ink-600); line-height:1.35; }
.sh-survey-impact { display:flex; align-items:center; justify-content:space-between; gap:8px; padding-top:8px; border-top:var(--hairline); font-size:11.5px; color:var(--ink-600); }
.sh-survey-impact strong { color:var(--ink-900); font-weight:700; }
.sh-table { width:100%; border-collapse:collapse; }
.sh-table th { text-align:left; font-size:11px; color:var(--ink-500); text-transform:uppercase; letter-spacing:.06em; padding:8px; background:var(--ink-50); border-bottom:var(--hairline); }
.sh-table td { padding:8px; border-bottom:var(--hairline); font-size:12px; color:var(--ink-700); vertical-align:middle; }
.sh-table tr:last-child td { border-bottom:none; }
.sh-workflow-card { padding:0; overflow:visible; display:grid; grid-template-rows:auto auto auto auto; align-self:start; }
.sh-workflow-card > .sh-section-head { padding:14px 18px 0; margin-bottom:0; }
.sh-flow-summary { padding:14px 18px 12px; border-bottom:var(--hairline); display:grid; gap:10px; }
.sh-flow-summary-row { display:flex; align-items:center; justify-content:space-between; gap:16px; font-size:12.5px; color:var(--ink-600); }
.sh-flow-summary-row strong { color:var(--ink-900); font-weight:700; }
.sh-flow-active { font-family:var(--font-mono); color:var(--ink-500); font-size:12px; text-align:right; }
.sh-flow-progress-track { height:4px; border-radius:var(--r-full); background:var(--ink-100); overflow:hidden; }
.sh-flow-progress-fill { height:100%; border-radius:var(--r-full); background:var(--success); transition:width 180ms ease; }
.sh-workflow { display:grid; grid-template-columns:repeat(7,minmax(145px,1fr)); gap:10px; overflow-x:auto; padding:14px 18px 18px; }
.sh-flow-step { border:var(--hairline); border-radius:var(--r-md); background:var(--paper); padding:12px; min-height:118px; display:flex; flex-direction:column; gap:12px; }
.sh-flow-step[data-state="Completed"] { background:var(--success-soft); border-color:oklch(0.84 0.08 155); }
.sh-flow-step[data-state="Current"] { background:var(--warning-soft); border-color:var(--warning); box-shadow:0 0 0 2px oklch(0.94 0.07 78); }
.sh-flow-step[data-state="Not Started"] { background:var(--ink-50); color:var(--ink-500); }
.sh-flow-name { font-size:12.5px; font-weight:700; color:var(--ink-900); line-height:1.25; min-height:32px; }
.sh-flow-owner { margin-top:auto; padding-top:10px; border-top:var(--hairline); display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:11.5px; color:var(--ink-500); }
.sh-flow-owner strong { color:var(--ink-900); font-size:12px; font-weight:700; text-align:right; }
.sh-completion-strip { display:flex; align-items:center; flex-wrap:wrap; gap:12px 20px; padding:12px 18px; border-top:var(--hairline); background:var(--ink-50); }
.sh-completion-title { font-size:12.5px; font-weight:700; color:var(--ink-900); }
.sh-completion-item { display:inline-flex; align-items:center; gap:7px; color:var(--ink-600); font-size:12px; }
.sh-completion-dot { width:14px; height:14px; border-radius:50%; border:1px solid var(--ink-300); display:grid; place-items:center; color:transparent; background:var(--paper); }
.sh-completion-item[data-done="true"] .sh-completion-dot { border-color:transparent; background:var(--success-soft); color:var(--success-text); }
.sh-archive-panel { padding:0; overflow:hidden; }
.sh-archive-top { padding:14px 18px 0; }
.sh-archive-tabs { padding:0 18px; border-bottom:var(--hairline); }
.sh-archive-tabs .ds-tabs { border-bottom:none; }
.sh-archive-table-container { margin:14px 18px 18px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; }
.sh-archive-table-scroll { overflow-x:auto; }
.sh-archive-table { min-width:980px; width:100%; }
.sh-archive-table th:last-child,
.sh-archive-table td:last-child { text-align:right; }
.sh-archive-table tbody td { padding:7px 14px; }
.sh-archive-table thead th { padding:7px 14px; }
.sh-archive-row[data-latest="true"] { background:var(--success-soft); }
.sh-archive-row[data-latest="true"] td:first-child { border-left:3px solid var(--success); }
.sh-version-cell { display:flex; align-items:center; gap:8px; color:var(--ink-900); font-weight:700; }
.sh-latest-pill { display:inline-flex; align-items:center; height:20px; padding:0 7px; border-radius:var(--r-full); background:var(--success-soft); border:1px solid oklch(0.85 0.08 155); color:var(--success-text); font-size:10.5px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
.sh-archive-actions { display:flex; justify-content:flex-end; gap:6px; }
.sh-archive-action { min-height:28px; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 9px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-800); font-family:var(--font-sans); font-size:12px; font-weight:700; cursor:pointer; }
.sh-archive-action:hover { background:var(--ink-50); border-color:var(--ink-300); }
.sh-archive-foot-left { display:flex; align-items:center; gap:12px; min-width:0; }
.sh-archive-page-size { display:inline-flex; align-items:center; gap:6px; white-space:nowrap; color:var(--ink-600); }
.sh-archive-page-size select { height:28px; padding:0 24px 0 8px; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); font-family:var(--font-sans); font-size:12px; color:var(--ink-800); outline:none; appearance:none; cursor:pointer; background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>"); background-repeat:no-repeat; background-position:right 6px center; background-size:12px; }
.sh-archive-page-size select:focus { border-color:var(--accent); box-shadow:var(--shadow-focus); }
.sh-page-ellipsis { padding:0 4px; color:var(--ink-400); }
.sh-archive-empty { margin:14px 18px 18px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:14px; color:var(--ink-500); font-size:12.5px; text-align:center; }
.sh-esp-scroll { display:flex; flex-direction:column; align-items:stretch; gap:14px; }
.sh-esp-scroll > * { flex:0 0 auto; }
.sh-esp-validation-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; align-items:stretch; }
.sh-esp-validation-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); padding:14px; display:flex; flex-direction:column; gap:12px; min-width:0; }
.sh-esp-validation-title { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.sh-esp-validation-name { display:flex; align-items:center; gap:9px; min-width:0; font-size:14px; font-weight:700; color:var(--ink-900); line-height:1.25; }
.sh-esp-validation-icon { width:34px; height:34px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); display:grid; place-items:center; flex-shrink:0; }
.sh-esp-metrics { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:7px; }
.sh-esp-metric { border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:8px; min-width:0; }
.sh-esp-metric-value { color:var(--ink-900); font-size:16px; font-weight:700; line-height:1.1; font-variant-numeric:tabular-nums; }
.sh-esp-metric-label { margin-top:4px; color:var(--ink-500); font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
.sh-esp-action-row { display:flex; flex-wrap:wrap; gap:7px; margin-top:auto; padding-top:10px; border-top:var(--hairline); }
.sh-esp-table-card { border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; }
.sh-esp-table-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:14px 16px 12px; border-bottom:var(--hairline); }
.sh-esp-table-scroll { overflow-x:auto; }
.sh-esp-table { min-width:920px; width:100%; }
.sh-esp-table tbody td { padding:9px 14px; }
.sh-esp-table thead th { padding:8px 14px; }
.sh-esp-table th:last-child,
.sh-esp-table td:last-child { text-align:right; }
.sh-sortable-th { display:inline-flex; align-items:center; gap:6px; }
.sh-sortable-th svg { color:var(--ink-400); }
.sh-esp-asset-name { display:flex; align-items:center; gap:10px; color:var(--ink-900); font-size:13px; font-weight:700; }
.sh-esp-asset-icon { width:28px; height:28px; border-radius:var(--r-sm); background:var(--ink-100); color:var(--ink-700); display:grid; place-items:center; flex-shrink:0; }
.sh-esp-row-actions { display:flex; align-items:center; justify-content:flex-end; gap:6px; }
.sh-esp-row-action { min-height:28px; display:inline-flex; align-items:center; justify-content:center; gap:5px; padding:0 9px; border:var(--hairline); border-radius:var(--r-md); background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:12px; font-weight:500; cursor:pointer; white-space:nowrap; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-esp-row-action:hover { background:var(--ink-50); color:var(--ink-900); border-color:var(--ink-300); }
.sh-esp-row-action[data-primary="true"] { color:var(--accent); border-color:var(--accent); background:var(--accent-soft); }
.sh-esp-row-action[data-primary="true"]:hover { background:var(--paper); border-color:var(--accent-hover); color:var(--accent-hover); }
.sh-esp-row-action:disabled { opacity:.48; cursor:not-allowed; background:var(--ink-100); color:var(--ink-500); border-color:var(--ink-200); }
.sh-esp-row-action:disabled:hover { background:var(--ink-100); border-color:var(--ink-200); }
.sh-asset-nav { display:flex; align-items:center; gap:6px; overflow-x:auto; padding:2px 0 4px; }
.sh-asset-nav-btn { min-height:32px; display:inline-flex; align-items:center; gap:7px; padding:0 10px; border:var(--hairline); border-radius:var(--r-md); background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:12px; font-weight:500; cursor:pointer; white-space:nowrap; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-asset-nav-btn[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-track-switcher { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); }
.sh-track-switcher-label { display:flex; align-items:center; gap:8px; color:var(--ink-800); font-size:12.5px; font-weight:700; white-space:nowrap; }
.sh-track-list { display:flex; align-items:center; gap:5px; overflow-x:auto; }
.sh-track-btn { width:30px; height:28px; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-sm); background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:11.5px; font-weight:500; cursor:pointer; flex:0 0 auto; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-track-btn[data-active="true"] { background:var(--accent-soft); border-color:var(--accent); color:var(--accent-text); }
.sh-track-switcher-actions { display:flex; align-items:center; gap:4px; padding-left:8px; border-left:var(--hairline); flex-shrink:0; }
.sh-track-add-btn,.sh-track-remove-btn { height:28px; padding:0 8px; display:inline-flex; align-items:center; gap:4px; border:var(--hairline); border-radius:var(--r-sm); background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:11.5px; font-weight:500; cursor:pointer; white-space:nowrap; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-track-add-btn:hover { border-color:var(--success); background:var(--success-soft); color:var(--success-text); }
.sh-track-remove-btn:hover:not(:disabled) { border-color:var(--danger); background:var(--danger-soft); color:var(--danger-text); }
.sh-track-remove-btn:disabled { opacity:0.38; cursor:not-allowed; }
.sh-asset-workspace { display:grid; gap:10px; }
.sh-asset-editor-shell { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(340px,.85fr); align-items:stretch; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; min-height:560px; }
.sh-asset-preview-panel,.sh-asset-config-panel { background:var(--paper); min-width:0; overflow:hidden; display:flex; flex-direction:column; }
.sh-asset-preview-panel { border-right:var(--hairline); }
.sh-asset-panel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:14px 16px 12px; border-bottom:var(--hairline); }
.sh-asset-preview { position:relative; flex:1; min-height:430px; background:linear-gradient(180deg,var(--ink-50),var(--paper)); overflow:hidden; }
.sh-asset-preview[data-type="adjacent"] { background:var(--paper); padding:0; }
.sh-asset-esp-img { width:100%; height:100%; object-fit:contain; object-position:center; display:block; }
.sh-asset-preview[data-type="adjacent"] .sh-asset-preview-label { position:absolute; top:8px; left:12px; z-index:2; background:rgba(255,255,255,0.88); padding:2px 8px; border-radius:4px; font-size:10px; font-weight:600; letter-spacing:.04em; border:1px solid var(--ink-200); }
.sh-asset-preview::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:38px 38px; opacity:.75; }
.sh-asset-preview-track { position:absolute; left:7%; right:7%; height:5px; border-radius:var(--r-full); background:var(--ink-800); box-shadow:0 15px 0 -13px var(--ink-500),0 -15px 0 -13px var(--ink-500); }
.sh-asset-preview-track::after { content:""; position:absolute; left:0; right:0; top:-9px; height:23px; background:repeating-linear-gradient(90deg,transparent 0 20px,var(--ink-300) 20px 22px,transparent 22px 42px); opacity:.8; }
.sh-asset-preview-track.main { top:44%; }
.sh-asset-preview-track.loop { left:16%; right:16%; top:31%; background:var(--ink-600); }
.sh-asset-preview-track.siding { left:20%; right:28%; top:58%; background:var(--ink-600); }
.sh-asset-preview-turnout { position:absolute; z-index:2; width:22%; height:5px; border-radius:var(--r-full); background:var(--ink-500); transform-origin:left center; }
.sh-asset-preview-turnout.a { left:18%; top:37%; transform:rotate(17deg); }
.sh-asset-preview-turnout.b { right:28%; top:51%; transform:rotate(-18deg); }
.sh-asset-highlight { position:absolute; z-index:4; left:28%; right:28%; top:41%; height:34px; border:2px solid var(--accent); background:oklch(0.96 0.04 35 / .72); border-radius:var(--r-sm); box-shadow:0 0 0 5px oklch(0.96 0.04 35 / .55); }
.sh-asset-preview-label { position:absolute; z-index:5; left:16px; top:16px; padding:6px 9px; border:var(--hairline); border-radius:var(--r-md); background:rgba(255,255,255,.9); color:var(--ink-800); font-size:12px; font-weight:800; }
.sh-asset-preview-station { position:absolute; z-index:5; left:50%; top:68%; transform:translateX(-50%); min-width:128px; padding:8px 12px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); text-align:center; box-shadow:var(--shadow-xs); }
.sh-asset-preview-station strong { display:block; font-size:12px; line-height:1.1; }
.sh-asset-preview-station span { display:block; margin-top:3px; color:var(--ink-200); font-size:10.5px; }
.sh-asset-config-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; padding:14px 16px 16px; align-content:start; flex:1; min-height:0; overflow:auto; }
.sh-asset-config-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
.sh-asset-config-field[data-span="full"] { grid-column:1 / -1; }
.sh-asset-config-field label { font-size:11px; font-weight:700; color:var(--ink-700); }
.sh-asset-config-field input,.sh-asset-config-field select,.sh-asset-config-field textarea { width:100%; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 10px; font-family:var(--font-sans); font-size:12px; color:var(--ink-900); outline:none; }
.sh-asset-config-field input,.sh-asset-config-field select { height:34px; }
.sh-asset-config-field textarea { min-height:92px; padding:9px 10px; resize:vertical; line-height:1.45; }
.sh-asset-config-field input:focus,.sh-asset-config-field select:focus,.sh-asset-config-field textarea:focus { border-color:var(--accent); background:var(--paper); box-shadow:var(--shadow-focus); }
.sh-asset-live-preview { grid-column:1 / -1; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); overflow:hidden; }
.sh-asset-live-head { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:9px 10px; border-bottom:var(--hairline); }
.sh-asset-live-title { display:flex; align-items:center; gap:7px; color:var(--ink-900); font-size:12.5px; font-weight:700; }
.sh-asset-live-canvas { position:relative; min-height:118px; background:linear-gradient(180deg,var(--paper),var(--ink-50)); overflow:hidden; }
.sh-asset-live-canvas[data-type="adjacent"] { background:var(--paper); min-height:140px; }
.sh-asset-live-esp-img { width:100%; height:100%; min-height:140px; object-fit:contain; object-position:center; display:block; }
.sh-asset-live-canvas::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:22px 22px; opacity:.8; }
.sh-asset-live-line { position:absolute; left:10%; right:10%; top:52%; height:4px; border-radius:var(--r-full); background:var(--ink-700); box-shadow:0 -10px 0 -8px var(--ink-400),0 10px 0 -8px var(--ink-400); }
.sh-asset-live-badge { position:absolute; left:50%; top:42%; transform:translate(-50%,-50%); z-index:2; max-width:78%; padding:6px 9px; border:1px solid var(--accent); border-radius:var(--r-md); background:var(--accent-soft); color:var(--accent-text); font-size:12px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-asset-config-actions { flex-shrink:0; display:flex; align-items:center; justify-content:flex-end; gap:8px; padding:12px 16px; border-top:var(--hairline); background:var(--paper); }
.sh-review-nav-btn { position:relative; padding-right:30px; }
.sh-review-nav-dot { position:absolute; top:50%; right:10px; transform:translateY(-50%); width:8px; height:8px; border-radius:50%; background:var(--ink-300); }
.sh-review-nav-dot[data-tone="info"] { background:var(--info); }
.sh-review-nav-dot[data-tone="success"] { background:var(--success); }
.sh-review-nav-dot[data-tone="warning"] { background:var(--warning); }
.sh-review-nav-dot[data-tone="danger"] { background:var(--danger); }
.sh-review-nav-dot[data-tone="neutral"] { background:var(--ink-300); }
.sh-asset-nav-btn[data-active="true"] .sh-review-nav-dot { box-shadow:0 0 0 2px var(--ink-900); }
.sh-review-stepper { display:flex; align-items:center; gap:0; padding:12px 0 4px; overflow-x:auto; }
.sh-step-pill { display:flex; align-items:center; gap:9px; padding:6px 2px; border:none; background:none; cursor:pointer; text-align:left; flex-shrink:0; border-radius:var(--r-md); }
.sh-step-pill:hover .sh-step-circle { border-color:var(--ink-400); }
.sh-step-circle { width:28px; height:28px; border-radius:50%; display:grid; place-items:center; font-size:11px; font-weight:800; flex-shrink:0; background:var(--ink-100); color:var(--ink-500); border:1.5px solid var(--ink-200); transition:all 140ms; }
.sh-step-pill[data-active="true"] .sh-step-circle { background:var(--accent); color:var(--paper); border-color:var(--accent); box-shadow:0 4px 10px -4px oklch(0.55 0.22 280 / .5); }
.sh-step-pill[data-reviewed="true"] .sh-step-circle { background:var(--success-soft); color:var(--success-text); border-color:oklch(0.83 0.08 155); }
.sh-step-label { display:flex; flex-direction:column; gap:1px; }
.sh-step-label-name { font-size:11.5px; font-weight:600; color:var(--ink-700); white-space:nowrap; }
.sh-step-label-count { font-size:10px; color:var(--ink-400); }
.sh-step-pill[data-active="true"] .sh-step-label-name { color:var(--accent); }
.sh-step-pill[data-reviewed="true"] .sh-step-label-name { color:var(--success-text); }
.sh-step-connector { flex:1; min-width:14px; max-width:32px; height:1.5px; background:var(--ink-200); margin:0 4px; transition:background 200ms; }
.sh-step-connector[data-done="true"] { background:oklch(0.83 0.08 155); }
.sh-review-actions { justify-content:flex-start; }
.sh-review-actions .sh-review-spacer { flex:1; }
.sh-digitize-empty { flex:1; min-height:300px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:32px; color:var(--ink-500); text-align:center; }
.sh-digitize-empty > svg { color:var(--ink-300); }
.sh-digitize-empty-title { color:var(--ink-800); font-size:14px; font-weight:700; }
.sh-digitize-empty-sub { max-width:320px; font-size:12.5px; color:var(--ink-500); line-height:1.45; }
.sh-digitize-result { flex:1; display:flex; flex-direction:column; gap:14px; padding:16px; min-height:0; overflow:auto; }
.sh-digitize-result-card { display:flex; align-items:center; gap:12px; padding:14px; border:1px solid var(--accent); border-radius:var(--r-md); background:var(--accent-soft); color:var(--accent); }
.sh-digitize-result-file { font-family:var(--font-mono); font-size:13.5px; font-weight:700; color:var(--ink-900); }
.sh-digitize-result-sub { margin-top:3px; font-size:11.5px; color:var(--ink-600); }
.sh-esp-editor { display:flex; flex-direction:column; flex:1; min-width:0; height:100vh; overflow:hidden; background:var(--canvas); }
.sh-editor-toolbar { min-height:58px; display:flex; align-items:center; justify-content:space-between; gap:14px; padding:10px 14px; border-bottom:var(--hairline); background:var(--paper); flex-shrink:0; }
.sh-editor-title-block { display:flex; align-items:center; gap:10px; min-width:0; }
.sh-editor-icon-btn { width:34px; height:34px; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-700); cursor:pointer; flex:0 0 auto; }
.sh-editor-icon-btn:hover:not(:disabled) { background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.sh-editor-icon-btn:disabled { opacity:.45; cursor:not-allowed; }
.sh-editor-title { display:flex; align-items:center; gap:8px; min-width:0; color:var(--ink-900); font-size:16px; font-weight:800; }
.sh-editor-title span:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-editor-sub { margin-top:2px; color:var(--ink-500); font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-editor-actions { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; flex-shrink:0; }
.sh-editor-zoom { height:34px; display:inline-flex; align-items:center; gap:6px; padding:0 8px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); }
.sh-editor-zoom input { width:112px; accent-color:var(--accent); cursor:pointer; }
.sh-editor-zoom-value { min-width:42px; color:var(--ink-700); font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; text-align:center; }
.sh-editor-main { flex:1; min-height:0; display:grid; grid-template-columns:230px minmax(0,1fr) 340px; overflow:hidden; }
.sh-esp-editor[data-expanded="true"] .sh-editor-main { grid-template-columns:minmax(0,1fr); }
.sh-esp-editor[data-expanded="true"] .sh-editor-asset-rail,
.sh-esp-editor[data-expanded="true"] .sh-editor-inspector { display:none; }
.sh-editor-asset-rail { min-width:0; border-right:var(--hairline); background:var(--paper); overflow:auto; padding:12px; display:flex; flex-direction:column; gap:10px; }
.sh-editor-rail-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:2px 2px 8px; border-bottom:var(--hairline); }
.sh-editor-rail-title { color:var(--ink-900); font-size:13px; font-weight:700; }
.sh-editor-layer-list { display:grid; gap:6px; }
.sh-editor-layer-btn { width:100%; min-height:38px; display:flex; align-items:center; gap:8px; padding:7px 8px; border:var(--hairline); border-radius:var(--r-md); background:transparent; color:var(--ink-600); font-family:var(--font-sans); font-size:12px; font-weight:500; text-align:left; cursor:pointer; transition:background 120ms,color 120ms; }
.sh-editor-layer-btn:hover { background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.sh-editor-layer-btn[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-editor-layer-text { min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-editor-layer-count { margin-left:auto; min-width:22px; height:20px; display:grid; place-items:center; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-600); font-size:10.5px; font-weight:600; }
.sh-editor-layer-btn[data-active="true"] .sh-editor-layer-count { background:rgba(255,255,255,.16); color:var(--paper); }
.sh-editor-stage-wrap { min-width:0; min-height:0; display:flex; flex-direction:column; background:var(--canvas); overflow:hidden; }
.sh-editor-stage-head { min-height:42px; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 12px; border-bottom:var(--hairline); background:var(--ink-50); flex-shrink:0; }
.sh-editor-context { display:flex; align-items:center; gap:8px; min-width:0; color:var(--ink-700); font-size:12px; font-weight:700; }
.sh-editor-context strong { color:var(--ink-900); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-editor-pills { display:flex; align-items:center; justify-content:flex-end; gap:6px; flex-wrap:wrap; }
.sh-editor-pill { min-height:24px; display:inline-flex; align-items:center; gap:5px; padding:0 8px; border:var(--hairline); border-radius:var(--r-full); background:var(--paper); color:var(--ink-600); font-size:11px; font-weight:600; white-space:nowrap; }
.sh-editor-viewport { flex:1; min-height:0; overflow:auto; display:grid; place-items:center; padding:28px; background:var(--canvas); }
.sh-editor-canvas { position:relative; width:1160px; height:660px; flex:0 0 auto; border:var(--hairline); border-radius:var(--r-lg); background:linear-gradient(180deg,var(--paper),var(--ink-50)); box-shadow:var(--shadow-md); overflow:hidden; transform:scale(var(--editor-zoom,1)); transform-origin:center center; }
.sh-editor-canvas::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:32px 32px; opacity:.82; pointer-events:none; }
.sh-editor-canvas::after { content:""; position:absolute; left:4%; right:4%; top:50%; border-top:1px dashed var(--ink-300); pointer-events:none; }
.sh-editor-station-chip { position:absolute; z-index:8; left:50%; top:10%; transform:translateX(-50%); min-width:150px; padding:8px 12px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); text-align:center; box-shadow:var(--shadow-xs); }
.sh-editor-station-chip strong { display:block; font-size:12px; line-height:1.1; }
.sh-editor-station-chip span { display:block; margin-top:3px; color:var(--ink-200); font-size:10.5px; }
.sh-plan-asset { position:absolute; z-index:4; border:none; padding:0; background:transparent; color:var(--ink-900); font-family:var(--font-sans); cursor:pointer; }
.sh-plan-asset:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.sh-plan-asset[data-selected="true"] { z-index:15; }
.sh-plan-label { position:absolute; left:50%; top:-26px; transform:translateX(-50%); max-width:170px; padding:4px 7px; border:var(--hairline); border-radius:var(--r-sm); background:rgba(255,255,255,.94); color:var(--ink-800); font-size:10.5px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; box-shadow:var(--shadow-xs); pointer-events:none; }
.sh-plan-track { height:26px; left:var(--left); right:var(--right); top:var(--top); }
.sh-plan-track::before { content:""; position:absolute; left:0; right:0; top:11px; height:5px; border-radius:var(--r-full); background:var(--ink-800); box-shadow:0 -12px 0 -10px var(--ink-500),0 12px 0 -10px var(--ink-500); }
.sh-plan-track::after { content:""; position:absolute; left:0; right:0; top:2px; height:23px; background:repeating-linear-gradient(90deg,transparent 0 19px,var(--ink-300) 19px 21px,transparent 21px 40px); opacity:.85; }
.sh-plan-turnout { height:24px; width:var(--width); left:var(--left); top:var(--top); transform:rotate(var(--angle)); transform-origin:left center; }
.sh-plan-turnout::before { content:""; position:absolute; left:0; right:0; top:10px; height:5px; border-radius:var(--r-full); background:var(--ink-600); }
.sh-plan-platform { min-height:34px; width:var(--width); left:var(--left); top:var(--top); border:1px solid var(--warning); border-radius:var(--r-sm); background:var(--warning-soft); color:var(--warning-text); display:grid; place-items:center; font-size:11px; font-weight:900; }
.sh-plan-structure { min-height:48px; width:var(--width); left:var(--left); top:var(--top); border:var(--hairline); border-radius:var(--r-md); background:var(--paper); display:grid; place-items:center; box-shadow:var(--shadow-xs); }
.sh-plan-gate,.sh-plan-marker { width:34px; height:34px; left:var(--left); top:var(--top); border:var(--hairline); border-radius:50%; background:var(--paper); display:grid; place-items:center; box-shadow:var(--shadow-xs); }
.sh-plan-gate { color:var(--danger-text); background:var(--danger-soft); border-color:oklch(0.88 0.08 25); }
.sh-plan-marker { color:var(--info); background:var(--info-soft); border-color:oklch(0.86 0.08 235); }
.sh-plan-bridge { min-height:58px; width:var(--width); left:var(--left); top:var(--top); border:2px solid var(--ink-600); border-left:none; border-right:none; background:repeating-linear-gradient(90deg,rgba(255,255,255,.72) 0 12px,var(--ink-100) 12px 18px); }
.sh-plan-curve { height:66px; width:var(--width); left:var(--left); top:var(--top); border-top:5px solid var(--ink-700); border-radius:80% 80% 0 0; background:transparent; }
.sh-plan-gradient { min-height:38px; width:var(--width); left:var(--left); top:var(--top); border:1px solid oklch(0.82 0.11 35); border-radius:var(--r-md); background:linear-gradient(110deg,var(--accent-soft),rgba(255,255,255,.88)); transform:rotate(var(--angle)); transform-origin:left center; box-shadow:var(--shadow-xs); }
.sh-plan-gradient::before { content:""; position:absolute; left:12px; right:28px; top:50%; border-top:2px dashed var(--accent); }
.sh-plan-gradient::after { content:""; position:absolute; right:14px; top:50%; width:9px; height:9px; border-right:2px solid var(--accent); border-top:2px solid var(--accent); transform:translateY(-50%) rotate(45deg); }
.sh-plan-boundary { height:32px; width:var(--width); left:var(--left); top:var(--top); border:2px dashed var(--ink-400); border-radius:var(--r-md); background:rgba(255,255,255,.35); }
.sh-plan-asset[data-selected="true"] .sh-plan-label,
.sh-plan-asset[data-selected="true"].sh-plan-platform,
.sh-plan-asset[data-selected="true"].sh-plan-structure,
.sh-plan-asset[data-selected="true"].sh-plan-gate,
.sh-plan-asset[data-selected="true"].sh-plan-marker,
.sh-plan-asset[data-selected="true"].sh-plan-gradient,
.sh-plan-asset[data-selected="true"].sh-plan-boundary { box-shadow:0 0 0 4px oklch(0.92 0.06 35 / .75), var(--shadow-md); }
.sh-plan-asset[data-selected="true"].sh-plan-track::before,
.sh-plan-asset[data-selected="true"].sh-plan-turnout::before { background:var(--accent); box-shadow:0 0 0 5px oklch(0.94 0.06 35 / .72); }
.sh-editor-inspector { min-width:0; border-left:var(--hairline); background:var(--paper); overflow:hidden; display:flex; flex-direction:column; }
.sh-inspector-head { padding:14px 16px 12px; border-bottom:var(--hairline); display:grid; gap:10px; }
.sh-inspector-title-row { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.sh-inspector-title { color:var(--ink-900); font-size:15px; font-weight:800; line-height:1.2; }
.sh-inspector-sub { margin-top:4px; color:var(--ink-500); font-size:12px; line-height:1.35; }
.sh-inspector-scroll { flex:1; min-height:0; overflow:auto; display:grid; align-content:start; }
.sh-inspector-form { padding:14px 16px 16px; display:grid; gap:11px; }
.sh-inspector-field { display:grid; gap:5px; min-width:0; }
.sh-inspector-field label { color:var(--ink-700); font-size:11px; font-weight:700; }
.sh-inspector-field input,.sh-inspector-field select,.sh-inspector-field textarea { width:100%; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); color:var(--ink-900); font-family:var(--font-sans); font-size:12px; outline:none; box-sizing:border-box; }
.sh-inspector-field input,.sh-inspector-field select { height:34px; padding:0 10px; }
.sh-inspector-field textarea { min-height:82px; padding:9px 10px; line-height:1.45; resize:vertical; }
.sh-inspector-field input:focus,.sh-inspector-field select:focus,.sh-inspector-field textarea:focus { border-color:var(--accent); background:var(--paper); box-shadow:var(--shadow-focus); }
.sh-inspector-live { margin:0 16px 16px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); overflow:hidden; }
.sh-inspector-live-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 10px; border-bottom:var(--hairline); color:var(--ink-900); font-size:12px; font-weight:800; }
.sh-inspector-live-body { padding:10px; display:grid; gap:7px; color:var(--ink-600); font-size:12px; line-height:1.35; }
.sh-inspector-live-body strong { color:var(--ink-900); }
.sh-inspector-actions { flex-shrink:0; display:flex; align-items:center; justify-content:flex-end; gap:8px; padding:12px 16px; border-top:var(--hairline); background:var(--paper); flex-wrap:wrap; }
.sh-editor-statusbar { min-height:34px; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:7px 12px; border-top:var(--hairline); background:var(--paper); color:var(--ink-500); font-size:11.5px; flex-shrink:0; }
.sh-editor-statusbar strong { color:var(--ink-900); }
.sh-editor-bottom-dock { position:absolute; left:50%; bottom:18px; z-index:30; transform:translateX(-50%); display:inline-flex; align-items:center; gap:4px; padding:6px; border:var(--hairline); border-radius:var(--r-lg); background:rgba(255,255,255,.94); box-shadow:var(--shadow-lg); backdrop-filter:blur(10px); }
.sh-editor-tool-btn { width:36px; height:36px; display:grid; place-items:center; border:1px solid transparent; border-radius:var(--r-md); background:transparent; color:var(--ink-600); cursor:pointer; }
.sh-editor-tool-btn:hover { background:var(--ink-50); border-color:var(--ink-200); color:var(--ink-900); }
.sh-editor-tool-btn[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-editor-dock-divider { width:1px; height:24px; margin:0 3px; background:var(--ink-200); }
.sh-editor-layer-group { display:grid; gap:7px; }
.sh-editor-layer-heading { margin:6px 2px 0; color:var(--ink-500); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
.sh-editor-context-menu { display:flex; align-items:center; gap:6px; min-width:0; }
.sh-editor-context-menu .ds-btn { height:30px; }
.sh-editor-validations { display:grid; gap:8px; padding:0 16px 16px; }
.sh-editor-validation-row { display:flex; align-items:center; justify-content:space-between; gap:8px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:8px 10px; color:var(--ink-700); font-size:11.5px; font-weight:700; }
.sh-editor-selected-meta { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; padding:0 16px 14px; }
.sh-editor-selected-tile { min-height:54px; display:grid; align-content:center; gap:2px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); padding:8px 10px; }
.sh-editor-selected-tile strong { color:var(--ink-900); font-size:12px; }
.sh-editor-selected-tile span { color:var(--ink-500); font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; }
.sh-plan-label[data-tone="danger"] { color:var(--danger-text); border-color:oklch(0.86 0.09 25); background:var(--danger-soft); }
.sh-plan-label[data-tone="success"] { color:var(--success-text); border-color:oklch(0.86 0.08 155); background:var(--success-soft); }
.sh-editor-toast { position:fixed; right:22px; bottom:22px; z-index:10000; min-height:40px; display:inline-flex; align-items:center; gap:8px; padding:9px 13px; border:1px solid oklch(0.9 0.06 155); border-radius:var(--r-md); background:var(--success-soft); color:var(--success-text); box-shadow:var(--shadow-lg); font-size:12.5px; font-weight:900; }
.sh-sip-editor .sh-editor-main { grid-template-columns:minmax(0,1fr); }
.sh-sip-editor[data-has-selection="true"] .sh-editor-main { grid-template-columns:minmax(0,1fr) 360px; }
.sh-sip-nav { display:flex; align-items:center; gap:6px; overflow-x:auto; padding-bottom:2px; }
.sh-sip-nav-btn { min-height:30px; display:inline-flex; align-items:center; gap:6px; padding:0 9px; border:var(--hairline); border-radius:var(--r-md); background:transparent; color:var(--ink-500); font-family:var(--font-sans); font-size:11.5px; font-weight:500; cursor:pointer; white-space:nowrap; transition:background 120ms,color 120ms,border-color 120ms; }
.sh-sip-nav-btn:hover { background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.sh-sip-nav-btn[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-sip-nav-count { min-width:18px; height:18px; display:grid; place-items:center; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-600); font-size:10px; font-weight:600; }
.sh-sip-nav-btn[data-active="true"] .sh-sip-nav-count { background:rgba(255,255,255,.16); color:var(--paper); }
.sh-sip-canvas { width:1240px; height:720px; }
.sh-sip-track { position:absolute; z-index:2; left:8%; right:8%; height:5px; border-radius:var(--r-full); background:var(--ink-800); box-shadow:0 -14px 0 -12px var(--ink-500),0 14px 0 -12px var(--ink-500); }
.sh-sip-track::after { content:""; position:absolute; left:0; right:0; top:-10px; height:25px; background:repeating-linear-gradient(90deg,transparent 0 22px,var(--ink-300) 22px 24px,transparent 24px 46px); opacity:.82; }
.sh-sip-track.main { top:48%; }
.sh-sip-track.loop { left:18%; right:18%; top:36%; background:var(--ink-650,var(--ink-600)); }
.sh-sip-track.siding { left:22%; right:28%; top:60%; background:var(--ink-600); }
.sh-sip-turnout { position:absolute; z-index:3; left:54%; top:43%; width:18%; height:5px; border-radius:var(--r-full); background:var(--ink-600); transform:rotate(-17deg); transform-origin:left center; }
.sh-sip-green-zone { position:absolute; z-index:1; left:60%; top:39%; width:18%; height:86px; border:1px solid oklch(0.78 0.12 155); border-radius:var(--r-md); background:oklch(0.95 0.05 155 / .68); }
.sh-sip-green-zone span { position:absolute; left:8px; top:7px; color:var(--success-text); font-size:10.5px; font-weight:900; }
.sh-sip-element { position:absolute; z-index:8; left:var(--left); top:var(--top); transform:translate(-50%,-50%); min-width:44px; min-height:34px; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-800); font-family:var(--font-sans); font-size:11px; font-weight:900; cursor:pointer; box-shadow:var(--shadow-xs); }
.sh-sip-element:hover { border-color:var(--ink-300); background:var(--ink-50); }
.sh-sip-element[data-kind="signal"] { color:var(--danger-text); background:var(--danger-soft); border-color:oklch(0.86 0.09 25); }
.sh-sip-element[data-kind="circuit"] { min-width:62px; color:var(--info); background:var(--info-soft); border-color:oklch(0.86 0.08 235); }
.sh-sip-element[data-kind="point"] { color:var(--accent-text); background:var(--accent-soft); border-color:var(--accent); }
.sh-sip-element[data-kind="gate"] { color:var(--warning-text); background:var(--warning-soft); border-color:oklch(0.84 0.12 78); }
.sh-sip-element[data-kind="route"] { min-width:70px; background:var(--paper); }
.sh-sip-element[data-selected="true"] { z-index:12; box-shadow:0 0 0 4px oklch(0.92 0.06 35 / .75), var(--shadow-md); }
.sh-sip-element[data-issue="true"] { box-shadow:0 0 0 4px oklch(0.92 0.10 25 / .75), var(--shadow-md); }
.sh-sip-element-label { display:flex; align-items:center; gap:5px; padding:0 7px; white-space:nowrap; }
.sh-sip-issue-card { position:absolute; z-index:10; right:6%; top:22%; width:260px; border:1px solid oklch(0.86 0.09 25); border-radius:var(--r-md); background:var(--danger-soft); color:var(--danger-text); padding:10px; box-shadow:var(--shadow-md); }
.sh-sip-issue-card strong { display:block; margin-bottom:4px; color:var(--danger-text); font-size:12px; }
.sh-sip-issue-card span { display:block; color:var(--ink-700); font-size:11.5px; line-height:1.35; }
.sh-sip-table-panel { position:absolute; z-index:5; left:7%; bottom:7%; display:grid; grid-template-columns:repeat(3,120px); gap:8px; }
.sh-sip-table-tile { min-height:54px; display:grid; align-content:center; gap:3px; padding:8px; border:var(--hairline); border-radius:var(--r-md); background:rgba(255,255,255,.92); box-shadow:var(--shadow-xs); }
.sh-sip-table-tile strong { color:var(--ink-900); font-size:11.5px; }
.sh-sip-table-tile span { color:var(--ink-500); font-size:10.5px; font-weight:700; }
.sh-sip-empty-inspector { height:100%; display:grid; place-items:center; padding:22px; color:var(--ink-500); font-size:12.5px; text-align:center; }
.sh-sip-validation-list { display:grid; gap:7px; padding:0 16px 16px; }
.sh-sip-validation-item { display:flex; align-items:center; justify-content:space-between; gap:8px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:8px 10px; color:var(--ink-700); font-size:11.5px; font-weight:700; }
.sh-more-wrap { position:relative; display:inline-flex; }
.sh-more-menu { position:absolute; top:calc(100% + 6px); right:0; z-index:40; min-width:210px; padding:6px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); box-shadow:var(--shadow-lg); }
.sh-more-item { width:100%; min-height:32px; display:flex; align-items:center; gap:8px; padding:0 9px; border:none; border-radius:var(--r-sm); background:transparent; color:var(--ink-700); font-family:var(--font-sans); font-size:12.5px; font-weight:700; text-align:left; cursor:pointer; }
.sh-more-item:hover { background:var(--ink-50); color:var(--ink-900); }
.sh-esp-version-row[data-latest="true"] { background:var(--success-soft); }
.sh-esp-version-row[data-latest="true"] td:first-child { border-left:3px solid var(--success); }
.sh-esp-note { display:flex; align-items:flex-start; gap:9px; margin:12px 16px 14px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); color:var(--ink-600); font-size:12px; line-height:1.4; }
.sh-esp-note strong { color:var(--ink-900); }
.sh-rule-list { display:grid; gap:8px; padding:14px 18px; }
.sh-rule { border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:10px; font-size:12px; color:var(--ink-700); line-height:1.4; }
.sh-rule strong { display:block; margin-bottom:4px; color:var(--ink-900); }
.sh-edit-overlay { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(15,23,42,.36); }
.sh-edit-modal { width:min(760px,calc(100vw - 32px)); max-height:calc(100vh - 48px); overflow:auto; background:var(--paper); border:var(--hairline); border-radius:var(--r-lg); box-shadow:0 18px 54px rgba(0,0,0,.22); }
.sh-edit-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-bottom:var(--hairline); }
.sh-edit-title { font-size:15px; font-weight:800; color:var(--ink-900); }
.sh-edit-close { width:28px; height:28px; display:grid; place-items:center; border:none; border-radius:var(--r-md); background:transparent; color:var(--ink-500); cursor:pointer; }
.sh-edit-close:hover { background:var(--ink-50); color:var(--ink-800); }
.sh-edit-body { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; padding:14px 18px; }
.sh-edit-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
.sh-edit-field label { font-size:11px; font-weight:700; color:var(--ink-700); }
.sh-edit-field input,.sh-edit-field select { height:34px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 10px; font-family:var(--font-sans); font-size:12px; color:var(--ink-900); outline:none; box-sizing:border-box; }
.sh-edit-field input[type="file"] { height:auto; min-height:38px; padding:8px 10px; cursor:pointer; }
.sh-edit-field input:focus,.sh-edit-field select:focus { border-color:var(--accent); box-shadow:var(--shadow-focus); background:var(--paper); }
.sh-edit-actions { display:flex; justify-content:flex-end; gap:8px; padding:12px 18px 16px; border-top:var(--hairline); }
.sh-upload-step { display:flex; align-items:center; gap:8px; color:var(--ink-500); font-size:12px; font-weight:700; }
.sh-upload-types { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; padding:14px 18px; }
.sh-upload-type { min-height:88px; display:flex; flex-direction:column; align-items:flex-start; justify-content:space-between; gap:10px; padding:12px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-700); font-family:var(--font-sans); cursor:pointer; text-align:left; }
.sh-upload-type:hover { background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.sh-upload-type[data-active="true"] { background:var(--accent-soft); border-color:var(--accent); color:var(--accent-text); }
.sh-upload-type strong { display:flex; align-items:center; gap:8px; color:inherit; font-size:13px; }
.sh-upload-type span { color:var(--ink-500); font-size:11.5px; line-height:1.35; }
.sh-upload-type[data-active="true"] span { color:var(--accent-text); }
.sh-upload-summary { margin:0 18px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); color:var(--ink-600); font-size:12px; }
.sh-upload-default-file { color:var(--ink-500); font-size:11.5px; line-height:1.35; }
.sh-upload-portal { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(15,23,42,.42); backdrop-filter:blur(2px); animation:dsFadeIn 180ms; }
.sh-upload-shell { width:min(560px, calc(100% - 32px)); max-height:calc(100vh - 48px); display:flex; flex-direction:column; background:var(--paper); border-radius:var(--r-xl); box-shadow:0 22px 60px rgba(0,0,0,.28); overflow:hidden; animation:dsSlideUp 200ms ease-out; }
.sh-upload-shell-head { display:flex; align-items:flex-start; gap:12px; padding:18px 20px; border-bottom:var(--hairline); }
.sh-upload-shell-icon { width:36px; height:36px; border-radius:var(--r-md); background:var(--accent-soft); color:var(--accent-text); display:grid; place-items:center; flex-shrink:0; }
.sh-upload-shell-text { flex:1; min-width:0; }
.sh-upload-shell-title { font-size:16px; font-weight:700; color:var(--ink-900); letter-spacing:-0.01em; line-height:1.2; }
.sh-upload-shell-sub { margin-top:3px; font-size:12.5px; color:var(--ink-500); }
.sh-upload-shell-close { width:30px; height:30px; border-radius:var(--r-sm); border:none; background:transparent; color:var(--ink-500); cursor:pointer; display:grid; place-items:center; flex-shrink:0; }
.sh-upload-shell-close:hover { background:var(--ink-100); color:var(--ink-800); }
.sh-upload-shell-body { padding:18px 20px; overflow-y:auto; display:flex; flex-direction:column; gap:14px; }
.sh-upload-shell-foot { padding:14px 20px; border-top:var(--hairline); display:flex; align-items:center; justify-content:flex-end; gap:8px; background:var(--ink-50); }
.sh-upload-summary-bar { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); color:var(--ink-700); font-size:12.5px; }
.sh-upload-summary-bar strong { color:var(--ink-900); font-weight:700; }
.sh-upload-summary-change { border:none; background:transparent; color:var(--accent-text); cursor:pointer; font-family:var(--font-sans); font-size:12px; font-weight:700; }
.sh-upload-summary-change:hover { text-decoration:underline; }
.sh-upload-grid { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:12px; }
.sh-upload-grid-field { display:flex; flex-direction:column; gap:6px; min-width:0; }
.sh-upload-grid-field[data-span="full"] { grid-column:1 / -1; }
.sh-upload-grid-label { font-size:11px; font-weight:700; color:var(--ink-700); text-transform:uppercase; letter-spacing:0.04em; }
.sh-upload-grid-input { height:36px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 10px; font-family:var(--font-sans); font-size:13px; color:var(--ink-900); outline:none; box-sizing:border-box; }
.sh-upload-grid-input:focus { border-color:var(--accent); box-shadow:var(--shadow-focus); background:var(--paper); }
.sh-upload-grid-input.is-file { height:auto; min-height:38px; padding:8px 10px; cursor:pointer; }
.sh-upload-file-card { display:flex; align-items:center; gap:12px; padding:14px; border:1px solid var(--success); border-radius:var(--r-md); background:var(--success-soft); }
.sh-upload-file-icon { width:40px; height:40px; border-radius:var(--r-md); background:var(--paper); color:var(--success-text); display:grid; place-items:center; flex-shrink:0; border:var(--hairline); }
.sh-upload-file-meta { flex:1; min-width:0; }
.sh-upload-file-name { font-family:var(--font-mono); font-size:13.5px; font-weight:700; color:var(--ink-900); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-upload-file-sub { margin-top:3px; font-size:11.5px; color:var(--ink-600); }
.sh-upload-file-chip { display:inline-flex; align-items:center; gap:4px; padding:4px 9px; border-radius:var(--r-full); background:var(--success); color:var(--paper); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; flex-shrink:0; }
.sh-upload-file-remove { width:28px; height:28px; border-radius:var(--r-sm); border:var(--hairline); background:var(--paper); color:var(--ink-600); cursor:pointer; display:grid; place-items:center; flex-shrink:0; }
.sh-upload-file-remove:hover { background:var(--danger-soft); color:var(--danger-text); border-color:oklch(0.86 0.09 25); }
.sh-upload-select-zone { position:relative; display:flex; align-items:center; gap:14px; padding:18px; border:1.5px dashed var(--ink-300); border-radius:var(--r-md); background:var(--ink-50); cursor:pointer; transition:border-color 140ms, background 140ms; }
.sh-upload-select-zone:hover { border-color:var(--accent); background:var(--accent-soft); }
.sh-upload-group { display:flex; flex-direction:column; gap:10px; padding:12px 14px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); }
.sh-upload-group-label { font-size:10px; font-weight:700; color:var(--ink-500); text-transform:uppercase; letter-spacing:.07em; }
.sh-upload-version-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; }
.sh-upload-version-preview { display:flex; align-items:center; gap:8px; padding-top:4px; border-top:var(--hairline); }
.sh-upload-version-preview-label { font-size:11px; color:var(--ink-400); }
.sh-upload-version-id { font-family:var(--font-mono); font-size:13px; font-weight:700; color:var(--ink-900); letter-spacing:.04em; }
.sh-upload-select-input { position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; }
.sh-upload-select-icon { width:40px; height:40px; border-radius:var(--r-md); background:var(--paper); color:var(--accent-text); display:grid; place-items:center; flex-shrink:0; border:var(--hairline); }
.sh-upload-select-copy { flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; }
.sh-upload-select-copy strong { font-size:13px; font-weight:700; color:var(--ink-900); }
.sh-upload-select-copy span { font-size:11.5px; color:var(--ink-600); line-height:1.35; }
.sh-upload-select-button { display:inline-flex; align-items:center; padding:7px 12px; border-radius:var(--r-md); background:var(--ink-900); color:var(--paper); font-size:12px; font-weight:800; flex-shrink:0; }
.sh-upload-types-grid { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:10px; }
.sh-upload-types-grid .sh-upload-type { min-height:88px; }
@keyframes dsFadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes dsSlideUp { from { transform:translateY(8px); opacity:0; } to { transform:translateY(0); opacity:1; } }
.sh-pim-stepper { display:grid; grid-template-columns:repeat(6,minmax(120px,1fr)); gap:8px; padding:0 0 2px; overflow-x:auto; }
.sh-pim-step { min-height:58px; display:flex; align-items:center; gap:8px; padding:8px 10px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-700); font-family:var(--font-sans); cursor:pointer; text-align:left; }
.sh-pim-step:hover { background:var(--ink-50); border-color:var(--ink-300); }
.sh-pim-step[data-reviewed="true"] { border-color:oklch(0.83 0.08 155); background:var(--success-soft); }
.sh-pim-step[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.sh-pim-step-index { width:22px; height:22px; display:grid; place-items:center; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-600); font-size:11px; font-weight:900; flex-shrink:0; }
.sh-pim-step[data-active="true"] .sh-pim-step-index { background:rgba(255,255,255,.18); color:var(--paper); }
.sh-pim-step-copy { min-width:0; display:grid; gap:2px; }
.sh-pim-step-copy strong { font-size:11.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-pim-step-copy span { font-size:10.5px; opacity:.78; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sh-pim-workspace { display:grid; grid-template-columns:minmax(0,1fr) minmax(380px,1fr); gap:0; min-height:560px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; align-items:stretch; }
.sh-pim-source,.sh-pim-fields { border:none; border-radius:0; background:var(--paper); overflow:hidden; min-width:0; display:flex; flex-direction:column; }
.sh-pim-source { border-right:var(--hairline); }
.sh-pim-panel-head { min-height:52px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:12px 14px; border-bottom:var(--hairline); }
.sh-pim-panel-title { color:var(--ink-900); font-size:14px; font-weight:800; }
.sh-pim-panel-sub { margin-top:3px; color:var(--ink-500); font-size:12px; }
.sh-pim-diagram { position:relative; flex:1; min-height:460px; background:linear-gradient(180deg,var(--paper),var(--ink-50)); overflow:hidden; }
.sh-pim-diagram::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:28px 28px; opacity:.8; }
.sh-pim-track { position:absolute; z-index:2; left:8%; right:8%; height:5px; border-radius:var(--r-full); background:var(--ink-800); box-shadow:0 -13px 0 -11px var(--ink-500),0 13px 0 -11px var(--ink-500); }
.sh-pim-track::after { content:""; position:absolute; left:0; right:0; top:-9px; height:23px; background:repeating-linear-gradient(90deg,transparent 0 20px,var(--ink-300) 20px 22px,transparent 22px 42px); opacity:.82; }
.sh-pim-track.main { top:48%; }
.sh-pim-track.loop { left:16%; right:17%; top:34%; background:var(--ink-600); }
.sh-pim-track.siding { left:22%; right:30%; top:61%; background:var(--ink-600); }
.sh-pim-turnout { position:absolute; z-index:3; width:20%; height:5px; border-radius:var(--r-full); background:var(--ink-600); transform-origin:left center; }
.sh-pim-turnout.a { left:24%; top:42%; transform:rotate(17deg); }
.sh-pim-turnout.b { left:57%; top:52%; transform:rotate(-18deg); }
.sh-pim-highlight { position:absolute; z-index:5; border:2px solid var(--accent); border-radius:var(--r-md); background:oklch(0.96 0.04 35 / .62); box-shadow:0 0 0 5px oklch(0.96 0.04 35 / .45); }
.sh-pim-highlight[data-step="1"] { left:38%; top:12%; width:24%; height:54px; }
.sh-pim-highlight[data-step="2"] { left:10%; right:10%; top:43%; height:58px; }
.sh-pim-highlight[data-step="3"] { left:54%; top:45%; width:24%; height:68px; }
.sh-pim-highlight[data-step="4"] { left:36%; top:25%; width:28%; height:52px; }
.sh-pim-highlight[data-step="5"] { left:42%; top:68%; width:22%; height:72px; }
.sh-pim-highlight[data-step="6"] { left:12%; top:16%; width:20%; height:280px; }
.sh-pim-highlight[data-step="7"] { left:50%; top:36%; width:30%; height:110px; border-color:var(--danger); background:oklch(0.96 0.05 25 / .62); }
.sh-pim-highlight[data-step="8"] { left:24%; top:22%; width:54%; height:360px; }
.sh-pim-label { position:absolute; z-index:8; padding:5px 8px; border:var(--hairline); border-radius:var(--r-sm); background:rgba(255,255,255,.94); color:var(--ink-800); font-size:11px; font-weight:900; box-shadow:var(--shadow-xs); }
.sh-pim-label.station { left:50%; top:10%; transform:translateX(-50%); background:var(--ink-900); color:var(--paper); }
.sh-pim-label.issue { right:8%; top:25%; color:var(--danger-text); background:var(--danger-soft); border-color:oklch(0.86 0.09 25); }
.sh-pim-field-grid { flex:1; min-height:0; overflow:auto; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; padding:14px; align-content:start; }
.sh-pim-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
.sh-pim-field label { color:var(--ink-600); font-size:11px; font-weight:700; }
.sh-pim-field input { height:34px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); padding:0 10px; color:var(--ink-900); font-family:var(--font-sans); font-size:12px; outline:none; }
.sh-pim-review { margin:0 14px 14px; display:grid; gap:8px; }
.sh-pim-review-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 10px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); color:var(--ink-700); font-size:12px; font-weight:700; }
.sh-pim-digitize-panel { flex:1; min-height:0; display:grid; align-content:center; gap:14px; padding:18px; background:linear-gradient(180deg,var(--paper),var(--ink-50)); }
.sh-pim-digitize-preview { position:relative; min-height:260px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); overflow:hidden; box-shadow:var(--shadow-xs); }
.sh-pim-digitize-preview::before { content:""; position:absolute; inset:0; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:24px 24px; opacity:.8; }
.sh-pim-digital-track { position:absolute; z-index:2; left:10%; right:10%; height:4px; border-radius:var(--r-full); background:var(--ink-800); }
.sh-pim-digital-track.a { top:34%; }
.sh-pim-digital-track.b { top:50%; }
.sh-pim-digital-track.c { top:66%; left:18%; right:24%; background:var(--ink-600); }
.sh-pim-digital-platform { position:absolute; z-index:3; left:30%; right:25%; height:24px; display:grid; place-items:center; border:1px solid var(--accent); border-radius:7px; background:oklch(0.96 0.04 75); color:var(--ink-900); font-size:11px; font-weight:900; }
.sh-pim-digital-platform.one { top:39%; }
.sh-pim-digital-platform.two { top:55%; }
.sh-pim-digital-badge { position:absolute; z-index:4; top:14px; left:14px; min-height:24px; display:inline-flex; align-items:center; padding:0 9px; border-radius:var(--r-full); background:var(--ink-900); color:var(--paper); font-size:11px; font-weight:900; }
.sh-pim-digitize-copy { display:grid; gap:5px; }
.sh-pim-digitize-title { color:var(--ink-900); font-size:15px; font-weight:800; }
.sh-pim-digitize-sub { color:var(--ink-600); font-size:12.5px; line-height:1.45; }
.sh-pim-actions { flex-shrink:0; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; border-top:var(--hairline); background:var(--paper); }
.sh-pim-actions-main { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
.sh-review-digitize-empty { flex:1; min-height:390px; display:grid; place-items:center; padding:28px; color:var(--ink-500); text-align:center; background:var(--ink-50); }
.sh-review-digitize-empty-inner { display:grid; justify-items:center; gap:9px; max-width:320px; }
.sh-review-digitize-empty-icon { width:40px; height:40px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-400); display:grid; place-items:center; }
.sh-review-digitize-empty-title { color:var(--ink-900); font-size:14px; font-weight:800; }
.sh-review-digitize-empty-sub { color:var(--ink-500); font-size:12.5px; line-height:1.45; }
.sh-asset-editor-shell[data-digitize="true"] { grid-template-columns:1fr; }
.sh-asset-editor-shell[data-digitize="true"] .sh-asset-preview-panel { display:none; }
.sh-digitize-center { flex:1; display:grid; place-items:center; min-height:460px; background:var(--ink-50); }
.sh-digitize-center-inner { display:grid; justify-items:center; gap:16px; max-width:400px; text-align:center; }
.sh-digitize-center-icon { width:60px; height:60px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); color:var(--accent); display:grid; place-items:center; box-shadow:var(--shadow-xs); }
.sh-digitize-center-title { font-size:17px; font-weight:800; color:var(--ink-900); }
.sh-digitize-center-sub { font-size:13px; color:var(--ink-500); line-height:1.55; }
.sh-digitize-generated { flex:1; padding:0; display:flex; flex-direction:column; background:var(--ink-50); overflow:hidden; } .sh-digitize-generated--editor { padding:0; } .sh-digitize-editor-img { width:100%; height:100%; object-fit:cover; object-position:top left; display:block; }
.sh-sip-splash { position:fixed; inset:0; z-index:500; background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:28px; animation:sh-splash-fade-in 0.35s ease forwards; }
.sh-sip-splash[data-exit="true"] { animation:sh-splash-fade-out 0.45s ease forwards; }
.sh-sip-splash-logo { width:200px; height:auto; animation:sh-splash-logo-in 0.55s cubic-bezier(0.34,1.26,0.64,1) 0.15s both; }
.sh-sip-splash-texts { display:flex; flex-direction:column; align-items:center; gap:6px; animation:sh-splash-logo-in 0.45s ease 0.35s both; }
.sh-sip-splash-title { font-size:15px; font-weight:700; color:var(--ink-900); letter-spacing:0.01em; }
.sh-sip-splash-sub { font-size:12.5px; color:var(--ink-400); }
.sh-sip-splash-progress { width:260px; animation:sh-splash-logo-in 0.4s ease 0.45s both; }
.sh-sip-splash-track { width:100%; height:3px; border-radius:2px; background:var(--ink-100); overflow:hidden; }
.sh-sip-splash-bar { height:100%; width:0%; border-radius:2px; background:linear-gradient(90deg, #3737c8 0%, #6366f1 60%, #818cf8 100%); animation:sh-splash-bar-fill 2.6s cubic-bezier(0.4,0,0.2,1) 0.55s forwards; }
@keyframes sh-splash-fade-in { from { opacity:0 } to { opacity:1 } }
@keyframes sh-splash-fade-out { from { opacity:1 } to { opacity:0 } }
@keyframes sh-splash-logo-in { from { opacity:0; transform:scale(0.86) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
@keyframes sh-splash-bar-fill { 0% { width:0% } 60% { width:72% } 85% { width:91% } 100% { width:100% } }
.sh-digital-editor-full { position:fixed; inset:0; z-index:200; display:grid; grid-template-areas:"top top top top" "rail left canvas right" "bottom bottom bottom bottom"; grid-template-columns:40px 240px minmax(0,1fr) 240px; grid-template-rows:44px minmax(0,1fr) 44px; background:#c8c8c8; }
.sh-de-topbar { grid-area:top; display:flex; align-items:center; justify-content:space-between; padding:0 16px; background:var(--paper); border-bottom:var(--hairline); }
.sh-de-topbar-left { display:flex; align-items:center; gap:10px; }
.sh-de-topbar-title { font-size:14px; font-weight:700; color:var(--ink-900); }
.sh-de-topbar-right { display:flex; align-items:center; gap:8px; }
.sh-de-icon-rail { grid-area:rail; background:var(--ink-50); border-right:var(--hairline); display:flex; flex-direction:column; align-items:center; padding:8px 0; gap:2px; overflow-y:auto; }
.sh-de-rail-btn { width:32px; height:32px; border:none; background:transparent; color:var(--ink-500); display:grid; place-items:center; cursor:pointer; border-radius:var(--r-sm); }
.sh-de-rail-btn:hover { background:var(--ink-100); color:var(--ink-800); }
.sh-de-left-panel { grid-area:left; background:var(--paper); border-right:var(--hairline); overflow-y:auto; display:flex; flex-direction:column; }
.sh-de-canvas-tabs { display:flex; flex-direction:column; border-bottom:var(--hairline); }
.sh-de-canvas-tab { display:flex; align-items:center; gap:8px; padding:9px 12px; border:none; border-bottom:var(--hairline); background:transparent; font-size:12.5px; color:var(--ink-700); cursor:pointer; text-align:left; font-family:var(--font-sans); }
.sh-de-canvas-tab[data-active="true"] { background:var(--ink-50); font-weight:600; color:var(--ink-900); }
.sh-de-canvas-tab:hover { background:var(--ink-50); }
.sh-de-tab-pill { margin-left:auto; font-size:10px; font-weight:600; padding:2px 6px; background:var(--ink-100); border-radius:var(--r-full); color:var(--ink-600); }
.sh-de-layers-head { display:flex; align-items:center; padding:10px 12px 6px; gap:4px; }
.sh-de-layers-title { font-size:12px; font-weight:700; color:var(--ink-900); flex:1; }
.sh-de-layers-actions { display:flex; gap:2px; }
.sh-de-layers-btn { width:24px; height:24px; border:none; background:transparent; color:var(--ink-500); display:grid; place-items:center; cursor:pointer; border-radius:var(--r-sm); font-family:var(--font-sans); }
.sh-de-layers-btn:hover { background:var(--ink-100); color:var(--ink-800); }
.sh-de-layer-item { display:flex; align-items:center; gap:6px; padding:6px 12px; font-size:12px; color:var(--ink-700); cursor:pointer; }
.sh-de-layer-item[data-active="true"] { background:var(--ink-50); color:var(--ink-900); font-weight:500; }
.sh-de-layer-item:hover { background:var(--ink-50); }
.sh-de-layer-expand { color:var(--ink-400); background:none; border:none; display:grid; place-items:center; padding:0; cursor:pointer; }
.sh-de-layer-bar { width:3px; height:14px; background:var(--ink-300); border-radius:2px; flex-shrink:0; }
.sh-de-layer-bar[data-color="blue"] { background:var(--accent); }
.sh-de-layer-name { flex:1; }
.sh-de-layer-dot { color:var(--success-text); font-size:10px; margin-left:auto; }
.sh-de-canvas { grid-area:canvas; background:#c0c0c0; overflow:auto; display:block; padding:24px; }
.sh-de-canvas-img { width:auto; min-width:100%; height:auto; display:block; box-shadow:0 4px 24px rgba(0,0,0,.32); background:white; }
.sh-de-right-panel { grid-area:right; background:var(--paper); border-left:var(--hairline); overflow-y:auto; font-size:12px; }
.sh-de-prop-section { border-bottom:var(--hairline); }
.sh-de-prop-head { display:flex; align-items:center; gap:6px; padding:8px 12px; font-size:11.5px; font-weight:700; color:var(--ink-900); cursor:pointer; }
.sh-de-prop-head-right { margin-left:auto; color:var(--ink-400); }
.sh-de-prop-head-actions { margin-left:auto; display:flex; gap:6px; color:var(--ink-400); }
.sh-de-prop-row { display:flex; align-items:center; gap:8px; padding:4px 12px 5px; min-height:26px; }
.sh-de-prop-label { width:64px; flex-shrink:0; color:var(--ink-500); font-size:11px; }
.sh-de-prop-val { flex:1; color:var(--ink-800); font-size:11.5px; display:flex; align-items:center; gap:4px; }
.sh-de-prop-select { background:var(--ink-50); border:var(--hairline); border-radius:var(--r-sm); padding:3px 6px; cursor:pointer; font-size:11px; }
.sh-de-prop-mono { font-family:var(--font-mono); font-size:11px; }
.sh-de-status-icons { display:flex; gap:8px; color:var(--ink-400); }
.sh-de-icon-row { display:flex; gap:6px; color:var(--ink-400); }
.sh-de-bottombar { grid-area:bottom; background:var(--paper); border-top:var(--hairline); display:flex; align-items:center; justify-content:center; gap:2px; padding:0 16px; position:relative; }
.sh-de-tool-group { display:flex; gap:1px; }
.sh-de-tool-btn { width:30px; height:30px; border:none; background:transparent; color:var(--ink-600); display:grid; place-items:center; cursor:pointer; border-radius:var(--r-sm); }
.sh-de-tool-btn:hover { background:var(--ink-100); color:var(--ink-900); }
.sh-de-tool-divider { width:1px; height:20px; background:var(--ink-200); margin:0 8px; flex-shrink:0; }
.sh-de-shapes-subhead { display:flex; align-items:center; padding:7px 12px 4px; font-size:11px; font-weight:700; color:var(--ink-600); letter-spacing:.3px; }
.sh-de-shapes-subhead-actions { display:flex; align-items:center; gap:6px; margin-left:auto; color:var(--ink-400); }
.sh-de-shapes-subhead-actions .icon { cursor:pointer; }
.sh-de-fill-btn { flex:1; height:26px; border:var(--hairline); border-radius:var(--r-sm); background:transparent; font-size:11.5px; color:var(--ink-600); cursor:pointer; font-family:var(--font-sans); }
.sh-de-fill-btn:hover { background:var(--ink-50); }
.sh-de-stroke-row { flex:1; display:flex; align-items:center; gap:5px; }
.sh-de-stroke-line { width:26px; height:2px; background:var(--ink-800); border-radius:1px; flex-shrink:0; }
.sh-de-stroke-val { flex:1; font-size:11.5px; color:var(--ink-800); font-family:var(--font-mono,monospace); }
.sh-de-stroke-chevron { color:var(--ink-400); cursor:pointer; }
.sh-de-stroke-minus { width:20px; height:20px; border:var(--hairline); border-radius:var(--r-sm); background:transparent; display:grid; place-items:center; cursor:pointer; color:var(--ink-500); flex-shrink:0; }
.sh-de-prop-help { padding:10px 12px 14px; font-size:11px; color:var(--ink-400); line-height:1.55; text-align:center; }
.sh-de-prop-link { color:var(--accent-text); text-decoration:underline dotted; cursor:pointer; }
.sh-de-prop-custom-label { font-size:11.5px; color:var(--ink-700); font-weight:500; }
.sh-de-prop-row--between { justify-content:space-between; }
.sh-de-bottombar-left { position:absolute; left:16px; display:flex; align-items:center; gap:4px; }
.sh-de-bottombar-measure { font-size:11.5px; font-weight:600; color:var(--ink-700); font-family:var(--font-mono,monospace); margin:0 8px; }
.sh-de-layer-color { width:10px; height:10px; border-radius:2px; background:var(--accent); flex-shrink:0; }
.sh-single-doc-card[data-selected="true"],
.sh-station-status-card[data-selected="true"] { border-color:var(--accent); background:var(--accent-soft); box-shadow:0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent), var(--shadow-md); }
.sh-v3-seg button[data-active="true"],
.sh-v3-layout-actions .sh-layer-toggle[data-active="true"],
.sh-layer-toggle[data-active="true"],
.sh-asset-nav-btn[data-active="true"],
.sh-editor-layer-btn[data-active="true"],
.sh-sip-nav-btn[data-active="true"],
.sh-pim-step[data-active="true"] { background:var(--accent); border-color:var(--accent); color:var(--paper); box-shadow:0 7px 14px -10px rgba(99,91,255,.78); }
.sh-v3-layout-actions .sh-layer-toggle[data-active="true"] .icon,
.sh-layer-toggle[data-active="true"] .icon,
.sh-asset-nav-btn[data-active="true"] .icon,
.sh-editor-layer-btn[data-active="true"] .icon,
.sh-sip-nav-btn[data-active="true"] .icon { color:var(--paper); }
.sh-track-btn[data-active="true"],
.sh-upload-type[data-active="true"] { background:var(--accent-soft); border-color:var(--accent); color:var(--accent-text); box-shadow:0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent); }
.sh-upload-select-button,
.sh-doc-mark,
.sh-v2-doc-code,
.sh-v3-doc-code,
.sh-doc-lifecycle-mark,
.sh-upload-file-mark,
.sh-yard-station,
.sh-editor-station-chip,
.sh-pim-label.station,
.sh-pim-digital-badge { background:linear-gradient(180deg,var(--stripe-blue-800),var(--stripe-blue-900)); color:var(--paper); }
.sh-asset-highlight,
.sh-pim-highlight { border-color:var(--accent); background:color-mix(in srgb, var(--accent-soft) 72%, transparent); box-shadow:0 0 0 5px color-mix(in srgb, var(--accent-soft) 64%, transparent); }
.sh-plan-gradient { border-color:color-mix(in srgb, var(--accent) 38%, var(--ink-200)); background:linear-gradient(110deg,var(--accent-soft),rgba(255,255,255,.88)); }
.sh-plan-marker,
.sh-sip-element[data-kind="circuit"] { border-color:color-mix(in srgb, var(--info) 24%, var(--info-soft)); }
.sh-toast { position:fixed; right:24px; bottom:24px; z-index:10000; display:inline-flex; align-items:center; gap:9px; min-height:42px; padding:10px 14px; border:1px solid oklch(0.9 0.06 155); border-radius:var(--r-md); background:var(--success-soft); color:var(--success-text); box-shadow:var(--shadow-lg); font-size:13px; font-weight:800; }
@media (max-width: 1180px) { .sh-doc-health { grid-template-columns:repeat(2,minmax(0,1fr)); } .sh-v2-shell,.sh-v3-two-col,.sh-v3-role { grid-template-columns:1fr; } .sh-v3-role-side { border-right:none; border-bottom:var(--hairline); } .sh-v3-meta-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .sh-v3-doc-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .sh-doc-lifecycle-card { grid-template-columns:minmax(180px,1fr) repeat(2,minmax(130px,1fr)); } .sh-doc-lifecycle-actions { justify-content:flex-start; grid-column:1 / -1; } .sh-two-col,.sh-esp-validation-grid,.sh-asset-editor-shell,.sh-pim-workspace { grid-template-columns:1fr; } .sh-asset-preview-panel,.sh-pim-source { border-right:none; border-bottom:var(--hairline); } .sh-editor-main { grid-template-columns:200px minmax(0,1fr); grid-template-rows:minmax(0,1fr) auto; } .sh-sip-editor .sh-editor-main { grid-template-columns:minmax(0,1fr); grid-template-rows:minmax(0,1fr); } .sh-sip-editor[data-has-selection="true"] .sh-editor-main { grid-template-columns:minmax(0,1fr); grid-template-rows:minmax(0,1fr) auto; } .sh-editor-inspector { grid-column:1 / -1; max-height:330px; border-left:none; border-top:var(--hairline); } .sh-upload-types { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width: 760px) { .sh-record-head { flex-direction:column; align-items:flex-start; } .sh-record-actions { justify-content:flex-start; margin-left:0; } .sh-inline-actions { justify-content:flex-start; } .sh-doc-section-head,.sh-doc-workspace-head,.sh-v2-panel-head,.sh-v3-section-head,.sh-v3-meta-top,.sh-v3-table-tools { flex-direction:column; gap:10px; } .sh-doc-workspace-actions { justify-content:flex-start; } .sh-flow-summary-row,.sh-v2-action-row,.sh-v3-flow-row,.sh-v3-layer-row { flex-direction:column; align-items:flex-start; } .sh-flow-active { text-align:left; } .sh-doc-health,.sh-doc-meta,.sh-edit-body,.sh-upload-types,.sh-pim-field-grid,.sh-asset-grid,.sh-esp-metrics,.sh-asset-config-form,.sh-doc-lifecycle-card,.sh-v2-kv,.sh-v2-survey-list,.sh-v3-meta-grid,.sh-v3-doc-grid,.sh-v3-doc-kpis,.sh-v3-metric-grid { grid-template-columns:1fr; } .sh-v2-kv-item,.sh-v2-kv-item:nth-child(2n),.sh-v2-kv-item:nth-last-child(-n+2),.sh-v2-survey-item,.sh-v3-meta-item,.sh-v3-meta-item:nth-child(4n),.sh-v3-meta-item:nth-last-child(-n+4) { border-right:none; border-bottom:var(--hairline); } .sh-v2-kv-item:last-child,.sh-v2-survey-item:last-child,.sh-v3-meta-item:last-child { border-bottom:none; } .sh-v3-search { min-width:0; width:100%; } .sh-v3-schematic { min-height:300px; } .sh-track-switcher { align-items:flex-start; flex-direction:column; } .sh-asset-config-field[data-span="full"],.sh-asset-live-preview,.sh-doc-lifecycle-actions { grid-column:auto; } .sh-station-identity { flex-direction:column; } .sh-editor-toolbar { align-items:flex-start; flex-direction:column; } .sh-editor-actions { justify-content:flex-start; } .sh-editor-main { grid-template-columns:1fr; grid-template-rows:auto minmax(0,1fr) auto; } .sh-sip-editor .sh-editor-main { grid-template-columns:1fr; grid-template-rows:minmax(0,1fr); } .sh-sip-editor[data-has-selection="true"] .sh-editor-main { grid-template-rows:minmax(0,1fr) auto; } .sh-editor-asset-rail { max-height:150px; border-right:none; border-bottom:var(--hairline); } .sh-editor-layer-list { grid-template-columns:repeat(2,minmax(0,1fr)); } .sh-editor-canvas { width:900px; height:560px; } .sh-sip-canvas { width:980px; height:620px; } .sh-editor-statusbar { align-items:flex-start; flex-direction:column; } }
`;
  const stationHubStyleEl = document.createElement("style");
  stationHubStyleEl.textContent = shCSS;
  document.head.appendChild(stationHubStyleEl);
  const statusTone = (value) => {
    const text = String(value || "").toLowerCase();
    if (text.includes("approved") || text.includes("validated") || text.includes("completed") || text.includes("uploaded") || text.includes("processed") || text.includes("passed") || text.includes("up to date")) return "success";
    if (text.includes("pending") || text.includes("waiting") || text.includes("current") || text.includes("review") || text.includes("draft")) return "warning";
    if (text.includes("not started")) return "neutral";
    if (text.includes("blocked") || text.includes("not generated") || text.includes("locked")) return "danger";
    if (text.includes("editable") || text.includes("working") || text.includes("linked") || text.includes("submitted") || text.includes("ready")) return "info";
    return "neutral";
  };
  const StatusChip = ({ children }) => {
    const isApproved = String(children || "").toLowerCase().includes("approved");
    return /* @__PURE__ */ React.createElement(Chip, { tone: statusTone(children), variant: "solid" }, isApproved && /* @__PURE__ */ React.createElement(Icon, { name: "lock", size: 11 }), children);
  };
  const openStub = (label) => {
    console.log(`Station Hub action: ${label}`);
  };
  const V3_DOCUMENTS = [
    { id: "esp", type: "ESP", name: "Engineering Scale Plan", version: "V7", status: "Approved / Frozen", approval: "Frozen", assets: "184", sod: "Validated", zoneRules: "Validated", lastUpdated: "24 Dec 2025", dateKey: "2025-12-24", pendingWith: "None", openIssues: "0", action: "Open ESP", icon: "file_check" },
    { id: "sip", type: "SIP", name: "Signal Interlocking Plan", version: "V1", status: "Approver Pending Review", approval: "Pending Review", assets: "127", sod: "Not Required", zoneRules: "Not Required", lastUpdated: "21 Dec 2025", dateKey: "2025-12-21", pendingWith: "S&T Approver", openIssues: "0", action: "Open SIP", icon: "branch" },
    { id: "lop", type: "LOP", name: "OHE Layout Plan", version: "Not Generated", status: "Not Generated", approval: "Not Started", assets: "0", sod: "Not Required", zoneRules: "Not Required", lastUpdated: "-", dateKey: "", pendingWith: "ESP/SIP Dependency", openIssues: "0", action: "Open LOP", icon: "layers" },
    { id: "toc", type: "TOC", name: "Table of Controls", version: "Not Generated", status: "Locked", approval: "Locked", assets: "0", sod: "Not Required", zoneRules: "Not Required", lastUpdated: "-", dateKey: "", pendingWith: "SIP Approval", openIssues: "0", action: "Generate TOC", icon: "lock", disabled: true },
    { id: "survey", type: "SUR", name: "Survey Data Package", version: "V2026.05", status: "Processed", approval: "Linked", assets: "ESP, SIP, LOP", linkedLabel: "Linked Documents", sod: "91% Confidence", zoneRules: "Geo-referenced", lastUpdated: "12 May 2026", dateKey: "2026-05-12", pendingWith: "None", openIssues: "0", action: "View Survey Data", icon: "track" },
    { id: "discrepancy", type: "DR", name: "Discrepancy Report", version: "DR-AWB-V4", status: "12 Open Issues", approval: "Engineering Review", assets: "2 Critical / 8 Rectifiable / 2 Non-Rectifiable", linkedLabel: "Issue Summary", sod: "2 Safety Critical", zoneRules: "8 Rectifiable", lastUpdated: "22 Dec 2025", dateKey: "2025-12-22", pendingWith: "Engineering", openIssues: "12", action: "View Discrepancies", icon: "alert" }
  ];
  const V3_TABLE_DOCUMENTS = V3_DOCUMENTS.filter((doc) => ["esp", "sip", "lop"].includes(doc.id)).map((doc) => ({
    ...doc,
    status: doc.id === "esp" ? "Approved" : doc.id === "sip" ? "Verified" : "Not Generated",
    groundReality: doc.id === "esp" ? "Validated" : "Pending",
    relatedDocument: doc.id === "esp" ? "LiDAR + Total Station" : doc.id === "sip" ? "ESP V7" : "ESP V7 + SIP V1",
    surveyFile: "LiDAR V7",
    lastActivityTime: doc.id === "esp" ? "24 Dec 2025, 17:30" : doc.id === "sip" ? "21 Dec 2025, 16:10" : "12 May 2026, 10:42",
    lastActivityUser: doc.id === "esp" ? "Sarath" : doc.id === "sip" ? "S&T Approver" : "Survey Team",
    disabled: doc.id === "lop",
    surveyLinkedDocs: doc.id === "lop" ? ["ESP", "SIP", "LOP"] : doc.id === "sip" ? ["ESP", "SIP"] : ["ESP", "LOP"]
  }));
  const v3ToneFor = (value) => {
    const text = String(value || "").toLowerCase();
    if (text.includes("not required")) return "dark";
    if (text.includes("approved") || text.includes("frozen") || text.includes("validated") || text.includes("processed") || text.includes("completed") || text.includes("available") || (text.includes("generated") && !text.includes("not generated"))) return "success";
    if (text.includes("pending") || text.includes("review") || text.includes("current") || text.includes("draft") || text.includes("partial") || text.includes("medium")) return "warning";
    if (text.includes("critical") || text.includes("rejected") || text.includes("rework") || text.includes("high") || text.includes("12 open")) return "danger";
    if (text.includes("locked") || text.includes("not generated") || text.includes("not started") || text.includes("low")) return "neutral";
    if (text.includes("linked") || text.includes("geo") || text.includes("confidence")) return "info";
    return "neutral";
  };
  const V3Badge = ({ children, tone }) => /* @__PURE__ */ React.createElement("span", { className: "sh-v3-badge", "data-tone": tone || v3ToneFor(children) }, children);
  const EditStationMetadataV3Modal = ({ station, onClose, onSave }) => {
    const [draft, setDraft] = useStateHub({
      ...station,
      currentBaseline: station.currentBaseline || "ESP-AWB-V7",
      stationType: station.stationType || "Existing Yard"
    });
    const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
    const locked = [
      ["zone", "Zone"],
      ["division", "Division"],
      ["section", "Section"]
    ];
    const editable = [
      ["name", "Station Name"],
      ["code", "Station Code"],
      ["adjacentUp", "UP Side"],
      ["adjacentDn", "DN Side"]
    ];
    const submit = (event) => {
      event.preventDefault();
      onSave({ ...draft, code: draft.code.trim().toUpperCase(), lastUpdated: "Just now" });
    };
    return ReactDOM.createPortal(/* @__PURE__ */ React.createElement("div", { className: "sh-edit-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement("form", { className: "sh-edit-modal", onClick: (event) => event.stopPropagation(), onSubmit: submit }, /* @__PURE__ */ React.createElement("div", { className: "sh-edit-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-edit-title" }, "Edit Station Details"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "Master-list fields are locked for station governance.")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "sh-edit-close", onClick: onClose }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 15 }))), /* @__PURE__ */ React.createElement("div", { className: "sh-edit-body" }, locked.map(([key, label]) => /* @__PURE__ */ React.createElement("div", { className: "sh-edit-field", key }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value: draft[key] || "", disabled: true }), /* @__PURE__ */ React.createElement("div", { className: "sh-v3-readonly-note" }, "Read-only from Master Station List"))), editable.map(([key, label]) => /* @__PURE__ */ React.createElement("div", { className: "sh-edit-field", key }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value: draft[key] || "", onChange: (event) => update(key, event.target.value) })))), /* @__PURE__ */ React.createElement("div", { className: "sh-edit-actions" }, /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { type: "submit", variant: "accent" }, "Save Details")))), document.body);
  };
  const STATION_DOCUMENT_STATUS = [
    {
      id: "survey",
      title: "Survey Data",
      fullName: "Common Survey Inputs",
      status: "Completed",
      filesLabel: "4"
    },
    {
      id: "esp",
      title: "ESP",
      fullName: "Engineering Scale Plan",
      status: "Not Started",
      filesLabel: "0"
    },
    {
      id: "sip",
      title: "SIP",
      fullName: "Signal Interlocking Plan",
      status: "Not Started",
      filesLabel: "0"
    },
    {
      id: "lop",
      title: "LOP",
      fullName: "OHE Layout Plan",
      status: "Not Started",
      filesLabel: "0"
    }
  ];
  const DOC_TAB_META = [
    { id: "esp", label: "ESP", count: 0 },
    { id: "sip", label: "SIP", count: 0 },
    { id: "lop", label: "LOP", count: 0 },
    { id: "survey", label: "Survey Data", count: 4 }
  ];
  const DOCUMENT_TABLE_ROWS = {
    esp: [],
    sip: [],
    lop: [],
    survey: [
      { fileName: "AWB-LiDAR-PointCloud-v2026.05.las", status: "Approved", tone: "success", user: "A. Survey", initials: "AS", role: "Survey", uploaded: "May 12, 2026" },
      { fileName: "AWB-Orthomosaic-v2026.05.tif", status: "Verified", tone: "purple", user: "A. Survey", initials: "AS", role: "Survey", uploaded: "May 12, 2026" },
      { fileName: "AWB-TotalStation-v2026.05.csv", status: "Under Review", tone: "warning", user: "T. Team", initials: "TT", role: "Survey", uploaded: "May 11, 2026" },
      { fileName: "AWB-GeoReference-Report.pdf", status: "Verified", tone: "purple", user: "A. Survey", initials: "AS", role: "Survey", uploaded: "May 12, 2026" }
    ]
  };
  const avatarColor = (initials) => {
    const colors = {
      KN: "oklch(0.58 0.13 150)",
      RP: "oklch(0.64 0.17 290)",
      VR: "oklch(0.64 0.16 35)",
      SK: "oklch(0.58 0.08 245)",
      MK: "oklch(0.62 0.16 38)",
      AS: "oklch(0.55 0.12 180)",
      TT: "oklch(0.58 0.12 80)"
    };
    return colors[initials] || "var(--ink-500)";
  };
  const StationDocumentStatus = ({ active, onChange, rowsByType }) => /* @__PURE__ */ React.createElement("section", { className: "sh-station-status", "aria-label": "Station document status" }, /* @__PURE__ */ React.createElement("div", { className: "sh-station-status-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-station-status-title" }, /* @__PURE__ */ React.createElement(Icon, { name: "layers", size: 16, style: { color: "var(--accent)" } }), "Station Documents"))), /* @__PURE__ */ React.createElement("div", { className: "sh-station-status-grid" }, STATION_DOCUMENT_STATUS.map((item, index) => {
    const fileCount = ((rowsByType == null ? void 0 : rowsByType[item.id]) || DOCUMENT_TABLE_ROWS[item.id] || []).length || Number(item.filesLabel);
    const espRowList = (rowsByType == null ? void 0 : rowsByType.esp) || [];
    const sipRowList = (rowsByType == null ? void 0 : rowsByType.sip) || [];
    const displayStatus = item.id === "esp" && espRowList.length > 0 ? (espRowList[0].status || item.status) : item.id === "sip" && sipRowList.length > 0 ? (sipRowList[0].status || item.status) : item.status;
    const cardEl = /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "sh-station-status-card",
        "data-status": displayStatus,
        "data-selected": active === item.id ? "true" : "false",
        type: "button",
        key: item.id,
        onClick: () => onChange(item.id)
      },
      /* @__PURE__  */ React.createElement("span", { className: "sh-station-card-stripe" }),
      /* @__PURE__ */ React.createElement("div", { className: "sh-station-card-body" }, /* @__PURE__ */ React.createElement("div", { className: "sh-station-card-top" }, /* @__PURE__ */ React.createElement("span", { className: "sh-station-card-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: { survey: "layers", esp: "file_check", sip: "branch", lop: "book" }[item.id] || "file_check", size: 15 })), /* @__PURE__ */ React.createElement("span", { className: "sh-station-doc-code" }, item.title), active === item.id && /* @__PURE__ */ React.createElement("span", { className: "sh-station-selected-badge" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 10 }))), /* @__PURE__ */ React.createElement("div", { className: "sh-station-status-name", title: item.fullName }, item.fullName), /* @__PURE__ */ React.createElement("div", { className: "sh-station-card-bottom" }, /* @__PURE__ */ React.createElement("span", { className: "sh-station-status-badge", "data-status": displayStatus }, displayStatus), /* @__PURE__ */ React.createElement("span", { className: "sh-station-card-count" }, /* @__PURE__ */ React.createElement(Icon, { name: "file_check", size: 12 }), fileCount, "\xA0files")))
    );
    if (index < STATION_DOCUMENT_STATUS.length - 1) {
      return /* @__PURE__ */ React.createElement(React.Fragment, { key: item.id }, cardEl, /* @__PURE__ */ React.createElement("span", { className: "sh-station-card-flow", "aria-hidden": "true" }));
    }
    return cardEl;
  })));
  const DocumentTabsSection = ({ active, onChange, rowsByType, onUpload, onOpenRow }) => {
    const [currentPage, setCurrentPage] = useStateHub(1);
    const [openMenu, setOpenMenu] = useStateHub("");
    const [clonedRows, setClonedRows] = useStateHub({});
    const [menuAnchor, setMenuAnchor] = useStateHub(null);
    const pageSize = 5;
    const baseRows = (rowsByType == null ? void 0 : rowsByType[active]) || DOCUMENT_TABLE_ROWS[active] || [];
    const rows = [...baseRows, ...(clonedRows[active] || [])];
    const cloneDocRow = (row) => {
      const existing = clonedRows[active] || [];
      const nextVersionNum = existing.length + 2;
      const cloned = { ...row, id: `clone-${Date.now()}`, version: `${nextVersionNum}.0`, status: "Under Review", tone: "warning", user: CURRENT_USER.name, initials: "AV", role: CURRENT_USER.role, uploaded: "Just now", approvalStatus: "Pending" };
      setClonedRows((prev) => ({ ...prev, [active]: [...(prev[active] || []), cloned] }));
      setOpenMenu("");
      setMenuAnchor(null);
    };
    const tabItems = DOC_TAB_META.map((tab) => ({ ...tab, count: ((rowsByType == null ? void 0 : rowsByType[tab.id]) || DOCUMENT_TABLE_ROWS[tab.id] || []).length }));
    const activeMeta = tabItems.find((tab) => tab.id === active) || tabItems[0];
    const activeDocType = activeMeta.label;
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = rows.length ? (safeCurrentPage - 1) * pageSize : 0;
    const pageEnd = Math.min(pageStart + pageSize, rows.length);
    const pagedRows = rows.slice(pageStart, pageEnd);
    const pageNumbers = totalPages <= 5 ? Array.from({ length: totalPages }, (_, index) => index + 1) : Array.from(/* @__PURE__ */ new Set([1, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, totalPages])).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
    const switchTab = (tabId) => {
      onChange(tabId);
      setCurrentPage(1);
      setOpenMenu("");
      setMenuAnchor(null);
    };
    const uploadLabel = active === "survey" ? "Upload Survey Data" : `Upload ${activeMeta.label}`;
    const activeDocStatus = STATION_DOCUMENT_STATUS.find((item) => item.id === active) || { title: activeMeta.label, fullName: "" };
    const activeTitle = active === "survey" ? "Survey Data" : `${activeDocStatus.title} Documents`;
    const activeIcon = { survey: "layers", esp: "file_check", sip: "branch", lop: "book" }[active] || "file_check";
    return /* @__PURE__ */ React.createElement("section", { className: "sh-workspace-panel" }, /* @__PURE__ */ React.createElement(StationDocumentStatus, { active, onChange: switchTab, rowsByType }), /* @__PURE__ */ React.createElement("div", { className: "sh-doc-table-toolbar" }, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-table-controls" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } }, /* @__PURE__ */ React.createElement("h3", { className: "sh-doc-files-title", style: { display: "flex", alignItems: "center", gap: "8px", margin: 0 } }, /* @__PURE__ */ React.createElement(Icon, { name: activeIcon, size: 16, style: { color: "var(--accent)" } }), activeTitle), activeDocStatus.fullName && /* @__PURE__ */ React.createElement("span", { className: "sh-doc-files-sub", style: { margin: 0 } }, activeDocStatus.fullName))), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "upload", onClick: () => onUpload(activeMeta.label) }, uploadLabel)), /* @__PURE__ */ React.createElement("div", { className: "sh-doc-table-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "sh-doc-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, active === "esp" ? "ESP" : active === "sip" ? "SIP" : "File Name")), (active === "esp" || active === "sip") && /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Version")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "File Type")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Digitize Status")), active === "sip" && /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Generated from")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Uploaded By")), (active === "esp" || active === "sip") && /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Approval Status")), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, pagedRows.map((row, index) => {
      const menuKey = `${active}-${pageStart + index}-${row.fileName}`;
      const fileType = row.fileType || ((row.fileName.split(".").pop() || "").toUpperCase()) || activeDocType;
      const rawExt = row.fileName.includes(".") ? row.fileName.split(".").pop().toUpperCase() : "";
      const badgeLabel = rawExt && rawExt.length <= 5 ? rawExt : (row.fileType && row.fileType.length <= 5 ? row.fileType.toUpperCase() : "");
      return /* @__PURE__ */ React.createElement("tr", { key: menuKey, onClick: () => onOpenRow(active, row), style: { cursor: (active === "esp" || active === "sip") ? "pointer" : "default" } }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-name-cell" }, badgeLabel && /* @__PURE__ */ React.createElement("span", { className: "sh-doc-ft-badge", "data-ft": badgeLabel }, badgeLabel), /* @__PURE__ */ React.createElement("span", { className: "sh-doc-file-name" }, row.fileName))), (active === "esp" || active === "sip") && /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "sh-doc-version" }, row.version || "—")), /* @__PURE__ */ React.createElement("td", null, fileType), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "sh-doc-status", "data-tone": row.tone }, row.tone === "success" && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13 }), row.status)), active === "sip" && /* @__PURE__ */ React.createElement("td", null, row.generatedFrom ? /* @__PURE__ */ React.createElement("span", { className: "sh-doc-version" }, row.generatedFrom) : /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-400)" } }, "—")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-user-cell" }, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-avatar", style: { background: avatarColor(row.initials) } }, row.initials), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-user-name" }, row.user), /* @__PURE__ */ React.createElement("div", { className: "sh-doc-user-role" }, row.uploaded)))), (active === "esp" || active === "sip") && /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "sh-doc-status", "data-tone": row.approvalStatus === "Approved" ? "success" : "warning" }, row.approvalStatus || "Pending")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-actions" }, /* @__PURE__ */ React.createElement("button", { className: "sh-doc-action-btn", type: "button", onClick: (event) => {
        event.stopPropagation();
        onOpenRow(active, row);
      } }, /* @__PURE__ */ React.createElement(Icon, { name: "eye", size: 13 }), "View"), /* @__PURE__ */ React.createElement("div", { className: "sh-doc-menu-wrap" }, /* @__PURE__ */ React.createElement("button", { className: "sh-doc-action-icon", type: "button", "aria-label": `More actions for ${row.fileName}`, onClick: (event) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuAnchor({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
        setOpenMenu((current) => current === menuKey ? "" : menuKey);
      } }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 14 })), openMenu === menuKey && menuAnchor && /* @__PURE__ */ React.createElement("div", { className: "sh-doc-row-menu", style: { position: "fixed", top: menuAnchor.top, right: menuAnchor.right, zIndex: 9999 }, onClick: (event) => event.stopPropagation() }, ["Download", "Clone", "View History", "Replace File"].map((action) => /* @__PURE__ */ React.createElement("button", { type: "button", key: action, onClick: () => {
        if (action === "Clone") { cloneDocRow(row); } else { openStub(`${action} ${row.fileName}`); setOpenMenu(""); setMenuAnchor(null); }
      } }, /* @__PURE__ */ React.createElement(Icon, { name: action === "Download" ? "download" : action === "Clone" ? "copy" : action === "Replace File" ? "upload" : "clock", size: 13 }), action)))))));
    }), !rows.length && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: active === "esp" ? 7 : active === "sip" ? 8 : 5 }, /* @__PURE__ */ React.createElement("div", { className: "sh-single-empty" }, "No documents available for ", activeMeta.label, ".")))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-foot sh-doc-pagination" }, /* @__PURE__ */ React.createElement("div", { className: "sh-archive-foot-left" }, /* @__PURE__ */ React.createElement("span", null, "Showing ", rows.length ? pageStart + 1 : 0, "-", pageEnd, " of ", rows.length, " documents")), /* @__PURE__ */ React.createElement("div", { className: "ds-table-pager" }, /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === 1, onClick: () => setCurrentPage((page) => Math.max(1, page - 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 14 })), pageNumbers.map((page, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: page }, index > 0 && page - pageNumbers[index - 1] > 1 && /* @__PURE__ */ React.createElement("span", { className: "sh-page-ellipsis" }, "..."), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", "data-current": page === safeCurrentPage ? "true" : void 0, onClick: () => setCurrentPage(page) }, page))), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === totalPages, onClick: () => setCurrentPage((page) => Math.min(totalPages, page + 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 14 }))))));
  };
  const ESPWorkflowPage = ({ station, upload, digitalVersions, onBack, onReviewAssets, onOpenVersion, onClone }) => {
    const [cloneSourceRow, setCloneSourceRow] = useStateHub(null);
    const [cloneVerNum, setCloneVerNum] = useStateHub("V0");
    const [cloneRevNum, setCloneRevNum] = useStateHub("R0");
    const [cloneAltNum, setCloneAltNum] = useStateHub("A0");
    const cloneVersionId = cloneVerNum + "-" + cloneRevNum + "-" + cloneAltNum;
    const vOptsC = (p, n) => Array.from({ length: n }, (_, i) => p + i);
    const confirmClone = () => { if (cloneSourceRow && onClone) { onClone({ ...cloneSourceRow, cloneVersion: cloneVersionId }); setCloneSourceRow(null); } };
    const [openMenu, setOpenMenu] = useStateHub("");
    const [menuAnchor, setMenuAnchor] = useStateHub(null);
    const [currentPage, setCurrentPage] = useStateHub(1);
    const pageSize = 5;
    const currentUpload = upload || {
      fileName: "AWB-ESP-MainYard-v7.dwg",
      status: "Approved",
      uploaded: "1 day ago",
      user: "Sarath"
    };
    const totalPages = Math.max(1, Math.ceil(digitalVersions.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = digitalVersions.length ? (safeCurrentPage - 1) * pageSize : 0;
    const pageEnd = Math.min(pageStart + pageSize, digitalVersions.length);
    const pagedVersions = digitalVersions.slice(pageStart, pageEnd);
    const pageNumbers = totalPages <= 5 ? Array.from({ length: totalPages }, (_, index) => index + 1) : Array.from(/* @__PURE__ */ new Set([1, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, totalPages])).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
    const pimButtonLabel = "Review Extracted Assets";
    const mainContent = /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: ["Digital Library", { label: station.name, onClick: onBack }, "ESP"],
        searchPlaceholder: "Search ESP metadata, extracted assets, versions..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-icon-badge" }, /* @__PURE__ */ React.createElement(Icon, { name: "file_check", size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, currentUpload.fileName, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, "ESP")), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, station.name, " \xB7 Engineering Scale Plan file and digital ESP versions")), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "download", onClick: () => openStub("Download all ESP files") }, "Download All"), !digitalVersions.length && /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: onReviewAssets }, pimButtonLabel))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll" }, /* @__PURE__ */ React.createElement("section", { className: "sh-hub-section" }, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-title" }, "ESP Metadata"), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-sub" }, "Uploaded ESP file and extraction readiness for Aurangabad station."))), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-chips-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sh-detail-chips" }, /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Station"), `${station.name} (${station.code})`), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Zone"), station.zone || "—"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Division"), station.division || "—"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Section"), station.section || "—"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Source File"), currentUpload.fileName, /* @__PURE__ */ React.createElement("button", { className: "sh-meta-icon-btn", type: "button", title: "Download", onClick: () => openStub(`Download ${currentUpload.fileName}`) }, /* @__PURE__ */ React.createElement(Icon, { name: "download", size: 12 })), /* @__PURE__ */ React.createElement("button", { className: "sh-meta-icon-btn", type: "button", title: "View", onClick: () => openStub(`View ${currentUpload.fileName}`) }, /* @__PURE__ */ React.createElement(Icon, { name: "eye", size: 12 }))), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Uploaded By"), currentUpload.user || CURRENT_USER.name)))), /* @__PURE__ */ React.createElement("section", { className: "sh-hub-section" }, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-title" }, "Digital ESP Versions"), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-sub" }, "Generated digital ESP versions created from reviewed PIM assets."))), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "sh-hub-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Digital Version")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Created From")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Digitize Status")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "SOD Validation")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Approval Status")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Last Activity")), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, pagedVersions.map((row) => /* @__PURE__ */ React.createElement("tr", { key: row.id }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, row.version)), /* @__PURE__ */ React.createElement("td", null, row.createdFrom || "—"), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(V3Badge, null, row.digitizeStatus || "Generated")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(V3Badge, null, row.sodValidation || "Pending")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(V3Badge, null, row.approvalStatus || "Pending")), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-user-name" }, row.lastActivityBy || row.updatedBy), /* @__PURE__ */ React.createElement("div", { className: "sh-doc-user-role" }, row.lastActivityAt || row.updated)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-doc-actions" }, /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "eye", primary: true, onClick: () => onOpenVersion(row) }, "Open"), /* @__PURE__ */ React.createElement("div", { className: "sh-doc-menu-wrap" }, /* @__PURE__ */ React.createElement("button", { className: "sh-doc-action-icon", type: "button", "aria-label": `More actions for ${row.version}`, onClick: (event) => { const rect = event.currentTarget.getBoundingClientRect(); setMenuAnchor({ top: rect.bottom + 4, right: window.innerWidth - rect.right }); setOpenMenu((current) => current === row.id ? "" : row.id); } }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 14 })), openMenu === row.id && menuAnchor && /* @__PURE__ */ React.createElement("div", { className: "sh-doc-row-menu", style: { position: "fixed", top: menuAnchor.top, right: menuAnchor.right, zIndex: 9999 } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
      setCloneSourceRow(row); setCloneVerNum("V0"); setCloneRevNum("R0"); setCloneAltNum("A0");
      setOpenMenu("");
      setMenuAnchor(null);
    } }, /* @__PURE__ */ React.createElement(Icon, { name: "copy", size: 13 }), "Clone"))))))), !digitalVersions.length && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 7 }, /* @__PURE__ */ React.createElement("div", { className: "sh-single-empty" }, "No digital ESP generated yet. Review extracted assets and generate the first version.")))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-foot sh-doc-pagination" }, /* @__PURE__ */ React.createElement("div", { className: "sh-archive-foot-left" }, /* @__PURE__ */ React.createElement("span", null, "Showing ", digitalVersions.length ? pageStart + 1 : 0, "-", pageEnd, " of ", digitalVersions.length, " digital ESP versions")), /* @__PURE__ */ React.createElement("div", { className: "ds-table-pager" }, /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === 1, onClick: () => setCurrentPage((page) => Math.max(1, page - 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 14 })), pageNumbers.map((page, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: page }, index > 0 && page - pageNumbers[index - 1] > 1 && /* @__PURE__ */ React.createElement("span", { className: "sh-page-ellipsis" }, "..."), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", "data-current": page === safeCurrentPage ? "true" : void 0, onClick: () => setCurrentPage(page) }, page))), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === totalPages, onClick: () => setCurrentPage((page) => Math.min(totalPages, page + 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 14 })))))));
    return /* @__PURE__ */ React.createElement(React.Fragment, null, mainContent, cloneSourceRow && ReactDOM.createPortal(/* @__PURE__ */ React.createElement("div", { className: "sh-upload-portal", onClick: () => setCloneSourceRow(null) }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell", style: { maxWidth: 480 }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "copy", size: 18 })), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-text" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-title" }, "Clone Digital ESP Version"), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-sub" }, "Choose version ID for the cloned copy")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "sh-upload-shell-close", onClick: () => setCloneSourceRow(null), "aria-label": "Close" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 15 }))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-body" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-summary-bar" }, /* @__PURE__ */ React.createElement("span", null, "Cloning from ", /* @__PURE__ */ React.createElement("strong", null, cloneSourceRow.version || "\u2014"))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-group" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-group-label" }, "Version"), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-version-grid" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Version"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: cloneVerNum, onChange: (e) => setCloneVerNum(e.target.value) }, vOptsC("V", 10).map((v) => /* @__PURE__ */ React.createElement("option", { key: v, value: v }, v)))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Revision"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: cloneRevNum, onChange: (e) => setCloneRevNum(e.target.value) }, vOptsC("R", 10).map((v) => /* @__PURE__ */ React.createElement("option", { key: v, value: v }, v)))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Alteration"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: cloneAltNum, onChange: (e) => setCloneAltNum(e.target.value) }, vOptsC("A", 10).map((v) => /* @__PURE__ */ React.createElement("option", { key: v, value: v }, v))))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-version-preview" }, /* @__PURE__ */ React.createElement("span", { className: "sh-upload-version-preview-label" }, "New Version ID"), /* @__PURE__ */ React.createElement("span", { className: "sh-upload-version-id" }, cloneVersionId)))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-foot" }, /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", onClick: () => setCloneSourceRow(null) }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "accent", leadingIcon: "copy", onClick: confirmClone }, "Clone")))), document.body));
  };
  const DigitalESPDetailPage = ({ station, version, onBack, onOpenEditor, onOpenAsset }) => /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
    AppTopBar,
    {
      crumbs: ["Digital Library", { label: station.name, onClick: onBack }, version.fileName],
      searchPlaceholder: "Search digital ESP metadata and assets..."
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, version.fileName, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, "Digital ESP")), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, version.version, " \xB7 ", station.name)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "edit", onClick: onOpenEditor }, "Open ESP in Editor"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "download", onClick: () => openStub(`Download ${version.version}`) }, "Download"))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll" }, /* @__PURE__ */ React.createElement("section", { className: "sh-hub-section" }, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-title" }, "Digital ESP Metadata"), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-sub" }, "Metadata from the selected digital ESP version row.")), /* @__PURE__ */ React.createElement(V3Badge, null, version.digitizeStatus || "Generated")), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-chips-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sh-detail-chips" }, /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Version"), version.version), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "ESP"), version.fileName), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "File Type"), version.fileType || "DWG"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Digitize Status"), version.digitizeStatus || "Generated"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "SOD Validation"), "Pending"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Uploaded By"), `${version.uploadedBy || version.updatedBy} \xB7 ${version.uploadedAt || version.updated}`), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Last Activity"), `${version.lastActivityBy || version.updatedBy} \xB7 ${version.lastActivityAt || version.updated}`)))), /* @__PURE__ */ React.createElement("section", { className: "sh-hub-section" }, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-title" }, "Assets"), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-section-sub" }, "Extracted digital ESP asset groups and counts.")), /* @__PURE__ */ React.createElement(StatusChip, null, "184 assets")), /* @__PURE__ */ React.createElement("div", { className: "sh-hub-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "sh-hub-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Asset")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Count")), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, ESP_ASSETS.map((asset) => /* @__PURE__ */ React.createElement("tr", { key: asset.type, onClick: () => onOpenAsset(asset), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-asset-name" }, /* @__PURE__ */ React.createElement("span", { className: "sh-esp-asset-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: asset.icon, size: 14 })), /* @__PURE__ */ React.createElement("span", null, asset.type))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, asset.count)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "eye", primary: true, onClick: (event) => {
    event.stopPropagation();
    onOpenAsset(asset);
  } }, "Open"))))))))));
  const ESPRowAction = ({ children, icon, primary, disabled, onClick }) => /* @__PURE__ */ React.createElement("button", { className: "sh-esp-row-action", "data-primary": primary ? "true" : "false", type: "button", disabled, onClick: onClick || (() => openStub(children)) }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 13 }), children);
  const SortableHeader = ({ children }) => /* @__PURE__ */ React.createElement("span", { className: "sh-sortable-th" }, children, /* @__PURE__ */ React.createElement(Icon, { name: "sort", size: 13 }));
  const ESPValidationCard = ({ item }) => {
    const metrics = [
      ["Processed", item.processed],
      ["Passed", item.passed],
      ["Failed", item.failed]
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "sh-esp-validation-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-validation-title" }, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-validation-name" }, /* @__PURE__ */ React.createElement("span", { className: "sh-esp-validation-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 16 })), /* @__PURE__ */ React.createElement("span", null, item.title)), /* @__PURE__ */ React.createElement(StatusChip, null, item.status)), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-metrics" }, metrics.map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "sh-esp-metric", key: label }, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-metric-value" }, value), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-metric-label" }, label)))), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "Last run: ", item.lastRun), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-action-row" }, item.actions.map((action) => /* @__PURE__ */ React.createElement(ESPRowAction, { key: action, icon: action.includes("Download") ? "download" : action.includes("Re-run") ? "refresh" : "eye" }, action))));
  };
  const ESPAssetPreview = ({ asset, instanceNumber }) => {
    const unitLabel = assetUnitLabel(asset.type);
    return /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-panel" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, unitLabel, " ", instanceNumber, " Preview"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "ESP plan view for AWB yard with the selected asset group highlighted.")), /* @__PURE__ */ React.createElement(StatusChip, null, asset.count, " assets")), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-label" }, unitLabel, " ", instanceNumber), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-track loop" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-track main" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-track siding" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-turnout a" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-turnout b" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-highlight" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-station" }, /* @__PURE__ */ React.createElement("strong", null, "Aurangabad"), /* @__PURE__ */ React.createElement("span", null, "AWB yard limits"))));
  };
  const ESPAssetConfigEditor = ({ asset, instanceNumber, onCancel, onSave }) => {
    const [draft, setDraft] = useStateHub(Object.fromEntries(assetConfigFor(asset, instanceNumber)));
    const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
    const unitLabel = assetUnitLabel(asset.type);
    const identityEntry = Object.entries(draft).find(([label]) => label.includes("ID")) || [`${unitLabel} ID`, `${assetCodeFor(asset.type)}-${String(instanceNumber).padStart(2, "0")}`];
    return /* @__PURE__ */ React.createElement("div", { className: "sh-asset-config-panel" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, asset.type, " Configuration"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "Edit asset attributes for ESP ", ESP_DETAIL.version, " before saving a revision."))), /* @__PURE__ */ React.createElement("form", { className: "sh-asset-config-form", onSubmit: (event) => {
      event.preventDefault();
      onSave();
    } }, Object.entries(draft).map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "sh-asset-config-field", key: label }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value, onChange: (event) => update(label, event.target.value) }))), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-preview" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-title" }, /* @__PURE__ */ React.createElement(Icon, { name: asset.icon, size: 14 }), "Live Preview"), /* @__PURE__ */ React.createElement("span", { className: "sh-mini-label" }, unitLabel, " ", instanceNumber)), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-canvas", "data-type": (asset.type === "Adjacent Stations" || asset.type === "Platforms" || asset.type === "Tracks" || asset.type === "Points and Turnouts" || asset.type === "Dead Ends" || asset.type === "Trap Points" || asset.type === "Gates") ? "adjacent" : "default" }, (asset.type === "Adjacent Stations" || asset.type === "Platforms" || asset.type === "Tracks" || asset.type === "Points and Turnouts" || asset.type === "Dead Ends" || asset.type === "Trap Points" || asset.type === "Gates") ? /* @__PURE__ */ React.createElement("img", { src: asset.type === "Platforms" ? "assets/platform-esp.png" : asset.type === "Tracks" ? "assets/track-esp.png" : asset.type === "Points and Turnouts" ? "assets/turnout-esp.png" : asset.type === "Dead Ends" ? "assets/deadend-esp.png" : asset.type === "Trap Points" ? "assets/trappoint-esp.png" : asset.type === "Gates" ? "assets/gate-esp.png" : "assets/adjacent-station-esp.png", className: "sh-asset-live-esp-img", alt: asset.type + " source ESP", draggable: "false" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-line" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-badge" }, identityEntry[1]))))), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-config-actions" }, /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", onClick: onCancel }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "accent", leadingIcon: "check", onClick: onSave }, "Save Changes")));
  };
  const ESPAssetNav = ({ activeAsset, onChange }) => /* @__PURE__ */ React.createElement("div", { className: "sh-asset-nav", "aria-label": "Asset groups" }, ESP_ASSETS.map((item) => /* @__PURE__ */ React.createElement("button", { className: "sh-asset-nav-btn", type: "button", "data-active": item.type === activeAsset.type ? "true" : "false", key: item.type, onClick: () => onChange(item.type) }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 13 }), item.type)));
  const AssetInstanceSwitcher = ({ asset, active, onChange, onAdd, onRemove }) => /* @__PURE__ */ React.createElement("div", { className: "sh-track-switcher" }, /* @__PURE__ */ React.createElement("div", { className: "sh-track-switcher-label" }, /* @__PURE__ */ React.createElement(Icon, { name: asset.icon, size: 14 }), assetUnitLabel(asset.type)), /* @__PURE__ */ React.createElement("div", { className: "sh-track-list" }, Array.from({ length: asset.count }, (_, index) => index + 1).map((instanceNumber) => /* @__PURE__ */ React.createElement("button", { className: "sh-track-btn", type: "button", "data-active": instanceNumber === active ? "true" : "false", key: instanceNumber, onClick: () => onChange(instanceNumber) }, instanceNumber))), (onAdd || onRemove) && /* @__PURE__ */ React.createElement("div", { className: "sh-track-switcher-actions" }, onRemove && /* @__PURE__ */ React.createElement("button", { className: "sh-track-remove-btn", type: "button", disabled: asset.count <= 1, onClick: onRemove }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 12 }), "Remove"), onAdd && /* @__PURE__ */ React.createElement("button", { className: "sh-track-add-btn", type: "button", onClick: onAdd }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 12 }), "Add")));
  const ESPAssetEditorPage = ({ station, asset, onBack, onLibraryBack, onEspBack, onOpenEditor }) => {
    const [activeAssetType, setActiveAssetType] = useStateHub(asset.type);
    const [activeInstance, setActiveInstance] = useStateHub(1);
    const [assetCounts, setAssetCounts] = useStateHub(() => Object.fromEntries(ESP_ASSETS.map((item) => [item.type, item.count])));
    const activeAssetBase = ESP_ASSETS.find((item) => item.type === activeAssetType) || asset;
    const activeAsset = { ...activeAssetBase, count: assetCounts[activeAssetBase.type] || activeAssetBase.count };
    const activeAssetLabel = assetUnitLabel(activeAsset.type);
    const addAsset = () => {
      const nextCount = activeAsset.count + 1;
      setAssetCounts((current) => ({ ...current, [activeAsset.type]: nextCount }));
      setActiveInstance(nextCount);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: [
          ...onLibraryBack ? [{ label: "Digital Library", onClick: onLibraryBack }] : ["Digital Library"],
          { label: station.name, onClick: onBack },
          { label: `ESP ${ESP_DETAIL.version}`, onClick: onEspBack },
          `${activeAsset.type} Assets`
        ],
        searchPlaceholder: "Search asset attributes, chainage, layers..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, "Edit ", activeAsset.type, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, ESP_DETAIL.version)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, station.name, " (", station.code, ") \xB7 ", activeAsset.count, " assets \xB7 ", ESP_DETAIL.espFile)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "edit", onClick: onOpenEditor || (() => openStub("Open ESP in Editor")) }, "Open ESP in Editor"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "plus", onClick: addAsset }, "Add ", activeAssetLabel), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onEspBack }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: () => openStub(`Save ${activeAsset.type} configuration`) }, "Save Changes"))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll sh-esp-scroll" }, /* @__PURE__ */ React.createElement(ESPAssetNav, { activeAsset, onChange: (nextType) => {
      setActiveAssetType(nextType);
      setActiveInstance(1);
    } }), /* @__PURE__ */ React.createElement(AssetInstanceSwitcher, { asset: activeAsset, active: activeInstance, onChange: setActiveInstance }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-workspace" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-editor-shell" }, /* @__PURE__ */ React.createElement(ESPAssetPreview, { asset: activeAsset, instanceNumber: activeInstance }), /* @__PURE__ */ React.createElement(
      ESPAssetConfigEditor,
      {
        key: `${activeAsset.type}-${activeInstance}-${activeAsset.count}`,
        asset: activeAsset,
        instanceNumber: activeInstance,
        onCancel: onEspBack,
        onSave: () => openStub(`Save ${activeAsset.type} configuration`)
      }
    )))));
  };
  const ESP_EDITOR_TOOLS = [
    { id: "select", label: "Select", icon: "edit" },
    { id: "pan", label: "Pan", icon: "maximize" },
    { id: "track", label: "Track", icon: "track" },
    { id: "turnout", label: "Turnout", icon: "branch" },
    { id: "gradient", label: "Gradient", icon: "chart" },
    { id: "platform", label: "Platform", icon: "layers" },
    { id: "measure", label: "Measure", icon: "search" }
  ];
  const ESP_EDITOR_LAYERS = [
    { id: "all", label: "All digital ESP", icon: "layers", count: 17 },
    { id: "tracks", label: "Track centerlines", icon: "track", count: 5 },
    { id: "turnouts", label: "Turnouts and crossings", icon: "branch", count: 4 },
    { id: "gradients", label: "Gradient profile", icon: "chart", count: 2 },
    { id: "platforms", label: "Platforms", icon: "layers", count: 4 },
    { id: "limits", label: "Yard limits and gates", icon: "shield", count: 2 }
  ];
  const ESP_EDITOR_ASSETS = [
    { id: "trk-main", layer: "tracks", name: "Main line 1", kind: "Track", className: "sh-plan-track", style: { "--left": "7%", "--right": "7%", "--top": "48%" }, fields: { "Track ID": "ML-1", "Line type": "Main UP/DN", "Start chainage": "KM 431.240", "End chainage": "KM 433.860", "SOD status": "Passed" } },
    { id: "trk-loop", layer: "tracks", name: "Loop line 2", kind: "Track", className: "sh-plan-track", style: { "--left": "15%", "--right": "17%", "--top": "34%" }, fields: { "Track ID": "LL-2", "Line type": "Common loop", "Connected turnout": "P18, P21", "Clear length": "686 m", "SOD status": "Passed" } },
    { id: "trk-siding", layer: "tracks", name: "Goods siding", kind: "Track", className: "sh-plan-track", style: { "--left": "22%", "--right": "31%", "--top": "62%" }, fields: { "Track ID": "GS-1", "Line type": "Goods siding", "Buffer distance": "85 m", "Gradient": "1 in 400 falling", "SOD status": "Warning" } },
    { id: "turnout-p18", layer: "turnouts", name: "P18 crossover", kind: "Turnout", className: "sh-plan-turnout", style: { "--left": "33%", "--top": "41%", "--width": "20%", "--angle": "17deg" }, fields: { "Point ID": "P18", "Type": "1 in 12 curved switch", "Facing direction": "UP main to loop", "Chainage": "KM 431.920", "Interlocked": "Yes" } },
    { id: "turnout-p21", layer: "turnouts", name: "P21 turnout", kind: "Turnout", className: "sh-plan-turnout", style: { "--left": "58%", "--top": "52%", "--width": "19%", "--angle": "-18deg" }, fields: { "Point ID": "P21", "Type": "1 in 8.5 turnout", "Facing direction": "Loop to main", "Chainage": "KM 432.410", "Interlocked": "Yes" } },
    { id: "pf-1", layer: "platforms", name: "PF 1", kind: "Platform", className: "sh-plan-platform", inline: "PF 1", style: { "--left": "27%", "--top": "39%", "--width": "45%" }, fields: { "Platform": "PF 1", "Length": "620 m", "Level": "High", "Face": "Main line", "Clearance": "Validated" } },
    { id: "pf-2", layer: "platforms", name: "PF 2", kind: "Platform", className: "sh-plan-platform", inline: "PF 2", style: { "--left": "27%", "--top": "55%", "--width": "41%" }, fields: { "Platform": "PF 2", "Length": "585 m", "Level": "High", "Face": "Loop line", "Clearance": "Validated" } },
    { id: "gradient-1", layer: "gradients", name: "1 in 400 falling", kind: "Gradient", className: "sh-plan-gradient", style: { "--left": "36%", "--top": "24%", "--width": "28%", "--angle": "0deg" }, tone: "success", fields: { "Gradient": "1 in 400", "Direction": "Falling toward DN", "From": "KM 431.920", "To": "KM 432.560", "Rule status": "Passed" } },
    { id: "gradient-2", layer: "gradients", name: "Level section", kind: "Gradient", className: "sh-plan-gradient", style: { "--left": "68%", "--top": "24%", "--width": "18%", "--angle": "0deg" }, fields: { "Gradient": "Level", "Direction": "No ruling gradient", "From": "KM 432.560", "To": "KM 433.120", "Rule status": "Passed" } },
    { id: "lc-18", layer: "limits", name: "LC Gate 18", kind: "Gate", className: "sh-plan-gate", icon: "shield", style: { "--left": "43%", "--top": "70%" }, fields: { "Gate number": "LC-18", "Class": "Special", "Manning": "Manned", "Chainage": "KM 432.970", "Visibility": "Clear" } },
    { id: "yard-limit-up", layer: "limits", name: "UP yard limit", kind: "Boundary", className: "sh-plan-boundary", style: { "--left": "6%", "--top": "22%", "--width": "12%" }, fields: { "Limit": "UP yard", "Adjacent station": "Daulatabad", "Chainage": "KM 431.240", "Reference": "ESP-AWB-DIGITAL" } },
    { id: "bridge-1", layer: "tracks", name: "FOB crossing", kind: "Structure", className: "sh-plan-bridge", style: { "--left": "72%", "--top": "39%", "--width": "10%" }, fields: { "Structure": "FOB", "Crossing": "PF 1 to PF 2", "Chainage": "KM 433.020", "Clearance": "Validated" } }
  ];
  const ESPEditorPage = ({ station, version, onBack, onSave }) => {
    const currentVersion = version || { version: "1.0", fileName: `${station.code}-V0-R0-A0`, status: "Generated" };
    const [activeLayer, setActiveLayer] = useStateHub("all");
    const [selectedId, setSelectedId] = useStateHub("turnout-p18");
    const [activeTool, setActiveTool] = useStateHub("select");
    const [zoom, setZoom] = useStateHub(100);
    const [expanded, setExpanded] = useStateHub(false);
    const [showValidation, setShowValidation] = useStateHub(true);
    const [toast, setToast] = useStateHub("");
    const clampZoom = (value) => Math.min(150, Math.max(70, value));
    const visibleAssets = ESP_EDITOR_ASSETS.filter((item) => activeLayer === "all" || item.layer === activeLayer);
    const selectedAsset = ESP_EDITOR_ASSETS.find((item) => item.id === selectedId) || visibleAssets[0] || ESP_EDITOR_ASSETS[0];
    const layer = ESP_EDITOR_LAYERS.find((item) => item.id === activeLayer) || ESP_EDITOR_LAYERS[0];
    const changeLayer = (layerId) => {
      setActiveLayer(layerId);
      const firstAsset = ESP_EDITOR_ASSETS.find((item) => layerId === "all" || item.layer === layerId);
      if (firstAsset) setSelectedId(firstAsset.id);
    };
    const showToast = (message) => {
      setToast(message);
      window.setTimeout(() => setToast(""), 2600);
    };
    const saveDraft = () => {
      if (onSave) onSave(currentVersion);
      showToast("Digital ESP editor changes saved");
    };
    const validate = () => showToast("ESP validation complete: 1 warning remains");
    const submit = () => showToast("ESP kept in draft until warning is resolved");
    const renderAsset = (item) => {
      const isSelected = selectedAsset && selectedAsset.id === item.id;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          className: `sh-plan-asset ${item.className}`,
          "data-selected": isSelected ? "true" : "false",
          key: item.id,
          style: item.style,
          title: item.name,
          onClick: () => setSelectedId(item.id)
        },
        !item.inline && /* @__PURE__ */ React.createElement("span", { className: "sh-plan-label", "data-tone": item.tone }, item.name),
        item.inline || (item.icon && /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 15 }))
      );
    };
    return /* @__PURE__ */ React.createElement("div", { className: "sh-esp-editor", "data-expanded": expanded ? "true" : "false" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toolbar" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-title-block" }, /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: "Back to generated ESP", onClick: onBack }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 17 })), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-title" }, /* @__PURE__ */ React.createElement("span", null, "ESP Editor"), /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, currentVersion.version || "1.0"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", variant: "solid" }, "Digital")), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-sub" }, station.name, " (", station.code, ") - ", currentVersion.fileName || `${station.code}-V0-R0-A0`, " - track, turnout and gradient editor"))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-actions" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-zoom", "aria-label": "Zoom controls" }, /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: "Zoom out", disabled: zoom <= 70, onClick: () => setZoom((value) => clampZoom(value - 10)) }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 15 })), /* @__PURE__ */ React.createElement("input", { "aria-label": "Zoom level", type: "range", min: "70", max: "150", step: "5", value: zoom, onChange: (event) => setZoom(clampZoom(Number(event.target.value))) }), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: "Zoom in", disabled: zoom >= 150, onClick: () => setZoom((value) => clampZoom(value + 10)) }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 15 })), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-zoom-value" }, zoom, "%")), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: expanded ? "Show panels" : "Hide panels", onClick: () => setExpanded((value) => !value) }, /* @__PURE__ */ React.createElement(Icon, { name: expanded ? "minimize" : "maximize", size: 16 })), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "refresh", onClick: validate }, "Validate"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: saveDraft }, "Save Draft"))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-main" }, /* @__PURE__ */ React.createElement("aside", { className: "sh-editor-asset-rail", "aria-label": "ESP layers" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-rail-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-rail-title" }, "Layers"), /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 14 })), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-layer-group" }, ESP_EDITOR_LAYERS.map((item, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: item.id }, index === 1 && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-layer-heading" }, "Railway assets"), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-layer-btn", type: "button", "data-active": activeLayer === item.id ? "true" : "false", onClick: () => changeLayer(item.id) }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 14 }), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-layer-text" }, item.label), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-layer-count" }, item.count)))))), /* @__PURE__ */ React.createElement("section", { className: "sh-editor-stage-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-stage-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-context" }, /* @__PURE__ */ React.createElement(Icon, { name: layer.icon, size: 14 }), /* @__PURE__ */ React.createElement("strong", null, layer.label)), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-pills" }, /* @__PURE__ */ React.createElement("span", { className: "sh-editor-pill" }, /* @__PURE__ */ React.createElement(Icon, { name: "track", size: 12 }), "Broad gauge"), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-pill" }, /* @__PURE__ */ React.createElement(Icon, { name: "chart", size: 12 }), "1 in 400 max"), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-pill" }, /* @__PURE__ */ React.createElement(Icon, { name: "alert", size: 12 }), "1 warning"))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-viewport" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-canvas", style: { "--editor-zoom": `${zoom / 100}` } }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-station-chip" }, /* @__PURE__ */ React.createElement("strong", null, station.code), /* @__PURE__ */ React.createElement("span", null, station.name, " digital ESP")), visibleAssets.map(renderAsset)), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-bottom-dock", "aria-label": "ESP editor tools" }, ESP_EDITOR_TOOLS.map((tool, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: tool.id }, index === 2 && /* @__PURE__ */ React.createElement("span", { className: "sh-editor-dock-divider" }), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-tool-btn", type: "button", title: tool.label, "data-active": activeTool === tool.id ? "true" : "false", onClick: () => setActiveTool(tool.id) }, /* @__PURE__ */ React.createElement(Icon, { name: tool.icon, size: 16 })))))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-statusbar" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, selectedAsset.name), " selected - active tool: ", activeTool), /* @__PURE__ */ React.createElement("span", null, "Chainage base: ", station.cll || station.kilometerRef || "KM 431.240"))), /* @__PURE__ */ React.createElement("aside", { className: "sh-editor-inspector", "aria-label": "Selected ESP asset properties" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-title-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-title" }, selectedAsset.name), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-sub" }, selectedAsset.kind, " - ", currentVersion.fileName || "Digital ESP")), /* @__PURE__ */ React.createElement(StatusChip, null, selectedAsset.fields["SOD status"] || selectedAsset.fields["Rule status"] || "Editable"))), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-selected-meta" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-selected-tile" }, /* @__PURE__ */ React.createElement("span", null, "Layer"), /* @__PURE__ */ React.createElement("strong", null, (ESP_EDITOR_LAYERS.find((item) => item.id === selectedAsset.layer) || {}).label || selectedAsset.layer)), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-selected-tile" }, /* @__PURE__ */ React.createElement("span", null, "Mode"), /* @__PURE__ */ React.createElement("strong", null, activeTool))), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-form" }, Object.entries(selectedAsset.fields).map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-field", key: `${selectedAsset.id}-${label}` }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value, onChange: () => {} })))), showValidation && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-validations" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-validation-row" }, /* @__PURE__ */ React.createElement("span", null, "SOD validation"), /* @__PURE__ */ React.createElement(StatusChip, null, selectedAsset.fields["SOD status"] || "Passed")), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-validation-row" }, /* @__PURE__ */ React.createElement("span", null, "Zone rule validation"), /* @__PURE__ */ React.createElement(StatusChip, null, selectedAsset.id === "trk-siding" ? "Warning" : "Passed")), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-validation-row" }, /* @__PURE__ */ React.createElement("span", null, "SIP dependency"), /* @__PURE__ */ React.createElement(StatusChip, null, "Linked"))), selectedAsset.id === "trk-siding" && /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-live" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-live-head" }, /* @__PURE__ */ React.createElement("span", null, "Gradient warning"), /* @__PURE__ */ React.createElement(Icon, { name: "alert", size: 14 })), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-live-body" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Rule:"), " siding gradient should be confirmed against latest survey."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Action:"), " verify KM 432.560 to KM 432.970 before approval.")))), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: showValidation ? "eye" : "alert", onClick: () => setShowValidation((value) => !value) }, showValidation ? "Hide Checks" : "Show Checks"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "refresh", onClick: validate }, "Re-validate"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "check", onClick: saveDraft }, "Save"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "upload", onClick: submit }, "Submit")))), toast && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toast" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14 }), toast));
  };
  const SIPMetadataSummary = () => /* @__PURE__ */ React.createElement("div", { className: "sh-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-station-identity" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-identity-title" }, SIP_DETAIL.title, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, SIP_DETAIL.version)), /* @__PURE__ */ React.createElement("div", { className: "sh-identity-meta" }, SIP_DETAIL.documentType, " \xB7 ", SIP_DETAIL.stationContext)), /* @__PURE__ */ React.createElement("div", { className: "sh-inline-actions" }, /* @__PURE__ */ React.createElement(StatusChip, null, SIP_DETAIL.status))), /* @__PURE__ */ React.createElement("div", { className: "sh-detail-chips" }, /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "SIP version"), SIP_DETAIL.version), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "SIP file"), SIP_DETAIL.sipFile), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Source ESP"), SIP_DETAIL.espVersion), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "TOC file"), SIP_DETAIL.tocFile), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Last edited"), SIP_DETAIL.lastEdited), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Last edited by"), SIP_DETAIL.lastEditedBy)));
  const SIPValidationSection = () => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, "Validation Status"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "SIP workflow, signalling consistency and ESP dependency checks for ", SIP_DETAIL.version, "."))), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-validation-grid" }, SIP_VALIDATIONS.map((item) => /* @__PURE__ */ React.createElement(ESPValidationCard, { item, key: item.title }))));
  const SIPAssetDetails = () => /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, "SIP Asset Details"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "Signal and interlocking assets generated from ", SIP_DETAIL.espVersion, ".")), /* @__PURE__ */ React.createElement(StatusChip, null, "127 SIP assets")), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "ds-table sh-esp-table" }, /* @__PURE__ */ React.createElement("colgroup", null, /* @__PURE__ */ React.createElement("col", { style: { minWidth: 320 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 120 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 160 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 220 } })), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Asset Type")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Count")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Status")), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, SIP_ASSETS.map((asset) => /* @__PURE__ */ React.createElement("tr", { key: asset.type }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-asset-name" }, /* @__PURE__ */ React.createElement("span", { className: "sh-esp-asset-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: asset.icon, size: 14 })), /* @__PURE__ */ React.createElement("span", null, asset.type))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, asset.count), " total"), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StatusChip, null, asset.validation)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-row-actions" }, /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "eye", primary: true }, "View Assets")))))))));
  const SIPRelatedDocuments = () => /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, "Related Documents"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "Documents generated from or dependent on SIP ", SIP_DETAIL.version, "."))), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "ds-table sh-esp-table" }, /* @__PURE__ */ React.createElement("colgroup", null, /* @__PURE__ */ React.createElement("col", { style: { minWidth: 130 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 130 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 160 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 180 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 160 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 150 } })), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Document Type")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Version")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Status")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Generated From SIP Version")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Last Updated")), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, SIP_RELATED_DOCS.map((doc) => /* @__PURE__ */ React.createElement("tr", { key: doc.type }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, doc.type)), /* @__PURE__ */ React.createElement("td", null, doc.version), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StatusChip, null, doc.status)), /* @__PURE__ */ React.createElement("td", null, doc.source), /* @__PURE__ */ React.createElement("td", null, doc.updated), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "eye", primary: true, disabled: doc.disabled }, doc.action))))))));
  const SIPVersionHistory = ({ onViewArchive }) => /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, "SIP Version History"))), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "ds-table sh-esp-table" }, /* @__PURE__ */ React.createElement("colgroup", null, /* @__PURE__ */ React.createElement("col", { style: { minWidth: 140 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 170 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 140 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 140 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 140 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 150 } })), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Version")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Status")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Added on")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Approved Date")), /* @__PURE__ */ React.createElement("th", null, /* @__PURE__ */ React.createElement(SortableHeader, null, "Added by")), /* @__PURE__ */ React.createElement("th", null, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, SIP_VERSION_HISTORY.slice(0, 3).map((row) => /* @__PURE__ */ React.createElement("tr", { className: "sh-esp-version-row", "data-latest": row.latest ? "true" : "false", key: row.version }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-version-cell" }, /* @__PURE__ */ React.createElement("span", null, row.version), row.latest && /* @__PURE__ */ React.createElement("span", { className: "sh-latest-pill" }, "Latest"))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StatusChip, null, row.status)), /* @__PURE__ */ React.createElement("td", null, row.created), /* @__PURE__ */ React.createElement("td", null, row.approved), /* @__PURE__ */ React.createElement("td", null, row.by), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-esp-row-actions" }, row.actions.map((action) => /* @__PURE__ */ React.createElement(ESPRowAction, { key: action, icon: action === "View" ? "eye" : "copy" }, action))))))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-foot" }, /* @__PURE__ */ React.createElement("span", null, "Showing ", Math.min(3, SIP_VERSION_HISTORY.length), " of ", SIP_VERSION_HISTORY.length, " SIP versions"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", trailingIcon: "chevron_right", onClick: onViewArchive }, "View more")));
  const StationContext = ({ station, onEdit }) => /* @__PURE__ */ React.createElement("div", { className: "sh-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-station-identity" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-identity-title" }, station.name, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, station.code)), /* @__PURE__ */ React.createElement("div", { className: "sh-identity-meta" }, station.zone, " \xB7 ", station.division, " Division \xB7 ", station.section)), /* @__PURE__ */ React.createElement("div", { className: "sh-inline-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "edit", onClick: onEdit }, "Edit Station Details"))), /* @__PURE__ */ React.createElement("div", { className: "sh-detail-chips" }, /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Zone"), station.zone), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Division"), station.division), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Section"), station.section), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Station ID"), station.stationId || "-"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Station Title"), station.stationTitle || station.name), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Central Line Location"), station.cll || station.kilometerRef || "-"), /* @__PURE__ */ React.createElement("span", { className: "sh-detail-chip" }, /* @__PURE__ */ React.createElement("strong", null, "Train Direction"), station.trainDirection || "-")));
  const ARCHIVE_TABS = [
    { id: "ESP", label: "ESP", icon: "file_check" },
    { id: "SIP", label: "SIP", icon: "branch" },
    { id: "TOC", label: "TOC", icon: "book" },
    { id: "LOP", label: "LOP", icon: "layers" },
    { id: "Survey", label: "Survey Data", icon: "track" }
  ];
  const ArchiveSection = () => {
    const [active, setActive] = useStateHub("ESP");
    const [pageSize, setPageSize] = useStateHub(5);
    const [currentPage, setCurrentPage] = useStateHub(1);
    const activeTab = ARCHIVE_TABS.find((tab) => tab.id === active) || ARCHIVE_TABS[0];
    const rows = ARCHIVES[active] || [];
    const tabItems = ARCHIVE_TABS.map((tab) => ({ ...tab, count: (ARCHIVES[tab.id] || []).length }));
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = rows.length ? (safeCurrentPage - 1) * pageSize : 0;
    const pageEnd = Math.min(pageStart + pageSize, rows.length);
    const pagedRows = rows.slice(pageStart, pageEnd);
    const pageNumbers = totalPages <= 5 ? Array.from({ length: totalPages }, (_, i) => i + 1) : Array.from(/* @__PURE__ */ new Set([1, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, totalPages])).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
    const changeTab = (nextTab) => {
      setActive(nextTab);
      setCurrentPage(1);
    };
    const changePageSize = (nextSize) => {
      setPageSize(nextSize);
      setCurrentPage(1);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "sh-card sh-archive-panel" }, /* @__PURE__ */ React.createElement("div", { className: "sh-archive-top" }, /* @__PURE__ */ React.createElement("div", { className: "sh-section-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, activeTab.label, " Archive"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, "View approved, locked and archived records. Latest versions are highlighted.")), /* @__PURE__ */ React.createElement(StatusChip, null, rows.length ? `${rows.length} record${rows.length > 1 ? "s" : ""}` : "No records"))), /* @__PURE__ */ React.createElement("div", { className: "sh-archive-tabs" }, /* @__PURE__ */ React.createElement(Tabs, { items: tabItems, active, onChange: changeTab })), rows.length ? /* @__PURE__ */ React.createElement("div", { className: "dl-table-container sh-archive-table-container" }, /* @__PURE__ */ React.createElement("div", { className: "sh-archive-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "ds-table sh-archive-table" }, /* @__PURE__ */ React.createElement("colgroup", null, /* @__PURE__ */ React.createElement("col", { style: { minWidth: 120 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 180 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 130 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 130 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 140 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 150 } }), /* @__PURE__ */ React.createElement("col", { style: { minWidth: 150 } })), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Version"), /* @__PURE__ */ React.createElement("th", null, "Status"), /* @__PURE__ */ React.createElement("th", null, "Created date"), /* @__PURE__ */ React.createElement("th", null, "Approved date"), /* @__PURE__ */ React.createElement("th", null, "Created by"), /* @__PURE__ */ React.createElement("th", null, "Validation status"), /* @__PURE__ */ React.createElement("th", null, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, pagedRows.map((row, index) => /* @__PURE__ */ React.createElement("tr", { className: "sh-archive-row", "data-latest": row.latest ? "true" : "false", key: `${active}-${row.version}-${pageStart + index}` }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-version-cell" }, /* @__PURE__ */ React.createElement("span", null, row.version), row.latest && /* @__PURE__ */ React.createElement("span", { className: "sh-latest-pill" }, "Latest"))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StatusChip, null, row.status)), /* @__PURE__ */ React.createElement("td", null, row.created), /* @__PURE__ */ React.createElement("td", null, row.approved), /* @__PURE__ */ React.createElement("td", null, row.by), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StatusChip, null, row.validation)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "sh-archive-actions" }, row.actions.map((action) => /* @__PURE__ */ React.createElement("button", { className: "sh-archive-action", type: "button", key: action, onClick: () => openStub(`${action} ${active} ${row.version}`) }, /* @__PURE__ */ React.createElement(Icon, { name: action === "View" ? "eye" : "copy", size: 13 }), action))))))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-foot" }, /* @__PURE__ */ React.createElement("div", { className: "sh-archive-foot-left" }, /* @__PURE__ */ React.createElement("span", null, "Showing ", pageStart + 1, "-", pageEnd, " of ", rows.length, " archive records"), /* @__PURE__ */ React.createElement("label", { className: "sh-archive-page-size" }, /* @__PURE__ */ React.createElement("span", null, "Rows per page"), /* @__PURE__ */ React.createElement("select", { value: pageSize, onChange: (event) => changePageSize(Number(event.target.value)) }, [5, 10, 25].map((size) => /* @__PURE__ */ React.createElement("option", { key: size, value: size }, size))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-pager" }, /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === 1, onClick: () => setCurrentPage((page) => Math.max(1, page - 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 14 })), pageNumbers.map((page, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: page }, index > 0 && page - pageNumbers[index - 1] > 1 && /* @__PURE__ */ React.createElement("span", { className: "sh-page-ellipsis" }, "..."), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", "data-current": page === safeCurrentPage ? "true" : void 0, onClick: () => setCurrentPage(page) }, page))), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: safeCurrentPage === totalPages, onClick: () => setCurrentPage((page) => Math.min(totalPages, page + 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 14 }))))) : /* @__PURE__ */ React.createElement("div", { className: "sh-archive-empty" }, "No ", activeTab.label, " versions generated yet."));
  };
  const SIPDetailPage = ({ station, onBack, onLibraryBack }) => {
    const [moreOpen, setMoreOpen] = useStateHub(false);
    const [showArchive, setShowArchive] = useStateHub(false);
    const [editorOpen, setEditorOpen] = useStateHub(false);
    const runMoreAction = (label) => {
      openStub(label);
      setMoreOpen(false);
    };
    if (editorOpen) {
      return /* @__PURE__ */ React.createElement(SIPEditorPage, { station, onBack: () => setEditorOpen(false) });
    }
    if (showArchive) {
      return /* @__PURE__ */ React.createElement(ArchivePage, { station, onBack: () => setShowArchive(false), onLibraryBack });
    }
    return /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: [
          ...onLibraryBack ? [{ label: "Digital Library", onClick: onLibraryBack }] : ["Digital Library"],
          { label: station.name, onClick: onBack },
          `SIP ${SIP_DETAIL.version}`
        ],
        searchPlaceholder: "Search SIP assets, dependencies, versions..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, SIP_DETAIL.title, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, SIP_DETAIL.version)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, SIP_DETAIL.documentType, " \xB7 ", station.name, " (", station.code, ") \xB7 ", station.division, " Division \xB7 ", station.zone)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "edit", onClick: () => setEditorOpen(true) }, "Open SIP in editor"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: () => openStub("Submit SIP for approval") }, "Submit Review"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "download", onClick: () => openStub("Download SIP") }, "Download SIP"), /* @__PURE__ */ React.createElement("div", { className: "sh-more-wrap" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", trailingIcon: "chevron_down", onClick: () => setMoreOpen((open) => !open) }, "More actions"), moreOpen && /* @__PURE__ */ React.createElement("div", { className: "sh-more-menu" }, /* @__PURE__ */ React.createElement("button", { className: "sh-more-item", type: "button", onClick: () => runMoreAction("Create SIP revision") }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 14 }), "Create revision"), /* @__PURE__ */ React.createElement("button", { className: "sh-more-item", type: "button", onClick: () => runMoreAction("Re-run SIP validation") }, /* @__PURE__ */ React.createElement(Icon, { name: "refresh", size: 14 }), "Re-run validation"), /* @__PURE__ */ React.createElement("button", { className: "sh-more-item", type: "button", onClick: () => runMoreAction("View SIP audit trail") }, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 14 }), "View audit trail"))))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll sh-esp-scroll" }, /* @__PURE__ */ React.createElement(SIPMetadataSummary, null), /* @__PURE__ */ React.createElement(SIPValidationSection, null), /* @__PURE__ */ React.createElement(SIPAssetDetails, null), /* @__PURE__ */ React.createElement(SIPRelatedDocuments, null), /* @__PURE__ */ React.createElement(SIPVersionHistory, { onViewArchive: () => setShowArchive(true) })));
  };
  const SIPEditorPage = ({ station, onBack }) => {
    const [zoom, setZoom] = useStateHub(100);
    const [activeGroup, setActiveGroup] = useStateHub("signals");
    const [selectedId, setSelectedId] = useStateHub("sig-s18");
    const [showGreenZone, setShowGreenZone] = useStateHub(true);
    const [showIssues, setShowIssues] = useStateHub(true);
    const [toast, setToast] = useStateHub("");
    const activeElement = SIP_EDITOR_ELEMENTS.find((item) => item.id === selectedId);
    const group = SIP_EDITOR_GROUPS.find((item) => item.id === activeGroup) || SIP_EDITOR_GROUPS[0];
    const visibleElements = SIP_EDITOR_ELEMENTS.filter((item) => activeGroup === "issues" ? item.violation : item.group === activeGroup || activeGroup === "signals");
    const clampZoom = (value) => Math.min(150, Math.max(70, value));
    const saveDraft = () => {
      setToast("SIP draft saved with live validation state");
      window.setTimeout(() => setToast(""), 2600);
    };
    const submitReview = () => {
      setToast("SIP cannot be submitted until critical violations are fixed");
      window.setTimeout(() => setToast(""), 3e3);
    };
    const selectGroup = (nextGroup) => {
      setActiveGroup(nextGroup);
      const nextElement = SIP_EDITOR_ELEMENTS.find((item) => nextGroup === "issues" ? item.violation : item.group === nextGroup);
      setSelectedId(nextElement ? nextElement.id : null);
    };
    const moveToGreenZone = () => {
      if (!activeElement) return;
      setToast(`${activeElement.label} moved to Green Zone and revalidated`);
      window.setTimeout(() => setToast(""), 2600);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "sh-esp-editor sh-sip-editor", "data-has-selection": activeElement ? "true" : "false" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toolbar" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-title-block" }, /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: "Back to SIP details", onClick: onBack }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 17 })), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-title" }, /* @__PURE__ */ React.createElement("span", null, "SIP Editor"), /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, SIP_DETAIL.version), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", variant: "solid" }, "Draft")), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-sub" }, station.name, " (", station.code, ") - ", SIP_DETAIL.sipFile, " - linked to ", SIP_DETAIL.espVersion))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-actions" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-zoom", "aria-label": "Zoom controls" }, /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: "Zoom out", disabled: zoom <= 70, onClick: () => setZoom((value) => clampZoom(value - 10)) }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 15 })), /* @__PURE__ */ React.createElement("input", { "aria-label": "Zoom level", type: "range", min: "70", max: "150", step: "5", value: zoom, onChange: (event) => setZoom(clampZoom(Number(event.target.value))) }), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: "Zoom in", disabled: zoom >= 150, onClick: () => setZoom((value) => clampZoom(value + 10)) }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 15 })), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-zoom-value" }, zoom, "%")), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: showGreenZone ? "Hide Green Zone" : "Show Green Zone", onClick: () => setShowGreenZone((value) => !value) }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "sh-editor-icon-btn", type: "button", title: showIssues ? "Hide validation issues" : "Show validation issues", onClick: () => setShowIssues((value) => !value) }, /* @__PURE__ */ React.createElement(Icon, { name: "warning", size: 16 })))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-main" }, /* @__PURE__ */ React.createElement("section", { className: "sh-editor-stage-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-stage-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-sip-nav", "aria-label": "SIP editor navigation" }, SIP_EDITOR_GROUPS.map((item) => /* @__PURE__ */ React.createElement("button", { className: "sh-sip-nav-btn", type: "button", "data-active": item.id === activeGroup ? "true" : "false", key: item.id, onClick: () => selectGroup(item.id) }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 13 }), item.label, /* @__PURE__ */ React.createElement("span", { className: "sh-sip-nav-count" }, item.count)))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-pills" }, /* @__PURE__ */ React.createElement("span", { className: "sh-editor-pill" }, /* @__PURE__ */ React.createElement(Icon, { name: group.icon, size: 12 }), group.label), /* @__PURE__ */ React.createElement("span", { className: "sh-editor-pill" }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 12 }), "1 critical issue"))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-viewport" }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-canvas sh-sip-canvas", style: { "--editor-zoom": `${zoom / 100}` } }, /* @__PURE__ */ React.createElement("div", { className: "sh-editor-station-chip" }, /* @__PURE__ */ React.createElement("strong", null, station.code), /* @__PURE__ */ React.createElement("span", null, station.name, " SIP schematic")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-track loop" }), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-track main" }), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-track siding" }), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-turnout" }), showGreenZone && /* @__PURE__ */ React.createElement("div", { className: "sh-sip-green-zone" }, /* @__PURE__ */ React.createElement("span", null, "Green Zone: S18 valid placement")), visibleElements.map((item) => /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "sh-sip-element",
        "data-kind": item.kind,
        "data-selected": selectedId === item.id ? "true" : "false",
        "data-issue": item.violation ? "true" : "false",
        key: item.id,
        style: { "--left": `${item.left}%`, "--top": `${item.top}%` },
        title: `Open ${item.label} configuration`,
        onClick: () => setSelectedId(item.id)
      },
      /* @__PURE__ */ React.createElement("span", { className: "sh-sip-element-label" }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 13 }), item.label)
    )), showIssues && /* @__PURE__ */ React.createElement("div", { className: "sh-sip-issue-card" }, /* @__PURE__ */ React.createElement("strong", null, "Signal position outside valid range"), /* @__PURE__ */ React.createElement("span", null, "S18 is 42 m from P18. Required range is 60 m - 95 m. Move the signal into the Green Zone or correct linked ESP source data.")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-table-panel" }, /* @__PURE__ */ React.createElement("div", { className: "sh-sip-table-tile" }, /* @__PURE__ */ React.createElement("strong", null, "Aspect Control Chart"), /* @__PURE__ */ React.createElement("span", null, "1 pending impact")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-table-tile" }, /* @__PURE__ */ React.createElement("strong", null, "Deviation Table"), /* @__PURE__ */ React.createElement("span", null, "No deviation added")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-table-tile" }, /* @__PURE__ */ React.createElement("strong", null, "Title Block"), /* @__PURE__ */ React.createElement("span", null, "Draft signature pending"))))), /* @__PURE__ */ React.createElement("div", { className: "sh-editor-statusbar" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, activeElement ? activeElement.label : "No element"), " selected - edits validate immediately"), /* @__PURE__ */ React.createElement("span", null, "Ready status: Cannot submit due to critical violations"))), activeElement && /* @__PURE__ */ React.createElement("aside", { className: "sh-editor-inspector", "aria-label": "Selected SIP element configuration" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-title-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-title" }, activeElement.label), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-sub" }, activeElement.kind, " - ", activeElement.status)), /* @__PURE__ */ React.createElement(StatusChip, null, activeElement.status))), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-form" }, Object.entries(activeElement.fields).map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-field", key: `${activeElement.id}-${label}` }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value, onChange: () => {
    } })))), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-validation-list" }, /* @__PURE__ */ React.createElement("div", { className: "sh-sip-validation-item" }, /* @__PURE__ */ React.createElement("span", null, "SOD validation"), /* @__PURE__ */ React.createElement(StatusChip, null, "Not required")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-validation-item" }, /* @__PURE__ */ React.createElement("span", null, "Zone rule validation"), /* @__PURE__ */ React.createElement(StatusChip, null, "Not required")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-validation-item" }, /* @__PURE__ */ React.createElement("span", null, "Placement validation"), /* @__PURE__ */ React.createElement(StatusChip, null, activeElement.violation ? "Failed" : "Passed")), /* @__PURE__ */ React.createElement("div", { className: "sh-sip-validation-item" }, /* @__PURE__ */ React.createElement("span", null, "Route dependency"), /* @__PURE__ */ React.createElement(StatusChip, null, "Passed"))), activeElement.violation && /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-live" }, /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-live-head" }, /* @__PURE__ */ React.createElement("span", null, activeElement.violation), /* @__PURE__ */ React.createElement(Icon, { name: "warning", size: 14 })), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-live-body" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Rule:"), " Signal placement validity matrix"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Suggested fix:"), " ", activeElement.fix))), /* @__PURE__ */ React.createElement("div", { className: "sh-esp-action-row", style: { padding: "0 16px 16px", marginTop: 0, borderTop: "none" } }, /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "branch", onClick: () => openStub(`View linked ESP source for ${activeElement.label}`) }, "View Linked ESP Source"), /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "chart", onClick: () => openStub(`View aspect chart impact for ${activeElement.label}`) }, "Aspect Chart Impact"), /* @__PURE__ */ React.createElement(ESPRowAction, { icon: "info", onClick: () => openStub(`Add comment on ${activeElement.label}`) }, "Add Comment"))), /* @__PURE__ */ React.createElement("div", { className: "sh-inspector-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "refresh", onClick: () => openStub(`Re-validate ${activeElement.label}`) }, "Re-validate"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "shield", onClick: moveToGreenZone }, "Move"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "check", onClick: saveDraft }, "Save Draft"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "upload", onClick: submitReview }, "Submit Review")))), toast && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toast" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14 }), toast));
  };
  const ArchivePage = ({ station, onBack, onLibraryBack }) => /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
    AppTopBar,
    {
      crumbs: [
        ...onLibraryBack ? [{ label: "Digital Library", onClick: onLibraryBack }] : ["Digital Library"],
        { label: station.name, onClick: onBack },
        "Archive"
      ],
      searchPlaceholder: "Search archived versions, approvals, comparisons..."
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, "Archive and Version History", /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, station.code)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, "Document-wise locked, approved and archived versions for ", station.name, " station.")), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "copy", onClick: () => openStub("Compare archive versions") }, "Compare"))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll" }, /* @__PURE__ */ React.createElement(ArchiveSection, null)));
  const UPLOAD_DOC_TYPES = [
    { id: "ESP", label: "ESP", icon: "file_check", help: "Engineering Scale Plan drawing or revision" },
    { id: "SIP", label: "SIP", icon: "branch", help: "Signal Interlocking Plan draft or update" },
    { id: "LOP", label: "LOP", icon: "layers", help: "OHE Layout Plan document" },
    { id: "Survey Data", label: "Survey Data", icon: "track", help: "LiDAR, orthomosaic or total station input" }
  ];
  const ESP_UPLOAD_DEFAULT = {
    version: "",
    fileType: "DWG",
    fileName: "AWB_ESP_V8-PIM.dwg"
  };
  const PIM_STEPS = [
    { id: 1, title: "Tracks", asset: "Track geometry", status: "Review", icon: "track", fields: [["Main lines", "3"], ["Loop lines", "2"], ["Yard limit start", "KM 431.240"], ["Yard limit end", "KM 433.860"]] },
    { id: 2, title: "Platforms", asset: "Platform assets", status: "Review", icon: "layers", fields: [["Platforms", "4"], ["High level", "3"], ["Low level", "1"], ["Clearance status", "Validated"]] },
    { id: 3, title: "Turnouts", asset: "Points and crossings", status: "Review", icon: "branch", fields: [["Turnouts detected", "28"], ["Missing labels", "1"], ["Crossovers", "4"], ["Needs correction", "P18 label alignment"]] },
    { id: 4, title: "Gradient", asset: "Gradient profile", status: "Review", icon: "chart", fields: [["Gradient", "1 in 400"], ["Direction", "Falling"], ["From chainage", "431.920 km"], ["To chainage", "432.560 km"]] },
    { id: 5, title: "Gate", asset: "LC gate", status: "Review", icon: "shield", fields: [["Gate number", "18"], ["Class", "Special"], ["Manning", "Manned"], ["Chainage", "432.970 km"]] },
    { id: 6, title: "Digitize ESP", asset: "Digital output", status: "Pending", icon: "file_check", fields: [["Digital layer", "ESP-AWB-DIGITAL"], ["Version mode", "Create first digital ESP"], ["Output format", "DWG"], ["Ready to generate", "After review"]] }
  ];
  const DIGITAL_ESP_EDITOR_STEPS = [
    { id: 1, title: "Tracks", asset: "Track geometry", status: "Review", icon: "track", fields: [["Main lines", "3"], ["Loop lines", "2"], ["Yard limit start", "KM 431.240"], ["Yard limit end", "KM 433.860"]] },
    { id: 2, title: "Platforms", asset: "Platform assets", status: "Review", icon: "layers", fields: [["Platforms", "4"], ["High level", "3"], ["Low level", "1"], ["Clearance status", "Validated"]] },
    { id: 3, title: "Turnouts", asset: "Points and crossings", status: "Review", icon: "branch", fields: [["Turnouts detected", "28"], ["Missing labels", "1"], ["Crossovers", "4"], ["Needs correction", "P18 label alignment"]] },
    { id: 4, title: "Gradient", asset: "Gradient profile", status: "Review", icon: "chart", fields: [["Gradient", "1 in 400"], ["Direction", "Falling"], ["From chainage", "431.920 km"], ["To chainage", "432.560 km"]] },
    { id: 5, title: "Gate", asset: "LC gate", status: "Review", icon: "shield", fields: [["Gate number", "18"], ["Class", "Special"], ["Manning", "Manned"], ["Chainage", "432.970 km"]] },
    { id: 6, title: "Digitize ESP", asset: "Digital output", status: "Pending", icon: "file_check", fields: [["Digital layer", "ESP-AWB-DIGITAL"], ["Version mode", "Update current"], ["Output format", "DWG"], ["Ready to save", "Yes"]] }
  ];
  const UploadDocumentModal = ({ station, onClose, onUpload, initialDocType = "" }) => {
    const [step, setStep] = useStateHub(initialDocType ? 2 : 1);
    const [docType, setDocType] = useStateHub(initialDocType);
    const [versionNum, setVersionNum] = useStateHub("V0");
    const [revisionNum, setRevisionNum] = useStateHub("R0");
    const [alterationNum, setAlterationNum] = useStateHub("A0");
    const [fileType, setFileType] = useStateHub(initialDocType === "ESP" ? ESP_UPLOAD_DEFAULT.fileType : "");
    const [version, setVersion] = useStateHub("");
    const [fileReady, setFileReady] = useStateHub(initialDocType === "ESP");
    const selected = UPLOAD_DOC_TYPES.find((item) => item.id === docType);
    const canContinue = !!docType;
    const isEspUpload = docType === "ESP";
    const versionId = versionNum + "-" + revisionNum + "-" + alterationNum;
    const uploadVersion = version.trim();
    const uploadFileType = fileType || (isEspUpload ? ESP_UPLOAD_DEFAULT.fileType : "");
    const canUpload = isEspUpload ? Boolean(docType && versionId && fileReady) : Boolean(docType && uploadVersion && uploadFileType);
    const versionOptions = (prefix, n) => Array.from({ length: n }, (_, i) => prefix + i);
    const chooseType = (type) => {
      setDocType(type.id);
      if (type.id === "ESP") {
        setVersionNum("V0"); setRevisionNum("R0"); setAlterationNum("A0");
        setFileType(ESP_UPLOAD_DEFAULT.fileType);
        setFileReady(false);
      } else {
        setVersion(""); setFileType(""); setFileReady(false);
      }
      setStep(2);
    };
    const submit = (event) => {
      event.preventDefault();
      if (!canUpload) return;
      onUpload({ docType, version: isEspUpload ? versionId : uploadVersion, fileType: uploadFileType, fileName: station.name + "-" + docType });
    };
    const headTitle = step === 1 ? "Upload Document" : "Upload " + ((selected == null ? void 0 : selected.label) || "Document");
    const headSub = "Station " + station.code + " \xB7 Step " + step + " of 2";
    return ReactDOM.createPortal(/* @__PURE__ */ React.createElement("div", { className: "sh-upload-portal", onClick: onClose }, /* @__PURE__ */ React.createElement("form", { className: "sh-upload-shell", onClick: (event) => event.stopPropagation(), onSubmit: submit }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "upload", size: 18 })), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-text" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-title" }, headTitle), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-sub" }, headSub)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "sh-upload-shell-close", onClick: onClose, "aria-label": "Close" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 15 }))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-body" }, step === 1 ? /* @__PURE__ */ React.createElement("div", { className: "sh-upload-types-grid" }, UPLOAD_DOC_TYPES.map((type) => /* @__PURE__ */ React.createElement("button", { className: "sh-upload-type", type: "button", "data-active": docType === type.id ? "true" : "false", key: type.id, onClick: () => chooseType(type) }, /* @__PURE__ */ React.createElement("strong", null, /* @__PURE__ */ React.createElement(Icon, { name: type.icon, size: 16 }), type.label), /* @__PURE__ */ React.createElement("span", null, type.help)))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-summary-bar" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, selected == null ? void 0 : selected.label), " upload for ", station.name), /* @__PURE__ */ React.createElement("button", { className: "sh-upload-summary-change", type: "button", onClick: () => setStep(1) }, "Change type")), isEspUpload ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-group" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-group-label" }, "Version"), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-version-grid" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Version"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: versionNum, onChange: (e) => setVersionNum(e.target.value) }, versionOptions("V", 10).map((v) => /* @__PURE__ */ React.createElement("option", { key: v, value: v }, v)))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Revision"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: revisionNum, onChange: (e) => setRevisionNum(e.target.value) }, versionOptions("R", 10).map((v) => /* @__PURE__ */ React.createElement("option", { key: v, value: v }, v)))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Alteration"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: alterationNum, onChange: (e) => setAlterationNum(e.target.value) }, versionOptions("A", 10).map((v) => /* @__PURE__ */ React.createElement("option", { key: v, value: v }, v))))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-version-preview" }, /* @__PURE__ */ React.createElement("span", { className: "sh-upload-version-preview-label" }, "Version ID"), /* @__PURE__ */ React.createElement("span", { className: "sh-upload-version-id" }, versionId))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field", "data-span": "full" }, !fileReady ? /* @__PURE__ */ React.createElement("label", { className: "sh-upload-select-zone" }, /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".dwg,.pdf", className: "sh-upload-select-input", onChange: (event) => { var _a; const f = (_a = event.target.files) == null ? void 0 : _a[0]; if (f) { const ext = (f.name.split(".").pop() || "DWG").toUpperCase(); setFileType(ext === "PDF" ? "PDF" : "DWG"); setFileReady(true); } event.target.value = ""; } }), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-select-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "upload", size: 22 })), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-select-copy" }, /* @__PURE__ */ React.createElement("strong", null, station.name + "-" + docType), /* @__PURE__ */ React.createElement("span", null, "DWG or PDF \xB7 Click or drag to select file")), /* @__PURE__ */ React.createElement("span", { className: "sh-upload-select-button" }, "Select File")) : /* @__PURE__ */ React.createElement("div", { className: "sh-upload-file-card" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-file-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "file_check", size: 18 })), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-file-meta" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-file-name" }, station.name + "-" + docType), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-file-sub" }, uploadFileType, " \xB7 Ready to upload")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "sh-upload-file-remove", "aria-label": "Remove file", onClick: () => setFileReady(false) }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 14 })))))) : /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid" }, /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Version"), /* @__PURE__ */ React.createElement("input", { className: "sh-upload-grid-input", value: version, placeholder: docType === "Survey Data" ? "V2026.06" : "V1-R0-A0", onChange: (event) => setVersion(event.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Document file type"), /* @__PURE__ */ React.createElement("select", { className: "sh-upload-grid-input", value: fileType, onChange: (event) => setFileType(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select file type"), /* @__PURE__ */ React.createElement("option", { value: "DWG" }, "DWG"), /* @__PURE__ */ React.createElement("option", { value: "DXF" }, "DXF"), /* @__PURE__ */ React.createElement("option", { value: "PDF" }, "PDF"))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-grid-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", { className: "sh-upload-grid-label" }, "Upload file"), /* @__PURE__ */ React.createElement("input", { className: "sh-upload-grid-input is-file", type: "file", onChange: (event) => {
      var _a, _b;
      return setFileName(((_b = (_a = event.target.files) == null ? void 0 : _a[0]) == null ? void 0 : _b.name) || "");
    } }))))), /* @__PURE__ */ React.createElement("div", { className: "sh-upload-shell-foot" }, /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", onClick: onClose }, "Cancel"), step === 1 ? /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "accent", disabled: !canContinue, onClick: () => setStep(2) }, "Continue") : /* @__PURE__ */ React.createElement(Btn, { type: "submit", variant: "accent", leadingIcon: "upload", disabled: !canUpload }, "Upload")))), document.body);
  };
  const REVIEW_ASSET_GROUPS = [
    { type: "Adjacent Stations", count: 3, icon: "pin" },
    { type: "Platforms", count: 4, icon: "layers" },
    { type: "Tracks", count: 3, icon: "track" },
    { type: "Points and Turnouts", count: 3, icon: "branch" },
    { type: "Trap Points", count: 3, icon: "alert" },
    { type: "Dead Ends", count: 3, icon: "shield" },
    { type: "Gates", count: 3, icon: "shield" },
    { type: "Digitize ESP", count: 0, icon: "file_check", isDigitize: true }
  ];
  const REVIEW_STATUSES = {
    pending: { label: "Pending Review", tone: "neutral" },
    in_review: { label: "In Review", tone: "info" },
    reviewed: { label: "Reviewed", tone: "success" },
    correction: { label: "Needs Correction", tone: "danger" }
  };
  const ReviewExtractedAssetsPage = ({ station, upload, mode = "review", version, onBack, onFinish, onSaveAndClose, onSipDone }) => {
    const isDigitize = mode === "digitize";
    const verbTitle = isDigitize ? "Digitize" : "Review";
    const verbSection = isDigitize ? "Digitize ESP" : "Uploaded ESP";
    const rightPanelTitle = isDigitize ? "Digitize Output" : "Review";
    const rightPanelSub = isDigitize ? "Configure digital ESP output for this asset group." : "Validate extracted asset attributes before digitising ESP.";
    const breadcrumbDocLabel = isDigitize ? "Digitize ESP" : "Uploaded ESP";
    const sourceFileLabel = (version == null ? void 0 : version.fileName) || (upload == null ? void 0 : upload.fileName) || "";
    const documentKindLabel = isDigitize ? "digital ESP" : "uploaded ESP";
    const [assetCounts, setAssetCounts] = useStateHub(() => Object.fromEntries(REVIEW_ASSET_GROUPS.map((g) => [g.type, g.count])));
    const groups = REVIEW_ASSET_GROUPS.map((g) => ({ ...g, count: assetCounts[g.type] ?? g.count }));
    const [activeType, setActiveType] = useStateHub(groups[0].type);
    const [activeInstance, setActiveInstance] = useStateHub(1);
    const [statuses, setStatuses] = useStateHub(() => Object.fromEntries(groups.map((g) => [g.type, "pending"])));
    const [drafts, setDrafts] = useStateHub({});
    const [toast, setToast] = useStateHub("");
    const activeGroup = groups.find((g) => g.type === activeType) || groups[0];
    const isDigitizeStep = !!activeGroup.isDigitize;
    const pageVerbTitle = isDigitizeStep ? "Digitize" : verbTitle;
    const [digitalGenerated, setDigitalGenerated] = useStateHub(false);
    const [sipEditorOpen, setSipEditorOpen] = useStateHub(false);
    const [sipLoading, setSipLoading] = useStateHub(false);
    const [sipLoadingExit, setSipLoadingExit] = useStateHub(false);
    const [espLoading, setEspLoading] = useStateHub(false);
    const [espLoadingExit, setEspLoadingExit] = useStateHub(false);
    const unitLabel = assetUnitLabel(activeGroup.type);
    const draftKey = activeGroup.type + "-" + activeInstance;
    const initialDraft = Object.fromEntries(assetConfigFor(activeGroup, activeInstance));
    const draft = drafts[draftKey] || initialDraft;
    const identityEntry = Object.entries(draft).find(([label]) => label.toLowerCase().includes("id")) || [unitLabel + " ID", ""];
    const statusKey = statuses[activeGroup.type] || "pending";
    const status = REVIEW_STATUSES[statusKey];
    const groupIndex = groups.findIndex((g) => g.type === activeGroup.type);
    const isFirst = groupIndex === 0 && activeInstance === 1;
    const isLast = groupIndex === groups.length - 1 && (isDigitizeStep || activeInstance === activeGroup.count);
    const allReviewed = groups.every((g) => statuses[g.type] === "reviewed");
    React.useEffect(() => {
      setStatuses((prev) => prev[activeGroup.type] === "pending" ? { ...prev, [activeGroup.type]: "in_review" } : prev);
    }, [activeGroup.type]);
    const goPrev = () => {
      if (activeInstance > 1) {
        setActiveInstance(activeInstance - 1);
      } else if (groupIndex > 0) {
        setStatuses((prev) => ({ ...prev, [activeGroup.type]: "reviewed" }));
        const prevGroup = groups[groupIndex - 1];
        setActiveType(prevGroup.type);
        setActiveInstance(prevGroup.count);
      }
    };
    const goNext = () => {
      if (activeInstance < activeGroup.count) {
        setActiveInstance(activeInstance + 1);
      } else if (groupIndex < groups.length - 1) {
        setStatuses((prev) => ({ ...prev, [activeGroup.type]: "reviewed" }));
        setActiveType(groups[groupIndex + 1].type);
        setActiveInstance(1);
      }
    };
    const markReviewed = () => {
      setStatuses((prev) => ({ ...prev, [activeGroup.type]: "reviewed" }));
      setToast(activeGroup.type + " marked as reviewed");
      window.setTimeout(() => setToast(""), 2500);
    };
    const saveAndContinue = () => {
      markReviewed();
      if (!isLast) goNext();
    };
    const updateField = (label, value) => {
      setDrafts((prev) => ({ ...prev, [draftKey]: { ...draft, [label]: value } }));
    };
    const changeType = (nextType) => {
      setStatuses((prev) => ({ ...prev, [activeGroup.type]: "reviewed" }));
      setActiveType(nextType);
      setActiveInstance(1);
    };
    const addAsset = () => {
      if (isDigitizeStep) return;
      const nextCount = activeGroup.count + 1;
      setAssetCounts((current) => ({ ...current, [activeGroup.type]: nextCount }));
      setActiveInstance(nextCount);
      setStatuses((prev) => ({ ...prev, [activeGroup.type]: "in_review" }));
      setToast(`${unitLabel} ${nextCount} added`);
      window.setTimeout(() => setToast(""), 2500);
    };
    const removeAsset = () => {
      if (isDigitizeStep || activeGroup.count <= 1) return;
      const removedInstance = activeInstance;
      const nextCount = activeGroup.count - 1;
      setAssetCounts((current) => ({ ...current, [activeGroup.type]: nextCount }));
      setDrafts((prev) => {
        const nextDrafts = { ...prev };
        delete nextDrafts[`${activeGroup.type}-${removedInstance}`];
        return nextDrafts;
      });
      setActiveInstance(Math.min(activeInstance, nextCount));
      setStatuses((prev) => ({ ...prev, [activeGroup.type]: "in_review" }));
      setToast(`${unitLabel} ${removedInstance} removed`);
      window.setTimeout(() => setToast(""), 2500);
    };
    const handleDigitise = () => {
      setDigitalGenerated(true);
      setStatuses((prev) => ({ ...prev, [activeGroup.type]: "reviewed" }));
      setToast("Digital ESP generated");
      window.setTimeout(() => setToast(""), 2500);
    };
    const openEspEditor = () => {
      setEspLoading(true);
      setEspLoadingExit(false);
      window.setTimeout(() => setEspLoadingExit(true), 2900);
      window.setTimeout(() => {
        setEspLoading(false);
        setEspLoadingExit(false);
        handleDigitise();
      }, 3350);
    };
    const saveGeneratedDigital = () => {
      if (onFinish) onFinish({ close: true });
    };
    const deCanvasRef = React.useRef(null);
    React.useEffect(() => {
      if (digitalGenerated && deCanvasRef.current) {
        const el = deCanvasRef.current;
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      }
    }, [digitalGenerated]);
    const openSipEditor = () => {
      setSipLoading(true);
      setSipLoadingExit(false);
      window.setTimeout(() => setSipLoadingExit(true), 2900);
      window.setTimeout(() => {
        setSipLoading(false);
        setSipLoadingExit(false);
        setSipEditorOpen(true);
        setToast("Digital SIP generated successfully");
        window.setTimeout(() => setToast(""), 2500);
      }, 3350);
    };
    const deSipCanvasRef = React.useRef(null);
    React.useEffect(() => {
      if (sipEditorOpen && deSipCanvasRef.current) {
        const el = deSipCanvasRef.current;
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      }
    }, [sipEditorOpen]);
    if (espLoading) {
      return React.createElement("div", { className: "sh-sip-splash", "data-exit": espLoadingExit ? "true" : "false" },
        React.createElement("img", { src: "assets/pragathi-rail-logo.png", className: "sh-sip-splash-logo", alt: "Pragathi Rail", draggable: "false" }),
        React.createElement("div", { className: "sh-sip-splash-texts" },
          React.createElement("div", { className: "sh-sip-splash-title" }, "Generating Digital ESP"),
          React.createElement("div", { className: "sh-sip-splash-sub" }, station.name, " \xB7 ", station.code)
        ),
        React.createElement("div", { className: "sh-sip-splash-progress" },
          React.createElement("div", { className: "sh-sip-splash-track" },
            React.createElement("div", { className: "sh-sip-splash-bar" })
          )
        )
      );
    }
    if (sipLoading) {
      return React.createElement("div", { className: "sh-sip-splash", "data-exit": sipLoadingExit ? "true" : "false" },
        React.createElement("img", { src: "assets/pragathi-rail-logo.png", className: "sh-sip-splash-logo", alt: "Pragathi Rail", draggable: "false" }),
        React.createElement("div", { className: "sh-sip-splash-texts" },
          React.createElement("div", { className: "sh-sip-splash-title" }, "Generating Digital SIP"),
          React.createElement("div", { className: "sh-sip-splash-sub" }, station.name, " \xB7 ", station.code)
        ),
        React.createElement("div", { className: "sh-sip-splash-progress" },
          React.createElement("div", { className: "sh-sip-splash-track" },
            React.createElement("div", { className: "sh-sip-splash-bar" })
          )
        )
      );
    }
    if (sipEditorOpen) {
      const deTools1 = ["cursor", "branch", "edit", "plus", "minus"];
      const deTools2 = ["zoom", "shield", "pin", "alert", "layers"];
      const deTools3 = ["file_check", "download", "refresh", "settings", "clock"];
      const saveSipAndClose = () => {
        setSipEditorOpen(false);
        if (onSipDone) onSipDone();
      };
      return React.createElement("div", { className: "sh-digital-editor-full" },
        React.createElement("div", { className: "sh-de-topbar" },
          React.createElement("div", { className: "sh-de-topbar-left" },
            React.createElement("div", { className: "sh-de-topbar-title" }, "Digital SIP Editor"),
            React.createElement("span", { className: "dl-code-pill" }, station.code),
            React.createElement(Chip, { tone: "success" }, "Generated")
          ),
          React.createElement("div", { className: "sh-de-topbar-right" },
            React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: saveSipAndClose }, "Save and Close")
          )
        ),
        React.createElement("div", { className: "sh-de-icon-rail" },
          ["cursor", "zoom", "branch", "layers", "pin", "shield", "alert", "edit", "plus", "settings"].map((name) =>
            React.createElement("button", { key: name, className: "sh-de-rail-btn", type: "button" }, React.createElement(Icon, { name, size: 16 }))
          )
        ),
        React.createElement("div", { className: "sh-de-left-panel" },
          React.createElement("div", { className: "sh-de-canvas-tabs" },
            React.createElement("button", { className: "sh-de-canvas-tab", "data-active": "true", type: "button" }, React.createElement(Icon, { name: "layers", size: 13 }), "Model canvas", React.createElement("span", { className: "sh-de-tab-pill" }, "Model")),
            React.createElement("button", { className: "sh-de-canvas-tab", type: "button" }, React.createElement(Icon, { name: "file_check", size: 13 }), "Paper canvas", React.createElement("span", { className: "sh-de-tab-pill" }, "Paper"))
          ),
          React.createElement("div", { className: "sh-de-layers-head" },
            React.createElement("span", { className: "sh-de-layers-title" }, "Layers"),
            React.createElement("div", { className: "sh-de-layers-actions" },
              React.createElement("button", { className: "sh-de-layers-btn", type: "button" }, React.createElement(Icon, { name: "more", size: 13 })),
              React.createElement("button", { className: "sh-de-layers-btn", type: "button" }, React.createElement(Icon, { name: "search", size: 13 })),
              React.createElement("button", { className: "sh-de-layers-btn", type: "button" }, React.createElement(Icon, { name: "plus", size: 13 }))
            )
          ),
          React.createElement("div", { className: "sh-de-layer-item", "data-active": "true" },
            React.createElement("span", { className: "sh-de-layer-expand" }, React.createElement(Icon, { name: "chevron_right", size: 11 })),
            React.createElement("span", { className: "sh-de-layer-bar", "data-color": "blue" }),
            React.createElement("span", { className: "sh-de-layer-name" }, "PDF Import (1/1)")
          ),
          React.createElement("div", { className: "sh-de-layer-item" },
            React.createElement("span", { className: "sh-de-layer-expand" }, React.createElement(Icon, { name: "chevron_right", size: 11 })),
            React.createElement("span", { className: "sh-de-layer-bar" }),
            React.createElement("span", { className: "sh-de-layer-name" }, "Default"),
            React.createElement("span", { className: "sh-de-layer-dot" }, "●")
          )
        ),
        React.createElement("div", { className: "sh-de-canvas", ref: deSipCanvasRef },
          React.createElement("img", { src: "assets/digitize-sip.png", className: "sh-de-canvas-img", alt: "Digital SIP Canvas", draggable: "false" })
        ),
        React.createElement("div", { className: "sh-de-right-panel" },
          React.createElement("div", { className: "sh-de-prop-section" },
            React.createElement("div", { className: "sh-de-prop-head" }, React.createElement(Icon, { name: "chevron_down", size: 12 }), "Selection", React.createElement("span", { style: { marginLeft: "auto" } }, React.createElement(Icon, { name: "chevron_right", size: 12 }))),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Name"), React.createElement("span", { className: "sh-de-prop-val" }, React.createElement(Icon, { name: "edit", size: 11 }), "\xA0Unnamed")),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Layer"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-select" }, React.createElement("span", { className: "sh-de-layer-color" }), "\xA0PDF Import (1/1)\xA0", React.createElement(Icon, { name: "chevron_down", size: 11 }), React.createElement("span", { style: { marginLeft: "auto" } }, React.createElement(Icon, { name: "arrow_right", size: 11 })))),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Status"), React.createElement("div", { className: "sh-de-status-icons" }, React.createElement(Icon, { name: "lock", size: 13 }), React.createElement(Icon, { name: "lock", size: 13 }), React.createElement(Icon, { name: "eye", size: 13 }), React.createElement(Icon, { name: "maximize", size: 13 })))
          ),
          React.createElement("div", { className: "sh-de-prop-section" },
            React.createElement("div", { className: "sh-de-prop-head" }, React.createElement(Icon, { name: "chevron_down", size: 12 }), "Modify"),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Modify"), React.createElement("div", { className: "sh-de-icon-row" }, React.createElement(Icon, { name: "refresh", size: 14 }), React.createElement(Icon, { name: "sort", size: 14 }), React.createElement(Icon, { name: "arrow_up", size: 14 }), React.createElement(Icon, { name: "arrow_right", size: 14 }))),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Anchor"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-select" }, React.createElement(Icon, { name: "grip", size: 11 }), "\xA0Middle\xA0", React.createElement(Icon, { name: "chevron_down", size: 11 }))),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "X,Y"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "3812.44 m\xA0\xA0298.17 m")),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "W,H"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, React.createElement(Icon, { name: "lock", size: 11 }), "\xA0412.30 m\xA0\xA0186.52 m")),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Transform"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "0\xB0 / 100%"), React.createElement(Icon, { name: "refresh", size: 11, style: { color: "var(--ink-400)", marginLeft: "auto" } }))
          ),
          React.createElement("div", { className: "sh-de-prop-section" },
            React.createElement("div", { className: "sh-de-prop-head" }, React.createElement(Icon, { name: "chevron_down", size: 12 }), "Shapes"),
            React.createElement("div", { className: "sh-de-shapes-subhead" }, "Styles", React.createElement("div", { className: "sh-de-shapes-subhead-actions" }, React.createElement(Icon, { name: "edit", size: 12 }), React.createElement(Icon, { name: "plus", size: 12 }), React.createElement(Icon, { name: "more", size: 12 }))),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Fill"), React.createElement("button", { className: "sh-de-fill-btn", type: "button" }, "Add fill")),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Stroke"), React.createElement("div", { className: "sh-de-stroke-row" }, React.createElement("span", { className: "sh-de-stroke-line" }), React.createElement("span", { className: "sh-de-stroke-val" }, "0 mm"), React.createElement(Icon, { name: "chevron_down", size: 11, className: "sh-de-stroke-chevron" }), React.createElement("button", { className: "sh-de-stroke-minus", type: "button" }, React.createElement(Icon, { name: "minus", size: 11 })))),
            React.createElement("div", { className: "sh-de-shapes-subhead", style: { marginTop: 4 } }, "Properties"),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Length"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "2847.62 m")),
            React.createElement("div", { className: "sh-de-prop-row" }, React.createElement("span", { className: "sh-de-prop-label" }, "Area"), React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "7691.34 m\xB2"))
          ),
          React.createElement("div", { className: "sh-de-prop-section" },
            React.createElement("div", { className: "sh-de-prop-head" }, React.createElement(Icon, { name: "chevron_down", size: 12 }), "Custom properties", React.createElement("span", { style: { marginLeft: "auto" } }, React.createElement(Icon, { name: "chevron_right", size: 12 }))),
            React.createElement("div", { className: "sh-de-prop-row sh-de-prop-row--between" }, React.createElement("span", { className: "sh-de-prop-custom-label" }, "Shape properties"), React.createElement(Icon, { name: "more", size: 13 })),
            React.createElement("div", { className: "sh-de-prop-help" }, "Add custom properties to your shape.\xA0", React.createElement("span", { className: "sh-de-prop-link" }, "Learn more"))
          )
        ),
        React.createElement("div", { className: "sh-de-bottombar" },
          React.createElement("div", { className: "sh-de-bottombar-left" },
            React.createElement("button", { className: "sh-de-tool-btn", type: "button" }, React.createElement(Icon, { name: "branch", size: 15 })),
            React.createElement("button", { className: "sh-de-tool-btn", type: "button" }, React.createElement(Icon, { name: "chevron_up", size: 15 }))
          ),
          React.createElement("span", { className: "sh-de-bottombar-measure" }, "284.76 m"),
          React.createElement("div", { className: "sh-de-tool-group" }, deTools1.map((name) => React.createElement("button", { key: name, className: "sh-de-tool-btn", type: "button" }, React.createElement(Icon, { name, size: 15 })))),
          React.createElement("div", { className: "sh-de-tool-divider" }),
          React.createElement("div", { className: "sh-de-tool-group" }, deTools2.map((name) => React.createElement("button", { key: name, className: "sh-de-tool-btn", type: "button" }, React.createElement(Icon, { name, size: 15 })))),
          React.createElement("div", { className: "sh-de-tool-divider" }),
          React.createElement("div", { className: "sh-de-tool-group" }, deTools3.map((name) => React.createElement("button", { key: name, className: "sh-de-tool-btn", type: "button" }, React.createElement(Icon, { name, size: 15 }))))
        ),
        toast && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toast" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14 }), toast)
      );
    }
    if (isDigitizeStep && digitalGenerated) {
      const deTools1 = ["cursor", "branch", "edit", "plus", "minus"];
      const deTools2 = ["zoom", "shield", "pin", "alert", "layers"];
      const deTools3 = ["file_check", "download", "refresh", "settings", "clock"];
      return /* @__PURE__ */ React.createElement("div", { className: "sh-digital-editor-full" },
        /* @__PURE__ */ React.createElement("div", { className: "sh-de-topbar" },
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-topbar-left" },
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-topbar-title" }, "Digital ESP Editor"),
            /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, station.code),
            /* @__PURE__ */ React.createElement(Chip, { tone: "success" }, "Generated")
          ),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-topbar-right" },
            /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "branch", onClick: openSipEditor }, "Generate SIP"),
            /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: saveGeneratedDigital }, "Save and Close")
          )
        ),
        /* @__PURE__ */ React.createElement("div", { className: "sh-de-icon-rail" },
          ["cursor", "zoom", "branch", "layers", "pin", "shield", "alert", "edit", "plus", "settings"].map((name) => /* @__PURE__ */ React.createElement("button", { key: name, className: "sh-de-rail-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name, size: 16 })))
        ),
        /* @__PURE__ */ React.createElement("div", { className: "sh-de-left-panel" },
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-canvas-tabs" },
            /* @__PURE__ */ React.createElement("button", { className: "sh-de-canvas-tab", "data-active": "true", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "layers", size: 13 }), "Model canvas", /* @__PURE__ */ React.createElement("span", { className: "sh-de-tab-pill" }, "Model")),
            /* @__PURE__ */ React.createElement("button", { className: "sh-de-canvas-tab", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "file_check", size: 13 }), "Paper canvas", /* @__PURE__ */ React.createElement("span", { className: "sh-de-tab-pill" }, "Paper"))
          ),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-layers-head" },
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layers-title" }, "Layers"),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-layers-actions" },
              /* @__PURE__ */ React.createElement("button", { className: "sh-de-layers-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 13 })),
              /* @__PURE__ */ React.createElement("button", { className: "sh-de-layers-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "search", size: 13 })),
              /* @__PURE__ */ React.createElement("button", { className: "sh-de-layers-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 13 }))
            )
          ),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-layer-item", "data-active": "true" },
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-expand" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 11 })),
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-bar", "data-color": "blue" }),
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-name" }, "PDF Import (1/1)")
          ),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-layer-item" },
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-expand" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 11 })),
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-bar" }),
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-name" }, "Default"),
            /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-dot" }, "\u25CF")
          )
        ),
        /* @__PURE__ */ React.createElement("div", { className: "sh-de-canvas", ref: deCanvasRef },
          /* @__PURE__ */ React.createElement("img", { src: "assets/digitize-esp.png", className: "sh-de-canvas-img", alt: "Digital ESP Canvas", draggable: "false" })
        ),
        /* @__PURE__ */ React.createElement("div", { className: "sh-de-right-panel" },
          /* \u2500\u2500 Selection \u2500\u2500 */
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-section" },
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-head" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 12 }), "Selection", /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 12 }))),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Name"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val" }, /* @__PURE__ */ React.createElement(Icon, { name: "edit", size: 11 }), "\xA0Unnamed")),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Layer"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-select" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-layer-color" }), "\xA0PDF Import (1/1)\xA0", /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 11 }), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Icon, { name: "arrow_right", size: 11 })))),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Status"), /* @__PURE__ */ React.createElement("div", { className: "sh-de-status-icons" }, /* @__PURE__ */ React.createElement(Icon, { name: "lock", size: 13 }), /* @__PURE__ */ React.createElement(Icon, { name: "lock", size: 13 }), /* @__PURE__ */ React.createElement(Icon, { name: "eye", size: 13 }), /* @__PURE__ */ React.createElement(Icon, { name: "maximize", size: 13 })))
          ),
          /* \u2500\u2500 Modify \u2500\u2500 */
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-section" },
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-head" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 12 }), "Modify"),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Modify"), /* @__PURE__ */ React.createElement("div", { className: "sh-de-icon-row" }, /* @__PURE__ */ React.createElement(Icon, { name: "refresh", size: 14 }), /* @__PURE__ */ React.createElement(Icon, { name: "sort", size: 14 }), /* @__PURE__ */ React.createElement(Icon, { name: "arrow_up", size: 14 }), /* @__PURE__ */ React.createElement(Icon, { name: "arrow_right", size: 14 }))),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Anchor"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-select" }, /* @__PURE__ */ React.createElement(Icon, { name: "grip", size: 11 }), "\xA0Middle\xA0", /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 11 }))),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "X,Y"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "2449.98 m\xA0\xA0432.59 m")),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "W,H"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, /* @__PURE__ */ React.createElement(Icon, { name: "lock", size: 11 }), "\xA0297.61 m\xA0\xA0202.71 m")),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Transform"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "0\xB0 / 100%"), /* @__PURE__ */ React.createElement(Icon, { name: "refresh", size: 11, style: { color: "var(--ink-400)", marginLeft: "auto" } }))
          ),
          /* \u2500\u2500 Shapes (expanded: Styles + Properties) \u2500\u2500 */
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-section" },
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-head" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 12 }), "Shapes"),
            /* Styles sub-head */
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-shapes-subhead" }, "Styles", /* @__PURE__ */ React.createElement("div", { className: "sh-de-shapes-subhead-actions" }, /* @__PURE__ */ React.createElement(Icon, { name: "edit", size: 12 }), /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 12 }), /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 12 }))),
            /* Fill row */
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Fill"), /* @__PURE__ */ React.createElement("button", { className: "sh-de-fill-btn", type: "button" }, "Add fill")),
            /* Stroke row */
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Stroke"), /* @__PURE__ */ React.createElement("div", { className: "sh-de-stroke-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-stroke-line" }), /* @__PURE__ */ React.createElement("span", { className: "sh-de-stroke-val" }, "0 mm"), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 11, className: "sh-de-stroke-chevron" }), /* @__PURE__ */ React.createElement("button", { className: "sh-de-stroke-minus", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "minus", size: 11 })))),
            /* Properties sub-head */
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-shapes-subhead", style: { marginTop: 4 } }, "Properties"),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Length"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "1131.14 m")),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-label" }, "Area"), /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-val sh-de-prop-mono" }, "3536.62 m\xB2"))
          ),
          /* \u2500\u2500 Custom properties \u2500\u2500 */
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-section" },
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-head" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 12 }), "Custom properties", /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 12 }))),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-row sh-de-prop-row--between" }, /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-custom-label" }, "Shape properties"), /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 13 })),
            /* @__PURE__ */ React.createElement("div", { className: "sh-de-prop-help" }, "Add custom properties to your shape.\xA0", /* @__PURE__ */ React.createElement("span", { className: "sh-de-prop-link" }, "Learn more"))
          )
        ),
        /* @__PURE__ */ React.createElement("div", { className: "sh-de-bottombar" },
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-bottombar-left" },
            /* @__PURE__ */ React.createElement("button", { className: "sh-de-tool-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "branch", size: 15 })),
            /* @__PURE__ */ React.createElement("button", { className: "sh-de-tool-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_up", size: 15 }))
          ),
          /* @__PURE__ */ React.createElement("span", { className: "sh-de-bottombar-measure" }, "131.53 m"),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-tool-group" }, deTools1.map((name) => /* @__PURE__ */ React.createElement("button", { key: name, className: "sh-de-tool-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name, size: 15 })))),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-tool-divider" }),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-tool-group" }, deTools2.map((name) => /* @__PURE__ */ React.createElement("button", { key: name, className: "sh-de-tool-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name, size: 15 })))),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-tool-divider" }),
          /* @__PURE__ */ React.createElement("div", { className: "sh-de-tool-group" }, deTools3.map((name) => /* @__PURE__ */ React.createElement("button", { key: name, className: "sh-de-tool-btn", type: "button" }, /* @__PURE__ */ React.createElement(Icon, { name, size: 15 }))))
        ),
        toast && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toast" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14 }), toast)
      );
    }
    return /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(AppTopBar, { crumbs: ["Digital Library", { label: station.name, onClick: onBack }, (upload == null ? void 0 : upload.file) || (upload == null ? void 0 : upload.fileName) || "ESP File", "Review Assets"], searchPlaceholder: isDigitize ? "Search digital ESP assets, attributes..." : "Search extracted ESP assets, attributes..." }), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, isDigitizeStep ? activeGroup.type : pageVerbTitle + " " + activeGroup.type), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, station.name, " (", station.code, ") \xB7 ", documentKindLabel, sourceFileLabel ? " \xB7 " + sourceFileLabel : "")), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, digitalGenerated && /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: saveGeneratedDigital }, "Save and Close"))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll sh-esp-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "sh-review-stepper", "aria-label": "Asset review steps" }, groups.map((item, index) => {
      const itemStatusKey = statuses[item.type] || "pending";
      const isReviewed = itemStatusKey === "reviewed";
      const isActive = item.type === activeType;
      const prevReviewed = index > 0 && (statuses[groups[index - 1].type] === "reviewed");
      const itemCountLabel = item.isDigitize ? "Final step" : `${item.count} ${item.count === 1 ? "asset" : "assets"}`;
      return /* @__PURE__ */ React.createElement(React.Fragment, { key: item.type }, index > 0 && /* @__PURE__ */ React.createElement("div", { className: "sh-step-connector", "data-done": prevReviewed ? "true" : "false" }), /* @__PURE__ */ React.createElement("button", { className: "sh-step-pill", type: "button", "data-active": isActive ? "true" : "false", "data-reviewed": isReviewed ? "true" : "false", onClick: () => changeType(item.type) }, /* @__PURE__ */ React.createElement("div", { className: "sh-step-circle" }, isReviewed ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 }) : index + 1), /* @__PURE__ */ React.createElement("div", { className: "sh-step-label" }, /* @__PURE__ */ React.createElement("span", { className: "sh-step-label-name" }, item.type), /* @__PURE__ */ React.createElement("span", { className: "sh-step-label-count" }, itemCountLabel))));
    })), !isDigitizeStep && /* @__PURE__ */ React.createElement(AssetInstanceSwitcher, { asset: activeGroup, active: activeInstance, onChange: setActiveInstance, onAdd: addAsset, onRemove: removeAsset }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-workspace" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-editor-shell", "data-digitize": isDigitizeStep ? "true" : "false" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-panel" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, isDigitizeStep ? "Source ESP Preview" : activeGroup.type + " Preview"), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, isDigitizeStep ? "Source ESP remains on the left while digital output is generated on the right." : ["Highlighted ", unitLabel.toLowerCase(), " ", activeInstance, " in source ESP for ", station.name, "."])), /* @__PURE__ */ React.createElement(StatusChip, null, isDigitizeStep ? "Ready" : activeGroup.count + " " + (activeGroup.count === 1 ? "asset" : "assets"))), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview", "data-type": (activeGroup.type === "Adjacent Stations" || activeGroup.type === "Platforms" || activeGroup.type === "Tracks" || activeGroup.type === "Points and Turnouts" || activeGroup.type === "Dead Ends" || activeGroup.type === "Trap Points" || activeGroup.type === "Gates" || isDigitizeStep) ? "adjacent" : "track" }, (activeGroup.type === "Adjacent Stations" || activeGroup.type === "Platforms" || activeGroup.type === "Tracks" || activeGroup.type === "Points and Turnouts" || activeGroup.type === "Dead Ends" || activeGroup.type === "Trap Points" || activeGroup.type === "Gates" || isDigitizeStep) ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-label" }, isDigitizeStep ? "ESP Source" : [unitLabel, " ", activeInstance]), /* @__PURE__ */ React.createElement("img", { src: isDigitizeStep ? "assets/digitize-esp.png" : activeGroup.type === "Platforms" ? "assets/platform-esp.png" : activeGroup.type === "Tracks" ? "assets/track-esp.png" : activeGroup.type === "Points and Turnouts" ? "assets/turnout-esp.png" : activeGroup.type === "Dead Ends" ? "assets/deadend-esp.png" : activeGroup.type === "Trap Points" ? "assets/trappoint-esp.png" : activeGroup.type === "Gates" ? "assets/gate-esp.png" : "assets/adjacent-station-esp.png", className: "sh-asset-esp-img", alt: activeGroup.type + " ESP source diagram", draggable: "false" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-label" }, isDigitizeStep ? "ESP Source" : [unitLabel, " ", activeInstance]), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-track loop" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-track main" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-track siding" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-turnout a" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-turnout b" }), !isDigitizeStep && /* @__PURE__ */ React.createElement("div", { className: "sh-asset-highlight" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-preview-station" }, /* @__PURE__ */ React.createElement("strong", null, station.name), /* @__PURE__ */ React.createElement("span", null, station.code, " yard limits"))))), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-config-panel" }, !(isDigitizeStep && digitalGenerated) && /* @__PURE__ */ React.createElement("div", { className: "sh-asset-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-section-title" }, isDigitizeStep ? "Digital ESP" : activeGroup.type + " " + rightPanelTitle), /* @__PURE__ */ React.createElement("div", { className: "sh-section-sub" }, isDigitizeStep ? digitalGenerated ? "Generated digital ESP preview." : "Digital output will appear after digitization." : rightPanelSub)), /* @__PURE__ */ React.createElement(StatusChip, null, isDigitizeStep ? digitalGenerated ? "Generated" : "Empty" : status.label)), isDigitizeStep ? digitalGenerated ? /* @__PURE__ */ React.createElement("div", { className: "sh-digitize-generated sh-digitize-generated--editor" }, /* @__PURE__ */ React.createElement("img", { src: "assets/digital-esp-editor.png", className: "sh-digitize-editor-img", alt: "Digital ESP Editor", draggable: "false" })) : /* @__PURE__ */ React.createElement("div", { className: "sh-digitize-center" }, /* @__PURE__ */ React.createElement("div", { className: "sh-digitize-center-inner" }, /* @__PURE__ */ React.createElement("div", { className: "sh-digitize-center-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "file_check", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "sh-digitize-center-title" }, "Generate Digital ESP"), /* @__PURE__ */ React.createElement("div", { className: "sh-digitize-center-sub" }, "All assets have been reviewed. Click the button below to generate the digital ESP for ", station.name, "."), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "file_check", onClick: openEspEditor }, "Generate Digital ESP"))) : /* @__PURE__ */ React.createElement("form", { className: "sh-asset-config-form", onSubmit: (event) => {
      event.preventDefault();
      saveAndContinue();
    } }, Object.entries(draft).map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "sh-asset-config-field", key: label }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value, onChange: (event) => updateField(label, event.target.value) }))), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-preview" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-title" }, /* @__PURE__ */ React.createElement(Icon, { name: activeGroup.icon, size: 14 }), "Live Preview"), /* @__PURE__ */ React.createElement("span", { className: "sh-mini-label" }, unitLabel, " ", activeInstance)), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-canvas", "data-type": (activeGroup.type === "Adjacent Stations" || activeGroup.type === "Platforms" || activeGroup.type === "Tracks" || activeGroup.type === "Points and Turnouts" || activeGroup.type === "Dead Ends" || activeGroup.type === "Trap Points" || activeGroup.type === "Gates") ? "adjacent" : "default" }, (activeGroup.type === "Adjacent Stations" || activeGroup.type === "Platforms" || activeGroup.type === "Tracks" || activeGroup.type === "Points and Turnouts" || activeGroup.type === "Dead Ends" || activeGroup.type === "Trap Points" || activeGroup.type === "Gates") ? /* @__PURE__ */ React.createElement("img", { src: activeGroup.type === "Platforms" ? "assets/platform-esp.png" : activeGroup.type === "Tracks" ? "assets/track-esp.png" : activeGroup.type === "Points and Turnouts" ? "assets/turnout-esp.png" : activeGroup.type === "Dead Ends" ? "assets/deadend-esp.png" : activeGroup.type === "Trap Points" ? "assets/trappoint-esp.png" : activeGroup.type === "Gates" ? "assets/gate-esp.png" : "assets/adjacent-station-esp.png", className: "sh-asset-live-esp-img", alt: activeGroup.type + " source ESP", draggable: "false" }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-line" }), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-live-badge" }, identityEntry[1]))))), /* @__PURE__ */ React.createElement("div", { className: "sh-asset-config-actions sh-review-actions" }, /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", leadingIcon: "chevron_left", disabled: isFirst, onClick: goPrev }, "Previous"), /* @__PURE__ */ React.createElement("span", { className: "sh-review-spacer" }), /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", trailingIcon: "chevron_right", disabled: isLast, onClick: goNext }, "Next")))))), toast && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toast" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14 }), toast));
  };
  const PIMEditorPage = ({ station, upload, mode = "review", version, onBack, onFinish, onSave, onSaveAsNew, onSaveAndClose, onOpenEditor }) => {
    var _a;
    const startsOnDigitalOutput = mode === "generated-digital";
    const [activeStep, setActiveStep] = useStateHub(startsOnDigitalOutput ? 6 : 1);
    const [reviewedSteps, setReviewedSteps] = useStateHub(startsOnDigitalOutput ? [1, 2, 3, 4, 5] : []);
    const [toast, setToast] = useStateHub("");
    const isGeneratedDigital = mode === "generated-digital";
    const isDigitalEditor = mode === "digital-edit" || isGeneratedDigital;
    const steps = isDigitalEditor ? DIGITAL_ESP_EDITOR_STEPS : PIM_STEPS;
    const step = steps.find((item) => item.id === activeStep) || steps[0];
    const finalStepId = ((_a = steps[steps.length - 1]) == null ? void 0 : _a.id) || steps.length;
    const isDigitizeStep = activeStep === finalStepId;
    const markReviewed = (stepId = activeStep) => {
      if (stepId >= finalStepId) return;
      setReviewedSteps((items) => items.includes(stepId) ? items : [...items, stepId]);
    };
    const goNext = () => {
      markReviewed(activeStep);
      setActiveStep((value) => Math.min(steps.length, value + 1));
    };
    const goPrev = () => setActiveStep((value) => Math.max(1, value - 1));
    const goToStep = (stepId) => {
      if (stepId < finalStepId) markReviewed(stepId);
      setActiveStep(stepId);
    };
    const isEditMode = mode === "edit";
    const editingDigital = isEditMode || isDigitalEditor;
    const primaryTitle = isGeneratedDigital ? (version == null ? void 0 : version.fileName) || "Generated Digital ESP" : editingDigital ? "Edit Digital ESP" : "Review Extracted Assets";
    const primaryAction = isGeneratedDigital ? "Save and Close" : editingDigital ? "Save" : "Generate Digital ESP";
    const reviewedAllRequiredSteps = steps.filter((item) => item.id < finalStepId).every((item) => reviewedSteps.includes(item.id));
    const canUsePrimaryAction = editingDigital || reviewedAllRequiredSteps;
    const handlePrimaryAction = () => {
      if (!canUsePrimaryAction) return;
      if (isGeneratedDigital) {
        onSaveAndClose == null ? void 0 : onSaveAndClose();
        return;
      }
      if (editingDigital) {
        onSave();
        return;
      }
      onFinish();
    };
    return /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: ["Digital Library", { label: station.name, onClick: onBack }, "PIM Validation"],
        searchPlaceholder: "Search extracted ESP assets, rules, fields..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, primaryTitle), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, station.name, " (", station.code, ") \xB7 ", editingDigital ? `digital ESP \xB7 ${version == null ? void 0 : version.fileName}` : `uploaded ESP \xB7 ${upload.fileType}`)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, isGeneratedDigital && /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "edit", onClick: () => onOpenEditor && onOpenEditor(version) }, "Open ESP in Editor"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "check", onClick: () => onSaveAndClose == null ? void 0 : onSaveAndClose() }, "Save and Close"), editingDigital && !isGeneratedDigital && /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "copy", onClick: onSaveAsNew }, "Save as New"), editingDigital && !isGeneratedDigital && /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", disabled: !canUsePrimaryAction, onClick: handlePrimaryAction }, primaryAction))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll sh-esp-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-stepper", "aria-label": "PIM extraction validation steps" }, steps.map((item) => /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "sh-pim-step",
        type: "button",
        "data-active": item.id === activeStep ? "true" : "false",
        "data-reviewed": reviewedSteps.includes(item.id) ? "true" : "false",
        key: item.id,
        onClick: () => goToStep(item.id)
      },
      /* @__PURE__ */ React.createElement("span", { className: "sh-pim-step-index" }, item.id),
      /* @__PURE__ */ React.createElement("span", { className: "sh-pim-step-copy" }, /* @__PURE__ */ React.createElement("strong", null, item.title), /* @__PURE__ */ React.createElement("span", null, reviewedSteps.includes(item.id) ? "Reviewed" : item.status))
    ))), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-workspace" }, /* @__PURE__ */ React.createElement("section", { className: "sh-pim-source" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-panel-title" }, "Source ESP Diagram"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-panel-sub" }, "Highlighted extraction region for step ", step.id, ": ", step.asset)), /* @__PURE__ */ React.createElement(StatusChip, null, step.status)), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-diagram" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-label station" }, station.code, " \xB7 Source ESP"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-track loop" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-track main" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-track siding" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-turnout a" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-turnout b" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-highlight", "data-step": step.id }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-label", style: { left: "12%", top: "28%" } }, "KM 431.240"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-label", style: { left: "68%", top: "62%" } }, "P18 / Crossover"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-label", style: { left: "42%", top: "30%" } }, "Platforms 1-4"))), /* @__PURE__ */ React.createElement("section", { className: "sh-pim-fields" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-panel-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-panel-title" }, isDigitizeStep ? "Digital ESP Output" : step.title), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-panel-sub" }, isDigitizeStep ? "Generated station layout preview and save action" : "Extracted configuration fields \xB7 validate and correct values")), /* @__PURE__ */ React.createElement(StatusChip, null, step.asset)), isDigitizeStep ? /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digitize-panel" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digitize-preview", "aria-label": "Digital ESP preview" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digital-badge" }, isGeneratedDigital ? (version == null ? void 0 : version.fileName) || "Digital ESP" : "Digital ESP Preview"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digital-track a" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digital-track b" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digital-track c" }), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digital-platform one" }, "PF 1"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digital-platform two" }, "PF 2")), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digitize-copy" }, /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digitize-title" }, isGeneratedDigital ? "Digital ESP generated" : "Ready to generate Digital ESP"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-digitize-sub" }, isGeneratedDigital ? "Review the generated digital ESP preview, make required edits, then save and close to return to Station Details." : "All previous extraction steps are reviewed. Generate the digital ESP to create the first editable station baseline."))) : /* @__PURE__ */ React.createElement("div", { className: "sh-pim-field-grid" }, step.fields.map(([label, value]) => /* @__PURE__ */ React.createElement("div", { className: "sh-pim-field", key: label }, /* @__PURE__ */ React.createElement("label", null, label), /* @__PURE__ */ React.createElement("input", { value, onChange: () => {
    } })))), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-actions" }, /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "secondary", disabled: activeStep === 1, onClick: goPrev }, "Previous"), /* @__PURE__ */ React.createElement("div", { className: "sh-pim-actions-main" }, activeStep < steps.length ? /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "accent", onClick: goNext }, "Next") : !isGeneratedDigital ? /* @__PURE__ */ React.createElement(Btn, { type: "button", variant: "accent", leadingIcon: "check", disabled: !canUsePrimaryAction, onClick: handlePrimaryAction }, primaryAction) : null))))), toast && /* @__PURE__ */ React.createElement("div", { className: "sh-editor-toast" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 14 }), toast));
  };
  const StationHubPage = ({ station: initialStation, onBack, onEditorModeChange }) => {
    const [documentTab, setDocumentTab] = useStateHub("esp");
    const [station, setStation] = useStateHub(() => resolveStationHubBase(initialStation));
    const [editingDetails, setEditingDetails] = useStateHub(false);
    const [showEspDetail, setShowEspDetail] = useStateHub(false);
    const [showSipDetail, setShowSipDetail] = useStateHub(false);
    const [uploadOpen, setUploadOpen] = useStateHub(null);
    const [pimSession, setPimSession] = useStateHub(null);
    const [uploadedDocuments, setUploadedDocuments] = useStateHub(UPLOADED_DOCUMENT_ROWS);
    const [espRows, setEspRows] = useStateHub(DOCUMENT_TABLE_ROWS.esp);
    const [sipRows, setSipRows] = useStateHub([]);
    const [activeEspUpload, setActiveEspUpload] = useStateHub(null);
    const [digitalEspVersions, setDigitalEspVersions] = useStateHub([]);
    const [selectedDigitalVersion, setSelectedDigitalVersion] = useStateHub(null);
    const [espEditorVersion, setEspEditorVersion] = useStateHub(null);
    const [editingAsset, setEditingAsset] = useStateHub(null);
    const [toast, setToast] = useStateHub("");
    React.useEffect(() => {
      if (onEditorModeChange) onEditorModeChange(!!espEditorVersion);
    }, [onEditorModeChange, !!espEditorVersion]);
    const handleDownloadAll = () => {
      openStub("Download All Documents");
      setToast("Downloading all documents");
      window.setTimeout(() => setToast(""), 2600);
    };
    const handleOpenDocument = (doc) => {
      if (doc.id === "esp") {
        setShowEspDetail(true);
        return;
      }
      if (doc.id === "sip") {
        setShowSipDetail(true);
        return;
      }
      openStub(doc.action);
    };
    const handleOpenUploadedDocument = (row) => {
      const doc = DOCUMENTS.find((item) => item.id === row.docId);
      if (doc) {
        handleOpenDocument(doc);
        return;
      }
      openStub(`Open ${row.file}`);
    };
    const handleUploadDocument = (payload) => {
      setUploadOpen(null);
      if (payload.docType === "ESP") {
        const uploadId = `esp-upload-${Date.now()}`;
        setDocumentTab("esp");
        setActiveEspUpload({ ...payload, id: uploadId, status: "Processing", user: CURRENT_USER.name, uploaded: "Just now", modifiedBy: CURRENT_USER.name });
        const newRow = {
          id: uploadId,
          fileName: payload.fileName,
          status: "Processing",
          tone: "info",
          user: CURRENT_USER.name,
          initials: "AV",
          role: CURRENT_USER.role,
          uploaded: "Just now",
          version: payload.version,
          fileType: payload.fileType
        };
        setEspRows((rows) => [newRow, ...rows]);
        setToast(`ESP uploaded: ${payload.fileName} - processing`);
        window.setTimeout(() => setToast(""), 2600);
        window.setTimeout(() => {
          setEspRows((rows) => rows.map((r) => r.id === uploadId ? { ...r, status: "Need Review", tone: "warning" } : r));
          setActiveEspUpload((current) => current && current.id === uploadId ? { ...current, status: "Need Review" } : current);
          setToast(`${payload.fileName} ready for review`);
          window.setTimeout(() => setToast(""), 2600);
        }, 2200);
        return;
      }
      setUploadedDocuments((rows) => [uploadedDocumentFromPayload(payload), ...rows].slice(0, 2));
      setToast(`${payload.docType} ${payload.version} uploaded: ${payload.fileName}`);
      window.setTimeout(() => setToast(""), 3e3);
    };
    const handleDocumentUploadClick = (docType) => {
      setUploadOpen(docType);
    };
    const rowsByType = {
      esp: espRows,
      sip: sipRows,
      lop: DOCUMENT_TABLE_ROWS.lop,
      survey: DOCUMENT_TABLE_ROWS.survey
    };
    const handleOpenDocumentRow = (docType, row) => {
      if (docType === "esp") {
        setActiveEspUpload((current) => {
          var _a;
          return {
            ...current || {},
            id: row.id || (current == null ? void 0 : current.id),
            fileName: row.fileName,
            fileType: row.fileType || ((_a = row.fileName.split(".").pop()) == null ? void 0 : _a.toUpperCase()) || "DWG",
            version: row.version || "",
            status: row.status,
            user: row.user,
            uploaded: row.uploaded
          };
        });
        if (row.status === "Need Review" || row.status === "Processing") {
          setPimSession({ mode: "review" });
          return;
        }
        setShowEspDetail(true);
        return;
      }
      openStub(`View ${row.fileName}`);
    };
    const handleGenerateDigitalEsp = (options = {}) => {
      var _a;
      const sourceFileName = (activeEspUpload == null ? void 0 : activeEspUpload.fileName) || "AWB_ESP_V8-PIM.dwg";
      const sourceFileType = (activeEspUpload == null ? void 0 : activeEspUpload.fileType) || (((_a = sourceFileName.split(".").pop()) == null ? void 0 : _a.toUpperCase()) || "DWG");
      const nextVersion = {
        id: `digital-esp-${Date.now()}`,
        version: (activeEspUpload == null ? void 0 : activeEspUpload.version) || "V0-R0-A0",
        fileName: sourceFileName,
        sourceFile: sourceFileName,
        fileType: sourceFileType,
        status: "Generated",
        digitizeStatus: "Generated",
        sodValidation: "Pending",
        approvalStatus: "Pending",
        createdFrom: null,
        uploadedBy: CURRENT_USER.name,
        uploadedAt: "Just now",
        updatedBy: CURRENT_USER.name,
        updated: "Just now",
        lastActivityBy: CURRENT_USER.name,
        lastActivityAt: "Just now"
      };
      setDigitalEspVersions((rows) => [nextVersion, ...rows]);
      setEspRows([{
        id: nextVersion.id,
        fileName: `${station.code}-ESP`,
        status: "Generated",
        tone: "success",
        user: CURRENT_USER.name,
        initials: "AV",
        role: CURRENT_USER.role,
        uploaded: "Just now",
        version: nextVersion.version,
        fileType: sourceFileType,
        approvalStatus: "Pending"
      }]);
      setActiveEspUpload((current) => current ? { ...current, status: "Digital ESP Generated", version: nextVersion.version } : current);
      if (options.close) {
        setShowEspDetail(true);
        setPimSession(null);
        setToast(`${nextVersion.version} saved`);
      } else {
        setShowEspDetail(false);
        setPimSession({ mode: "generated-digital", version: nextVersion });
        setToast(`${nextVersion.version} generated`);
      }
      window.setTimeout(() => setToast(""), 2600);
    };
    const handleSaveDigitalEsp = () => {
      const version = pimSession == null ? void 0 : pimSession.version;
      if (version) {
        setDigitalEspVersions((rows) => rows.map((row) => row.id === version.id ? { ...row, updatedBy: CURRENT_USER.name, uploadedBy: row.uploadedBy || CURRENT_USER.name, uploadedAt: row.uploadedAt || "Just now", updated: "Just now", lastActivityBy: CURRENT_USER.name, lastActivityAt: "Just now", status: "Verified" } : row));
      }
      setShowEspDetail(true);
      setPimSession(null);
    };
    const handleSipDone = () => {
      // Mark the active ESP row as Generated (user went Generate SIP instead of Save & Close on ESP editor)
      setEspRows((rows) => {
        if (!rows.length) return rows;
        return rows.map((row, idx) => {
          const isActive = activeEspUpload ? row.id === activeEspUpload.id : idx === 0;
          return isActive ? { ...row, fileName: `${station.code}-ESP`, status: "Generated", tone: "success" } : row;
        });
      });
      setSipRows((rows) => {
        if (rows.length > 0) return rows;
        return [{
          fileName: `${station.code}-SIP`,
          version: "V1-R0-A0",
          fileType: "DWG",
          generatedFrom: activeEspUpload ? `ESP ${activeEspUpload.version || "V7-R0-A0"}` : espRows[0] ? `ESP ${espRows[0].version || "V7-R0-A0"}` : "ESP V7-R0-A0",
          status: "Generated",
          tone: "success",
          approvalStatus: "Pending",
          user: CURRENT_USER.name,
          initials: "AV",
          role: CURRENT_USER.role,
          uploaded: "Just now"
        }];
      });
      setPimSession(null);
      setShowSipDetail(false);
      setDocumentTab("sip");
      setToast("Digital SIP generated");
      window.setTimeout(() => setToast(""), 2600);
    };
    const handleSaveDigitalEspAndClose = () => {
      const version = pimSession == null ? void 0 : pimSession.version;
      if (version) {
        setDigitalEspVersions((rows) => rows.map((row) => row.id === version.id ? { ...row, updatedBy: CURRENT_USER.name, uploadedBy: row.uploadedBy || CURRENT_USER.name, uploadedAt: row.uploadedAt || "Just now", updated: "Just now", lastActivityBy: CURRENT_USER.name, lastActivityAt: "Just now", status: "Verified" } : row));
      }
      setDocumentTab("esp");
      setShowEspDetail(false);
      setPimSession(null);
      setToast(version ? "Digital ESP saved" : "Review saved and closed");
      window.setTimeout(() => setToast(""), 2600);
    };
    const handleSaveDigitalEspAsNew = () => {
      var _a, _b;
      const sourceFileName = ((_a = pimSession == null ? void 0 : pimSession.version) == null ? void 0 : _a.sourceFile) || (activeEspUpload == null ? void 0 : activeEspUpload.fileName) || "AWB_ESP_V8-PIM.dwg";
      const sourceFileType = ((_b = pimSession == null ? void 0 : pimSession.version) == null ? void 0 : _b.fileType) || (activeEspUpload == null ? void 0 : activeEspUpload.fileType) || ((sourceFileName.split(".").pop() || "").toUpperCase()) || "DWG";
      const nextVersion = {
        id: `digital-esp-${Date.now()}`,
        version: "1.0",
        fileName: sourceFileName,
        sourceFile: sourceFileName,
        fileType: sourceFileType,
        status: "Generated",
        digitizeStatus: "Generated",
        sodValidation: "Pending",
        uploadedBy: CURRENT_USER.name,
        uploadedAt: "Just now",
        updatedBy: CURRENT_USER.name,
        updated: "Just now",
        lastActivityBy: CURRENT_USER.name,
        lastActivityAt: "Just now"
      };
      setDigitalEspVersions((rows) => [nextVersion, ...rows]);
      setShowEspDetail(true);
      setPimSession(null);
    };
    const handleSaveEspEditorVersion = (version) => {
      if (!version || !version.id) return;
      setDigitalEspVersions((rows) => rows.map((row) => row.id === version.id ? { ...row, status: "Edited", digitizeStatus: "Edited", updatedBy: CURRENT_USER.name, updated: "Just now", lastActivityBy: CURRENT_USER.name, lastActivityAt: "Just now" } : row));
      setEspRows((rows) => rows.map((row) => row.id === version.id ? { ...row, status: "Edited", tone: "info", user: CURRENT_USER.name, uploaded: "Just now" } : row));
    };
    const handleCloneVersion = (sourceVersion) => {
      const nextVer = sourceVersion.cloneVersion || (() => {
        const srcParts = (sourceVersion.version || "V0-R0-A0").split("-");
        return srcParts[0] + "-" + srcParts[1] + "-A" + (parseInt((srcParts[2] || "A0").replace("A", "") || "0", 10) + 1);
      })();
      const cloned = {
        id: `digital-esp-${Date.now()}`,
        version: nextVer,
        fileName: sourceVersion.fileName,
        sourceFile: sourceVersion.sourceFile || sourceVersion.fileName,
        fileType: sourceVersion.fileType || "DWG",
        status: "Generated",
        digitizeStatus: "Generated",
        sodValidation: "Pending",
        approvalStatus: "Pending",
        createdFrom: sourceVersion.version,
        uploadedBy: CURRENT_USER.name,
        uploadedAt: "Just now",
        updatedBy: CURRENT_USER.name,
        updated: "Just now",
        lastActivityBy: CURRENT_USER.name,
        lastActivityAt: "Just now"
      };
      setDigitalEspVersions((rows) => [cloned, ...rows]);
      setToast(`Cloned as version ${nextVer}`);
      window.setTimeout(() => setToast(""), 2600);
    };
    if (espEditorVersion) {
      return /* @__PURE__ */ React.createElement(
        ESPEditorPage,
        {
          station,
          version: espEditorVersion,
          onBack: () => setEspEditorVersion(null),
          onSave: handleSaveEspEditorVersion
        }
      );
    }
    if (pimSession) {
      if (pimSession.mode === "review") {
        return /* @__PURE__ */ React.createElement(
          ReviewExtractedAssetsPage,
          {
            station,
            upload: activeEspUpload || ESP_UPLOAD_DEFAULT,
            mode: "review",
            onBack: () => {
              setPimSession(null);
              setShowEspDetail(true);
            },
            onFinish: handleGenerateDigitalEsp,
            onSaveAndClose: handleSaveDigitalEspAndClose,
            onSipDone: handleSipDone
          }
        );
      }
      if (pimSession.mode === "generated-digital") {
        return /* @__PURE__ */ React.createElement(
          PIMEditorPage,
          {
            station,
            upload: activeEspUpload || ESP_UPLOAD_DEFAULT,
            mode: "generated-digital",
            version: pimSession.version,
            onBack: () => {
              setPimSession(null);
            },
            onSaveAndClose: handleSaveDigitalEspAndClose,
            onOpenEditor: (version) => setEspEditorVersion(version || pimSession.version)
          }
        );
      }
      return /* @__PURE__ */ React.createElement(
        PIMEditorPage,
        {
          station,
          upload: activeEspUpload || ESP_UPLOAD_DEFAULT,
          mode: pimSession.mode,
          version: pimSession.version,
          onBack: () => {
            setPimSession(null);
            setShowEspDetail(true);
          },
          onFinish: handleGenerateDigitalEsp,
          onSave: handleSaveDigitalEsp,
          onSaveAsNew: handleSaveDigitalEspAsNew,
          onSaveAndClose: handleSaveDigitalEspAndClose
        }
      );
    }
    if (editingAsset) {
      return /* @__PURE__ */ React.createElement(
        ESPAssetEditorPage,
        {
          station,
          asset: editingAsset,
          onBack: () => setEditingAsset(null),
          onLibraryBack: onBack,
          onEspBack: () => setEditingAsset(null),
          onOpenEditor: () => setEspEditorVersion(selectedDigitalVersion || digitalEspVersions[0] || { version: "1.0", fileName: (activeEspUpload == null ? void 0 : activeEspUpload.fileName) || `${station.code}-V0-R0-A0` })
        }
      );
    }
    if (selectedDigitalVersion) {
      return /* @__PURE__ */ React.createElement(
        DigitalESPDetailPage,
        {
          station,
          version: selectedDigitalVersion,
          onBack: () => setSelectedDigitalVersion(null),
          onOpenEditor: () => {
            setEspEditorVersion(selectedDigitalVersion);
            setSelectedDigitalVersion(null);
          },
          onOpenAsset: (asset) => setEditingAsset(asset)
        }
      );
    }
    if (showEspDetail) {
      return /* @__PURE__ */ React.createElement(
        ESPWorkflowPage,
        {
          station,
          upload: activeEspUpload,
          digitalVersions: digitalEspVersions,
          onClone: handleCloneVersion,
          onBack: () => setShowEspDetail(false),
          onReviewAssets: () => {
            setShowEspDetail(false);
            const latestVersion = digitalEspVersions[0];
            setPimSession(latestVersion ? { mode: "edit", version: latestVersion } : { mode: "review" });
          },
          onOpenVersion: (version) => {
            setShowEspDetail(false);
            setSelectedDigitalVersion(version);
          }
        }
      );
    }
    if (showSipDetail) {
      return /* @__PURE__ */ React.createElement(SIPDetailPage, { station, onBack: () => setShowSipDetail(false), onLibraryBack: onBack });
    }
    return /* @__PURE__ */ React.createElement("div", { className: "sh-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: onBack ? [{ label: "Digital Library", onClick: onBack }, station.name] : ["Digital Library", station.name],
        searchPlaceholder: "Search station documents, assets, versions..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "sh-record-head" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-icon-badge" }, /* @__PURE__ */ React.createElement(Icon, { name: "train", size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "sh-record-heading" }, /* @__PURE__ */ React.createElement("div", { className: "sh-record-title" }, station.name, /* @__PURE__ */ React.createElement("span", { className: "dl-code-pill" }, station.code)), /* @__PURE__ */ React.createElement("div", { className: "sh-record-sub" }, "Station document hub for engineering diagrams and survey data")), /* @__PURE__ */ React.createElement("div", { className: "sh-record-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "download", onClick: handleDownloadAll }, "Download All"))), /* @__PURE__ */ React.createElement("div", { className: "sh-scroll" }, /* @__PURE__ */ React.createElement(StationContext, { station, onEdit: () => setEditingDetails(true) }), /* @__PURE__ */ React.createElement(DocumentTabsSection, { active: documentTab, onChange: setDocumentTab, rowsByType, onUpload: handleDocumentUploadClick, onOpenRow: handleOpenDocumentRow })), editingDetails && /* @__PURE__ */ React.createElement(EditStationMetadataV3Modal, { station, onClose: () => setEditingDetails(false), onSave: (nextStation) => {
      setStation(nextStation);
      setEditingDetails(false);
    } }), uploadOpen && /* @__PURE__ */ React.createElement(UploadDocumentModal, { station, initialDocType: uploadOpen === "all" ? "" : uploadOpen, onClose: () => setUploadOpen(null), onUpload: handleUploadDocument }), toast && /* @__PURE__ */ React.createElement("div", { className: "sh-toast", role: "status", "aria-live": "polite" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 16 }), toast));
  };
  window.StationHubPage = StationHubPage;
})();
