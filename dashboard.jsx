// RAPID — Indian Railways digital engineering platform
// Home / landing page. What renders is driven entirely by the signed-in
// user's role + module grants (see ROLES + MODULES below).
const { useState: useStateD, useMemo: useMemoD } = React;

/* ═══════════════════════════════════════════════════════════════
   1. ACCESS MODEL
   The page is a function of (role → grants). Everything else —
   sidebar groups, module tiles, KPI strip, action queues — is
   filtered through `grants` so a new role needs no new markup.
   ═══════════════════════════════════════════════════════════════ */

// `name` is the full product name — used for the tile title and the sidebar entry.
// `short` is the bare module code, used only for in-copy references ("Open ESP").
const MODULES = [
  {
    id: "tad", code: "TAD", name: "RAPID Track Alignment Design", short: "Track Alignment",
    full: "Horizontal & vertical alignment, curves, gradients and chainage.",
    icon: "track", color: "#0EA5E9", stage: "pilot",
  },
  {
    id: "esp", code: "ESP", name: "RAPID ESP", short: "ESP",
    full: "Engineering Scale Plan — digitise, validate against SOD, approve.",
    icon: "layers", color: "#3737C8", stage: "live",
  },
  {
    id: "sip", code: "SIP", name: "RAPID SIP", short: "SIP",
    full: "Signal Interlocking Plan — generate from an approved ESP.",
    icon: "branch", color: "#0D9488", stage: "live",
  },
  {
    id: "toc", code: "TOC", name: "RAPID TOC", short: "TOC",
    full: "Table of Controls — derived from the approved interlocking plan.",
    icon: "file_check", color: "#B45309", stage: "soon",
  },
  {
    id: "kavach", code: "KVC", name: "RAPID Kavach", short: "Kavach",
    full: "Kavach asset planning, RFID mapping and station static data.",
    icon: "shield", color: "#BE123C", stage: "soon",
  },
];

// grant levels: "full" (act + approve) · "edit" · "view" · undefined (no access)
const ROLES = {
  zone_admin: {
    label: "Zone Admin",
    user: { name: "Ashwini Vaishnaw", initials: "AV", designation: "Sr. DSTE · Zone Admin" },
    scope: { zone: "SCR — South Central Railway", division: "All divisions", section: "All sections" },
    grants: { tad: "full", esp: "full", sip: "full", toc: "full", kavach: "full" },
    can: { library: true, approve: true, users: true, drillDivision: true },
  },
  div_engineer: {
    label: "Division Engineer",
    user: { name: "K. Naidu", initials: "KN", designation: "SSE/Signal · Vijayawada" },
    scope: { zone: "SCR — South Central Railway", division: "Vijayawada Division", section: "All sections" },
    grants: { esp: "edit", sip: "edit" },
    can: { library: true, approve: false, users: false, drillDivision: false },
  },
  approver: {
    label: "Approver",
    user: { name: "R. Sharma", initials: "RS", designation: "Sr. DEN · SCR" },
    scope: { zone: "SCR — South Central Railway", division: "All divisions", section: "All sections" },
    grants: { esp: "view", sip: "view", toc: "view" },
    can: { library: true, approve: true, users: false, drillDivision: true },
  },
};

/* ═══════════════════════════════════════════════════════════════
   2. DATA (static mock — 247 stations in the SCR zone scope)
   ═══════════════════════════════════════════════════════════════ */

const SCOPE_TOTAL = 247;

const MODULE_STATS = {
  tad: {
    headline: "12", headlineLabel: "sections in design",
    split: [
      { label: "Approved", value: 3, color: "#16A34A" },
      { label: "Under design", value: 7, color: "#0EA5E9" },
      { label: "On hold", value: 2, color: "#CBD3DC" },
    ],
    note: "Pilot — Vijayawada–Gudivada doubling",
    generated: 8, approved: 3,
  },
  esp: {
    headline: "247", headlineLabel: "stations in scope",
    split: [
      { label: "Approved", value: 97, color: "#16A34A" },
      { label: "In progress", value: 108, color: "#3737C8" },
      { label: "Not started", value: 42, color: "#CBD3DC" },
    ],
    alerts: [
      { tone: "danger", text: "14 awaiting your approval" },
      { tone: "warning", text: "43 open discrepancies" },
    ],
    generated: 205, approved: 97,
  },
  sip: {
    headline: "97", headlineLabel: "stations ESP-cleared",
    split: [
      { label: "Approved", value: 52, color: "#16A34A" },
      { label: "In review", value: 22, color: "#0D9488" },
      { label: "Not generated", value: 23, color: "#CBD3DC" },
    ],
    alerts: [
      { tone: "info", text: "150 stations blocked on ESP approval" },
    ],
    generated: 74, approved: 52,
  },
  toc: { headline: "41", headlineLabel: "stations SIP-ready", generated: 18, approved: 11, split: [] },
  kavach: { headline: "9", headlineLabel: "active designs", generated: 7, approved: 4, split: [] },
};

const PIPELINE = [
  { id: "survey", label: "Survey data received", desc: "Total station / LiDAR upload verified", count: 247, module: "esp", color: "#94A3B8" },
  { id: "digitised", label: "ESP digitised", desc: "Yard drawn, assets tagged", count: 205, module: "esp", color: "#6366F1" },
  { id: "validated", label: "ESP validated", desc: "SOD + zone rules passed", count: 142, module: "esp", color: "#3737C8" },
  { id: "esp_approved", label: "ESP approved", desc: "Frozen baseline, SIP unlocked", count: 97, module: "esp", color: "#2929A0" },
  { id: "sip_gen", label: "SIP generated", desc: "Interlocking plan drafted", count: 74, module: "sip", color: "#14B8A6" },
  { id: "sip_approved", label: "SIP approved", desc: "Ready for TOC generation", count: 52, module: "sip", color: "#0D9488" },
];

const APPROVALS = [
  { doc: "SIP", station: "Vijayawada Junction", code: "BZA", ver: "v1.2", who: "R. Sharma", tone: "danger", label: "Overdue", age: "12d" },
  { doc: "ESP", station: "Guntur Junction", code: "GNT", ver: "v2.0", who: "K. Naidu", tone: "danger", label: "Overdue", age: "8d" },
  { doc: "SIP", station: "Tenali Junction", code: "TEL", ver: "v1.0", who: "S. Reddy", tone: "warning", label: "Pending", age: "3d" },
  { doc: "ESP", station: "Ongole", code: "OGL", ver: "v1.0", who: "V. Kumar", tone: "warning", label: "Pending", age: "1d" },
  { doc: "ESP", station: "Bhimavaram Town", code: "BVRT", ver: "v1.1", who: "M. Prasad", tone: "info", label: "In review", age: "Today" },
];

const OVERDUE = [
  { station: "Nanded", code: "NED", desc: "ESP not started · added 45 days ago", doc: "ESP", days: 45 },
  { station: "Eluru", code: "EE", desc: "Survey data never uploaded", doc: "ESP", days: 30 },
  { station: "Kurnool City", code: "KRNT", desc: "SIP draft not submitted", doc: "SIP", days: 22 },
  { station: "Secunderabad Jn", code: "SC", desc: "SIP validation incomplete · 5 violations", doc: "SIP", days: 15 },
  { station: "Vijayawada Junction", code: "BZA", desc: "ESP validation started · no activity", doc: "ESP", days: 12 },
  { station: "Guntur Junction", code: "GNT", desc: "Awaiting approval · submitted 8d ago", doc: "ESP", days: 8 },
];

const DISCREPANCIES = [
  { count: 12, station: "Vijayawada Junction", code: "BZA", desc: "Track spacing violations · 3 critical", doc: "ESP" },
  { count: 9, station: "Bisalwas Kalan", code: "BIWK", desc: "SOD rule failures · signal placement", doc: "SIP" },
  { count: 6, station: "Tenali Junction", code: "TEL", desc: "Platform offset violations", doc: "ESP" },
  { count: 5, station: "Guntur Junction", code: "GNT", desc: "Turnout chainage mismatch", doc: "ESP" },
  { count: 4, station: "Rajahmundry", code: "RJY", desc: "Fouling mark not derivable", doc: "SIP" },
  { count: 3, station: "Ongole", code: "OGL", desc: "Missing LC gate annotation", doc: "ESP" },
];

const DIVISIONS = [
  { name: "Vijayawada", stations: 89, esp: 72, sip: 34, status: "On track", tone: "success" },
  { name: "Hyderabad", stations: 71, esp: 88, sip: 52, status: "On track", tone: "success" },
  { name: "Guntur", stations: 64, esp: 60, sip: 22, status: "At risk", tone: "warning" },
  { name: "Nanded", stations: 23, esp: 30, sip: 8, status: "Lagging", tone: "danger" },
];

const ACTIVITY = [
  { day: "Today · Mon, 17 Aug", rows: [
    { doc: "SIP", action: "Resumed SIP validation", station: "Bisalwas Kalan", code: "BIWK", tone: "info", label: "In progress", time: "2:30 PM" },
    { doc: "ESP", action: "Approved ESP v2.1", station: "Tenali Junction", code: "TEL", tone: "success", label: "Approved", time: "11:00 AM" },
    { doc: "ESP", action: "Returned ESP with 3 remarks", station: "Ongole", code: "OGL", tone: "danger", label: "Returned", time: "9:15 AM" },
  ]},
  { day: "Yesterday · Sun, 16 Aug", rows: [
    { doc: "SIP", action: "Generated SIP draft", station: "Rajahmundry", code: "RJY", tone: "neutral", label: "Done", time: "4:45 PM" },
    { doc: "LIB", action: "Published SOD rule-set 2026.2", station: "Zone-wide", code: "SCR", tone: "neutral", label: "Done", time: "2:00 PM" },
    { doc: "ESP", action: "Fixed 3 SOD violations", station: "Guntur Junction", code: "GNT", tone: "neutral", label: "Done", time: "11:30 AM" },
  ]},
];

const DOC_TONE = { ESP: "#3737C8", SIP: "#0D9488", TOC: "#B45309", TAD: "#0EA5E9", LIB: "#64748B" };

/* ═══════════════════════════════════════════════════════════════
   3. STYLES
   ═══════════════════════════════════════════════════════════════ */

const rapidCSS = `
/* ── shell ── */
.rh-app { display: grid; grid-template-columns: 252px 1fr; height: 100vh; overflow: hidden; background: var(--canvas); }
.rh-app .ds-sidebar { width: 252px; height: 100vh; overflow: hidden; }
.rh-main { display: flex; flex-direction: column; height: 100vh; overflow: hidden; min-width: 0; }
/* embedded in Digital Library's own shell — it owns the sidebar and the height */
.rh-main-embedded { flex: 1; width: 100%; height: 100%; min-width: 0; background: var(--canvas); }

/* ── topbar ── */
.rh-topbar { flex-shrink: 0; background: var(--paper); border-bottom: var(--hairline); padding: 16px 28px 0; }
.rh-topbar-row { display: flex; align-items: flex-start; gap: 16px; }
.rh-hello { font-size: 21px; font-weight: 800; letter-spacing: -0.025em; color: var(--ink-900); line-height: 1.15; }
/* separators are drawn on the item, so a wrap never leaves a dangling "·" */
.rh-hello-sub { font-size: 12.5px; color: var(--ink-500); margin-top: 3px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rh-hello-sub > * + *::before { content: "·"; color: var(--ink-300); margin-right: 8px; }
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

/* ── content ── */
.rh-content { flex: 1; overflow-y: auto; padding: 22px 28px 60px; display: flex; flex-direction: column; gap: 22px; }
.rh-sec { display: flex; flex-direction: column; gap: 12px; }
.rh-sec-head { display: flex; align-items: baseline; gap: 10px; }
.rh-sec-title { font-size: 12px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); }
.rh-sec-note { font-size: 12px; color: var(--ink-400); }
.rh-sec-link { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--accent-text); cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
.rh-sec-link:hover { text-decoration: underline; }

/* ── KPI strip ── */
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

/* ── module tiles ── */
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

/* ── cards ── */
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

/* ── pipeline funnel ── */
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

/* ── list rows ── */
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

/* ── activity ── */
.rh-day { position: sticky; top: 0; z-index: 1; background: var(--ink-50); padding: 6px 16px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-400); border-bottom: var(--hairline); }

/* ── table ── */
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

/* ── empty / no-access ── */
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

/* ═══════════════════════════════════════════════════════════════
   4. NAV CONFIG — feeds the shared <Sidebar> from role grants
   ═══════════════════════════════════════════════════════════════ */

const buildSidebarNav = (role, granted) => ({
  brand: { mark: "R", title: "RAPID", sub: "Indian Railways" },
  // "Vijayawada Division" → "Vijayawada"; the 252px rail has no room for the noun
  scope: {
    label: "Scope",
    value: `${role.scope.zone.split(" — ")[0]} · ${role.scope.division.replace(/ Division$/, "")}`,
  },
  user: {
    initials: role.user.initials,
    name: role.user.name,
    role: role.user.designation,
    action: "log_out",
    actionTitle: "Sign out",
  },
  // Three titled sections. No counts, no stage tags — the rail is for
  // navigation; status lives on the dashboard itself.
  groups: [
    {
      id: "main", label: "Main", header: true, collapsible: true, defaultOpen: true,
      items: [
        { id: "home", icon: "home", label: "Home" },
        role.can.library && { id: "library", icon: "book", label: "Digital Library" },
      ].filter(Boolean),
    },
    {
      id: "modules", label: "Modules", header: true, collapsible: true, defaultOpen: true,
      emptyLabel: "No modules granted",
      items: granted.map((m) => ({
        id: m.id,
        icon: m.icon,
        label: m.name,
        disabled: m.stage === "soon",
        title: m.stage === "soon" ? `${m.name} — not released yet` : m.name,
      })),
    },
    {
      id: "system", label: "System", header: true, collapsible: true, defaultOpen: true,
      items: [
        role.can.users && { id: "users", icon: "users", label: "User Management" },
        { id: "help", icon: "info", label: "Help" },
        { id: "settings", icon: "settings", label: "Settings" },
      ].filter(Boolean),
    },
  ],
});

/* ═══════════════════════════════════════════════════════════════
   5. PIECES
   ═══════════════════════════════════════════════════════════════ */

const ScopeBar = ({ role, zone, division, section, onZone, onDivision, onSection }) => (
  <div className="rh-scopebar">
    <span style={{ marginRight: "auto", fontSize: 12.5, color: "var(--ink-600)" }}>Selected section: <b style={{ color: "var(--ink-900)" }}>{section}</b></span>
    <span className="rh-scope-label">Global filters</span>
    <select className="rh-scope" value={zone} onChange={onZone}><option>SCR — South Central Railway</option></select>
    <select className="rh-scope" value={division} onChange={onDivision}><option>All divisions</option><option>Vijayawada Division</option><option>Guntur Division</option><option>Hyderabad Division</option><option>Nanded Division</option></select>
    <select className="rh-scope" value={section} onChange={onSection}><option>All sections</option><option>Vijayawada–Gudivada</option><option>Guntur–Tenali</option><option>Ongole–Singarayakonda</option></select>
    <span className="rh-scope-div" />
    <button className="rh-scope">FY 2026–27<Icon name="chevron_down" size={13} /></button>
    <div className="rh-topbar-spacer" />
    <Btn variant="secondary" size="sm" leadingIcon="refresh">Refresh</Btn>
    <span className="rh-updated">Updated 4 min ago</span>
  </div>
);

const KpiStrip = ({ selected, onSelect, canApprove }) => {
  const cards = [
    { id: "scope", label: "Stations in scope", icon: "train", value: SCOPE_TOTAL, foot: "SCR zone · 4 divisions", color: "var(--ink-400)" },
    { id: "esp", label: "ESP approved", icon: "layers", value: 97, suffix: "/247", foot: "39% of scope", color: "#3737C8" },
    { id: "sip", label: "SIP approved", icon: "branch", value: 52, suffix: "/247", foot: "21% of scope", color: "#0D9488" },
    canApprove && { id: "queue", label: "Pending my approval", icon: "inbox", value: 14, foot: "5 overdue", color: "var(--danger)", hot: true },
    { id: "disc", label: "Open discrepancies", icon: "alert", value: 43, foot: "12 critical", color: "var(--warning)" },
  ].filter(Boolean);

  return (
    <div className="rh-kpis">
      {cards.map((c) => (
        <div
          key={c.id}
          className="rh-kpi"
          style={{ "--k": c.color }}
          data-sel={selected === c.id}
          onClick={() => onSelect(selected === c.id ? null : c.id)}
        >
          <div className="rh-kpi-label"><Icon name={c.icon} size={13} />{c.label}</div>
          <div className="rh-kpi-value">{c.value}{c.suffix && <small>{c.suffix}</small>}</div>
          <div className="rh-kpi-foot" style={c.hot ? { color: "var(--danger-text)", fontWeight: 600 } : null}>{c.foot}</div>
        </div>
      ))}
    </div>
  );
};

const SplitBar = ({ split }) => {
  const total = split.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <>
      <div className="rh-mod-bar">
        {split.map((s) => (
          <span key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div className="rh-mod-legend">
        {split.map((s) => (
          <span className="rh-legend-item" key={s.label}>
            <i style={{ background: s.color }} />{s.label} <b>{s.value}</b>
          </span>
        ))}
      </div>
    </>
  );
};

const ModuleTile = ({ mod, grant, compact }) => {
  const open = !!grant;
  const stats = MODULE_STATS[mod.id];
  const stageChip = mod.stage === "live"
    ? <Chip tone="success" dot>Live</Chip>
    : mod.stage === "pilot"
      ? <Chip tone="info" dot>Pilot</Chip>
      : <Chip tone="neutral">Coming soon</Chip>;

  return (
    <div className="rh-mod" style={{ "--m": mod.color }} data-open={open}>
      <div className="rh-mod-top">
        <div className="rh-mod-icon"><Icon name={mod.icon} size={compact ? 17 : 19} /></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="rh-mod-name">
            {mod.name}
            <span className="rh-mod-code">{mod.code}</span>
          </div>
          <div className="rh-mod-desc">{mod.full}</div>
        </div>
        <div className="rh-mod-stage">{stageChip}</div>
      </div>

      {open && stats && (
        <>
          <div className="rh-mod-figure">
            <span className="rh-mod-headline">{stats.headline}</span>
            <span className="rh-mod-headline-label">{stats.headlineLabel}</span>
          </div>
          <div className="rh-mod-counts"><div className="rh-mod-count"><b>{stats.generated}</b><span>Generated</span></div><div className="rh-mod-count"><b>{stats.approved}</b><span>Approved</span></div></div>
        </>
      )}

      {!open && (
        <div className="rh-mod-placeholder">
          Provisioned for your zone — the module appears here at release.
        </div>
      )}

      <div className="rh-mod-foot">
        {open ? (
          <>
            <button className="rh-mod-cta">Open module<Icon name="arrow_right" size={13} /></button>
            <span className="rh-mod-quiet">{grant === "view" ? "Read-only access" : grant === "full" ? "Full access" : "Edit access"}</span>
          </>
        ) : (
          <span className="rh-mod-locked"><Icon name="lock" size={13} />Releases Q3 FY 2026–27</span>
        )}
      </div>
    </div>
  );
};

const PipelineCard = () => {
  const max = PIPELINE[0].count;
  return (
    <div className="rh-card">
      <div className="rh-card-head">
        <div>
          <div className="rh-card-title">ESP → SIP pipeline</div>
          <div className="rh-card-sub">{SCOPE_TOTAL} stations · where the zone is stuck</div>
        </div>
        <div className="rh-card-head-right">
          <Chip tone="neutral">FY 2026–27</Chip>
        </div>
      </div>
      <div className="rh-card-body" style={{ padding: "10px 12px" }}>
        {PIPELINE.map((s, i) => {
          const prev = i > 0 ? PIPELINE[i - 1].count : null;
          const drop = prev ? prev - s.count : 0;
          return (
            <div className="rh-stage" key={s.id} style={{ "--c": s.color }}>
              <span className="rh-stage-rail" />
              <div className="rh-stage-main">
                <div className="rh-stage-name">{s.label}</div>
                <div className="rh-stage-desc">{s.desc}</div>
              </div>
              <div className="rh-stage-track">
                <div className="rh-stage-fill" style={{ width: `${(s.count / max) * 100}%` }} />
              </div>
              <div className="rh-stage-num">
                <div className="rh-stage-count">{s.count}</div>
                {drop > 0
                  ? <div className="rh-stage-drop">−{drop}</div>
                  : <div className="rh-stage-pct">{Math.round((s.count / max) * 100)}%</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rh-card-foot">
        <span>Biggest drop-off: <b style={{ color: "var(--ink-700)" }}>ESP validated → approved</b> (45 stations)</span>
        <button>Open ESP module →</button>
      </div>
    </div>
  );
};

const AttentionCard = ({ canApprove }) => {
  const tabs = [
    canApprove && { id: "approvals", label: `Approvals ${APPROVALS.length}` },
    { id: "overdue", label: `Overdue ${OVERDUE.length}` },
    { id: "disc", label: "Discrepancies 43" },
  ].filter(Boolean);
  const [tabState, setTab] = useStateD(tabs[0].id);
  // a role change can remove a tab under us — fall back to the first one
  const tab = tabs.some((t) => t.id === tabState) ? tabState : tabs[0].id;

  return (
    <div className="rh-card">
      <div className="rh-card-head" style={{ paddingBottom: 12 }}>
        <div>
          <div className="rh-card-title">Needs your attention</div>
          <div className="rh-card-sub">Ranked by age · click to open the station</div>
        </div>
      </div>
      <div style={{ padding: "10px 16px 0" }}>
        <PillTabs items={tabs} active={tab} onChange={setTab} />
      </div>

      <div className="rh-scroll" style={{ marginTop: 10 }}>
        {tab === "approvals" && APPROVALS.map((a) => (
          <div className="rh-row" key={a.station + a.doc}>
            <span className="rh-doc" style={{ "--d": DOC_TONE[a.doc] }}>{a.doc}</span>
            <div className="rh-row-main">
              <div className="rh-row-title">{a.station}</div>
              <div className="rh-row-meta">
                <span className="rh-code">{a.code}</span>{a.doc} {a.ver} · {a.who}
              </div>
            </div>
            <div className="rh-row-right">
              <Chip tone={a.tone} dot>{a.label}</Chip>
              <span className="rh-age" data-hot={a.tone === "danger"}>{a.age}</span>
            </div>
          </div>
        ))}

        {tab === "overdue" && OVERDUE.map((o) => (
          <div className="rh-row" key={o.code + o.doc}>
            <span className="rh-doc" style={{ "--d": DOC_TONE[o.doc] }}>{o.doc}</span>
            <div className="rh-row-main">
              <div className="rh-row-title">{o.station}</div>
              <div className="rh-row-meta"><span className="rh-code">{o.code}</span>{o.desc}</div>
            </div>
            <span className="rh-age" data-hot={o.days >= 15}>{o.days}d</span>
          </div>
        ))}

        {tab === "disc" && DISCREPANCIES.map((d) => (
          <div className="rh-row" key={d.code}>
            <span className="rh-count-badge" data-sev={d.count >= 10 ? "high" : "mid"}>{d.count}</span>
            <div className="rh-row-main">
              <div className="rh-row-title">{d.station}</div>
              <div className="rh-row-meta"><span className="rh-code">{d.code}</span>{d.desc}</div>
            </div>
            <span className="rh-doc" style={{ "--d": DOC_TONE[d.doc] }}>{d.doc}</span>
          </div>
        ))}
      </div>

      <div className="rh-card-foot">
        <span>{tab === "approvals" ? "5 overdue beyond 7 days" : tab === "overdue" ? "6 stations stalled" : "43 open across 6 stations"}</span>
        <button>View all →</button>
      </div>
    </div>
  );
};

const DivisionTable = () => (
  <div className="rh-card">
    <div className="rh-card-head">
      <div>
        <div className="rh-card-title">Division-wise progress</div>
        <div className="rh-card-sub">South Central Railway · 247 stations</div>
      </div>
      <div className="rh-card-head-right">
        <Btn variant="secondary" size="sm" trailingIcon="arrow_right">Drill down</Btn>
      </div>
    </div>
    <div className="rh-table-wrap">
      <table className="rh-table">
        <thead>
          <tr>
            <th>Division</th>
            <th data-align="right">Stations</th>
            <th>ESP</th>
            <th>SIP</th>
            <th data-align="right">Overall</th>
            <th data-align="right">Status</th>
          </tr>
        </thead>
        <tbody>
          {DIVISIONS.map((d) => {
            const overall = Math.round((d.esp + d.sip) / 2);
            const overallColor = overall >= 60 ? "var(--success-text)" : overall >= 30 ? "var(--warning-text)" : "var(--danger-text)";
            return (
              <tr key={d.name}>
                <td>
                  <div className="rh-td-name">{d.name}</div>
                  <div className="rh-td-sub">SCR · {d.stations} stations</div>
                </td>
                <td data-align="right"><span className="rh-num">{d.stations}</span></td>
                <td>
                  <div className="rh-meter">
                    <div className="rh-meter-track"><div className="rh-meter-fill" style={{ width: `${d.esp}%`, background: "#3737C8" }} /></div>
                    <span className="rh-meter-pct">{d.esp}%</span>
                  </div>
                </td>
                <td>
                  <div className="rh-meter">
                    <div className="rh-meter-track"><div className="rh-meter-fill" style={{ width: `${d.sip}%`, background: "#0D9488" }} /></div>
                    <span className="rh-meter-pct">{d.sip}%</span>
                  </div>
                </td>
                <td data-align="right"><span className="rh-overall" style={{ color: overallColor }}>{overall}%</span></td>
                <td data-align="right"><Chip tone={d.tone} dot>{d.status}</Chip></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const ActivityCard = () => (
  <div className="rh-card">
    <div className="rh-card-head">
      <div>
        <div className="rh-card-title">Recent activity</div>
        <div className="rh-card-sub">Your actions across all modules</div>
      </div>
      <div className="rh-card-head-right"><Chip tone="neutral">Last 7 days</Chip></div>
    </div>
    <div className="rh-scroll" style={{ maxHeight: 296 }}>
      {ACTIVITY.map((g) => (
        <div key={g.day}>
          <div className="rh-day">{g.day}</div>
          {g.rows.map((r) => (
            <div className="rh-row" key={r.action + r.code}>
              <span className="rh-doc" style={{ "--d": DOC_TONE[r.doc] }}>{r.doc}</span>
              <div className="rh-row-main">
                <div className="rh-row-title">{r.action}</div>
                <div className="rh-row-meta"><span className="rh-code">{r.code}</span>{r.station}</div>
              </div>
              <div className="rh-row-right">
                <Chip tone={r.tone} dot={r.tone !== "neutral"}>{r.label}</Chip>
                <span className="rh-age">{r.time}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div className="rh-card-foot">
      <span>6 actions this week</span>
      <button>Full history →</button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   6. PAGE
   ═══════════════════════════════════════════════════════════════ */

// `embedded` — Digital Library renders this inside its own LibrarySidebar shell,
// so we drop our sidebar and let the main column fill the space.
const DashboardPage = ({ embedded = false }) => {
  const [roleId, setRoleId] = useStateD("zone_admin");
  const [nav, setNav] = useStateD("home");
  const [kpi, setKpi] = useStateD(null);
  const [zone, setZone] = useStateD("SCR — South Central Railway");
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

  const main = (
      <div className={embedded ? "rh-main rh-main-embedded" : "rh-main"}>
        <div className="rh-topbar">
          <div className="rh-topbar-row">
            <div style={{ minWidth: 0 }}>
              <div className="rh-hello">Good morning, {role.user.name.split(" ")[0]}</div>
              {/* zone is deliberately not repeated here — it is in the scope bar below */}
              <div className="rh-hello-sub">
                <span>{role.label}</span>
                <span>Mon, 17 Aug 2026</span>
                <span className="rh-live"><i />{granted.filter((m) => m.stage !== "soon").length} modules active</span>
              </div>
            </div>
            <div className="rh-topbar-spacer" />
            <div className="rh-topbar-actions">
              <div className="rh-roleswitch" title="Prototype control — re-renders the page for another role">
                <label htmlFor="rh-role">Role</label>
                <select id="rh-role" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  {Object.keys(ROLES).map((k) => <option key={k} value={k}>{ROLES[k].label}</option>)}
                </select>
              </div>
              <HeaderSearch placeholder="Search stations, drawings, approvals…" />
              <button className="ds-icon-btn" title="Notifications"><Icon name="bell" size={15} /><span className="ds-dot" /></button>
            </div>
          </div>
          <ScopeBar role={role} zone={zone} division={division} section={section}
            onZone={(e) => { setZone(e.target.value); setDivision("All divisions"); setSection("All sections"); }}
            onDivision={(e) => { setDivision(e.target.value); setSection("All sections"); }}
            onSection={(e) => setSection(e.target.value)} />
        </div>

        <div className="rh-content">
          <KpiStrip selected={kpi} onSelect={setKpi} canApprove={role.can.approve} />

          <div className="rh-sec">
            {granted.length === 0 && (
              <div className="rh-empty">No modules are assigned to this role yet. Contact your zone administrator.</div>
            )}

            {primary.length > 0 && (
              <div className="rh-mod-grid">
                {primary.map((m) => <ModuleTile key={m.id} mod={m} grant={role.grants[m.id]} />)}
              </div>
            )}

            {secondary.length > 0 && (
              <div className="rh-mod-grid-sm">
                {secondary.map((m) => <ModuleTile key={m.id} mod={m} grant={role.grants[m.id]} compact />)}
              </div>
            )}
          </div>

          <div className="rh-grid-2">
            <PipelineCard />
            <AttentionCard canApprove={role.can.approve} />
          </div>

          <div className="rh-grid-2b">
            <DivisionTable />
            <ActivityCard />
          </div>
        </div>
      </div>
  );

  if (embedded) return main;

  return (
    <div className="rh-app">
      <Sidebar active={nav} onSelect={setNav} project={null} {...sidebarNav} />
      {main}
    </div>
  );
};

const rapidStyle = document.createElement("style");
rapidStyle.textContent = window.NAV_CSS + window.DATA_CSS + window.FORM_CSS + rapidCSS;
document.head.appendChild(rapidStyle);

window.DashboardPage = DashboardPage;

if (!window.__EMBED_DASHBOARD_PAGE) {
  ReactDOM.createRoot(document.getElementById("root")).render(<DashboardPage />);
}
