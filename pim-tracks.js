// Generated from pim-tracks.jsx. Edit the .jsx source and regenerate if needed.
(() => {
  (() => {
    const { useCallback, useEffect, useMemo, useRef, useState } = React;
    const D = window.PIM_TRACKS_MOCK;
    const ptCSS = `
.pt-page { display:flex; flex-direction:column; flex:1; min-width:0; height:100vh; overflow:hidden; background:var(--canvas); }

/* \u2500\u2500 Header \u2500\u2500 */
.pt-head { flex-shrink:0; display:flex; align-items:center; gap:14px; padding:12px 20px; background:linear-gradient(135deg,var(--accent-soft) 0%,var(--paper) 62%); box-shadow:0 3px 0 var(--accent),0 4px 16px rgba(14,27,44,.06); }
.pt-head-back { width:34px; height:34px; flex:0 0 auto; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-700); cursor:pointer; }
.pt-head-back:hover { background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.pt-head-back:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-head-copy { min-width:0; display:grid; gap:3px; }
.pt-head-title { display:flex; align-items:center; gap:8px; font-size:19px; font-weight:800; color:var(--ink-900); letter-spacing:-0.3px; line-height:1.15; }
.pt-head-sub { display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:11.5px; color:var(--ink-500); }
.pt-head-sub strong { color:var(--ink-700); font-weight:700; }
.pt-head-sep { color:var(--ink-300); }
.pt-head-spacer { flex:1; min-width:8px; }
.pt-head-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.pt-head-saved { font-size:11px; color:var(--ink-500); white-space:nowrap; }

/* \u2500\u2500 Progress summary \u2500\u2500 */
.pt-progress { flex-shrink:0; display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:8px 20px; border-bottom:var(--hairline); background:var(--paper); }
.pt-progress-bar-wrap { min-width:210px; display:grid; gap:5px; }
.pt-progress-text { font-size:11.5px; font-weight:700; color:var(--ink-700); font-variant-numeric:tabular-nums; }
.pt-progress-bar { height:6px; border-radius:var(--r-full); background:var(--ink-100); overflow:hidden; }
.pt-progress-fill { height:100%; border-radius:var(--r-full); background:linear-gradient(90deg,var(--accent),var(--accent-hover)); transition:width 220ms ease; }
.pt-stat-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.pt-stat { min-height:30px; display:inline-flex; align-items:center; gap:6px; padding:0 10px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-600); font-size:11.5px; font-weight:600; white-space:nowrap; }
.pt-stat strong { color:var(--ink-900); font-size:13px; font-weight:800; font-variant-numeric:tabular-nums; }
.pt-stat[data-tone="success"] { border-color:oklch(0.86 0.07 155); background:var(--success-soft); color:var(--success-text); }
.pt-stat[data-tone="success"] strong { color:var(--success-text); }
.pt-stat[data-tone="warning"] { border-color:oklch(0.86 0.09 85); background:var(--warning-soft); color:var(--warning-text); }
.pt-stat[data-tone="warning"] strong { color:var(--warning-text); }
.pt-stat[data-tone="danger"] { border-color:oklch(0.86 0.08 25); background:var(--danger-soft); color:var(--danger-text); }
.pt-stat[data-tone="danger"] strong { color:var(--danger-text); }
.pt-stat[data-tone="info"] { border-color:oklch(0.86 0.07 240); background:var(--info-soft); color:var(--info-text); }
.pt-stat[data-tone="info"] strong { color:var(--info-text); }

/* \u2500\u2500 Body split \u2500\u2500 */
.pt-body { flex:1; min-height:0; display:grid; grid-template-columns:minmax(0,1fr) clamp(340px,30%,460px); overflow:hidden; }
.pt-canvas-col { min-width:0; min-height:0; display:flex; flex-direction:column; background:var(--canvas); overflow:hidden; }

/* \u2500\u2500 Canvas toolbar \u2500\u2500 */
.pt-toolbar { min-height:42px; flex-shrink:0; display:flex; align-items:center; gap:8px; padding:6px 12px; border-bottom:var(--hairline); background:var(--paper); }
.pt-tool-group { display:inline-flex; align-items:center; gap:2px; padding:2px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); }
.pt-tool { width:30px; height:28px; display:grid; place-items:center; border:1px solid transparent; border-radius:var(--r-sm); background:transparent; color:var(--ink-600); cursor:pointer; }
.pt-tool:hover:not(:disabled) { background:var(--paper); border-color:var(--ink-200); color:var(--ink-900); }
.pt-tool[data-active="true"] { background:var(--ink-900); border-color:var(--ink-900); color:var(--paper); }
.pt-tool:disabled { opacity:.4; cursor:not-allowed; }
.pt-tool:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-tool-text { width:auto; padding:0 9px; gap:5px; font-family:inherit; font-size:11.5px; font-weight:700; }
.pt-zoom-value { min-width:46px; text-align:center; font-size:11.5px; font-weight:700; color:var(--ink-700); font-variant-numeric:tabular-nums; }
.pt-toolbar-spacer { flex:1; }
.pt-mode-note { display:inline-flex; align-items:center; gap:6px; height:26px; padding:0 10px; border-radius:var(--r-full); background:var(--accent-soft); color:var(--accent-text); font-size:11px; font-weight:800; }

/* \u2500\u2500 Layer popover \u2500\u2500 */
.pt-layer-anchor { position:relative; }
.pt-layer-pop { position:absolute; z-index:60; top:calc(100% + 6px); right:0; width:264px; padding:8px; border:var(--hairline); border-radius:var(--r-lg); background:var(--paper); box-shadow:var(--shadow-lg); display:grid; gap:2px; }
.pt-layer-pop-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:2px 6px 8px; border-bottom:var(--hairline); margin-bottom:4px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-500); }
.pt-layer-row { display:flex; align-items:center; gap:8px; width:100%; padding:6px 8px; border:1px solid transparent; border-radius:var(--r-md); background:transparent; color:var(--ink-700); font-family:inherit; font-size:12px; text-align:left; cursor:pointer; }
.pt-layer-row:hover { background:var(--ink-50); }
.pt-layer-row:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-layer-row[data-off="true"] { color:var(--ink-400); }
.pt-layer-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:600; }
.pt-layer-src { font-family:var(--font-mono); font-size:9.5px; color:var(--ink-400); }

/* \u2500\u2500 Stage \u2500\u2500 */
.pt-stage { position:relative; flex:1; min-height:0; overflow:hidden; background:#FBFBF8; background-image:linear-gradient(var(--ink-100) 1px,transparent 1px),linear-gradient(90deg,var(--ink-100) 1px,transparent 1px); background-size:36px 36px; }
.pt-svg { display:block; width:100%; height:100%; touch-action:none; }
.pt-svg[data-mode="pan"] { cursor:grab; }
.pt-svg[data-mode="pan"][data-dragging="true"] { cursor:grabbing; }
.pt-svg[data-mode="rect"], .pt-svg[data-mode="lasso"] { cursor:crosshair; }

.pt-seg { fill:none; stroke-linecap:round; stroke-linejoin:round; cursor:pointer; }
.pt-seg:focus-visible { outline:none; }
.pt-hit { fill:none; stroke:transparent; stroke-width:18; cursor:pointer; }
.pt-hit:focus-visible { outline:none; stroke:var(--accent); stroke-opacity:.28; }

.pt-seg[data-state="identified"] { stroke:oklch(0.55 0.13 155); stroke-width:4; }
.pt-seg[data-state="validated"] { stroke:oklch(0.55 0.13 155); stroke-width:4.5; }
.pt-seg[data-state="review"] { stroke:oklch(0.68 0.15 62); stroke-width:4.5; }
.pt-seg[data-state="failed"] { stroke:oklch(0.58 0.19 25); stroke-width:4.5; }
.pt-seg[data-state="unidentified"] { stroke:oklch(0.68 0.15 62); stroke-width:3.5; stroke-dasharray:11 7; }
.pt-seg[data-state="mapped"] { stroke:#6d5cd6; stroke-width:4.5; }
.pt-seg[data-state="rejected"] { stroke:var(--ink-400); stroke-width:2.5; opacity:.42; stroke-dasharray:3 6; }
.pt-seg[data-selected="true"] { stroke:var(--accent); stroke-width:7; filter:url(#pt-glow); }
.pt-seg[data-dim="true"] { opacity:.16; }
.pt-seg[data-focus-track="true"] { stroke-width:7; }
.pt-seg-outline { fill:none; stroke:var(--accent); stroke-width:12; stroke-opacity:.18; stroke-linecap:round; pointer-events:none; }

.pt-badge-bg { stroke:var(--paper); stroke-width:2; }
.pt-badge-text { font-family:var(--font-mono); font-size:11px; font-weight:700; fill:var(--paper); }
.pt-node { fill:var(--paper); stroke:var(--ink-500); stroke-width:1.6; }
.pt-turnout { fill:var(--paper); stroke:var(--ink-600); stroke-width:1.5; }
.pt-buffer { stroke:var(--ink-700); stroke-width:2.5; fill:none; }
.pt-platform { fill:var(--ink-200); stroke:var(--ink-400); stroke-width:1; }
.pt-platform-label { font-family:var(--font-sans); font-size:11px; font-weight:800; fill:var(--ink-600); }
.pt-structure { fill:var(--ink-100); stroke:var(--ink-400); stroke-width:1; stroke-dasharray:4 3; }
.pt-dim { stroke:var(--info); stroke-width:1; }
.pt-dim-text { font-family:var(--font-mono); font-size:11px; fill:var(--info-text); }
.pt-text { font-family:var(--font-sans); font-size:11.5px; font-weight:700; fill:var(--ink-500); letter-spacing:.04em; }
.pt-marquee { fill:rgba(55,55,200,.10); stroke:var(--accent); stroke-width:1.5; stroke-dasharray:5 4; }
.pt-lasso { fill:rgba(55,55,200,.10); stroke:var(--accent); stroke-width:1.5; stroke-dasharray:5 4; }
.pt-split-a { stroke:#6d5cd6 !important; }
.pt-split-b { stroke:oklch(0.62 0.13 240) !important; }

/* \u2500\u2500 Legend \u2500\u2500 */
.pt-legend { position:absolute; left:12px; top:12px; z-index:14; display:grid; gap:4px; padding:8px 10px; border:var(--hairline); border-radius:var(--r-md); background:rgba(255,255,255,.94); box-shadow:var(--shadow-sm); backdrop-filter:blur(8px); }
.pt-legend-title { font-size:9.5px; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-500); }
.pt-legend-row { display:flex; align-items:center; gap:7px; font-size:10.5px; font-weight:600; color:var(--ink-600); }
.pt-legend-swatch { width:22px; height:0; border-top-width:3px; border-top-style:solid; flex:0 0 auto; }

/* \u2500\u2500 Floating tool dock \u2500\u2500 */
.pt-dock { position:absolute; right:12px; top:12px; z-index:16; display:grid; gap:3px; padding:5px; border:var(--hairline); border-radius:var(--r-lg); background:rgba(255,255,255,.95); box-shadow:var(--shadow-lg); backdrop-filter:blur(10px); }
.pt-dock-divider { height:1px; margin:2px 3px; background:var(--ink-200); }

/* \u2500\u2500 Selection action bar \u2500\u2500 */
.pt-selbar { position:absolute; left:50%; bottom:14px; z-index:20; transform:translateX(-50%); max-width:calc(100% - 24px); display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:8px 10px 8px 14px; border:var(--hairline); border-radius:var(--r-lg); background:rgba(255,255,255,.97); box-shadow:var(--shadow-lg); backdrop-filter:blur(10px); }
.pt-selbar-count { display:flex; align-items:center; gap:7px; font-size:12.5px; font-weight:800; color:var(--ink-900); white-space:nowrap; }
.pt-selbar-count span { color:var(--ink-500); font-weight:600; font-size:11px; }
.pt-selbar-divider { width:1px; align-self:stretch; background:var(--ink-200); }
.pt-selbar-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }

/* \u2500\u2500 Status bar \u2500\u2500 */
.pt-statusbar { min-height:30px; flex-shrink:0; display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:5px 12px; border-top:var(--hairline); background:var(--paper); color:var(--ink-500); font-size:11px; }
.pt-statusbar strong { color:var(--ink-800); font-weight:700; }
.pt-statusbar-spacer { flex:1; }
.pt-kbd { display:inline-flex; align-items:center; padding:0 4px; height:16px; border:var(--hairline); border-bottom-width:2px; border-radius:var(--r-xs); background:var(--ink-50); font-family:var(--font-mono); font-size:9.5px; color:var(--ink-600); }

/* \u2500\u2500 Review panel \u2500\u2500 */
.pt-panel { min-width:0; min-height:0; display:flex; flex-direction:column; border-left:var(--hairline); background:var(--paper); overflow:hidden; }
.pt-panel-head { flex-shrink:0; padding:10px 14px 0; }
.pt-tabs { display:flex; gap:2px; padding:3px; border-radius:var(--r-md); background:var(--ink-50); border:var(--hairline); }
.pt-tab { flex:1; min-width:0; min-height:32px; display:inline-flex; align-items:center; justify-content:center; gap:5px; padding:0 8px; border:1px solid transparent; border-radius:var(--r-sm); background:transparent; color:var(--ink-600); font-family:inherit; font-size:11.5px; font-weight:700; cursor:pointer; white-space:nowrap; }
.pt-tab:hover { background:var(--paper); color:var(--ink-900); }
.pt-tab[data-active="true"] { background:var(--paper); border-color:var(--ink-200); color:var(--ink-900); box-shadow:var(--shadow-xs); }
.pt-tab:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-tab-count { min-width:19px; height:17px; display:grid; place-items:center; padding:0 5px; border-radius:var(--r-full); background:var(--ink-100); color:var(--ink-600); font-size:10px; font-weight:800; font-variant-numeric:tabular-nums; }
.pt-tab[data-active="true"] .pt-tab-count { background:var(--accent); color:var(--paper); }
.pt-panel-scroll { flex:1; min-height:0; overflow:auto; padding:10px 14px 14px; display:grid; gap:8px; align-content:start; }
.pt-panel-empty { display:grid; gap:6px; justify-items:center; padding:34px 16px; text-align:center; color:var(--ink-500); font-size:12px; }
.pt-panel-empty strong { color:var(--ink-800); font-size:13px; }

/* \u2500\u2500 Track card \u2500\u2500 */
.pt-card { display:grid; gap:8px; padding:10px 11px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); text-align:left; cursor:pointer; transition:border-color 120ms, box-shadow 120ms; }
.pt-card:hover { border-color:var(--ink-300); box-shadow:var(--shadow-sm); }
.pt-card:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-card[data-active="true"] { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
.pt-card[data-tone="warning"] { border-left:3px solid oklch(0.72 0.14 70); }
.pt-card[data-tone="danger"] { border-left:3px solid var(--danger); }
.pt-card[data-tone="success"] { border-left:3px solid oklch(0.62 0.13 155); }
.pt-card[data-tone="accent"] { border-left:3px solid #6d5cd6; }
.pt-card-top { display:flex; align-items:flex-start; gap:8px; }
.pt-card-id { font-family:var(--font-mono); font-size:10.5px; font-weight:700; color:var(--ink-500); }
.pt-card-name { font-size:13px; font-weight:800; color:var(--ink-900); line-height:1.25; }
.pt-card-name em { font-style:normal; color:var(--danger-text); }
.pt-card-heading { min-width:0; flex:1; display:grid; gap:2px; }
.pt-card-meta { display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:11px; color:var(--ink-500); }
.pt-card-meta b { color:var(--ink-700); font-weight:700; }
.pt-card-conf { display:inline-flex; align-items:center; gap:5px; font-size:10.5px; font-weight:700; color:var(--ink-600); }
.pt-conf-bar { width:42px; height:4px; border-radius:var(--r-full); background:var(--ink-100); overflow:hidden; }
.pt-conf-fill { height:100%; border-radius:var(--r-full); }
.pt-card-issues { display:flex; gap:4px; flex-wrap:wrap; }
.pt-issue { display:inline-flex; align-items:center; gap:4px; height:19px; padding:0 7px; border-radius:var(--r-full); background:var(--warning-soft); color:var(--warning-text); font-size:10px; font-weight:700; }
.pt-card-actions { display:flex; align-items:center; gap:5px; flex-wrap:wrap; padding-top:2px; border-top:var(--hairline); margin-top:1px; }
.pt-card-note { padding:7px 9px; border-radius:var(--r-sm); background:var(--ink-50); color:var(--ink-600); font-size:11px; line-height:1.45; }
.pt-card-note strong { color:var(--ink-800); }

/* \u2500\u2500 Detail panel \u2500\u2500 */
.pt-detail-head { display:flex; align-items:flex-start; gap:8px; padding:10px 14px; border-bottom:var(--hairline); background:var(--ink-50); flex-shrink:0; }
.pt-detail-back { width:28px; height:28px; flex:0 0 auto; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); color:var(--ink-600); cursor:pointer; }
.pt-detail-back:hover { background:var(--ink-100); color:var(--ink-900); }
.pt-detail-back:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-section { display:grid; gap:6px; }
.pt-section-label { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-500); }
.pt-section-label::after { content:""; flex:1; height:1px; background:var(--ink-200); }
.pt-kv { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-200); overflow:hidden; }
.pt-kv-item { display:grid; gap:2px; padding:7px 9px; background:var(--paper); min-width:0; }
.pt-kv-item[data-span="full"] { grid-column:1 / -1; }
.pt-kv-item span { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--ink-500); }
.pt-kv-item strong { font-size:12px; font-weight:700; color:var(--ink-900); overflow-wrap:anywhere; }
.pt-kv-item strong.mono { font-family:var(--font-mono); font-size:11.5px; }
.pt-action-grid { display:flex; flex-wrap:wrap; gap:6px; }
.pt-seg-list { display:grid; gap:4px; }
.pt-seg-row { display:flex; align-items:center; gap:8px; padding:6px 9px; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); font-size:11px; color:var(--ink-600); text-align:left; cursor:pointer; }
.pt-seg-row:hover { background:var(--ink-50); border-color:var(--ink-300); }
.pt-seg-row:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-seg-row strong { font-family:var(--font-mono); font-size:11px; color:var(--ink-900); }
.pt-seg-row-spacer { flex:1; }

/* \u2500\u2500 Validation summary \u2500\u2500 */
.pt-validation { flex-shrink:0; border-top:var(--hairline); background:var(--paper); display:flex; flex-direction:column; max-height:46%; }
.pt-validation-head { display:flex; align-items:center; gap:8px; width:100%; padding:9px 14px; border:none; background:var(--ink-50); color:var(--ink-900); font-family:inherit; font-size:12px; font-weight:800; cursor:pointer; text-align:left; }
.pt-validation-head:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-validation-head-spacer { flex:1; }
.pt-validation-body { flex:1; min-height:0; overflow:auto; padding:10px 14px 12px; display:grid; gap:6px; align-content:start; }
.pt-vmsg { display:grid; grid-template-columns:auto minmax(0,1fr); gap:8px; padding:8px 10px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); }
.pt-vmsg[data-severity="error"] { border-color:oklch(0.86 0.08 25); background:var(--danger-soft); }
.pt-vmsg[data-severity="warning"] { border-color:oklch(0.86 0.09 85); background:var(--warning-soft); }
.pt-vmsg[data-severity="information"] { border-color:oklch(0.86 0.07 240); background:var(--info-soft); }
.pt-vmsg-icon { padding-top:1px; }
.pt-vmsg[data-severity="error"] .pt-vmsg-icon { color:var(--danger-text); }
.pt-vmsg[data-severity="warning"] .pt-vmsg-icon { color:var(--warning-text); }
.pt-vmsg[data-severity="information"] .pt-vmsg-icon { color:var(--info-text); }
.pt-vmsg-body { min-width:0; display:grid; gap:4px; }
.pt-vmsg-top { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.pt-vmsg-cat { font-size:9.5px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-500); }
.pt-vmsg-text { font-size:11.5px; font-weight:700; color:var(--ink-900); line-height:1.4; }
.pt-vmsg-detail { font-size:11px; color:var(--ink-600); line-height:1.45; }
.pt-vmsg-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding-top:2px; }
.pt-vmsg-ack { display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:800; color:var(--success-text); }

/* \u2500\u2500 Drawer \u2500\u2500 */
.pt-drawer-backdrop { position:fixed; inset:0; z-index:900; background:rgba(14,27,44,.34); backdrop-filter:blur(1.5px); display:flex; justify-content:flex-end; animation:ptFade 140ms ease; }
@keyframes ptFade { from { opacity:0; } to { opacity:1; } }
@keyframes ptSlide { from { transform:translateX(16px); opacity:.4; } to { transform:none; opacity:1; } }
.pt-drawer { width:min(520px,100%); height:100%; display:flex; flex-direction:column; background:var(--paper); box-shadow:var(--shadow-lg); animation:ptSlide 160ms ease; }
.pt-drawer[data-wide="true"] { width:min(620px,100%); }
.pt-drawer-head { flex-shrink:0; display:flex; align-items:flex-start; gap:10px; padding:14px 16px; border-bottom:var(--hairline); }
.pt-drawer-icon { width:34px; height:34px; flex:0 0 auto; display:grid; place-items:center; border-radius:var(--r-md); background:var(--accent-soft); color:var(--accent-text); }
.pt-drawer-title { font-size:15px; font-weight:800; color:var(--ink-900); line-height:1.2; }
.pt-drawer-sub { margin-top:3px; font-size:11.5px; color:var(--ink-500); }
.pt-drawer-close { width:30px; height:30px; flex:0 0 auto; display:grid; place-items:center; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); color:var(--ink-600); cursor:pointer; }
.pt-drawer-close:hover { background:var(--ink-50); color:var(--ink-900); }
.pt-drawer-close:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-drawer-body { flex:1; min-height:0; overflow:auto; padding:14px 16px; display:grid; gap:12px; align-content:start; }
.pt-drawer-foot { flex-shrink:0; display:flex; align-items:center; gap:8px; padding:12px 16px; border-top:var(--hairline); background:var(--ink-50); }
.pt-drawer-foot-spacer { flex:1; }

/* \u2500\u2500 Drawer content bits \u2500\u2500 */
.pt-preview { display:grid; gap:8px; padding:10px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-50); }
.pt-preview-svg { width:100%; height:96px; border:var(--hairline); border-radius:var(--r-sm); background:var(--paper); }
.pt-chiplist { display:flex; gap:4px; flex-wrap:wrap; }
.pt-elm-chip { display:inline-flex; align-items:center; gap:5px; height:22px; padding:0 8px; border:var(--hairline); border-radius:var(--r-full); background:var(--paper); font-family:var(--font-mono); font-size:10.5px; font-weight:600; color:var(--ink-700); }
.pt-elm-chip button { display:grid; place-items:center; width:14px; height:14px; border:none; border-radius:var(--r-full); background:transparent; color:var(--ink-400); cursor:pointer; padding:0; }
.pt-elm-chip button:hover { background:var(--danger-soft); color:var(--danger-text); }
.pt-suggest { display:grid; gap:6px; }
.pt-track-opt { display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:9px; align-items:center; padding:9px 11px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); text-align:left; cursor:pointer; }
.pt-track-opt:hover { border-color:var(--ink-300); background:var(--ink-50); }
.pt-track-opt:focus-visible { outline:none; box-shadow:var(--shadow-focus); }
.pt-track-opt[data-checked="true"] { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); background:var(--accent-soft); }
.pt-track-opt-body { min-width:0; display:grid; gap:2px; }
.pt-track-opt-name { font-size:12.5px; font-weight:800; color:var(--ink-900); }
.pt-track-opt-reason { font-size:11px; color:var(--ink-600); line-height:1.4; }
.pt-radio { width:16px; height:16px; border-radius:var(--r-full); border:2px solid var(--ink-300); display:grid; place-items:center; }
.pt-track-opt[data-checked="true"] .pt-radio { border-color:var(--accent); }
.pt-track-opt[data-checked="true"] .pt-radio::after { content:""; width:8px; height:8px; border-radius:var(--r-full); background:var(--accent); }
.pt-match { display:inline-flex; align-items:center; gap:4px; height:20px; padding:0 8px; border-radius:var(--r-full); font-size:10px; font-weight:800; white-space:nowrap; }
.pt-match[data-level="High"] { background:var(--success-soft); color:var(--success-text); }
.pt-match[data-level="Medium"] { background:var(--warning-soft); color:var(--warning-text); }
.pt-match[data-level="Low"] { background:var(--ink-100); color:var(--ink-600); }
.pt-summary { display:grid; gap:1px; border:var(--hairline); border-radius:var(--r-md); background:var(--ink-200); overflow:hidden; }
.pt-summary-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:7px 10px; background:var(--paper); font-size:11.5px; color:var(--ink-600); }
.pt-summary-row strong { color:var(--ink-900); font-weight:800; font-variant-numeric:tabular-nums; }
.pt-summary-row[data-tone="danger"] strong { color:var(--danger-text); }
.pt-summary-row[data-tone="success"] strong { color:var(--success-text); }
.pt-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.pt-form-grid > [data-span="full"] { grid-column:1 / -1; }
.pt-split-group { display:grid; gap:7px; padding:10px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); }
.pt-split-group[data-active="true"] { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
.pt-split-title { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:800; color:var(--ink-900); }
.pt-split-dot { width:10px; height:10px; border-radius:var(--r-full); flex:0 0 auto; }

/* Design-system modals are absolutely positioned; pin them to the viewport
   inside this full-height screen so they clear the drawer layer. */
.pt-page .ds-modal-backdrop { position:fixed; z-index:1000; }

/* \u2500\u2500 Toast \u2500\u2500 */
.pt-toast-wrap { position:fixed; right:20px; bottom:20px; z-index:1200; display:grid; gap:8px; justify-items:end; }
.pt-toast { min-height:40px; display:inline-flex; align-items:center; gap:9px; max-width:400px; padding:9px 13px; border:var(--hairline); border-radius:var(--r-md); background:var(--paper); color:var(--ink-800); box-shadow:var(--shadow-lg); font-size:12px; font-weight:700; animation:ptSlide 160ms ease; }
.pt-toast[data-tone="success"] { border-color:oklch(0.9 0.06 155); background:var(--success-soft); color:var(--success-text); }
.pt-toast[data-tone="danger"] { border-color:oklch(0.9 0.06 25); background:var(--danger-soft); color:var(--danger-text); }
.pt-toast[data-tone="info"] { border-color:oklch(0.9 0.05 240); background:var(--info-soft); color:var(--info-text); }

/* \u2500\u2500 Responsive \u2500\u2500 */
.pt-panel-toggle { display:none; }
@media (max-width: 1180px) {
  .pt-body { grid-template-columns:minmax(0,1fr); }
  .pt-panel { position:fixed; z-index:800; top:0; right:0; bottom:0; width:min(420px,92vw); border-left:var(--hairline); box-shadow:var(--shadow-lg); transform:translateX(102%); transition:transform 180ms ease; }
  .pt-panel[data-open="true"] { transform:none; }
  .pt-panel-toggle { display:inline-flex; }
  .pt-legend { display:none; }
}
@media (max-width: 860px) {
  .pt-head { flex-wrap:wrap; }
  .pt-head-actions { width:100%; justify-content:flex-start; }
  .pt-form-grid { grid-template-columns:1fr; }
  .pt-kv { grid-template-columns:1fr; }
  .pt-selbar { left:12px; right:12px; transform:none; max-width:none; }
}
@media (prefers-reduced-motion: reduce) {
  .pt-drawer, .pt-toast, .pt-drawer-backdrop, .pt-panel { animation:none; transition:none; }
}
`;
    const CHAINAGE_ORIGIN_X = 60;
    const CHAINAGE_ORIGIN_KM = 431.24;
    const JOIN_TOLERANCE = 2;
    const chainageAt = (x) => (CHAINAGE_ORIGIN_KM + (x - CHAINAGE_ORIGIN_X) / 1e3).toFixed(3);
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const midpoint = (seg) => [(seg.start[0] + seg.end[0]) / 2, (seg.start[1] + seg.end[1]) / 2];
    const fmtLength = (m) => `${Number(m || 0).toFixed(1)} m`;
    const uniq = (list) => Array.from(new Set(list));
    const CONFIDENCE_COLOR = (score) => score >= 85 ? "oklch(0.62 0.13 155)" : score >= 70 ? "oklch(0.75 0.13 78)" : "oklch(0.60 0.18 25)";
    const segmentVisualState = (segment, track) => {
      if (segment.mappingStatus === "Not a Track") return "rejected";
      if (!track) return "unidentified";
      if (track.validationStatus === "Validated") return "validated";
      if (track.validationStatus === "Validation Failed") return "failed";
      if (track.validationStatus === "Needs Review") return "review";
      if (track.sourceType === "User Created" || track.sourceType === "User Corrected") return "mapped";
      return "identified";
    };
    const STATE_LEGEND = [
      { state: "validated", label: "Validated", color: "oklch(0.55 0.13 155)", dash: "solid" },
      { state: "identified", label: "AI identified", color: "oklch(0.55 0.13 155)", dash: "solid" },
      { state: "review", label: "Needs review", color: "oklch(0.68 0.15 62)", dash: "solid" },
      { state: "unidentified", label: "Unidentified", color: "oklch(0.68 0.15 62)", dash: "dashed" },
      { state: "failed", label: "Validation error", color: "oklch(0.58 0.19 25)", dash: "solid" },
      { state: "mapped", label: "User mapped", color: "#6d5cd6", dash: "solid" },
      { state: "rejected", label: "Not a track", color: "var(--ink-400)", dash: "dotted" }
    ];
    const analyseChain = (segs) => {
      const totalLength = segs.reduce((sum, seg) => sum + (seg.length || 0), 0);
      if (!segs.length) return { ordered: [], gaps: [], totalLength: 0, components: [] };
      const pool = segs.slice();
      const components = [];
      while (pool.length) {
        const ids = connectedTo([pool[0].id], pool);
        components.push(pool.filter((seg) => ids.includes(seg.id)));
        for (let i = pool.length - 1; i >= 0; i -= 1) {
          if (ids.includes(pool[i].id)) pool.splice(i, 1);
        }
      }
      const westEdge = (list) => Math.min(...list.map((seg) => Math.min(seg.start[0], seg.end[0])));
      components.sort((a, b) => westEdge(a) - westEdge(b));
      const ordered = components.flatMap(
        (list) => list.slice().sort((a, b) => Math.min(a.start[0], a.end[0]) - Math.min(b.start[0], b.end[0])).map((seg) => seg.start[0] <= seg.end[0] ? seg : { ...seg, start: seg.end, end: seg.start, reversed: true })
      );
      const gaps = [];
      for (let i = 1; i < components.length; i += 1) {
        let distance = Infinity;
        let from = null;
        let to = null;
        components[i - 1].forEach((a) => {
          components[i].forEach((b) => {
            [[a.start, b.start], [a.start, b.end], [a.end, b.start], [a.end, b.end]].forEach(([p, q]) => {
              const d = dist(p, q);
              if (d < distance) {
                distance = d;
                from = a.id;
                to = b.id;
              }
            });
          });
        });
        gaps.push({ from, to, distance });
      }
      return { ordered, gaps, totalLength, components };
    };
    const connectedTo = (seedIds, pool) => {
      const byId = new Map(pool.map((seg) => [seg.id, seg]));
      const found = new Set(seedIds.filter((id) => byId.has(id)));
      let grew = true;
      while (grew) {
        grew = false;
        pool.forEach((seg) => {
          if (found.has(seg.id)) return;
          const touches = Array.from(found).some((id) => {
            const other = byId.get(id);
            return dist(other.start, seg.start) <= JOIN_TOLERANCE || dist(other.start, seg.end) <= JOIN_TOLERANCE || dist(other.end, seg.start) <= JOIN_TOLERANCE || dist(other.end, seg.end) <= JOIN_TOLERANCE;
          });
          if (touches) {
            found.add(seg.id);
            grew = true;
          }
        });
      }
      return Array.from(found);
    };
    const pathBetween = (fromId, toId, pool) => {
      const byId = new Map(pool.map((seg) => [seg.id, seg]));
      if (!byId.has(fromId) || !byId.has(toId)) return [];
      const touching = (a, b) => dist(a.start, b.start) <= JOIN_TOLERANCE || dist(a.start, b.end) <= JOIN_TOLERANCE || dist(a.end, b.start) <= JOIN_TOLERANCE || dist(a.end, b.end) <= JOIN_TOLERANCE;
      const queue = [[fromId]];
      const seen = /* @__PURE__ */ new Set([fromId]);
      while (queue.length) {
        const trail = queue.shift();
        const head = byId.get(trail[trail.length - 1]);
        if (head.id === toId) return trail;
        pool.forEach((seg) => {
          if (seen.has(seg.id) || !touching(head, seg)) return;
          seen.add(seg.id);
          queue.push([...trail, seg.id]);
        });
      }
      return [];
    };
    const bboxOf = (seg) => ({
      x1: Math.min(seg.start[0], seg.end[0]) - 6,
      y1: Math.min(seg.start[1], seg.end[1]) - 6,
      x2: Math.max(seg.start[0], seg.end[0]) + 6,
      y2: Math.max(seg.start[1], seg.end[1]) + 6
    });
    const rectHits = (rect, seg) => {
      const box = bboxOf(seg);
      return !(box.x2 < rect.x1 || box.x1 > rect.x2 || box.y2 < rect.y1 || box.y1 > rect.y2);
    };
    const pointInPolygon = (point, polygon) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        const intersects = yi > point[1] !== yj > point[1] && point[0] < (xj - xi) * (point[1] - yi) / (yj - yi || 1e-9) + xi;
        if (intersects) inside = !inside;
      }
      return inside;
    };
    const lassoHits = (polygon, seg) => [seg.start, seg.end, midpoint(seg)].some((point) => pointInPolygon(point, polygon));
    const rankTracks = (tracks, selection, segments) => {
      if (!selection.length) return [];
      const points = selection.flatMap((seg) => [seg.start, seg.end]);
      const avgY = points.reduce((sum, point) => sum + point[1], 0) / points.length;
      return tracks.map((track) => {
        const owned = segments.filter((seg) => track.segmentIds.includes(seg.id));
        if (!owned.length) return null;
        const ownedPoints = owned.flatMap((seg) => [seg.start, seg.end]);
        const trackY = ownedPoints.reduce((sum, point) => sum + point[1], 0) / ownedPoints.length;
        const nearest = Math.min(
          ...ownedPoints.flatMap((op) => points.map((sp) => dist(op, sp)))
        );
        const alignment = Math.max(0, 100 - Math.abs(avgY - trackY) * 1.6);
        const proximity = Math.max(0, 100 - nearest / 3);
        const connectivity = nearest <= JOIN_TOLERANCE ? 100 : Math.max(0, 100 - nearest);
        const direction = track.trafficDirection === "Not Applicable" ? 60 : 82;
        const label = selection.some((seg) => seg.sourceLayer === "0-UNCLASSIFIED") ? 70 : 40;
        const score = Math.round(
          proximity * 0.34 + alignment * 0.26 + connectivity * 0.22 + direction * 0.1 + label * 0.08
        );
        const reasons = [];
        if (nearest <= JOIN_TOLERANCE) reasons.push("connected to the selected elements");
        else reasons.push(`${nearest.toFixed(1)} m from the nearest end node`);
        if (Math.abs(avgY - trackY) < 12) reasons.push("aligned on the same centre line");
        if (track.endNodeId === null) reasons.push("has an open end node");
        return {
          track,
          score,
          nearest,
          level: score >= 78 ? "High" : score >= 55 ? "Medium" : "Low",
          reason: reasons.join(" \xB7 ")
        };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
    };
    const MANDATORY_FIELDS = [
      ["name", "Track name"],
      ["roadNumber", "Road number"],
      ["trackType", "Track type"],
      ["operationalStatus", "Operational status"],
      ["trafficDirection", "Traffic direction"]
    ];
    const buildValidations = ({ tracks, segments, groups, retiredSeeds }) => {
      const messages = [];
      const push = (msg) => messages.push(msg);
      const nameCounts = /* @__PURE__ */ new Map();
      tracks.forEach((track) => {
        const key = (track.name || "").trim().toLowerCase();
        if (key) nameCounts.set(key, (nameCounts.get(key) || 0) + 1);
      });
      tracks.forEach((track) => {
        const missing = MANDATORY_FIELDS.filter(([field]) => !String(track[field] || "").trim());
        if (missing.length) {
          push({
            id: `V-MAND-${track.id}`,
            severity: "error",
            category: "Mandatory Attributes",
            trackId: track.id,
            message: `${missing.map(([, label]) => label).join(", ")} ${missing.length > 1 ? "are" : "is"} missing for ${track.id}.`,
            detail: "Mandatory attributes must be filled in before the track can be validated.",
            resolveHint: "Open Edit Attributes on this track."
          });
        }
        const key = (track.name || "").trim().toLowerCase();
        if (key && nameCounts.get(key) > 1) {
          push({
            id: `V-NAME-${track.id}`,
            severity: "error",
            category: "Track Naming",
            trackId: track.id,
            message: `Track name "${track.name}" is already in use.`,
            detail: "Track names must be unique within a station yard.",
            resolveHint: "Rename one of the duplicate tracks."
          });
        }
      });
      const ownerOf = /* @__PURE__ */ new Map();
      tracks.forEach((track) => {
        track.segmentIds.forEach((segId) => {
          if (ownerOf.has(segId)) {
            const first = ownerOf.get(segId);
            push({
              id: `V-DUP-${segId}`,
              severity: "error",
              category: "Duplicate Mapping",
              trackId: track.id,
              message: `${segId} is already mapped to ${first.name || first.id}.`,
              detail: "A source element can belong to exactly one track asset.",
              resolveHint: "Remove the element from one of the two tracks."
            });
          } else {
            ownerOf.set(segId, track);
          }
        });
      });
      tracks.forEach((track) => {
        const owned = segments.filter((seg) => track.segmentIds.includes(seg.id));
        const { gaps } = analyseChain(owned);
        gaps.forEach((gap, index) => {
          push({
            id: `V-GAP-${track.id}-${index}`,
            severity: "warning",
            category: "Geometry",
            trackId: track.id,
            message: `The segments of ${track.name || track.id} contain a gap of ${gap.distance.toFixed(1)} m.`,
            detail: `${gap.from} does not meet ${gap.to}.`,
            resolveHint: "Map the missing element or correct the geometry."
          });
        });
        if (!track.endNodeId && !track.deadEnd) {
          push({
            id: `V-OPEN-${track.id}`,
            severity: "warning",
            category: "Connectivity",
            trackId: track.id,
            message: `${track.name || track.id} ends without connecting to a turnout, dead end or another track.`,
            detail: `The extracted geometry stops at chainage ${track.endChainage} km.`,
            resolveHint: "Extend the track or mark a dead end in the attributes."
          });
        }
      });
      groups.forEach((group) => {
        if (group.status !== "Unidentified") return;
        const elements = segments.filter((seg) => group.elementIds.includes(seg.id));
        const { gaps } = analyseChain(elements);
        gaps.forEach((gap, index) => {
          push({
            id: `V-GGAP-${group.id}-${index}`,
            severity: "warning",
            category: "Geometry",
            groupId: group.id,
            message: `The selected segments contain a gap of ${gap.distance.toFixed(1)} m.`,
            detail: `${group.id}: ${gap.from} does not meet ${gap.to}.`,
            resolveHint: "Acknowledge the gap or correct the geometry before mapping."
          });
        });
        if (group.suggestedAction === "reject") {
          push({
            id: `V-HEUR-${group.id}`,
            severity: "information",
            category: "Geometry",
            groupId: group.id,
            message: `${group.label} appears to be a ${String(group.suggestedReason).toLowerCase()}.`,
            detail: group.suggestionReason,
            resolveHint: "Review the elements and mark them as Not a Track."
          });
        }
      });
      const openGroups = groups.filter((group) => group.status === "Unidentified").length;
      if (openGroups) {
        push({
          id: "V-OPENGROUPS",
          severity: "warning",
          category: "Duplicate Mapping",
          message: `${openGroups} unidentified element ${openGroups === 1 ? "group is" : "groups are"} still unresolved.`,
          detail: "Every unidentified group must be mapped, converted to a track or marked as Not a Track.",
          resolveHint: "Work through the Unidentified tab."
        });
      }
      D.SEED_VALIDATIONS.forEach((seed) => {
        if (retiredSeeds.includes(seed.id)) return;
        if (seed.trackId && !tracks.some((track) => track.id === seed.trackId)) return;
        if (seed.groupId) {
          const group = groups.find((item) => item.id === seed.groupId);
          if (!group || group.status !== "Unidentified") return;
        }
        if (["V-E2", "V-W1", "V-W2", "V-I1"].includes(seed.id)) return;
        push(seed);
      });
      const order = { error: 0, warning: 1, information: 2 };
      return messages.sort((a, b) => order[a.severity] - order[b.severity]);
    };
    const IconBtn = ({ icon, label, active, disabled, onClick, wide, children }) => /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "pt-tool" + (wide ? " pt-tool-text" : ""),
        "data-active": active ? "true" : "false",
        disabled,
        onClick,
        title: label,
        "aria-label": label,
        "aria-pressed": active === void 0 ? void 0 : !!active
      },
      /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 15 }),
      children
    );
    const TrackReviewHeader = ({
      station,
      document: doc,
      progress,
      dirty,
      lastSavedAt,
      canComplete,
      blockingCount,
      onBack,
      onSaveDraft,
      onComplete,
      onTogglePanel
    }) => /* @__PURE__ */ React.createElement("header", { className: "pt-head" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "pt-head-back", onClick: onBack, "aria-label": "Back to extraction review" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 17 })), /* @__PURE__ */ React.createElement("div", { className: "pt-head-copy" }, /* @__PURE__ */ React.createElement("div", { className: "pt-head-title" }, /* @__PURE__ */ React.createElement(Icon, { name: "track", size: 18 }), "Track Extraction Review"), /* @__PURE__ */ React.createElement("div", { className: "pt-head-sub" }, /* @__PURE__ */ React.createElement("strong", null, station.name, " Station"), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "/"), /* @__PURE__ */ React.createElement("span", null, doc.label), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "/"), /* @__PURE__ */ React.createElement("span", null, "PIM Review"), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "/"), /* @__PURE__ */ React.createElement("strong", null, "Tracks"), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", { className: "mono" }, doc.fileName))), /* @__PURE__ */ React.createElement("div", { className: "pt-head-spacer" }), /* @__PURE__ */ React.createElement("div", { className: "pt-head-actions" }, /* @__PURE__ */ React.createElement("span", { className: "pt-head-saved" }, dirty ? `${dirty} unsaved change${dirty === 1 ? "" : "s"}` : lastSavedAt ? `Draft saved ${lastSavedAt}` : "No changes yet"), /* @__PURE__ */ React.createElement("span", { className: "pt-panel-toggle" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "panel_left_open", onClick: onTogglePanel }, "Review Panel")), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "save", onClick: onSaveDraft, disabled: !dirty }, "Save Draft"), /* @__PURE__ */ React.createElement(
      Btn,
      {
        variant: "accent",
        size: "sm",
        leadingIcon: "check_circle",
        onClick: onComplete,
        disabled: !canComplete,
        title: canComplete ? "Complete track review" : `${blockingCount} blocking item${blockingCount === 1 ? "" : "s"} must be resolved first`
      },
      "Complete Track Review"
    )));
    const ReviewProgressSummary = ({ stats }) => {
      const pct = stats.total ? Math.round(stats.validated / stats.total * 100) : 0;
      return /* @__PURE__ */ React.createElement("div", { className: "pt-progress" }, /* @__PURE__ */ React.createElement("div", { className: "pt-progress-bar-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "pt-progress-text" }, stats.validated, " of ", stats.total, " tracks validated"), /* @__PURE__ */ React.createElement("div", { className: "pt-progress-bar", role: "progressbar", "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": "Track validation progress" }, /* @__PURE__ */ React.createElement("div", { className: "pt-progress-fill", style: { width: `${pct}%` } }))), /* @__PURE__ */ React.createElement("div", { className: "pt-stat-row" }, /* @__PURE__ */ React.createElement("span", { className: "pt-stat", "data-tone": "info" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, stats.identified), " Identified"), /* @__PURE__ */ React.createElement("span", { className: "pt-stat", "data-tone": "warning" }, /* @__PURE__ */ React.createElement(Icon, { name: "alert_tri", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, stats.needsReview), " Needs Review"), /* @__PURE__ */ React.createElement("span", { className: "pt-stat", "data-tone": "warning" }, /* @__PURE__ */ React.createElement(Icon, { name: "alert", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, stats.unidentified), " Unidentified"), /* @__PURE__ */ React.createElement("span", { className: "pt-stat", "data-tone": "success" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, stats.validated), " Validated"), stats.notATrack > 0 && /* @__PURE__ */ React.createElement("span", { className: "pt-stat" }, /* @__PURE__ */ React.createElement(Icon, { name: "eye_off", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, stats.notATrack), " Not a Track"), stats.errors > 0 && /* @__PURE__ */ React.createElement("span", { className: "pt-stat", "data-tone": "danger" }, /* @__PURE__ */ React.createElement(Icon, { name: "alert", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, stats.errors), " Errors")));
    };
    const LayerControl = ({ layers, onToggle, onAll, open, onOpenChange }) => {
      const ref = useRef(null);
      useEffect(() => {
        if (!open) return void 0;
        const onDocDown = (event) => {
          if (ref.current && !ref.current.contains(event.target)) onOpenChange(false);
        };
        const onKey = (event) => {
          if (event.key === "Escape") onOpenChange(false);
        };
        window.document.addEventListener("mousedown", onDocDown);
        window.document.addEventListener("keydown", onKey);
        return () => {
          window.document.removeEventListener("mousedown", onDocDown);
          window.document.removeEventListener("keydown", onKey);
        };
      }, [open, onOpenChange]);
      const hidden = layers.filter((layer) => !layer.visible).length;
      return /* @__PURE__ */ React.createElement("div", { className: "pt-layer-anchor", ref }, /* @__PURE__ */ React.createElement(
        IconBtn,
        {
          icon: "layers",
          label: "Layer visibility",
          wide: true,
          active: open,
          onClick: () => onOpenChange(!open)
        },
        "Layers",
        hidden ? ` (${layers.length - hidden}/${layers.length})` : ""
      ), open && /* @__PURE__ */ React.createElement("div", { className: "pt-layer-pop", role: "group", "aria-label": "Layer visibility" }, /* @__PURE__ */ React.createElement("div", { className: "pt-layer-pop-head" }, /* @__PURE__ */ React.createElement("span", null, "Drawing layers"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "pt-layer-row", style: { width: "auto", padding: "2px 6px" }, onClick: () => onAll(hidden > 0) }, hidden > 0 ? "Show all" : "Hide all")), layers.map((layer) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: layer.id,
          type: "button",
          className: "pt-layer-row",
          "data-off": layer.visible ? "false" : "true",
          role: "switch",
          "aria-checked": layer.visible,
          onClick: () => onToggle(layer.id)
        },
        /* @__PURE__ */ React.createElement(Icon, { name: layer.visible ? "eye" : "eye_off", size: 14 }),
        /* @__PURE__ */ React.createElement(Icon, { name: layer.icon, size: 14 }),
        /* @__PURE__ */ React.createElement("span", { className: "pt-layer-name" }, layer.label),
        /* @__PURE__ */ React.createElement("span", { className: "pt-layer-src" }, layer.source)
      ))));
    };
    const CanvasToolbar = ({
      mode,
      onMode,
      zoom,
      onZoomIn,
      onZoomOut,
      onFit,
      onReset,
      layers,
      onToggleLayer,
      onAllLayers,
      layerOpen,
      onLayerOpen,
      modeNote
    }) => /* @__PURE__ */ React.createElement("div", { className: "pt-toolbar", role: "toolbar", "aria-label": "Canvas tools" }, /* @__PURE__ */ React.createElement("div", { className: "pt-tool-group" }, /* @__PURE__ */ React.createElement(IconBtn, { icon: "cursor", label: "Select (V)", active: mode === "select", onClick: () => onMode("select") }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "hand", label: "Pan (H)", active: mode === "pan", onClick: () => onMode("pan") }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "select_rect", label: "Rectangle selection (R)", active: mode === "rect", onClick: () => onMode("rect") }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "lasso", label: "Lasso selection (L)", active: mode === "lasso", onClick: () => onMode("lasso") })), /* @__PURE__ */ React.createElement("div", { className: "pt-tool-group" }, /* @__PURE__ */ React.createElement(IconBtn, { icon: "zoom_out", label: "Zoom out (\u2212)", onClick: onZoomOut }), /* @__PURE__ */ React.createElement("span", { className: "pt-zoom-value" }, Math.round(zoom * 100), "%"), /* @__PURE__ */ React.createElement(IconBtn, { icon: "zoom_in", label: "Zoom in (+)", onClick: onZoomIn }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "fit_screen", label: "Fit to screen (F)", onClick: onFit }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "undo", label: "Reset view", onClick: onReset })), modeNote && /* @__PURE__ */ React.createElement("span", { className: "pt-mode-note" }, /* @__PURE__ */ React.createElement(Icon, { name: "spark", size: 12 }), modeNote), /* @__PURE__ */ React.createElement("div", { className: "pt-toolbar-spacer" }), /* @__PURE__ */ React.createElement(
      LayerControl,
      {
        layers,
        onToggle: onToggleLayer,
        onAll: onAllLayers,
        open: layerOpen,
        onOpenChange: onLayerOpen
      }
    ));
    const SelectionActionBar = ({
      count,
      totalLength,
      allUnidentified,
      selectedTrack,
      mode,
      onMapExisting,
      onCreateTrack,
      onAddToTrack,
      onNotATrack,
      onClear,
      onSelectConnected,
      onSelectPath,
      canSelectPath
    }) => /* @__PURE__ */ React.createElement("div", { className: "pt-selbar", role: "region", "aria-label": "Selection actions" }, /* @__PURE__ */ React.createElement("div", { className: "pt-selbar-count" }, /* @__PURE__ */ React.createElement(Icon, { name: "target", size: 15 }), count, " element", count === 1 ? "" : "s", " selected", /* @__PURE__ */ React.createElement("span", null, "\xB7 ", fmtLength(totalLength))), /* @__PURE__ */ React.createElement("div", { className: "pt-selbar-divider" }), /* @__PURE__ */ React.createElement("div", { className: "pt-selbar-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "link", onClick: onSelectConnected }, "Select Connected"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "git", onClick: onSelectPath, disabled: !canSelectPath }, "Select Path"), /* @__PURE__ */ React.createElement("div", { className: "pt-selbar-divider" }), mode === "extend" && selectedTrack ? /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", leadingIcon: "plus", onClick: onAddToTrack }, "Adding ", count, " segment", count === 1 ? "" : "s", " to ", selectedTrack.id, selectedTrack.name ? ` \u2014 ${selectedTrack.name}` : "") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", leadingIcon: "link", onClick: onMapExisting, disabled: !allUnidentified }, "Map to Existing Track"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "plus", onClick: onCreateTrack, disabled: !allUnidentified }, "Create New Track"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "eye_off", danger: true, onClick: onNotATrack, disabled: !allUnidentified }, "Not a Track")), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "x", onClick: onClear }, "Clear")));
    const ESPTrackCanvas = ({
      segments,
      tracks,
      layerVisibility,
      view,
      onView,
      mode,
      selectedIds,
      focusTrackId,
      splitAssignment,
      onSegmentClick,
      onMarquee,
      onBackgroundClick
    }) => {
      const svgRef = useRef(null);
      const [drag, setDrag] = useState(null);
      const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
      const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
      const toSvg = useCallback((event) => {
        const svg = svgRef.current;
        if (!svg) return [0, 0];
        const rect = svg.getBoundingClientRect();
        const scale = Math.min(rect.width / view.w, rect.height / view.h);
        const offsetX = (rect.width - view.w * scale) / 2;
        const offsetY = (rect.height - view.h * scale) / 2;
        return [
          (event.clientX - rect.left - offsetX) / scale + view.x,
          (event.clientY - rect.top - offsetY) / scale + view.y
        ];
      }, [view]);
      const handleDown = (event) => {
        if (event.button !== 0) return;
        const point = toSvg(event);
        if (mode === "pan") {
          setDrag({ kind: "pan", origin: point, startView: view });
        } else if (mode === "rect") {
          setDrag({ kind: "rect", origin: point, current: point });
        } else if (mode === "lasso") {
          setDrag({ kind: "lasso", points: [point] });
        }
      };
      const handleMove = (event) => {
        if (!drag) return;
        const point = toSvg(event);
        if (drag.kind === "pan") {
          const rect = svgRef.current.getBoundingClientRect();
          const scale = Math.min(rect.width / drag.startView.w, rect.height / drag.startView.h);
          const offsetX = (rect.width - drag.startView.w * scale) / 2;
          const offsetY = (rect.height - drag.startView.h * scale) / 2;
          const raw = [
            (event.clientX - rect.left - offsetX) / scale + drag.startView.x,
            (event.clientY - rect.top - offsetY) / scale + drag.startView.y
          ];
          onView({
            ...view,
            x: drag.startView.x + (drag.origin[0] - raw[0]),
            y: drag.startView.y + (drag.origin[1] - raw[1])
          });
        } else if (drag.kind === "rect") {
          setDrag({ ...drag, current: point });
        } else if (drag.kind === "lasso") {
          setDrag({ ...drag, points: [...drag.points, point] });
        }
      };
      const handleUp = (event) => {
        if (!drag) return;
        if (drag.kind === "rect") {
          const rect = {
            x1: Math.min(drag.origin[0], drag.current[0]),
            y1: Math.min(drag.origin[1], drag.current[1]),
            x2: Math.max(drag.origin[0], drag.current[0]),
            y2: Math.max(drag.origin[1], drag.current[1])
          };
          if (rect.x2 - rect.x1 > 4 || rect.y2 - rect.y1 > 4) {
            onMarquee(segments.filter((seg) => rectHits(rect, seg)).map((seg) => seg.id), event.shiftKey);
          }
        } else if (drag.kind === "lasso" && drag.points.length > 3) {
          onMarquee(segments.filter((seg) => lassoHits(drag.points, seg)).map((seg) => seg.id), event.shiftKey);
        }
        setDrag(null);
      };
      const handleWheel = (event) => {
        event.preventDefault();
        const factor = event.deltaY > 0 ? 1.12 : 1 / 1.12;
        const [px, py] = toSvg(event);
        const w = Math.min(3200, Math.max(240, view.w * factor));
        const h = w * (view.h / view.w);
        onView({ x: px - (px - view.x) * (w / view.w), y: py - (py - view.y) * (h / view.h), w, h });
      };
      const visible = (layerId) => layerVisibility[layerId] !== false;
      const renderSegment = (seg) => {
        const track = seg.trackId ? trackById.get(seg.trackId) : null;
        const state = segmentVisualState(seg, track);
        if (state === "unidentified" && !visible("UNIDENTIFIED")) return null;
        if (state !== "unidentified" && !visible("TRACK")) return null;
        const isSelected = selected.has(seg.id);
        const dimmed = focusTrackId && seg.trackId !== focusTrackId && !isSelected;
        const splitSide = splitAssignment ? splitAssignment[seg.id] : null;
        const [mx, my] = midpoint(seg);
        const badge = state === "validated" ? { icon: "check", fill: "oklch(0.55 0.13 155)" } : state === "failed" ? { icon: "x", fill: "oklch(0.58 0.19 25)" } : state === "review" ? { icon: "alert", fill: "oklch(0.68 0.15 62)" } : state === "mapped" ? { icon: "link", fill: "#6d5cd6" } : state === "rejected" ? { icon: "eye_off", fill: "var(--ink-400)" } : null;
        return /* @__PURE__ */ React.createElement("g", { key: seg.id, className: splitSide ? `pt-split-${splitSide.toLowerCase()}` : void 0 }, isSelected && /* @__PURE__ */ React.createElement("path", { className: "pt-seg-outline", d: seg.d }), /* @__PURE__ */ React.createElement(
          "path",
          {
            className: "pt-seg",
            d: seg.d,
            "data-state": state,
            "data-selected": isSelected ? "true" : "false",
            "data-dim": dimmed ? "true" : "false",
            "data-focus-track": focusTrackId && seg.trackId === focusTrackId ? "true" : "false"
          }
        ), /* @__PURE__ */ React.createElement(
          "path",
          {
            className: "pt-hit",
            d: seg.d,
            tabIndex: 0,
            role: "button",
            "aria-pressed": isSelected,
            "aria-label": `${seg.id}, ${seg.geometryType}, ${fmtLength(seg.length)}, ${track ? track.name || track.id : "unidentified"}`,
            onClick: (event) => onSegmentClick(seg, event),
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSegmentClick(seg, { shiftKey: event.shiftKey, altKey: event.altKey });
              }
            }
          }
        ), badge && !dimmed && /* @__PURE__ */ React.createElement("g", { pointerEvents: "none" }, /* @__PURE__ */ React.createElement("circle", { className: "pt-badge-bg", cx: mx, cy: my, r: "8.5", fill: badge.fill }), /* @__PURE__ */ React.createElement("g", { transform: `translate(${mx - 5} ${my - 5})`, style: { color: "#fff" } }, /* @__PURE__ */ React.createElement(Icon, { name: badge.icon, size: 10 }))));
      };
      return /* @__PURE__ */ React.createElement(
        "svg",
        {
          ref: svgRef,
          className: "pt-svg",
          viewBox: `${view.x} ${view.y} ${view.w} ${view.h}`,
          preserveAspectRatio: "xMidYMid meet",
          "data-mode": mode,
          "data-dragging": drag ? "true" : "false",
          role: "application",
          "aria-label": "Source ESP drawing canvas",
          onMouseDown: handleDown,
          onMouseMove: handleMove,
          onMouseUp: handleUp,
          onMouseLeave: () => setDrag(null),
          onWheel: handleWheel,
          onClick: (event) => {
            if (event.target === svgRef.current && mode === "select") onBackgroundClick(event);
          }
        },
        /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("filter", { id: "pt-glow", x: "-40%", y: "-40%", width: "180%", height: "180%" }, /* @__PURE__ */ React.createElement("feDropShadow", { dx: "0", dy: "0", stdDeviation: "5", floodColor: "#3737c8", floodOpacity: "0.55" })), /* @__PURE__ */ React.createElement("pattern", { id: "pt-hatch", width: "8", height: "8", patternTransform: "rotate(45)", patternUnits: "userSpaceOnUse" }, /* @__PURE__ */ React.createElement("line", { x1: "0", y1: "0", x2: "0", y2: "8", stroke: "var(--ink-300)", strokeWidth: "2" }))),
        visible("STRUCTURE") && D.STRUCTURES.map((item) => /* @__PURE__ */ React.createElement("g", { key: item.id }, /* @__PURE__ */ React.createElement("rect", { className: "pt-structure", x: item.x, y: item.y, width: item.w, height: item.h, rx: "3" }), item.w > 60 && /* @__PURE__ */ React.createElement("text", { className: "pt-text", x: item.x + item.w / 2, y: item.y + item.h / 2 + 4, textAnchor: "middle" }, item.label))),
        visible("PLATFORM") && D.PLATFORMS.map((item) => /* @__PURE__ */ React.createElement("g", { key: item.id }, /* @__PURE__ */ React.createElement("rect", { className: "pt-platform", x: item.x, y: item.y, width: item.w, height: item.h, fill: "url(#pt-hatch)" }), /* @__PURE__ */ React.createElement("rect", { className: "pt-platform", x: item.x, y: item.y, width: item.w, height: item.h, fillOpacity: "0" }), /* @__PURE__ */ React.createElement("text", { className: "pt-platform-label", x: item.x + 10, y: item.y + item.h / 2 + 4 }, item.label))),
        visible("DIMENSION") && D.DIMENSIONS.map((item) => /* @__PURE__ */ React.createElement("g", { key: item.id, pointerEvents: "none" }, /* @__PURE__ */ React.createElement("line", { className: "pt-dim", x1: item.x1, y1: item.y, x2: item.x2, y2: item.y }), /* @__PURE__ */ React.createElement("line", { className: "pt-dim", x1: item.x1, y1: item.y - 6, x2: item.x1, y2: item.y + 6 }), /* @__PURE__ */ React.createElement("line", { className: "pt-dim", x1: item.x2, y1: item.y - 6, x2: item.x2, y2: item.y + 6 }), /* @__PURE__ */ React.createElement("text", { className: "pt-dim-text", x: (item.x1 + item.x2) / 2, y: item.y - 6, textAnchor: "middle" }, item.label))),
        segments.map(renderSegment),
        visible("TRACK") && /* @__PURE__ */ React.createElement("g", { pointerEvents: "none" }, D.TURNOUTS.map((item) => /* @__PURE__ */ React.createElement("g", { key: item.id }, /* @__PURE__ */ React.createElement("rect", { className: "pt-turnout", x: item.x - 5, y: item.y - 5, width: "10", height: "10", transform: `rotate(45 ${item.x} ${item.y})` }), /* @__PURE__ */ React.createElement("text", { className: "pt-text", x: item.x, y: item.y - 12, textAnchor: "middle", fontSize: "10" }, item.id))), D.BUFFER_STOPS.map((item) => /* @__PURE__ */ React.createElement("path", { key: item.id, className: "pt-buffer", d: `M${item.x} ${item.y - 10} V${item.y + 10} M${item.x - 8} ${item.y} H${item.x}` }))),
        visible("TEXT") && /* @__PURE__ */ React.createElement("g", { pointerEvents: "none" }, D.TEXT_LABELS.filter((label) => label.text).map((label) => /* @__PURE__ */ React.createElement("text", { key: label.id, className: "pt-text", x: label.x, y: label.y, textAnchor: label.anchor }, label.text))),
        drag && drag.kind === "rect" && /* @__PURE__ */ React.createElement(
          "rect",
          {
            className: "pt-marquee",
            x: Math.min(drag.origin[0], drag.current[0]),
            y: Math.min(drag.origin[1], drag.current[1]),
            width: Math.abs(drag.current[0] - drag.origin[0]),
            height: Math.abs(drag.current[1] - drag.origin[1])
          }
        ),
        drag && drag.kind === "lasso" && drag.points.length > 1 && /* @__PURE__ */ React.createElement("polygon", { className: "pt-lasso", points: drag.points.map((point) => point.join(",")).join(" ") })
      );
    };
    const SelectionPreview = ({ segments, contextSegments = [], assignment }) => {
      if (!segments.length) return null;
      const points = segments.flatMap((seg) => [seg.start, seg.end]);
      const pad = 60;
      const x1 = Math.min(...points.map((p) => p[0])) - pad;
      const x2 = Math.max(...points.map((p) => p[0])) + pad;
      const y1 = Math.min(...points.map((p) => p[1])) - pad;
      const y2 = Math.max(...points.map((p) => p[1])) + pad;
      return /* @__PURE__ */ React.createElement("svg", { className: "pt-preview-svg", viewBox: `${x1} ${y1} ${x2 - x1} ${y2 - y1}`, preserveAspectRatio: "xMidYMid meet", "aria-label": "Selection preview" }, contextSegments.map((seg) => /* @__PURE__ */ React.createElement("path", { key: seg.id, d: seg.d, fill: "none", stroke: "var(--ink-300)", strokeWidth: "5", strokeLinecap: "round" })), segments.map((seg) => /* @__PURE__ */ React.createElement(
        "path",
        {
          key: seg.id,
          d: seg.d,
          fill: "none",
          strokeWidth: "6",
          strokeLinecap: "round",
          stroke: assignment && assignment[seg.id] === "B" ? "oklch(0.62 0.13 240)" : assignment ? "#6d5cd6" : "var(--accent)"
        }
      )));
    };
    const TrackTabs = ({ active, onChange, counts }) => {
      const items = [
        { id: "identified", label: "Identified", count: counts.identified },
        { id: "review", label: "Needs Review", count: counts.review },
        { id: "unidentified", label: "Unidentified", count: counts.unidentified }
      ];
      return /* @__PURE__ */ React.createElement("div", { className: "pt-tabs", role: "tablist", "aria-label": "Track review categories" }, items.map((item) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: item.id,
          type: "button",
          role: "tab",
          className: "pt-tab",
          "data-active": active === item.id ? "true" : "false",
          "aria-selected": active === item.id,
          onClick: () => onChange(item.id)
        },
        item.label,
        /* @__PURE__ */ React.createElement("span", { className: "pt-tab-count" }, item.count)
      )));
    };
    const ConfidenceMeter = ({ score }) => /* @__PURE__ */ React.createElement("span", { className: "pt-card-conf", title: `AI confidence ${score}%` }, /* @__PURE__ */ React.createElement("span", { className: "pt-conf-bar" }, /* @__PURE__ */ React.createElement("span", { className: "pt-conf-fill", style: { width: `${score}%`, background: CONFIDENCE_COLOR(score) } })), score, "%");
    const TRACK_STATUS_TONE = {
      Validated: "success",
      "Ready for Confirmation": "info",
      "Needs Review": "warning",
      "Validation Failed": "danger",
      "Mapped \u2014 Draft": "info"
    };
    const TrackListItem = ({ track, active, segmentCount, onSelect, onConfirm, onEdit, onExtend, onSplit, onViewSource, blocked }) => {
      const tone = TRACK_STATUS_TONE[track.validationStatus] || "neutral";
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "pt-card",
          "data-active": active ? "true" : "false",
          "data-tone": track.validationStatus === "Validated" ? "success" : tone === "danger" ? "danger" : track.sourceType === "User Created" ? "accent" : void 0,
          role: "button",
          tabIndex: 0,
          onClick: () => onSelect(track.id),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(track.id);
            }
          }
        },
        /* @__PURE__ */ React.createElement("div", { className: "pt-card-top" }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-heading" }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-id" }, track.id), /* @__PURE__ */ React.createElement("div", { className: "pt-card-name" }, track.name || /* @__PURE__ */ React.createElement("em", null, "Unnamed track"))), /* @__PURE__ */ React.createElement(Chip, { tone, size: "sm", leadingIcon: track.validationStatus === "Validated" ? "check" : void 0 }, track.validationStatus)),
        /* @__PURE__ */ React.createElement("div", { className: "pt-card-meta" }, /* @__PURE__ */ React.createElement("b", null, track.trackType), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", null, track.trafficDirection), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", null, segmentCount, " segment", segmentCount === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", { className: "mono" }, fmtLength(track.length)), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement(ConfidenceMeter, { score: track.confidenceScore })),
        /* @__PURE__ */ React.createElement("div", { className: "pt-card-actions", onClick: (event) => event.stopPropagation() }, /* @__PURE__ */ React.createElement(
          Btn,
          {
            variant: "primary",
            size: "xs",
            leadingIcon: "check",
            disabled: track.validationStatus === "Validated" || blocked,
            title: blocked ? "Resolve the blocking validation errors on this track first" : "Confirm this track",
            onClick: () => onConfirm(track.id)
          },
          track.validationStatus === "Validated" ? "Confirmed" : "Confirm"
        ), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "edit", onClick: () => onEdit(track.id) }, "Edit Attributes"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "plus", onClick: () => onExtend(track.id) }, "Extend"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "scissors", onClick: () => onSplit(track.id), disabled: segmentCount < 2 }, "Split"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "eye", onClick: () => onViewSource(track.id) }, "Source Elements"))
      );
    };
    const NeedsReviewItem = ({ track, active, segmentCount, onSelect, onReview, onEdit, onSplit }) => /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "pt-card",
        "data-active": active ? "true" : "false",
        "data-tone": track.validationStatus === "Validation Failed" ? "danger" : "warning",
        role: "button",
        tabIndex: 0,
        onClick: () => onSelect(track.id),
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(track.id);
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "pt-card-top" }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-heading" }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-id" }, track.id), /* @__PURE__ */ React.createElement("div", { className: "pt-card-name" }, track.name || /* @__PURE__ */ React.createElement("em", null, "Track name missing"))), /* @__PURE__ */ React.createElement(ConfidenceMeter, { score: track.confidenceScore })),
      /* @__PURE__ */ React.createElement("div", { className: "pt-card-issues" }, (track.review ? track.review.issues : []).map((issue) => /* @__PURE__ */ React.createElement("span", { className: "pt-issue", key: issue }, /* @__PURE__ */ React.createElement(Icon, { name: "alert_tri", size: 10 }), issue))),
      track.review && /* @__PURE__ */ React.createElement("div", { className: "pt-card-note" }, /* @__PURE__ */ React.createElement("strong", null, "AI suggestion \xB7 "), track.review.suggestion),
      /* @__PURE__ */ React.createElement("div", { className: "pt-card-meta" }, /* @__PURE__ */ React.createElement("b", null, track.trackType), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", null, segmentCount, " segment", segmentCount === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("span", { className: "pt-head-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", { className: "mono" }, track.startChainage, " \u2192 ", track.endChainage, " km")),
      /* @__PURE__ */ React.createElement("div", { className: "pt-card-actions", onClick: (event) => event.stopPropagation() }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "xs", leadingIcon: "target", onClick: () => onReview(track.id) }, "Review"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "edit", onClick: () => onEdit(track.id) }, "Edit Attributes"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "scissors", onClick: () => onSplit(track.id), disabled: segmentCount < 2 }, "Split Track"))
    );
    const UnidentifiedElementItem = ({
      group,
      elements,
      nearestTrack,
      suggestedTrack,
      active,
      onLocate,
      onSelectOnDrawing,
      onMap,
      onCreate,
      onReject,
      onReviewLater
    }) => {
      const totalLength = elements.reduce((sum, seg) => sum + (seg.length || 0), 0);
      const geometryTypes = uniq(elements.map((seg) => seg.geometryType)).join(" + ");
      const suggestionLabel = group.suggestedAction === "map" ? `Map to ${suggestedTrack ? suggestedTrack.name : "existing track"}` : group.suggestedAction === "create" ? `Create new ${group.suggestedTrackType}` : `Not a track \u2014 ${group.suggestedReason}`;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "pt-card",
          "data-active": active ? "true" : "false",
          "data-tone": group.status === "Not a Track" ? void 0 : group.status === "Mapped \u2014 Draft" ? "accent" : "warning",
          role: "button",
          tabIndex: 0,
          onClick: () => onSelectOnDrawing(group.id),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectOnDrawing(group.id);
            }
          }
        },
        /* @__PURE__ */ React.createElement("div", { className: "pt-card-top" }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-heading" }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-id" }, group.id, " \xB7 ", elements.length, " element", elements.length === 1 ? "" : "s"), /* @__PURE__ */ React.createElement("div", { className: "pt-card-name" }, group.label)), /* @__PURE__ */ React.createElement(Chip, { tone: group.status === "Unidentified" ? "warning" : group.status === "Review Later" ? "neutral" : "info", size: "sm" }, group.status)),
        /* @__PURE__ */ React.createElement("div", { className: "pt-kv" }, /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Source layer"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, elements[0] ? elements[0].sourceLayer : "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Geometry"), /* @__PURE__ */ React.createElement("strong", null, geometryTypes)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Approx. length"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, fmtLength(totalLength))), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Nearest track"), /* @__PURE__ */ React.createElement("strong", null, nearestTrack ? nearestTrack.name || nearestTrack.id : "\u2014", " \xB7 ", group.nearestDistance))),
        /* @__PURE__ */ React.createElement("div", { className: "pt-card-note" }, /* @__PURE__ */ React.createElement("strong", null, "Suggested \xB7 "), suggestionLabel, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 3, color: "var(--ink-500)" } }, group.suggestionReason)),
        /* @__PURE__ */ React.createElement("div", { className: "pt-card-actions", onClick: (event) => event.stopPropagation() }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "target", onClick: () => onLocate(group.id) }, "Locate"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "select_rect", onClick: () => onSelectOnDrawing(group.id) }, "Select on Drawing"), group.status === "Unidentified" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "xs", leadingIcon: "link", onClick: () => onMap(group.id) }, "Map"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "xs", leadingIcon: "plus", onClick: () => onCreate(group.id) }, "Create Track"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "eye_off", danger: true, onClick: () => onReject(group.id) }, "Not a Track"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "clock", onClick: () => onReviewLater(group.id) }, "Review Later")))
      );
    };
    const TrackDetailPanel = ({
      track,
      segments,
      validations,
      onBack,
      onConfirm,
      onEdit,
      onExtend,
      onSplit,
      onReplaceGeometry,
      onMarkIncorrect,
      onLocateSegment
    }) => {
      const owned = segments.filter((seg) => track.segmentIds.includes(seg.id));
      const chain = analyseChain(owned);
      const blocking = validations.filter((item) => item.severity === "error" && item.trackId === track.id);
      const first = chain.ordered[0];
      const last = chain.ordered[chain.ordered.length - 1];
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "pt-detail-head" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "pt-detail-back", onClick: onBack, "aria-label": "Back to track list" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 15 })), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "pt-card-id" }, track.id, " \xB7 ", track.sourceType), /* @__PURE__ */ React.createElement("div", { className: "pt-card-name" }, track.name || /* @__PURE__ */ React.createElement("em", null, "Unnamed track"))), /* @__PURE__ */ React.createElement(Chip, { tone: TRACK_STATUS_TONE[track.validationStatus] || "neutral", size: "sm" }, track.validationStatus)), /* @__PURE__ */ React.createElement("div", { className: "pt-panel-scroll" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "file_check", size: 12 }), "Identification"), /* @__PURE__ */ React.createElement("div", { className: "pt-kv" }, /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Track ID"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, track.id)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Road number"), /* @__PURE__ */ React.createElement("strong", null, track.roadNumber || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Source"), /* @__PURE__ */ React.createElement("strong", null, track.sourceType)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Confidence"), /* @__PURE__ */ React.createElement("strong", null, /* @__PURE__ */ React.createElement(ConfidenceMeter, { score: track.confidenceScore }))))), /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "filter", size: 12 }), "Classification"), /* @__PURE__ */ React.createElement("div", { className: "pt-kv" }, /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Track type"), /* @__PURE__ */ React.createElement("strong", null, track.trackType)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Operational status"), /* @__PURE__ */ React.createElement("strong", null, track.operationalStatus)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Direction"), /* @__PURE__ */ React.createElement("strong", null, track.trafficDirection)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Passenger / goods"), /* @__PURE__ */ React.createElement("strong", null, track.passengerGoods)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item", "data-span": "full" }, /* @__PURE__ */ React.createElement("span", null, "Berthing track"), /* @__PURE__ */ React.createElement("strong", null, track.berthingTrack ? "Yes" : "No")))), /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "track", size: 12 }), "Geometry"), /* @__PURE__ */ React.createElement("div", { className: "pt-kv" }, /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Segments"), /* @__PURE__ */ React.createElement("strong", null, owned.length)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Length"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, fmtLength(chain.totalLength))), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Start point"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, first ? `${first.start[0].toFixed(0)}, ${first.start[1].toFixed(0)}` : "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "End point"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, last ? `${last.end[0].toFixed(0)}, ${last.end[1].toFixed(0)}` : "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Start chainage"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, track.startChainage, " km")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "End chainage"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, track.endChainage, " km")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Alignment"), /* @__PURE__ */ React.createElement("strong", null, track.curvature)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Continuity"), /* @__PURE__ */ React.createElement("strong", { style: { color: chain.gaps.length ? "var(--warning-text)" : "var(--success-text)" } }, chain.gaps.length ? `${chain.gaps.length} gap${chain.gaps.length === 1 ? "" : "s"}` : "Continuous")))), /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "branch", size: 12 }), "Relationships"), /* @__PURE__ */ React.createElement("div", { className: "pt-kv" }, /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Connected tracks"), /* @__PURE__ */ React.createElement("strong", null, track.connectedTracks.length ? track.connectedTracks.join(", ") : "None")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Connected turnouts"), /* @__PURE__ */ React.createElement("strong", null, track.connectedTurnouts.length ? track.connectedTurnouts.join(", ") : "None")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Associated platform"), /* @__PURE__ */ React.createElement("strong", null, track.associatedPlatform)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Fouling marks"), /* @__PURE__ */ React.createElement("strong", null, track.foulingMarks)), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Dead end"), /* @__PURE__ */ React.createElement("strong", null, track.deadEnd ? "Yes" : "No")), /* @__PURE__ */ React.createElement("div", { className: "pt-kv-item" }, /* @__PURE__ */ React.createElement("span", null, "Buffer stop"), /* @__PURE__ */ React.createElement("strong", null, track.bufferStop ? "Yes" : "No")))), /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "layers", size: 12 }), "Source elements (", owned.length, ")"), /* @__PURE__ */ React.createElement("div", { className: "pt-seg-list" }, owned.map((seg) => /* @__PURE__ */ React.createElement("button", { type: "button", className: "pt-seg-row", key: seg.id, onClick: () => onLocateSegment(seg.id) }, /* @__PURE__ */ React.createElement(Icon, { name: "track", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, seg.id), /* @__PURE__ */ React.createElement("span", null, seg.geometryType), /* @__PURE__ */ React.createElement("span", { className: "pt-seg-row-spacer" }), /* @__PURE__ */ React.createElement("span", { className: "mono" }, fmtLength(seg.length)), /* @__PURE__ */ React.createElement(Icon, { name: "target", size: 12 }))))), /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "command", size: 12 }), "Actions"), /* @__PURE__ */ React.createElement("div", { className: "pt-action-grid" }, /* @__PURE__ */ React.createElement(
        Btn,
        {
          variant: "primary",
          size: "sm",
          leadingIcon: "check",
          disabled: track.validationStatus === "Validated" || blocking.length > 0,
          title: blocking.length ? "Resolve the validation errors on this track first" : void 0,
          onClick: () => onConfirm(track.id)
        },
        track.validationStatus === "Validated" ? "Track Confirmed" : "Confirm Track"
      ), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "edit", onClick: () => onEdit(track.id) }, "Edit Attributes"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "plus", onClick: () => onExtend(track.id) }, "Extend Track"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "scissors", onClick: () => onSplit(track.id), disabled: owned.length < 2 }, "Split Track"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "refresh", onClick: () => onReplaceGeometry(track.id) }, "Replace Geometry"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "flag", danger: true, onClick: () => onMarkIncorrect(track.id) }, "Mark AI Result Incorrect")), blocking.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-card-note", style: { background: "var(--danger-soft)", color: "var(--danger-text)" } }, /* @__PURE__ */ React.createElement("strong", null, blocking.length, " error", blocking.length === 1 ? "" : "s", " block confirmation."), " See the validation panel below."))));
    };
    const ValidationMessage = ({ item, acknowledged, onAcknowledge, onFocus }) => /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg", "data-severity": item.severity }, /* @__PURE__ */ React.createElement("span", { className: "pt-vmsg-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: item.severity === "error" ? "alert" : item.severity === "warning" ? "alert_tri" : "info", size: 15 })), /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-body" }, /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-top" }, /* @__PURE__ */ React.createElement("span", { className: "pt-vmsg-cat" }, item.category), item.trackId && /* @__PURE__ */ React.createElement("span", { className: "pt-elm-chip" }, item.trackId), item.groupId && /* @__PURE__ */ React.createElement("span", { className: "pt-elm-chip" }, item.groupId)), /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-text" }, item.message), item.detail && /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-detail" }, item.detail), /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-actions" }, (item.trackId || item.groupId) && /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "xs", leadingIcon: "target", onClick: () => onFocus(item) }, "Locate"), item.severity === "warning" && (acknowledged ? /* @__PURE__ */ React.createElement("span", { className: "pt-vmsg-ack" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 }), "Acknowledged") : /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "xs", leadingIcon: "check", onClick: () => onAcknowledge(item.id) }, "Acknowledge")), item.resolveHint && /* @__PURE__ */ React.createElement("span", { className: "pt-vmsg-detail" }, item.resolveHint))));
    const ValidationSummary = ({ validations, acknowledged, open, onToggle, onAcknowledge, onFocus }) => {
      const counts = {
        error: validations.filter((item) => item.severity === "error").length,
        warning: validations.filter((item) => item.severity === "warning").length,
        information: validations.filter((item) => item.severity === "information").length
      };
      return /* @__PURE__ */ React.createElement("section", { className: "pt-validation" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "pt-validation-head", onClick: onToggle, "aria-expanded": open }, /* @__PURE__ */ React.createElement(Icon, { name: open ? "chevron_down" : "chevron_up", size: 14 }), "Validation", /* @__PURE__ */ React.createElement("span", { className: "pt-validation-head-spacer" }), counts.error > 0 && /* @__PURE__ */ React.createElement(Chip, { tone: "danger", size: "sm", leadingIcon: "alert" }, counts.error, " error", counts.error === 1 ? "" : "s"), counts.warning > 0 && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm", leadingIcon: "alert_tri" }, counts.warning), counts.information > 0 && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", leadingIcon: "info" }, counts.information), !validations.length && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leadingIcon: "check" }, "All clear")), open && /* @__PURE__ */ React.createElement("div", { className: "pt-validation-body" }, validations.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "pt-panel-empty" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 22 }), /* @__PURE__ */ React.createElement("strong", null, "No validation findings"), /* @__PURE__ */ React.createElement("span", null, "Geometry, connectivity, duplicates, attributes and naming all pass.")) : validations.map((item) => /* @__PURE__ */ React.createElement(
        ValidationMessage,
        {
          key: item.id,
          item,
          acknowledged: acknowledged.includes(item.id),
          onAcknowledge,
          onFocus
        }
      ))));
    };
    const Drawer = ({ open, icon, title, subtitle, wide, onClose, footer, children }) => {
      const panelRef = useRef(null);
      useEffect(() => {
        if (!open) return void 0;
        const previous = window.document.activeElement;
        const node = panelRef.current;
        const focusables = () => Array.from(node.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((el) => !el.disabled && el.offsetParent !== null);
        const list = focusables();
        if (list.length) list[0].focus();
        const onKey = (event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
            return;
          }
          if (event.key !== "Tab") return;
          const items = focusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && window.document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && window.document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        };
        node.addEventListener("keydown", onKey);
        return () => {
          node.removeEventListener("keydown", onKey);
          if (previous && previous.focus) previous.focus();
        };
      }, [open, onClose]);
      if (!open) return null;
      return ReactDOM.createPortal(
        /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-backdrop", onMouseDown: (event) => {
          if (event.target === event.currentTarget) onClose();
        } }, /* @__PURE__ */ React.createElement("aside", { className: "pt-drawer", "data-wide": wide ? "true" : "false", role: "dialog", "aria-modal": "true", "aria-label": title, ref: panelRef }, /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-head" }, /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 17 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-title" }, title), subtitle && /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-sub" }, subtitle)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "pt-drawer-close", onClick: onClose, "aria-label": "Close" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 14 }))), /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-body" }, children), footer && /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-foot" }, footer))),
        window.document.body
      );
    };
    const SelectedElementsBlock = ({ elements, contextSegments, onRemove, assignment }) => /* @__PURE__ */ React.createElement("div", { className: "pt-preview" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "target", size: 12 }), "Selected elements (", elements.length, ")"), /* @__PURE__ */ React.createElement(SelectionPreview, { segments: elements, contextSegments, assignment }), /* @__PURE__ */ React.createElement("div", { className: "pt-chiplist" }, elements.map((seg) => /* @__PURE__ */ React.createElement("span", { className: "pt-elm-chip", key: seg.id }, seg.id, onRemove && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => onRemove(seg.id), "aria-label": `Remove ${seg.id} from selection` }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 9 }))))));
    const MappingDrawer = ({ open, elements, tracks, segments, onClose, onConfirm, onRemoveElement }) => {
      const ranked = useMemo(() => rankTracks(tracks, elements, segments), [tracks, elements, segments]);
      const [query, setQuery] = useState("");
      const [choice, setChoice] = useState(null);
      const [previewed, setPreviewed] = useState(false);
      if (!open) return null;
      const activeChoice = choice || (ranked.length ? ranked[0].track.id : null);
      const filtered = ranked.filter(({ track }) => {
        const needle = query.trim().toLowerCase();
        if (!needle) return true;
        return `${track.id} ${track.name} ${track.trackType} ${track.roadNumber}`.toLowerCase().includes(needle);
      });
      const target = tracks.find((track) => track.id === activeChoice);
      const existing = target ? target.segmentIds.length : 0;
      const duplicates = target ? elements.filter((seg) => target.segmentIds.includes(seg.id)) : [];
      const combined = target ? analyseChain(segments.filter((seg) => target.segmentIds.includes(seg.id)).concat(elements)) : { gaps: [], totalLength: 0 };
      const blocked = duplicates.length > 0 || !target;
      return /* @__PURE__ */ React.createElement(
        Drawer,
        {
          open,
          icon: "link",
          title: "Map Elements to Existing Track",
          subtitle: `${elements.length} drawing element${elements.length === 1 ? "" : "s"} selected \xB7 ${fmtLength(elements.reduce((sum, seg) => sum + seg.length, 0))}`,
          onClose,
          footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-foot-spacer" }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "eye", onClick: () => setPreviewed(true), disabled: !target }, "Preview Mapping"), /* @__PURE__ */ React.createElement(
            Btn,
            {
              variant: "accent",
              leadingIcon: "check",
              disabled: blocked,
              title: duplicates.length ? "These elements are already mapped to the selected track" : void 0,
              onClick: () => onConfirm(target.id)
            },
            "Confirm Mapping"
          ))
        },
        /* @__PURE__ */ React.createElement(SelectedElementsBlock, { elements, contextSegments: target ? segments.filter((seg) => target.segmentIds.includes(seg.id)) : [], onRemove: onRemoveElement }),
        /* @__PURE__ */ React.createElement(Field, { label: "Search tracks" }, /* @__PURE__ */ React.createElement(
          TextInput,
          {
            leadingIcon: "search",
            value: query,
            placeholder: "Search by track name, ID, road number or type",
            onChange: (event) => setQuery(event.target.value)
          }
        )),
        /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "spark", size: 12 }), "Suggested tracks \u2014 ranked by proximity, alignment, direction, connectivity and nearby labels"), /* @__PURE__ */ React.createElement("div", { className: "pt-suggest", role: "radiogroup", "aria-label": "Target track" }, filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-panel-empty" }, /* @__PURE__ */ React.createElement("strong", null, "No tracks match"), /* @__PURE__ */ React.createElement("span", null, "Clear the search to see all suggestions.")), filtered.map(({ track, level, reason, score }) => /* @__PURE__ */ React.createElement(
          "button",
          {
            type: "button",
            key: track.id,
            className: "pt-track-opt",
            role: "radio",
            "aria-checked": activeChoice === track.id,
            "data-checked": activeChoice === track.id ? "true" : "false",
            onClick: () => {
              setChoice(track.id);
              setPreviewed(false);
            }
          },
          /* @__PURE__ */ React.createElement("span", { className: "pt-radio" }),
          /* @__PURE__ */ React.createElement("span", { className: "pt-track-opt-body" }, /* @__PURE__ */ React.createElement("span", { className: "pt-track-opt-name" }, track.name || track.id), /* @__PURE__ */ React.createElement("span", { className: "pt-card-id" }, track.id, " \xB7 ", track.trackType, " \xB7 ", track.segmentIds.length, " segments"), /* @__PURE__ */ React.createElement("span", { className: "pt-track-opt-reason" }, reason)),
          /* @__PURE__ */ React.createElement("span", { className: "pt-match", "data-level": level }, level, " match \xB7 ", score)
        )))),
        target && /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "chart", size: 12 }), "Mapping preview"), /* @__PURE__ */ React.createElement("div", { className: "pt-summary" }, /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Existing track segments"), /* @__PURE__ */ React.createElement("strong", null, existing)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "New segments being added"), /* @__PURE__ */ React.createElement("strong", null, elements.length)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Total resulting segments"), /* @__PURE__ */ React.createElement("strong", null, existing + elements.length)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", "data-tone": combined.gaps.length ? "danger" : "success" }, /* @__PURE__ */ React.createElement("span", null, "Gap detected"), /* @__PURE__ */ React.createElement("strong", null, combined.gaps.length ? `Yes \u2014 ${combined.gaps[0].distance.toFixed(1)} m` : "No")), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", "data-tone": duplicates.length ? "danger" : "success" }, /* @__PURE__ */ React.createElement("span", null, "Duplicate detected"), /* @__PURE__ */ React.createElement("strong", null, duplicates.length ? `Yes \u2014 ${duplicates.map((seg) => seg.id).join(", ")}` : "No")), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Resulting length"), /* @__PURE__ */ React.createElement("strong", { className: "mono" }, fmtLength(combined.totalLength)))), previewed && /* @__PURE__ */ React.createElement("div", { className: "pt-card-note" }, /* @__PURE__ */ React.createElement("strong", null, "Preview shown on the canvas."), " The selected elements are drawn against the existing geometry of ", target.name || target.id, "."))
      );
    };
    const TrackAttributeForm = ({ value, onChange, errors, showSystemFields = true }) => {
      const set = (key) => (event) => onChange({ ...value, [key]: event.target.value });
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "pt-form-grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Track name", required: true, error: errors.name }, /* @__PURE__ */ React.createElement(TextInput, { value: value.name, onChange: set("name"), placeholder: "e.g. Road No. 3", invalid: errors.name ? "true" : void 0 })), /* @__PURE__ */ React.createElement(Field, { label: "Road number", required: true, error: errors.roadNumber }, /* @__PURE__ */ React.createElement(TextInput, { value: value.roadNumber, onChange: set("roadNumber"), placeholder: "e.g. 7", invalid: errors.roadNumber ? "true" : void 0 })), /* @__PURE__ */ React.createElement(Field, { label: "Track type", required: true, error: errors.trackType }, /* @__PURE__ */ React.createElement(Select, { value: value.trackType, onChange: set("trackType") }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select track type"), D.TRACK_TYPES.map((option) => /* @__PURE__ */ React.createElement("option", { key: option, value: option }, option)))), /* @__PURE__ */ React.createElement(Field, { label: "Operational status", required: true, error: errors.operationalStatus }, /* @__PURE__ */ React.createElement(Select, { value: value.operationalStatus, onChange: set("operationalStatus") }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select status"), D.OPERATIONAL_STATUSES.map((option) => /* @__PURE__ */ React.createElement("option", { key: option, value: option }, option)))), /* @__PURE__ */ React.createElement(Field, { label: "Traffic direction", required: true, error: errors.trafficDirection }, /* @__PURE__ */ React.createElement(Select, { value: value.trafficDirection, onChange: set("trafficDirection") }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select direction"), D.TRAFFIC_DIRECTIONS.map((option) => /* @__PURE__ */ React.createElement("option", { key: option, value: option }, option)))), /* @__PURE__ */ React.createElement(Field, { label: "Passenger / goods", optional: true }, /* @__PURE__ */ React.createElement(Select, { value: value.passengerGoods, onChange: set("passengerGoods") }, D.PASSENGER_GOODS.map((option) => /* @__PURE__ */ React.createElement("option", { key: option, value: option }, option))))), /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "track", size: 12 }), "System-derived geometry"), /* @__PURE__ */ React.createElement("div", { className: "pt-form-grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Start chainage (km)", optional: true }, /* @__PURE__ */ React.createElement(TextInput, { value: value.startChainage, onChange: set("startChainage") })), /* @__PURE__ */ React.createElement(Field, { label: "End chainage (km)", optional: true }, /* @__PURE__ */ React.createElement(TextInput, { value: value.endChainage, onChange: set("endChainage") })), /* @__PURE__ */ React.createElement(Field, { label: "Track length (m)", optional: true, help: "Derived from the mapped geometry" }, /* @__PURE__ */ React.createElement(TextInput, { value: value.length, readOnly: true })), /* @__PURE__ */ React.createElement(Field, { label: "Berthing track", optional: true }, /* @__PURE__ */ React.createElement(Select, { value: value.berthingTrack ? "Yes" : "No", onChange: (event) => onChange({ ...value, berthingTrack: event.target.value === "Yes" }) }, /* @__PURE__ */ React.createElement("option", null, "No"), /* @__PURE__ */ React.createElement("option", null, "Yes"))))), showSystemFields && /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "branch", size: 12 }), "Relationships"), /* @__PURE__ */ React.createElement("div", { className: "pt-form-grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Connected track", optional: true }, /* @__PURE__ */ React.createElement(TextInput, { value: value.connectedTrack, onChange: set("connectedTrack"), placeholder: "e.g. TRK-003" })), /* @__PURE__ */ React.createElement(Field, { label: "Connected turnout", optional: true }, /* @__PURE__ */ React.createElement(TextInput, { value: value.connectedTurnout, onChange: set("connectedTurnout"), placeholder: "e.g. P-118" })), /* @__PURE__ */ React.createElement(Field, { label: "Associated platform", optional: true }, /* @__PURE__ */ React.createElement(TextInput, { value: value.associatedPlatform, onChange: set("associatedPlatform"), placeholder: "e.g. PF 1" })), /* @__PURE__ */ React.createElement(Field, { label: "Dead end", optional: true }, /* @__PURE__ */ React.createElement(Select, { value: value.deadEnd ? "Yes" : "No", onChange: (event) => onChange({ ...value, deadEnd: event.target.value === "Yes" }) }, /* @__PURE__ */ React.createElement("option", null, "No"), /* @__PURE__ */ React.createElement("option", null, "Yes"))), /* @__PURE__ */ React.createElement("div", { "data-span": "full" }, /* @__PURE__ */ React.createElement(Field, { label: "Remarks", optional: true }, /* @__PURE__ */ React.createElement(Textarea, { value: value.remarks, onChange: set("remarks"), rows: 3, placeholder: "Notes for the approver" }))))));
    };
    const emptyAttributes = () => ({
      name: "",
      roadNumber: "",
      trackType: "",
      operationalStatus: "Existing",
      trafficDirection: "",
      passengerGoods: "Not Applicable",
      startChainage: "",
      endChainage: "",
      length: "0",
      connectedTrack: "",
      connectedTurnout: "",
      associatedPlatform: "",
      deadEnd: false,
      berthingTrack: false,
      remarks: ""
    });
    const attributeErrors = (value, tracks, ownId) => {
      const errors = {};
      MANDATORY_FIELDS.forEach(([field, label]) => {
        if (!String(value[field] || "").trim()) errors[field] = `${label} is required`;
      });
      const clash = tracks.find(
        (track) => track.id !== ownId && (track.name || "").trim().toLowerCase() === (value.name || "").trim().toLowerCase() && value.name
      );
      if (clash) errors.name = `Track name "${value.name}" is already in use by ${clash.id}`;
      return errors;
    };
    const LiveValidationSummary = ({ elements, tracks, value, ownId, segments }) => {
      const chain = analyseChain(elements);
      const errors = attributeErrors(value, tracks, ownId);
      const overlapping = tracks.filter(
        (track) => track.id !== ownId && elements.some((seg) => track.segmentIds.includes(seg.id))
      );
      const endpoints = chain.ordered.length ? [chain.ordered[0].start, chain.ordered[chain.ordered.length - 1].end] : [];
      const crossing = elements.some(
        (seg) => segments.some((other) => other.trackId && other.trackId !== ownId && Math.abs(midpoint(other)[1] - midpoint(seg)[1]) < 3 && Math.abs(midpoint(other)[0] - midpoint(seg)[0]) < 40)
      );
      const rows = [
        { label: "Geometry continuity", ok: chain.gaps.length === 0, value: chain.gaps.length ? `${chain.gaps.length} gap (${chain.gaps[0].distance.toFixed(1)} m)` : "Continuous" },
        { label: "Duplicate geometry", ok: overlapping.length === 0, value: overlapping.length ? `Used by ${overlapping.map((track) => track.id).join(", ")}` : "None" },
        { label: "Track crossing", ok: !crossing, value: crossing ? "Possible crossing detected" : "None detected" },
        { label: "Start and end node", ok: endpoints.length === 2, value: endpoints.length === 2 ? `${chainageAt(endpoints[0][0])} \u2192 ${chainageAt(endpoints[1][0])} km` : "Not resolved" },
        { label: "Connectivity", ok: chain.gaps.length === 0, value: chain.gaps.length ? "Discontinuous chain" : "Single connected chain" },
        { label: "Mandatory attributes", ok: Object.keys(errors).length === 0, value: Object.keys(errors).length ? `${Object.keys(errors).length} missing or invalid` : "Complete" }
      ];
      return /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "shield", size: 12 }), "Live validation"), /* @__PURE__ */ React.createElement("div", { className: "pt-summary" }, rows.map((row) => /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", key: row.label, "data-tone": row.ok ? "success" : "danger" }, /* @__PURE__ */ React.createElement("span", null, row.label), /* @__PURE__ */ React.createElement("strong", null, /* @__PURE__ */ React.createElement(Icon, { name: row.ok ? "check" : "alert", size: 12 }), " ", row.value)))));
    };
    const CreateTrackDrawer = ({ open, elements, tracks, segments, nextId, onClose, onCreate, onSaveDraft, onRemoveElement }) => {
      const [value, setValue] = useState(() => {
        const chain = analyseChain(elements);
        const first = chain.ordered[0];
        const last = chain.ordered[chain.ordered.length - 1];
        return {
          ...emptyAttributes(),
          length: chain.totalLength.toFixed(1),
          startChainage: first ? chainageAt(first.start[0]) : "",
          endChainage: last ? chainageAt(last.end[0]) : ""
        };
      });
      const [touched, setTouched] = useState(false);
      if (!open) return null;
      const errors = attributeErrors(value, tracks, null);
      const showErrors = touched ? errors : {};
      const valid = Object.keys(errors).length === 0;
      return /* @__PURE__ */ React.createElement(
        Drawer,
        {
          open,
          icon: "plus",
          title: "Create Track from Selected Elements",
          subtitle: `New track ${nextId} \xB7 ${elements.length} element${elements.length === 1 ? "" : "s"}`,
          wide: true,
          onClose,
          footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-foot-spacer" }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "save", onClick: () => onSaveDraft(value) }, "Save as Draft"), /* @__PURE__ */ React.createElement(
            Btn,
            {
              variant: "accent",
              leadingIcon: "check",
              onClick: () => {
                setTouched(true);
                if (valid) onCreate(value);
              },
              disabled: touched && !valid
            },
            "Create Track"
          ))
        },
        /* @__PURE__ */ React.createElement(SelectedElementsBlock, { elements, onRemove: onRemoveElement }),
        /* @__PURE__ */ React.createElement(TrackAttributeForm, { value, onChange: setValue, errors: showErrors }),
        /* @__PURE__ */ React.createElement(LiveValidationSummary, { elements, tracks, value, ownId: null, segments })
      );
    };
    const attributesFromTrack = (track) => ({
      name: track.name,
      roadNumber: track.roadNumber,
      trackType: track.trackType,
      operationalStatus: track.operationalStatus,
      trafficDirection: track.trafficDirection,
      passengerGoods: track.passengerGoods,
      startChainage: track.startChainage,
      endChainage: track.endChainage,
      length: String(track.length),
      connectedTrack: (track.connectedTracks || []).join(", "),
      connectedTurnout: (track.connectedTurnouts || []).join(", "),
      associatedPlatform: track.associatedPlatform,
      deadEnd: track.deadEnd,
      berthingTrack: track.berthingTrack,
      remarks: track.remarks || ""
    });
    const EditTrackDrawer = ({ open, track, tracks, segments, onClose, onSave }) => {
      const [value, setValue] = useState(() => track ? attributesFromTrack(track) : emptyAttributes());
      const [touched, setTouched] = useState(false);
      if (!open || !track) return null;
      const elements = segments.filter((seg) => track.segmentIds.includes(seg.id));
      const errors = attributeErrors(value, tracks, track.id);
      const showErrors = touched ? errors : {};
      const valid = Object.keys(errors).length === 0;
      return /* @__PURE__ */ React.createElement(
        Drawer,
        {
          open,
          icon: "edit",
          title: "Edit Track Attributes",
          subtitle: `${track.id} \xB7 ${elements.length} source element${elements.length === 1 ? "" : "s"}`,
          wide: true,
          onClose,
          footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-foot-spacer" }), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: () => {
            setTouched(true);
            if (valid) onSave(track.id, value);
          }, disabled: touched && !valid }, "Save Attributes"))
        },
        /* @__PURE__ */ React.createElement(TrackAttributeForm, { value, onChange: setValue, errors: showErrors }),
        /* @__PURE__ */ React.createElement(LiveValidationSummary, { elements, tracks, value, ownId: track.id, segments })
      );
    };
    const SplitTrackDrawer = ({ open, track, segments, tracks, assignment, onAssign, onClose, onConfirm }) => {
      const [names, setNames] = useState(() => ({ A: track && track.name || "", B: "" }));
      const [types, setTypes] = useState(() => ({ A: track && track.trackType || "", B: track && track.trackType || "" }));
      const [roads, setRoads] = useState(() => ({ A: track && track.roadNumber || "", B: "" }));
      if (!open || !track) return null;
      const owned = segments.filter((seg) => track.segmentIds.includes(seg.id));
      const groupA = owned.filter((seg) => (assignment[seg.id] || "A") === "A");
      const groupB = owned.filter((seg) => assignment[seg.id] === "B");
      const chainA = analyseChain(groupA);
      const chainB = analyseChain(groupB);
      const valid = groupA.length > 0 && groupB.length > 0 && names.A.trim() && names.B.trim() && types.A && types.B && roads.A.trim() && roads.B.trim();
      const groupBlock = (key, list, chain, tone) => /* @__PURE__ */ React.createElement("div", { className: "pt-split-group", "data-active": list.length > 0 ? "true" : "false" }, /* @__PURE__ */ React.createElement("div", { className: "pt-split-title" }, /* @__PURE__ */ React.createElement("span", { className: "pt-split-dot", style: { background: tone } }), "Track ", key, " \xB7 ", list.length, " segment", list.length === 1 ? "" : "s", " \xB7 ", fmtLength(chain.totalLength)), /* @__PURE__ */ React.createElement("div", { className: "pt-chiplist" }, list.map((seg) => /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "pt-elm-chip",
          key: seg.id,
          onClick: () => onAssign(seg.id, key === "A" ? "B" : "A"),
          title: `Move ${seg.id} to Track ${key === "A" ? "B" : "A"}`
        },
        seg.id,
        /* @__PURE__ */ React.createElement(Icon, { name: "arrow_right", size: 10 })
      )), !list.length && /* @__PURE__ */ React.createElement("span", { className: "pt-vmsg-detail" }, "Click a segment chip in the other group to move it here.")), /* @__PURE__ */ React.createElement("div", { className: "pt-form-grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Track name", required: true }, /* @__PURE__ */ React.createElement(TextInput, { value: names[key], onChange: (event) => setNames({ ...names, [key]: event.target.value }), placeholder: `Name for track ${key}` })), /* @__PURE__ */ React.createElement(Field, { label: "Road number", required: true }, /* @__PURE__ */ React.createElement(TextInput, { value: roads[key], onChange: (event) => setRoads({ ...roads, [key]: event.target.value }), placeholder: "e.g. 8" })), /* @__PURE__ */ React.createElement("div", { "data-span": "full" }, /* @__PURE__ */ React.createElement(Field, { label: "Track type", required: true }, /* @__PURE__ */ React.createElement(Select, { value: types[key], onChange: (event) => setTypes({ ...types, [key]: event.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select track type"), D.TRACK_TYPES.map((option) => /* @__PURE__ */ React.createElement("option", { key: option, value: option }, option)))))), chain.gaps.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg", "data-severity": "warning" }, /* @__PURE__ */ React.createElement("span", { className: "pt-vmsg-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "alert_tri", size: 14 })), /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-body" }, /* @__PURE__ */ React.createElement("div", { className: "pt-vmsg-text" }, "This group contains a gap of ", chain.gaps[0].distance.toFixed(1), " m."))));
      return /* @__PURE__ */ React.createElement(
        Drawer,
        {
          open,
          icon: "scissors",
          title: "Split Track",
          subtitle: `${track.id} \xB7 ${owned.length} segments \xB7 click chips on the canvas list to reassign`,
          wide: true,
          onClose,
          footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement("div", { className: "pt-drawer-foot-spacer" }), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "scissors", disabled: !valid, onClick: () => onConfirm({ names, types, roads }) }, "Confirm Split"))
        },
        /* @__PURE__ */ React.createElement("div", { className: "pt-preview" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "target", size: 12 }), "Split preview"), /* @__PURE__ */ React.createElement(SelectionPreview, { segments: owned, assignment })),
        groupBlock("A", groupA, chainA, "#6d5cd6"),
        groupBlock("B", groupB, chainB, "oklch(0.62 0.13 240)"),
        /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "branch", size: 12 }), "Connectivity impact"), /* @__PURE__ */ React.createElement("div", { className: "pt-summary" }, /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Tracks after split"), /* @__PURE__ */ React.createElement("strong", null, "2")), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Connected turnouts to reassign"), /* @__PURE__ */ React.createElement("strong", null, (track.connectedTurnouts || []).join(", ") || "None")), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", "data-tone": groupB.length ? "success" : "danger" }, /* @__PURE__ */ React.createElement("span", null, "Both groups populated"), /* @__PURE__ */ React.createElement("strong", null, groupB.length ? "Yes" : "No"))))
      );
    };
    const NotTrackDialog = ({ open, elements, onClose, onConfirm }) => {
      const [reason, setReason] = useState("");
      const [remarks, setRemarks] = useState("");
      useEffect(() => {
        if (open) {
          setReason("");
          setRemarks("");
        }
      }, [open]);
      if (!open) return null;
      return /* @__PURE__ */ React.createElement(
        Modal,
        {
          open,
          onClose,
          icon: "eye_off",
          iconTone: "warning",
          title: "Mark Selected Elements as Not a Track?",
          subtitle: `${elements.length} drawing element${elements.length === 1 ? "" : "s"} will be excluded from the digital ESP.`,
          footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", leadingIcon: "check", disabled: !reason, onClick: () => onConfirm(reason, remarks) }, "Confirm"))
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "pt-chiplist" }, elements.map((seg) => /* @__PURE__ */ React.createElement("span", { className: "pt-elm-chip", key: seg.id }, seg.id, " \xB7 ", seg.sourceLayer))), /* @__PURE__ */ React.createElement(Field, { label: "Reason", required: true, help: "Recorded in the mock audit history against each element." }, /* @__PURE__ */ React.createElement(Select, { value: reason, onChange: (event) => setReason(event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select a reason"), D.REJECTION_REASONS.map((option) => /* @__PURE__ */ React.createElement("option", { key: option, value: option }, option)))), /* @__PURE__ */ React.createElement(Field, { label: "Remarks", optional: true }, /* @__PURE__ */ React.createElement(Textarea, { value: remarks, rows: 3, onChange: (event) => setRemarks(event.target.value), placeholder: "Optional note for the approver" })))
      );
    };
    const ReviewCompletionDialog = ({ open, stats, validations, onClose, onConfirm }) => {
      if (!open) return null;
      const warnings = validations.filter((item) => item.severity === "warning");
      return /* @__PURE__ */ React.createElement(
        Modal,
        {
          open,
          onClose,
          icon: "check_circle",
          iconTone: "success",
          title: "Complete Track Review?",
          subtitle: `${stats.validated} of ${stats.total} tracks validated for ${D.STATION.name} ${D.DOCUMENT.label}.`,
          footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent", leadingIcon: "check", onClick: onConfirm }, "Complete Track Review"))
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "pt-summary" }, /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", "data-tone": "success" }, /* @__PURE__ */ React.createElement("span", null, "Tracks validated"), /* @__PURE__ */ React.createElement("strong", null, stats.validated, " / ", stats.total)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Elements mapped by user"), /* @__PURE__ */ React.createElement("strong", null, stats.userMapped)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Tracks created by user"), /* @__PURE__ */ React.createElement("strong", null, stats.userCreated)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row" }, /* @__PURE__ */ React.createElement("span", null, "Elements marked Not a Track"), /* @__PURE__ */ React.createElement("strong", null, stats.notATrack)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", "data-tone": warnings.length ? void 0 : "success" }, /* @__PURE__ */ React.createElement("span", null, "Acknowledged warnings"), /* @__PURE__ */ React.createElement("strong", null, warnings.length)), /* @__PURE__ */ React.createElement("div", { className: "pt-summary-row", "data-tone": "success" }, /* @__PURE__ */ React.createElement("span", null, "Blocking errors"), /* @__PURE__ */ React.createElement("strong", null, "0"))), /* @__PURE__ */ React.createElement("div", { className: "pt-card-note" }, "Completing the review locks the track layer of this ESP version and hands the extraction on to the Platforms review step."))
      );
    };
    const clone = (value) => JSON.parse(JSON.stringify(value));
    const FIT_VIEW = { ...D.VIEWBOX };
    const now = () => (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const usePimTrackReview = () => {
      const [tracks, setTracks] = useState(() => clone(D.TRACKS));
      const [segments, setSegments] = useState(() => clone(D.SEGMENTS));
      const [groups, setGroups] = useState(() => clone(D.ELEMENT_GROUPS));
      const [mappings, setMappings] = useState(() => clone(D.MAPPING_RECORDS));
      const [audit, setAudit] = useState([]);
      const [retiredSeeds, setRetiredSeeds] = useState([]);
      const [acknowledged, setAcknowledged] = useState([]);
      const [dirty, setDirty] = useState(0);
      const [lastSavedAt, setLastSavedAt] = useState("");
      const [toasts, setToasts] = useState([]);
      const bumpDirty = () => setDirty((count) => count + 1);
      const toast = useCallback((message, tone = "success") => {
        const id = `T-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        setToasts((list) => [...list, { id, message, tone }]);
        window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 4200);
      }, []);
      const validations = useMemo(
        () => buildValidations({ tracks, segments, groups, retiredSeeds }),
        [tracks, segments, groups, retiredSeeds]
      );
      const nextTrackId = useMemo(() => {
        const highest = tracks.reduce((max, track) => {
          const num = parseInt(String(track.id).replace(/\D/g, ""), 10);
          return Number.isFinite(num) ? Math.max(max, num) : max;
        }, 0);
        return `TRK-${String(highest + 1).padStart(3, "0")}`;
      }, [tracks]);
      const recordMapping = (elementIds, trackId, method, remarks) => {
        setMappings((list) => [
          ...list,
          {
            id: `MAP-${String(list.length + 1).padStart(3, "0")}`,
            sourceElementIds: elementIds.slice(),
            trackId,
            mappingMethod: method,
            mappedBy: D.CURRENT_USER.name,
            mappedAt: now(),
            remarks: remarks || ""
          }
        ]);
      };
      const logAudit = (entry) => setAudit((list) => [{ at: now(), by: D.CURRENT_USER.name, ...entry }, ...list]);
      const rederive = (track, allSegments) => {
        const owned = allSegments.filter((seg) => track.segmentIds.includes(seg.id));
        const chain = analyseChain(owned);
        const first = chain.ordered[0];
        const last = chain.ordered[chain.ordered.length - 1];
        return {
          ...track,
          length: Number(chain.totalLength.toFixed(1)),
          startChainage: first ? chainageAt(Math.min(first.start[0], last ? last.end[0] : first.start[0])) : track.startChainage,
          endChainage: last ? chainageAt(Math.max(last.end[0], first ? first.start[0] : last.end[0])) : track.endChainage
        };
      };
      const resolveGroupsFor = (elementIds, status) => {
        setGroups(
          (list) => list.map((group) => {
            if (!group.elementIds.some((id) => elementIds.includes(id))) return group;
            const remaining = group.elementIds.filter((id) => !elementIds.includes(id));
            return remaining.length ? group : { ...group, status };
          })
        );
      };
      const mapToTrack = (elementIds, trackId, method = "User Corrected") => {
        const target = tracks.find((track) => track.id === trackId);
        if (!target) return;
        const duplicate = elementIds.filter((id) => tracks.some((track) => track.segmentIds.includes(id)));
        if (duplicate.length) {
          toast(`${duplicate.join(", ")} is already mapped. Mapping cancelled.`, "danger");
          return;
        }
        const nextSegments = segments.map(
          (seg) => elementIds.includes(seg.id) ? { ...seg, trackId, layer: "TRACK", mappingStatus: "Mapped \u2014 Draft", mappedTrackId: trackId } : seg
        );
        setSegments(nextSegments);
        setTracks(
          (list) => list.map((track) => {
            if (track.id !== trackId) return track;
            const merged = {
              ...track,
              segmentIds: uniq([...track.segmentIds, ...elementIds]),
              sourceType: method,
              validationStatus: "Ready for Confirmation",
              endNodeId: track.endNodeId || `ND-${trackId}-E`
            };
            return rederive(merged, nextSegments);
          })
        );
        resolveGroupsFor(elementIds, "Mapped \u2014 Draft");
        recordMapping(elementIds, trackId, method, `Mapped ${elementIds.length} element(s) via PIM review`);
        logAudit({ action: "Mapped elements", detail: `${elementIds.join(", ")} \u2192 ${target.name || trackId}` });
        setRetiredSeeds((list) => uniq([...list, "V-W1"]));
        bumpDirty();
        toast(`${elementIds.length} drawing element${elementIds.length === 1 ? " was" : "s were"} mapped to ${target.name || trackId}.`);
      };
      const createTrack = (elementIds, attributes, asDraft = false) => {
        const id = nextTrackId;
        const owned = segments.filter((seg) => elementIds.includes(seg.id));
        const chain = analyseChain(owned);
        const first = chain.ordered[0];
        const last = chain.ordered[chain.ordered.length - 1];
        const track = {
          id,
          name: attributes.name,
          roadNumber: attributes.roadNumber,
          trackType: attributes.trackType,
          operationalStatus: attributes.operationalStatus,
          trafficDirection: attributes.trafficDirection,
          passengerGoods: attributes.passengerGoods,
          berthingTrack: !!attributes.berthingTrack,
          segmentIds: elementIds.slice(),
          startNodeId: `ND-${id}-S`,
          endNodeId: attributes.deadEnd ? null : `ND-${id}-E`,
          startChainage: attributes.startChainage || (first ? chainageAt(first.start[0]) : ""),
          endChainage: attributes.endChainage || (last ? chainageAt(last.end[0]) : ""),
          length: Number(chain.totalLength.toFixed(1)),
          sourceType: "User Created",
          confidenceScore: 100,
          validationStatus: asDraft ? "Mapped \u2014 Draft" : "Ready for Confirmation",
          curvature: owned.some((seg) => seg.geometryType === "Arc") ? "Curved" : "Straight",
          connectedTracks: attributes.connectedTrack ? attributes.connectedTrack.split(",").map((item) => item.trim()).filter(Boolean) : [],
          connectedTurnouts: attributes.connectedTurnout ? attributes.connectedTurnout.split(",").map((item) => item.trim()).filter(Boolean) : [],
          associatedPlatform: attributes.associatedPlatform || "\u2014",
          deadEnd: !!attributes.deadEnd,
          bufferStop: !!attributes.deadEnd,
          foulingMarks: 0,
          remarks: attributes.remarks
        };
        setSegments(
          (list) => list.map(
            (seg) => elementIds.includes(seg.id) ? { ...seg, trackId: id, layer: "TRACK", mappingStatus: "Mapped \u2014 Draft", mappedTrackId: id } : seg
          )
        );
        setTracks((list) => [...list, track]);
        resolveGroupsFor(elementIds, asDraft ? "Mapped \u2014 Draft" : "Mapped \u2014 Draft");
        recordMapping(elementIds, id, "User Created", attributes.remarks);
        logAudit({ action: "Created track", detail: `${id} ${attributes.name} from ${elementIds.join(", ")}` });
        bumpDirty();
        toast(`${id} ${attributes.name} was created from ${elementIds.length} element${elementIds.length === 1 ? "" : "s"}.`);
        return id;
      };
      const markNotATrack = (elementIds, reason, remarks) => {
        setSegments(
          (list) => list.map(
            (seg) => elementIds.includes(seg.id) ? { ...seg, mappingStatus: "Not a Track", rejectionReason: reason, remarks } : seg
          )
        );
        resolveGroupsFor(elementIds, "Not a Track");
        logAudit({ action: "Marked Not a Track", detail: `${elementIds.join(", ")} \xB7 ${reason}${remarks ? ` \xB7 ${remarks}` : ""}` });
        bumpDirty();
        toast(`${elementIds.length} element${elementIds.length === 1 ? "" : "s"} marked as Not a Track (${reason}).`, "info");
      };
      const confirmTrack = (trackId) => {
        const blocking = validations.filter((item) => item.severity === "error" && item.trackId === trackId);
        if (blocking.length) {
          toast(`${trackId} still has ${blocking.length} blocking error${blocking.length === 1 ? "" : "s"}.`, "danger");
          return;
        }
        setTracks(
          (list) => list.map(
            (track) => track.id === trackId ? { ...track, validationStatus: "Validated", sourceType: track.sourceType === "AI Auto-Mapped" ? "User Confirmed" : track.sourceType } : track
          )
        );
        setRetiredSeeds((list) => uniq([...list, ...D.SEED_VALIDATIONS.filter((seed) => seed.trackId === trackId).map((seed) => seed.id)]));
        logAudit({ action: "Confirmed track", detail: trackId });
        bumpDirty();
        toast(`${trackId} validated.`);
      };
      const saveAttributes = (trackId, value) => {
        setTracks(
          (list) => list.map(
            (track) => track.id === trackId ? {
              ...track,
              name: value.name,
              roadNumber: value.roadNumber,
              trackType: value.trackType,
              operationalStatus: value.operationalStatus,
              trafficDirection: value.trafficDirection,
              passengerGoods: value.passengerGoods,
              berthingTrack: value.berthingTrack,
              startChainage: value.startChainage,
              endChainage: value.endChainage,
              associatedPlatform: value.associatedPlatform || "\u2014",
              connectedTracks: value.connectedTrack ? value.connectedTrack.split(",").map((item) => item.trim()).filter(Boolean) : track.connectedTracks,
              connectedTurnouts: value.connectedTurnout ? value.connectedTurnout.split(",").map((item) => item.trim()).filter(Boolean) : track.connectedTurnouts,
              deadEnd: value.deadEnd,
              bufferStop: value.deadEnd || track.bufferStop,
              endNodeId: value.deadEnd ? null : track.endNodeId || `ND-${trackId}-E`,
              remarks: value.remarks,
              sourceType: track.sourceType === "AI Auto-Mapped" ? "User Corrected" : track.sourceType,
              validationStatus: track.validationStatus === "Needs Review" || track.validationStatus === "Validation Failed" ? "Ready for Confirmation" : track.validationStatus
            } : track
          )
        );
        logAudit({ action: "Edited attributes", detail: `${trackId} \xB7 ${value.name}` });
        bumpDirty();
        toast(`Attributes updated for ${trackId}.`);
      };
      const splitTrack = (trackId, assignment, { names, types, roads }) => {
        const source = tracks.find((track) => track.id === trackId);
        if (!source) return;
        const groupA = source.segmentIds.filter((id) => (assignment[id] || "A") === "A");
        const groupB = source.segmentIds.filter((id) => assignment[id] === "B");
        const newId = nextTrackId;
        const build = (base, ids, side, id) => rederive({
          ...base,
          id,
          name: names[side],
          trackType: types[side],
          roadNumber: roads[side],
          segmentIds: ids,
          sourceType: "User Corrected",
          confidenceScore: 100,
          validationStatus: "Ready for Confirmation"
        }, segments);
        const trackA = build(source, groupA, "A", trackId);
        const trackB = build(source, groupB, "B", newId);
        setSegments((list) => list.map((seg) => groupB.includes(seg.id) ? { ...seg, trackId: newId, mappedTrackId: newId } : seg));
        setTracks((list) => [...list.map((track) => track.id === trackId ? trackA : track), trackB]);
        recordMapping(groupB, newId, "User Corrected", `Split from ${trackId}`);
        logAudit({ action: "Split track", detail: `${trackId} \u2192 ${trackId} (${names.A}) + ${newId} (${names.B})` });
        setRetiredSeeds((list) => uniq([...list, ...D.SEED_VALIDATIONS.filter((seed) => seed.trackId === trackId).map((seed) => seed.id)]));
        bumpDirty();
        toast(`${trackId} was split into ${names.A} and ${names.B} (${newId}).`);
        return newId;
      };
      const acknowledgeWarning = (id) => {
        setAcknowledged((list) => uniq([...list, id]));
        bumpDirty();
      };
      const markAiIncorrect = (trackId) => {
        setTracks(
          (list) => list.map((track) => track.id === trackId ? { ...track, validationStatus: "Needs Review", confidenceScore: Math.min(track.confidenceScore, 40) } : track)
        );
        logAudit({ action: "Marked AI result incorrect", detail: trackId });
        bumpDirty();
        toast(`${trackId} flagged as an incorrect AI result and moved to Needs Review.`, "info");
      };
      const setGroupStatus = (groupId, status) => {
        setGroups((list) => list.map((group) => group.id === groupId ? { ...group, status } : group));
        bumpDirty();
      };
      const saveDraft = () => {
        setLastSavedAt(now());
        setDirty(0);
        logAudit({ action: "Saved draft", detail: `${tracks.length} tracks, ${mappings.length} mapping records` });
        toast("Draft saved. Your review state is preserved for this session.", "info");
      };
      const stats = useMemo(() => {
        const openGroups = groups.filter((group) => group.status === "Unidentified" || group.status === "Review Later").length;
        return {
          total: tracks.length,
          validated: tracks.filter((track) => track.validationStatus === "Validated").length,
          identified: tracks.filter((track) => track.validationStatus !== "Needs Review" && track.validationStatus !== "Validation Failed").length,
          needsReview: tracks.filter((track) => track.validationStatus === "Needs Review" || track.validationStatus === "Validation Failed").length,
          unidentified: openGroups,
          notATrack: segments.filter((seg) => seg.mappingStatus === "Not a Track").length,
          errors: validations.filter((item) => item.severity === "error").length,
          userMapped: mappings.filter((record) => record.mappingMethod === "User Corrected").reduce((sum, record) => sum + record.sourceElementIds.length, 0),
          userCreated: tracks.filter((track) => track.sourceType === "User Created").length
        };
      }, [tracks, groups, segments, validations, mappings]);
      const unacknowledgedWarnings = validations.filter(
        (item) => item.severity === "warning" && !acknowledged.includes(item.id)
      );
      const blockingCount = stats.errors + (stats.total - stats.validated) + stats.unidentified + unacknowledgedWarnings.length;
      const canComplete = blockingCount === 0;
      return {
        tracks,
        segments,
        groups,
        mappings,
        audit,
        validations,
        acknowledged,
        stats,
        dirty,
        lastSavedAt,
        toasts,
        nextTrackId,
        canComplete,
        blockingCount,
        unacknowledgedWarnings,
        actions: {
          mapToTrack,
          createTrack,
          markNotATrack,
          confirmTrack,
          saveAttributes,
          splitTrack,
          acknowledgeWarning,
          markAiIncorrect,
          setGroupStatus,
          saveDraft,
          toast,
          logAudit
        }
      };
    };
    const PIMTracksPage = ({ station = D.STATION, document: doc = D.DOCUMENT, onBack, onComplete }) => {
      const review = usePimTrackReview();
      const { tracks, segments, groups, validations, acknowledged, stats } = review;
      const [activeTab, setActiveTab] = useState("identified");
      const [selectedIds, setSelectedIds] = useState([]);
      const [selectedTrackId, setSelectedTrackId] = useState(null);
      const [detailOpen, setDetailOpen] = useState(false);
      const [mode, setMode] = useState("select");
      const [extendTarget, setExtendTarget] = useState(null);
      const [splitTarget, setSplitTarget] = useState(null);
      const [splitAssignment, setSplitAssignment] = useState({});
      const [layerVisibility, setLayerVisibility] = useState(
        () => Object.fromEntries(D.LAYERS.map((layer) => [layer.id, layer.visible]))
      );
      const [layerOpen, setLayerOpen] = useState(false);
      const [view, setView] = useState(FIT_VIEW);
      const [drawer, setDrawer] = useState(null);
      const [dialog, setDialog] = useState(null);
      const [validationOpen, setValidationOpen] = useState(true);
      const [panelOpen, setPanelOpen] = useState(false);
      const segById = useMemo(() => new Map(segments.map((seg) => [seg.id, seg])), [segments]);
      const trackById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
      const selectedSegments = useMemo(
        () => selectedIds.map((id) => segById.get(id)).filter(Boolean),
        [selectedIds, segById]
      );
      const selectedTrack = selectedTrackId ? trackById.get(selectedTrackId) : null;
      const selectableSegments = useMemo(
        () => segments.filter((seg) => seg.mappingStatus !== "Not a Track"),
        [segments]
      );
      const unmappedPool = useMemo(
        () => segments.filter((seg) => !seg.trackId && seg.mappingStatus !== "Not a Track"),
        [segments]
      );
      const allSelectedUnidentified = selectedSegments.length > 0 && selectedSegments.every((seg) => !seg.trackId && seg.mappingStatus !== "Not a Track");
      const identifiedTracks = tracks.filter(
        (track) => track.validationStatus !== "Needs Review" && track.validationStatus !== "Validation Failed"
      );
      const reviewTracks = tracks.filter(
        (track) => track.validationStatus === "Needs Review" || track.validationStatus === "Validation Failed"
      );
      const openGroups = groups.filter((group) => group.status !== "Not a Track" && group.status !== "Mapped \u2014 Draft");
      const resolvedGroups = groups.filter((group) => group.status === "Not a Track" || group.status === "Mapped \u2014 Draft");
      const zoomBy = (factor) => {
        setView((current) => {
          const w = Math.min(3200, Math.max(240, current.w * factor));
          const h = w * (current.h / current.w);
          return { x: current.x + (current.w - w) / 2, y: current.y + (current.h - h) / 2, w, h };
        });
      };
      const zoomToSegments = useCallback((segs) => {
        if (!segs.length) return;
        const points = segs.flatMap((seg) => [seg.start, seg.end]);
        const pad = 120;
        const x1 = Math.min(...points.map((p) => p[0])) - pad;
        const x2 = Math.max(...points.map((p) => p[0])) + pad;
        const y1 = Math.min(...points.map((p) => p[1])) - pad;
        const y2 = Math.max(...points.map((p) => p[1])) + pad;
        const w = Math.max(300, x2 - x1);
        const ratio = FIT_VIEW.h / FIT_VIEW.w;
        setView({ x: x1, y: y1 + (y2 - y1) / 2 - w * ratio / 2, w, h: w * ratio });
      }, []);
      const zoom = FIT_VIEW.w / view.w;
      const clearSelection = useCallback(() => setSelectedIds([]), []);
      const handleSegmentClick = (seg, event) => {
        if (seg.mappingStatus === "Not a Track") return;
        if (splitTarget) {
          if (seg.trackId !== splitTarget) return;
          setSplitAssignment((current) => ({ ...current, [seg.id]: (current[seg.id] || "A") === "A" ? "B" : "A" }));
          return;
        }
        if (event.altKey) {
          setSelectedIds((list) => list.filter((id) => id !== seg.id));
          return;
        }
        if (event.shiftKey) {
          setSelectedIds((list) => list.includes(seg.id) ? list.filter((id) => id !== seg.id) : [...list, seg.id]);
          return;
        }
        setSelectedIds([seg.id]);
        if (seg.trackId) {
          setSelectedTrackId(seg.trackId);
          setDetailOpen(true);
          const owner = trackById.get(seg.trackId);
          if (owner) {
            setActiveTab(
              owner.validationStatus === "Needs Review" || owner.validationStatus === "Validation Failed" ? "review" : "identified"
            );
          }
        } else {
          setActiveTab("unidentified");
          setDetailOpen(false);
        }
      };
      const handleMarquee = (ids, additive) => {
        const usable = ids.filter((id) => {
          const seg = segById.get(id);
          return seg && seg.mappingStatus !== "Not a Track";
        });
        setSelectedIds((list) => additive ? uniq([...list, ...usable]) : usable);
        if (usable.length) setActiveTab("unidentified");
      };
      const selectConnected = () => {
        if (!selectedIds.length) return;
        const pool = allSelectedUnidentified ? unmappedPool : selectableSegments;
        setSelectedIds(connectedTo(selectedIds, pool));
      };
      const selectPath = () => {
        if (selectedIds.length !== 2) return;
        const pool = selectableSegments;
        const trail = pathBetween(selectedIds[0], selectedIds[1], pool);
        if (trail.length) setSelectedIds(trail);
        else review.actions.toast("No connected path found between the two selected elements.", "danger");
      };
      const selectGroup = useCallback((groupId, { zoomTo = false } = {}) => {
        const group = groups.find((item) => item.id === groupId);
        if (!group) return;
        const usable = group.elementIds.filter((id) => {
          const seg = segById.get(id);
          return seg && seg.mappingStatus !== "Not a Track";
        });
        setSelectedIds(usable);
        setDetailOpen(false);
        setSelectedTrackId(null);
        if (zoomTo) zoomToSegments(usable.map((id) => segById.get(id)).filter(Boolean));
      }, [groups, segById, zoomToSegments]);
      const focusTrack = useCallback((trackId, { openDetail = true } = {}) => {
        const track = trackById.get(trackId);
        if (!track) return;
        setSelectedTrackId(trackId);
        setDetailOpen(openDetail);
        setSelectedIds([]);
        zoomToSegments(segments.filter((seg) => track.segmentIds.includes(seg.id)));
      }, [trackById, segments, zoomToSegments]);
      const startExtend = (trackId) => {
        setExtendTarget(trackId);
        setSelectedTrackId(trackId);
        setDetailOpen(false);
        setSelectedIds([]);
        setMode("select");
        setActiveTab("unidentified");
        const track = trackById.get(trackId);
        review.actions.toast(`Add Segments mode \u2014 select unidentified elements to add to ${track ? track.name || trackId : trackId}.`, "info");
      };
      const startSplit = (trackId) => {
        const track = trackById.get(trackId);
        if (!track) return;
        setSplitTarget(trackId);
        setSplitAssignment(Object.fromEntries(track.segmentIds.map((id, index) => [id, index === track.segmentIds.length - 1 ? "B" : "A"])));
        setSelectedTrackId(trackId);
        setSelectedIds([]);
        setDrawer("split");
        zoomToSegments(segments.filter((seg) => track.segmentIds.includes(seg.id)));
      };
      const exitModes = () => {
        setExtendTarget(null);
        setSplitTarget(null);
        setSplitAssignment({});
        setDrawer(null);
        setDialog(null);
      };
      const confirmMapping = (trackId) => {
        review.actions.mapToTrack(selectedIds, trackId);
        setSelectedIds([]);
        setDrawer(null);
      };
      const confirmAddToTrack = () => {
        if (!extendTarget || !selectedIds.length) return;
        const owned = segments.filter((seg) => (trackById.get(extendTarget) || { segmentIds: [] }).segmentIds.includes(seg.id));
        const { gaps } = analyseChain(owned.concat(selectedSegments));
        review.actions.mapToTrack(selectedIds, extendTarget);
        if (gaps.length) {
          review.actions.toast(`Added with a ${gaps[0].distance.toFixed(1)} m gap \u2014 review the validation panel.`, "info");
        }
        setSelectedIds([]);
        setExtendTarget(null);
      };
      const confirmCreate = (attributes, asDraft) => {
        const id = review.actions.createTrack(selectedIds, attributes, asDraft);
        setSelectedIds([]);
        setDrawer(null);
        setSelectedTrackId(id);
        setActiveTab("identified");
      };
      const confirmReject = (reason, remarks) => {
        review.actions.markNotATrack(selectedIds, reason, remarks);
        setSelectedIds([]);
        setDialog(null);
      };
      const confirmSplit = (payload) => {
        review.actions.splitTrack(splitTarget, splitAssignment, payload);
        exitModes();
        setActiveTab("identified");
      };
      const focusValidation = (item) => {
        if (item.trackId) focusTrack(item.trackId, { openDetail: true });
        else if (item.groupId) selectGroup(item.groupId, { zoomTo: true });
      };
      useEffect(() => {
        const onKey = (event) => {
          const tag = (event.target.tagName || "").toLowerCase();
          if (["input", "textarea", "select"].includes(tag) || event.target.isContentEditable) return;
          if (drawer || dialog) return;
          switch (event.key) {
            case "Escape":
              if (extendTarget || splitTarget) exitModes();
              else clearSelection();
              break;
            case "v":
            case "V":
              setMode("select");
              break;
            case "h":
            case "H":
              setMode("pan");
              break;
            case "r":
            case "R":
              setMode("rect");
              break;
            case "l":
            case "L":
              setMode("lasso");
              break;
            case "f":
            case "F":
              setView(FIT_VIEW);
              break;
            case "+":
            case "=":
              zoomBy(1 / 1.2);
              break;
            case "-":
            case "_":
              zoomBy(1.2);
              break;
            case "1":
              setActiveTab("identified");
              setDetailOpen(false);
              break;
            case "2":
              setActiveTab("review");
              setDetailOpen(false);
              break;
            case "3":
              setActiveTab("unidentified");
              setDetailOpen(false);
              break;
            case "Delete":
            case "Backspace":
              if (allSelectedUnidentified) {
                event.preventDefault();
                setDialog("reject");
              }
              break;
            default:
              break;
          }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, [drawer, dialog, extendTarget, splitTarget, allSelectedUnidentified, clearSelection]);
      const renderPanelBody = () => {
        if (detailOpen && selectedTrack) {
          return /* @__PURE__ */ React.createElement(
            TrackDetailPanel,
            {
              track: selectedTrack,
              segments,
              validations,
              onBack: () => setDetailOpen(false),
              onConfirm: review.actions.confirmTrack,
              onEdit: (id) => {
                setSelectedTrackId(id);
                setDrawer("edit");
              },
              onExtend: startExtend,
              onSplit: startSplit,
              onReplaceGeometry: (id) => {
                startExtend(id);
                review.actions.toast("Select the replacement geometry, then add it to the track.", "info");
              },
              onMarkIncorrect: review.actions.markAiIncorrect,
              onLocateSegment: (segId) => {
                const seg = segById.get(segId);
                if (seg) {
                  setSelectedIds([segId]);
                  zoomToSegments([seg]);
                }
              }
            }
          );
        }
        if (activeTab === "identified") {
          return /* @__PURE__ */ React.createElement("div", { className: "pt-panel-scroll" }, identifiedTracks.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-panel-empty" }, /* @__PURE__ */ React.createElement("strong", null, "No identified tracks"), /* @__PURE__ */ React.createElement("span", null, "Map or create tracks from the Unidentified tab.")), identifiedTracks.map((track) => /* @__PURE__ */ React.createElement(
            TrackListItem,
            {
              key: track.id,
              track,
              active: selectedTrackId === track.id,
              segmentCount: track.segmentIds.length,
              blocked: validations.some((item) => item.severity === "error" && item.trackId === track.id),
              onSelect: (id) => focusTrack(id, { openDetail: false }),
              onConfirm: review.actions.confirmTrack,
              onEdit: (id) => {
                setSelectedTrackId(id);
                setDrawer("edit");
              },
              onExtend: startExtend,
              onSplit: startSplit,
              onViewSource: (id) => focusTrack(id, { openDetail: true })
            }
          )));
        }
        if (activeTab === "review") {
          return /* @__PURE__ */ React.createElement("div", { className: "pt-panel-scroll" }, reviewTracks.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-panel-empty" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 22 }), /* @__PURE__ */ React.createElement("strong", null, "Nothing left to review"), /* @__PURE__ */ React.createElement("span", null, "All flagged tracks have been resolved.")), reviewTracks.map((track) => /* @__PURE__ */ React.createElement(
            NeedsReviewItem,
            {
              key: track.id,
              track,
              active: selectedTrackId === track.id,
              segmentCount: track.segmentIds.length,
              onSelect: (id) => focusTrack(id, { openDetail: false }),
              onReview: (id) => focusTrack(id, { openDetail: true }),
              onEdit: (id) => {
                setSelectedTrackId(id);
                setDrawer("edit");
              },
              onSplit: startSplit
            }
          )));
        }
        return /* @__PURE__ */ React.createElement("div", { className: "pt-panel-scroll" }, openGroups.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-panel-empty" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 22 }), /* @__PURE__ */ React.createElement("strong", null, "All elements resolved"), /* @__PURE__ */ React.createElement("span", null, "Every unidentified group has been mapped, converted or rejected.")), openGroups.map((group) => /* @__PURE__ */ React.createElement(
          UnidentifiedElementItem,
          {
            key: group.id,
            group,
            elements: group.elementIds.map((id) => segById.get(id)).filter(Boolean),
            nearestTrack: trackById.get(group.nearestTrackId),
            suggestedTrack: trackById.get(group.suggestedTrackId),
            active: group.elementIds.every((id) => selectedIds.includes(id)) && selectedIds.length > 0,
            onLocate: (id) => selectGroup(id, { zoomTo: true }),
            onSelectOnDrawing: (id) => selectGroup(id, { zoomTo: true }),
            onMap: (id) => {
              selectGroup(id);
              setDrawer("map");
            },
            onCreate: (id) => {
              selectGroup(id);
              setDrawer("create");
            },
            onReject: (id) => {
              selectGroup(id);
              setDialog("reject");
            },
            onReviewLater: (id) => review.actions.setGroupStatus(id, "Review Later")
          }
        )), resolvedGroups.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-section" }, /* @__PURE__ */ React.createElement("div", { className: "pt-section-label" }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 12 }), "Resolved (", resolvedGroups.length, ")"), resolvedGroups.map((group) => /* @__PURE__ */ React.createElement("div", { className: "pt-seg-row", key: group.id }, /* @__PURE__ */ React.createElement(Icon, { name: group.status === "Not a Track" ? "eye_off" : "link", size: 13 }), /* @__PURE__ */ React.createElement("strong", null, group.id), /* @__PURE__ */ React.createElement("span", null, group.label), /* @__PURE__ */ React.createElement("span", { className: "pt-seg-row-spacer" }), /* @__PURE__ */ React.createElement(Chip, { tone: group.status === "Not a Track" ? "neutral" : "info", size: "sm" }, group.status)))));
      };
      const modeNote = extendTarget ? `Add Segments \u2014 ${selectedIds.length} selected for ${(trackById.get(extendTarget) || {}).name || extendTarget}` : splitTarget ? `Split mode \u2014 click segments of ${splitTarget} to reassign` : null;
      return /* @__PURE__ */ React.createElement("div", { className: "pt-page" }, /* @__PURE__ */ React.createElement(
        AppTopBar,
        {
          crumbs: [
            { label: "Digital Library", onClick: onBack },
            `${station.name} Station`,
            doc.label,
            "PIM Review",
            "Tracks"
          ],
          searchPlaceholder: "Search tracks, elements, chainage\u2026"
        }
      ), /* @__PURE__ */ React.createElement(
        TrackReviewHeader,
        {
          station,
          document: doc,
          progress: stats,
          dirty: review.dirty,
          lastSavedAt: review.lastSavedAt,
          canComplete: review.canComplete,
          blockingCount: review.blockingCount,
          onBack,
          onSaveDraft: review.actions.saveDraft,
          onComplete: () => setDialog("complete"),
          onTogglePanel: () => setPanelOpen((open) => !open)
        }
      ), /* @__PURE__ */ React.createElement(ReviewProgressSummary, { stats }), /* @__PURE__ */ React.createElement("div", { className: "pt-body" }, /* @__PURE__ */ React.createElement("section", { className: "pt-canvas-col" }, /* @__PURE__ */ React.createElement(
        CanvasToolbar,
        {
          mode,
          onMode: setMode,
          zoom,
          onZoomIn: () => zoomBy(1 / 1.2),
          onZoomOut: () => zoomBy(1.2),
          onFit: () => setView(FIT_VIEW),
          onReset: () => {
            setView(FIT_VIEW);
            clearSelection();
            exitModes();
          },
          layers: D.LAYERS.map((layer) => ({ ...layer, visible: layerVisibility[layer.id] !== false })),
          onToggleLayer: (id) => setLayerVisibility((current) => ({ ...current, [id]: current[id] === false })),
          onAllLayers: (show) => setLayerVisibility(Object.fromEntries(D.LAYERS.map((layer) => [layer.id, show]))),
          layerOpen,
          onLayerOpen: setLayerOpen,
          modeNote
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "pt-stage" }, /* @__PURE__ */ React.createElement(
        ESPTrackCanvas,
        {
          segments,
          tracks,
          layerVisibility,
          view,
          onView: setView,
          mode,
          selectedIds,
          focusTrackId: splitTarget || (detailOpen ? selectedTrackId : null),
          splitAssignment: splitTarget ? splitAssignment : null,
          onSegmentClick: handleSegmentClick,
          onMarquee: handleMarquee,
          onBackgroundClick: (event) => {
            if (!event.shiftKey) clearSelection();
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "pt-legend", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "pt-legend-title" }, "Track states"), STATE_LEGEND.map((item) => /* @__PURE__ */ React.createElement("div", { className: "pt-legend-row", key: item.state }, /* @__PURE__ */ React.createElement(
        "span",
        {
          className: "pt-legend-swatch",
          style: { borderTopColor: item.color, borderTopStyle: item.dash === "dashed" ? "dashed" : item.dash === "dotted" ? "dotted" : "solid" }
        }
      ), item.label))), /* @__PURE__ */ React.createElement("div", { className: "pt-dock", role: "toolbar", "aria-label": "Canvas quick tools" }, /* @__PURE__ */ React.createElement(IconBtn, { icon: "cursor", label: "Select (V)", active: mode === "select", onClick: () => setMode("select") }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "hand", label: "Pan (H)", active: mode === "pan", onClick: () => setMode("pan") }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "select_rect", label: "Rectangle selection (R)", active: mode === "rect", onClick: () => setMode("rect") }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "lasso", label: "Lasso selection (L)", active: mode === "lasso", onClick: () => setMode("lasso") }), /* @__PURE__ */ React.createElement("div", { className: "pt-dock-divider" }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "zoom_in", label: "Zoom in (+)", onClick: () => zoomBy(1 / 1.2) }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "zoom_out", label: "Zoom out (\u2212)", onClick: () => zoomBy(1.2) }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "fit_screen", label: "Fit to screen (F)", onClick: () => setView(FIT_VIEW) }), /* @__PURE__ */ React.createElement("div", { className: "pt-dock-divider" }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "link", label: "Select connected segments", disabled: !selectedIds.length, onClick: selectConnected }), /* @__PURE__ */ React.createElement(IconBtn, { icon: "x", label: "Clear selection (Esc)", disabled: !selectedIds.length, onClick: clearSelection })), selectedIds.length > 0 && !splitTarget && /* @__PURE__ */ React.createElement(
        SelectionActionBar,
        {
          count: selectedIds.length,
          totalLength: selectedSegments.reduce((sum, seg) => sum + (seg.length || 0), 0),
          allUnidentified: allSelectedUnidentified,
          selectedTrack: extendTarget ? trackById.get(extendTarget) : null,
          mode: extendTarget ? "extend" : "select",
          onMapExisting: () => setDrawer("map"),
          onCreateTrack: () => setDrawer("create"),
          onAddToTrack: confirmAddToTrack,
          onNotATrack: () => setDialog("reject"),
          onClear: clearSelection,
          onSelectConnected: selectConnected,
          onSelectPath: selectPath,
          canSelectPath: selectedIds.length === 2
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "pt-statusbar" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, station.name), " \xB7 ", station.code, " \xB7 ", doc.label), /* @__PURE__ */ React.createElement("span", null, "Yard ", station.yardLimitStart, " \u2192 ", station.yardLimitEnd), /* @__PURE__ */ React.createElement("span", null, "Zoom ", /* @__PURE__ */ React.createElement("strong", null, Math.round(zoom * 100), "%")), /* @__PURE__ */ React.createElement("span", null, "Selection ", /* @__PURE__ */ React.createElement("strong", null, selectedIds.length)), /* @__PURE__ */ React.createElement("span", null, "Elements ", /* @__PURE__ */ React.createElement("strong", null, segments.length)), /* @__PURE__ */ React.createElement("span", { className: "pt-statusbar-spacer" }), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "V"), " select ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "H"), " pan ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "R"), " rect ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "L"), " lasso ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "F"), " fit ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "Shift"), " add ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "Alt"), " remove ", /* @__PURE__ */ React.createElement("span", { className: "pt-kbd" }, "Esc"), " clear"))), /* @__PURE__ */ React.createElement("aside", { className: "pt-panel", "data-open": panelOpen ? "true" : "false", "aria-label": "Track review panel" }, /* @__PURE__ */ React.createElement("div", { className: "pt-panel-head" }, /* @__PURE__ */ React.createElement(
        TrackTabs,
        {
          active: activeTab,
          onChange: (tab) => {
            setActiveTab(tab);
            setDetailOpen(false);
          },
          counts: {
            identified: identifiedTracks.length,
            review: reviewTracks.length,
            unidentified: openGroups.length
          }
        }
      )), renderPanelBody(), /* @__PURE__ */ React.createElement(
        ValidationSummary,
        {
          validations,
          acknowledged,
          open: validationOpen,
          onToggle: () => setValidationOpen((open) => !open),
          onAcknowledge: review.actions.acknowledgeWarning,
          onFocus: focusValidation
        }
      ))), /* @__PURE__ */ React.createElement(
        MappingDrawer,
        {
          key: `map-${selectedIds.join("-")}`,
          open: drawer === "map",
          elements: selectedSegments,
          tracks,
          segments,
          onClose: () => setDrawer(null),
          onConfirm: confirmMapping,
          onRemoveElement: (id) => setSelectedIds((list) => list.filter((item) => item !== id))
        }
      ), /* @__PURE__ */ React.createElement(
        CreateTrackDrawer,
        {
          key: `create-${selectedIds.join("-")}`,
          open: drawer === "create",
          elements: selectedSegments,
          tracks,
          segments,
          nextId: review.nextTrackId,
          onClose: () => setDrawer(null),
          onCreate: (value) => confirmCreate(value, false),
          onSaveDraft: (value) => confirmCreate(value, true),
          onRemoveElement: (id) => setSelectedIds((list) => list.filter((item) => item !== id))
        }
      ), /* @__PURE__ */ React.createElement(
        EditTrackDrawer,
        {
          key: `edit-${selectedTrackId}`,
          open: drawer === "edit",
          track: selectedTrack,
          tracks,
          segments,
          onClose: () => setDrawer(null),
          onSave: (id, value) => {
            review.actions.saveAttributes(id, value);
            setDrawer(null);
          }
        }
      ), /* @__PURE__ */ React.createElement(
        SplitTrackDrawer,
        {
          key: `split-${splitTarget}`,
          open: drawer === "split",
          track: splitTarget ? trackById.get(splitTarget) : null,
          segments,
          tracks,
          assignment: splitAssignment,
          onAssign: (segId, side) => setSplitAssignment((current) => ({ ...current, [segId]: side })),
          onClose: exitModes,
          onConfirm: confirmSplit
        }
      ), /* @__PURE__ */ React.createElement(
        NotTrackDialog,
        {
          open: dialog === "reject",
          elements: selectedSegments,
          onClose: () => setDialog(null),
          onConfirm: confirmReject
        }
      ), /* @__PURE__ */ React.createElement(
        ReviewCompletionDialog,
        {
          open: dialog === "complete",
          stats,
          validations,
          onClose: () => setDialog(null),
          onConfirm: () => {
            setDialog(null);
            review.actions.logAudit({ action: "Completed track review", detail: `${stats.validated} tracks validated` });
            review.actions.toast("Track review completed. Platforms review is now unlocked.");
            if (onComplete) onComplete({ tracks, segments, mappings: review.mappings });
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "pt-toast-wrap", role: "status", "aria-live": "polite" }, review.toasts.map((item) => /* @__PURE__ */ React.createElement("div", { className: "pt-toast", "data-tone": item.tone, key: item.id }, /* @__PURE__ */ React.createElement(Icon, { name: item.tone === "danger" ? "alert" : item.tone === "info" ? "info" : "check_circle", size: 15 }), item.message))));
    };
    window.PIMTracksPage = PIMTracksPage;
    const ptStyleEl = document.createElement("style");
    ptStyleEl.textContent = ptCSS;
    document.head.appendChild(ptStyleEl);
  })();
})();
