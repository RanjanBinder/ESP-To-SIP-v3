// RAPID ESP — Engineering Scale Plan design module.
// A guided workflow rather than one large form: a landing page with two entry
// actions (Create / Update) that both run through one shared 7-step engine.
// Exposes window.EspModulePage.
const { useState: useStateEsp, useEffect: useEffectEsp, useRef: useRefEsp, useMemo: useMemoEsp } = React;

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

// The 11 workflow statuses, in lifecycle order. `tone` maps onto ds-chip.
const ESP_STATUS = {
  "Setup Incomplete":  { tone: "neutral" },
  "Input Required":    { tone: "warning" },
  "Ready for Generation": { tone: "info" },
  "Generating Options": { tone: "info", pulse: true },
  "Options Generated": { tone: "accent" },
  "Editing":           { tone: "accent" },
  "Validation Failed": { tone: "danger" },
  "Ready for Review":  { tone: "info" },
  "Under Review":      { tone: "warning" },
  "Approved":          { tone: "success" },
  "Finalized":         { tone: "success" },
};

const RECENT_DESIGNS = [
  { station: "Tarur", code: "TRR", type: "Update ESP", base: "V2", current: "Draft V3", status: "In Progress", statusKey: "Editing", by: "K. Naidu", updated: "16 Aug 2026", action: "Continue" },
  { station: "Gudur South", code: "GSU", type: "Create ESP", base: "—", current: "Draft V1", status: "Options Generated", statusKey: "Options Generated", by: "S. Reddy", updated: "15 Aug 2026", action: "Review Options" },
  { station: "Bhimavaram Town", code: "BVRT", type: "Update ESP", base: "V1", current: "Draft V2", status: "Validation Failed", statusKey: "Validation Failed", by: "V. Kumar", updated: "14 Aug 2026", action: "Fix Violations" },
  { station: "Ongole", code: "OGL", type: "Create ESP", base: "—", current: "Draft V1", status: "Input Required", statusKey: "Input Required", by: "M. Prasad", updated: "12 Aug 2026", action: "Add Inputs" },
  { station: "Tenali Junction", code: "TEL", type: "Update ESP", base: "V2", current: "V3", status: "Under Review", statusKey: "Under Review", by: "R. Sharma", updated: "11 Aug 2026", action: "View" },
  { station: "Rajahmundry", code: "RJY", type: "Create ESP", base: "—", current: "V1", status: "Finalized", statusKey: "Finalized", by: "A. Rao", updated: "08 Aug 2026", action: "View" },
];

const STATIONS = [
  { code: "TRR", name: "Tarur", zone: "SCR", division: "Vijayawada", section: "Vijayawada–Gudivada", category: "NSG-5", status: "Operational",
    adjacent: ["Gudivada (GDV)", "Pedana (PDN)"], espVersions: ["V2 (Approved)", "V1 (Superseded)"], sip: "SIP V2 · Approved", latest: "V2",
    readiness: [
      { set: "Approved ESP", status: "Available: V2", tone: "success", action: "View" },
      { set: "Extracted station assets", status: "Validated", tone: "success", action: "View" },
      { set: "Key Plan", status: "Not available", tone: "danger", action: "Add" },
      { set: "GIS data", status: "Available", tone: "success", action: "View" },
      { set: "Survey data", status: "Available", tone: "success", action: "View" },
      { set: "Constraints", status: "Partially available", tone: "warning", action: "Review" },
    ] },
  { code: "GSU", name: "Gudur South", zone: "SCR", division: "Vijayawada", section: "Gudur–Nellore", category: "NSG-6", status: "Proposed",
    adjacent: ["Gudur Jn (GDR)", "Manubolu (MBL)"], espVersions: [], sip: "Not available", latest: "—",
    readiness: [
      { set: "Approved ESP", status: "Not available", tone: "danger", action: "Add" },
      { set: "Extracted station assets", status: "Not available", tone: "danger", action: "Add" },
      { set: "Key Plan", status: "Available", tone: "success", action: "View" },
      { set: "GIS data", status: "Available", tone: "success", action: "View" },
      { set: "Survey data", status: "Partially available", tone: "warning", action: "Review" },
      { set: "Constraints", status: "Available", tone: "success", action: "View" },
    ] },
  { code: "OGL", name: "Ongole", zone: "SCR", division: "Guntur", section: "Ongole–Singarayakonda", category: "NSG-4", status: "Operational",
    adjacent: ["Chinnaganjam (CJM)", "Karavadi (KRV)"], espVersions: ["V1 (Approved)"], sip: "SIP V1 · Approved", latest: "V1",
    readiness: [
      { set: "Approved ESP", status: "Available: V1", tone: "success", action: "View" },
      { set: "Extracted station assets", status: "Needs PIM validation", tone: "warning", action: "Review" },
      { set: "Key Plan", status: "Available", tone: "success", action: "View" },
      { set: "GIS data", status: "Not available", tone: "danger", action: "Add" },
      { set: "Survey data", status: "Available", tone: "success", action: "View" },
      { set: "Constraints", status: "Not available", tone: "danger", action: "Add" },
    ] },
  { code: "BVRT", name: "Bhimavaram Town", zone: "SCR", division: "Vijayawada", section: "Bhimavaram–Narsapur", category: "NSG-5", status: "Operational",
    adjacent: ["Bhimavaram Jn (BVRM)", "Veeravasaram (VVM)"], espVersions: ["V1 (Approved)"], sip: "SIP V1 · Under review", latest: "V1",
    readiness: [
      { set: "Approved ESP", status: "Available: V1", tone: "success", action: "View" },
      { set: "Extracted station assets", status: "Validated", tone: "success", action: "View" },
      { set: "Key Plan", status: "Available", tone: "success", action: "View" },
      { set: "GIS data", status: "Available", tone: "success", action: "View" },
      { set: "Survey data", status: "Available", tone: "success", action: "View" },
      { set: "Constraints", status: "Available", tone: "success", action: "View" },
    ] },
];

const CREATE_SCENARIOS = [
  { id: "greenfield", letter: "A", title: "New Yard / Greenfield ESP", icon: "cube",
    desc: "No previous ESP exists. You provide land boundary, connectivity and operational requirements.",
    inputs: ["Land boundary", "Connectivity requirement", "Operational requirement"],
    optional: "Key plan, survey data or a conceptual drawing may be used." },
  { id: "firstdigital", letter: "B", title: "Existing Yard — First Digital ESP", icon: "layers",
    desc: "The physical yard already exists but no approved digital ESP is available.",
    inputs: ["Existing PDF / CAD drawing", "Survey data"],
    optional: "Existing drawings are extracted and PIM-validated to build the digital ESP." },
  { id: "userdefined", letter: "C", title: "User-Defined Design", icon: "edit",
    desc: "Start from a conceptual design of your own.",
    inputs: ["Concept upload or direct drawing"],
    optional: "Upload a concept, or draw the layout directly in the editor." },
];

const INPUT_SOURCES = [
  { id: "library", icon: "book", title: "Select from Digital Library", desc: "Reuse a document already validated for this station." },
  { id: "upload", icon: "upload", title: "Upload new document", desc: "PDF or AutoCAD. Assets are extracted and PIM-validated." },
  { id: "draw", icon: "edit", title: "Draw conceptual layout", desc: "Sketch the proposed layout directly in the editor." },
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
  { id: "constraints", label: "Constraints data", req: true, state: "partial", meta: "3 of 5 categories" },
];

const LINE_TYPES = ["Main line", "Loop line", "Siding"];

const CHANGE_TYPES = [
  "Add new line", "Add loop line", "Add siding", "Convert loop line to main line",
  "Modify track alignment", "Modify turnout", "Add or relocate platform", "Extend platform",
  "Modify yard connectivity", "Add or remove structure", "Other yard-remodelling work",
];

const PREV_ESPS = [
  { ver: "ESP V2", status: "Approved", date: "12 July 2026", format: "Digital (native)", by: "K. Naidu", approvedBy: "Sr. DEN / SCR", sip: "SIP V2", validated: "Validated" },
  { ver: "ESP V1", status: "Superseded", date: "04 Jan 2025", format: "Scanned PDF", by: "A. Rao", approvedBy: "Sr. DEN / SCR", sip: "SIP V1", validated: "Validated" },
];

const GEN_STAGES = [
  "Analysing available space",
  "Evaluating connectivity",
  "Applying track geometry",
  "Applying S-O-D rules",
  "Checking operational feasibility",
  "Generating ESP options",
];

const OPTIONS = [
  { id: 1, name: "Option 1", tag: "Balanced", recommended: true, score: 94, violations: 0, warnings: 3,
    land: "78%", turnouts: 6, trackLength: "4,820 m", connectivity: "Both ends, 2 main + 2 loop",
    cost: "₹ 18.4 Cr", constraints: "Level crossing at 412/7 retained",
    rationale: "Reuses the existing loop alignment, so earthwork is limited to the north throat." },
  { id: 2, name: "Option 2", tag: "Max capacity", recommended: false, score: 81, violations: 2, warnings: 6,
    land: "94%", turnouts: 9, trackLength: "6,140 m", connectivity: "Both ends, 2 main + 3 loop + siding",
    cost: "₹ 26.1 Cr", constraints: "Requires land acquisition on the down side",
    rationale: "Adds a third loop for maximum crossing capacity at the cost of two S-O-D deviations." },
  { id: 3, name: "Option 3", tag: "Low cost", recommended: false, score: 88, violations: 1, warnings: 2,
    land: "61%", turnouts: 4, trackLength: "3,960 m", connectivity: "Single-end connectivity, 2 main + 1 loop",
    cost: "₹ 12.7 Cr", constraints: "No platform extension possible later",
    rationale: "Minimum intervention. Cheapest to build but constrains future extension." },
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
  { label: "Major constraints", key: "constraints" },
];

const EDITOR_LAYERS = [
  { id: "prev", label: "Previous approved ESP", count: 412, colour: "#0E1B2C", on: true },
  { id: "proposed", label: "Proposed changes", count: 38, colour: "#DC2626", on: true },
  { id: "assets", label: "Extracted assets", count: 412, colour: "#3737C8", on: true },
  { id: "gis", label: "GIS / survey reference", count: 2, colour: "#0D9488", on: false },
  { id: "constraints", label: "Constraints", count: 7, colour: "#B45309", on: true },
  { id: "sod", label: "S-O-D violations", count: 3, colour: "#BE123C", on: true },
  { id: "notes", label: "User annotations", count: 12, colour: "#64748B", on: false },
];

const EDITOR_TOOLS = [
  { id: "select", icon: "cursor", label: "Select & search" },
  { id: "track", icon: "track", label: "Track & turnout" },
  { id: "platform", icon: "layers", label: "Platforms & structures" },
  { id: "shape", icon: "select_rect", label: "Shapes" },
  { id: "note", icon: "edit", label: "Annotations" },
  { id: "dim", icon: "ruler", label: "Dimensions" },
  { id: "measure", icon: "target", label: "Measure" },
];

const VALIDATION = {
  passed: 128, violations: 3, warnings: 7, na: 22, manual: 4, condonation: 2,
  results: [
    { id: "v1", sev: "violation", rule: "SOD 4.2.1", title: "Track centre spacing below minimum",
      asset: "Loop line 3 ↔ Main line 2", measured: "4.28 m", required: "≥ 4.72 m", ch: "412/6–412/9",
      note: "Spacing reduced through the north throat after the proposed realignment." },
    { id: "v2", sev: "violation", rule: "SOD 5.1.4", title: "Platform offset from track centre",
      asset: "Platform 2 (proposed extension)", measured: "1.61 m", required: "1.68 m", ch: "413/2",
      note: "Extension follows the existing platform face, which is already non-standard." },
    { id: "v3", sev: "violation", rule: "IRSOD 3.3", title: "Fouling mark clearance",
      asset: "Turnout 14A", measured: "3.90 m", required: "≥ 4.25 m", ch: "412/1",
      note: "Fouling mark cannot be derived at the proposed turnout position." },
    { id: "w1", sev: "warning", rule: "GEO 2.6", title: "Curve radius below desirable value",
      asset: "Proposed main line curve C3", measured: "R 612 m", required: "R ≥ 700 m desirable", ch: "411/8",
      note: "Permissible but attracts a permanent speed restriction." },
    { id: "w2", sev: "warning", rule: "OPS 1.2", title: "Simultaneous reception not available",
      asset: "North throat", measured: "Not achievable", required: "Desirable", ch: "—",
      note: "Yard geometry does not allow simultaneous reception on both main lines." },
  ],
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
  { id: "preview", label: "Output preview checked", done: true },
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
  { icon: "file_check", label: "Available for SIP generation", meta: "unlocked" },
];

const WORKFLOW_STEPS = [
  { id: 0, label: "Station",           sub: "Select yard" },
  { id: 1, label: "Base Data",         sub: "Source & scenario" },
  { id: 2, label: "Design Inputs",     sub: "Requirements" },
  { id: 3, label: "Generate Options",  sub: "Readiness" },
  { id: 4, label: "Compare",           sub: "Choose option" },
  { id: 5, label: "Edit & Validate",   sub: "Editor" },
  { id: 6, label: "Review & Finalize", sub: "Submit" },
];

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */

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
/* station picker — one required searchable field; the hierarchy is derived */
.esp-picker { position: relative; }
.esp-combo { position: relative; max-width: 560px; }
.esp-combo-menu { position: absolute; z-index: 40; top: calc(100% + 6px); left: 0; right: 0; max-height: 300px; overflow-y: auto; padding: 4px; background: var(--paper); border: var(--hairline); border-radius: var(--r-md); box-shadow: var(--shadow-lg); }
.esp-combo-opt { display: flex; align-items: center; gap: 12px; padding: 9px 10px; border-radius: var(--r-sm); cursor: pointer; }
.esp-combo-opt[data-active="true"] { background: var(--accent-soft); }
.esp-combo-opt-main { flex: 1; min-width: 0; }
.esp-combo-opt mark { background: transparent; color: var(--accent); font-weight: 800; }
.esp-combo-empty { padding: 22px 14px; text-align: center; font-size: 12.5px; color: var(--ink-500); }
.esp-combo-empty .icon { color: var(--ink-400); }
.esp-picked { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border: 1px solid var(--accent); border-radius: var(--r-md); background: var(--accent-soft); }
.esp-picked-badge { flex-shrink: 0; display: grid; place-items: center; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%; background: var(--accent); color: #fff; }
.esp-picked-main { flex: 1; min-width: 0; }
.esp-picked-name { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 14.5px; font-weight: 700; color: var(--ink-900); }
.esp-picked-name .esp-code { margin-left: 0; }
.esp-picked-chain { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 7px; font-size: 11.5px; font-weight: 650; color: var(--ink-700); }
.esp-picked-chain .icon { color: var(--ink-400); }
.esp-picked-note { margin-top: 5px; font-size: 11.5px; color: var(--ink-500); }
.esp-adv { margin-top: 14px; padding-top: 12px; border-top: var(--hairline); }
.esp-adv-toggle { display: inline-flex; align-items: center; gap: 7px; margin-left: -9px; padding: 5px 9px; border: 0; border-radius: var(--r-sm); background: transparent; font: inherit; font-size: 12.5px; font-weight: 650; color: var(--ink-600); cursor: pointer; }
.esp-adv-toggle:hover { background: var(--ink-50); color: var(--ink-900); }
.esp-adv-caret { transition: transform 140ms; }
.esp-adv-toggle[data-open="true"] .esp-adv-caret { transform: rotate(180deg); }
.esp-adv-count { display: grid; place-items: center; min-width: 16px; height: 16px; padding: 0 5px; border-radius: var(--r-full); background: var(--accent); color: #fff; font-size: 10.5px; font-weight: 700; }
.esp-adv-panel { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 12px; padding: 14px; border: var(--hairline); border-radius: var(--r-md); background: var(--ink-50); }
.esp-adv-foot { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 11.5px; color: var(--ink-500); }
.esp-update-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 18px; margin-top: 18px; border-top: var(--hairline); }
.esp-update-file { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px dashed var(--ink-300); border-radius: var(--r-md); background: var(--ink-50); }
.esp-update-file input { max-width: 260px; }
.esp-update-uploadbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 12px; padding: 12px 16px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); }
@media (max-width: 760px) { .esp-adv-panel { grid-template-columns: 1fr; } .esp-update-actions { align-items: stretch; flex-direction: column; } }

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

/* update ESP — key plan editor, generated options and final selection */
.esp-ed-head { flex-shrink: 0; display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-bottom: var(--hairline); background: var(--paper); flex-wrap: wrap; }
.esp-ed-head-actions { margin-left: auto; display: flex; align-items: center; gap: 7px; }
.esp-kp-canvas { display: block; }
.esp-kp-canvas[data-draw="true"] { cursor: crosshair; }
.esp-kp-strip { flex-shrink: 0; display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-bottom: var(--hairline); background: var(--danger-soft); color: var(--danger-text); font-size: 12px; font-weight: 650; }
.esp-kp-strip b { font-weight: 800; }
.esp-kp-swatch { width: 22px; height: 0; border-top: 2px dashed #DC2626; flex-shrink: 0; }
.esp-kp-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.esp-kp-steps { margin: 0; padding-left: 18px; font-size: 11.5px; color: var(--ink-600); line-height: 1.7; }
.esp-final { display: flex; align-items: center; gap: 16px; padding: 16px 18px; margin-bottom: 22px; border: 1px solid var(--success); border-radius: var(--r-lg); background: var(--success-soft); }
.esp-final-icon { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: var(--success); color: #fff; flex-shrink: 0; }
.esp-final-title { font-size: 14.5px; font-weight: 750; color: var(--ink-900); }
.esp-final-sub { font-size: 12px; color: var(--ink-600); margin-top: 2px; }
.esp-final-actions { margin-left: auto; display: flex; gap: 8px; }
@media (max-width: 760px) { .esp-final { flex-direction: column; align-items: flex-start; } .esp-final-actions { margin-left: 0; } }
`;

/* ═══════════════════════════════════════════════════════════════
   SHARED BITS
   ═══════════════════════════════════════════════════════════════ */

const StatusChip = ({ status }) => {
  const meta = ESP_STATUS[status] || { tone: "neutral" };
  return <Chip tone={meta.tone} dot={!meta.pulse} pulse={meta.pulse}>{status}</Chip>;
};

const Card = ({ title, sub, right, foot, children, bodyStyle }) => (
  <div className="esp-card">
    {(title || right) && (
      <div className="esp-card-head">
        {title && <div><div className="esp-card-title">{title}</div>{sub && <div className="esp-card-sub">{sub}</div>}</div>}
        {right && <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>{right}</div>}
      </div>
    )}
    {children != null && <div className="esp-card-body" style={bodyStyle}>{children}</div>}
    {foot && <div className="esp-card-foot">{foot}</div>}
  </div>
);

const Note = ({ tone = "info", icon = "info", children }) => (
  <div className="esp-note" data-tone={tone}><Icon name={icon} size={15} /><div>{children}</div></div>
);

const SecTitle = ({ children, n }) => (
  <div className="esp-sec-title">{children}{n != null && <span className="n">{n}</span>}</div>
);

const TONE_COLOR = { success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)", info: "var(--info)", neutral: "var(--ink-400)" };

/* A schematic yard drawing. Stands in for the real engineering canvas so the
   editor screen shows something structurally honest (wide, scrollable, layered)
   rather than an empty box. */
const YardDrawing = ({ layers, width = 1680 }) => {
  const on = (id) => layers.find((l) => l.id === id)?.on;
  const tracks = [
    { y: 132, label: "Main line 1", w: 2 },
    { y: 168, label: "Main line 2", w: 2 },
    { y: 208, label: "Loop line 1", w: 1.4 },
    { y: 248, label: "Loop line 2", w: 1.4 },
  ];
  return (
    <svg width={width} height={330} style={{ display: "block" }}>
      {/* platforms */}
      {on("prev") && (
        <>
          <rect x={420} y={180} width={520} height={22} fill="#E8EDF4" stroke="#94A3B8" strokeWidth="1" />
          <text x={430} y={195} fontSize="10" fill="#475569" fontWeight="600">PLATFORM 1 — 540 m</text>
          <rect x={420} y={258} width={430} height={22} fill="#E8EDF4" stroke="#94A3B8" strokeWidth="1" />
          <text x={430} y={273} fontSize="10" fill="#475569" fontWeight="600">PLATFORM 2 — 430 m</text>
        </>
      )}
      {/* existing tracks */}
      {on("prev") && tracks.map((t) => (
        <g key={t.y}>
          <line x1={40} y1={t.y} x2={width - 40} y2={t.y} stroke="#0E1B2C" strokeWidth={t.w} />
          <text x={44} y={t.y - 6} fontSize="9.5" fill="#64748B" fontWeight="600">{t.label}</text>
        </g>
      ))}
      {/* turnouts */}
      {on("prev") && [220, 330, 1180, 1320].map((x, i) => (
        <g key={x}>
          <path d={`M${x},132 L${x + 90},208`} stroke="#0E1B2C" strokeWidth="1.4" fill="none" />
          <circle cx={x} cy={132} r={3} fill="#0E1B2C" />
          <text x={x - 4} y={122} fontSize="9" fill="#475569" fontWeight="700">{`T${11 + i}`}</text>
        </g>
      ))}
      {/* proposed changes */}
      {on("proposed") && (
        <>
          <line x1={300} y1={288} x2={1400} y2={288} stroke="#DC2626" strokeWidth="2" strokeDasharray="7 4" />
          <text x={306} y={282} fontSize="9.5" fill="#DC2626" fontWeight="700">PROPOSED LOOP LINE 3</text>
          <path d="M1320,248 L1410,288" stroke="#DC2626" strokeWidth="1.6" fill="none" strokeDasharray="7 4" />
          <rect x={950} y={258} width={140} height={22} fill="none" stroke="#DC2626" strokeWidth="1.4" strokeDasharray="5 3" />
          <text x={958} y={273} fontSize="9.5" fill="#DC2626" fontWeight="700">PF-2 EXTENSION</text>
        </>
      )}
      {/* SOD violations */}
      {on("sod") && [{ x: 412, y: 190 }, { x: 1010, y: 268 }, { x: 1320, y: 246 }].map((v, i) => (
        <g key={i}>
          <circle cx={v.x} cy={v.y} r={11} fill="none" stroke="#BE123C" strokeWidth="1.8" />
          <text x={v.x - 3} y={v.y + 4} fontSize="10" fill="#BE123C" fontWeight="800">!</text>
        </g>
      ))}
      {/* constraints */}
      {on("constraints") && (
        <>
          <line x1={760} y1={96} x2={760} y2={310} stroke="#B45309" strokeWidth="1.4" strokeDasharray="4 4" />
          <text x={766} y={108} fontSize="9.5" fill="#B45309" fontWeight="700">LC GATE 412/7</text>
        </>
      )}
      {/* gis reference */}
      {on("gis") && (
        <>
          <line x1={40} y1={306} x2={width - 40} y2={306} stroke="#0D9488" strokeWidth="1" strokeDasharray="2 4" />
          <text x={44} y={318} fontSize="9" fill="#0D9488" fontWeight="600">GIS CENTRELINE REFERENCE</text>
        </>
      )}
      {/* annotations */}
      {on("notes") && (
        <>
          <rect x={540} y={60} width={186} height={26} rx={4} fill="#FFF8E1" stroke="#E5C97A" />
          <text x={548} y={77} fontSize="10" fill="#7A5C11">Confirm gate interlocking with S&amp;T</text>
        </>
      )}
      {/* chainage ruler */}
      <line x1={40} y1={20} x2={width - 40} y2={20} stroke="#CBD3DC" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i}>
          <line x1={40 + i * 136} y1={16} x2={40 + i * 136} y2={24} stroke="#94A3B8" strokeWidth="1" />
          <text x={40 + i * 136} y={38} fontSize="9" fill="#94A3B8" textAnchor="middle">{`41${1 + Math.floor(i / 4)}/${i % 4 * 2 + 1}`}</text>
        </g>
      ))}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LANDING
   ═══════════════════════════════════════════════════════════════ */

const ActionCard = ({ colour, icon, title, desc, cta, onClick }) => (
  <div className="esp-action" style={{ "--a": colour }} onClick={onClick}>
    <div className="esp-action-icon"><Icon name={icon} size={20} /></div>
    <div>
      <div className="esp-action-title">{title}</div>
      <div className="esp-action-desc">{desc}</div>
    </div>
    <div className="esp-action-foot">
      <Btn variant="primary" trailingIcon="arrow_right" onClick={(e) => { e.stopPropagation(); onClick(); }}>{cta}</Btn>
    </div>
  </div>
);

const EspLanding = ({ onStart, onOpenFiles }) => (
  <div className="esp-wrap">
    <div className="esp-sec">
      <div className="esp-actions">
        <ActionCard
          colour="#3737C8" icon="plus" title="Create New ESP"
          desc="For a new station, a new yard, or a station that has no approved ESP yet."
          cta="Create ESP" onClick={() => onStart("create")}
        />
        <ActionCard
          colour="#0D9488" icon="edit" title="Update Existing ESP"
          desc="For yard remodelling or modification of an existing approved ESP."
          cta="Update ESP" onClick={() => onStart("update")}
        />
      </div>
    </div>

    <div className="esp-sec">
      <SecTitle n={`${RECENT_DESIGNS.length} drafts`}>Recent ESP Designs</SecTitle>
      <Card
        foot={<>
          <span>Showing {RECENT_DESIGNS.length} most recent designs across your scope</span>
          <button style={{ border: "none", background: "none", font: "inherit", fontWeight: 700, color: "var(--accent-text)", cursor: "pointer" }} onClick={onOpenFiles}>
            Open file workspace →
          </button>
        </>}
        bodyStyle={{ padding: 0 }}
      >
        <div className="esp-tablewrap">
          <table className="esp-table">
            <thead>
              <tr>
                <th>Station</th><th>Version</th><th>Drawing Number</th>
                <th>State</th><th>Updated By</th><th>Last Updated</th><th data-align="right">Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_DESIGNS.map((d) => (
                <tr key={d.station + d.current}>
                  <td><span className="esp-td-station">{d.station}</span><span className="esp-code">{d.code}</span></td>
                  <td><span className="esp-ver">{d.current}</span></td>
                  <td><span className="esp-ver">{`${d.code}/ESP/${d.current.replace(/\s+/g, "-").toUpperCase()}`}</span></td>
                  <td><StatusChip status={d.statusKey} /></td>
                  <td>{d.by}</td>
                  <td>{d.updated}</td>
                  <td data-align="right"><Btn size="sm" variant="secondary">View</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — STATION
   ═══════════════════════════════════════════════════════════════ */

const StepStation = ({ station, setStation }) => {
  const [q, setQ] = useStateEsp("");
  const list = STATIONS.filter((s) =>
    !q.trim() || s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="esp-wrap">
      <div className="esp-sec">
        <SecTitle>Select station</SecTitle>
        <Card>
          <Field label="Search by station name or code">
            <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Tarur or TRR" leadingIcon="search" />
          </Field>
          <div className="esp-filters">
            <Field label="Zone"><Select><option>SCR — South Central Railway</option></Select></Field>
            <Field label="Division"><Select><option>All divisions</option><option>Vijayawada</option><option>Guntur</option></Select></Field>
            <Field label="Section"><Select><option>All sections</option></Select></Field>
            <Field label="Category"><Select><option>All categories</option><option>NSG-4</option><option>NSG-5</option><option>NSG-6</option></Select></Field>
            <Field label="Status"><Select><option>All</option><option>Operational</option><option>Proposed</option></Select></Field>
          </div>
        </Card>
      </div>

      <div className="esp-sec">
        <Card title="Matching stations" sub={`${list.length} of ${STATIONS.length} in your scope`} bodyStyle={{ padding: 0 }}>
          <div className="esp-stationlist">
            {list.map((s) => (
              <div key={s.code} className="esp-stationrow" data-sel={station?.code === s.code} onClick={() => setStation(s)}>
                <Radio checked={station?.code === s.code} />
                <div className="esp-stationrow-main">
                  <div><span className="esp-td-station">{s.name}</span><span className="esp-code">{s.code}</span></div>
                  <div className="esp-stationrow-meta">{s.zone} · {s.division} division · {s.section} · {s.category}</div>
                </div>
                <Chip tone={s.status === "Operational" ? "success" : "info"} dot>{s.status}</Chip>
              </div>
            ))}
            {list.length === 0 && <div className="esp-empty">No station matches “{q}”.</div>}
          </div>
        </Card>
      </div>

      {station && (
        <div className="esp-2col">
          <div className="esp-sec" style={{ marginBottom: 0 }}>
            <SecTitle>Data readiness</SecTitle>
            <Card sub="What already exists for this station — you should not need to leave the module to find out." bodyStyle={{ padding: 0 }}>
              <div className="esp-tablewrap">
                <table className="esp-table">
                  <thead><tr><th>Dataset</th><th>Status</th><th data-align="right">Action</th></tr></thead>
                  <tbody>
                    {station.readiness.map((r) => (
                      <tr key={r.set}>
                        <td style={{ fontWeight: 650, color: "var(--ink-900)" }}>{r.set}</td>
                        <td>
                          <span className="esp-ready-status" style={{ color: `var(--${r.tone}-text)` }}>
                            <i style={{ background: TONE_COLOR[r.tone] }} />{r.status}
                          </span>
                        </td>
                        <td data-align="right"><Btn size="sm" variant="ghost">{r.action}</Btn></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="esp-sec" style={{ marginBottom: 0 }}>
            <SecTitle>Station summary</SecTitle>
            <Card>
              <dl className="esp-kv">
                <dt>Station</dt><dd>{station.name} ({station.code})</dd>
                <dt>Zone / Division</dt><dd>{station.zone} · {station.division}</dd>
                <dt>Section</dt><dd>{station.section}</dd>
                <dt>Adjacent stations</dt><dd>{station.adjacent.join(", ")}</dd>
                <dt>ESP versions</dt><dd>{station.espVersions.length ? station.espVersions.join(", ") : "None"}</dd>
                <dt>Latest approved ESP</dt><dd>{station.latest}</dd>
                <dt>Existing SIP</dt><dd>{station.sip}</dd>
                <dt>Survey / GIS data</dt><dd>{station.readiness.find((r) => r.set === "GIS data").status}</dd>
              </dl>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — BASE DATA  (create: scenario + sources · update: previous ESP)
   ═══════════════════════════════════════════════════════════════ */

const StepBaseData = ({ flow, station, scenario, setScenario, prevEsp, setPrevEsp, onGoLibrary }) => {
  const hasPrev = station && station.espVersions.length > 0;

  if (flow === "create") {
    return (
      <div className="esp-wrap">
        <div className="esp-sec">
          <SecTitle>Select creation scenario</SecTitle>
          <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginBottom: 12 }}>
            This controls which inputs and fields the rest of the workflow asks for.
          </div>
          <div className="esp-grid-3">
            {CREATE_SCENARIOS.map((s) => (
              <div key={s.id} className="esp-pick" data-sel={scenario === s.id} onClick={() => setScenario(s.id)}>
                <div className="esp-pick-head">
                  <div className="esp-pick-letter">{s.letter}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="esp-pick-title">{s.title}</div>
                  </div>
                  <Icon name={s.icon} size={16} style={{ marginLeft: "auto", color: "var(--ink-400)" }} />
                </div>
                <div className="esp-pick-desc">{s.desc}</div>
                <div className="esp-req">
                  <div className="esp-req-label">Provides</div>
                  {s.inputs.map((i) => <div className="esp-req-item" key={i} style={{ "--a": "var(--accent)" }}><Icon name="check" size={12} />{i}</div>)}
                </div>
                <div className="esp-pick-note">{s.optional}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="esp-sec">
          <SecTitle>Input source</SecTitle>
          <div className="esp-grid-3">
            {INPUT_SOURCES.map((s) => (
              <Card key={s.id}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Icon name={s.icon} size={17} style={{ color: "var(--accent)", marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-900)" }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── update flow ──
  return (
    <div className="esp-wrap">
      <div className="esp-sec">
        <SecTitle>Select previous ESP</SecTitle>
        {!hasPrev ? (
          <Card>
            <Note tone="danger" icon="alert">
              <b>No validated ESP is available for this station.</b>
              <div style={{ marginTop: 4 }}>
                Upload the previous ESP, extract its data and complete PIM validation. Your station,
                Update mode, draft id and current step are all preserved — you will come straight back here.
              </div>
            </Note>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <Btn variant="primary" leadingIcon="book" onClick={onGoLibrary}>Go to Station Digital Library</Btn>
              <Btn variant="secondary" leadingIcon="upload">Upload previous ESP</Btn>
              <Btn variant="secondary" leadingIcon="layers">Extract data</Btn>
              <Btn variant="secondary" leadingIcon="check_circle">Complete PIM validation</Btn>
            </div>
          </Card>
        ) : (
          <Card sub={`Only ESPs associated with ${station.name} (${station.code}) are listed.`} bodyStyle={{ padding: 0 }}>
            <div className="esp-stationlist">
              {PREV_ESPS.map((e) => (
                <div key={e.ver} className="esp-stationrow" data-sel={prevEsp === e.ver} onClick={() => setPrevEsp(e.ver)}>
                  <Radio checked={prevEsp === e.ver} />
                  <div className="esp-stationrow-main">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="esp-td-station">{e.ver}</span>
                      <Chip tone={e.status === "Approved" ? "success" : "neutral"} dot>{e.status}</Chip>
                      <span style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{e.date}</span>
                    </div>
                    <div className="esp-stationrow-meta">
                      {e.format} · created by {e.by} · approved by {e.approvedBy} · {e.sip} · {e.validated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP 3 — DESIGN INPUTS  (create) / PROPOSED CHANGES (update)
   ═══════════════════════════════════════════════════════════════ */

const InputStateChip = ({ state, meta }) => {
  if (state === "library") return <Chip tone="success" dot>In Digital Library</Chip>;
  if (state === "partial") return <Chip tone="warning" dot>Partial</Chip>;
  if (state === "missing") return <Chip tone="danger" dot>Missing</Chip>;
  return <Chip tone="neutral">Not provided</Chip>;
};

const StepDesignInputs = ({ flow, changeTypes, toggleChange, requirements, setRequirements }) => {
  if (flow === "create") {
    return (
      <div className="esp-wrap">
        <div className="esp-sec">
          <SecTitle>Primary inputs</SecTitle>
          <Card sub="Pick documents already validated in the Digital Library, or upload new ones." bodyStyle={{ padding: 0 }}>
            {PRIMARY_INPUTS.map((p) => (
              <div className="esp-inputrow" key={p.id}>
                <div className="esp-inputrow-main">
                  <div className="esp-inputrow-label">
                    {p.label}{p.req && <span className="esp-req-star">*</span>}
                  </div>
                  {p.meta && <div className="esp-inputrow-meta">{p.meta}</div>}
                </div>
                <InputStateChip state={p.state} />
                <Btn size="sm" variant={p.state === "library" ? "ghost" : "secondary"}>
                  {p.state === "library" ? "Replace" : p.state === "partial" ? "Complete" : "Add"}
                </Btn>
              </div>
            ))}
          </Card>
          <div style={{ marginTop: 12 }}>
            <Note tone="info" icon="info">
              Uploading a new PDF or AutoCAD file runs <b>upload → extract assets → PIM validation → save to
              Digital Library</b>, then returns you to this step. Workflow state is preserved throughout.
            </Note>
          </div>
        </div>

        <div className="esp-sec">
          <SecTitle>Design requirements</SecTitle>
          <Card>
            <div className="esp-grid-2">
              <Field label="Number of proposed lines" required>
                <TextInput value={requirements.lines} onChange={(e) => setRequirements({ ...requirements, lines: e.target.value })} />
              </Field>
              <Field label="Proposed platforms">
                <TextInput value={requirements.platforms} onChange={(e) => setRequirements({ ...requirements, platforms: e.target.value })} />
              </Field>
              <Field label="Proposed turnouts">
                <TextInput value={requirements.turnouts} onChange={(e) => setRequirements({ ...requirements, turnouts: e.target.value })} />
              </Field>
              <Field label="Available land area">
                <TextInput value={requirements.land} onChange={(e) => setRequirements({ ...requirements, land: e.target.value })} />
              </Field>
              <Field label="Adjacent station connection" required>
                <Select value={requirements.adjacent} onChange={(e) => setRequirements({ ...requirements, adjacent: e.target.value })}>
                  <option>Both ends</option><option>Up end only</option><option>Down end only</option>
                </Select>
              </Field>
              <Field label="Required connectivity">
                <Select value={requirements.connectivity} onChange={(e) => setRequirements({ ...requirements, connectivity: e.target.value })}>
                  <option>Full yard connectivity</option><option>Partial connectivity</option>
                </Select>
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Line types">
                <div className="esp-chiprow">
                  {LINE_TYPES.map((t) => (
                    <button key={t} className="esp-togglechip" data-on={requirements.lineTypes.includes(t)}
                      onClick={() => setRequirements({
                        ...requirements,
                        lineTypes: requirements.lineTypes.includes(t)
                          ? requirements.lineTypes.filter((x) => x !== t)
                          : [...requirements.lineTypes, t],
                      })}>{t}</button>
                  ))}
                </div>
              </Field>
            </div>
            <div style={{ marginTop: 14 }} className="esp-grid-2">
              <Field label="Operational requirements">
                <Textarea rows={3} value={requirements.ops} onChange={(e) => setRequirements({ ...requirements, ops: e.target.value })} />
              </Field>
              <Field label="Project constraints / zone-specific requirements">
                <Textarea rows={3} value={requirements.constraints} onChange={(e) => setRequirements({ ...requirements, constraints: e.target.value })} />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── update flow ──
  return (
    <div className="esp-wrap">
      <div className="esp-sec">
        <SecTitle>How are the changes provided?</SecTitle>
        <div className="esp-grid-3">
          {[
            { icon: "file", t: "Key plan" }, { icon: "edit", t: "Conceptual drawing" },
            { icon: "ruler", t: "Revised survey drawing" }, { icon: "file_check", t: "Contractor drawing" },
            { icon: "book", t: "Written requirements" }, { icon: "cursor", t: "Draw directly in editor" },
          ].map((s) => (
            <Card key={s.t}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name={s.icon} size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 12.5, fontWeight: 650, color: "var(--ink-900)" }}>{s.t}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="esp-sec">
        <SecTitle n={`${changeTypes.length} selected`}>Change type</SecTitle>
        <Card>
          <div className="esp-chiprow">
            {CHANGE_TYPES.map((c) => (
              <button key={c} className="esp-togglechip" data-on={changeTypes.includes(c)} onClick={() => toggleChange(c)}>{c}</button>
            ))}
          </div>
        </Card>
      </div>

      <div className="esp-sec">
        <SecTitle>Intervention area</SecTitle>
        <Card>
          <div className="esp-grid-2">
            <Field label="Affected tracks"><Select><option>Loop line 1, Loop line 2</option></Select></Field>
            <Field label="Affected assets"><Select><option>Turnout 14A, Platform 2</option></Select></Field>
            <Field label="From chainage"><TextInput defaultValue="412/1" /></Field>
            <Field label="To chainage"><TextInput defaultValue="413/4" /></Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Change description" help="Describe the remodelling intent for the reviewer.">
              <Textarea rows={3} defaultValue="Provide a third loop line on the down side and extend Platform 2 to 600 m to accommodate 24-coach rakes." />
            </Field>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn variant="secondary" leadingIcon="select_rect">Mark area on previous ESP</Btn>
            <Btn variant="secondary" leadingIcon="upload">Attach supporting document</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP 4 — REVIEW INPUTS → GENERATE
   ═══════════════════════════════════════════════════════════════ */

const READINESS_ISSUES = [
  { tone: "danger", text: "Key plan is a mandatory input and has not been provided." },
  { tone: "warning", text: "Constraints data is only partially available (3 of 5 categories)." },
  { tone: "warning", text: "Extracted assets for the previous ESP require PIM re-validation." },
];

const StepGenerate = ({ flow, station, scenario, generating, progress, onGenerate }) => {
  if (generating) {
    const pct = Math.round(((progress + 1) / GEN_STAGES.length) * 100);
    return (
      <div className="esp-genwrap">
        <div style={{ fontSize: 16, fontWeight: 750, color: "var(--ink-900)" }}>Generating ESP options</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 4, marginBottom: 16 }}>
          {station?.name} ({station?.code}) · {flow === "create" ? "Create" : "Update"} ESP
        </div>
        {GEN_STAGES.map((s, i) => {
          const state = i < progress ? "done" : i === progress ? "active" : "pending";
          return (
            <div className="esp-genstage" key={s} data-state={state}>
              <div className="esp-genstage-dot">
                {state === "done" ? <Icon name="check" size={12} /> : state === "active" ? <span className="esp-spin" /> : null}
              </div>
              <div className="esp-genstage-label">{s}</div>
            </div>
          );
        })}
        <div className="esp-progressbar"><div style={{ width: `${pct}%` }} /></div>
      </div>
    );
  }

  return (
    <div className="esp-wrap">
      <div className="esp-sec">
        <SecTitle>Review inputs before generation</SecTitle>
        <div className="esp-2col">
          <Card title="Consolidated readiness" bodyStyle={{ padding: 0 }}>
            {[
              { k: "Station information", v: `${station?.name} (${station?.code}) · ${station?.division} division` },
              { k: "Selected source documents", v: "6 documents · 5 validated, 1 partial" },
              { k: "Extracted and validated assets", v: "412 assets · PIM validated 14 Aug 2026" },
              { k: "Proposed design requirements", v: flow === "create" ? "4 lines · 2 platforms · 6 turnouts" : "3 change types · CH 412/1–413/4" },
              { k: "GIS / survey information", v: "Total Station + GIS available" },
              { k: "Cost and physical constraints", v: "Cost data not provided · constraints partial" },
              { k: "Applicable zone template", v: "SCR yard template v4" },
              { k: "Applicable S-O-D and engineering rules", v: "IRSOD 2024 + SCR zone rules 2026.2" },
            ].map((r) => (
              <div className="esp-inputrow" key={r.k}>
                <div className="esp-inputrow-main">
                  <div className="esp-inputrow-label">{r.k}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>{r.v}</div>
                </div>
                <Btn size="sm" variant="ghost">View</Btn>
              </div>
            ))}
          </Card>

          <div>
            <Card title="Readiness validation" sub={`${READINESS_ISSUES.length} items need attention`}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {READINESS_ISSUES.map((i) => (
                  <Note key={i.text} tone={i.tone} icon={i.tone === "danger" ? "alert" : "alert_tri"}>{i.text}</Note>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <Btn variant="primary" leadingIcon="spark" onClick={onGenerate} style={{ width: "100%", justifyContent: "center" }}>
                  Generate ESP Options
                </Btn>
                <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 8, textAlign: "center" }}>
                  Generation proceeds with warnings, but not with missing mandatory inputs.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP 5 — COMPARE
   ═══════════════════════════════════════════════════════════════ */

const OptionThumb = ({ id }) => (
  <svg viewBox="0 0 300 118" width="100%" height="118" preserveAspectRatio="none">
    <rect width="300" height="118" fill="none" />
    {[38, 52, 66, 80].slice(0, id === 3 ? 3 : 4).map((y, i) => (
      <line key={y} x1="16" y1={y} x2="284" y2={y} stroke={i < 2 ? "#0E1B2C" : "#94A3B8"} strokeWidth={i < 2 ? 1.6 : 1.1} />
    ))}
    {id !== 3 && <line x1="60" y1="94" x2="240" y2="94" stroke="#DC2626" strokeWidth="1.4" strokeDasharray="5 3" />}
    {id === 2 && <line x1="60" y1="106" x2="240" y2="106" stroke="#DC2626" strokeWidth="1.4" strokeDasharray="5 3" />}
    <rect x="90" y="56" width="120" height="8" fill="#E8EDF4" stroke="#94A3B8" strokeWidth="0.8" />
    {[46, 96, 210, 250].slice(0, id === 3 ? 2 : 4).map((x) => (
      <path key={x} d={`M${x},38 L${x + 26},66`} stroke="#0E1B2C" strokeWidth="1.1" fill="none" />
    ))}
  </svg>
);

const StepCompare = ({ selected, setSelected, onOpenEditor, onRegenerate }) => {
  const [mode, setMode] = useStateEsp("cards");
  const best = (row) => {
    if (!row.better) return null;
    const vals = OPTIONS.map((o) => o[row.key]);
    const nums = vals.map((v) => (typeof v === "number" ? v : NaN));
    if (nums.some(isNaN)) return null;
    return row.better === "high" ? Math.max(...nums) : Math.min(...nums);
  };

  return (
    <div className="esp-wrap">
      <div className="esp-sec">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <SecTitle n="3 feasible options">ESP options</SecTitle>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <PillTabs items={[{ id: "cards", label: "Cards" }, { id: "compare", label: "Side by side" }]} active={mode} onChange={setMode} />
            <Btn size="sm" variant="secondary" leadingIcon="refresh" onClick={onRegenerate}>Regenerate</Btn>
          </div>
        </div>

        {mode === "cards" ? (
          <div className="esp-grid-3">
            {OPTIONS.map((o) => (
              <div key={o.id} className="esp-opt" data-sel={selected === o.id} onClick={() => setSelected(o.id)}>
                <div className="esp-opt-thumb">
                  <OptionThumb id={o.id} />
                  {o.recommended && <div className="esp-opt-badge"><Chip tone="accent" dot>Recommended</Chip></div>}
                </div>
                <div className="esp-opt-body">
                  <div className="esp-opt-name">{o.name}<Chip tone="neutral">{o.tag}</Chip></div>
                  <div className="esp-opt-score">
                    <span className="esp-opt-scoreval">{o.score}</span>
                    <span style={{ fontSize: 11.5, color: "var(--ink-500)" }}>compliance score</span>
                  </div>
                  <div className="esp-opt-metrics">
                    <div className="esp-metric"><span>S-O-D violations</span><b style={{ color: o.violations ? "var(--danger-text)" : "var(--success-text)" }}>{o.violations}</b></div>
                    <div className="esp-metric"><span>Warnings</span><b>{o.warnings}</b></div>
                    <div className="esp-metric"><span>Land use</span><b>{o.land}</b></div>
                    <div className="esp-metric"><span>New turnouts</span><b>{o.turnouts}</b></div>
                    <div className="esp-metric"><span>Track length</span><b>{o.trackLength}</b></div>
                    <div className="esp-metric"><span>Est. cost</span><b>{o.cost}</b></div>
                  </div>
                  <div className="esp-opt-rationale"><b style={{ color: "var(--ink-800)" }}>Why: </b>{o.rationale}</div>
                </div>
                <div className="esp-opt-foot">
                  <Btn size="sm" variant={selected === o.id ? "primary" : "secondary"} onClick={(e) => { e.stopPropagation(); setSelected(o.id); }}>
                    {selected === o.id ? "Selected" : "Select"}
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(o.id); onOpenEditor(); }}>Open in editor</Btn>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card bodyStyle={{ padding: 0 }} foot={<>
            <span>Differences-only layer and common/changed asset counts are available inside the editor.</span>
            <span>{OPTIONS.filter((o) => o.violations === 0).length} option(s) with zero violations</span>
          </>}>
            <div className="esp-tablewrap">
              <table className="esp-table esp-cmp">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    {OPTIONS.map((o) => <th key={o.id} data-align="right">{o.name}{o.recommended ? " ★" : ""}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => {
                    const b = best(row);
                    return (
                      <tr key={row.label}>
                        <td style={{ fontWeight: 650, color: "var(--ink-900)" }}>{row.label}</td>
                        {OPTIONS.map((o) => (
                          <td key={o.id} data-align="right" data-best={b != null && o[row.key] === b}>{o[row.key]}</td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr>
                    <td style={{ fontWeight: 650, color: "var(--ink-900)" }}>Selection</td>
                    {OPTIONS.map((o) => (
                      <td key={o.id} data-align="right">
                        <Btn size="sm" variant={selected === o.id ? "primary" : "secondary"} onClick={() => setSelected(o.id)}>
                          {selected === o.id ? "Selected" : "Select"}
                        </Btn>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div style={{ marginTop: 14 }}>
          <Note tone="info" icon="info">
            The system recommends <b>Option 1</b>, but the final selection is yours. You can also modify the
            requirements and regenerate.
          </Note>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP 6 — EDITOR & VALIDATION
   ═══════════════════════════════════════════════════════════════ */

const StepEditor = ({ station, flow, selected, layers, setLayers, tool, setTool, onValidate }) => {
  const toggleLayer = (id) => setLayers(layers.map((l) => (l.id === id ? { ...l, on: !l.on } : l)));
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div className="esp-editor">
        {/* left */}
        <div className="esp-ed-panel">
          <div className="esp-ed-ptitle">Layers</div>
          <div className="esp-ed-scroll">
            {layers.map((l) => (
              <div className="esp-layer" key={l.id} data-off={!l.on} onClick={() => toggleLayer(l.id)}>
                <Icon name={l.on ? "eye" : "eye_off"} size={13} />
                <i style={{ background: l.colour }} />
                <span className="esp-layer-name">{l.label}</span>
                <span className="esp-layer-count">{l.count}</span>
              </div>
            ))}
            <div className="esp-ed-ptitle" style={{ borderTop: "var(--hairline)" }}>Source documents</div>
            {["TRR-ESP-V2.dwg", "TRR-CONCEPT-v2.dwg", "TRR-TS-2026.csv", "TRR-GIS.shp"].map((d) => (
              <div className="esp-layer" key={d}><Icon name="file" size={13} /><span className="esp-layer-name">{d}</span></div>
            ))}
            <div className="esp-ed-ptitle" style={{ borderTop: "var(--hairline)" }}>Validation results</div>
            <div className="esp-layer"><i style={{ background: "var(--danger)" }} /><span className="esp-layer-name">Violations</span><span className="esp-layer-count">{VALIDATION.violations}</span></div>
            <div className="esp-layer"><i style={{ background: "var(--warning)" }} /><span className="esp-layer-name">Warnings</span><span className="esp-layer-count">{VALIDATION.warnings}</span></div>
          </div>
        </div>

        {/* centre */}
        <div className="esp-ed-centre">
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: "var(--hairline)", background: "var(--paper)", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 750, color: "var(--ink-900)" }}>{station?.name} ({station?.code})</span>
            <Chip tone="neutral">{flow === "create" ? "Create ESP" : "Update ESP"}</Chip>
            {flow === "update" && <Chip tone="neutral">Base V2</Chip>}
            <Chip tone="accent">Draft V3</Chip>
            <Chip tone="info" dot>Option {selected}</Chip>
            <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
              <Btn size="sm" variant="secondary" leadingIcon="save">Save</Btn>
              <Btn size="sm" variant="secondary" leadingIcon="shield" onClick={onValidate}>Run Validation</Btn>
              <Btn size="sm" variant="primary" trailingIcon="arrow_right">Submit for Review</Btn>
              <Btn size="sm" variant="ghost" iconOnly leadingIcon="more" title="More actions" />
            </div>
          </div>
          <div className="esp-canvas"><YardDrawing layers={layers} /></div>
          <div className="esp-toolbar">
            {EDITOR_TOOLS.map((t, i) => (
              <React.Fragment key={t.id}>
                {(i === 1 || i === 4) && <span className="esp-tool-sep" />}
                <button className="esp-tool" data-active={tool === t.id} title={t.label} onClick={() => setTool(t.id)}>
                  <Icon name={t.icon} size={15} />
                </button>
              </React.Fragment>
            ))}
            <span className="esp-tool-sep" />
            <button className="esp-tool" title="Undo"><Icon name="undo" size={15} /></button>
            <button className="esp-tool" title="Redo"><Icon name="redo" size={15} /></button>
            <span className="esp-tool-sep" />
            <button className="esp-tool" title="Zoom in"><Icon name="zoom_in" size={15} /></button>
            <button className="esp-tool" title="Zoom out"><Icon name="zoom_out" size={15} /></button>
            <button className="esp-tool" title="Fit"><Icon name="fit_screen" size={15} /></button>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-400)", paddingRight: 6 }}>
              Snapping on · grid 1 m · CH 411/0 – 414/2
            </span>
          </div>
        </div>

        {/* right */}
        <div className="esp-ed-panel">
          <div className="esp-ed-ptitle">Properties — Turnout 14A</div>
          <div className="esp-ed-scroll">
            {[
              ["Asset type", "Turnout"], ["Asset number", "T-14A"], ["Geometry", "1 in 12 L.H."],
              ["Chainage", "412/1"], ["Track association", "Main line 2 → Loop 3"],
              ["Status", "Proposed"], ["Switch length", "10.125 m"], ["Layer", "Proposed changes"],
              ["Rule status", "1 violation"], ["Change reason", "New loop connectivity"],
            ].map(([k, v]) => (
              <div className="esp-prop" key={k}><span>{k}</span><b>{v}</b></div>
            ))}
            <div style={{ padding: 14 }}>
              <Note tone="danger" icon="alert">Fouling mark clearance 3.90 m — required ≥ 4.25 m (IRSOD 3.3).</Note>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepValidate = ({ onBackToEditor }) => {
  const [open, setOpen] = useStateEsp(null);
  const tiles = [
    { n: VALIDATION.passed, l: "Rules passed", c: "var(--success-text)" },
    { n: VALIDATION.violations, l: "Violations", c: "var(--danger-text)" },
    { n: VALIDATION.warnings, l: "Warnings", c: "var(--warning-text)" },
    { n: VALIDATION.na, l: "Not applicable", c: "var(--ink-500)" },
    { n: VALIDATION.manual, l: "Manual confirmation", c: "var(--info-text)" },
    { n: VALIDATION.condonation, l: "Condonation required", c: "var(--accent-text)" },
  ];
  return (
    <div className="esp-wrap">
      <div className="esp-sec">
        <SecTitle>Validation summary</SecTitle>
        <div className="esp-valgrid">
          {tiles.map((t) => (
            <div className="esp-valtile" key={t.l}>
              <div className="esp-valtile-n" style={{ color: t.c }}>{t.n}</div>
              <div className="esp-valtile-l">{t.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="esp-sec">
        <SecTitle>Results</SecTitle>
        <Card sub="Click a result to zoom to the asset and see measured vs required values." bodyStyle={{ padding: 0 }}>
          {VALIDATION.results.map((r) => (
            <React.Fragment key={r.id}>
              <div className="esp-valrow" data-open={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)}>
                <div className="esp-valsev" data-sev={r.sev}><Icon name={r.sev === "violation" ? "alert" : "alert_tri"} size={13} /></div>
                <div className="esp-valrow-main">
                  <div className="esp-valrow-title">{r.title}</div>
                  <div className="esp-valrow-meta">{r.asset} · CH {r.ch} · <span style={{ fontFamily: "var(--font-mono)" }}>{r.rule}</span></div>
                </div>
                <Icon name={open === r.id ? "chevron_up" : "chevron_down"} size={14} style={{ color: "var(--ink-400)", marginTop: 3 }} />
              </div>
              {open === r.id && (
                <div className="esp-valdetail">
                  <div className="esp-valmeasure">
                    <div>Measured<b data-bad={r.sev === "violation"}>{r.measured}</b></div>
                    <div>Required<b>{r.required}</b></div>
                    <div>Rule reference<b style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{r.rule}</b></div>
                    <div>Chainage<b>{r.ch}</b></div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-600)", lineHeight: 1.5, marginBottom: 12 }}>{r.note}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Btn size="sm" variant="secondary" leadingIcon="target" onClick={onBackToEditor}>Zoom to asset</Btn>
                    <Btn size="sm" variant="secondary" leadingIcon="edit" onClick={onBackToEditor}>Correct in editor</Btn>
                    <Btn size="sm" variant="secondary" leadingIcon="file_check">Request condonation</Btn>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP 7 — REVIEW & FINALIZE
   ═══════════════════════════════════════════════════════════════ */

const StepFinalize = ({ finalized, onSubmit, onFinalize }) => {
  const outstanding = FINAL_CHECKLIST.filter((c) => !c.done).length;
  return (
    <div className="esp-wrap">
      <div className="esp-2col">
        <div>
          <div className="esp-sec">
            <SecTitle n={outstanding ? `${outstanding} outstanding` : "complete"}>Final review checklist</SecTitle>
            <Card bodyStyle={{ padding: 0 }}>
              {FINAL_CHECKLIST.map((c) => (
                <div className="esp-check" key={c.id} data-done={c.done}>
                  <div className="esp-check-box">{c.done && <Icon name="check" size={12} />}</div>
                  <span className="esp-check-label">{c.label}</span>
                  {!c.done && <Btn size="sm" variant="ghost">Resolve</Btn>}
                </div>
              ))}
            </Card>
          </div>

          {finalized && (
            <div className="esp-sec">
              <SecTitle>Final output — saved to the Digital Library</SecTitle>
              <Card bodyStyle={{ padding: 0 }}>
                {FINAL_OUTPUTS.map((o) => (
                  <div className="esp-inputrow" key={o.label}>
                    <Icon name={o.icon} size={15} style={{ color: "var(--success)" }} />
                    <div className="esp-inputrow-main">
                      <div className="esp-inputrow-label">{o.label}</div>
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--ink-500)", fontFamily: "var(--font-mono)" }}>{o.meta}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>

        <div>
          <Card title="Submission">
            {outstanding > 0 ? (
              <Note tone="warning" icon="alert_tri">
                {outstanding} checklist item{outstanding > 1 ? "s" : ""} outstanding, including S-O-D validation.
                An ESP cannot be finalized until validation is complete.
              </Note>
            ) : (
              <Note tone="success" icon="check_circle">All checks complete. Ready to submit.</Note>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              <Btn variant="primary" trailingIcon="arrow_right" onClick={onSubmit} style={{ justifyContent: "center" }}>Submit for Review</Btn>
              <Btn variant="secondary" leadingIcon="check_circle" disabled={!finalized && outstanding > 0} onClick={onFinalize} style={{ justifyContent: "center" }}>
                Finalize ESP
              </Btn>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-400)", marginTop: 10, lineHeight: 1.5 }}>
              Finalizing assigns the version number, generates PDF and DWG/DXF, stores the editable ESP with
              its asset data, validation results and traceability, and unlocks SIP generation.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   STATION PICKER  (Update ESP)
   ═══════════════════════════════════════════════════════════════ */

// Zone codes spelled out for the derived context chain.
const ZONE_NAMES = { SCR: "South Central Railway" };

// Emphasise the matched fragment so the reason a row is listed is obvious.
const espHighlight = (text, q) => {
  const h = React.createElement;
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return text;
  return [text.slice(0, i), h("mark", { key: "hit" }, text.slice(i, i + q.length)), text.slice(i + q.length)];
};

// Station is the only thing worth asking for: picking one resolves its zone,
// division and section, so those are demoted to optional scope filters behind
// a collapsed disclosure.
const StationPicker = ({ station, onPick }) => {
  const h = React.createElement;
  const [query, setQuery] = useStateEsp("");
  const [open, setOpen] = useStateEsp(false);
  const [active, setActive] = useStateEsp(0);
  const [showFilters, setShowFilters] = useStateEsp(false);
  const [division, setDivision] = useStateEsp("");
  const [section, setSection] = useStateEsp("");
  const boxRef = useRefEsp(null);
  const inputRef = useRefEsp(null);

  const divisions = [...new Set(STATIONS.map((s) => s.division))];
  const sections = [...new Set(STATIONS.filter((s) => !division || s.division === division).map((s) => s.section))];
  const q = query.trim().toLowerCase();
  const matches = STATIONS.filter((s) => (!division || s.division === division) && (!section || s.section === section) &&
    (!q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)));
  const filterCount = (division ? 1 : 0) + (section ? 1 : 0);

  // A click outside the combobox dismisses the list.
  useEffectEsp(() => {
    if (!open) return;
    const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const pick = (s) => { onPick(s); setQuery(""); setOpen(false); setActive(0); };
  const change = () => { onPick(null); setQuery(""); setOpen(true); setTimeout(() => inputRef.current && inputRef.current.focus(), 0); };
  const resetFilters = () => { setDivision(""); setSection(""); setActive(0); };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      if (!matches.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + matches.length) % matches.length);
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault();
      pick(matches[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Chosen state — the station stands in for the whole hierarchy.
  if (station) {
    return h("div", { className: "esp-picked" },
      h("div", { className: "esp-picked-badge" }, h(Icon, { name: "check", size: 13 })),
      h("div", { className: "esp-picked-main" },
        h("div", { className: "esp-picked-name" },
          station.name,
          h("span", { className: "esp-code" }, station.code),
          h(Chip, { tone: station.status === "Operational" ? "success" : "info", dot: true }, station.status)),
        h("div", { className: "esp-picked-chain" },
          h("span", null, ZONE_NAMES[station.zone] || station.zone),
          h(Icon, { name: "chevron_right", size: 11 }),
          h("span", null, `${station.division} Division`),
          h(Icon, { name: "chevron_right", size: 11 }),
          h("span", null, station.section)),
        h("div", { className: "esp-picked-note" }, "Zone, division and section resolved from the station — nothing further to select.")
      ),
      h(Btn, { size: "sm", variant: "ghost", leadingIcon: "refresh", onClick: change }, "Change")
    );
  }

  return h("div", { className: "esp-picker", ref: boxRef },
    h(Field, { label: "Station", required: true, help: "Zone, division and section follow from the station you pick." },
      h("div", { className: "esp-combo" },
        h("div", { className: "ds-input-group", "data-has-left": "true" },
          h(Icon, { name: "search", className: "icon-left", size: 15 }),
          h("input", {
            className: "ds-input", ref: inputRef, value: query, autoComplete: "off",
            role: "combobox", "aria-expanded": open, "aria-autocomplete": "list",
            placeholder: "Search by station name or code — e.g. Tarur or TRR",
            onChange: (e) => { setQuery(e.target.value); setOpen(true); setActive(0); },
            onFocus: () => setOpen(true), onKeyDown
          })
        ),
        open && h("div", { className: "esp-combo-menu", role: "listbox" },
          matches.length ? matches.map((s, i) => h("div", {
            key: s.code, className: "esp-combo-opt", role: "option", "aria-selected": i === active,
            "data-active": i === active, onMouseEnter: () => setActive(i),
            onMouseDown: (e) => { e.preventDefault(); pick(s); }
          },
            h("div", { className: "esp-combo-opt-main" },
              h("div", null,
                h("span", { className: "esp-td-station" }, espHighlight(s.name, q)),
                h("span", { className: "esp-code" }, espHighlight(s.code, q))),
              h("div", { className: "esp-stationrow-meta" }, `${s.zone} · ${s.division} division · ${s.section} · ${s.category}`)),
            h(Chip, { tone: s.status === "Operational" ? "success" : "info", dot: true }, s.status)
          )) : h("div", { className: "esp-combo-empty" },
            h(Icon, { name: "search", size: 18 }),
            h("div", { style: { marginTop: 8, fontWeight: 650, color: "var(--ink-700)" } },
              query ? `No station matches “${query}”` : "No station in the current scope"),
            h("div", { style: { marginTop: 3 } },
              filterCount ? "Try clearing the advanced filters." : "Check the spelling, or search by station code.")
          )
        )
      )
    ),
    h("div", { className: "esp-adv" },
      h("button", { type: "button", className: "esp-adv-toggle", "data-open": showFilters, "aria-expanded": showFilters, onClick: () => setShowFilters(!showFilters) },
        h(Icon, { name: "filter", size: 13 }),
        "Advanced filters",
        filterCount > 0 && h("span", { className: "esp-adv-count" }, filterCount),
        h(Icon, { name: "chevron_down", size: 13, className: "esp-adv-caret" })
      ),
      showFilters && h("div", { className: "esp-adv-panel" },
        h(Field, { label: "Zone" }, h(Select, { value: "SCR", disabled: true }, h("option", { value: "SCR" }, "SCR — South Central Railway"))),
        h(Field, { label: "Division" }, h(Select, { value: division, onChange: (e) => { setDivision(e.target.value); setSection(""); setActive(0); } },
          h("option", { value: "" }, "All divisions"), divisions.map((v) => h("option", { key: v, value: v }, v)))),
        h(Field, { label: "Section" }, h(Select, { value: section, onChange: (e) => { setSection(e.target.value); setActive(0); } },
          h("option", { value: "" }, "All sections"), sections.map((v) => h("option", { key: v, value: v }, v)))),
        h("div", { className: "esp-adv-foot" },
          h("span", null, `${matches.length} of ${STATIONS.length} stations in scope`),
          h(Btn, { size: "sm", variant: "ghost", disabled: !filterCount, onClick: resetFilters }, "Reset filters"))
      )
    )
  );
};

const UpdateEspPage = ({ station, setStation, selectedEsp, setSelectedEsp, keyPlan, setKeyPlan, onGoLibrary, onOpenEditor, onExit }) => {
  const h = React.createElement;
  const espRows = station ? station.espVersions.map((version, index) => ({
    drawing: `${station.code}-ESP-${String(index + 1).padStart(3, "0")}`,
    file: `${station.code}_ESP_${version.split(" ")[0]}.${index === 0 ? "dwg" : "pdf"}`,
    version: version.split(" ")[0],
    status: version.includes("Approved") ? "Approved" : version.includes("Superseded") ? "Superseded" : "Available",
    updated: index === 0 ? "12 Jul 2026" : "04 Jan 2025"
  })) : [];
  const chooseStation = (s) => { setStation(s || null); setSelectedEsp(""); };
  return h("div", { className: "esp-page" },
    h("div", { className: "esp-topbar" },
      h("div", { className: "esp-titlerow" },
        h("div", null, h("div", { className: "esp-title" }, "Update ESP"), h("div", { className: "esp-sub" }, "Select a station and choose the ESP drawing to update.")),
        h("div", { className: "esp-titlerow-actions" }, h(Btn, { variant: "ghost", leadingIcon: "x", onClick: onExit }, "Exit"))
      )
    ),
    h("div", { className: "esp-body" }, h("div", { className: "esp-update-page" },
      h("div", { className: "esp-sec" }, h(SecTitle, null, "Select Station"),
        h(Card, null, h(StationPicker, { station, onPick: chooseStation }))),
      station && h("div", { className: "esp-sec" }, h(SecTitle, { n: `${espRows.length} drawing${espRows.length === 1 ? "" : "s"}` }, "Select ESP"),
        espRows.length ? h(Card, { bodyStyle: { padding: 0 } }, h("div", { className: "esp-tablewrap" }, h("table", { className: "esp-table" },
          h("thead", null, h("tr", null, h("th", null, "Select"), h("th", null, "ESP"), h("th", null, "Drawing Number"), h("th", null, "Version"), h("th", null, "Status"), h("th", null, "Last Updated"))),
          h("tbody", null, espRows.map((row) => h("tr", { key: row.drawing, onClick: () => setSelectedEsp(row.version), style: { cursor: "pointer", background: selectedEsp === row.version ? "var(--accent-soft)" : undefined } },
            h("td", null, h(Radio, { checked: selectedEsp === row.version })), h("td", null, row.file), h("td", null, h("span", { className: "esp-td-station" }, row.drawing)), h("td", null, h("span", { className: "esp-ver" }, row.version)), h("td", null, h(Chip, { tone: row.status === "Approved" ? "success" : "neutral", dot: true }, row.status)), h("td", null, row.updated)
          )))
        ))) : h("div", { className: "esp-empty" }, h(Icon, { name: "file", size: 24 }), h("div", { style: { marginTop: 10, fontWeight: 700, color: "var(--ink-900)" } }, "No ESP is available for this station"), h("div", { style: { marginTop: 5 } }, "Upload an ESP in the station’s Digital Library before starting an update."), h("div", { style: { marginTop: 14 } }, h(Btn, { variant: "primary", leadingIcon: "upload", onClick: onGoLibrary }, "Upload ESP in Digital Library")))
      ),
      station && espRows.length > 0 && h("div", { className: "esp-update-uploadbar" }, h("div", null, h("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-900)" } }, "Need to use a different ESP?"), h("div", { className: "esp-card-sub" }, "Upload another drawing to this station’s Digital Library.")), h(Btn, { variant: "secondary", leadingIcon: "upload", onClick: onGoLibrary }, "Upload New ESP")),
      station && espRows.length > 0 && h("div", { className: "esp-sec", style: { marginTop: 22 } }, h(SecTitle, null, "Upload Key Plan"), h(Card, null,
        h("div", { className: "esp-update-file" }, h(Icon, { name: "upload", size: 18, style: { color: "var(--accent)" } }), h("div", { style: { flex: 1 } }, h("div", { style: { fontWeight: 700, fontSize: 13 } }, "Upload Key Plan (optional)"), h("div", { className: "esp-card-sub" }, keyPlan || "PDF, DWG or DXF; you can continue without it.")), h("input", { type: "file", accept: ".pdf,.dwg,.dxf", onChange: (e) => setKeyPlan(e.target.files && e.target.files[0] ? e.target.files[0].name : "") })),
        h("div", { style: { marginTop: 12 } }, h(Note, { tone: "info", icon: "info" },
          keyPlan ? "The editor will show this key plan in red over the approved ESP."
            : "Without a key plan the editor lets you draw one in red over the approved ESP, and generates the updated ESP from what you draw."))
      )),
      station && espRows.length > 0 && h("div", { className: "esp-update-actions" }, h(Btn, { variant: "primary", trailingIcon: "arrow_right", disabled: !selectedEsp, onClick: onOpenEditor }, "Open Editor"))
    ))
  );
};

/* ═══════════════════════════════════════════════════════════════
   UPDATE ESP — KEY PLAN EDITOR, GENERATED OPTIONS, FINAL SELECTION
   ═══════════════════════════════════════════════════════════════ */

// The approved ESP is read in black and everything that comes from the key plan
// is read in red, so the key plan is the only red layer while it is being placed.
const KEYPLAN_LAYERS = [
  { id: "prev", label: "Approved ESP (base)", count: 412, colour: "#0E1B2C", on: true },
  { id: "keyplan", label: "Key plan", count: 24, colour: "#DC2626", on: true },
  { id: "constraints", label: "Constraints", count: 7, colour: "#B45309", on: true },
  { id: "assets", label: "Extracted assets", count: 412, colour: "#3737C8", on: false },
  { id: "gis", label: "GIS / survey reference", count: 2, colour: "#0D9488", on: false },
];

const OPTION_LAYERS = [
  { id: "prev", label: "Approved ESP (base)", count: 412, colour: "#0E1B2C", on: true },
  { id: "proposed", label: "Generated changes", count: 38, colour: "#DC2626", on: true },
  { id: "keyplan", label: "Key plan", count: 24, colour: "#DC2626", on: false },
  { id: "sod", label: "S-O-D violations", count: 3, colour: "#BE123C", on: true },
  { id: "constraints", label: "Constraints", count: 7, colour: "#B45309", on: true },
];

const KEYPLAN_TOOLS = [
  { id: "select", icon: "cursor", label: "Select" },
  { id: "draw", icon: "edit", label: "Draw key plan" },
  { id: "measure", icon: "ruler", label: "Measure" },
];

// An uploaded key plan, drawn as red linework over the approved ESP.
const KeyPlanArt = ({ width }) => {
  const h = React.createElement;
  const red = { fontSize: 9.5, fontWeight: 800, fill: "#DC2626", stroke: "none" };
  return h("g", { fill: "none", stroke: "#DC2626", strokeWidth: 1.6 },
    h("rect", { x: 150, y: 72, width: width - 300, height: 228, strokeDasharray: "9 5" }),
    h("text", { x: 156, y: 66, ...red, fontSize: 10 }, "KEY PLAN — STATION LIMITS"),
    h("line", { x1: 40, y1: 150, x2: 150, y2: 150, strokeWidth: 2.2 }),
    h("text", { x: 44, y: 142, ...red, fontWeight: 700 }, "← GUDIVADA (GDV) 11.4 km"),
    h("line", { x1: width - 150, y1: 150, x2: width - 40, y2: 150, strokeWidth: 2.2 }),
    h("text", { x: width - 152, y: 142, ...red, fontWeight: 700 }, "PEDANA (PDN) 9.8 km →"),
    h("line", { x1: 300, y1: 292, x2: 1400, y2: 292, strokeWidth: 2, strokeDasharray: "10 5" }),
    h("text", { x: 306, y: 286, ...red }, "KEY PLAN — PROPOSED LOOP LINE 3"),
    h("path", { d: "M1320,248 L1410,292", strokeWidth: 1.8, strokeDasharray: "8 4" }),
    h("rect", { x: 950, y: 256, width: 148, height: 26, strokeDasharray: "6 4" }),
    h("text", { x: 958, y: 273, ...red }, "PF-2 EXTENSION"),
    h("circle", { cx: width - 92, cy: 92, r: 15, strokeWidth: 1.4 }),
    h("path", { d: `M${width - 92},80 L${width - 92},104 M${width - 98},86 L${width - 92},80 L${width - 86},86`, strokeWidth: 1.4 }),
    h("text", { x: width - 96, y: 120, ...red }, "N")
  );
};

/* The editor canvas: approved ESP underneath, key plan on top. With `drawing`
   on, pointer strokes are captured into the same red key plan layer — that is
   how a station with no uploaded key plan gets one. */
const KeyPlanCanvas = ({ layers, showKeyPlan, strokes, setStrokes, drawing, width = 1680, height = 330 }) => {
  const h = React.createElement;
  const ref = useRefEsp(null);
  const [live, setLive] = useStateEsp(null);
  const at = (e) => {
    const box = ref.current.getBoundingClientRect();
    return [Math.round(e.clientX - box.left), Math.round(e.clientY - box.top)];
  };
  const start = (e) => { if (!drawing) return; e.preventDefault(); setLive([at(e)]); };
  const move = (e) => { if (!drawing || !live) return; setLive(live.concat([at(e)])); };
  const end = () => {
    if (!live) return;
    if (live.length > 1) setStrokes(strokes.concat([live]));
    setLive(null);
  };
  const d = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return h("svg", {
      ref, width, height, className: "esp-kp-canvas", "data-draw": drawing ? "true" : "false",
      onMouseDown: start, onMouseMove: move, onMouseUp: end, onMouseLeave: end },
    h(YardDrawing, { layers, width }),
    showKeyPlan && h(KeyPlanArt, { width }),
    h("g", { fill: "none", stroke: "#DC2626", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" },
      strokes.map((s, i) => h("path", { key: `stroke-${i}`, d: d(s) })),
      live && live.length > 1 && h("path", { d: d(live), strokeDasharray: "7 4" })
    )
  );
};

const EdPanelTitle = ({ children }) =>
  React.createElement("div", { className: "esp-ed-ptitle", style: { borderTop: "var(--hairline)" } }, children);

/* One editor doing two jobs: placing the key plan on the approved ESP
   (`keyplan`), and reviewing one generated option before it is made final
   (`option`). */
const UpdateEditorPage = ({ station, baseEsp, mode, keyPlan, strokes, setStrokes, layers, setLayers,
                            tool, setTool, option, onGenerate, onSelectFinal, onBack, onExit }) => {
  const h = React.createElement;
  const isOption = mode === "option";
  const hasPlan = !!keyPlan || strokes.length > 0;
  const keyPlanLayer = layers.find((l) => l.id === "keyplan");
  // Nothing is drawn on, or into, a hidden key plan layer.
  const keyPlanOn = !!(keyPlanLayer && keyPlanLayer.on);
  const drawing = !isOption && !keyPlan && keyPlanOn && tool === "draw";
  const showKeyPlan = !!keyPlan && keyPlanOn;
  const toggleLayer = (id) => setLayers(layers.map((l) => (l.id === id ? { ...l, on: !l.on } : l)));
  const code = station ? station.code : "—";
  const name = station ? station.name : "—";

  const optionProps = isOption ? [
    ["Option", option.name], ["Profile", option.tag], ["Compliance score", String(option.score)],
    ["S-O-D violations", String(option.violations)], ["Warnings", String(option.warnings)],
    ["Land utilization", option.land], ["New turnouts", String(option.turnouts)],
    ["Proposed track length", option.trackLength], ["Connectivity", option.connectivity],
    ["Estimated cost", option.cost], ["Major constraints", option.constraints],
  ] : [];

  return h("div", { className: "esp-page" },
    h("div", { className: "esp-topbar" },
      h("div", { className: "esp-titlerow" },
        h("div", null,
          h("div", { className: "esp-title" }, isOption ? `ESP Editor — ${option.name}` : "ESP Editor"),
          h("div", { className: "esp-sub" }, `${name} (${code}) · base ${baseEsp} · `,
            isOption ? "reviewing a generated option"
              : keyPlan ? "key plan overlaid on the approved ESP"
              : "draw the key plan on the approved ESP")),
        h("div", { className: "esp-titlerow-actions" },
          h(Btn, { variant: "ghost", leadingIcon: "chevron_left", onClick: onBack }, isOption ? "Back to options" : "Back"),
          h(Btn, { variant: "ghost", leadingIcon: "x", onClick: onExit }, "Exit"))
      )
    ),
    h("div", { className: "esp-body", style: { display: "flex", flexDirection: "column", paddingBottom: 22, overflow: "hidden" } },
      h("div", { className: "esp-editor" },

        h("div", { className: "esp-ed-panel" },
          h("div", { className: "esp-ed-ptitle" }, "Layers"),
          h("div", { className: "esp-ed-scroll" },
            layers.map((l) => h("div", { className: "esp-layer", key: l.id, "data-off": !l.on, onClick: () => toggleLayer(l.id) },
              h(Icon, { name: l.on ? "eye" : "eye_off", size: 13 }),
              h("i", { style: { background: l.colour } }),
              h("span", { className: "esp-layer-name" }, l.label),
              h("span", { className: "esp-layer-count" }, l.count))),
            h(EdPanelTitle, null, "Key plan"),
            h("div", { className: "esp-layer" },
              h(Icon, { name: keyPlan ? "file" : "edit", size: 13 }),
              h("span", { className: "esp-layer-name" }, keyPlan || "Drawn in editor")),
            h("div", { className: "esp-layer" },
              h("i", { style: { background: "#DC2626" } }),
              h("span", { className: "esp-layer-name" }, keyPlan ? "Imported linework" : "Drawn linework"),
              h("span", { className: "esp-layer-count" }, keyPlan ? 24 : strokes.length)),
            h(EdPanelTitle, null, "Source documents"),
            [`${code}-ESP-${baseEsp}.dwg`, `${code}-TS-2026.csv`, `${code}-GIS.shp`].map((doc) =>
              h("div", { className: "esp-layer", key: doc },
                h(Icon, { name: "file", size: 13 }), h("span", { className: "esp-layer-name" }, doc)))
          )
        ),

        h("div", { className: "esp-ed-centre" },
          h("div", { className: "esp-ed-head" },
            h("span", { style: { fontSize: 13, fontWeight: 750, color: "var(--ink-900)" } }, `${name} (${code})`),
            h(Chip, { tone: "neutral" }, "Update ESP"),
            h(Chip, { tone: "neutral" }, `Base ${baseEsp}`),
            isOption ? h(Chip, { tone: "info", dot: true }, option.name) : h(Chip, { tone: "accent", dot: true }, "Key plan"),
            h("div", { className: "esp-ed-head-actions" },
              h(Btn, { size: "sm", variant: "secondary", leadingIcon: "save" }, "Save"),
              isOption
                ? h(Btn, { size: "sm", variant: "primary", leadingIcon: "check_circle", onClick: () => onSelectFinal(option.id) }, "Select as Final ESP")
                : h(Btn, { size: "sm", variant: "primary", trailingIcon: "arrow_right", disabled: !hasPlan, onClick: onGenerate }, "Generate Updated ESP"))
          ),
          h("div", { className: "esp-kp-strip" },
            h("span", { className: "esp-kp-swatch" }),
            isOption
              ? h("span", null, "Generated changes are shown in ", h("b", null, "red"), " over the approved ESP.")
              : keyPlan
                ? h("span", null, "Key plan ", h("b", null, keyPlan), " is overlaid in ", h("b", null, "red"), " over the approved ESP.")
                : h("span", null, strokes.length
                    ? `${strokes.length} key plan element${strokes.length === 1 ? "" : "s"} drawn in red — generate the updated ESP when the plan is complete.`
                    : "No key plan on record. Pick the draw tool and trace the key plan in red over the approved ESP.")
          ),
          h("div", { className: "esp-canvas" },
            h(KeyPlanCanvas, { layers, showKeyPlan, strokes: keyPlanOn ? strokes : [], setStrokes, drawing })),
          h("div", { className: "esp-toolbar" },
            (isOption ? EDITOR_TOOLS.slice(0, 3) : KEYPLAN_TOOLS).map((t) =>
              h("button", { key: t.id, className: "esp-tool", "data-active": tool === t.id, title: t.label, onClick: () => setTool(t.id) },
                h(Icon, { name: t.icon, size: 15 }))),
            !isOption && h(React.Fragment, null,
              h("span", { className: "esp-tool-sep" }),
              h("button", { className: "esp-tool", title: "Undo last key plan element", disabled: !strokes.length, onClick: () => setStrokes(strokes.slice(0, -1)) },
                h(Icon, { name: "undo", size: 15 })),
              h("button", { className: "esp-tool", title: "Clear drawn key plan", disabled: !strokes.length, onClick: () => setStrokes([]) },
                h(Icon, { name: "trash", size: 15 }))),
            h("span", { className: "esp-tool-sep" }),
            h("button", { className: "esp-tool", title: "Zoom in" }, h(Icon, { name: "zoom_in", size: 15 })),
            h("button", { className: "esp-tool", title: "Zoom out" }, h(Icon, { name: "zoom_out", size: 15 })),
            h("button", { className: "esp-tool", title: "Fit" }, h(Icon, { name: "fit_screen", size: 15 })),
            h("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--ink-400)", paddingRight: 6 } },
              "Snapping on · grid 1 m · CH 411/0 – 414/2")
          )
        ),

        h("div", { className: "esp-ed-panel" },
          h("div", { className: "esp-ed-ptitle" }, isOption ? "Option summary" : "Key plan"),
          h("div", { className: "esp-ed-scroll" },
            isOption
              ? h(React.Fragment, null,
                  optionProps.map((p) => h("div", { className: "esp-prop", key: p[0] }, h("span", null, p[0]), h("b", null, p[1]))),
                  h("div", { style: { padding: 14 } },
                    h(Note, { tone: option.violations ? "warning" : "success", icon: option.violations ? "alert" : "check_circle" }, option.rationale)))
              : keyPlan
                ? h(React.Fragment, null,
                    [["File", keyPlan], ["Source", "Uploaded with this update"], ["Placement", "Aligned to base ESP grid"],
                     ["Scale", "1:2000"], ["Layer", "Key plan"], ["Colour", "Red"], ["Status", "Overlaid on approved ESP"]]
                      .map((p) => h("div", { className: "esp-prop", key: p[0] }, h("span", null, p[0]), h("b", null, p[1]))),
                    h("div", { style: { padding: 14 } },
                      h(Note, { tone: "info", icon: "info" }, "The key plan is reference linework. Generate the updated ESP to turn it into design options.")))
                : h("div", { className: "esp-kp-body" },
                    h(Note, { tone: strokes.length ? "success" : "warning", icon: strokes.length ? "check_circle" : "alert" },
                      strokes.length
                        ? `${strokes.length} element${strokes.length === 1 ? "" : "s"} drawn. Generate the updated ESP when the key plan is complete.`
                        : "No key plan was uploaded for this station, so it has to be drawn here before an updated ESP can be generated."),
                    h("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-500)" } }, "How to draw it"),
                    h("ol", { className: "esp-kp-steps" },
                      h("li", null, "Pick the draw tool in the toolbar."),
                      h("li", null, "Trace the proposed station limits, lines and platforms over the approved ESP."),
                      h("li", null, "Everything you draw is captured in the red key plan layer."),
                      h("li", null, "Choose Generate Updated ESP to turn the key plan into design options.")),
                    h(Btn, { variant: drawing ? "primary" : "secondary", leadingIcon: "edit", onClick: () => setTool(drawing ? "select" : "draw") },
                      drawing ? "Drawing key plan" : "Draw key plan"))
          )
        )
      )
    )
  );
};

/* The three ESPs generated from the key plan. */
const UpdateOptionsPage = ({ station, baseEsp, keyPlan, selected, setSelected, onOpen, onSelectFinal, onRegenerate, onExit }) => {
  const h = React.createElement;
  const source = keyPlan ? `key plan ${keyPlan}` : "the key plan drawn in the editor";
  return h("div", { className: "esp-page" },
    h("div", { className: "esp-topbar" },
      h("div", { className: "esp-titlerow" },
        h("div", null,
          h("div", { className: "esp-title" }, "Generated ESP Options"),
          h("div", { className: "esp-sub" },
            `${station ? station.name : "—"} (${station ? station.code : "—"}) · base ${baseEsp} · generated from ${source}`)),
        h("div", { className: "esp-titlerow-actions" },
          h(Btn, { variant: "secondary", leadingIcon: "refresh", onClick: onRegenerate }, "Regenerate"),
          h(Btn, { variant: "ghost", leadingIcon: "x", onClick: onExit }, "Exit"))
      )
    ),
    h("div", { className: "esp-body" }, h("div", { className: "esp-wrap" },
      h("div", { className: "esp-sec" },
        h(Note, { tone: "info", icon: "info" }, "Open any option to review it in the editor, then select one as the final ESP."),
        h("div", { className: "esp-grid-3", style: { marginTop: 14 } },
          OPTIONS.map((o) => h("div", { key: o.id, className: "esp-opt", "data-sel": selected === o.id, onClick: () => onOpen(o.id) },
            h("div", { className: "esp-opt-thumb" },
              h(OptionThumb, { id: o.id }),
              o.recommended && h("div", { className: "esp-opt-badge" }, h(Chip, { tone: "accent", dot: true }, "Recommended"))),
            h("div", { className: "esp-opt-body" },
              h("div", { className: "esp-opt-name" }, o.name, h(Chip, { tone: "neutral" }, o.tag)),
              h("div", { className: "esp-opt-score" },
                h("span", { className: "esp-opt-scoreval" }, o.score),
                h("span", { style: { fontSize: 11.5, color: "var(--ink-500)" } }, "compliance score")),
              h("div", { className: "esp-opt-metrics" },
                h("div", { className: "esp-metric" }, h("span", null, "S-O-D violations"),
                  h("b", { style: { color: o.violations ? "var(--danger-text)" : "var(--success-text)" } }, o.violations)),
                h("div", { className: "esp-metric" }, h("span", null, "Warnings"), h("b", null, o.warnings)),
                h("div", { className: "esp-metric" }, h("span", null, "Land use"), h("b", null, o.land)),
                h("div", { className: "esp-metric" }, h("span", null, "New turnouts"), h("b", null, o.turnouts)),
                h("div", { className: "esp-metric" }, h("span", null, "Track length"), h("b", null, o.trackLength)),
                h("div", { className: "esp-metric" }, h("span", null, "Est. cost"), h("b", null, o.cost))),
              h("div", { className: "esp-opt-rationale" }, h("b", { style: { color: "var(--ink-800)" } }, "Why: "), o.rationale)),
            h("div", { className: "esp-opt-foot" },
              h(Btn, { size: "sm", variant: "primary", leadingIcon: "edit", onClick: (e) => { e.stopPropagation(); onOpen(o.id); } }, "View in editor"),
              h(Btn, { size: "sm", variant: "ghost", leadingIcon: "check_circle", onClick: (e) => { e.stopPropagation(); onSelectFinal(o.id); } }, "Select as final"))
          ))
        )
      )
    ))
  );
};

const UpdateGeneratingPage = ({ station, keyPlan, progress }) => {
  const h = React.createElement;
  const pct = Math.round(((progress + 1) / GEN_STAGES.length) * 100);
  return h("div", { className: "esp-page" },
    h("div", { className: "esp-body" }, h("div", { className: "esp-genwrap" },
      h("div", { style: { fontSize: 16, fontWeight: 750, color: "var(--ink-900)" } }, "Generating updated ESP"),
      h("div", { style: { fontSize: 12.5, color: "var(--ink-500)", marginTop: 4, marginBottom: 16 } },
        `${station ? station.name : "—"} (${station ? station.code : "—"}) · from ${keyPlan ? `key plan ${keyPlan}` : "the key plan you drew"}`),
      GEN_STAGES.map((s, i) => {
        const state = i < progress ? "done" : i === progress ? "active" : "pending";
        return h("div", { className: "esp-genstage", key: s, "data-state": state },
          h("div", { className: "esp-genstage-dot" },
            state === "done" ? h(Icon, { name: "check", size: 12 })
              : state === "active" ? h("span", { className: "esp-spin" }) : null),
          h("div", { className: "esp-genstage-label" }, s));
      }),
      h("div", { className: "esp-progressbar" }, h("div", { style: { width: `${pct}%` } }))
    ))
  );
};

/* The chosen ESP, surfaced back in the module once an option has been made final. */
const FinalEspCard = ({ final, onOpen }) => {
  const h = React.createElement;
  return h("div", { className: "esp-final" },
    h("div", { className: "esp-final-icon" }, h(Icon, { name: "check", size: 18 })),
    h("div", null,
      h("div", { className: "esp-final-title" }, `Final ESP — ${final.station} (${final.code}) · ${final.version}`),
      h("div", { className: "esp-final-sub" },
        `${final.option} · ${final.tag} · compliance ${final.score} · base ${final.base} · generated from ${final.keyPlan}`)),
    h("div", { className: "esp-final-actions" },
      h(Btn, { variant: "secondary", leadingIcon: "edit", onClick: onOpen }, "Open in editor"),
      h(Btn, { variant: "primary", trailingIcon: "arrow_right" }, "Submit for Review"))
  );
};

/* Update ESP end to end: choose the ESP, place or draw the key plan in the
   editor, generate options from it, review one, make it the final ESP. */
const UpdateEspFlow = ({ station, setStation, selectedEsp, setSelectedEsp, onGoLibrary, onExit, onFinalize, resume }) => {
  const h = React.createElement;
  const [stage, setStage] = useStateEsp(resume ? "option" : "setup");   // setup | editor | generating | options | option
  const [keyPlan, setKeyPlan] = useStateEsp(resume ? resume.keyPlanFile : "");
  const [strokes, setStrokes] = useStateEsp([]);
  const [progress, setProgress] = useStateEsp(0);
  const [layers, setLayers] = useStateEsp(KEYPLAN_LAYERS);
  const [optLayers, setOptLayers] = useStateEsp(OPTION_LAYERS);
  const [tool, setTool] = useStateEsp("select");
  const [selected, setSelected] = useStateEsp(resume ? resume.optionId : 1);
  const baseEsp = selectedEsp || "V2";

  // drive the generation progress stages
  useEffectEsp(() => {
    if (stage !== "generating") return;
    if (progress >= GEN_STAGES.length) {
      const t = setTimeout(() => setStage("options"), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => p + 1), 560);
    return () => clearTimeout(t);
  }, [stage, progress]);

  // An uploaded key plan only has to be looked at; a missing one has to be drawn.
  const openEditor = () => { setTool(keyPlan ? "select" : "draw"); setStage("editor"); };
  const generate = () => { setProgress(0); setStage("generating"); };
  const openOption = (id) => { setSelected(id); setTool("select"); setStage("option"); };
  const finalize = (id) => {
    const opt = OPTIONS.find((o) => o.id === id) || OPTIONS[0];
    setSelected(opt.id);
    onFinalize({
      station: station ? station.name : "—", code: station ? station.code : "—",
      version: "V3", base: baseEsp, option: opt.name, tag: opt.tag, score: opt.score,
      optionId: opt.id, keyPlanFile: keyPlan, keyPlan: keyPlan || "key plan drawn in the editor",
    });
  };

  if (stage === "generating") return h(UpdateGeneratingPage, { station, keyPlan, progress });

  if (stage === "options") return h(UpdateOptionsPage, {
    station, baseEsp, keyPlan, selected, setSelected, onOpen: openOption,
    onSelectFinal: finalize, onRegenerate: generate, onExit });

  if (stage === "option") return h(UpdateEditorPage, {
    station, baseEsp, mode: "option", keyPlan, strokes, setStrokes,
    layers: optLayers, setLayers: setOptLayers, tool, setTool,
    option: OPTIONS.find((o) => o.id === selected) || OPTIONS[0],
    onSelectFinal: finalize, onBack: () => setStage("options"), onExit });

  if (stage === "editor") return h(UpdateEditorPage, {
    station, baseEsp, mode: "keyplan", keyPlan, strokes, setStrokes, layers, setLayers, tool, setTool,
    onGenerate: generate, onBack: () => setStage("setup"), onExit });

  return h(UpdateEspPage, {
    station, setStation, selectedEsp, setSelectedEsp, keyPlan, setKeyPlan,
    onGoLibrary, onOpenEditor: openEditor, onExit });
};

const EspModulePage = ({ onNavigate }) => {
  const [view, setView] = useStateEsp("landing");      // landing | workflow
  const [flow, setFlow] = useStateEsp("create");        // create | update
  const [step, setStep] = useStateEsp(0);
  const [station, setStation] = useStateEsp(null);
  const [scenario, setScenario] = useStateEsp("firstdigital");
  const [prevEsp, setPrevEsp] = useStateEsp("ESP V2");
  const [changeTypes, setChangeTypes] = useStateEsp(["Add loop line", "Extend platform"]);
  const [requirements, setRequirements] = useStateEsp({
    lines: "4", platforms: "2", turnouts: "6", land: "12.4 ha",
    adjacent: "Both ends", connectivity: "Full yard connectivity",
    lineTypes: ["Main line", "Loop line"],
    ops: "Simultaneous reception on both main lines. Stabling for one 24-coach rake.",
    constraints: "LC gate at 412/7 to be retained. No land available on the up side.",
  });
  const [generating, setGenerating] = useStateEsp(false);
  const [progress, setProgress] = useStateEsp(0);
  const [selected, setSelected] = useStateEsp(1);
  const [layers, setLayers] = useStateEsp(EDITOR_LAYERS);
  const [tool, setTool] = useStateEsp("select");
  const [editorTab, setEditorTab] = useStateEsp("editor");  // editor | validation
  const [finalized, setFinalized] = useStateEsp(false);
  const [updateEsp, setUpdateEsp] = useStateEsp("");     // ESP version the update flow is based on
  const [finalEsp, setFinalEsp] = useStateEsp(null);     // option chosen as the final ESP
  const [resume, setResume] = useStateEsp(null);         // re-open the final ESP in the editor
  // Furthest step reached — stepping *back* must not re-lock steps you have
  // already completed, so this only ever increases.
  const [maxReached, setMaxReached] = useStateEsp(0);
  const goStep = (i) => { setStep(i); setMaxReached((m) => Math.max(m, i)); };

  const toggleChange = (c) =>
    setChangeTypes(changeTypes.includes(c) ? changeTypes.filter((x) => x !== c) : [...changeTypes, c]);

  // drive the generation progress stages
  useEffectEsp(() => {
    if (!generating) return;
    if (progress >= GEN_STAGES.length) {
      const t = setTimeout(() => { setGenerating(false); setProgress(0); goStep(4); }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => p + 1), 620);
    return () => clearTimeout(t);
  }, [generating, progress]);

  const startFlow = (f) => {
    setFlow(f); setStep(0); setMaxReached(0); setResume(null); setView("workflow");
    setStation(null);
  };

  // Re-open the ESP that was made final, in the editor it was chosen from.
  const reopenFinal = () => { setResume(finalEsp); setFlow("update"); setView("workflow"); };

  const stepValid = () => {
    if (step === 0) return !!station;
    if (step === 1) return flow === "create" ? !!scenario : !!prevEsp && station?.espVersions.length > 0;
    return true;
  };

  const stepBody = () => {
    switch (step) {
      case 0: return <StepStation station={station} setStation={setStation} />;
      case 1: return <StepBaseData flow={flow} station={station} scenario={scenario} setScenario={setScenario}
                       prevEsp={prevEsp} setPrevEsp={setPrevEsp} onGoLibrary={() => onNavigate && onNavigate("library")} />;
      case 2: return <StepDesignInputs flow={flow} changeTypes={changeTypes} toggleChange={toggleChange}
                       requirements={requirements} setRequirements={setRequirements} />;
      case 3: return <StepGenerate flow={flow} station={station} scenario={scenario} generating={generating}
                       progress={progress} onGenerate={() => { setGenerating(true); setProgress(0); }} />;
      case 4: return <StepCompare selected={selected} setSelected={setSelected}
                       onOpenEditor={() => goStep(5)} onRegenerate={() => { goStep(3); setGenerating(true); setProgress(0); }} />;
      case 5: return editorTab === "editor"
        ? <StepEditor station={station} flow={flow} selected={selected} layers={layers} setLayers={setLayers}
            tool={tool} setTool={setTool} onValidate={() => setEditorTab("validation")} />
        : <StepValidate onBackToEditor={() => setEditorTab("editor")} />;
      case 6: return <StepFinalize finalized={finalized} onSubmit={() => goStep(6)} onFinalize={() => setFinalized(true)} />;
      default: return null;
    }
  };

  if (view === "workflow" && flow === "update") {
    return <UpdateEspFlow station={station} setStation={setStation} selectedEsp={updateEsp} setSelectedEsp={setUpdateEsp}
      resume={resume} onGoLibrary={() => onNavigate && onNavigate("library")} onExit={() => setView("landing")}
      onFinalize={(final) => { setFinalEsp(final); setResume(null); setView("landing"); }} />;
  }

  if (view === "landing") {
    return (
      <div className="esp-page">
        <div className="esp-topbar">
          <div className="esp-titlerow">
            <div>
              <div className="esp-title">RAPID ESP</div>
              <div className="esp-sub">Create, update, validate and manage Engineering Scale Plans</div>
            </div>
          </div>
        </div>
        <div className="esp-body">
          {finalEsp && <FinalEspCard final={finalEsp} onOpen={reopenFinal} />}
          <EspLanding onStart={startFlow} onOpenFiles={() => onNavigate && onNavigate("wsMyFiles")} />
        </div>
      </div>
    );
  }

  const isEditorStep = step === 5;

  return (
    <div className="esp-page">
      <div className="esp-topbar" style={{ paddingBottom: 12 }}>
        <div className="esp-crumb">
          <button onClick={() => onNavigate && onNavigate("home")}>Design Modules</button>
          <Icon name="chevron_right" size={11} />
          <button onClick={() => setView("landing")}>ESP Design</button>
          <Icon name="chevron_right" size={11} />
          <span className="cur">{flow === "create" ? "Create ESP" : "Update ESP"}{station ? ` — ${station.name}` : ""}</span>
        </div>
        <div className="esp-titlerow">
          <div>
            <div className="esp-title">{flow === "create" ? "Create New ESP" : "Update Existing ESP"}</div>
            <div className="esp-sub">
              {station ? `${station.name} (${station.code}) · ${station.division} division` : "No station selected"}
              {flow === "update" && station?.espVersions.length ? ` · base ${prevEsp}` : ""}
            </div>
          </div>
          <div className="esp-titlerow-actions">
            <Chip tone="accent" dot>{step >= 5 ? "Editing" : step >= 4 ? "Options Generated" : step >= 3 ? "Ready for Generation" : "Setup Incomplete"}</Chip>
            <Btn variant="secondary" leadingIcon="save">Save draft</Btn>
            <Btn variant="ghost" leadingIcon="x" onClick={() => setView("landing")}>Exit</Btn>
          </div>
        </div>
      </div>

      {isEditorStep && (
        <div style={{ flexShrink: 0, padding: "10px 28px 0", background: "var(--canvas)" }}>
          <PillTabs
            items={[{ id: "editor", label: "Editor" }, { id: "validation", label: `Validation (${VALIDATION.violations + VALIDATION.warnings})` }]}
            active={editorTab} onChange={setEditorTab}
          />
        </div>
      )}

      <div className="esp-body" style={isEditorStep && editorTab === "editor"
        ? { display: "flex", flexDirection: "column", paddingBottom: 22, overflow: "hidden" } : null}>
        {stepBody()}
      </div>

      {!generating && (
        <div className="esp-footer">
          <span className="esp-footer-note">
            Step {step + 1} of {WORKFLOW_STEPS.length} · {WORKFLOW_STEPS[step].label}
            {!stepValid() && <span style={{ color: "var(--danger-text)", fontWeight: 650 }}>
              {" "}· {step === 0 ? "select a station to continue" : "complete this step to continue"}
            </span>}
          </span>
          <div className="esp-footer-actions">
            <Btn variant="secondary" leadingIcon="chevron_left" disabled={step === 0} onClick={() => goStep(step - 1)}>Back</Btn>
            {step < WORKFLOW_STEPS.length - 1 && (
              <Btn variant="primary" trailingIcon="chevron_right" disabled={!stepValid()} onClick={() => goStep(step + 1)}>
                {step === 3 ? "Skip to options" : "Continue"}
              </Btn>
            )}
            {step === WORKFLOW_STEPS.length - 1 && (
              <Btn variant="primary" leadingIcon="check_circle" onClick={() => setFinalized(true)}>Finalize ESP</Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const espStyle = document.createElement("style");
espStyle.textContent = espCSS;
document.head.appendChild(espStyle);

window.EspModulePage = EspModulePage;
