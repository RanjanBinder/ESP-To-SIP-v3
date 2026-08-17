const { useState: useStateD, useMemo: useMemoD } = React;
const MODULES = [
  {
    id: "tad",
    code: "TAD",
    name: "RAPID Track Alignment Design",
    short: "Track Alignment",
    full: "Horizontal & vertical alignment, curves, gradients and chainage.",
    icon: "track",
    color: "#0EA5E9",
    stage: "pilot"
  },
  {
    id: "esp",
    code: "ESP",
    name: "RAPID ESP",
    short: "ESP",
    full: "Engineering Scale Plan \u2014 digitise, validate against SOD, approve.",
    icon: "layers",
    color: "#3737C8",
    stage: "live"
  },
  {
    id: "sip",
    code: "SIP",
    name: "RAPID SIP",
    short: "SIP",
    full: "Signal Interlocking Plan \u2014 generate from an approved ESP.",
    icon: "branch",
    color: "#0D9488",
    stage: "live"
  },
  {
    id: "toc",
    code: "TOC",
    name: "RAPID TOC",
    short: "TOC",
    full: "Table of Controls \u2014 derived from the approved interlocking plan.",
    icon: "file_check",
    color: "#B45309",
    stage: "soon"
  },
  {
    id: "kavach",
    code: "KVC",
    name: "RAPID Kavach",
    short: "Kavach",
    full: "Kavach asset planning, RFID mapping and station static data.",
    icon: "shield",
    color: "#BE123C",
    stage: "soon"
  }
];
const ROLES = {
  zone_admin: {
    label: "Zone Admin",
    user: { name: "Ashwini Vaishnaw", initials: "AV", designation: "Sr. DSTE \xB7 Zone Admin" },
    scope: { zone: "SCR \u2014 South Central Railway", division: "All divisions", section: "All sections" },
    grants: { tad: "full", esp: "full", sip: "full", toc: "full", kavach: "full" },
    can: { library: true, approve: true, users: true, drillDivision: true }
  },
  div_engineer: {
    label: "Division Engineer",
    user: { name: "K. Naidu", initials: "KN", designation: "SSE/Signal \xB7 Vijayawada" },
    scope: { zone: "SCR \u2014 South Central Railway", division: "Vijayawada Division", section: "All sections" },
    grants: { esp: "edit", sip: "edit" },
    can: { library: true, approve: false, users: false, drillDivision: false }
  },
  approver: {
    label: "Approver",
    user: { name: "R. Sharma", initials: "RS", designation: "Sr. DEN \xB7 SCR" },
    scope: { zone: "SCR \u2014 South Central Railway", division: "All divisions", section: "All sections" },
    grants: { esp: "view", sip: "view", toc: "view" },
    can: { library: true, approve: true, users: false, drillDivision: true }
  }
};
const SCOPE_TOTAL = 247;
const MODULE_STATS = {
  tad: {
    headline: "12",
    headlineLabel: "sections in design",
    split: [
      { label: "Approved", value: 3, color: "#16A34A" },
      { label: "Under design", value: 7, color: "#0EA5E9" },
      { label: "On hold", value: 2, color: "#CBD3DC" }
    ],
    note: "Pilot \u2014 Vijayawada\u2013Gudivada doubling",
    generated: 8, approved: 3
  },
  esp: {
    headline: "247",
    headlineLabel: "stations in scope",
    split: [
      { label: "Approved", value: 97, color: "#16A34A" },
      { label: "In progress", value: 108, color: "#3737C8" },
      { label: "Not started", value: 42, color: "#CBD3DC" }
    ],
    alerts: [
      { tone: "danger", text: "14 awaiting your approval" },
      { tone: "warning", text: "43 open discrepancies" }
    ],
    generated: 205, approved: 97
  },
  sip: {
    headline: "97",
    headlineLabel: "stations ESP-cleared",
    split: [
      { label: "Approved", value: 52, color: "#16A34A" },
      { label: "In review", value: 22, color: "#0D9488" },
      { label: "Not generated", value: 23, color: "#CBD3DC" }
    ],
    alerts: [
      { tone: "info", text: "150 stations blocked on ESP approval" }
    ],
    generated: 74, approved: 52
  },
  toc: { headline: "41", headlineLabel: "stations SIP-ready", generated: 18, approved: 11, split: [] },
  kavach: { headline: "9", headlineLabel: "active designs", generated: 7, approved: 4, split: [] }
};
const PIPELINE = [
  { id: "survey", label: "Survey data received", desc: "Total station / LiDAR upload verified", count: 247, module: "esp", color: "#94A3B8" },
  { id: "digitised", label: "ESP digitised", desc: "Yard drawn, assets tagged", count: 205, module: "esp", color: "#6366F1" },
  { id: "validated", label: "ESP validated", desc: "SOD + zone rules passed", count: 142, module: "esp", color: "#3737C8" },
  { id: "esp_approved", label: "ESP approved", desc: "Frozen baseline, SIP unlocked", count: 97, module: "esp", color: "#2929A0" },
  { id: "sip_gen", label: "SIP generated", desc: "Interlocking plan drafted", count: 74, module: "sip", color: "#14B8A6" },
  { id: "sip_approved", label: "SIP approved", desc: "Ready for TOC generation", count: 52, module: "sip", color: "#0D9488" }
];
const APPROVALS = [
  { doc: "SIP", station: "Vijayawada Junction", code: "BZA", ver: "v1.2", who: "R. Sharma", tone: "danger", label: "Overdue", age: "12d" },
  { doc: "ESP", station: "Guntur Junction", code: "GNT", ver: "v2.0", who: "K. Naidu", tone: "danger", label: "Overdue", age: "8d" },
  { doc: "SIP", station: "Tenali Junction", code: "TEL", ver: "v1.0", who: "S. Reddy", tone: "warning", label: "Pending", age: "3d" },
  { doc: "ESP", station: "Ongole", code: "OGL", ver: "v1.0", who: "V. Kumar", tone: "warning", label: "Pending", age: "1d" },
  { doc: "ESP", station: "Bhimavaram Town", code: "BVRT", ver: "v1.1", who: "M. Prasad", tone: "info", label: "In review", age: "Today" }
];
const OVERDUE = [
  { station: "Nanded", code: "NED", desc: "ESP not started \xB7 added 45 days ago", doc: "ESP", days: 45 },
  { station: "Eluru", code: "EE", desc: "Survey data never uploaded", doc: "ESP", days: 30 },
  { station: "Kurnool City", code: "KRNT", desc: "SIP draft not submitted", doc: "SIP", days: 22 },
  { station: "Secunderabad Jn", code: "SC", desc: "SIP validation incomplete \xB7 5 violations", doc: "SIP", days: 15 },
  { station: "Vijayawada Junction", code: "BZA", desc: "ESP validation started \xB7 no activity", doc: "ESP", days: 12 },
  { station: "Guntur Junction", code: "GNT", desc: "Awaiting approval \xB7 submitted 8d ago", doc: "ESP", days: 8 }
];
const DISCREPANCIES = [
  { count: 12, station: "Vijayawada Junction", code: "BZA", desc: "Track spacing violations \xB7 3 critical", doc: "ESP" },
  { count: 9, station: "Bisalwas Kalan", code: "BIWK", desc: "SOD rule failures \xB7 signal placement", doc: "SIP" },
  { count: 6, station: "Tenali Junction", code: "TEL", desc: "Platform offset violations", doc: "ESP" },
  { count: 5, station: "Guntur Junction", code: "GNT", desc: "Turnout chainage mismatch", doc: "ESP" },
  { count: 4, station: "Rajahmundry", code: "RJY", desc: "Fouling mark not derivable", doc: "SIP" },
  { count: 3, station: "Ongole", code: "OGL", desc: "Missing LC gate annotation", doc: "ESP" }
];
const DIVISIONS = [
  { name: "Vijayawada", stations: 89, esp: 72, sip: 34, status: "On track", tone: "success" },
  { name: "Hyderabad", stations: 71, esp: 88, sip: 52, status: "On track", tone: "success" },
  { name: "Guntur", stations: 64, esp: 60, sip: 22, status: "At risk", tone: "warning" },
  { name: "Nanded", stations: 23, esp: 30, sip: 8, status: "Lagging", tone: "danger" }
];
const ACTIVITY = [
  { day: "Today \xB7 Mon, 17 Aug", rows: [
    { doc: "SIP", action: "Resumed SIP validation", station: "Bisalwas Kalan", code: "BIWK", tone: "info", label: "In progress", time: "2:30 PM" },
    { doc: "ESP", action: "Approved ESP v2.1", station: "Tenali Junction", code: "TEL", tone: "success", label: "Approved", time: "11:00 AM" },
    { doc: "ESP", action: "Returned ESP with 3 remarks", station: "Ongole", code: "OGL", tone: "danger", label: "Returned", time: "9:15 AM" }
  ] },
  { day: "Yesterday \xB7 Sun, 16 Aug", rows: [
    { doc: "SIP", action: "Generated SIP draft", station: "Rajahmundry", code: "RJY", tone: "neutral", label: "Done", time: "4:45 PM" },
    { doc: "LIB", action: "Published SOD rule-set 2026.2", station: "Zone-wide", code: "SCR", tone: "neutral", label: "Done", time: "2:00 PM" },
    { doc: "ESP", action: "Fixed 3 SOD violations", station: "Guntur Junction", code: "GNT", tone: "neutral", label: "Done", time: "11:30 AM" }
  ] }
];
const DOC_TONE = { ESP: "#3737C8", SIP: "#0D9488", TOC: "#B45309", TAD: "#0EA5E9", LIB: "#64748B" };
const rapidCSS = `
/* \u2500\u2500 shell \u2500\u2500 */
.rh-app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; overflow: hidden; background: var(--canvas); }
.rh-app .ds-sidebar { width: 252px; height: 100vh; overflow: hidden; }
.rh-main { display: flex; flex-direction: column; height: 100vh; overflow: hidden; min-width: 0; }
/* embedded in Digital Library's own shell \u2014 it owns the sidebar and the height */
.rh-main-embedded { flex: 1; width: 100%; height: 100%; min-width: 0; background: var(--canvas); }

/* \u2500\u2500 topbar \u2500\u2500 */
.rh-topbar { flex-shrink: 0; background: var(--paper); border-bottom: var(--hairline); padding: 16px 28px 0; }
.rh-topbar-row { display: flex; align-items: flex-start; gap: 16px; }
.rh-hello { font-size: 21px; font-weight: 800; letter-spacing: -0.025em; color: var(--ink-900); line-height: 1.15; }
/* separators are drawn on the item, so a wrap never leaves a dangling "\xB7" */
.rh-hello-sub { font-size: 12.5px; color: var(--ink-500); margin-top: 3px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rh-hello-sub > * + *::before { content: "\xB7"; color: var(--ink-300); margin-right: 8px; }
.rh-live { display: inline-flex; align-items: center; gap: 5px; color: var(--success-text); font-weight: 600; }
.rh-live i { width: 6px; height: 6px; border-radius: 50%; background: var(--success); display: block; }
.rh-topbar-spacer { flex: 1; min-width: 12px; }
.rh-topbar-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.rh-roleswitch { display: flex; align-items: center; gap: 7px; height: 34px; padding: 0 4px 0 11px; border: var(--hairline); border-radius: var(--r-md); background: var(--ink-50); }
.rh-roleswitch label { font-size: 10px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-400); }
.rh-roleswitch select { height: 26px; border: none; background: transparent; font-size: 12.5px; font-weight: 700; color: var(--ink-900); cursor: pointer; outline: none; }

/* scope bar */
.rh-scopebar { display: flex; align-items: center; gap: 8px; padding: 12px 0 13px; flex-wrap: wrap; }
.rh-scope-label { font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-400); margin-right: 2px; }
.rh-scope { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px 0 12px; border-radius: var(--r-md); border: var(--hairline); background: var(--paper); font-size: 12.5px; font-weight: 600; color: var(--ink-900); cursor: pointer; font-family: inherit; white-space: nowrap; transition: 120ms; }
.rh-scope:hover { border-color: var(--ink-300); background: var(--ink-50); }
.rh-scope .icon { color: var(--ink-400); }
.rh-scope-div { width: 1px; height: 18px; background: var(--ink-200); margin: 0 6px; }
.rh-updated { font-size: 11px; color: var(--ink-400); font-variant-numeric: tabular-nums; }

/* \u2500\u2500 content \u2500\u2500 */
.rh-content { flex: 1; overflow-y: auto; padding: 22px 28px 60px; display: flex; flex-direction: column; gap: 22px; }
.rh-sec { display: flex; flex-direction: column; gap: 12px; }
.rh-sec-head { display: flex; align-items: baseline; gap: 10px; }
.rh-content > .rh-sec > .rh-sec-head { display: none; }
.rh-sec-title { font-size: 12px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); }
.rh-sec-note { font-size: 12px; color: var(--ink-400); }
.rh-sec-link { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--accent-text); cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
.rh-sec-link:hover { text-decoration: underline; }

/* \u2500\u2500 KPI strip \u2500\u2500 */
.rh-kpis { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 12px; }
.rh-kpi { position: relative; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 15px 16px 14px 18px; overflow: hidden; cursor: pointer; transition: 150ms; }
.rh-kpi::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--k, var(--ink-300)); }
.rh-kpi:hover { border-color: var(--ink-300); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.rh-kpi[data-sel="true"] { border-color: var(--accent); background: var(--accent-soft); }
.rh-kpi-label { font-size: 11.5px; font-weight: 600; color: var(--ink-500); display: flex; align-items: center; gap: 6px; }
.rh-kpi-label .icon { color: var(--ink-400); }
.rh-kpi-value { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; margin-top: 7px; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.rh-kpi-value small { font-size: 14px; font-weight: 600; color: var(--ink-400); margin-left: 3px; }
.rh-kpi-foot { margin-top: 5px; font-size: 11.5px; color: var(--ink-500); display: flex; align-items: center; gap: 5px; }
.rh-kpi-foot b { font-weight: 700; }

/* \u2500\u2500 module tiles \u2500\u2500 */
.rh-mod-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
.rh-mod-grid-sm { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
.rh-mod { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 16px 18px 14px; display: flex; flex-direction: column; gap: 13px; position: relative; overflow: hidden; transition: 160ms; }
.rh-mod[data-open="true"] { cursor: pointer; }
.rh-mod[data-open="true"]:hover { border-color: color-mix(in srgb, var(--m) 45%, var(--ink-200)); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.rh-mod[data-open="false"] { background: linear-gradient(180deg, var(--ink-50), var(--paper)); border-style: dashed; }
.rh-mod-top { display: flex; align-items: flex-start; gap: 11px; }
.rh-mod-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0; background: color-mix(in srgb, var(--m) 12%, var(--paper)); color: var(--m); border: 1px solid color-mix(in srgb, var(--m) 22%, transparent); }
.rh-mod[data-open="false"] .rh-mod-icon { background: var(--ink-100); color: var(--ink-400); border-color: var(--ink-200); }
.rh-mod-name { font-size: 14.5px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.015em; display: flex; align-items: center; gap: 7px; }
.rh-mod-code { font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.04em; padding: 1.5px 5px; border-radius: var(--r-xs); background: color-mix(in srgb, var(--m) 12%, var(--paper)); color: var(--m); }
.rh-mod[data-open="false"] .rh-mod-code { background: var(--ink-100); color: var(--ink-500); }
.rh-mod-desc { font-size: 11.5px; color: var(--ink-500); margin-top: 3px; line-height: 1.45; }
.rh-mod-stage { margin-left: auto; flex-shrink: 0; }
.rh-mod-figure { display: flex; align-items: baseline; gap: 7px; }
.rh-mod-counts { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
.rh-mod-count { padding: 10px 11px; border: var(--hairline); border-radius: var(--r-md); background: var(--ink-50); }
.rh-mod-count b { display: block; font-size: 20px; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.rh-mod-count span { font-size: 10.5px; color: var(--ink-500); }
.rh-mod-headline { font-size: 24px; font-weight: 700; letter-spacing: -0.03em; color: var(--ink-900); font-variant-numeric: tabular-nums; line-height: 1; }
.rh-mod-headline-label { font-size: 11.5px; color: var(--ink-500); }
.rh-mod-bar { display: flex; height: 7px; border-radius: 99px; overflow: hidden; background: var(--ink-100); }
.rh-mod-bar span { display: block; height: 100%; }
.rh-mod-legend { display: flex; gap: 14px; flex-wrap: wrap; }
.rh-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-500); }
.rh-legend-item i { width: 7px; height: 7px; border-radius: 2px; display: block; flex-shrink: 0; }
.rh-legend-item b { color: var(--ink-900); font-weight: 700; font-variant-numeric: tabular-nums; }
.rh-mod-alerts { display: flex; flex-direction: column; gap: 5px; }
.rh-mod-alert { display: flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 600; padding: 5px 9px; border-radius: var(--r-sm); }
.rh-mod-alert[data-tone="danger"] { background: var(--danger-soft); color: var(--danger-text); }
.rh-mod-alert[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.rh-mod-alert[data-tone="info"] { background: var(--info-soft); color: var(--info-text); }
/* centres in whatever space the tallest sibling tile leaves behind */
.rh-mod-placeholder { margin: auto 0; font-size: 11.5px; color: var(--ink-400); line-height: 1.5; }
.rh-mod-foot { margin-top: auto; padding-top: 11px; border-top: var(--hairline); display: flex; align-items: center; gap: 10px; }
.rh-mod-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--m); background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
.rh-mod-cta:hover { text-decoration: underline; }
.rh-mod-quiet { font-size: 11.5px; color: var(--ink-400); margin-left: auto; }
.rh-mod-locked { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--ink-400); font-weight: 600; }

/* \u2500\u2500 cards \u2500\u2500 */
.rh-card { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); display: flex; flex-direction: column; overflow: hidden; }
.rh-card-head { padding: 14px 18px; border-bottom: var(--hairline); display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.rh-card-title { font-size: 13.5px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.01em; }
.rh-card-sub { font-size: 11.5px; color: var(--ink-500); margin-top: 2px; }
.rh-card-head-right { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.rh-card-body { padding: 14px 18px; }
.rh-card-foot { margin-top: auto; padding: 9px 16px; border-top: var(--hairline); background: var(--ink-50); display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--ink-400); }
.rh-card-foot button { font-size: 11.5px; font-weight: 700; color: var(--accent-text); background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
.rh-card-foot button:hover { text-decoration: underline; }

.rh-grid-2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 400px); gap: 18px; align-items: start; }
.rh-grid-2b { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 18px; align-items: start; }

/* \u2500\u2500 pipeline funnel \u2500\u2500 */
.rh-stage { display: flex; align-items: center; gap: 13px; padding: 9px 10px; border-radius: var(--r-md); cursor: pointer; transition: background 120ms; }
.rh-stage:hover { background: var(--ink-50); }
.rh-stage-rail { width: 3px; height: 30px; border-radius: 2px; flex-shrink: 0; background: var(--c); }
.rh-stage-main { flex: 1; min-width: 0; }
.rh-stage-name { font-size: 12.5px; font-weight: 700; color: var(--ink-900); }
.rh-stage-desc { font-size: 11px; color: var(--ink-500); margin-top: 1px; }
.rh-stage-track { flex: 0 1 200px; min-width: 90px; height: 6px; border-radius: 99px; background: var(--ink-100); overflow: hidden; }
.rh-stage-fill { height: 100%; border-radius: 99px; background: var(--c); }
.rh-stage-num { width: 74px; text-align: right; flex-shrink: 0; }
.rh-stage-count { font-size: 16px; font-weight: 700; color: var(--ink-900); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.rh-stage-pct { font-size: 10.5px; color: var(--ink-400); font-variant-numeric: tabular-nums; }
.rh-stage-drop { font-size: 10.5px; font-weight: 700; color: var(--danger-text); }

/* \u2500\u2500 list rows \u2500\u2500 */
.rh-row { display: flex; align-items: center; gap: 11px; padding: 9px 16px; border-bottom: var(--hairline); cursor: pointer; transition: background 120ms; }
.rh-row:hover { background: var(--ink-50); }
.rh-row:last-child { border-bottom: none; }
.rh-doc { font-family: var(--font-mono); font-size: 9px; font-weight: 800; letter-spacing: 0.03em; padding: 3px 5px; border-radius: var(--r-xs); flex-shrink: 0; min-width: 30px; text-align: center; background: color-mix(in srgb, var(--d) 12%, var(--paper)); color: var(--d); }
.rh-row-main { flex: 1; min-width: 0; }
.rh-row-title { font-size: 12.5px; font-weight: 600; color: var(--ink-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rh-row-meta { font-size: 10.5px; color: var(--ink-500); margin-top: 1px; display: flex; align-items: center; gap: 6px; }
.rh-code { font-family: var(--font-mono); font-size: 9.5px; padding: 0 4px; border-radius: var(--r-xs); background: var(--ink-100); color: var(--ink-500); font-weight: 600; }
.rh-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.rh-age { font-size: 10.5px; font-weight: 700; color: var(--ink-400); font-variant-numeric: tabular-nums; }
.rh-age[data-hot="true"] { color: var(--danger-text); }
.rh-count-badge { min-width: 28px; height: 24px; border-radius: var(--r-sm); display: grid; place-items: center; font-size: 11.5px; font-weight: 800; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.rh-count-badge[data-sev="high"] { background: var(--danger-soft); color: var(--danger-text); }
.rh-count-badge[data-sev="mid"] { background: var(--warning-soft); color: var(--warning-text); }
.rh-scroll { max-height: 328px; overflow-y: auto; }

/* \u2500\u2500 activity \u2500\u2500 */
.rh-day { position: sticky; top: 0; z-index: 1; background: var(--ink-50); padding: 6px 16px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-400); border-bottom: var(--hairline); }

/* \u2500\u2500 table \u2500\u2500 */
/* the wrapper is the safety net: a narrow card scrolls the table instead of
   clipping its last column against .rh-card's overflow:hidden */
.rh-table-wrap { overflow-x: auto; }
.rh-table { width: 100%; border-collapse: collapse; }
.rh-table th, .rh-table td { white-space: nowrap; }
.rh-table thead th { background: var(--ink-50); font-size: 10px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); text-align: left; padding: 9px 12px; border-bottom: var(--hairline); }
.rh-table tbody td { padding: 10px 12px; border-bottom: var(--hairline); vertical-align: middle; }
.rh-table th:first-child, .rh-table td:first-child { padding-left: 18px; }
.rh-table th:last-child, .rh-table td:last-child { padding-right: 18px; }
/* numeric + status columns read as a column only when right-aligned */
.rh-table th[data-align="right"], .rh-table td[data-align="right"] { text-align: right; }
.rh-table tbody tr { cursor: pointer; transition: background 120ms; }
.rh-table tbody tr:hover { background: var(--ink-50); }
.rh-table tbody tr:last-child td { border-bottom: none; }
.rh-td-name { font-size: 13px; font-weight: 700; color: var(--ink-900); }
.rh-td-sub { font-size: 10.5px; color: var(--ink-400); margin-top: 1px; }
.rh-meter { display: flex; align-items: center; gap: 9px; }
.rh-meter-track { width: 62px; height: 6px; border-radius: 99px; background: var(--ink-100); overflow: hidden; flex-shrink: 0; }
.rh-meter-fill { height: 100%; border-radius: 99px; }
.rh-meter-pct { font-size: 11.5px; font-weight: 700; color: var(--ink-700); font-variant-numeric: tabular-nums; min-width: 32px; text-align: right; }
.rh-overall { font-size: 13.5px; font-weight: 800; font-variant-numeric: tabular-nums; }
.rh-num { font-size: 13px; font-weight: 600; color: var(--ink-700); font-variant-numeric: tabular-nums; }

/* \u2500\u2500 empty / no-access \u2500\u2500 */
.rh-empty { border: 1px dashed var(--ink-300); border-radius: var(--r-lg); padding: 28px; text-align: center; color: var(--ink-500); font-size: 13px; background: var(--paper); }

@media (max-width: 1380px) {
  .rh-kpis { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .rh-grid-2, .rh-grid-2b { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 1080px) {
  .rh-mod-grid, .rh-mod-grid-sm { grid-template-columns: minmax(0, 1fr); }
  .rh-kpis { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
`;
const buildSidebarNav = (role, granted) => ({
  brand: { mark: "R", title: "RAPID", sub: "Indian Railways" },
  // "Vijayawada Division" → "Vijayawada"; the 252px rail has no room for the noun
  scope: {
    label: "Scope",
    value: `${role.scope.zone.split(" \u2014 ")[0]} \xB7 ${role.scope.division.replace(/ Division$/, "")}`
  },
  user: {
    initials: role.user.initials,
    name: role.user.name,
    role: role.user.designation,
    action: "log_out",
    actionTitle: "Sign out"
  },
  // Three titled sections. No counts, no stage tags — the rail is for
  // navigation; status lives on the dashboard itself.
  groups: [
    {
      id: "main",
      label: "Main",
      header: true,
      collapsible: true,
      defaultOpen: true,
      items: [
        { id: "home", icon: "home", label: "Home" },
        role.can.library && { id: "library", icon: "book", label: "Digital Library" }
      ].filter(Boolean)
    },
    {
      id: "modules",
      label: "Modules",
      header: true,
      collapsible: true,
      defaultOpen: true,
      emptyLabel: "No modules granted",
      items: granted.map((m) => ({
        id: m.id,
        icon: m.icon,
        label: m.name,
        disabled: m.stage === "soon",
        title: m.stage === "soon" ? `${m.name} \u2014 not released yet` : m.name
      }))
    },
    {
      id: "system",
      label: "System",
      header: true,
      collapsible: true,
      defaultOpen: true,
      items: [
        role.can.users && { id: "users", icon: "users", label: "User Management" },
        { id: "help", icon: "info", label: "Help" },
        { id: "settings", icon: "settings", label: "Settings" }
      ].filter(Boolean)
    }
  ]
});
const ScopeBar = ({ role }) => {
  const [zone, setZone] = useStateD("SCR \u2014 South Central Railway");
  const [division, setDivision] = useStateD("All divisions");
  const [section, setSection] = useStateD("All sections");
  return /* @__PURE__ */ React.createElement("div", { className: "rh-scopebar" }, /* @__PURE__ */ React.createElement("span", { style: { marginRight: "auto", fontSize: 12.5, color: "var(--ink-600)" } }, "Selected section: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink-900)" } }, section)), /* @__PURE__ */ React.createElement("span", { className: "rh-scope-label" }, "Global filters"), /* @__PURE__ */ React.createElement("select", { className: "rh-scope", value: zone, onChange: (e) => { setZone(e.target.value); setDivision("All divisions"); setSection("All sections"); } }, /* @__PURE__ */ React.createElement("option", null, "SCR \u2014 South Central Railway")), /* @__PURE__ */ React.createElement("select", { className: "rh-scope", value: division, onChange: (e) => { setDivision(e.target.value); setSection("All sections"); } }, ["All divisions", "Vijayawada Division", "Guntur Division", "Hyderabad Division", "Nanded Division"].map((v) => /* @__PURE__ */ React.createElement("option", { key: v }, v))), /* @__PURE__ */ React.createElement("select", { className: "rh-scope", value: section, onChange: (e) => setSection(e.target.value) }, ["All sections", "Vijayawada\u2013Gudivada", "Guntur\u2013Tenali", "Ongole\u2013Singarayakonda"].map((v) => /* @__PURE__ */ React.createElement("option", { key: v }, v))), /* @__PURE__ */ React.createElement("span", { className: "rh-scope-div" }), /* @__PURE__ */ React.createElement("button", { className: "rh-scope" }, "FY 2026\u201327", /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 13 })), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "refresh" }, "Refresh"), /* @__PURE__ */ React.createElement("span", { className: "rh-updated" }, "Updated 4 min ago"));
};
const KpiStrip = ({ selected, onSelect, canApprove }) => {
  const cards = [
    { id: "scope", label: "Stations in scope", icon: "train", value: SCOPE_TOTAL, foot: "SCR zone \xB7 4 divisions", color: "var(--ink-400)" },
    { id: "esp", label: "ESP approved", icon: "layers", value: 97, suffix: "/247", foot: "39% of scope", color: "#3737C8" },
    { id: "sip", label: "SIP approved", icon: "branch", value: 52, suffix: "/247", foot: "21% of scope", color: "#0D9488" },
    canApprove && { id: "queue", label: "Pending my approval", icon: "inbox", value: 14, foot: "5 overdue", color: "var(--danger)", hot: true },
    { id: "disc", label: "Open discrepancies", icon: "alert", value: 43, foot: "12 critical", color: "var(--warning)" }
  ].filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", { className: "rh-kpis" }, cards.map((c) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: c.id,
      className: "rh-kpi",
      style: { "--k": c.color },
      "data-sel": selected === c.id,
      onClick: () => onSelect(selected === c.id ? null : c.id)
    },
    /* @__PURE__ */ React.createElement("div", { className: "rh-kpi-label" }, /* @__PURE__ */ React.createElement(Icon, { name: c.icon, size: 13 }), c.label),
    /* @__PURE__ */ React.createElement("div", { className: "rh-kpi-value" }, c.value, c.suffix && /* @__PURE__ */ React.createElement("small", null, c.suffix)),
    /* @__PURE__ */ React.createElement("div", { className: "rh-kpi-foot", style: c.hot ? { color: "var(--danger-text)", fontWeight: 600 } : null }, c.foot)
  )));
};
const SplitBar = ({ split }) => {
  const total = split.reduce((s, x) => s + x.value, 0) || 1;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-bar" }, split.map((s) => /* @__PURE__ */ React.createElement("span", { key: s.label, style: { width: `${s.value / total * 100}%`, background: s.color } }))), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-legend" }, split.map((s) => /* @__PURE__ */ React.createElement("span", { className: "rh-legend-item", key: s.label }, /* @__PURE__ */ React.createElement("i", { style: { background: s.color } }), s.label, " ", /* @__PURE__ */ React.createElement("b", null, s.value)))));
};
const LegacyModuleTile = ({ mod, grant, compact }) => {
  const open = mod.stage !== "soon" && !!grant;
  const stats = MODULE_STATS[mod.id];
  const stageChip = mod.stage === "live" ? /* @__PURE__ */ React.createElement(Chip, { tone: "success", dot: true }, "Live") : mod.stage === "pilot" ? /* @__PURE__ */ React.createElement(Chip, { tone: "info", dot: true }, "Pilot") : /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Coming soon");
  return /* @__PURE__ */ React.createElement("div", { className: "rh-mod", style: { "--m": mod.color }, "data-open": open }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-top" }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: mod.icon, size: compact ? 17 : 19 })), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-name" }, mod.name, /* @__PURE__ */ React.createElement("span", { className: "rh-mod-code" }, mod.code)), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-desc" }, mod.full)), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-stage" }, stageChip)), open && stats && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-figure" }, /* @__PURE__ */ React.createElement("span", { className: "rh-mod-headline" }, stats.headline), /* @__PURE__ */ React.createElement("span", { className: "rh-mod-headline-label" }, stats.headlineLabel)), /* @__PURE__ */ React.createElement(SplitBar, { split: stats.split }), stats.alerts && /* @__PURE__ */ React.createElement("div", { className: "rh-mod-alerts" }, stats.alerts.map((a) => /* @__PURE__ */ React.createElement("div", { className: "rh-mod-alert", key: a.text, "data-tone": a.tone }, /* @__PURE__ */ React.createElement(Icon, { name: a.tone === "info" ? "info" : "alert", size: 13 }), a.text))), stats.note && /* @__PURE__ */ React.createElement("div", { className: "rh-mod-quiet", style: { marginLeft: 0 } }, stats.note)), !open && /* @__PURE__ */ React.createElement("div", { className: "rh-mod-placeholder" }, "Provisioned for your zone \u2014 the module appears here at release."), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-foot" }, open ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "rh-mod-cta" }, "Open ", mod.short, /* @__PURE__ */ React.createElement(Icon, { name: "arrow_right", size: 13 })), /* @__PURE__ */ React.createElement("span", { className: "rh-mod-quiet" }, grant === "view" ? "Read-only access" : grant === "full" ? "Full access" : "Edit access")) : /* @__PURE__ */ React.createElement("span", { className: "rh-mod-locked" }, /* @__PURE__ */ React.createElement(Icon, { name: "lock", size: 13 }), "Releases Q3 FY 2026\u201327")));
};
const ModuleTile = ({ mod, grant, compact }) => {
  const stats = MODULE_STATS[mod.id];
  return /* @__PURE__ */ React.createElement("div", { className: "rh-mod", style: { "--m": mod.color }, "data-open": true }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-top" }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: mod.icon, size: compact ? 17 : 19 })), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-name" }, mod.name, /* @__PURE__ */ React.createElement("span", { className: "rh-mod-code" }, mod.code)), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-desc" }, mod.full))), stats && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-figure" }, /* @__PURE__ */ React.createElement("span", { className: "rh-mod-headline" }, stats.headline), /* @__PURE__ */ React.createElement("span", { className: "rh-mod-headline-label" }, stats.headlineLabel)), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-counts" }, /* @__PURE__ */ React.createElement("div", { className: "rh-mod-count" }, /* @__PURE__ */ React.createElement("b", null, stats.generated), /* @__PURE__ */ React.createElement("span", null, "Generated")), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-count" }, /* @__PURE__ */ React.createElement("b", null, stats.approved), /* @__PURE__ */ React.createElement("span", null, "Approved")))), /* @__PURE__ */ React.createElement("div", { className: "rh-mod-foot" }, /* @__PURE__ */ React.createElement("button", { className: "rh-mod-cta" }, "Open module", /* @__PURE__ */ React.createElement(Icon, { name: "arrow_right", size: 13 })), /* @__PURE__ */ React.createElement("span", { className: "rh-mod-quiet" }, grant === "view" ? "Read-only access" : "Full access")));
};
const PipelineCard = () => {
  const max = PIPELINE[0].count;
  return /* @__PURE__ */ React.createElement("div", { className: "rh-card" }, /* @__PURE__ */ React.createElement("div", { className: "rh-card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "rh-card-title" }, "ESP \u2192 SIP pipeline"), /* @__PURE__ */ React.createElement("div", { className: "rh-card-sub" }, SCOPE_TOTAL, " stations \xB7 where the zone is stuck")), /* @__PURE__ */ React.createElement("div", { className: "rh-card-head-right" }, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "FY 2026\u201327"))), /* @__PURE__ */ React.createElement("div", { className: "rh-card-body", style: { padding: "10px 12px" } }, PIPELINE.map((s, i) => {
    const prev = i > 0 ? PIPELINE[i - 1].count : null;
    const drop = prev ? prev - s.count : 0;
    return /* @__PURE__ */ React.createElement("div", { className: "rh-stage", key: s.id, style: { "--c": s.color } }, /* @__PURE__ */ React.createElement("span", { className: "rh-stage-rail" }), /* @__PURE__ */ React.createElement("div", { className: "rh-stage-main" }, /* @__PURE__ */ React.createElement("div", { className: "rh-stage-name" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "rh-stage-desc" }, s.desc)), /* @__PURE__ */ React.createElement("div", { className: "rh-stage-track" }, /* @__PURE__ */ React.createElement("div", { className: "rh-stage-fill", style: { width: `${s.count / max * 100}%` } })), /* @__PURE__ */ React.createElement("div", { className: "rh-stage-num" }, /* @__PURE__ */ React.createElement("div", { className: "rh-stage-count" }, s.count), drop > 0 ? /* @__PURE__ */ React.createElement("div", { className: "rh-stage-drop" }, "\u2212", drop) : /* @__PURE__ */ React.createElement("div", { className: "rh-stage-pct" }, Math.round(s.count / max * 100), "%")));
  })), /* @__PURE__ */ React.createElement("div", { className: "rh-card-foot" }, /* @__PURE__ */ React.createElement("span", null, "Biggest drop-off: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink-700)" } }, "ESP validated \u2192 approved"), " (45 stations)"), /* @__PURE__ */ React.createElement("button", null, "Open ESP module \u2192")));
};
const AttentionCard = ({ canApprove }) => {
  const tabs = [
    canApprove && { id: "approvals", label: `Approvals ${APPROVALS.length}` },
    { id: "overdue", label: `Overdue ${OVERDUE.length}` },
    { id: "disc", label: "Discrepancies 43" }
  ].filter(Boolean);
  const [tabState, setTab] = useStateD(tabs[0].id);
  const tab = tabs.some((t) => t.id === tabState) ? tabState : tabs[0].id;
  return /* @__PURE__ */ React.createElement("div", { className: "rh-card" }, /* @__PURE__ */ React.createElement("div", { className: "rh-card-head", style: { paddingBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "rh-card-title" }, "Needs your attention"), /* @__PURE__ */ React.createElement("div", { className: "rh-card-sub" }, "Ranked by age \xB7 click to open the station"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 16px 0" } }, /* @__PURE__ */ React.createElement(PillTabs, { items: tabs, active: tab, onChange: setTab })), /* @__PURE__ */ React.createElement("div", { className: "rh-scroll", style: { marginTop: 10 } }, tab === "approvals" && APPROVALS.map((a) => /* @__PURE__ */ React.createElement("div", { className: "rh-row", key: a.station + a.doc }, /* @__PURE__ */ React.createElement("span", { className: "rh-doc", style: { "--d": DOC_TONE[a.doc] } }, a.doc), /* @__PURE__ */ React.createElement("div", { className: "rh-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "rh-row-title" }, a.station), /* @__PURE__ */ React.createElement("div", { className: "rh-row-meta" }, /* @__PURE__ */ React.createElement("span", { className: "rh-code" }, a.code), a.doc, " ", a.ver, " \xB7 ", a.who)), /* @__PURE__ */ React.createElement("div", { className: "rh-row-right" }, /* @__PURE__ */ React.createElement(Chip, { tone: a.tone, dot: true }, a.label), /* @__PURE__ */ React.createElement("span", { className: "rh-age", "data-hot": a.tone === "danger" }, a.age)))), tab === "overdue" && OVERDUE.map((o) => /* @__PURE__ */ React.createElement("div", { className: "rh-row", key: o.code + o.doc }, /* @__PURE__ */ React.createElement("span", { className: "rh-doc", style: { "--d": DOC_TONE[o.doc] } }, o.doc), /* @__PURE__ */ React.createElement("div", { className: "rh-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "rh-row-title" }, o.station), /* @__PURE__ */ React.createElement("div", { className: "rh-row-meta" }, /* @__PURE__ */ React.createElement("span", { className: "rh-code" }, o.code), o.desc)), /* @__PURE__ */ React.createElement("span", { className: "rh-age", "data-hot": o.days >= 15 }, o.days, "d"))), tab === "disc" && DISCREPANCIES.map((d) => /* @__PURE__ */ React.createElement("div", { className: "rh-row", key: d.code }, /* @__PURE__ */ React.createElement("span", { className: "rh-count-badge", "data-sev": d.count >= 10 ? "high" : "mid" }, d.count), /* @__PURE__ */ React.createElement("div", { className: "rh-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "rh-row-title" }, d.station), /* @__PURE__ */ React.createElement("div", { className: "rh-row-meta" }, /* @__PURE__ */ React.createElement("span", { className: "rh-code" }, d.code), d.desc)), /* @__PURE__ */ React.createElement("span", { className: "rh-doc", style: { "--d": DOC_TONE[d.doc] } }, d.doc)))), /* @__PURE__ */ React.createElement("div", { className: "rh-card-foot" }, /* @__PURE__ */ React.createElement("span", null, tab === "approvals" ? "5 overdue beyond 7 days" : tab === "overdue" ? "6 stations stalled" : "43 open across 6 stations"), /* @__PURE__ */ React.createElement("button", null, "View all \u2192")));
};
const DivisionTable = () => /* @__PURE__ */ React.createElement("div", { className: "rh-card" }, /* @__PURE__ */ React.createElement("div", { className: "rh-card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "rh-card-title" }, "Division-wise progress"), /* @__PURE__ */ React.createElement("div", { className: "rh-card-sub" }, "South Central Railway \xB7 247 stations")), /* @__PURE__ */ React.createElement("div", { className: "rh-card-head-right" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", trailingIcon: "arrow_right" }, "Drill down"))), /* @__PURE__ */ React.createElement("div", { className: "rh-table-wrap" }, /* @__PURE__ */ React.createElement("table", { className: "rh-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Division"), /* @__PURE__ */ React.createElement("th", { "data-align": "right" }, "Stations"), /* @__PURE__ */ React.createElement("th", null, "ESP"), /* @__PURE__ */ React.createElement("th", null, "SIP"), /* @__PURE__ */ React.createElement("th", { "data-align": "right" }, "Overall"), /* @__PURE__ */ React.createElement("th", { "data-align": "right" }, "Status"))), /* @__PURE__ */ React.createElement("tbody", null, DIVISIONS.map((d) => {
  const overall = Math.round((d.esp + d.sip) / 2);
  const overallColor = overall >= 60 ? "var(--success-text)" : overall >= 30 ? "var(--warning-text)" : "var(--danger-text)";
  return /* @__PURE__ */ React.createElement("tr", { key: d.name }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "rh-td-name" }, d.name), /* @__PURE__ */ React.createElement("div", { className: "rh-td-sub" }, "SCR \xB7 ", d.stations, " stations")), /* @__PURE__ */ React.createElement("td", { "data-align": "right" }, /* @__PURE__ */ React.createElement("span", { className: "rh-num" }, d.stations)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "rh-meter" }, /* @__PURE__ */ React.createElement("div", { className: "rh-meter-track" }, /* @__PURE__ */ React.createElement("div", { className: "rh-meter-fill", style: { width: `${d.esp}%`, background: "#3737C8" } })), /* @__PURE__ */ React.createElement("span", { className: "rh-meter-pct" }, d.esp, "%"))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "rh-meter" }, /* @__PURE__ */ React.createElement("div", { className: "rh-meter-track" }, /* @__PURE__ */ React.createElement("div", { className: "rh-meter-fill", style: { width: `${d.sip}%`, background: "#0D9488" } })), /* @__PURE__ */ React.createElement("span", { className: "rh-meter-pct" }, d.sip, "%"))), /* @__PURE__ */ React.createElement("td", { "data-align": "right" }, /* @__PURE__ */ React.createElement("span", { className: "rh-overall", style: { color: overallColor } }, overall, "%")), /* @__PURE__ */ React.createElement("td", { "data-align": "right" }, /* @__PURE__ */ React.createElement(Chip, { tone: d.tone, dot: true }, d.status)));
})))));
const ActivityCard = () => /* @__PURE__ */ React.createElement("div", { className: "rh-card" }, /* @__PURE__ */ React.createElement("div", { className: "rh-card-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "rh-card-title" }, "Recent activity"), /* @__PURE__ */ React.createElement("div", { className: "rh-card-sub" }, "Your actions across all modules")), /* @__PURE__ */ React.createElement("div", { className: "rh-card-head-right" }, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Last 7 days"))), /* @__PURE__ */ React.createElement("div", { className: "rh-scroll", style: { maxHeight: 296 } }, ACTIVITY.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.day }, /* @__PURE__ */ React.createElement("div", { className: "rh-day" }, g.day), g.rows.map((r) => /* @__PURE__ */ React.createElement("div", { className: "rh-row", key: r.action + r.code }, /* @__PURE__ */ React.createElement("span", { className: "rh-doc", style: { "--d": DOC_TONE[r.doc] } }, r.doc), /* @__PURE__ */ React.createElement("div", { className: "rh-row-main" }, /* @__PURE__ */ React.createElement("div", { className: "rh-row-title" }, r.action), /* @__PURE__ */ React.createElement("div", { className: "rh-row-meta" }, /* @__PURE__ */ React.createElement("span", { className: "rh-code" }, r.code), r.station)), /* @__PURE__ */ React.createElement("div", { className: "rh-row-right" }, /* @__PURE__ */ React.createElement(Chip, { tone: r.tone, dot: r.tone !== "neutral" }, r.label), /* @__PURE__ */ React.createElement("span", { className: "rh-age" }, r.time))))))), /* @__PURE__ */ React.createElement("div", { className: "rh-card-foot" }, /* @__PURE__ */ React.createElement("span", null, "6 actions this week"), /* @__PURE__ */ React.createElement("button", null, "Full history \u2192")));
const DashboardPage = ({ embedded = false }) => {
  const [roleId, setRoleId] = useStateD("zone_admin");
  const [nav, setNav] = useStateD("home");
  const [kpi, setKpi] = useStateD(null);
  const [zone, setZone] = useStateD("SCR \u2014 South Central Railway");
  const [division, setDivision] = useStateD("All divisions");
  const [section, setSection] = useStateD("All sections");
  const role = ROLES[roleId];
  const granted = useMemoD(
    () => MODULES.filter((m) => !!role.grants[m.id]),
    [roleId]
  );
  const primary = granted.filter((m) => m.stage === "live");
  const secondary = granted.filter((m) => m.stage !== "live");
  const sidebarNav = useMemoD(() => buildSidebarNav(role, granted), [roleId, granted]);
  const main = /* @__PURE__ */ React.createElement("div", { className: embedded ? "rh-main rh-main-embedded" : "rh-main" }, /* @__PURE__ */ React.createElement("div", { className: "rh-topbar" }, /* @__PURE__ */ React.createElement("div", { className: "rh-topbar-row" }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "rh-hello" }, "Good morning, ", role.user.name.split(" ")[0]), /* @__PURE__ */ React.createElement("div", { className: "rh-hello-sub" }, /* @__PURE__ */ React.createElement("span", null, role.label), /* @__PURE__ */ React.createElement("span", null, "Mon, 17 Aug 2026"), /* @__PURE__ */ React.createElement("span", { className: "rh-live" }, /* @__PURE__ */ React.createElement("i", null), granted.filter((m) => m.stage !== "soon").length, " modules active"))), /* @__PURE__ */ React.createElement("div", { className: "rh-topbar-spacer" }), /* @__PURE__ */ React.createElement("div", { className: "rh-topbar-actions" }, /* @__PURE__ */ React.createElement("div", { className: "rh-roleswitch", title: "Prototype control \u2014 re-renders the page for another role" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "rh-role" }, "Role"), /* @__PURE__ */ React.createElement("select", { id: "rh-role", value: roleId, onChange: (e) => setRoleId(e.target.value) }, Object.keys(ROLES).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, ROLES[k].label)))), /* @__PURE__ */ React.createElement(HeaderSearch, { placeholder: "Search stations, drawings, approvals\u2026" }), /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", title: "Notifications" }, /* @__PURE__ */ React.createElement(Icon, { name: "bell", size: 15 }), /* @__PURE__ */ React.createElement("span", { className: "ds-dot" })))), /* @__PURE__ */ React.createElement(ScopeBar, { role })), /* @__PURE__ */ React.createElement("div", { className: "rh-content" }, /* @__PURE__ */ React.createElement(KpiStrip, { selected: kpi, onSelect: setKpi, canApprove: role.can.approve }), /* @__PURE__ */ React.createElement("div", { className: "rh-sec" }, /* @__PURE__ */ React.createElement("div", { className: "rh-sec-head" }, /* @__PURE__ */ React.createElement("span", { className: "rh-sec-title" }, "Your modules"), /* @__PURE__ */ React.createElement("span", { className: "rh-sec-note" }, granted.length, " of ", MODULES.length, " granted to ", role.label), role.can.users && /* @__PURE__ */ React.createElement("button", { className: "rh-sec-link" }, "Manage access \u2192")), granted.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "rh-empty" }, "No modules are assigned to this role yet. Contact your zone administrator."), primary.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "rh-mod-grid" }, primary.map((m) => /* @__PURE__ */ React.createElement(ModuleTile, { key: m.id, mod: m, grant: role.grants[m.id] }))), secondary.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "rh-mod-grid-sm" }, secondary.map((m) => /* @__PURE__ */ React.createElement(ModuleTile, { key: m.id, mod: m, grant: role.grants[m.id], compact: true })))), /* @__PURE__ */ React.createElement("div", { className: "rh-grid-2" }, /* @__PURE__ */ React.createElement(PipelineCard, null), /* @__PURE__ */ React.createElement(AttentionCard, { canApprove: role.can.approve })), /* @__PURE__ */ React.createElement("div", { className: "rh-grid-2b" }, /* @__PURE__ */ React.createElement(DivisionTable, null), /* @__PURE__ */ React.createElement(ActivityCard, null))));
  if (embedded) return main;
  return /* @__PURE__ */ React.createElement("div", { className: "rh-app" }, /* @__PURE__ */ React.createElement(Sidebar, { active: nav, onSelect: setNav, project: null, ...sidebarNav }), main);
};
const rapidStyle = document.createElement("style");
rapidStyle.textContent = window.NAV_CSS + window.DATA_CSS + window.FORM_CSS + rapidCSS;
document.head.appendChild(rapidStyle);
window.DashboardPage = DashboardPage;
if (!window.__EMBED_DASHBOARD_PAGE) {
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(DashboardPage, null));
}
