// RAPID — Indian Railways digital engineering platform
// Home / landing page. What renders is driven entirely by the signed-in
// user's role + module grants (see ROLES + MODULES below).
const { useState: useStateD, useMemo: useMemoD, useEffect: useEffectD, useRef: useRefD } = React;

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

const MODULE_ACCESS_STATS = {
  tad: {
    summary: "12 active designs",
    rows: [["Under review", 4], ["Completed", 3]],
  },
  esp: {
    summary: "128 stations",
    rows: [["Approved", 74], ["Need attention", 27]],
    accent: true,
  },
  sip: {
    summary: "74 ESP-ready",
    rows: [["Generated", 41], ["Approved", 14]],
    accent: true,
  },
  toc: {
    summary: "41 SIP-ready",
    rows: [["Generated", 18], ["Issues", 3]],
  },
  kavach: {
    summary: "9 active designs",
    rows: [["Validation pending", 3], ["Completed", 4]],
  },
};

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

const STAGE_DOCS = [
  { label: "Not started", esp: 18, sip: 33 },
  { label: "In progress", esp: 22, sip: 12 },
  { label: "Under validation", esp: 16, sip: 8 },
  { label: "Under review", esp: 12, sip: 9 },
  { label: "Submitted", esp: 8, sip: 5 },
  { label: "Approved", esp: 74, sip: 41 },
  { label: "Returned", esp: 6, sip: 3 },
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
.rh-main { display: flex; flex-direction: column; height: 100vh; overflow: hidden; min-width: 0; container: rh-home / inline-size; }
/* embedded in Digital Library's own shell — it owns the sidebar and the height */
.rh-main-embedded { flex: 1; width: 100%; height: 100%; min-width: 0; background: var(--canvas); }

/* ── topbar ── */
.rh-topbar { flex-shrink: 0; background: var(--paper); border-bottom: var(--hairline); padding: 0 24px; }
.rh-live { display: inline-flex; align-items: center; gap: 5px; color: var(--success-text); font-weight: 600; }
.rh-live i { width: 6px; height: 6px; border-radius: 50%; background: var(--success); display: block; }
.rh-topbar-spacer { flex: 1; min-width: 12px; }

/* Digital Library Home header */
.rh-home-head-main { min-height: 66px; padding: 13px 0 10px; display: flex; align-items: center; gap: 20px; }
.rh-home-head-copy { min-width: 0; }
.rh-home-title { margin: 0; color: var(--ink-900); font-size: 20px; font-weight: 800; line-height: 1.15; letter-spacing: -0.025em; }
.rh-home-title-pipe { margin: 0 7px; color: var(--ink-300); font-weight: 500; }
.rh-home-meta { margin-top: 4px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--ink-500); font-size: 11.5px; }
.rh-home-meta > * + *::before { content: "·"; margin-right: 8px; color: var(--ink-300); }
.rh-home-head-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.rh-home-head-actions .ds-search { width: 270px; }
.rh-home-head-actions .ds-search-input { height: 32px; padding-right: 12px; font-size: 12px; box-shadow: none; }
.rh-home-head-actions .ds-search-kbd { display: none; }

/* applied filters row */
.rh-scopebar { min-height: 45px; padding: 8px 0 10px; border-top: 1px solid var(--ink-100); display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.rh-scope-label { margin-right: 1px; color: var(--ink-400); font-size: 9px; font-weight: 800; letter-spacing: 0.09em; text-transform: uppercase; }
.rh-filter-chip { height: 26px; padding: 0 10px; border: 1px solid #D9DAF4; border-radius: var(--r-full); background: #F7F7FE; color: var(--ink-500); display: inline-flex; align-items: center; gap: 5px; font: inherit; font-size: 11px; cursor: pointer; white-space: nowrap; transition: 120ms; }
.rh-filter-chip:hover { border-color: #B9BCEB; background: #F1F1FC; }
.rh-filter-chip b { color: #30309C; font-weight: 750; }
.rh-scope-summary { color: var(--ink-400); font-size: 10.5px; white-space: nowrap; }
.rh-updated { font-size: 11px; color: var(--ink-400); font-variant-numeric: tabular-nums; }
.rh-filter-open { height: 30px; padding: 0 9px 0 10px; border: 1px solid #3737C8; border-radius: var(--r-md); background: #3737C8; color: #fff; display: inline-flex; align-items: center; gap: 7px; font: inherit; font-size: 11.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 10px -6px rgba(55,55,200,.75); }
.rh-filter-open:hover { background: #2F2FAE; border-color: #2F2FAE; }
.rh-filter-count { min-width: 17px; height: 17px; padding: 0 5px; border-radius: var(--r-full); background: rgba(255,255,255,.18); display: grid; place-items: center; font-size: 9.5px; }

/* right-side filter drawer */
.rh-filter-scrim { position: fixed; inset: 0; z-index: 110; padding: 0; border: 0; background: rgba(14,27,44,.30); cursor: default; animation: rhScrimIn 140ms ease-out; }
.rh-filter-drawer { position: fixed; z-index: 111; top: 0; right: 0; bottom: 0; width: min(336px, calc(100vw - 24px)); background: var(--paper); box-shadow: -18px 0 38px rgba(14,27,44,.14); display: flex; flex-direction: column; outline: none; animation: rhDrawerIn 170ms ease-out; }
@keyframes rhScrimIn { from { opacity: 0; } }
@keyframes rhDrawerIn { from { transform: translateX(18px); opacity: .7; } }
@media (prefers-reduced-motion: reduce) { .rh-filter-scrim, .rh-filter-drawer { animation: none; } }
.rh-filter-drawer-head { min-height: 60px; padding: 14px 17px; border-bottom: var(--hairline); display: flex; align-items: flex-start; gap: 12px; }
.rh-filter-drawer-title { color: var(--ink-900); font-size: 14px; font-weight: 800; }
.rh-filter-drawer-sub { margin-top: 2px; color: var(--ink-500); font-size: 10.5px; }
.rh-filter-close { margin-left: auto; width: 28px; height: 28px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); color: var(--ink-500); display: grid; place-items: center; cursor: pointer; }
.rh-filter-close:hover { background: var(--ink-50); color: var(--ink-900); }
.rh-filter-drawer-body { flex: 1; min-height: 0; overflow-y: auto; padding: 14px 17px 24px; display: flex; flex-direction: column; gap: 14px; }
.rh-filter-field { display: grid; gap: 5px; }
.rh-filter-field label { color: var(--ink-500); font-size: 9.5px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }
.rh-filter-select { width: 100%; height: 34px; padding: 0 10px; border: 1px solid #D8E0EA; border-radius: var(--r-md); background: var(--paper); color: var(--ink-900); font: inherit; font-size: 12px; font-weight: 600; outline: none; }
.rh-filter-select:focus { border-color: #3737C8; box-shadow: 0 0 0 3px rgba(55,55,200,.10); }
.rh-filter-select:disabled { background: var(--ink-50); color: var(--ink-400); cursor: not-allowed; }
.rh-filter-hint { color: var(--ink-400); font-size: 10px; }
.rh-filter-drawer-foot { padding: 12px 17px; border-top: var(--hairline); background: var(--ink-50); display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.rh-filter-reset, .rh-filter-apply { height: 34px; padding: 0 13px; border-radius: var(--r-md); font: inherit; font-size: 11.5px; font-weight: 700; cursor: pointer; }
.rh-filter-reset { border: var(--hairline); background: var(--paper); color: var(--ink-700); }
.rh-filter-apply { margin-left: auto; border: 1px solid #3737C8; background: #3737C8; color: #fff; }
.rh-filter-chip:focus-visible, .rh-filter-open:focus-visible, .rh-filter-close:focus-visible, .rh-filter-reset:focus-visible, .rh-filter-apply:focus-visible { outline: none; box-shadow: var(--shadow-focus); }

@media (max-width: 920px) {
  .rh-home-head-main { align-items: flex-start; flex-wrap: wrap; }
  .rh-home-head-actions { width: 100%; margin-left: 0; }
  .rh-home-head-actions .ds-search { width: auto; flex: 1; }
  .rh-scope-summary { display: none; }
}
@media (max-width: 640px) {
  .rh-topbar { padding-left: 15px; padding-right: 15px; }
  .rh-home-title { font-size: 18px; }
  .rh-home-head-actions { align-items: stretch; }
  .rh-home-head-actions .ds-search { min-width: 0; }
  .rh-updated { display: none; }
  .rh-filter-drawer { width: 100vw; }
}

/* ── content ── */
.rh-content { flex: 1; overflow-y: auto; padding: 22px 28px 60px; display: flex; flex-direction: column; gap: 22px; }
.rh-sec { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
.rh-sec-head { display: flex; align-items: baseline; gap: 10px; }
.rh-sec-head, .rh-empty { grid-column: 1 / -1; }
.rh-sec-title { font-size: 12px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink-500); }
.rh-sec-note { font-size: 12px; color: var(--ink-400); }
.rh-sec-link { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--accent-text); cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
.rh-sec-link:hover { text-decoration: underline; }

/* ── module access strip ── */
.rh-module-access { min-width: 0; display: grid; gap: 12px; }
.rh-module-access-title { margin: 0; color: var(--ink-500); font-size: 12px; font-weight: 800; letter-spacing: .07em; line-height: 1; text-transform: uppercase; }
.rh-module-access-grid { min-width: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
.rh-access-card { position: relative; min-width: 0; min-height: 158px; height: 100%; padding: 14px 15px 13px; border: var(--hairline); border-radius: var(--r-lg); background: var(--paper); display: grid; grid-template-rows: auto 1fr auto; row-gap: 10px; overflow: hidden; transition: border-color 150ms, box-shadow 150ms, transform 150ms; }
.rh-access-card[data-accent="true"]::before { content: ""; position: absolute; z-index: 1; top: -1px; left: -1px; right: -1px; height: 3px; border-radius: var(--r-lg) var(--r-lg) 0 0; background: #4141D8; }
.rh-access-card:hover { border-color: #C7D2E1; box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.rh-access-head { min-width: 0; min-height: 54px; display: grid; grid-template-columns: 34px minmax(0, 1fr); align-items: start; gap: 10px; }
.rh-access-icon { width: 34px; height: 34px; border-radius: 9px; background: #F1F1FF; color: #3737C8; display: grid; place-items: center; }
.rh-access-copy { min-width: 0; }
.rh-access-name { margin: 1px 0 0; color: var(--ink-900); font-size: 13.5px; font-weight: 700; letter-spacing: -.012em; line-height: 1.25; }
.rh-access-summary { margin-top: 5px; color: var(--ink-400); font-size: 11px; line-height: 1.25; }
.rh-access-metrics { align-self: start; display: grid; gap: 9px; margin: 0; }
.rh-access-row { min-width: 0; display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.rh-access-row dt { min-width: 0; color: var(--ink-500); font-size: 11px; line-height: 1.35; }
.rh-access-row dd { margin: 0; color: var(--ink-900); font-size: 12px; font-weight: 800; line-height: 1.35; font-variant-numeric: tabular-nums; }
.rh-access-open { align-self: end; width: max-content; max-width: 100%; padding: 0; border: 0; background: transparent; color: #3030B5; display: inline-flex; align-items: center; gap: 4px; font: inherit; font-size: 11.5px; font-weight: 750; cursor: pointer; }
.rh-access-open:hover { color: #202090; text-decoration: underline; }
.rh-access-open:focus-visible { outline: none; border-radius: var(--r-xs); box-shadow: var(--shadow-focus); }

/* ── module tiles ── */
.rh-mod-grid, .rh-mod-grid-sm { display: contents; }
.rh-mod-grid > .rh-mod { grid-column: span 3; }
.rh-mod-grid-sm > .rh-mod { grid-column: span 2; }
.rh-mod { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 16px 18px 14px; display: grid; grid-template-columns: minmax(96px, .8fr) minmax(180px, 1.2fr); grid-template-rows: auto minmax(52px, 1fr) auto; column-gap: 16px; row-gap: 12px; min-width: 0; min-height: 212px; height: 100%; position: relative; overflow: hidden; transition: 160ms; }
.rh-mod[data-open="true"] { cursor: pointer; }
.rh-mod[data-open="true"]:hover { border-color: color-mix(in srgb, var(--m) 45%, var(--ink-200)); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.rh-mod[data-open="false"] { background: linear-gradient(180deg, var(--ink-50), var(--paper)); border-style: dashed; }
.rh-mod-top { grid-column: 1 / -1; grid-row: 1; display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; align-items: flex-start; column-gap: 11px; min-width: 0; min-height: 54px; }
.rh-mod-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0; background: color-mix(in srgb, var(--m) 12%, var(--paper)); color: var(--m); border: 1px solid color-mix(in srgb, var(--m) 22%, transparent); }
.rh-mod[data-open="false"] .rh-mod-icon { background: var(--ink-100); color: var(--ink-400); border-color: var(--ink-200); }
.rh-mod-name { min-width: 0; font-size: 14.5px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.015em; line-height: 1.25; display: flex; align-items: center; flex-wrap: wrap; column-gap: 7px; row-gap: 2px; }
.rh-mod-code { flex: 0 0 auto; white-space: nowrap; font-family: var(--font-mono); font-size: 9.5px; font-weight: 800; letter-spacing: 0.04em; padding: 1.5px 5px; border-radius: var(--r-xs); background: color-mix(in srgb, var(--m) 12%, var(--paper)); color: var(--m); }
.rh-mod[data-open="false"] .rh-mod-code { background: var(--ink-100); color: var(--ink-500); }
.rh-mod-desc { min-height: 2.9em; font-size: 11.5px; color: var(--ink-500); margin-top: 3px; line-height: 1.45; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.rh-mod-stage { margin-left: auto; flex-shrink: 0; }
.rh-mod-figure { grid-column: 1; grid-row: 2; align-self: center; min-width: 0; display: flex; align-items: baseline; gap: 7px; }
.rh-mod-counts { grid-column: 2; grid-row: 2; align-self: center; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
.rh-mod-count { min-width: 0; min-height: 50px; padding: 8px 10px; border: var(--hairline); border-radius: var(--r-md); background: var(--ink-50); display: flex; flex-direction: column; justify-content: center; }
.rh-mod-count b { display: block; font-size: 19px; line-height: 1.15; color: var(--ink-900); font-variant-numeric: tabular-nums; }
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
.rh-mod-placeholder { grid-column: 1 / -1; grid-row: 2; align-self: center; margin: 0; font-size: 11.5px; color: var(--ink-400); line-height: 1.5; }
.rh-mod-foot { grid-column: 1 / -1; grid-row: 3; margin-top: 0; padding-top: 11px; border-top: var(--hairline); display: flex; align-items: center; gap: 10px; }
.rh-mod-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; color: var(--m); background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
.rh-mod-cta:hover { text-decoration: underline; }
.rh-mod-quiet { font-size: 11.5px; color: var(--ink-400); margin-left: auto; }
.rh-mod-locked { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--ink-400); font-weight: 600; }

/* The three-up row keeps the same card height with tighter internal geometry. */
.rh-mod-grid-sm > .rh-mod { grid-template-columns: minmax(76px, .72fr) minmax(140px, 1.28fr); padding: 14px 15px 13px; column-gap: 12px; row-gap: 10px; }
.rh-mod-grid-sm .rh-mod-top { grid-template-columns: 34px minmax(0, 1fr) auto; column-gap: 10px; min-height: 72px; }
.rh-mod-grid-sm .rh-mod-icon { width: 34px; height: 34px; border-radius: 9px; }
.rh-mod-grid-sm .rh-mod-name { font-size: 13.5px; }
.rh-mod-grid-sm .rh-mod-desc { font-size: 11px; }
.rh-mod-grid-sm .rh-mod-headline { font-size: 22px; }
.rh-mod-grid-sm .rh-mod-count { min-height: 48px; padding: 7px 9px; }
.rh-mod-grid-sm .rh-mod-count b { font-size: 18px; }
.rh-mod-grid-sm .rh-mod-foot { padding-top: 9px; }

/* ── cards ── */
.rh-card { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); display: flex; flex-direction: column; overflow: hidden; }
/* .rh-content is a flex column — a card sitting directly in it (rather than
   inside one of the .rh-grid-* wrappers) would otherwise shrink to nothing. */
.rh-content > .rh-card { flex-shrink: 0; }
/* stage card: match the height of the card beside it, and let its bars use
   the full column width instead of the fixed 62px meter track */
.rh-grid-2 > .rh-card-fill { align-self: stretch; }
.rh-card-fill .rh-table-wrap { flex: 1; }
.rh-card-fill .rh-table { height: 100%; }
.rh-card-fill .rh-meter-track { width: auto; flex: 1; min-width: 44px; }
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
.rh-legend { display: flex; align-items: center; gap: 14px; font-size: 11.5px; color: var(--ink-500); }
.rh-legend-item { display: flex; align-items: center; gap: 6px; }
.rh-legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.rh-overall { font-size: 13.5px; font-weight: 800; font-variant-numeric: tabular-nums; }
.rh-num { font-size: 13px; font-weight: 600; color: var(--ink-700); font-variant-numeric: tabular-nums; }

/* ── empty / no-access ── */
.rh-empty { border: 1px dashed var(--ink-300); border-radius: var(--r-lg); padding: 28px; text-align: center; color: var(--ink-500); font-size: 13px; background: var(--paper); }

@media (max-width: 1380px) {
  .rh-grid-2, .rh-grid-2b { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 1240px) {
  .rh-mod-grid-sm > .rh-mod { grid-column: span 3; }
  .rh-mod-grid-sm > .rh-mod:last-child:nth-child(odd) { grid-column: 1 / -1; width: calc((100% - 16px) / 2); justify-self: center; }
}
@media (max-width: 1080px) {
  .rh-mod-grid > .rh-mod, .rh-mod-grid-sm > .rh-mod { grid-column: 1 / -1; min-height: 0; }
  .rh-mod-grid-sm > .rh-mod:last-child:nth-child(odd) { width: auto; justify-self: stretch; }
}
@container rh-home (max-width: 1100px) {
  .rh-module-access-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .rh-access-card { grid-column: span 2; }
  .rh-access-card:first-child:nth-last-child(2) { grid-column: 2 / span 2; }
  .rh-access-card:first-child:nth-last-child(2) + .rh-access-card { grid-column: 4 / span 2; }
  .rh-access-card:nth-child(4):nth-last-child(2) { grid-column: 2 / span 2; }
  .rh-access-card:nth-child(4):nth-last-child(2) + .rh-access-card { grid-column: 4 / span 2; }
}
@container rh-home (max-width: 760px) {
  .rh-module-access-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rh-access-card, .rh-access-card:first-child:nth-last-child(2), .rh-access-card:first-child:nth-last-child(2) + .rh-access-card, .rh-access-card:nth-child(4):nth-last-child(2), .rh-access-card:nth-child(4):nth-last-child(2) + .rh-access-card { grid-column: auto; }
  .rh-access-card:last-child:nth-child(odd) { grid-column: 1 / -1; width: calc((100% - 12px) / 2); justify-self: center; }
}
@container rh-home (max-width: 480px) {
  .rh-module-access-grid { grid-template-columns: minmax(0, 1fr); }
  .rh-access-card:last-child:nth-child(odd) { grid-column: auto; width: auto; justify-self: stretch; }
}
`;

/* ═══════════════════════════════════════════════════════════════
   4. NAV CONFIG — feeds the shared <Sidebar> from role grants
   ═══════════════════════════════════════════════════════════════ */

// Per-module sub-navigation. Only modules listed here get an expandable rail entry.
const MODULE_ACTIONS = {
  esp: [
    { id: "espCreate", icon: "plus", label: "Create ESP" },
    { id: "espUpdate", icon: "edit", label: "Update ESP" },
  ],
  sip: [
    { id: "sipCreate", icon: "plus", label: "Create SIP" },
    { id: "sipUpdate", icon: "edit", label: "Update SIP" },
  ],
};

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
        children: m.stage === "soon" ? undefined : MODULE_ACTIONS[m.id],
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

const DASHBOARD_FILTER_DEFAULTS = Object.freeze({
  viewBy: "Division",
  zone: "SCR — South Central Railway",
  division: "All divisions",
  section: "All sections",
  financialYear: "FY 2026–27",
  module: "All modules",
});

const DIVISION_SECTIONS = {
  "Vijayawada Division": ["Vijayawada–Gudivada", "Vijayawada–Tenali"],
  "Guntur Division": ["Guntur–Tenali", "Guntur–Nallapadu"],
  "Hyderabad Division": ["Secunderabad–Kazipet", "Kazipet–Dornakal"],
  "Nanded Division": ["Nanded–Mudkhed", "Mudkhed–Adilabad"],
};

const DashboardFilterField = ({ id, label, hint, children }) => (
  <div className="rh-filter-field">
    <label htmlFor={id}>{label}</label>
    {children}
    {hint && <span className="rh-filter-hint">{hint}</span>}
  </div>
);

const ScopeBar = ({ role }) => {
  const [filtersOpen, setFiltersOpen] = useStateD(false);
  const [appliedFilters, setAppliedFilters] = useStateD({ ...DASHBOARD_FILTER_DEFAULTS });
  const [draftFilters, setDraftFilters] = useStateD({ ...DASHBOARD_FILTER_DEFAULTS });
  const [updatedLabel, setUpdatedLabel] = useStateD("Updated 4 min ago");
  const openerRef = useRefD(null);
  const drawerRef = useRefD(null);
  const stage = "SIP generated";
  const { viewBy, zone, division, section, financialYear, module } = appliedFilters;
  const zoneCode = zone.split(" — ")[0];
  const filterCount = 4 + (module === "All modules" ? 0 : 1);
  const draftFilterCount = 4 + (draftFilters.module === "All modules" ? 0 : 1);
  const sectionOptions = DIVISION_SECTIONS[draftFilters.division] || [];
  const chips = [
    { label: "View by", value: viewBy },
    { label: "Zone", value: zoneCode },
    { label: "FY", value: financialYear },
    { label: "Stage", value: stage },
    ...(module === "All modules" ? [] : [{ label: "Module", value: module }]),
  ];

  const openFilters = (event) => {
    openerRef.current = event.currentTarget;
    setDraftFilters({ ...appliedFilters });
    setFiltersOpen(true);
  };
  const closeFilters = () => {
    setFiltersOpen(false);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };
  const updateDraft = (changes) => setDraftFilters((current) => ({ ...current, ...changes }));
  const applyFilters = () => {
    setAppliedFilters({ ...draftFilters });
    closeFilters();
  };

  useEffectD(() => {
    if (!filtersOpen) return undefined;
    const drawer = drawerRef.current;
    drawer?.querySelector(".rh-filter-close")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFilters();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = [...drawer.querySelectorAll("button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [filtersOpen]);

  return (
    <>
      <div className="rh-home-head-main">
        <div className="rh-home-head-copy">
          <h1 className="rh-home-title" aria-label="Rapid Platform | Dashboard">Rapid Platform<span className="rh-home-title-pipe">|</span>Dashboard</h1>
          <div className="rh-home-meta">
            <span>{role.label}</span>
            <span>Mon, 17 Aug 2026</span>
            <span className="rh-live"><i />{Object.keys(role.grants).length} modules active</span>
          </div>
        </div>
        <div className="rh-home-head-actions">
          <HeaderSearch placeholder="Search stations, drawings, approvals…" />
          <Btn variant="secondary" size="sm" leadingIcon="refresh" onClick={() => setUpdatedLabel("Updated just now")}>Refresh</Btn>
        </div>
      </div>

      <div className="rh-scopebar">
        <span className="rh-scope-label">Applied</span>
        {chips.map((chip) => (
          <button type="button" className="rh-filter-chip" key={chip.label} onClick={openFilters}>
            <span>{chip.label}</span><b>{chip.value}</b>
          </button>
        ))}
        <span className="rh-scope-summary">{zoneCode} · {division} · {section}</span>
        <div className="rh-topbar-spacer" />
        <span className="rh-updated" aria-live="polite">{updatedLabel}</span>
        <button type="button" className="rh-filter-open" onClick={openFilters}>
          <Icon name="filter" size={13} />Filters<span className="rh-filter-count">{filterCount}</span>
        </button>
      </div>

      {filtersOpen && (
        <>
          <button type="button" className="rh-filter-scrim" aria-label="Close filters" onClick={closeFilters} />
          <aside ref={drawerRef} tabIndex={-1} className="rh-filter-drawer" role="dialog" aria-modal="true" aria-labelledby="dashboard-filter-title">
            <div className="rh-filter-drawer-head">
              <div>
                <div className="rh-filter-drawer-title" id="dashboard-filter-title">Filters</div>
                <div className="rh-filter-drawer-sub">Zone → Division → Section cascade</div>
              </div>
              <button type="button" className="rh-filter-close" aria-label="Close filters" onClick={closeFilters}><Icon name="x" size={14} /></button>
            </div>
            <div className="rh-filter-drawer-body">
              <DashboardFilterField id="dashboard-view-by" label="View by" hint="Sets the grouping used by dashboard reporting">
                <select id="dashboard-view-by" className="rh-filter-select" value={draftFilters.viewBy} onChange={(e) => updateDraft({ viewBy: e.target.value })}>
                  <option>Zone</option><option>Division</option><option>Section</option>
                </select>
              </DashboardFilterField>
              <DashboardFilterField id="dashboard-zone" label="Zone" hint="Your admin scope">
                <select id="dashboard-zone" className="rh-filter-select" value={draftFilters.zone} onChange={(e) => updateDraft({ zone: e.target.value, division: "All divisions", section: "All sections" })}>
                  <option>SCR — South Central Railway</option>
                </select>
              </DashboardFilterField>
              <DashboardFilterField id="dashboard-division" label="Division" hint="Choosing a division resets the section">
                <select id="dashboard-division" className="rh-filter-select" value={draftFilters.division} onChange={(e) => updateDraft({ division: e.target.value, section: "All sections" })}>
                  <option>All divisions</option><option>Vijayawada Division</option><option>Guntur Division</option><option>Hyderabad Division</option><option>Nanded Division</option>
                </select>
              </DashboardFilterField>
              <DashboardFilterField id="dashboard-section" label="Section" hint={draftFilters.division === "All divisions" ? "Choose a division to select a section" : `Sections in ${draftFilters.division}`}>
                <select id="dashboard-section" className="rh-filter-select" value={draftFilters.section} disabled={draftFilters.division === "All divisions"} onChange={(e) => updateDraft({ section: e.target.value })}>
                  <option>All sections</option>
                  {sectionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </DashboardFilterField>
              <DashboardFilterField id="dashboard-financial-year" label="Financial year" hint="Approvals and aging are counted within the year">
                <select id="dashboard-financial-year" className="rh-filter-select" value={draftFilters.financialYear} onChange={(e) => updateDraft({ financialYear: e.target.value })}>
                  <option>FY 2026–27</option><option>FY 2025–26</option>
                </select>
              </DashboardFilterField>
              <DashboardFilterField id="dashboard-module" label="Module" hint="Narrows widgets to one module's work">
                <select id="dashboard-module" className="rh-filter-select" value={draftFilters.module} onChange={(e) => updateDraft({ module: e.target.value })}>
                  <option>All modules</option><option>RAPID Track Alignment Design</option><option>RAPID ESP</option><option>RAPID SIP</option><option>RAPID TOC</option><option>RAPID Kavach</option>
                </select>
              </DashboardFilterField>
            </div>
            <div className="rh-filter-drawer-foot">
              <button type="button" className="rh-filter-reset" onClick={() => setDraftFilters({ ...DASHBOARD_FILTER_DEFAULTS })}>Reset filters</button>
              <button type="button" className="rh-filter-apply" onClick={applyFilters}>Apply {draftFilterCount} filters</button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

const ModuleAccessStrip = ({ modules }) => {
  if (!modules.length) return null;

  return (
    <section className="rh-module-access" aria-labelledby="rh-module-access-title">
      <h2 className="rh-module-access-title" id="rh-module-access-title">Module access</h2>
      <div className="rh-module-access-grid">
        {modules.map((mod) => {
          const access = MODULE_ACCESS_STATS[mod.id];
          if (!access) return null;
          return (
            <article className="rh-access-card" data-accent={!!access.accent} key={mod.id}>
              <div className="rh-access-head">
                <span className="rh-access-icon"><Icon name={mod.icon} size={17} /></span>
                <div className="rh-access-copy">
                  <h3 className="rh-access-name">{mod.name}</h3>
                  <div className="rh-access-summary">{access.summary}</div>
                </div>
              </div>
              <dl className="rh-access-metrics">
                {access.rows.map(([label, value]) => (
                  <div className="rh-access-row" key={label}>
                    <dt>{label}</dt><dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" className="rh-access-open" aria-label={`Open ${mod.name} module`}>
                Open module <Icon name="arrow_right" size={12} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
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

const StageDocsCard = () => {
  const max = Math.max(...STAGE_DOCS.flatMap((s) => [s.esp, s.sip]));
  return (
    <div className="rh-card rh-card-fill">
      <div className="rh-card-head">
        <div>
          <div className="rh-card-title">Documents by workflow stage</div>
          <div className="rh-card-sub">ESP and SIP comparison</div>
        </div>
        <div className="rh-card-head-right">
          <span className="rh-legend">
            <span className="rh-legend-item"><span className="rh-legend-dot" style={{ background: "#3737C8" }} />ESP</span>
            <span className="rh-legend-item"><span className="rh-legend-dot" style={{ background: "#0D9488" }} />SIP</span>
          </span>
        </div>
      </div>
      <div className="rh-table-wrap">
        <table className="rh-table">
          <thead>
            <tr>
              <th>Stage</th>
              <th>ESP</th>
              <th>SIP</th>
            </tr>
          </thead>
          <tbody>
            {STAGE_DOCS.map((s) => (
              <tr key={s.label}>
                <td>{s.label}</td>
                <td>
                  <div className="rh-meter">
                    <div className="rh-meter-track"><div className="rh-meter-fill" style={{ width: `${(s.esp / max) * 100}%`, background: "#3737C8" }} /></div>
                    <span className="rh-meter-pct">{s.esp}</span>
                  </div>
                </td>
                <td>
                  <div className="rh-meter">
                    <div className="rh-meter-track"><div className="rh-meter-fill" style={{ width: `${(s.sip / max) * 100}%`, background: "#0D9488" }} /></div>
                    <span className="rh-meter-pct">{s.sip}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const role = ROLES[roleId];

  const granted = useMemoD(
    () => MODULES.filter((m) => !!role.grants[m.id]),
    [roleId]
  );
  const sidebarNav = useMemoD(() => buildSidebarNav(role, granted), [roleId, granted]);

  const main = (
      <div className={embedded ? "rh-main rh-main-embedded" : "rh-main"}>
        <div className="rh-topbar">
          <ScopeBar role={role} />
        </div>

        <div className="rh-content">
          <ModuleAccessStrip modules={granted} />

          {granted.length === 0 && (
            <div className="rh-empty">No modules are assigned to this role yet. Contact your zone administrator.</div>
          )}

          <div className="rh-grid-2">
            <PipelineCard />
            <StageDocsCard />
          </div>

          <div className="rh-grid-2b">
            <AttentionCard canApprove={role.can.approve} />
            <ActivityCard />
          </div>

          <DivisionTable />
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
