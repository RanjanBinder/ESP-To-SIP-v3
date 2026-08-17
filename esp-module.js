const { useState: useStateEsp, useEffect: useEffectEsp, useRef: useRefEsp, useMemo: useMemoEsp } = React;
const ESP_STATUS = {
  "Setup Incomplete": { tone: "neutral" },
  "Input Required": { tone: "warning" },
  "Ready for Generation": { tone: "info" },
  "Generating Options": { tone: "info", pulse: true },
  "Options Generated": { tone: "accent" },
  "Editing": { tone: "accent" },
  "Validation Failed": { tone: "danger" },
  "Ready for Review": { tone: "info" },
  "Under Review": { tone: "warning" },
  "Approved": { tone: "success" },
  "Finalized": { tone: "success" }
};
const RECENT_DESIGNS = [
  { station: "Tarur", code: "TRR", type: "Update ESP", base: "V2", current: "Draft V3", status: "In Progress", statusKey: "Editing", by: "K. Naidu", updated: "16 Aug 2026", action: "Continue" },
  { station: "Gudur South", code: "GSU", type: "Create ESP", base: "\u2014", current: "Draft V1", status: "Options Generated", statusKey: "Options Generated", by: "S. Reddy", updated: "15 Aug 2026", action: "Review Options" },
  { station: "Bhimavaram Town", code: "BVRT", type: "Update ESP", base: "V1", current: "Draft V2", status: "Validation Failed", statusKey: "Validation Failed", by: "V. Kumar", updated: "14 Aug 2026", action: "Fix Violations" },
  { station: "Ongole", code: "OGL", type: "Create ESP", base: "\u2014", current: "Draft V1", status: "Input Required", statusKey: "Input Required", by: "M. Prasad", updated: "12 Aug 2026", action: "Add Inputs" },
  { station: "Tenali Junction", code: "TEL", type: "Update ESP", base: "V2", current: "V3", status: "Under Review", statusKey: "Under Review", by: "R. Sharma", updated: "11 Aug 2026", action: "View" },
  { station: "Rajahmundry", code: "RJY", type: "Create ESP", base: "\u2014", current: "V1", status: "Finalized", statusKey: "Finalized", by: "A. Rao", updated: "08 Aug 2026", action: "View" }
];
const STATIONS = [
  {
    code: "TRR",
    name: "Tarur",
    zone: "SCR",
    division: "Vijayawada",
    section: "Vijayawada\u2013Gudivada",
    category: "NSG-5",
    status: "Operational",
    adjacent: ["Gudivada (GDV)", "Pedana (PDN)"],
    espVersions: ["V2 (Approved)", "V1 (Superseded)"],
    sip: "SIP V2 \xB7 Approved",
    latest: "V2",
    readiness: [
      { set: "Approved ESP", status: "Available: V2", tone: "success", action: "View" },
      { set: "Extracted station assets", status: "Validated", tone: "success", action: "View" },
      { set: "Key Plan", status: "Not available", tone: "danger", action: "Add" },
      { set: "GIS data", status: "Available", tone: "success", action: "View" },
      { set: "Survey data", status: "Available", tone: "success", action: "View" },
      { set: "Constraints", status: "Partially available", tone: "warning", action: "Review" }
    ]
  },
  {
    code: "GSU",
    name: "Gudur South",
    zone: "SCR",
    division: "Vijayawada",
    section: "Gudur\u2013Nellore",
    category: "NSG-6",
    status: "Proposed",
    adjacent: ["Gudur Jn (GDR)", "Manubolu (MBL)"],
    espVersions: [],
    sip: "Not available",
    latest: "\u2014",
    readiness: [
      { set: "Approved ESP", status: "Not available", tone: "danger", action: "Add" },
      { set: "Extracted station assets", status: "Not available", tone: "danger", action: "Add" },
      { set: "Key Plan", status: "Available", tone: "success", action: "View" },
      { set: "GIS data", status: "Available", tone: "success", action: "View" },
      { set: "Survey data", status: "Partially available", tone: "warning", action: "Review" },
      { set: "Constraints", status: "Available", tone: "success", action: "View" }
    ]
  },
  {
    code: "OGL",
    name: "Ongole",
    zone: "SCR",
    division: "Guntur",
    section: "Ongole\u2013Singarayakonda",
    category: "NSG-4",
    status: "Operational",
    adjacent: ["Chinnaganjam (CJM)", "Karavadi (KRV)"],
    espVersions: ["V1 (Approved)"],
    sip: "SIP V1 \xB7 Approved",
    latest: "V1",
    readiness: [
      { set: "Approved ESP", status: "Available: V1", tone: "success", action: "View" },
      { set: "Extracted station assets", status: "Needs PIM validation", tone: "warning", action: "Review" },
      { set: "Key Plan", status: "Available", tone: "success", action: "View" },
      { set: "GIS data", status: "Not available", tone: "danger", action: "Add" },
      { set: "Survey data", status: "Available", tone: "success", action: "View" },
      { set: "Constraints", status: "Not available", tone: "danger", action: "Add" }
    ]
  },
  {
    code: "BVRT",
    name: "Bhimavaram Town",
    zone: "SCR",
    division: "Vijayawada",
    section: "Bhimavaram\u2013Narsapur",
    category: "NSG-5",
    status: "Operational",
    adjacent: ["Bhimavaram Jn (BVRM)", "Veeravasaram (VVM)"],
    espVersions: ["V1 (Approved)"],
    sip: "SIP V1 \xB7 Under review",
    latest: "V1",
    readiness: [
      { set: "Approved ESP", status: "Available: V1", tone: "success", action: "View" },
      { set: "Extracted station assets", status: "Validated", tone: "success", action: "View" },
      { set: "Key Plan", status: "Available", tone: "success", action: "View" },
      { set: "GIS data", status: "Available", tone: "success", action: "View" },
      { set: "Survey data", status: "Available", tone: "success", action: "View" },
      { set: "Constraints", status: "Available", tone: "success", action: "View" }
    ]
  }
];
const CREATE_SCENARIOS = [
  {
    id: "greenfield",
    letter: "A",
    title: "New Yard / Greenfield ESP",
    icon: "cube",
    desc: "No previous ESP exists. You provide land boundary, connectivity and operational requirements.",
    inputs: ["Land boundary", "Connectivity requirement", "Operational requirement"],
    optional: "Key plan, survey data or a conceptual drawing may be used."
  },
  {
    id: "firstdigital",
    letter: "B",
    title: "Existing Yard \u2014 First Digital ESP",
    icon: "layers",
    desc: "The physical yard already exists but no approved digital ESP is available.",
    inputs: ["Existing PDF / CAD drawing", "Survey data"],
    optional: "Existing drawings are extracted and PIM-validated to build the digital ESP."
  },
  {
    id: "userdefined",
    letter: "C",
    title: "User-Defined Design",
    icon: "edit",
    desc: "Start from a conceptual design of your own.",
    inputs: ["Concept upload or direct drawing"],
    optional: "Upload a concept, or draw the layout directly in the editor."
  }
];
const INPUT_SOURCES = [
  { id: "library", icon: "book", title: "Select from Digital Library", desc: "Reuse a document already validated for this station." },
  { id: "upload", icon: "upload", title: "Upload new document", desc: "PDF or AutoCAD. Assets are extracted and PIM-validated." },
  { id: "draw", icon: "edit", title: "Draw conceptual layout", desc: "Sketch the proposed layout directly in the editor." }
];
const PRIMARY_INPUTS = [
  { id: "keyplan", label: "Key plan", req: true, state: "missing" },
  { id: "concept", label: "Conceptual drawing", state: "library", meta: "TRR-CONCEPT-v2.dwg" },
  { id: "totalstation", label: "Total Station survey data", req: true, state: "library", meta: "TRR-TS-2026.csv" },
  { id: "gis", label: "GIS data", state: "library", meta: "TRR-GIS.shp" },
  { id: "lidar", label: "LiDAR / drone data", state: "none" },
  { id: "lsection", label: "Approved L-section", state: "library", meta: "TRR-LSEC-v1.pdf" },
  { id: "boundary", label: "Land boundary", req: true, state: "library", meta: "TRR-BOUNDARY.dxf" },
  { id: "cost", label: "Cost data", state: "none" },
  { id: "constraints", label: "Constraints data", req: true, state: "partial", meta: "3 of 5 categories" }
];
const LINE_TYPES = ["Main line", "Loop line", "Siding"];
const CHANGE_TYPES = [
  "Add new line",
  "Add loop line",
  "Add siding",
  "Convert loop line to main line",
  "Modify track alignment",
  "Modify turnout",
  "Add or relocate platform",
  "Extend platform",
  "Modify yard connectivity",
  "Add or remove structure",
  "Other yard-remodelling work"
];
const PREV_ESPS = [
  { ver: "ESP V2", status: "Approved", date: "12 July 2026", format: "Digital (native)", by: "K. Naidu", approvedBy: "Sr. DEN / SCR", sip: "SIP V2", validated: "Validated" },
  { ver: "ESP V1", status: "Superseded", date: "04 Jan 2025", format: "Scanned PDF", by: "A. Rao", approvedBy: "Sr. DEN / SCR", sip: "SIP V1", validated: "Validated" }
];
const GEN_STAGES = [
  "Analysing available space",
  "Evaluating connectivity",
  "Applying track geometry",
  "Applying S-O-D rules",
  "Checking operational feasibility",
  "Generating ESP options"
];
const OPTIONS = [
  {
    id: 1,
    name: "Option 1",
    tag: "Balanced",
    recommended: true,
    score: 94,
    violations: 0,
    warnings: 3,
    land: "78%",
    turnouts: 6,
    trackLength: "4,820 m",
    connectivity: "Both ends, 2 main + 2 loop",
    cost: "\u20B9 18.4 Cr",
    constraints: "Level crossing at 412/7 retained",
    rationale: "Reuses the existing loop alignment, so earthwork is limited to the north throat."
  },
  {
    id: 2,
    name: "Option 2",
    tag: "Max capacity",
    recommended: false,
    score: 81,
    violations: 2,
    warnings: 6,
    land: "94%",
    turnouts: 9,
    trackLength: "6,140 m",
    connectivity: "Both ends, 2 main + 3 loop + siding",
    cost: "\u20B9 26.1 Cr",
    constraints: "Requires land acquisition on the down side",
    rationale: "Adds a third loop for maximum crossing capacity at the cost of two S-O-D deviations."
  },
  {
    id: 3,
    name: "Option 3",
    tag: "Low cost",
    recommended: false,
    score: 88,
    violations: 1,
    warnings: 2,
    land: "61%",
    turnouts: 4,
    trackLength: "3,960 m",
    connectivity: "Single-end connectivity, 2 main + 1 loop",
    cost: "\u20B9 12.7 Cr",
    constraints: "No platform extension possible later",
    rationale: "Minimum intervention. Cheapest to build but constrains future extension."
  }
];
const COMPARE_ROWS = [
  { label: "Compliance score", key: "score", suffix: "", better: "high" },
  { label: "S-O-D violations", key: "violations", better: "low" },
  { label: "Warnings", key: "warnings", better: "low" },
  { label: "Land utilization", key: "land" },
  { label: "New turnouts", key: "turnouts", better: "low" },
  { label: "Proposed track length", key: "trackLength" },
  { label: "Connectivity", key: "connectivity" },
  { label: "Estimated cost", key: "cost" },
  { label: "Major constraints", key: "constraints" }
];
const EDITOR_LAYERS = [
  { id: "prev", label: "Previous approved ESP", count: 412, colour: "#0E1B2C", on: true },
  { id: "proposed", label: "Proposed changes", count: 38, colour: "#DC2626", on: true },
  { id: "assets", label: "Extracted assets", count: 412, colour: "#3737C8", on: true },
  { id: "gis", label: "GIS / survey reference", count: 2, colour: "#0D9488", on: false },
  { id: "constraints", label: "Constraints", count: 7, colour: "#B45309", on: true },
  { id: "sod", label: "S-O-D violations", count: 3, colour: "#BE123C", on: true },
  { id: "notes", label: "User annotations", count: 12, colour: "#64748B", on: false }
];
const EDITOR_TOOLS = [
  { id: "select", icon: "cursor", label: "Select & search" },
  { id: "track", icon: "track", label: "Track & turnout" },
  { id: "platform", icon: "layers", label: "Platforms & structures" },
  { id: "shape", icon: "select_rect", label: "Shapes" },
  { id: "note", icon: "edit", label: "Annotations" },
  { id: "dim", icon: "ruler", label: "Dimensions" },
  { id: "measure", icon: "target", label: "Measure" }
];
const VALIDATION = {
  passed: 128,
  violations: 3,
  warnings: 7,
  na: 22,
  manual: 4,
  condonation: 2,
  results: [
    {
      id: "v1",
      sev: "violation",
      rule: "SOD 4.2.1",
      title: "Track centre spacing below minimum",
      asset: "Loop line 3 \u2194 Main line 2",
      measured: "4.28 m",
      required: "\u2265 4.72 m",
      ch: "412/6\u2013412/9",
      note: "Spacing reduced through the north throat after the proposed realignment."
    },
    {
      id: "v2",
      sev: "violation",
      rule: "SOD 5.1.4",
      title: "Platform offset from track centre",
      asset: "Platform 2 (proposed extension)",
      measured: "1.61 m",
      required: "1.68 m",
      ch: "413/2",
      note: "Extension follows the existing platform face, which is already non-standard."
    },
    {
      id: "v3",
      sev: "violation",
      rule: "IRSOD 3.3",
      title: "Fouling mark clearance",
      asset: "Turnout 14A",
      measured: "3.90 m",
      required: "\u2265 4.25 m",
      ch: "412/1",
      note: "Fouling mark cannot be derived at the proposed turnout position."
    },
    {
      id: "w1",
      sev: "warning",
      rule: "GEO 2.6",
      title: "Curve radius below desirable value",
      asset: "Proposed main line curve C3",
      measured: "R 612 m",
      required: "R \u2265 700 m desirable",
      ch: "411/8",
      note: "Permissible but attracts a permanent speed restriction."
    },
    {
      id: "w2",
      sev: "warning",
      rule: "OPS 1.2",
      title: "Simultaneous reception not available",
      asset: "North throat",
      measured: "Not achievable",
      required: "Desirable",
      ch: "\u2014",
      note: "Yard geometry does not allow simultaneous reception on both main lines."
    }
  ]
};
const FINAL_CHECKLIST = [
  { id: "meta", label: "Station metadata completed", done: true },
  { id: "tables", label: "Required ESP tables included", done: true },
  { id: "title", label: "Title block completed", done: true },
  { id: "keyplan", label: "Key plan included", done: false },
  { id: "scale", label: "Scale and orientation confirmed", done: true },
  { id: "sources", label: "Source inputs validated", done: true },
  { id: "sod", label: "S-O-D validation completed", done: false },
  { id: "changes", label: "User changes reviewed", done: true },
  { id: "comments", label: "Required comments resolved", done: false },
  { id: "preview", label: "Output preview checked", done: true }
];
const FINAL_OUTPUTS = [
  { icon: "file", label: "ESP version number assigned", meta: "V3" },
  { icon: "file", label: "PDF generated", meta: "TRR-ESP-V3.pdf" },
  { icon: "cube", label: "DWG / DXF generated", meta: "TRR-ESP-V3.dwg" },
  { icon: "save", label: "Editable digital ESP saved", meta: "native format" },
  { icon: "layers", label: "Structured asset data saved", meta: "438 assets" },
  { icon: "shield", label: "Validation results saved", meta: "160 rules" },
  { icon: "branch", label: "Source-to-output traceability saved", meta: "9 sources" },
  { icon: "clock", label: "Change and approval history saved", meta: "24 events" },
  { icon: "book", label: "Associated with station in Digital Library", meta: "Tarur (TRR)" },
  { icon: "file_check", label: "Available for SIP generation", meta: "unlocked" }
];
const WORKFLOW_STEPS = [
  { id: 0, label: "Station", sub: "Select yard" },
  { id: 1, label: "Base Data", sub: "Source & scenario" },
  { id: 2, label: "Design Inputs", sub: "Requirements" },
  { id: 3, label: "Generate Options", sub: "Readiness" },
  { id: 4, label: "Compare", sub: "Choose option" },
  { id: 5, label: "Edit & Validate", sub: "Editor" },
  { id: 6, label: "Review & Finalize", sub: "Submit" }
];
const espCSS = `
.esp-page { display: flex; flex: 1 1 auto; flex-direction: column; width: 100%; height: 100%; min-width: 0; background: #f6f7f9; }
.esp-topbar { flex-shrink: 0; background: #f6f7f9; border-bottom: 0; padding: 26px 34px 0; }
.esp-crumb { display: none; }
.esp-crumb button { border: none; background: none; font: inherit; color: var(--ink-500); cursor: pointer; padding: 2px 4px; border-radius: var(--r-sm); }
.esp-crumb button:hover { background: var(--accent-soft); color: var(--accent-text); }
.esp-crumb .cur { color: var(--ink-900); font-weight: 700; }
.esp-titlerow { display: flex; align-items: flex-start; gap: 20px; margin-top: 0; }
.esp-title { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink-900); line-height: 1.2; }
.esp-sub { font-size: 13.5px; color: var(--ink-500); margin-top: 5px; }
.esp-titlerow-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.esp-tabs { display: flex; gap: 26px; margin-top: 20px; border-bottom: 1px solid #e7eaee; }
.esp-tab { position: relative; padding: 0 2px 11px; border: none; background: none; font: inherit; font-size: 13px; font-weight: 650; color: var(--ink-500); cursor: pointer; }
.esp-tab:hover { color: var(--accent-text); background: var(--accent-soft); }
.esp-tab[data-active="true"] { color: var(--accent-text); }
.esp-tab[data-active="true"]::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--accent); border-radius: 2px 2px 0 0; }
.esp-body { flex: 1; min-width: 0; overflow-y: auto; padding: 24px 34px 60px; background: #f6f7f9; }
.esp-wrap { width: 100%; max-width: none; margin: 0; }

/* section scaffolding */
.esp-sec { margin-bottom: 22px; }
.esp-sec-title { font-size: 11.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.esp-sec-title .n { font-size: 12px; color: var(--ink-400); }
.esp-card { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); }
.esp-card-head { padding: 14px 18px; border-bottom: var(--hairline); display: flex; align-items: center; gap: 12px; }
.esp-card-title { font-size: 13.5px; font-weight: 700; color: var(--ink-900); }
.esp-card-sub { font-size: 11.5px; color: var(--ink-500); margin-top: 2px; }
.esp-card-body { padding: 16px 18px; }
.esp-card-foot { padding: 10px 18px; border-top: var(--hairline); background: var(--ink-50); display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 11.5px; color: var(--ink-500); }

/* landing action cards */
.esp-actions { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; }
.esp-action { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: 160ms; cursor: pointer; position: relative; overflow: hidden; }
.esp-action::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 3px; background: var(--a); }
.esp-action:hover { border-color: color-mix(in srgb, var(--a) 45%, var(--ink-200)); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.esp-action-icon { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; background: color-mix(in srgb, var(--a) 12%, var(--paper)); color: var(--a); border: 1px solid color-mix(in srgb, var(--a) 22%, transparent); }
.esp-action-title { font-size: 16px; font-weight: 750; color: var(--ink-900); letter-spacing: -0.02em; }
.esp-action-desc { font-size: 12.5px; color: var(--ink-600); line-height: 1.5; margin-top: 4px; }
.esp-req { display: flex; flex-direction: column; gap: 6px; }
.esp-req-label { font-size: 10px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-400); }
.esp-req-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--ink-700); }
.esp-req-item .icon { color: var(--a); }
.esp-flow { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.esp-flow span { font-size: 10.5px; font-weight: 650; color: var(--ink-500); background: var(--ink-100); border-radius: var(--r-full); padding: 2px 8px; white-space: nowrap; }
.esp-action-foot { margin-top: auto; padding-top: 4px; }

/* tables */
.esp-tablewrap { overflow-x: auto; }
.esp-table { width: 100%; border-collapse: collapse; }
.esp-table th, .esp-table td { white-space: nowrap; }
.esp-table thead th { background: var(--ink-50); font-size: 10px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); text-align: left; padding: 9px 12px; border-bottom: var(--hairline); }
.esp-table tbody td { padding: 10px 12px; border-bottom: var(--hairline); vertical-align: middle; font-size: 12.5px; color: var(--ink-700); }
.esp-table th:first-child, .esp-table td:first-child { padding-left: 18px; }
.esp-table th:last-child, .esp-table td:last-child { padding-right: 18px; }
.esp-table th[data-align="right"], .esp-table td[data-align="right"] { text-align: right; }
.esp-table tbody tr:hover { background: var(--ink-50); }
.esp-table tbody tr:last-child td { border-bottom: none; }
.esp-td-station { font-size: 13px; font-weight: 700; color: var(--ink-900); }
.esp-code { font-family: var(--font-mono); font-size: 9.5px; padding: 1px 4px; border-radius: var(--r-xs); background: var(--ink-100); color: var(--ink-500); font-weight: 600; margin-left: 6px; }
.esp-ver { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--ink-800); }

/* stepper bar */
.esp-stepbar { flex-shrink: 0; background: var(--paper); border-bottom: var(--hairline); padding: 12px 28px 14px; }
.esp-steps { display: flex; align-items: flex-start; gap: 0; }
.esp-step { flex: 1; display: flex; align-items: flex-start; gap: 9px; min-width: 0; position: relative; padding-right: 10px; cursor: pointer; }
.esp-step:last-child { flex: 0 0 auto; padding-right: 0; }
.esp-step-dot { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 800; flex-shrink: 0; border: 1.5px solid var(--ink-200); background: var(--paper); color: var(--ink-500); transition: 150ms; }
.esp-step[data-state="done"] .esp-step-dot { background: var(--accent); border-color: var(--accent); color: #fff; }
.esp-step[data-state="active"] .esp-step-dot { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: var(--shadow-focus); }
.esp-step-txt { min-width: 0; }
.esp-step-label { font-size: 12.5px; font-weight: 700; color: var(--ink-500); white-space: nowrap; }
.esp-step[data-state="done"] .esp-step-label, .esp-step[data-state="active"] .esp-step-label { color: var(--ink-900); }
.esp-step-sub { font-size: 10.5px; color: var(--ink-400); white-space: nowrap; }
.esp-step-line { position: absolute; left: 24px; right: 6px; top: 11.5px; height: 2px; background: var(--ink-200); border-radius: 2px; z-index: 0; }
.esp-step[data-state="done"] .esp-step-line { background: var(--accent); }
.esp-step > * { position: relative; z-index: 1; }
.esp-step:last-child .esp-step-line { display: none; }
.esp-step[data-locked="true"] { cursor: default; opacity: .75; }

/* wizard footer */
.esp-footer { flex-shrink: 0; background: var(--paper); border-top: var(--hairline); padding: 12px 28px; display: flex; align-items: center; gap: 12px; }
.esp-footer-note { font-size: 12px; color: var(--ink-500); }
.esp-footer-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }

/* two-column layouts */
.esp-2col { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,340px); gap: 18px; align-items: start; }
.esp-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
.esp-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }

/* station picker */
.esp-filters { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 10px; margin-top: 12px; }
.esp-stationlist { display: flex; flex-direction: column; }
.esp-stationrow { display: flex; align-items: center; gap: 12px; padding: 11px 18px; border-bottom: var(--hairline); cursor: pointer; transition: background 120ms; }
.esp-stationrow:hover { background: var(--ink-50); }
.esp-stationrow[data-sel="true"] { background: var(--accent-soft); }
.esp-stationrow:last-child { border-bottom: none; }
.esp-stationrow-main { flex: 1; min-width: 0; }
.esp-stationrow-meta { font-size: 11px; color: var(--ink-500); margin-top: 2px; }

/* summary card */
.esp-kv { display: grid; grid-template-columns: 132px 1fr; gap: 7px 12px; }
.esp-kv dt { font-size: 11.5px; color: var(--ink-500); }
.esp-kv dd { margin: 0; font-size: 12.5px; color: var(--ink-900); font-weight: 600; }

/* readiness */
.esp-ready-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 650; }
.esp-ready-status i { width: 7px; height: 7px; border-radius: 50%; display: block; flex-shrink: 0; }

/* scenario / option cards */
.esp-pick { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 16px; cursor: pointer; transition: 150ms; display: flex; flex-direction: column; gap: 10px; }
.esp-pick:hover { border-color: var(--ink-300); box-shadow: var(--shadow-sm); }
.esp-pick[data-sel="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), var(--shadow-md); background: color-mix(in srgb, var(--accent-soft) 45%, var(--paper)); }
.esp-pick-head { display: flex; align-items: flex-start; gap: 10px; }
.esp-pick-letter { width: 26px; height: 26px; border-radius: var(--r-sm); background: var(--ink-100); color: var(--ink-600); display: grid; place-items: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.esp-pick[data-sel="true"] .esp-pick-letter { background: var(--accent); color: #fff; }
.esp-pick-title { font-size: 13.5px; font-weight: 700; color: var(--ink-900); }
.esp-pick-desc { font-size: 12px; color: var(--ink-600); line-height: 1.5; }
.esp-pick-note { font-size: 11px; color: var(--ink-500); font-style: italic; }

/* input list */
.esp-inputrow { display: flex; align-items: center; gap: 12px; padding: 10px 18px; border-bottom: var(--hairline); }
.esp-inputrow:last-child { border-bottom: none; }
.esp-inputrow-main { flex: 1; min-width: 0; }
.esp-inputrow-label { font-size: 12.5px; font-weight: 650; color: var(--ink-900); display: flex; align-items: center; gap: 6px; }
.esp-inputrow-meta { font-size: 11px; color: var(--ink-500); margin-top: 1px; font-family: var(--font-mono); }
.esp-req-star { color: var(--danger); font-weight: 800; }

/* generation progress */
.esp-genwrap { max-width: 560px; margin: 40px auto; text-align: left; }
.esp-genstage { display: flex; align-items: center; gap: 11px; padding: 11px 0; border-bottom: var(--hairline); }
.esp-genstage:last-child { border-bottom: none; }
.esp-genstage-dot { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; border: 1.5px solid var(--ink-200); background: var(--paper); }
.esp-genstage[data-state="done"] .esp-genstage-dot { background: var(--success); border-color: var(--success); color: #fff; }
.esp-genstage[data-state="active"] .esp-genstage-dot { border-color: var(--accent); }
.esp-genstage-label { font-size: 13px; font-weight: 650; color: var(--ink-500); }
.esp-genstage[data-state="done"] .esp-genstage-label, .esp-genstage[data-state="active"] .esp-genstage-label { color: var(--ink-900); }
.esp-spin { width: 12px; height: 12px; border: 2px solid var(--accent); border-right-color: transparent; border-radius: 50%; animation: espSpin .7s linear infinite; }
@keyframes espSpin { to { transform: rotate(360deg); } }
.esp-progressbar { height: 6px; border-radius: 99px; background: var(--ink-100); overflow: hidden; margin-top: 18px; }
.esp-progressbar div { height: 100%; background: var(--accent); border-radius: 99px; transition: width 400ms ease; }

/* option cards */
.esp-opt { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: 160ms; }
.esp-opt:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.esp-opt[data-sel="true"] { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), var(--shadow-md); }
.esp-opt-thumb { height: 118px; background: linear-gradient(180deg, #FBFCFE, #F2F5F9); border-bottom: var(--hairline); position: relative; }
.esp-opt-badge { position: absolute; top: 10px; left: 10px; }
.esp-opt-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.esp-opt-name { font-size: 14.5px; font-weight: 750; color: var(--ink-900); display: flex; align-items: center; gap: 8px; }
.esp-opt-score { display: flex; align-items: baseline; gap: 6px; }
.esp-opt-scoreval { font-size: 26px; font-weight: 750; letter-spacing: -0.03em; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.esp-opt-metrics { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px 12px; }
.esp-metric { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 11.5px; }
.esp-metric span { color: var(--ink-500); }
.esp-metric b { color: var(--ink-900); font-weight: 700; font-variant-numeric: tabular-nums; }
.esp-opt-rationale { font-size: 11.5px; color: var(--ink-600); line-height: 1.5; border-top: var(--hairline); padding-top: 10px; }
.esp-opt-foot { padding: 10px 16px; border-top: var(--hairline); background: var(--ink-50); display: flex; gap: 8px; }

/* comparison table */
.esp-cmp td[data-best="true"] { background: var(--success-soft); color: var(--success-text); font-weight: 700; }

/* editor */
.esp-editor { display: grid; grid-template-columns: 232px minmax(0,1fr) 264px; height: 100%; min-height: 0; border: var(--hairline); border-radius: var(--r-lg); overflow: hidden; background: var(--paper); }
.esp-ed-panel { display: flex; flex-direction: column; min-height: 0; background: var(--paper); }
.esp-ed-panel + .esp-ed-panel, .esp-ed-centre + .esp-ed-panel { border-left: var(--hairline); }
.esp-ed-panel:first-child { border-right: var(--hairline); }
.esp-ed-ptitle { padding: 10px 14px; font-size: 10px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); border-bottom: var(--hairline); background: var(--ink-50); }
.esp-ed-scroll { flex: 1; overflow-y: auto; }
.esp-layer { display: flex; align-items: center; gap: 9px; padding: 8px 14px; font-size: 12px; color: var(--ink-700); cursor: pointer; border-bottom: 1px solid var(--ink-100); }
.esp-layer:hover { background: var(--ink-50); }
.esp-layer i { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.esp-layer-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.esp-layer-count { font-size: 10.5px; color: var(--ink-400); font-variant-numeric: tabular-nums; }
.esp-layer[data-off="true"] { color: var(--ink-400); }
.esp-layer[data-off="true"] i { opacity: .3; }
.esp-ed-centre { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.esp-canvas { flex: 1; min-height: 0; overflow: auto; background:
   linear-gradient(90deg, rgba(10,37,64,.05) 0 1px, transparent 1px 32px),
   linear-gradient(180deg, rgba(10,37,64,.05) 0 1px, transparent 1px 32px), #FCFDFE; }
.esp-toolbar { flex-shrink: 0; border-top: var(--hairline); background: var(--paper); padding: 7px 10px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.esp-tool { width: 32px; height: 30px; border-radius: var(--r-sm); border: 1px solid transparent; background: transparent; color: var(--ink-600); cursor: pointer; display: grid; place-items: center; }
.esp-tool:hover { background: var(--ink-100); color: var(--ink-900); }
.esp-tool[data-active="true"] { background: var(--accent); color: #fff; }
.esp-tool-sep { width: 1px; height: 18px; background: var(--ink-200); margin: 0 4px; }
.esp-prop { padding: 9px 14px; border-bottom: 1px solid var(--ink-100); display: flex; align-items: baseline; justify-content: space-between; gap: 10px; font-size: 12px; }
.esp-prop span { color: var(--ink-500); }
.esp-prop b { color: var(--ink-900); font-weight: 650; text-align: right; }

/* validation */
.esp-valgrid { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 10px; }
.esp-valtile { border: var(--hairline); border-radius: var(--r-md); padding: 12px 14px; background: var(--paper); }
.esp-valtile-n { font-size: 22px; font-weight: 750; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.esp-valtile-l { font-size: 11px; color: var(--ink-500); margin-top: 2px; }
.esp-valrow { display: flex; align-items: flex-start; gap: 12px; padding: 12px 18px; border-bottom: var(--hairline); cursor: pointer; }
.esp-valrow:hover { background: var(--ink-50); }
.esp-valrow:last-child { border-bottom: none; }
.esp-valrow[data-open="true"] { background: var(--ink-50); }
.esp-valsev { width: 22px; height: 22px; border-radius: var(--r-sm); display: grid; place-items: center; flex-shrink: 0; margin-top: 1px; }
.esp-valsev[data-sev="violation"] { background: var(--danger-soft); color: var(--danger-text); }
.esp-valsev[data-sev="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.esp-valrow-main { flex: 1; min-width: 0; }
.esp-valrow-title { font-size: 12.5px; font-weight: 650; color: var(--ink-900); }
.esp-valrow-meta { font-size: 11px; color: var(--ink-500); margin-top: 2px; }
.esp-valdetail { padding: 12px 18px 14px 52px; background: var(--ink-50); border-bottom: var(--hairline); }
.esp-valmeasure { display: flex; gap: 22px; flex-wrap: wrap; margin-bottom: 10px; }
.esp-valmeasure div { font-size: 11.5px; color: var(--ink-500); }
.esp-valmeasure b { display: block; font-size: 14px; font-weight: 750; color: var(--ink-900); font-variant-numeric: tabular-nums; margin-top: 2px; }
.esp-valmeasure b[data-bad="true"] { color: var(--danger-text); }

/* checklist */
.esp-check { display: flex; align-items: center; gap: 10px; padding: 9px 18px; border-bottom: var(--hairline); font-size: 12.5px; }
.esp-check:last-child { border-bottom: none; }
.esp-check-box { width: 18px; height: 18px; border-radius: var(--r-xs); display: grid; place-items: center; flex-shrink: 0; border: 1.5px solid var(--ink-300); background: var(--paper); }
.esp-check[data-done="true"] .esp-check-box { background: var(--success); border-color: var(--success); color: #fff; }
.esp-check[data-done="false"] { color: var(--ink-600); }
.esp-check-label { flex: 1; }

/* misc */
.esp-note { display: flex; gap: 10px; padding: 12px 14px; border-radius: var(--r-md); font-size: 12.5px; line-height: 1.5; }
.esp-note[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.esp-note[data-tone="danger"] { background: var(--danger-soft); color: var(--danger-text); }
.esp-note[data-tone="info"] { background: var(--info-soft); color: var(--info-text); }
.esp-note[data-tone="success"] { background: var(--success-soft); color: var(--success-text); }
.esp-note .icon { flex-shrink: 0; margin-top: 1px; }
.esp-empty { padding: 40px; text-align: center; color: var(--ink-500); font-size: 13px; border: 1px dashed var(--ink-300); border-radius: var(--r-lg); background: var(--paper); }
.esp-chiprow { display: flex; flex-wrap: wrap; gap: 7px; }
.esp-togglechip { padding: 6px 12px; border-radius: var(--r-full); border: var(--hairline); background: var(--paper); font: inherit; font-size: 12px; font-weight: 600; color: var(--ink-700); cursor: pointer; }
.esp-togglechip:hover { border-color: var(--ink-300); }
.esp-togglechip[data-on="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }

/* single-page Update ESP workflow */
.esp-update-page { width: 100%; }
.esp-update-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.esp-update-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 18px; margin-top: 18px; border-top: var(--hairline); }
.esp-update-file { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px dashed var(--ink-300); border-radius: var(--r-md); background: var(--ink-50); }
.esp-update-file input { max-width: 260px; }
.esp-update-uploadbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 12px; padding: 12px 16px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); }
@media (max-width: 760px) { .esp-update-grid { grid-template-columns: 1fr; } .esp-update-actions { align-items: stretch; flex-direction: column; } }

@media (max-width: 1240px) {
  .esp-2col { grid-template-columns: minmax(0,1fr); }
  .esp-filters { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .esp-valgrid { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .esp-editor { grid-template-columns: 200px minmax(0,1fr); }
  .esp-editor > .esp-ed-panel:last-child { display: none; }
}
@media (max-width: 900px) {
  .esp-actions, .esp-grid-2, .esp-grid-3 { grid-template-columns: minmax(0,1fr); }
}
`;
const StatusChip = ({ status }) => {
  const meta = ESP_STATUS[status] || { tone: "neutral" };
  return /* @__PURE__ */ React.createElement(Chip, { tone: meta.tone, dot: !meta.pulse, pulse: meta.pulse }, status);
};
const Card = ({ title, sub, right, foot, children, bodyStyle }) => /* @__PURE__ */ React.createElement("div", { className: "esp-card" }, (title || right) && /* @__PURE__ */ React.createElement("div", { className: "esp-card-head" }, title && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "esp-card-title" }, title), sub && /* @__PURE__ */ React.createElement("div", { className: "esp-card-sub" }, sub)), right && /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" } }, right)), children != null && /* @__PURE__ */ React.createElement("div", { className: "esp-card-body", style: bodyStyle }, children), foot && /* @__PURE__ */ React.createElement("div", { className: "esp-card-foot" }, foot));
const Note = ({ tone = "info", icon = "info", children }) => /* @__PURE__ */ React.createElement("div", { className: "esp-note", "data-tone": tone }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 15 }), /* @__PURE__ */ React.createElement("div", null, children));
const SecTitle = ({ children, n }) => /* @__PURE__ */ React.createElement("div", { className: "esp-sec-title" }, children, n != null && /* @__PURE__ */ React.createElement("span", { className: "n" }, n));
const TONE_COLOR = { success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)", info: "var(--info)", neutral: "var(--ink-400)" };
const YardDrawing = ({ layers, width = 1680 }) => {
  const on = (id) => {
    var _a;
    return (_a = layers.find((l) => l.id === id)) == null ? void 0 : _a.on;
  };
  const tracks = [
    { y: 132, label: "Main line 1", w: 2 },
    { y: 168, label: "Main line 2", w: 2 },
    { y: 208, label: "Loop line 1", w: 1.4 },
    { y: 248, label: "Loop line 2", w: 1.4 }
  ];
  return /* @__PURE__ */ React.createElement("svg", { width, height: 330, style: { display: "block" } }, on("prev") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: 420, y: 180, width: 520, height: 22, fill: "#E8EDF4", stroke: "#94A3B8", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: 430, y: 195, fontSize: "10", fill: "#475569", fontWeight: "600" }, "PLATFORM 1 \u2014 540 m"), /* @__PURE__ */ React.createElement("rect", { x: 420, y: 258, width: 430, height: 22, fill: "#E8EDF4", stroke: "#94A3B8", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: 430, y: 273, fontSize: "10", fill: "#475569", fontWeight: "600" }, "PLATFORM 2 \u2014 430 m")), on("prev") && tracks.map((t) => /* @__PURE__ */ React.createElement("g", { key: t.y }, /* @__PURE__ */ React.createElement("line", { x1: 40, y1: t.y, x2: width - 40, y2: t.y, stroke: "#0E1B2C", strokeWidth: t.w }), /* @__PURE__ */ React.createElement("text", { x: 44, y: t.y - 6, fontSize: "9.5", fill: "#64748B", fontWeight: "600" }, t.label))), on("prev") && [220, 330, 1180, 1320].map((x, i) => /* @__PURE__ */ React.createElement("g", { key: x }, /* @__PURE__ */ React.createElement("path", { d: `M${x},132 L${x + 90},208`, stroke: "#0E1B2C", strokeWidth: "1.4", fill: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: x, cy: 132, r: 3, fill: "#0E1B2C" }), /* @__PURE__ */ React.createElement("text", { x: x - 4, y: 122, fontSize: "9", fill: "#475569", fontWeight: "700" }, `T${11 + i}`))), on("proposed") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: 300, y1: 288, x2: 1400, y2: 288, stroke: "#DC2626", strokeWidth: "2", strokeDasharray: "7 4" }), /* @__PURE__ */ React.createElement("text", { x: 306, y: 282, fontSize: "9.5", fill: "#DC2626", fontWeight: "700" }, "PROPOSED LOOP LINE 3"), /* @__PURE__ */ React.createElement("path", { d: "M1320,248 L1410,288", stroke: "#DC2626", strokeWidth: "1.6", fill: "none", strokeDasharray: "7 4" }), /* @__PURE__ */ React.createElement("rect", { x: 950, y: 258, width: 140, height: 22, fill: "none", stroke: "#DC2626", strokeWidth: "1.4", strokeDasharray: "5 3" }), /* @__PURE__ */ React.createElement("text", { x: 958, y: 273, fontSize: "9.5", fill: "#DC2626", fontWeight: "700" }, "PF-2 EXTENSION")), on("sod") && [{ x: 412, y: 190 }, { x: 1010, y: 268 }, { x: 1320, y: 246 }].map((v, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: v.x, cy: v.y, r: 11, fill: "none", stroke: "#BE123C", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("text", { x: v.x - 3, y: v.y + 4, fontSize: "10", fill: "#BE123C", fontWeight: "800" }, "!"))), on("constraints") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: 760, y1: 96, x2: 760, y2: 310, stroke: "#B45309", strokeWidth: "1.4", strokeDasharray: "4 4" }), /* @__PURE__ */ React.createElement("text", { x: 766, y: 108, fontSize: "9.5", fill: "#B45309", fontWeight: "700" }, "LC GATE 412/7")), on("gis") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: 40, y1: 306, x2: width - 40, y2: 306, stroke: "#0D9488", strokeWidth: "1", strokeDasharray: "2 4" }), /* @__PURE__ */ React.createElement("text", { x: 44, y: 318, fontSize: "9", fill: "#0D9488", fontWeight: "600" }, "GIS CENTRELINE REFERENCE")), on("notes") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: 540, y: 60, width: 186, height: 26, rx: 4, fill: "#FFF8E1", stroke: "#E5C97A" }), /* @__PURE__ */ React.createElement("text", { x: 548, y: 77, fontSize: "10", fill: "#7A5C11" }, "Confirm gate interlocking with S&T")), /* @__PURE__ */ React.createElement("line", { x1: 40, y1: 20, x2: width - 40, y2: 20, stroke: "#CBD3DC", strokeWidth: "1" }), Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: 40 + i * 136, y1: 16, x2: 40 + i * 136, y2: 24, stroke: "#94A3B8", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: 40 + i * 136, y: 38, fontSize: "9", fill: "#94A3B8", textAnchor: "middle" }, `41${1 + Math.floor(i / 4)}/${i % 4 * 2 + 1}`))));
};
const ActionCard = ({ colour, icon, title, desc, cta, onClick }) => /* @__PURE__ */ React.createElement("div", { className: "esp-action", style: { "--a": colour }, onClick }, /* @__PURE__ */ React.createElement("div", { className: "esp-action-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "esp-action-title" }, title), /* @__PURE__ */ React.createElement("div", { className: "esp-action-desc" }, desc)), /* @__PURE__ */ React.createElement("div", { className: "esp-action-foot" }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", trailingIcon: "arrow_right", onClick: (e) => {
  e.stopPropagation();
  onClick();
} }, cta)));
const EspLanding = ({ onStart, onOpenFiles }) => /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement("div", { className: "esp-actions" }, /* @__PURE__ */ React.createElement(
  ActionCard,
  {
    colour: "#3737C8",
    icon: "plus",
    title: "Create New ESP",
    desc: "For a new station, a new yard, or a station that has no approved ESP yet.",
    cta: "Create ESP",
    onClick: () => onStart("create")
  }
), /* @__PURE__ */ React.createElement(
  ActionCard,
  {
    colour: "#0D9488",
    icon: "edit",
    title: "Update Existing ESP",
    desc: "For yard remodelling or modification of an existing approved ESP.",
    cta: "Update ESP",
    onClick: () => onStart("update")
  }
))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, { n: `${RECENT_DESIGNS.length} drafts` }, "Recent ESP Designs"), /* @__PURE__ */ React.createElement(
  Card,
  {
    foot: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, "Showing ", RECENT_DESIGNS.length, " most recent designs across your scope"), /* @__PURE__ */ React.createElement("button", { style: { border: "none", background: "none", font: "inherit", fontWeight: 700, color: "var(--accent-text)", cursor: "pointer" }, onClick: onOpenFiles }, "Open file workspace \u2192")),
    bodyStyle: { padding: 0 }
  },
  /* @__PURE__ */ React.createElement("div", { className: "esp-tablewrap" }, /* @__PURE__ */ React.createElement("table", { className: "esp-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Station"), /* @__PURE__ */ React.createElement("th", null, "Version"), /* @__PURE__ */ React.createElement("th", null, "Drawing Number"), /* @__PURE__ */ React.createElement("th", null, "State"), /* @__PURE__ */ React.createElement("th", null, "Updated By"), /* @__PURE__ */ React.createElement("th", null, "Last Updated"), /* @__PURE__ */ React.createElement("th", { "data-align": "right" }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, RECENT_DESIGNS.map((d) => /* @__PURE__ */ React.createElement("tr", { key: d.station + d.current }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "esp-td-station" }, d.station), /* @__PURE__ */ React.createElement("span", { className: "esp-code" }, d.code)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "esp-ver" }, d.current)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "esp-ver" }, `${d.code}/ESP/${d.current.replace(/\s+/g, "-").toUpperCase()}`)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(StatusChip, { status: d.statusKey })), /* @__PURE__ */ React.createElement("td", null, d.by), /* @__PURE__ */ React.createElement("td", null, d.updated), /* @__PURE__ */ React.createElement("td", { "data-align": "right" }, /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary" }, "View")))))))
)));
const StepStation = ({ station, setStation }) => {
  const [q, setQ] = useStateEsp("");
  const list = STATIONS.filter((s) => !q.trim() || s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Select station"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Field, { label: "Search by station name or code" }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "e.g. Tarur or TRR", leadingIcon: "search" })), /* @__PURE__ */ React.createElement("div", { className: "esp-filters" }, /* @__PURE__ */ React.createElement(Field, { label: "Zone" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "SCR \u2014 South Central Railway"))), /* @__PURE__ */ React.createElement(Field, { label: "Division" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "All divisions"), /* @__PURE__ */ React.createElement("option", null, "Vijayawada"), /* @__PURE__ */ React.createElement("option", null, "Guntur"))), /* @__PURE__ */ React.createElement(Field, { label: "Section" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "All sections"))), /* @__PURE__ */ React.createElement(Field, { label: "Category" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "All categories"), /* @__PURE__ */ React.createElement("option", null, "NSG-4"), /* @__PURE__ */ React.createElement("option", null, "NSG-5"), /* @__PURE__ */ React.createElement("option", null, "NSG-6"))), /* @__PURE__ */ React.createElement(Field, { label: "Status" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "All"), /* @__PURE__ */ React.createElement("option", null, "Operational"), /* @__PURE__ */ React.createElement("option", null, "Proposed")))))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(Card, { title: "Matching stations", sub: `${list.length} of ${STATIONS.length} in your scope`, bodyStyle: { padding: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "esp-stationlist" }, list.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.code, className: "esp-stationrow", "data-sel": (station == null ? void 0 : station.code) === s.code, onClick: () => setStation(s) }, /* @__PURE__ */ React.createElement(Radio, { checked: (station == null ? void 0 : station.code) === s.code }), /* @__PURE__ */ React.createElement("div", { className: "esp-stationrow-main" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "esp-td-station" }, s.name), /* @__PURE__ */ React.createElement("span", { className: "esp-code" }, s.code)), /* @__PURE__ */ React.createElement("div", { className: "esp-stationrow-meta" }, s.zone, " \xB7 ", s.division, " division \xB7 ", s.section, " \xB7 ", s.category)), /* @__PURE__ */ React.createElement(Chip, { tone: s.status === "Operational" ? "success" : "info", dot: true }, s.status))), list.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "esp-empty" }, "No station matches \u201C", q, "\u201D.")))), station && /* @__PURE__ */ React.createElement("div", { className: "esp-2col" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec", style: { marginBottom: 0 } }, /* @__PURE__ */ React.createElement(SecTitle, null, "Data readiness"), /* @__PURE__ */ React.createElement(Card, { sub: "What already exists for this station \u2014 you should not need to leave the module to find out.", bodyStyle: { padding: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "esp-tablewrap" }, /* @__PURE__ */ React.createElement("table", { className: "esp-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Dataset"), /* @__PURE__ */ React.createElement("th", null, "Status"), /* @__PURE__ */ React.createElement("th", { "data-align": "right" }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, station.readiness.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.set }, /* @__PURE__ */ React.createElement("td", { style: { fontWeight: 650, color: "var(--ink-900)" } }, r.set), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "esp-ready-status", style: { color: `var(--${r.tone}-text)` } }, /* @__PURE__ */ React.createElement("i", { style: { background: TONE_COLOR[r.tone] } }), r.status)), /* @__PURE__ */ React.createElement("td", { "data-align": "right" }, /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "ghost" }, r.action))))))))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec", style: { marginBottom: 0 } }, /* @__PURE__ */ React.createElement(SecTitle, null, "Station summary"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("dl", { className: "esp-kv" }, /* @__PURE__ */ React.createElement("dt", null, "Station"), /* @__PURE__ */ React.createElement("dd", null, station.name, " (", station.code, ")"), /* @__PURE__ */ React.createElement("dt", null, "Zone / Division"), /* @__PURE__ */ React.createElement("dd", null, station.zone, " \xB7 ", station.division), /* @__PURE__ */ React.createElement("dt", null, "Section"), /* @__PURE__ */ React.createElement("dd", null, station.section), /* @__PURE__ */ React.createElement("dt", null, "Adjacent stations"), /* @__PURE__ */ React.createElement("dd", null, station.adjacent.join(", ")), /* @__PURE__ */ React.createElement("dt", null, "ESP versions"), /* @__PURE__ */ React.createElement("dd", null, station.espVersions.length ? station.espVersions.join(", ") : "None"), /* @__PURE__ */ React.createElement("dt", null, "Latest approved ESP"), /* @__PURE__ */ React.createElement("dd", null, station.latest), /* @__PURE__ */ React.createElement("dt", null, "Existing SIP"), /* @__PURE__ */ React.createElement("dd", null, station.sip), /* @__PURE__ */ React.createElement("dt", null, "Survey / GIS data"), /* @__PURE__ */ React.createElement("dd", null, station.readiness.find((r) => r.set === "GIS data").status))))));
};
const StepBaseData = ({ flow, station, scenario, setScenario, prevEsp, setPrevEsp, onGoLibrary }) => {
  const hasPrev = station && station.espVersions.length > 0;
  if (flow === "create") {
    return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Select creation scenario"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-500)", marginBottom: 12 } }, "This controls which inputs and fields the rest of the workflow asks for."), /* @__PURE__ */ React.createElement("div", { className: "esp-grid-3" }, CREATE_SCENARIOS.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, className: "esp-pick", "data-sel": scenario === s.id, onClick: () => setScenario(s.id) }, /* @__PURE__ */ React.createElement("div", { className: "esp-pick-head" }, /* @__PURE__ */ React.createElement("div", { className: "esp-pick-letter" }, s.letter), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "esp-pick-title" }, s.title)), /* @__PURE__ */ React.createElement(Icon, { name: s.icon, size: 16, style: { marginLeft: "auto", color: "var(--ink-400)" } })), /* @__PURE__ */ React.createElement("div", { className: "esp-pick-desc" }, s.desc), /* @__PURE__ */ React.createElement("div", { className: "esp-req" }, /* @__PURE__ */ React.createElement("div", { className: "esp-req-label" }, "Provides"), s.inputs.map((i) => /* @__PURE__ */ React.createElement("div", { className: "esp-req-item", key: i, style: { "--a": "var(--accent)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 }), i))), /* @__PURE__ */ React.createElement("div", { className: "esp-pick-note" }, s.optional))))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Input source"), /* @__PURE__ */ React.createElement("div", { className: "esp-grid-3" }, INPUT_SOURCES.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.id }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Icon, { name: s.icon, size: 17, style: { color: "var(--accent)", marginTop: 1 } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-900)" } }, s.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-500)", marginTop: 3, lineHeight: 1.5 } }, s.desc))))))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Select previous ESP"), !hasPrev ? /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(Note, { tone: "danger", icon: "alert" }, /* @__PURE__ */ React.createElement("b", null, "No validated ESP is available for this station."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4 } }, "Upload the previous ESP, extract its data and complete PIM validation. Your station, Update mode, draft id and current step are all preserved \u2014 you will come straight back here.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "book", onClick: onGoLibrary }, "Go to Station Digital Library"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "upload" }, "Upload previous ESP"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "layers" }, "Extract data"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "check_circle" }, "Complete PIM validation"))) : /* @__PURE__ */ React.createElement(Card, { sub: `Only ESPs associated with ${station.name} (${station.code}) are listed.`, bodyStyle: { padding: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "esp-stationlist" }, PREV_ESPS.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.ver, className: "esp-stationrow", "data-sel": prevEsp === e.ver, onClick: () => setPrevEsp(e.ver) }, /* @__PURE__ */ React.createElement(Radio, { checked: prevEsp === e.ver }), /* @__PURE__ */ React.createElement("div", { className: "esp-stationrow-main" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "esp-td-station" }, e.ver), /* @__PURE__ */ React.createElement(Chip, { tone: e.status === "Approved" ? "success" : "neutral", dot: true }, e.status), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, color: "var(--ink-500)" } }, e.date)), /* @__PURE__ */ React.createElement("div", { className: "esp-stationrow-meta" }, e.format, " \xB7 created by ", e.by, " \xB7 approved by ", e.approvedBy, " \xB7 ", e.sip, " \xB7 ", e.validated))))))));
};
const InputStateChip = ({ state, meta }) => {
  if (state === "library") return /* @__PURE__ */ React.createElement(Chip, { tone: "success", dot: true }, "In Digital Library");
  if (state === "partial") return /* @__PURE__ */ React.createElement(Chip, { tone: "warning", dot: true }, "Partial");
  if (state === "missing") return /* @__PURE__ */ React.createElement(Chip, { tone: "danger", dot: true }, "Missing");
  return /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Not provided");
};
const StepDesignInputs = ({ flow, changeTypes, toggleChange, requirements, setRequirements }) => {
  if (flow === "create") {
    return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Primary inputs"), /* @__PURE__ */ React.createElement(Card, { sub: "Pick documents already validated in the Digital Library, or upload new ones.", bodyStyle: { padding: 0 } }, PRIMARY_INPUTS.map((p) => /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow", key: p.id }, /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-main" }, /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-label" }, p.label, p.req && /* @__PURE__ */ React.createElement("span", { className: "esp-req-star" }, "*")), p.meta && /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-meta" }, p.meta)), /* @__PURE__ */ React.createElement(InputStateChip, { state: p.state }), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: p.state === "library" ? "ghost" : "secondary" }, p.state === "library" ? "Replace" : p.state === "partial" ? "Complete" : "Add")))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(Note, { tone: "info", icon: "info" }, "Uploading a new PDF or AutoCAD file runs ", /* @__PURE__ */ React.createElement("b", null, "upload \u2192 extract assets \u2192 PIM validation \u2192 save to Digital Library"), ", then returns you to this step. Workflow state is preserved throughout."))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Design requirements"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "esp-grid-2" }, /* @__PURE__ */ React.createElement(Field, { label: "Number of proposed lines", required: true }, /* @__PURE__ */ React.createElement(TextInput, { value: requirements.lines, onChange: (e) => setRequirements({ ...requirements, lines: e.target.value }) })), /* @__PURE__ */ React.createElement(Field, { label: "Proposed platforms" }, /* @__PURE__ */ React.createElement(TextInput, { value: requirements.platforms, onChange: (e) => setRequirements({ ...requirements, platforms: e.target.value }) })), /* @__PURE__ */ React.createElement(Field, { label: "Proposed turnouts" }, /* @__PURE__ */ React.createElement(TextInput, { value: requirements.turnouts, onChange: (e) => setRequirements({ ...requirements, turnouts: e.target.value }) })), /* @__PURE__ */ React.createElement(Field, { label: "Available land area" }, /* @__PURE__ */ React.createElement(TextInput, { value: requirements.land, onChange: (e) => setRequirements({ ...requirements, land: e.target.value }) })), /* @__PURE__ */ React.createElement(Field, { label: "Adjacent station connection", required: true }, /* @__PURE__ */ React.createElement(Select, { value: requirements.adjacent, onChange: (e) => setRequirements({ ...requirements, adjacent: e.target.value }) }, /* @__PURE__ */ React.createElement("option", null, "Both ends"), /* @__PURE__ */ React.createElement("option", null, "Up end only"), /* @__PURE__ */ React.createElement("option", null, "Down end only"))), /* @__PURE__ */ React.createElement(Field, { label: "Required connectivity" }, /* @__PURE__ */ React.createElement(Select, { value: requirements.connectivity, onChange: (e) => setRequirements({ ...requirements, connectivity: e.target.value }) }, /* @__PURE__ */ React.createElement("option", null, "Full yard connectivity"), /* @__PURE__ */ React.createElement("option", null, "Partial connectivity")))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Field, { label: "Line types" }, /* @__PURE__ */ React.createElement("div", { className: "esp-chiprow" }, LINE_TYPES.map((t) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t,
        className: "esp-togglechip",
        "data-on": requirements.lineTypes.includes(t),
        onClick: () => setRequirements({
          ...requirements,
          lineTypes: requirements.lineTypes.includes(t) ? requirements.lineTypes.filter((x) => x !== t) : [...requirements.lineTypes, t]
        })
      },
      t
    ))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 }, className: "esp-grid-2" }, /* @__PURE__ */ React.createElement(Field, { label: "Operational requirements" }, /* @__PURE__ */ React.createElement(Textarea, { rows: 3, value: requirements.ops, onChange: (e) => setRequirements({ ...requirements, ops: e.target.value }) })), /* @__PURE__ */ React.createElement(Field, { label: "Project constraints / zone-specific requirements" }, /* @__PURE__ */ React.createElement(Textarea, { rows: 3, value: requirements.constraints, onChange: (e) => setRequirements({ ...requirements, constraints: e.target.value }) }))))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "How are the changes provided?"), /* @__PURE__ */ React.createElement("div", { className: "esp-grid-3" }, [
    { icon: "file", t: "Key plan" },
    { icon: "edit", t: "Conceptual drawing" },
    { icon: "ruler", t: "Revised survey drawing" },
    { icon: "file_check", t: "Contractor drawing" },
    { icon: "book", t: "Written requirements" },
    { icon: "cursor", t: "Draw directly in editor" }
  ].map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.t }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Icon, { name: s.icon, size: 16, style: { color: "var(--accent)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, fontWeight: 650, color: "var(--ink-900)" } }, s.t)))))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, { n: `${changeTypes.length} selected` }, "Change type"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "esp-chiprow" }, CHANGE_TYPES.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, className: "esp-togglechip", "data-on": changeTypes.includes(c), onClick: () => toggleChange(c) }, c))))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Intervention area"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { className: "esp-grid-2" }, /* @__PURE__ */ React.createElement(Field, { label: "Affected tracks" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "Loop line 1, Loop line 2"))), /* @__PURE__ */ React.createElement(Field, { label: "Affected assets" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "Turnout 14A, Platform 2"))), /* @__PURE__ */ React.createElement(Field, { label: "From chainage" }, /* @__PURE__ */ React.createElement(TextInput, { defaultValue: "412/1" })), /* @__PURE__ */ React.createElement(Field, { label: "To chainage" }, /* @__PURE__ */ React.createElement(TextInput, { defaultValue: "413/4" }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Field, { label: "Change description", help: "Describe the remodelling intent for the reviewer." }, /* @__PURE__ */ React.createElement(Textarea, { rows: 3, defaultValue: "Provide a third loop line on the down side and extend Platform 2 to 600 m to accommodate 24-coach rakes." }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "select_rect" }, "Mark area on previous ESP"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "upload" }, "Attach supporting document")))));
};
const READINESS_ISSUES = [
  { tone: "danger", text: "Key plan is a mandatory input and has not been provided." },
  { tone: "warning", text: "Constraints data is only partially available (3 of 5 categories)." },
  { tone: "warning", text: "Extracted assets for the previous ESP require PIM re-validation." }
];
const StepGenerate = ({ flow, station, scenario, generating, progress, onGenerate }) => {
  if (generating) {
    const pct = Math.round((progress + 1) / GEN_STAGES.length * 100);
    return /* @__PURE__ */ React.createElement("div", { className: "esp-genwrap" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 750, color: "var(--ink-900)" } }, "Generating ESP options"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-500)", marginTop: 4, marginBottom: 16 } }, station == null ? void 0 : station.name, " (", station == null ? void 0 : station.code, ") \xB7 ", flow === "create" ? "Create" : "Update", " ESP"), GEN_STAGES.map((s, i) => {
      const state = i < progress ? "done" : i === progress ? "active" : "pending";
      return /* @__PURE__ */ React.createElement("div", { className: "esp-genstage", key: s, "data-state": state }, /* @__PURE__ */ React.createElement("div", { className: "esp-genstage-dot" }, state === "done" ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 }) : state === "active" ? /* @__PURE__ */ React.createElement("span", { className: "esp-spin" }) : null), /* @__PURE__ */ React.createElement("div", { className: "esp-genstage-label" }, s));
    }), /* @__PURE__ */ React.createElement("div", { className: "esp-progressbar" }, /* @__PURE__ */ React.createElement("div", { style: { width: `${pct}%` } })));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Review inputs before generation"), /* @__PURE__ */ React.createElement("div", { className: "esp-2col" }, /* @__PURE__ */ React.createElement(Card, { title: "Consolidated readiness", bodyStyle: { padding: 0 } }, [
    { k: "Station information", v: `${station == null ? void 0 : station.name} (${station == null ? void 0 : station.code}) \xB7 ${station == null ? void 0 : station.division} division` },
    { k: "Selected source documents", v: "6 documents \xB7 5 validated, 1 partial" },
    { k: "Extracted and validated assets", v: "412 assets \xB7 PIM validated 14 Aug 2026" },
    { k: "Proposed design requirements", v: flow === "create" ? "4 lines \xB7 2 platforms \xB7 6 turnouts" : "3 change types \xB7 CH 412/1\u2013413/4" },
    { k: "GIS / survey information", v: "Total Station + GIS available" },
    { k: "Cost and physical constraints", v: "Cost data not provided \xB7 constraints partial" },
    { k: "Applicable zone template", v: "SCR yard template v4" },
    { k: "Applicable S-O-D and engineering rules", v: "IRSOD 2024 + SCR zone rules 2026.2" }
  ].map((r) => /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow", key: r.k }, /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-main" }, /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-label" }, r.k), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 } }, r.v)), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "ghost" }, "View")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Card, { title: "Readiness validation", sub: `${READINESS_ISSUES.length} items need attention` }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, READINESS_ISSUES.map((i) => /* @__PURE__ */ React.createElement(Note, { key: i.text, tone: i.tone, icon: i.tone === "danger" ? "alert" : "alert_tri" }, i.text))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "spark", onClick: onGenerate, style: { width: "100%", justifyContent: "center" } }, "Generate ESP Options"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-400)", marginTop: 8, textAlign: "center" } }, "Generation proceeds with warnings, but not with missing mandatory inputs.")))))));
};
const OptionThumb = ({ id }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 300 118", width: "100%", height: "118", preserveAspectRatio: "none" }, /* @__PURE__ */ React.createElement("rect", { width: "300", height: "118", fill: "none" }), [38, 52, 66, 80].slice(0, id === 3 ? 3 : 4).map((y, i) => /* @__PURE__ */ React.createElement("line", { key: y, x1: "16", y1: y, x2: "284", y2: y, stroke: i < 2 ? "#0E1B2C" : "#94A3B8", strokeWidth: i < 2 ? 1.6 : 1.1 })), id !== 3 && /* @__PURE__ */ React.createElement("line", { x1: "60", y1: "94", x2: "240", y2: "94", stroke: "#DC2626", strokeWidth: "1.4", strokeDasharray: "5 3" }), id === 2 && /* @__PURE__ */ React.createElement("line", { x1: "60", y1: "106", x2: "240", y2: "106", stroke: "#DC2626", strokeWidth: "1.4", strokeDasharray: "5 3" }), /* @__PURE__ */ React.createElement("rect", { x: "90", y: "56", width: "120", height: "8", fill: "#E8EDF4", stroke: "#94A3B8", strokeWidth: "0.8" }), [46, 96, 210, 250].slice(0, id === 3 ? 2 : 4).map((x) => /* @__PURE__ */ React.createElement("path", { key: x, d: `M${x},38 L${x + 26},66`, stroke: "#0E1B2C", strokeWidth: "1.1", fill: "none" })));
const StepCompare = ({ selected, setSelected, onOpenEditor, onRegenerate }) => {
  const [mode, setMode] = useStateEsp("cards");
  const best = (row) => {
    if (!row.better) return null;
    const vals = OPTIONS.map((o) => o[row.key]);
    const nums = vals.map((v) => typeof v === "number" ? v : NaN);
    if (nums.some(isNaN)) return null;
    return row.better === "high" ? Math.max(...nums) : Math.min(...nums);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SecTitle, { n: "3 feasible options" }, "ESP options"), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(PillTabs, { items: [{ id: "cards", label: "Cards" }, { id: "compare", label: "Side by side" }], active: mode, onChange: setMode }), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary", leadingIcon: "refresh", onClick: onRegenerate }, "Regenerate"))), mode === "cards" ? /* @__PURE__ */ React.createElement("div", { className: "esp-grid-3" }, OPTIONS.map((o) => /* @__PURE__ */ React.createElement("div", { key: o.id, className: "esp-opt", "data-sel": selected === o.id, onClick: () => setSelected(o.id) }, /* @__PURE__ */ React.createElement("div", { className: "esp-opt-thumb" }, /* @__PURE__ */ React.createElement(OptionThumb, { id: o.id }), o.recommended && /* @__PURE__ */ React.createElement("div", { className: "esp-opt-badge" }, /* @__PURE__ */ React.createElement(Chip, { tone: "accent", dot: true }, "Recommended"))), /* @__PURE__ */ React.createElement("div", { className: "esp-opt-body" }, /* @__PURE__ */ React.createElement("div", { className: "esp-opt-name" }, o.name, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, o.tag)), /* @__PURE__ */ React.createElement("div", { className: "esp-opt-score" }, /* @__PURE__ */ React.createElement("span", { className: "esp-opt-scoreval" }, o.score), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, color: "var(--ink-500)" } }, "compliance score")), /* @__PURE__ */ React.createElement("div", { className: "esp-opt-metrics" }, /* @__PURE__ */ React.createElement("div", { className: "esp-metric" }, /* @__PURE__ */ React.createElement("span", null, "S-O-D violations"), /* @__PURE__ */ React.createElement("b", { style: { color: o.violations ? "var(--danger-text)" : "var(--success-text)" } }, o.violations)), /* @__PURE__ */ React.createElement("div", { className: "esp-metric" }, /* @__PURE__ */ React.createElement("span", null, "Warnings"), /* @__PURE__ */ React.createElement("b", null, o.warnings)), /* @__PURE__ */ React.createElement("div", { className: "esp-metric" }, /* @__PURE__ */ React.createElement("span", null, "Land use"), /* @__PURE__ */ React.createElement("b", null, o.land)), /* @__PURE__ */ React.createElement("div", { className: "esp-metric" }, /* @__PURE__ */ React.createElement("span", null, "New turnouts"), /* @__PURE__ */ React.createElement("b", null, o.turnouts)), /* @__PURE__ */ React.createElement("div", { className: "esp-metric" }, /* @__PURE__ */ React.createElement("span", null, "Track length"), /* @__PURE__ */ React.createElement("b", null, o.trackLength)), /* @__PURE__ */ React.createElement("div", { className: "esp-metric" }, /* @__PURE__ */ React.createElement("span", null, "Est. cost"), /* @__PURE__ */ React.createElement("b", null, o.cost))), /* @__PURE__ */ React.createElement("div", { className: "esp-opt-rationale" }, /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink-800)" } }, "Why: "), o.rationale)), /* @__PURE__ */ React.createElement("div", { className: "esp-opt-foot" }, /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: selected === o.id ? "primary" : "secondary", onClick: (e) => {
    e.stopPropagation();
    setSelected(o.id);
  } }, selected === o.id ? "Selected" : "Select"), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "ghost", onClick: (e) => {
    e.stopPropagation();
    setSelected(o.id);
    onOpenEditor();
  } }, "Open in editor"))))) : /* @__PURE__ */ React.createElement(Card, { bodyStyle: { padding: 0 }, foot: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, "Differences-only layer and common/changed asset counts are available inside the editor."), /* @__PURE__ */ React.createElement("span", null, OPTIONS.filter((o) => o.violations === 0).length, " option(s) with zero violations")) }, /* @__PURE__ */ React.createElement("div", { className: "esp-tablewrap" }, /* @__PURE__ */ React.createElement("table", { className: "esp-table esp-cmp" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Criterion"), OPTIONS.map((o) => /* @__PURE__ */ React.createElement("th", { key: o.id, "data-align": "right" }, o.name, o.recommended ? " \u2605" : "")))), /* @__PURE__ */ React.createElement("tbody", null, COMPARE_ROWS.map((row) => {
    const b = best(row);
    return /* @__PURE__ */ React.createElement("tr", { key: row.label }, /* @__PURE__ */ React.createElement("td", { style: { fontWeight: 650, color: "var(--ink-900)" } }, row.label), OPTIONS.map((o) => /* @__PURE__ */ React.createElement("td", { key: o.id, "data-align": "right", "data-best": b != null && o[row.key] === b }, o[row.key])));
  }), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { fontWeight: 650, color: "var(--ink-900)" } }, "Selection"), OPTIONS.map((o) => /* @__PURE__ */ React.createElement("td", { key: o.id, "data-align": "right" }, /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: selected === o.id ? "primary" : "secondary", onClick: () => setSelected(o.id) }, selected === o.id ? "Selected" : "Select")))))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Note, { tone: "info", icon: "info" }, "The system recommends ", /* @__PURE__ */ React.createElement("b", null, "Option 1"), ", but the final selection is yours. You can also modify the requirements and regenerate."))));
};
const StepEditor = ({ station, flow, selected, layers, setLayers, tool, setTool, onValidate }) => {
  const toggleLayer = (id) => setLayers(layers.map((l) => l.id === id ? { ...l, on: !l.on } : l));
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column", minHeight: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "esp-editor" }, /* @__PURE__ */ React.createElement("div", { className: "esp-ed-panel" }, /* @__PURE__ */ React.createElement("div", { className: "esp-ed-ptitle" }, "Layers"), /* @__PURE__ */ React.createElement("div", { className: "esp-ed-scroll" }, layers.map((l) => /* @__PURE__ */ React.createElement("div", { className: "esp-layer", key: l.id, "data-off": !l.on, onClick: () => toggleLayer(l.id) }, /* @__PURE__ */ React.createElement(Icon, { name: l.on ? "eye" : "eye_off", size: 13 }), /* @__PURE__ */ React.createElement("i", { style: { background: l.colour } }), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-name" }, l.label), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-count" }, l.count))), /* @__PURE__ */ React.createElement("div", { className: "esp-ed-ptitle", style: { borderTop: "var(--hairline)" } }, "Source documents"), ["TRR-ESP-V2.dwg", "TRR-CONCEPT-v2.dwg", "TRR-TS-2026.csv", "TRR-GIS.shp"].map((d) => /* @__PURE__ */ React.createElement("div", { className: "esp-layer", key: d }, /* @__PURE__ */ React.createElement(Icon, { name: "file", size: 13 }), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-name" }, d))), /* @__PURE__ */ React.createElement("div", { className: "esp-ed-ptitle", style: { borderTop: "var(--hairline)" } }, "Validation results"), /* @__PURE__ */ React.createElement("div", { className: "esp-layer" }, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--danger)" } }), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-name" }, "Violations"), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-count" }, VALIDATION.violations)), /* @__PURE__ */ React.createElement("div", { className: "esp-layer" }, /* @__PURE__ */ React.createElement("i", { style: { background: "var(--warning)" } }), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-name" }, "Warnings"), /* @__PURE__ */ React.createElement("span", { className: "esp-layer-count" }, VALIDATION.warnings)))), /* @__PURE__ */ React.createElement("div", { className: "esp-ed-centre" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: "var(--hairline)", background: "var(--paper)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 750, color: "var(--ink-900)" } }, station == null ? void 0 : station.name, " (", station == null ? void 0 : station.code, ")"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, flow === "create" ? "Create ESP" : "Update ESP"), flow === "update" && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Base V2"), /* @__PURE__ */ React.createElement(Chip, { tone: "accent" }, "Draft V3"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", dot: true }, "Option ", selected), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", display: "flex", gap: 7 } }, /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary", leadingIcon: "save" }, "Save"), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary", leadingIcon: "shield", onClick: onValidate }, "Run Validation"), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "primary", trailingIcon: "arrow_right" }, "Submit for Review"), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "ghost", iconOnly: true, leadingIcon: "more", title: "More actions" }))), /* @__PURE__ */ React.createElement("div", { className: "esp-canvas" }, /* @__PURE__ */ React.createElement(YardDrawing, { layers })), /* @__PURE__ */ React.createElement("div", { className: "esp-toolbar" }, EDITOR_TOOLS.map((t, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: t.id }, (i === 1 || i === 4) && /* @__PURE__ */ React.createElement("span", { className: "esp-tool-sep" }), /* @__PURE__ */ React.createElement("button", { className: "esp-tool", "data-active": tool === t.id, title: t.label, onClick: () => setTool(t.id) }, /* @__PURE__ */ React.createElement(Icon, { name: t.icon, size: 15 })))), /* @__PURE__ */ React.createElement("span", { className: "esp-tool-sep" }), /* @__PURE__ */ React.createElement("button", { className: "esp-tool", title: "Undo" }, /* @__PURE__ */ React.createElement(Icon, { name: "undo", size: 15 })), /* @__PURE__ */ React.createElement("button", { className: "esp-tool", title: "Redo" }, /* @__PURE__ */ React.createElement(Icon, { name: "redo", size: 15 })), /* @__PURE__ */ React.createElement("span", { className: "esp-tool-sep" }), /* @__PURE__ */ React.createElement("button", { className: "esp-tool", title: "Zoom in" }, /* @__PURE__ */ React.createElement(Icon, { name: "zoom_in", size: 15 })), /* @__PURE__ */ React.createElement("button", { className: "esp-tool", title: "Zoom out" }, /* @__PURE__ */ React.createElement(Icon, { name: "zoom_out", size: 15 })), /* @__PURE__ */ React.createElement("button", { className: "esp-tool", title: "Fit" }, /* @__PURE__ */ React.createElement(Icon, { name: "fit_screen", size: 15 })), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--ink-400)", paddingRight: 6 } }, "Snapping on \xB7 grid 1 m \xB7 CH 411/0 \u2013 414/2"))), /* @__PURE__ */ React.createElement("div", { className: "esp-ed-panel" }, /* @__PURE__ */ React.createElement("div", { className: "esp-ed-ptitle" }, "Properties \u2014 Turnout 14A"), /* @__PURE__ */ React.createElement("div", { className: "esp-ed-scroll" }, [
    ["Asset type", "Turnout"],
    ["Asset number", "T-14A"],
    ["Geometry", "1 in 12 L.H."],
    ["Chainage", "412/1"],
    ["Track association", "Main line 2 \u2192 Loop 3"],
    ["Status", "Proposed"],
    ["Switch length", "10.125 m"],
    ["Layer", "Proposed changes"],
    ["Rule status", "1 violation"],
    ["Change reason", "New loop connectivity"]
  ].map(([k, v]) => /* @__PURE__ */ React.createElement("div", { className: "esp-prop", key: k }, /* @__PURE__ */ React.createElement("span", null, k), /* @__PURE__ */ React.createElement("b", null, v))), /* @__PURE__ */ React.createElement("div", { style: { padding: 14 } }, /* @__PURE__ */ React.createElement(Note, { tone: "danger", icon: "alert" }, "Fouling mark clearance 3.90 m \u2014 required \u2265 4.25 m (IRSOD 3.3)."))))));
};
const StepValidate = ({ onBackToEditor }) => {
  const [open, setOpen] = useStateEsp(null);
  const tiles = [
    { n: VALIDATION.passed, l: "Rules passed", c: "var(--success-text)" },
    { n: VALIDATION.violations, l: "Violations", c: "var(--danger-text)" },
    { n: VALIDATION.warnings, l: "Warnings", c: "var(--warning-text)" },
    { n: VALIDATION.na, l: "Not applicable", c: "var(--ink-500)" },
    { n: VALIDATION.manual, l: "Manual confirmation", c: "var(--info-text)" },
    { n: VALIDATION.condonation, l: "Condonation required", c: "var(--accent-text)" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Validation summary"), /* @__PURE__ */ React.createElement("div", { className: "esp-valgrid" }, tiles.map((t) => /* @__PURE__ */ React.createElement("div", { className: "esp-valtile", key: t.l }, /* @__PURE__ */ React.createElement("div", { className: "esp-valtile-n", style: { color: t.c } }, t.n), /* @__PURE__ */ React.createElement("div", { className: "esp-valtile-l" }, t.l))))), /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Results"), /* @__PURE__ */ React.createElement(Card, { sub: "Click a result to zoom to the asset and see measured vs required values.", bodyStyle: { padding: 0 } }, VALIDATION.results.map((r) => /* @__PURE__ */ React.createElement(React.Fragment, { key: r.id }, /* @__PURE__ */ React.createElement("div", { className: "esp-valrow", "data-open": open === r.id, onClick: () => setOpen(open === r.id ? null : r.id) }, /* @__PURE__ */ React.createElement("div", { className: "esp-valsev", "data-sev": r.sev }, /* @__PURE__ */ React.createElement(Icon, { name: r.sev === "violation" ? "alert" : "alert_tri", size: 13 })), /* @__PURE__ */ React.createElement("div", { className: "esp-valrow-main" }, /* @__PURE__ */ React.createElement("div", { className: "esp-valrow-title" }, r.title), /* @__PURE__ */ React.createElement("div", { className: "esp-valrow-meta" }, r.asset, " \xB7 CH ", r.ch, " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--font-mono)" } }, r.rule))), /* @__PURE__ */ React.createElement(Icon, { name: open === r.id ? "chevron_up" : "chevron_down", size: 14, style: { color: "var(--ink-400)", marginTop: 3 } })), open === r.id && /* @__PURE__ */ React.createElement("div", { className: "esp-valdetail" }, /* @__PURE__ */ React.createElement("div", { className: "esp-valmeasure" }, /* @__PURE__ */ React.createElement("div", null, "Measured", /* @__PURE__ */ React.createElement("b", { "data-bad": r.sev === "violation" }, r.measured)), /* @__PURE__ */ React.createElement("div", null, "Required", /* @__PURE__ */ React.createElement("b", null, r.required)), /* @__PURE__ */ React.createElement("div", null, "Rule reference", /* @__PURE__ */ React.createElement("b", { style: { fontFamily: "var(--font-mono)", fontSize: 12.5 } }, r.rule)), /* @__PURE__ */ React.createElement("div", null, "Chainage", /* @__PURE__ */ React.createElement("b", null, r.ch))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-600)", lineHeight: 1.5, marginBottom: 12 } }, r.note), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary", leadingIcon: "target", onClick: onBackToEditor }, "Zoom to asset"), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary", leadingIcon: "edit", onClick: onBackToEditor }, "Correct in editor"), /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "secondary", leadingIcon: "file_check" }, "Request condonation"))))))));
};
const StepFinalize = ({ finalized, onSubmit, onFinalize }) => {
  const outstanding = FINAL_CHECKLIST.filter((c) => !c.done).length;
  return /* @__PURE__ */ React.createElement("div", { className: "esp-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "esp-2col" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, { n: outstanding ? `${outstanding} outstanding` : "complete" }, "Final review checklist"), /* @__PURE__ */ React.createElement(Card, { bodyStyle: { padding: 0 } }, FINAL_CHECKLIST.map((c) => /* @__PURE__ */ React.createElement("div", { className: "esp-check", key: c.id, "data-done": c.done }, /* @__PURE__ */ React.createElement("div", { className: "esp-check-box" }, c.done && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 })), /* @__PURE__ */ React.createElement("span", { className: "esp-check-label" }, c.label), !c.done && /* @__PURE__ */ React.createElement(Btn, { size: "sm", variant: "ghost" }, "Resolve"))))), finalized && /* @__PURE__ */ React.createElement("div", { className: "esp-sec" }, /* @__PURE__ */ React.createElement(SecTitle, null, "Final output \u2014 saved to the Digital Library"), /* @__PURE__ */ React.createElement(Card, { bodyStyle: { padding: 0 } }, FINAL_OUTPUTS.map((o) => /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow", key: o.label }, /* @__PURE__ */ React.createElement(Icon, { name: o.icon, size: 15, style: { color: "var(--success)" } }), /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-main" }, /* @__PURE__ */ React.createElement("div", { className: "esp-inputrow-label" }, o.label)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, color: "var(--ink-500)", fontFamily: "var(--font-mono)" } }, o.meta)))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Card, { title: "Submission" }, outstanding > 0 ? /* @__PURE__ */ React.createElement(Note, { tone: "warning", icon: "alert_tri" }, outstanding, " checklist item", outstanding > 1 ? "s" : "", " outstanding, including S-O-D validation. An ESP cannot be finalized until validation is complete.") : /* @__PURE__ */ React.createElement(Note, { tone: "success", icon: "check_circle" }, "All checks complete. Ready to submit."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 14 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", trailingIcon: "arrow_right", onClick: onSubmit, style: { justifyContent: "center" } }, "Submit for Review"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "check_circle", disabled: !finalized && outstanding > 0, onClick: onFinalize, style: { justifyContent: "center" } }, "Finalize ESP")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-400)", marginTop: 10, lineHeight: 1.5 } }, "Finalizing assigns the version number, generates PDF and DWG/DXF, stores the editable ESP with its asset data, validation results and traceability, and unlocks SIP generation.")))));
};
const UpdateEspPage = ({ station, setStation, selectedEsp, setSelectedEsp, onGoLibrary, onOpenEditor, onExit }) => {
  const h = React.createElement;
  const [division, setDivision] = useStateEsp("");
  const [section, setSection] = useStateEsp("");
  const [stationSearch, setStationSearch] = useStateEsp("");
  const [keyPlan, setKeyPlan] = useStateEsp("");
  const divisions = [...new Set(STATIONS.map((s) => s.division))];
  const sections = [...new Set(STATIONS.filter((s) => !division || s.division === division).map((s) => s.section))];
  const stations = STATIONS.filter((s) => (!division || s.division === division) && (!section || s.section === section) && (!stationSearch.trim() || s.name.toLowerCase().includes(stationSearch.trim().toLowerCase()) || s.code.toLowerCase().includes(stationSearch.trim().toLowerCase())));
  const rows = station ? station.espVersions.map((v, i) => ({ drawing: `${station.code}-ESP-${String(i + 1).padStart(3, "0")}`, file: `${station.code}_ESP_${v.split(" ")[0]}.${i === 0 ? "dwg" : "pdf"}`, version: v.split(" ")[0], status: v.includes("Approved") ? "Approved" : "Superseded", updated: i ? "04 Jan 2025" : "12 Jul 2026" })) : [];
  const chooseStation = (code) => { setStation(STATIONS.find((s) => s.code === code) || null); setSelectedEsp(""); };
  const option = (value, label) => h("option", { key: value, value }, label);
  return h("div", { className: "esp-page" },
    h("div", { className: "esp-topbar" }, h("div", { className: "esp-titlerow" }, h("div", null, h("div", { className: "esp-title" }, "Update ESP"), h("div", { className: "esp-sub" }, "Select a station and choose the ESP drawing to update.")), h("div", { className: "esp-titlerow-actions" }, h(Btn, { variant: "ghost", leadingIcon: "x", onClick: onExit }, "Exit")))),
    h("div", { className: "esp-body" }, h("div", { className: "esp-update-page" },
      h("div", { className: "esp-sec" }, h(SecTitle, null, "Select Station"), h(Card, null, h("div", { className: "esp-update-grid" },
        h(Field, { label: "Zone" }, h(Select, { value: "SCR", disabled: true }, option("SCR", "SCR — South Central Railway"))),
        h(Field, { label: "Division" }, h(Select, { value: division, onChange: (e) => { setDivision(e.target.value); setSection(""); chooseStation(""); } }, option("", "All divisions"), divisions.map((v) => option(v, v)))),
        h(Field, { label: "Section" }, h(Select, { value: section, onChange: (e) => { setSection(e.target.value); chooseStation(""); } }, option("", "All sections"), sections.map((v) => option(v, v)))),
        h(Field, { label: "Search Station" }, h(TextInput, { value: stationSearch, onChange: (e) => setStationSearch(e.target.value), placeholder: "Station name or code", leadingIcon: "search" })),
        h(Field, { label: "Station", required: true }, h(Select, { value: station ? station.code : "", onChange: (e) => chooseStation(e.target.value) }, option("", "Select station"), stations.map((s) => option(s.code, `${s.name} (${s.code})`))))
      ))),
      station && h("div", { className: "esp-sec" }, h(SecTitle, { n: `${rows.length} drawing${rows.length === 1 ? "" : "s"}` }, "Select ESP"), rows.length ? h(Card, { bodyStyle: { padding: 0 } }, h("div", { className: "esp-tablewrap" }, h("table", { className: "esp-table" }, h("thead", null, h("tr", null, h("th", null, "Select"), h("th", null, "ESP"), h("th", null, "Drawing Number"), h("th", null, "Version"), h("th", null, "Status"), h("th", null, "Last Updated"))), h("tbody", null, rows.map((r) => h("tr", { key: r.drawing, onClick: () => setSelectedEsp(r.drawing), style: { cursor: "pointer", background: selectedEsp === r.drawing ? "var(--accent-soft)" : void 0 } }, h("td", null, h(Radio, { checked: selectedEsp === r.drawing })), h("td", null, r.file), h("td", null, h("span", { className: "esp-td-station" }, r.drawing)), h("td", null, h("span", { className: "esp-ver" }, r.version)), h("td", null, h(Chip, { tone: r.status === "Approved" ? "success" : "neutral", dot: true }, r.status)), h("td", null, r.updated))))))) : h("div", { className: "esp-empty" }, h(Icon, { name: "file", size: 24 }), h("div", { style: { marginTop: 10, fontWeight: 700, color: "var(--ink-900)" } }, "No ESP is available for this station"), h("div", { style: { marginTop: 5 } }, "Upload an ESP in the station’s Digital Library before starting an update."), h("div", { style: { marginTop: 14 } }, h(Btn, { variant: "primary", leadingIcon: "upload", onClick: onGoLibrary }, "Upload ESP in Digital Library")))),
      station && rows.length > 0 && h("div", { className: "esp-update-uploadbar" }, h("div", null, h("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-900)" } }, "Need to use a different ESP?"), h("div", { className: "esp-card-sub" }, "Upload another drawing to this station’s Digital Library.")), h(Btn, { variant: "secondary", leadingIcon: "upload", onClick: onGoLibrary }, "Upload New ESP")),
      station && rows.length > 0 && h("div", { className: "esp-sec", style: { marginTop: 22 } }, h(SecTitle, null, "Upload Key Plan"), h(Card, null, h("div", { className: "esp-update-file" }, h(Icon, { name: "upload", size: 18, style: { color: "var(--accent)" } }), h("div", { style: { flex: 1 } }, h("div", { style: { fontWeight: 700, fontSize: 13 } }, "Upload Key Plan (optional)"), h("div", { className: "esp-card-sub" }, keyPlan || "PDF, DWG or DXF; you can continue without it.")), h("input", { type: "file", accept: ".pdf,.dwg,.dxf", onChange: (e) => setKeyPlan(e.target.files && e.target.files[0] ? e.target.files[0].name : "") })))),
      station && rows.length > 0 && h("div", { className: "esp-update-actions" }, h(Btn, { variant: "primary", trailingIcon: "arrow_right", disabled: !selectedEsp, onClick: onOpenEditor }, "Open in Editor"))
    ))
  );
};

const EspModulePage = ({ onNavigate }) => {
  const [view, setView] = useStateEsp("landing");
  const [flow, setFlow] = useStateEsp("create");
  const [step, setStep] = useStateEsp(0);
  const [station, setStation] = useStateEsp(null);
  const [scenario, setScenario] = useStateEsp("firstdigital");
  const [prevEsp, setPrevEsp] = useStateEsp("ESP V2");
  const [changeTypes, setChangeTypes] = useStateEsp(["Add loop line", "Extend platform"]);
  const [requirements, setRequirements] = useStateEsp({
    lines: "4",
    platforms: "2",
    turnouts: "6",
    land: "12.4 ha",
    adjacent: "Both ends",
    connectivity: "Full yard connectivity",
    lineTypes: ["Main line", "Loop line"],
    ops: "Simultaneous reception on both main lines. Stabling for one 24-coach rake.",
    constraints: "LC gate at 412/7 to be retained. No land available on the up side."
  });
  const [generating, setGenerating] = useStateEsp(false);
  const [progress, setProgress] = useStateEsp(0);
  const [selected, setSelected] = useStateEsp(1);
  const [layers, setLayers] = useStateEsp(EDITOR_LAYERS);
  const [tool, setTool] = useStateEsp("select");
  const [editorTab, setEditorTab] = useStateEsp("editor");
  const [finalized, setFinalized] = useStateEsp(false);
  const [maxReached, setMaxReached] = useStateEsp(0);
  const goStep = (i) => {
    setStep(i);
    setMaxReached((m) => Math.max(m, i));
  };
  const toggleChange = (c) => setChangeTypes(changeTypes.includes(c) ? changeTypes.filter((x) => x !== c) : [...changeTypes, c]);
  useEffectEsp(() => {
    if (!generating) return;
    if (progress >= GEN_STAGES.length) {
      const t2 = setTimeout(() => {
        setGenerating(false);
        setProgress(0);
        goStep(4);
      }, 400);
      return () => clearTimeout(t2);
    }
    const t = setTimeout(() => setProgress((p) => p + 1), 620);
    return () => clearTimeout(t);
  }, [generating, progress]);
  const startFlow = (f) => {
    setFlow(f);
    setStep(0);
    setMaxReached(0);
    setView("workflow");
    setStation(null);
  };
  const stepValid = () => {
    if (step === 0) return !!station;
    if (step === 1) return flow === "create" ? !!scenario : !!prevEsp && (station == null ? void 0 : station.espVersions.length) > 0;
    return true;
  };
  const stepBody = () => {
    switch (step) {
      case 0:
        return /* @__PURE__ */ React.createElement(StepStation, { station, setStation });
      case 1:
        return /* @__PURE__ */ React.createElement(
          StepBaseData,
          {
            flow,
            station,
            scenario,
            setScenario,
            prevEsp,
            setPrevEsp,
            onGoLibrary: () => onNavigate && onNavigate("library")
          }
        );
      case 2:
        return /* @__PURE__ */ React.createElement(
          StepDesignInputs,
          {
            flow,
            changeTypes,
            toggleChange,
            requirements,
            setRequirements
          }
        );
      case 3:
        return /* @__PURE__ */ React.createElement(
          StepGenerate,
          {
            flow,
            station,
            scenario,
            generating,
            progress,
            onGenerate: () => {
              setGenerating(true);
              setProgress(0);
            }
          }
        );
      case 4:
        return /* @__PURE__ */ React.createElement(
          StepCompare,
          {
            selected,
            setSelected,
            onOpenEditor: () => goStep(5),
            onRegenerate: () => {
              goStep(3);
              setGenerating(true);
              setProgress(0);
            }
          }
        );
      case 5:
        return editorTab === "editor" ? /* @__PURE__ */ React.createElement(
          StepEditor,
          {
            station,
            flow,
            selected,
            layers,
            setLayers,
            tool,
            setTool,
            onValidate: () => setEditorTab("validation")
          }
        ) : /* @__PURE__ */ React.createElement(StepValidate, { onBackToEditor: () => setEditorTab("editor") });
      case 6:
        return /* @__PURE__ */ React.createElement(StepFinalize, { finalized, onSubmit: () => goStep(6), onFinalize: () => setFinalized(true) });
      default:
        return null;
    }
  };
  if (view === "workflow" && flow === "update" && step < 5) {
    return /* @__PURE__ */ React.createElement(UpdateEspPage, { station, setStation, selectedEsp: prevEsp, setSelectedEsp: setPrevEsp, onGoLibrary: () => onNavigate && onNavigate("library"), onOpenEditor: () => goStep(5), onExit: () => setView("landing") });
  }
  if (view === "landing") {
    return /* @__PURE__ */ React.createElement("div", { className: "esp-page" }, /* @__PURE__ */ React.createElement("div", { className: "esp-topbar" }, /* @__PURE__ */ React.createElement("div", { className: "esp-titlerow" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "esp-title" }, "RAPID ESP"), /* @__PURE__ */ React.createElement("div", { className: "esp-sub" }, "Create, update, validate and manage Engineering Scale Plans")))), /* @__PURE__ */ React.createElement("div", { className: "esp-body" }, /* @__PURE__ */ React.createElement(EspLanding, { onStart: startFlow, onOpenFiles: () => onNavigate && onNavigate("wsMyFiles") })));
  }
  const isEditorStep = step === 5;
  return /* @__PURE__ */ React.createElement("div", { className: "esp-page" }, /* @__PURE__ */ React.createElement("div", { className: "esp-topbar", style: { paddingBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "esp-crumb" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNavigate && onNavigate("home") }, "Design Modules"), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 11 }), /* @__PURE__ */ React.createElement("button", { onClick: () => setView("landing") }, "ESP Design"), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 11 }), /* @__PURE__ */ React.createElement("span", { className: "cur" }, flow === "create" ? "Create ESP" : "Update ESP", station ? ` \u2014 ${station.name}` : "")), /* @__PURE__ */ React.createElement("div", { className: "esp-titlerow" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "esp-title" }, flow === "create" ? "Create New ESP" : "Update Existing ESP"), /* @__PURE__ */ React.createElement("div", { className: "esp-sub" }, station ? `${station.name} (${station.code}) \xB7 ${station.division} division` : "No station selected", flow === "update" && (station == null ? void 0 : station.espVersions.length) ? ` \xB7 base ${prevEsp}` : "")), /* @__PURE__ */ React.createElement("div", { className: "esp-titlerow-actions" }, /* @__PURE__ */ React.createElement(Chip, { tone: "accent", dot: true }, step >= 5 ? "Editing" : step >= 4 ? "Options Generated" : step >= 3 ? "Ready for Generation" : "Setup Incomplete"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "save" }, "Save draft"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", leadingIcon: "x", onClick: () => setView("landing") }, "Exit")))), /* @__PURE__ */ React.createElement("div", { className: "esp-stepbar" }, /* @__PURE__ */ React.createElement("div", { className: "esp-steps" }, WORKFLOW_STEPS.map((s, i) => {
    const state = i < step ? "done" : i === step ? "active" : "pending";
    const locked = i > maxReached;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.id,
        className: "esp-step",
        "data-state": state,
        "data-locked": locked,
        onClick: () => !locked && goStep(i)
      },
      /* @__PURE__ */ React.createElement("div", { className: "esp-step-line" }),
      /* @__PURE__ */ React.createElement("div", { className: "esp-step-dot" }, state === "done" ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 }) : i + 1),
      /* @__PURE__ */ React.createElement("div", { className: "esp-step-txt" }, /* @__PURE__ */ React.createElement("div", { className: "esp-step-label" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "esp-step-sub" }, flow === "update" && i === 1 ? "Previous ESP" : flow === "update" && i === 2 ? "Proposed changes" : s.sub))
    );
  }))), isEditorStep && /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, padding: "10px 28px 0", background: "var(--canvas)" } }, /* @__PURE__ */ React.createElement(
    PillTabs,
    {
      items: [{ id: "editor", label: "Editor" }, { id: "validation", label: `Validation (${VALIDATION.violations + VALIDATION.warnings})` }],
      active: editorTab,
      onChange: setEditorTab
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "esp-body", style: isEditorStep && editorTab === "editor" ? { display: "flex", flexDirection: "column", paddingBottom: 22, overflow: "hidden" } : null }, stepBody()), !generating && /* @__PURE__ */ React.createElement("div", { className: "esp-footer" }, /* @__PURE__ */ React.createElement("span", { className: "esp-footer-note" }, "Step ", step + 1, " of ", WORKFLOW_STEPS.length, " \xB7 ", WORKFLOW_STEPS[step].label, !stepValid() && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--danger-text)", fontWeight: 650 } }, " ", "\xB7 ", step === 0 ? "select a station to continue" : "complete this step to continue")), /* @__PURE__ */ React.createElement("div", { className: "esp-footer-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "chevron_left", disabled: step === 0, onClick: () => goStep(step - 1) }, "Back"), step < WORKFLOW_STEPS.length - 1 && /* @__PURE__ */ React.createElement(Btn, { variant: "primary", trailingIcon: "chevron_right", disabled: !stepValid(), onClick: () => goStep(step + 1) }, step === 3 ? "Skip to options" : "Continue"), step === WORKFLOW_STEPS.length - 1 && /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "check_circle", onClick: () => setFinalized(true) }, "Finalize ESP"))));
};
const espStyle = document.createElement("style");
espStyle.textContent = espCSS;
document.head.appendChild(espStyle);
window.EspModulePage = EspModulePage;
