const { useState: useStateD, useEffect: useEffectD, useRef: useRefD, useMemo: useMemoD } = React;
const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "theme": "light",
    "density": "regular",
    "accent": "stripe"
  }
);
const IRSidebar = ({ active = "home", onSelect }) => {
  const groups = [
    { items: [{ id: "home", icon: "home", label: "Home" }] },
    {
      label: "Manage",
      items: [
        { id: "library", icon: "book", label: "Digital Library", badge: "247" },
        { id: "workspace", icon: "layers", label: "Workspace", badge: "9", badgeTone: "accent" }
      ]
    },
    {
      label: "Review",
      items: [
        { id: "approvals", icon: "file_check", label: "Approvals", badge: "5", badgeTone: "danger" }
      ]
    },
    {
      label: "System",
      items: [
        { id: "help", icon: "info", label: "Help" },
        { id: "settings", icon: "settings", label: "Settings" }
      ]
    }
  ];
  return /* @__PURE__ */ React.createElement("aside", { className: "ds-sidebar" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-brand" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-mark" }, /* @__PURE__ */ React.createElement("span", null, "IR")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-title" }, "Indian Railways"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-sub" }))), /* @__PURE__ */ React.createElement("nav", { className: "ds-sidebar-nav", style: { paddingTop: 16 } }, groups.map(
    (g, gi) => /* @__PURE__ */ React.createElement("div", { key: gi }, g.label && /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-section" }, g.label), g.items.map(
      (it) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: it.id,
          className: "ds-sidebar-item",
          "data-active": active === it.id,
          onClick: () => onSelect && onSelect(it.id)
        },
        /* @__PURE__ */ React.createElement(Icon, { name: it.icon }),
        /* @__PURE__ */ React.createElement("span", null, it.label),
        it.badge && /* @__PURE__ */ React.createElement("span", { className: "ds-sidebar-badge", "data-tone": it.badgeTone }, it.badge)
      )
    ))
  )), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-foot" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-user", style: { background: "linear-gradient(135deg, oklch(0.6 0.13 240), oklch(0.5 0.14 250))" } }, "AV"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-userinfo" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-username" }, "Ashwini Vaishnav"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-userrole" }, "Railway Minister")), /* @__PURE__ */ React.createElement("button", { className: "ds-sidebar-foot-btn", title: "Settings" }, /* @__PURE__ */ React.createElement(Icon, { name: "settings", size: 15 }))));
};
const dashCSS = `
.ds-sidebar-badge[data-tone="danger"] { background: var(--danger-soft); color: var(--danger-text); }
.ds-sidebar-item[data-active="true"] .ds-sidebar-badge[data-tone="danger"] { background: var(--danger); color: var(--paper); }
.ds-sidebar-item[data-active="true"] .ds-sidebar-badge[data-tone="accent"] { background: var(--accent); color: var(--paper); }
.ds-sidebar .ds-sidebar-badge[data-tone="danger"] { background: rgba(223,27,65,0.20); color: #fff; }
.ds-sidebar .ds-sidebar-badge[data-tone="accent"] { background: rgba(99,91,255,0.25); color: #fff; }
.ds-sidebar-item[data-active="true"] .ds-sidebar-badge[data-tone="danger"],
.ds-sidebar-item[data-active="true"] .ds-sidebar-badge[data-tone="accent"] { color: var(--paper); }

/* \u2500\u2500\u2500\u2500 App shell \u2500\u2500\u2500\u2500 */
.ir-app { display: grid; grid-template-columns: 244px 1fr; height: 100vh; overflow: hidden; background: var(--canvas); }
.ir-app .ds-sidebar { height: 100vh; overflow-y: auto; flex-shrink: 0; }
.ir-main { display: flex; flex-direction: column; height: 100vh; overflow: hidden; min-width: 0; }
.ir-main-embedded { flex: 1; width: 100%; background: var(--canvas); }

/* \u2500\u2500\u2500\u2500 Top filter bar (redesigned) \u2500\u2500\u2500\u2500 */
.ir-topbar { background: var(--paper); border-bottom: none; display: flex; flex-direction: column; flex-shrink: 0; }
.ir-topbar-titlerow { display: flex; align-items: center; gap: 16px; padding: 22px 28px 20px; background: linear-gradient(135deg, var(--accent-soft) 0%, var(--paper) 100%); box-shadow: 0 3px 0 var(--accent), 0 4px 20px rgba(14,27,44,.07); }
.ir-topbar-icon-badge { width: 42px; height: 42px; border-radius: 12px; background: var(--accent-soft); color: var(--accent-text); display: grid; place-items: center; flex-shrink: 0; border: 1px solid rgba(55,55,200,.14); }
.ir-topbar-title { font-size: 28px; font-weight: 800; color: var(--ink-900); letter-spacing: -0.5px; line-height: 1.1; }
.ir-topbar-sub { font-size: 13px; color: var(--ink-500); margin-top: 5px; display: flex; align-items: center; gap: 7px; }
.ir-topbar-sep { color: var(--ink-300); font-size: 11px; }
.ir-topbar-sync { display: inline-flex; align-items: center; gap: 5px; }
.ir-sync-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); flex-shrink: 0; }
.ir-topbar-spacer { flex: 1; }

/* \u2500\u2500\u2500\u2500 Filter panel card \u2500\u2500\u2500\u2500 */
.ir-filter-panel { margin: 0 28px 14px; background: var(--ink-50); border: var(--hairline); border-radius: var(--r-lg); padding: 10px 16px; display: flex; align-items: center; gap: 0; }
.ir-fp-section { display: flex; flex-direction: column; gap: 7px; }
.ir-fp-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-400); }
.ir-fp-divider { width: 1px; align-self: stretch; background: var(--ink-200); margin: 0 20px; flex-shrink: 0; }
.ir-fp-chips { display: flex; align-items: center; gap: 4px; }

/* Scope chips */
.ir-fp-chip-wrap { position: relative; }
.ir-scope-chip { display: inline-flex; align-items: center; gap: 5px; height: 32px; padding: 0 10px 0 12px; border-radius: var(--r-md); border: var(--hairline); background: var(--paper); font-size: 13px; font-weight: 600; color: var(--ink-900); cursor: pointer; white-space: nowrap; transition: border-color 120ms, background 120ms, box-shadow 120ms; font-family: inherit; }
.ir-scope-chip:hover { border-color: var(--ink-300); box-shadow: var(--shadow-xs); }
.ir-scope-chip[data-active="true"] { border-color: var(--ink-400); background: var(--ink-100); }
.ir-scope-arrow { color: var(--ink-300); font-size: 15px; line-height: 1; margin: 0 2px; user-select: none; }
.ir-scope-pop { position: absolute; top: calc(100% + 6px); left: 0; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); box-shadow: var(--shadow-lg); z-index: 50; min-width: 210px; padding: 5px; animation: irPop 140ms cubic-bezier(0.2,0.8,0.2,1); transform-origin: top left; }
.ir-scope-pop-item { display: block; width: 100%; text-align: left; padding: 8px 10px; border-radius: var(--r-sm); border: none; background: transparent; font-size: 13px; font-family: inherit; color: var(--ink-700); cursor: pointer; font-weight: 500; transition: background 80ms, color 80ms; }
.ir-scope-pop-item:hover { background: var(--ink-50); color: var(--ink-900); }
.ir-scope-pop-item[data-active="true"] { background: var(--accent); color: var(--paper); font-weight: 700; }

/* Time pills */
.ir-time-pill { display: inline-flex; align-items: center; gap: 5px; height: 32px; padding: 0 13px; border-radius: var(--r-full); border: 1px solid transparent; background: transparent; font-size: 13px; font-weight: 500; color: var(--ink-600); cursor: pointer; white-space: nowrap; transition: background 120ms, color 120ms, border-color 120ms, box-shadow 120ms; font-family: inherit; }
.ir-time-pill:hover { background: var(--paper); color: var(--ink-900); border-color: var(--ink-200); box-shadow: var(--shadow-xs); }
.ir-time-pill[data-active="true"] { background: var(--accent); color: var(--paper); border-color: var(--accent); font-weight: 700; box-shadow: 0 6px 12px -8px rgba(99,91,255,0.75); }

/* Filter actions */
.ir-fp-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ir-fp-reset { padding: 0 11px; height: 30px; border-radius: var(--r-md); border: var(--hairline); background: transparent; font-size: 12px; font-family: inherit; color: var(--ink-500); cursor: pointer; font-weight: 500; transition: background 120ms, color 120ms, border-color 120ms; white-space: nowrap; }
.ir-fp-reset:hover { background: var(--ink-100); color: var(--ink-800); border-color: var(--ink-300); }
.ir-fp-refresh { width: 30px; height: 30px; border-radius: var(--r-md); border: var(--hairline); background: transparent; color: var(--ink-400); cursor: pointer; display: grid; place-items: center; transition: background 120ms, color 120ms, border-color 120ms; }
.ir-fp-refresh:hover { background: var(--ink-100); color: var(--ink-800); border-color: var(--ink-300); }

/* Keep .ir-filter for legacy FilterButton usage */
.ir-filter { height: 34px; padding: 0 30px 0 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); font-size: 13px; color: var(--ink-900); font-weight: 600; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>"); background-repeat: no-repeat; background-position: right 8px center; background-size: 14px; transition: 120ms; }
.ir-filter:hover { border-color: var(--ink-300); background-color: var(--ink-50); }
.ir-filter:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }

/* \u2500\u2500\u2500\u2500 Content scroll \u2500\u2500\u2500\u2500 */
.ir-content { flex: 1; overflow-y: auto; padding: 24px 28px 56px; display: flex; flex-direction: column; gap: 22px; }

/* \u2500\u2500\u2500\u2500 KPI variant with left accent \u2500\u2500\u2500\u2500 */
.ir-kpis { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px; }
.ir-kpi { position: relative; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 18px 18px 16px 22px; display: flex; flex-direction: column; gap: 4px; cursor: pointer; transition: 150ms; overflow: hidden; }
.ir-kpi::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--kpi-accent, var(--ink-300)); }
.ir-kpi:hover { box-shadow: var(--shadow-sm); border-color: var(--ink-300); transform: translateY(-1px); }
.ir-kpi[data-selected="true"] { background: var(--accent-soft); border-color: var(--accent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 34%, transparent), var(--shadow-md); }
.ir-kpi-head { display: flex; align-items: center; gap: 7px; color: var(--ink-500); font-size: 12px; font-weight: 600; letter-spacing: -0.005em; }
.ir-kpi-head .icon { color: var(--ink-400); }
.ir-kpi-value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; font-variant-numeric: tabular-nums; margin-top: 6px; color: var(--ink-900); }
.ir-kpi-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; }
.ir-kpi-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.ir-kpi-delta[data-dir="up"] { color: var(--success-text); }
.ir-kpi-delta[data-dir="down"] { color: var(--danger-text); }
.ir-kpi-meta { font-size: 11.5px; color: var(--ink-500); }

/* \u2500\u2500\u2500\u2500 Generic card \u2500\u2500\u2500\u2500 */
.ir-card { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); overflow: hidden; display: flex; flex-direction: column; }
.ir-card-head { padding: 14px 18px; border-bottom: var(--hairline); display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.ir-card-head-title { font-size: 14px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.01em; }
.ir-card-head-sub { font-size: 12px; color: var(--ink-500); margin-top: 1px; }
.ir-card-foot { padding: 10px 16px; border-top: var(--hairline); background: var(--ink-50); display: flex; align-items: center; justify-content: space-between; }
.ir-card-foot-meta { font-size: 11px; color: var(--ink-400); }
.ir-link { font-size: 11.5px; color: var(--accent-text); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; background: none; border: none; padding: 0; font-family: inherit; }
.ir-link:hover { text-decoration: underline; }

/* \u2500\u2500\u2500\u2500 Two-col + three-col grids \u2500\u2500\u2500\u2500 */
.ir-grid-2 { display: grid; grid-template-columns: minmax(0, 1fr) 440px; gap: 20px; }
.ir-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }

/* \u2500\u2500\u2500\u2500 Lifecycle funnel \u2500\u2500\u2500\u2500 */
.ir-funnel { padding: 6px 8px; }
.ir-funnel-row { display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: var(--r-md); cursor: pointer; transition: background 120ms; }
.ir-funnel-row:hover { background: var(--ink-50); }
.ir-funnel-bar { width: 4px; height: 30px; border-radius: 2px; background: var(--stage-color, var(--ink-300)); flex-shrink: 0; }
.ir-funnel-name { font-size: 13.5px; font-weight: 600; color: var(--ink-900); letter-spacing: -0.005em; }
.ir-funnel-desc { font-size: 11.5px; color: var(--ink-500); margin-top: 1px; }
.ir-funnel-count { font-size: 19px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--stage-color, var(--ink-700)); letter-spacing: -0.02em; }
.ir-funnel-dist { display: flex; height: 8px; border-radius: 99px; overflow: hidden; margin: 18px 12px 14px; background: var(--ink-100); }
.ir-funnel-legend { display: flex; flex-wrap: wrap; gap: 14px 18px; padding: 0 12px 18px; }
.ir-funnel-legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--ink-600); }
.ir-funnel-legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.ir-funnel-legend-count { color: var(--ink-900); font-weight: 700; font-variant-numeric: tabular-nums; margin-left: 2px; }

/* \u2500\u2500\u2500\u2500 Activity feed \u2500\u2500\u2500\u2500 */
.ir-activity { max-height: 380px; overflow-y: auto; }
.ir-activity-day { position: sticky; top: 0; z-index: 1; background: var(--ink-50); padding: 7px 16px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-500); border-bottom: var(--hairline); }
.ir-activity-day:not(:first-of-type) { border-top: var(--hairline); }
.ir-activity-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 16px; border-bottom: var(--hairline); cursor: pointer; transition: background 120ms; }
.ir-activity-row:hover { background: var(--ink-50); }
.ir-doc-badge { width: 32px; height: 20px; border-radius: var(--r-xs); font-family: var(--font-mono); font-size: 9px; font-weight: 800; display: grid; place-items: center; flex-shrink: 0; margin-top: 2px; letter-spacing: 0.03em; }
.ir-doc-badge[data-type="ESP"] { background: var(--info-soft); color: var(--info-text); }
.ir-doc-badge[data-type="SIP"] { background: var(--accent-soft); color: var(--accent-text); }
.ir-doc-badge[data-type="LOP"] { background: var(--warning-soft); color: var(--warning-text); }
.ir-doc-badge[data-type="TOC"] { background: var(--success-soft); color: var(--success-text); }
.ir-doc-badge[data-type="LIB"] { background: var(--ink-100); color: var(--ink-600); }
.ir-activity-body { flex: 1; min-width: 0; }
.ir-activity-action { font-size: 13px; font-weight: 600; color: var(--ink-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ir-activity-station { font-size: 11px; color: var(--ink-600); margin-top: 2px; display: flex; align-items: center; gap: 6px; }
.ir-station-code { font-family: var(--font-mono); font-size: 10px; color: var(--ink-500); background: var(--ink-100); padding: 0 5px; border-radius: var(--r-xs); font-weight: 600; }
.ir-activity-prog { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.ir-activity-prog-bar { width: 60px; height: 4px; background: var(--ink-200); border-radius: 2px; overflow: hidden; }
.ir-activity-prog-bar > div { height: 100%; background: var(--accent); border-radius: 2px; }
.ir-activity-prog-label { font-size: 10px; color: var(--ink-500); font-variant-numeric: tabular-nums; }
.ir-activity-row:hover .ir-activity-resume { display: inline-flex; }
.ir-activity-row:hover .ir-activity-prog-bar, .ir-activity-row:hover .ir-activity-prog-label { display: none; }
.ir-activity-resume { display: none; align-items: center; gap: 2px; font-size: 10px; color: var(--accent-text); font-weight: 700; }
.ir-activity-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
.ir-activity-time { font-size: 10px; color: var(--ink-400); font-variant-numeric: tabular-nums; font-weight: 600; }

/* \u2500\u2500\u2500\u2500 Approval / Discrepancy / Overdue rows \u2500\u2500\u2500\u2500 */
.ir-list-row { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: var(--hairline); cursor: pointer; transition: background 120ms; }
.ir-list-row:hover { background: var(--ink-50); }
.ir-list-row:last-child { border-bottom: none; }
.ir-doc-badge-lg { width: 30px; height: 22px; }
.ir-list-name { font-size: 12.5px; font-weight: 600; color: var(--ink-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ir-list-meta { font-size: 10.5px; color: var(--ink-500); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ir-list-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.ir-list-age { font-size: 10.5px; color: var(--ink-400); font-weight: 700; font-variant-numeric: tabular-nums; }

/* discrepancy count badge */
.ir-disc-count { width: 32px; height: 26px; border-radius: var(--r-sm); display: grid; place-items: center; font-size: 12px; font-weight: 700; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.ir-disc-count[data-tone="danger"] { background: var(--danger-soft); color: var(--danger-text); }
.ir-disc-count[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.ir-disc-doctype { font-size: 10.5px; font-weight: 700; color: var(--ink-600); letter-spacing: 0.03em; font-family: var(--font-mono); }

/* overdue */
.ir-od-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ir-od-days { font-size: 12px; font-weight: 800; color: var(--danger-text); font-variant-numeric: tabular-nums; }

/* \u2500\u2500\u2500\u2500 Division progress table \u2500\u2500\u2500\u2500 */
.ir-divtable { width: 100%; border-collapse: collapse; font-size: 13px; }
.ir-divtable thead th { background: var(--ink-50); padding: 11px 20px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-500); font-weight: 700; border-bottom: var(--hairline); }
.ir-divtable tbody td { padding: 14px 20px; border-bottom: var(--hairline); vertical-align: middle; }
.ir-divtable tbody tr { cursor: pointer; transition: background 120ms; }
.ir-divtable tbody tr:hover { background: var(--ink-50); }
.ir-divtable tbody tr:last-child td { border-bottom: none; }
.ir-div-name { font-size: 13.5px; font-weight: 600; color: var(--ink-900); }
.ir-div-sub { font-size: 10.5px; color: var(--ink-400); margin-top: 2px; }
.ir-pbar { display: flex; align-items: center; gap: 8px; }
.ir-pbar-track { width: 80px; height: 6px; background: var(--ink-200); border-radius: 99px; overflow: hidden; flex-shrink: 0; }
.ir-pbar-fill { height: 100%; border-radius: 99px; transition: width 300ms; }
.ir-pbar-pct { font-size: 11.5px; font-weight: 700; color: var(--ink-900); min-width: 32px; text-align: right; font-variant-numeric: tabular-nums; }
.ir-overall { font-size: 13.5px; font-weight: 700; font-variant-numeric: tabular-nums; }

/* spark for KPI 6 */
.ir-spark { height: 24px; width: 70px; }
.ir-spark path { fill: none; stroke: var(--accent); stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.ir-spark .area { fill: var(--accent-soft); stroke: none; opacity: 0.7; }

/* \u2500\u2500\u2500\u2500 Popovers (filter + date) \u2500\u2500\u2500\u2500 */
.ir-pop-anchor { position: relative; display: inline-block; }
.ir-pop { position: absolute; top: calc(100% + 8px); right: 0; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); box-shadow: var(--shadow-lg); z-index: 50; min-width: 280px; animation: irPop 140ms cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: top right; }
@keyframes irPop { from { opacity: 0; transform: translateY(-4px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.ir-pop-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: var(--hairline); }
.ir-pop-title { font-size: 13px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.01em; }
.ir-pop-spacer { flex: 1; }
.ir-pop-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
.ir-pop-foot { padding: 10px 14px; border-top: var(--hairline); background: var(--ink-50); display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ir-pop-row { display: flex; flex-direction: column; gap: 4px; }
.ir-pop-row-label { font-size: 11px; font-weight: 600; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.04em; }

/* Compact filter trigger */
.ir-filter-trigger { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); font-size: 13px; color: var(--ink-900); font-weight: 600; cursor: pointer; transition: 120ms; position: relative; }
.ir-filter-trigger:hover { background: var(--ink-50); border-color: var(--ink-300); }
.ir-filter-trigger[data-active="true"] { background: var(--ink-50); border-color: var(--ink-300); }
.ir-filter-trigger-count { display: inline-grid; place-items: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 99px; background: var(--accent); color: var(--paper); font-size: 10.5px; font-weight: 800; font-variant-numeric: tabular-nums; margin-left: 2px; }
.ir-filter-summary { display: flex; align-items: center; gap: 6px; color: var(--ink-500); font-weight: 500; font-size: 12px; margin-left: 8px; }
.ir-filter-summary-chip { padding: 1px 7px; border-radius: var(--r-full); background: var(--ink-100); color: var(--ink-700); font-weight: 600; font-size: 11.5px; }

/* \u2500\u2500\u2500\u2500 Date range picker \u2500\u2500\u2500\u2500 */
.ir-dr-pop { min-width: 540px; }
.ir-dr-body { display: grid; grid-template-columns: 140px 1fr; gap: 0; padding: 0; }
.ir-dr-presets { border-right: var(--hairline); padding: 10px 8px; display: flex; flex-direction: column; gap: 1px; background: var(--ink-50); }
.ir-dr-preset { text-align: left; background: transparent; border: none; padding: 7px 10px; font-size: 12.5px; font-weight: 500; color: var(--ink-700); border-radius: var(--r-sm); cursor: pointer; font-family: inherit; transition: 80ms; }
.ir-dr-preset:hover { background: var(--ink-100); color: var(--ink-900); }
.ir-dr-preset[data-active="true"] { background: var(--accent); color: var(--paper); font-weight: 700; }
.ir-dr-cal-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.ir-dr-cal { padding: 12px; border-right: var(--hairline); }
.ir-dr-cal:last-child { border-right: none; }
.ir-dr-cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.ir-dr-cal-title { font-size: 12.5px; font-weight: 700; color: var(--ink-900); letter-spacing: -0.005em; }
.ir-dr-cal-nav { width: 22px; height: 22px; border-radius: var(--r-sm); border: none; background: transparent; color: var(--ink-500); cursor: pointer; display: grid; place-items: center; }
.ir-dr-cal-nav:hover { background: var(--ink-100); color: var(--ink-900); }
.ir-dr-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.ir-dr-cal-dow { font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; text-align: center; padding: 4px 0; }
.ir-dr-cal-day { position: relative; height: 28px; display: grid; place-items: center; font-size: 12px; font-variant-numeric: tabular-nums; color: var(--ink-800); cursor: pointer; border-radius: var(--r-sm); font-weight: 500; user-select: none; }
.ir-dr-cal-day[data-mute="true"] { color: var(--ink-300); }
.ir-dr-cal-day:hover:not([data-mute="true"]) { background: var(--ink-100); }
.ir-dr-cal-day[data-in-range="true"] { background: var(--accent-soft); border-radius: 0; color: var(--accent-text); }
.ir-dr-cal-day[data-edge="start"], .ir-dr-cal-day[data-edge="end"] { background: var(--accent); color: var(--paper); border-radius: var(--r-sm); font-weight: 700; z-index: 1; }
.ir-dr-cal-day[data-edge="start"][data-in-range="true"] { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.ir-dr-cal-day[data-edge="end"][data-in-range="true"] { border-top-left-radius: 0; border-bottom-left-radius: 0; }
.ir-dr-cal-day[data-today="true"]:not([data-edge]) { box-shadow: inset 0 0 0 1.5px var(--accent); }
.ir-dr-range-display { padding: 10px 14px; border-top: var(--hairline); background: var(--ink-50); font-size: 12px; color: var(--ink-700); display: flex; align-items: center; gap: 8px; }
.ir-dr-range-display .mono { font-family: var(--font-mono); font-weight: 600; color: var(--ink-900); font-size: 12px; }
.ir-dr-range-display .sep { color: var(--ink-400); }

/* Date trigger compact */
.ir-date-trigger { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); font-size: 13px; color: var(--ink-900); font-weight: 600; cursor: pointer; transition: 120ms; font-variant-numeric: tabular-nums; }
.ir-date-trigger:hover { background: var(--ink-50); border-color: var(--ink-300); }
.ir-date-trigger[data-active="true"] { background: var(--ink-50); border-color: var(--ink-300); }
.ir-date-trigger .ir-date-text { color: var(--ink-800); }

/* \u2500\u2500\u2500\u2500 Density \u2500\u2500\u2500\u2500 */
.ir-app[data-density="dense"] .ir-kpi { padding: 12px 12px 10px 16px; }
.ir-app[data-density="dense"] .ir-kpi-value { font-size: 22px; margin-top: 3px; }
.ir-app[data-density="dense"] .ir-content { gap: 14px; padding: 16px 22px 40px; }
.ir-app[data-density="dense"] .ir-card-head { padding: 9px 14px; }
.ir-app[data-density="dense"] .ir-list-row { padding: 7px 12px; }
.ir-app[data-density="dense"] .ir-funnel-row { padding: 6px 8px; }
.ir-app[data-density="dense"] .ir-divtable tbody td { padding: 9px 16px; }
.ir-app[data-density="dense"] .ir-topbar-titlerow { padding: 10px 22px 7px; }
.ir-app[data-density="dense"] .ir-filter-panel { margin: 0 22px 10px; padding: 8px 14px; }
.ir-app[data-density="dense"] .ir-activity-row { padding: 8px 14px; }

.ir-app[data-density="spacious"] .ir-kpi { padding: 24px 22px 20px 26px; }
.ir-app[data-density="spacious"] .ir-kpi-value { font-size: 34px; margin-top: 8px; }
.ir-app[data-density="spacious"] .ir-content { gap: 28px; padding: 32px 36px 72px; }
.ir-app[data-density="spacious"] .ir-card-head { padding: 18px 22px; }
.ir-app[data-density="spacious"] .ir-list-row { padding: 14px 20px; }
.ir-app[data-density="spacious"] .ir-funnel-row { padding: 14px 16px; }
.ir-app[data-density="spacious"] .ir-divtable tbody td { padding: 18px 24px; }
.ir-app[data-density="spacious"] .ir-topbar-titlerow { padding: 18px 36px 14px; }
.ir-app[data-density="spacious"] .ir-filter-panel { margin: 0 36px 18px; padding: 13px 20px; }
.ir-app[data-density="spacious"] .ir-kpis { gap: 18px; }
.ir-app[data-density="spacious"] .ir-grid-2, .ir-app[data-density="spacious"] .ir-grid-3 { gap: 24px; }

/* \u2500\u2500\u2500\u2500 Night theme \u2500\u2500\u2500\u2500 */
.ir-app[data-theme="night"] {
  --canvas: #0D1520;
  --paper: #14202E;
  --ink-900: #EEF3F8;
  --ink-800: #CDD8E4;
  --ink-700: #A4B5C4;
  --ink-600: #7A8F9F;
  --ink-500: #546070;
  --ink-400: #3A4E5E;
  --ink-300: #273646;
  --ink-200: #1C2C3C;
  --ink-100: #172336;
  --ink-50: #111C2C;
  --hairline: 1px solid var(--ink-200);
  --shadow-xs: 0 1px 0 rgba(0,0,0,0.3);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(0,0,0,0.3);
  --shadow-md: 0 4px 14px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
  --shadow-lg: 0 20px 40px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4);
  --shadow-focus: 0 0 0 3px rgba(99,91,255,0.30);
}
.ir-app[data-theme="night"] .ds-sidebar { background: var(--sidebar-bg); border-color: rgba(255,255,255,0.10); }
.ir-app[data-theme="night"] .ds-sidebar-mark { background: var(--accent); }
.ir-app[data-theme="night"] .ds-sidebar-item { color: var(--ink-700); }
.ir-app[data-theme="night"] .ds-sidebar-item:hover { background: rgba(255,255,255,0.12); color: var(--paper); }
.ir-app[data-theme="night"] .ds-sidebar-item[data-active="true"] { background: var(--paper); color: var(--stripe-blue-900); border-left: 0; border-radius: var(--r-md); }
.ir-app[data-theme="night"] .ds-sidebar-item[data-active="true"] .icon { color: var(--accent); }
.ir-app[data-theme="night"] .ds-sidebar-foot { border-color: rgba(255,255,255,0.10); background: rgba(0,0,0,0.16); }
.ir-app[data-theme="night"] .ir-filter-trigger, .ir-app[data-theme="night"] .ir-date-trigger, .ir-app[data-theme="night"] .ir-filter { background: var(--ink-100); color: var(--ink-900); }
.ir-app[data-theme="night"] .ir-filter-panel { background: var(--ink-50); border-color: var(--ink-200); }
.ir-app[data-theme="night"] .ir-scope-chip { background: var(--ink-100); border-color: var(--ink-200); }
.ir-app[data-theme="night"] .ir-scope-chip:hover { background: var(--ink-200); }
.ir-app[data-theme="night"] .ir-scope-pop { background: var(--ink-50); border-color: var(--ink-200); }
.ir-app[data-theme="night"] .ir-scope-pop-item[data-active="true"] { background: var(--ink-300); color: var(--ink-900); }
.ir-app[data-theme="night"] .ir-time-pill[data-active="true"] { background: var(--ink-700); border-color: var(--ink-700); }
.ir-app[data-theme="night"] .ir-fp-reset, .ir-app[data-theme="night"] .ir-fp-refresh { border-color: var(--ink-200); color: var(--ink-600); }
.ir-app[data-theme="night"] .ir-fp-reset:hover, .ir-app[data-theme="night"] .ir-fp-refresh:hover { background: var(--ink-100); color: var(--ink-900); }
.ir-app[data-theme="night"] .ir-pop, .ir-app[data-theme="night"] .ir-dr-pop { background: var(--ink-50); }
.ir-app[data-theme="night"] .ir-dr-presets { background: var(--canvas); }
.ir-app[data-theme="night"] .ds-btn[data-variant="secondary"] { background: var(--ink-100); color: var(--ink-800); border-color: var(--ink-200); }
.ir-app[data-theme="night"] .ir-topbar, .ir-app[data-theme="night"] .ir-card, .ir-app[data-theme="night"] .ir-kpi { border-color: var(--ink-200); }
.ir-app[data-theme="night"] .ds-pilltabs { background: var(--ink-100); }

/* \u2500\u2500\u2500\u2500 Sepia theme \u2500\u2500\u2500\u2500 */
.ir-app[data-theme="sepia"] {
  --canvas: #F2EAD8;
  --paper: #FAF5EB;
  --ink-50: #EDE4D2;
  --ink-100: #E5DCCA;
  --ink-200: #D5C9B2;
  --ink-300: #C0AE90;
}
.ir-app[data-theme="sepia"] .ds-sidebar { background: var(--sidebar-bg); }
.ir-app[data-theme="sepia"] .ir-card, .ir-app[data-theme="sepia"] .ir-kpi { background: var(--paper); }

/* \u2500\u2500\u2500\u2500 Accent palettes \u2500\u2500\u2500\u2500 */
.ir-app[data-accent="stripe"] {
  --accent:        #635BFF;
  --accent-hover:  #4F46E5;
  --accent-active: #3730A3;
  --accent-soft:   #F3F0FF;
  --accent-text:   #3F36B5;
}
.ir-app[data-accent="blue"] {
  --accent:        #0570DE;
  --accent-hover:  #0055B8;
  --accent-active: #00418E;
  --accent-soft:   #EAF4FF;
  --accent-text:   #075CB7;
}
.ir-app[data-accent="cyan"] {
  --accent:        #00B8D9;
  --accent-hover:  #0099B8;
  --accent-active: #007C96;
  --accent-soft:   #E6FAFF;
  --accent-text:   #04768D;
}
.ir-app[data-accent="navy"] {
  --accent:        #0A2540;
  --accent-hover:  #12395B;
  --accent-active: #06182C;
  --accent-soft:   #EAF0F6;
  --accent-text:   #0A2540;
}
@media (max-width: 760px) {
  .ir-app { grid-template-columns: 72px minmax(0,1fr); }
  .ir-content { padding-left: 16px; padding-right: 16px; }
  .ir-filter-panel { margin-left: 16px; margin-right: 16px; overflow-x: auto; }
  .ir-kpis { grid-template-columns: 1fr; }
  .ir-grid-2,
  .ir-grid-3 { grid-template-columns: 1fr; }
}
`;
const useClickOutside = (ref, handler) => {
  useEffectD(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    const onKey = (e) => {
      if (e.key === "Escape") handler();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [handler]);
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const TODAY = new Date(2026, 4, 14);
const fmtDate = (d) => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
const fmtDateShort = (d) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const inBetween = (d, s, e) => d.getTime() > s.getTime() && d.getTime() < e.getTime();
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const DATE_PRESETS = [
  { id: "7d", label: "Last 7 days", range: () => {
    const e = new Date(TODAY);
    const s = new Date(TODAY);
    s.setDate(s.getDate() - 6);
    return [s, e];
  } },
  { id: "30d", label: "Last 30 days", range: () => {
    const e = new Date(TODAY);
    const s = new Date(TODAY);
    s.setDate(s.getDate() - 29);
    return [s, e];
  } },
  { id: "mtd", label: "Month to date", range: () => [new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), new Date(TODAY)] },
  { id: "lm", label: "Last month", range: () => {
    const s = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1);
    const e = new Date(TODAY.getFullYear(), TODAY.getMonth(), 0);
    return [s, e];
  } },
  { id: "qtd", label: "Quarter to date", range: () => {
    const q = Math.floor(TODAY.getMonth() / 3);
    return [new Date(TODAY.getFullYear(), q * 3, 1), new Date(TODAY)];
  } },
  { id: "fyq1", label: "FY 25-26 Q1", range: () => [new Date(2025, 3, 1), new Date(2025, 5, 30)] },
  { id: "fytd", label: "Financial YTD", range: () => [new Date(2025, 3, 1), new Date(TODAY)] },
  { id: "custom", label: "Custom" }
];
const MiniCal = ({ month, onPick, hover, onHover, start, end }) => {
  const first = startOfMonth(month);
  const startDow = first.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [];
  const prevDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) cells.push({ d: new Date(month.getFullYear(), month.getMonth() - 1, prevDays - i), mute: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: new Date(month.getFullYear(), month.getMonth(), i), mute: false });
  while (cells.length < 42) {
    const last = cells[cells.length - 1].d;
    const nx = new Date(last);
    nx.setDate(nx.getDate() + 1);
    cells.push({ d: nx, mute: true });
  }
  const effEnd = end || hover;
  return /* @__PURE__ */ React.createElement("div", { className: "ir-dr-cal-grid" }, DOW.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "ir-dr-cal-dow" }, d)), cells.map((c, i) => {
    const isStart = start && sameDay(c.d, start);
    const isEnd = end && sameDay(c.d, end);
    const inRange = start && effEnd && c.d > (start < effEnd ? start : effEnd) && c.d < (start < effEnd ? effEnd : start);
    const edge = isStart && start < (effEnd || start) ? "start" : isEnd && end >= start ? "end" : isStart ? "end" : null;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        className: "ir-dr-cal-day",
        "data-mute": c.mute || void 0,
        "data-edge": edge || void 0,
        "data-in-range": inRange || isStart && !isEnd && hover && hover > start || void 0,
        "data-today": sameDay(c.d, TODAY) || void 0,
        onClick: () => !c.mute && onPick(c.d),
        onMouseEnter: () => !c.mute && onHover && onHover(c.d)
      },
      c.d.getDate()
    );
  }));
};
const DateRangePicker = ({ value, onChange, onClose }) => {
  const [tmp, setTmp] = useStateD(value);
  const [hover, setHover] = useStateD(null);
  const [preset, setPreset] = useStateD(value.presetId || "custom");
  const [leftMonth, setLeftMonth] = useStateD(startOfMonth(value.start || new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1)));
  const ref = useRefD(null);
  useClickOutside(ref, onClose);
  const onPick = (d) => {
    if (!tmp.start || tmp.start && tmp.end) {
      setTmp({ start: d, end: null, presetId: "custom" });
      setPreset("custom");
    } else {
      const start = tmp.start <= d ? tmp.start : d;
      const end = tmp.start <= d ? d : tmp.start;
      setTmp({ start, end, presetId: "custom" });
    }
  };
  const applyPreset = (p) => {
    setPreset(p.id);
    if (p.id === "custom") return;
    const [s, e] = p.range();
    setTmp({ start: s, end: e, presetId: p.id });
    setLeftMonth(startOfMonth(s));
  };
  const rightMonth = addMonths(leftMonth, 1);
  return /* @__PURE__ */ React.createElement("div", { className: "ir-pop ir-dr-pop", ref, onMouseLeave: () => setHover(null) }, /* @__PURE__ */ React.createElement("div", { className: "ir-pop-head" }, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 14, style: { color: "var(--ink-500)" } }), /* @__PURE__ */ React.createElement("span", { className: "ir-pop-title" }, "Select date range"), /* @__PURE__ */ React.createElement("span", { className: "ir-pop-spacer" }), /* @__PURE__ */ React.createElement("button", { className: "ir-dr-cal-nav", onClick: onClose }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 14 }))), /* @__PURE__ */ React.createElement("div", { className: "ir-dr-body" }, /* @__PURE__ */ React.createElement("div", { className: "ir-dr-presets" }, DATE_PRESETS.map((p) => /* @__PURE__ */ React.createElement("button", { key: p.id, className: "ir-dr-preset", "data-active": preset === p.id, onClick: () => applyPreset(p) }, p.label))), /* @__PURE__ */ React.createElement("div", { className: "ir-dr-cal-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "ir-dr-cal" }, /* @__PURE__ */ React.createElement("div", { className: "ir-dr-cal-head" }, /* @__PURE__ */ React.createElement("button", { className: "ir-dr-cal-nav", onClick: () => setLeftMonth(addMonths(leftMonth, -1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 14 })), /* @__PURE__ */ React.createElement("span", { className: "ir-dr-cal-title" }, MONTHS[leftMonth.getMonth()], " ", leftMonth.getFullYear()), /* @__PURE__ */ React.createElement("span", { style: { width: 22 } })), /* @__PURE__ */ React.createElement(MiniCal, { month: leftMonth, onPick, hover, onHover: setHover, start: tmp.start, end: tmp.end })), /* @__PURE__ */ React.createElement("div", { className: "ir-dr-cal" }, /* @__PURE__ */ React.createElement("div", { className: "ir-dr-cal-head" }, /* @__PURE__ */ React.createElement("span", { style: { width: 22 } }), /* @__PURE__ */ React.createElement("span", { className: "ir-dr-cal-title" }, MONTHS[rightMonth.getMonth()], " ", rightMonth.getFullYear()), /* @__PURE__ */ React.createElement("button", { className: "ir-dr-cal-nav", onClick: () => setLeftMonth(addMonths(leftMonth, 1)) }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 14 }))), /* @__PURE__ */ React.createElement(MiniCal, { month: rightMonth, onPick, hover, onHover: setHover, start: tmp.start, end: tmp.end })))), /* @__PURE__ */ React.createElement("div", { className: "ir-dr-range-display" }, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 12, style: { color: "var(--ink-400)" } }), /* @__PURE__ */ React.createElement("span", { className: "mono" }, tmp.start ? fmtDate(tmp.start) : "\u2014"), /* @__PURE__ */ React.createElement("span", { className: "sep" }, "\u2192"), /* @__PURE__ */ React.createElement("span", { className: "mono" }, tmp.end ? fmtDate(tmp.end) : "Pick end date"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", disabled: !tmp.start || !tmp.end, onClick: () => {
    onChange(tmp);
    onClose();
  } }, "Apply")));
};
const DateButton = ({ value, onChange }) => {
  const [open, setOpen] = useStateD(false);
  return /* @__PURE__ */ React.createElement("div", { className: "ir-pop-anchor" }, /* @__PURE__ */ React.createElement("button", { className: "ir-date-trigger", "data-active": open, onClick: () => setOpen((o) => !o) }, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 13, style: { color: "var(--ink-500)" } }), /* @__PURE__ */ React.createElement("span", { className: "ir-date-text" }, fmtDateShort(value.start), " \u2013 ", fmtDateShort(value.end)), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 12, style: { color: "var(--ink-400)" } })), open && /* @__PURE__ */ React.createElement(DateRangePicker, { value, onChange, onClose: () => setOpen(false) }));
};
const ZONES = [
  { id: "SCR", label: "SCR \u2014 South Central Railway" },
  { id: "CR", label: "CR \u2014 Central Railway" },
  { id: "NR", label: "NR \u2014 Northern Railway" },
  { id: "WR", label: "WR \u2014 Western Railway" }
];
const DIVS = [
  { id: "BZA", label: "Vijayawada Division" },
  { id: "GNT", label: "Guntur Division" },
  { id: "HYD", label: "Hyderabad Division" },
  { id: "SC", label: "Secunderabad Division" }
];
const SECS = [
  { id: "ALL", label: "All Sections" },
  { id: "BZA-GNT", label: "BZA \u2013 GNT" },
  { id: "BZA-RJY", label: "BZA \u2013 RJY" }
];
const FilterButton = ({ value, onChange }) => {
  const [open, setOpen] = useStateD(false);
  const [tmp, setTmp] = useStateD(value);
  const ref = useRefD(null);
  useClickOutside(ref, () => setOpen(false));
  useEffectD(() => {
    if (open) setTmp(value);
  }, [open]);
  const defaults = { zone: "SCR", div: "BZA", sec: "ALL" };
  const activeCount = ["zone", "div", "sec"].filter((k) => value[k] !== defaults[k]).length;
  const zoneShort = (id) => ZONES.find((z) => z.id === id)?.label.split(" \u2014 ")[0] || id;
  const divShort = (id) => DIVS.find((z) => z.id === id)?.label.replace(" Division", "") || id;
  const secShort = (id) => SECS.find((z) => z.id === id)?.label || id;
  return /* @__PURE__ */ React.createElement("div", { className: "ir-pop-anchor", ref }, /* @__PURE__ */ React.createElement("button", { className: "ir-filter-trigger", "data-active": open, onClick: () => setOpen((o) => !o) }, /* @__PURE__ */ React.createElement(Icon, { name: "filter", size: 13, style: { color: "var(--ink-600)" } }), /* @__PURE__ */ React.createElement("span", null, "Filter"), activeCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "ir-filter-trigger-count" }, activeCount), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 12, style: { color: "var(--ink-400)" } })), /* @__PURE__ */ React.createElement("span", { className: "ir-filter-summary" }, /* @__PURE__ */ React.createElement("span", { className: "ir-filter-summary-chip" }, zoneShort(value.zone)), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-300)" } }, "\u203A"), /* @__PURE__ */ React.createElement("span", { className: "ir-filter-summary-chip" }, divShort(value.div)), value.sec !== "ALL" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-300)" } }, "\u203A"), /* @__PURE__ */ React.createElement("span", { className: "ir-filter-summary-chip" }, secShort(value.sec)))), open && /* @__PURE__ */ React.createElement("div", { className: "ir-pop", style: { minWidth: 320 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-pop-head" }, /* @__PURE__ */ React.createElement(Icon, { name: "filter", size: 14, style: { color: "var(--ink-500)" } }), /* @__PURE__ */ React.createElement("span", { className: "ir-pop-title" }, "Filter scope"), /* @__PURE__ */ React.createElement("span", { className: "ir-pop-spacer" }), /* @__PURE__ */ React.createElement("button", { className: "ir-dr-cal-nav", onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 14 }))), /* @__PURE__ */ React.createElement("div", { className: "ir-pop-body" }, /* @__PURE__ */ React.createElement("div", { className: "ir-pop-row" }, /* @__PURE__ */ React.createElement("label", { className: "ir-pop-row-label" }, "Zone"), /* @__PURE__ */ React.createElement("select", { className: "ir-filter", value: tmp.zone, onChange: (e) => setTmp({ ...tmp, zone: e.target.value }) }, ZONES.map((z) => /* @__PURE__ */ React.createElement("option", { key: z.id, value: z.id }, z.label)))), /* @__PURE__ */ React.createElement("div", { className: "ir-pop-row" }, /* @__PURE__ */ React.createElement("label", { className: "ir-pop-row-label" }, "Division"), /* @__PURE__ */ React.createElement("select", { className: "ir-filter", value: tmp.div, onChange: (e) => setTmp({ ...tmp, div: e.target.value }) }, DIVS.map((z) => /* @__PURE__ */ React.createElement("option", { key: z.id, value: z.id }, z.label)))), /* @__PURE__ */ React.createElement("div", { className: "ir-pop-row" }, /* @__PURE__ */ React.createElement("label", { className: "ir-pop-row-label" }, "Section"), /* @__PURE__ */ React.createElement("select", { className: "ir-filter", value: tmp.sec, onChange: (e) => setTmp({ ...tmp, sec: e.target.value }) }, SECS.map((z) => /* @__PURE__ */ React.createElement("option", { key: z.id, value: z.id }, z.label))))), /* @__PURE__ */ React.createElement("div", { className: "ir-pop-foot" }, /* @__PURE__ */ React.createElement("button", { className: "ir-link", onClick: () => setTmp(defaults) }, "Reset"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", onClick: () => setOpen(false) }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", onClick: () => {
    onChange(tmp);
    setOpen(false);
  } }, "Apply")))));
};
const ScopeChipComp = ({ value, options, open, onOpen, onClose, onChange }) => {
  const ref = useRefD(null);
  useClickOutside(ref, onClose);
  const current = options.find((o) => o.id === value);
  return /* @__PURE__ */ React.createElement("div", { className: "ir-fp-chip-wrap", ref }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "ir-scope-chip",
      "data-active": open,
      onClick: open ? onClose : onOpen
    },
    /* @__PURE__ */ React.createElement("span", null, current ? current.short : value),
    /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 11, style: { color: "var(--ink-400)" } })
  ), open && /* @__PURE__ */ React.createElement("div", { className: "ir-scope-pop" }, options.map((o) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: o.id,
      className: "ir-scope-pop-item",
      "data-active": value === o.id,
      onClick: () => {
        onChange(o.id);
        onClose();
      }
    },
    o.label
  ))));
};
const TopBar = () => {
  const [zone, setZone] = useStateD("SCR");
  const [div, setDiv] = useStateD("BZA");
  const [sec, setSec] = useStateD("ALL");
  const [openScope, setOpenScope] = useStateD(null);
  const [timePreset, setTimePreset] = useStateD("today");
  const [dateRange, setDateRange] = useStateD({ start: new Date(2026, 3, 1), end: new Date(2026, 4, 14), presetId: "custom" });
  const [datePickerOpen, setDatePickerOpen] = useStateD(false);
  const dateAnchorRef = useRefD(null);
  useClickOutside(dateAnchorRef, () => setDatePickerOpen(false));
  const isDefault = zone === "SCR" && div === "BZA" && sec === "ALL" && timePreset === "today";
  const resetFilters = () => {
    setZone("SCR");
    setDiv("BZA");
    setSec("ALL");
    setTimePreset("today");
    setOpenScope(null);
    setDatePickerOpen(false);
  };
  const zoneOpts = [
    { id: "SCR", label: "SCR \u2014 South Central Railway", short: "SCR" },
    { id: "CR", label: "CR \u2014 Central Railway", short: "CR" },
    { id: "NR", label: "NR \u2014 Northern Railway", short: "NR" },
    { id: "WR", label: "WR \u2014 Western Railway", short: "WR" }
  ];
  const divOpts = [
    { id: "BZA", label: "Vijayawada Division", short: "Vijayawada" },
    { id: "GNT", label: "Guntur Division", short: "Guntur" },
    { id: "HYD", label: "Hyderabad Division", short: "Hyderabad" },
    { id: "SC", label: "Secunderabad Division", short: "Secunderabad" }
  ];
  const secOpts = [
    { id: "ALL", label: "All Sections", short: "All Sections" },
    { id: "BZA-GNT", label: "BZA \u2013 GNT Section", short: "BZA \u2013 GNT" },
    { id: "BZA-RJY", label: "BZA \u2013 RJY Section", short: "BZA \u2013 RJY" }
  ];
  const TIME_PILLS = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" }
  ];
  const customLabel = fmtDateShort(dateRange.start) + " \u2013 " + fmtDateShort(dateRange.end);
  return /* @__PURE__ */ React.createElement("div", { className: "ir-topbar" }, /* @__PURE__ */ React.createElement("div", { className: "ir-topbar-titlerow" }, /* @__PURE__ */ React.createElement("div", { className: "ir-topbar-icon-badge" }, /* @__PURE__ */ React.createElement(Icon, { name: "chart", size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ir-topbar-title" }, "Dashboard"), /* @__PURE__ */ React.createElement("div", { className: "ir-topbar-sub" }, "South Central Railway", /* @__PURE__ */ React.createElement("span", { className: "ir-topbar-sep" }, "\u2022"), /* @__PURE__ */ React.createElement("span", { className: "ir-topbar-sync" }, /* @__PURE__ */ React.createElement("span", { className: "ir-sync-dot" }), "Updated 4 mins ago")))), /* @__PURE__ */ React.createElement("div", { className: "ir-filter-panel" }, /* @__PURE__ */ React.createElement("div", { className: "ir-fp-section" }, /* @__PURE__ */ React.createElement("div", { className: "ir-fp-label" }, "Scope"), /* @__PURE__ */ React.createElement("div", { className: "ir-fp-chips" }, /* @__PURE__ */ React.createElement(
    ScopeChipComp,
    {
      value: zone,
      options: zoneOpts,
      open: openScope === "zone",
      onOpen: () => setOpenScope("zone"),
      onClose: () => setOpenScope(null),
      onChange: setZone
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "ir-scope-arrow" }, "\u203A"), /* @__PURE__ */ React.createElement(
    ScopeChipComp,
    {
      value: div,
      options: divOpts,
      open: openScope === "div",
      onOpen: () => setOpenScope("div"),
      onClose: () => setOpenScope(null),
      onChange: setDiv
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "ir-scope-arrow" }, "\u203A"), /* @__PURE__ */ React.createElement(
    ScopeChipComp,
    {
      value: sec,
      options: secOpts,
      open: openScope === "sec",
      onOpen: () => setOpenScope("sec"),
      onClose: () => setOpenScope(null),
      onChange: setSec
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "ir-fp-divider" }), /* @__PURE__ */ React.createElement("div", { className: "ir-fp-section" }, /* @__PURE__ */ React.createElement("div", { className: "ir-fp-label" }, "Time"), /* @__PURE__ */ React.createElement("div", { className: "ir-fp-chips" }, TIME_PILLS.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.id,
      className: "ir-time-pill",
      "data-active": timePreset === p.id,
      onClick: () => {
        setTimePreset(p.id);
        setDatePickerOpen(false);
      }
    },
    p.label
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-fp-chip-wrap", ref: dateAnchorRef }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "ir-time-pill",
      "data-active": timePreset === "custom",
      onClick: () => {
        setTimePreset("custom");
        setDatePickerOpen((o) => !o);
      },
      style: timePreset === "custom" ? { paddingLeft: 10 } : {}
    },
    timePreset === "custom" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 11 }), /* @__PURE__ */ React.createElement("span", null, customLabel), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 10, style: { color: "rgba(255,255,255,0.55)" } })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, "Custom Date"), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 11, style: { color: "var(--ink-400)" } }))
  ), datePickerOpen && /* @__PURE__ */ React.createElement(
    DateRangePicker,
    {
      value: dateRange,
      onChange: (v) => {
        setDateRange(v);
        setTimePreset("custom");
        setDatePickerOpen(false);
      },
      onClose: () => setDatePickerOpen(false)
    }
  )))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("div", { className: "ir-fp-actions" }, !isDefault && /* @__PURE__ */ React.createElement("button", { className: "ir-fp-reset", onClick: resetFilters }, "Reset Filters"), /* @__PURE__ */ React.createElement("button", { className: "ir-fp-refresh", title: "Refresh data" }, /* @__PURE__ */ React.createElement(Icon, { name: "refresh", size: 14 })))));
};
const SparkSm = ({ data }) => {
  const w = 70, h = 24, p = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [p + i * (w - p * 2) / (data.length - 1), h - p - (d - min) / range * (h - p * 2)]);
  const path = "M " + pts.map((x) => x.join(",")).join(" L ");
  const area = `M ${pts[0][0]},${h} L ${pts.map((x) => x.join(",")).join(" L ")} L ${pts[pts.length - 1][0]},${h} Z`;
  return /* @__PURE__ */ React.createElement("svg", { className: "ir-spark", viewBox: `0 0 ${w} ${h}` }, /* @__PURE__ */ React.createElement("path", { className: "area", d: area }), /* @__PURE__ */ React.createElement("path", { d: path }));
};
const KpiCard = ({ accent, icon, label, value, valueColor, delta, deltaDir, meta, spark, selected, onClick }) => /* @__PURE__ */ React.createElement("div", { className: "ir-kpi", style: { "--kpi-accent": accent }, "data-selected": selected, onClick }, /* @__PURE__ */ React.createElement("div", { className: "ir-kpi-head" }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 13 }), /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement("div", { className: "ir-kpi-value", style: { color: valueColor } }, value), /* @__PURE__ */ React.createElement("div", { className: "ir-kpi-foot" }, delta ? /* @__PURE__ */ React.createElement("span", { className: "ir-kpi-delta", "data-dir": deltaDir }, /* @__PURE__ */ React.createElement(Icon, { name: deltaDir === "up" ? "arrow_up" : "arrow_down", size: 10 }), delta) : /* @__PURE__ */ React.createElement("span", { className: "ir-kpi-meta" }, meta), spark && /* @__PURE__ */ React.createElement(SparkSm, { data: spark })));
const KpiStrip = () => {
  const [sel, setSel] = useStateD(null);
  const cards = [
    { id: "total", accent: "var(--ink-300)", icon: "cube", label: "Total Stations", value: "247", meta: "in your scope" },
    { id: "complete", accent: "var(--success)", icon: "check_circle", label: "Fully Complete", value: "97", valueColor: "var(--success-text)", delta: "12 this month", deltaDir: "up" },
    { id: "inprog", accent: "var(--warning)", icon: "clock", label: "In Progress", value: "108", valueColor: "var(--warning-text)", meta: "across all stages" },
    { id: "pending", accent: "var(--danger)", icon: "inbox", label: "Pending  My Action", value: "14", valueColor: "var(--danger-text)", delta: "5 overdue", deltaDir: "down" },
    { id: "disc", accent: "var(--info)", icon: "flag", label: "Open Discrepancies", value: "43", valueColor: "var(--info-text)", meta: "unresolved" },
    { id: "rate", accent: "var(--accent)", icon: "chart", label: "Completion Rate", value: "39%", delta: "5% vs last month", deltaDir: "up", spark: [22, 25, 28, 30, 29, 33, 36, 39] }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "ir-kpis" }, cards.map(
    (c) => /* @__PURE__ */ React.createElement(KpiCard, { key: c.id, ...c, selected: sel === c.id, onClick: () => setSel(sel === c.id ? null : c.id) })
  ));
};
const LifecycleFunnel = () => {
  const [scope, setScope] = useStateD("month");
  const stages = [
    { id: 1, name: "Not Started", desc: "No documents uploaded yet", count: 42, color: "var(--ink-400)" },
    { id: 2, name: "Data Ingested", desc: "ESP uploaded, survey data received", count: 38, color: "var(--info)" },
    { id: 3, name: "ESP Validated", desc: "SOD rules passed, awaiting approval", count: 29, color: "var(--accent)" },
    { id: 4, name: "SIP In Progress", desc: "SIP generated or under validation", count: 41, color: "var(--warning)" },
    { id: 5, name: "LOP In Progress", desc: "LOP generated, under review", count: 28, color: "oklch(0.62 0.13 190)" },
    { id: 6, name: "Complete", desc: "All three documents approved", count: 97, color: "var(--success)" }
  ];
  const total = stages.reduce((a, b) => a + b.count, 0);
  return /* @__PURE__ */ React.createElement("div", { className: "ir-card" }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-title" }, "Document Lifecycle"), /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-sub" }, total, " stations total")), /* @__PURE__ */ React.createElement(
    PillTabs,
    {
      items: [{ id: "month", label: "This Month" }, { id: "all", label: "All Time" }],
      active: scope,
      onChange: setScope
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-funnel" }, stages.map(
    (s) => /* @__PURE__ */ React.createElement("div", { key: s.id, className: "ir-funnel-row", style: { "--stage-color": s.color } }, /* @__PURE__ */ React.createElement("div", { className: "ir-funnel-bar" }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-funnel-name" }, s.name), /* @__PURE__ */ React.createElement("div", { className: "ir-funnel-desc" }, s.desc)), /* @__PURE__ */ React.createElement("div", { className: "ir-funnel-count" }, s.count))
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-funnel-dist" }, stages.map(
    (s) => /* @__PURE__ */ React.createElement("div", { key: s.id, style: { width: `${s.count / total * 100}%`, background: s.color } })
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-funnel-legend" }, stages.map(
    (s) => /* @__PURE__ */ React.createElement("div", { key: s.id, className: "ir-funnel-legend-item" }, /* @__PURE__ */ React.createElement("span", { className: "ir-funnel-legend-dot", style: { background: s.color } }), /* @__PURE__ */ React.createElement("span", null, s.name), /* @__PURE__ */ React.createElement("span", { className: "ir-funnel-legend-count" }, s.count))
  )));
};
const RecentActivity = () => {
  const [filter, setFilter] = useStateD("all");
  const days = [
    {
      label: "Today \u2014 Wednesday, 14 May",
      items: [
        { type: "SIP", action: "Resumed ESP validation", station: "Bisalwas Kalan", code: "BIWK", status: "info", statusLabel: "In progress", time: "2:30 PM", progress: 47 },
        { type: "ESP", action: "Submitted ESP for approval", station: "Guntur Junction", code: "GNT", status: "warning", statusLabel: "Pending approval", time: "11:00 AM" },
        { type: "ESP", action: "Fixed 3 SOD rule violations", station: "Bisalwas Kalan", code: "BIWK", status: "neutral", statusLabel: "Done", time: "9:15 AM" }
      ]
    },
    {
      label: "Yesterday \u2014 Tuesday, 13 May",
      items: [
        { type: "SIP", action: "Generated SIP draft", station: "Tenali Junction", code: "TEL", status: "neutral", statusLabel: "Done", time: "4:45 PM" },
        { type: "LIB", action: "Uploaded Survey Data", station: "Vijayawada Junction", code: "BZA", status: "neutral", statusLabel: "Done", time: "2:00 PM" },
        { type: "ESP", action: "Submitted ESP for approval", station: "Tenali Junction", code: "TEL", status: "success", statusLabel: "Approved", time: "11:30 AM" }
      ]
    },
    {
      label: "Monday, 12 May",
      items: [
        { type: "SIP", action: "Opened SIP editor", station: "Bhimavaram Town", code: "BVRT", status: "info", statusLabel: "In progress", time: "3:20 PM", progress: 62, note: "2 violations left" },
        { type: "LOP", action: "Generated LOP draft", station: "Rajahmundry", code: "RJY", status: "neutral", statusLabel: "Done", time: "10:00 AM" }
      ]
    }
  ];
  const filteredDays = days.map((d) => ({ ...d, items: d.items.filter((it) => filter === "all" || it.type === filter.toUpperCase()) })).filter((d) => d.items.length > 0);
  const chipFor = (s, label) => s === "info" ? /* @__PURE__ */ React.createElement(Chip, { tone: "info", pulse: true }, label) : s === "success" ? /* @__PURE__ */ React.createElement(Chip, { tone: "success", leadingIcon: "check" }, label) : s === "warning" ? /* @__PURE__ */ React.createElement(Chip, { tone: "warning", dot: true }, label) : s === "danger" ? /* @__PURE__ */ React.createElement(Chip, { tone: "danger", leadingIcon: "alert" }, label) : /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, label);
  return /* @__PURE__ */ React.createElement("div", { className: "ir-card" }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head" }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: "var(--r-md)", background: "var(--accent-soft)", color: "var(--accent-text)", display: "grid", placeItems: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { name: "clock", size: 15 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-title" }, "My Recent Activity"), /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-sub" }, "Last 7 days \xB7 Click any row to resume")), /* @__PURE__ */ React.createElement(
    PillTabs,
    {
      items: [{ id: "all", label: "All" }, { id: "esp", label: "ESP" }, { id: "sip", label: "SIP" }, { id: "lop", label: "LOP" }],
      active: filter,
      onChange: setFilter
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-activity" }, filteredDays.map(
    (d, di) => /* @__PURE__ */ React.createElement(React.Fragment, { key: di }, /* @__PURE__ */ React.createElement("div", { className: "ir-activity-day" }, d.label), d.items.map(
      (it, i) => /* @__PURE__ */ React.createElement("div", { className: "ir-activity-row", key: i }, /* @__PURE__ */ React.createElement("div", { className: "ir-doc-badge", "data-type": it.type }, it.type), /* @__PURE__ */ React.createElement("div", { className: "ir-activity-body" }, /* @__PURE__ */ React.createElement("div", { className: "ir-activity-action" }, it.action), /* @__PURE__ */ React.createElement("div", { className: "ir-activity-station" }, /* @__PURE__ */ React.createElement("span", null, it.station), /* @__PURE__ */ React.createElement("span", { className: "ir-station-code" }, it.code), it.note && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-400)" } }, "\xB7 ", it.note)), it.progress != null && /* @__PURE__ */ React.createElement("div", { className: "ir-activity-prog" }, /* @__PURE__ */ React.createElement("div", { className: "ir-activity-prog-bar" }, /* @__PURE__ */ React.createElement("div", { style: { width: `${it.progress}%` } })), /* @__PURE__ */ React.createElement("span", { className: "ir-activity-prog-label" }, it.progress, "% complete"), /* @__PURE__ */ React.createElement("span", { className: "ir-activity-resume" }, "\u2192 Resume at Step ", Math.ceil(it.progress / 20)))), /* @__PURE__ */ React.createElement("div", { className: "ir-activity-right" }, /* @__PURE__ */ React.createElement("span", { className: "ir-activity-time" }, it.time), chipFor(it.status, it.statusLabel)))
    ))
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-card-foot" }, /* @__PURE__ */ React.createElement("span", { className: "ir-card-foot-meta" }, "8 actions this week"), /* @__PURE__ */ React.createElement("button", { className: "ir-link" }, "View full history \u2192")));
};
const ApprovalsCard = () => {
  const rows = [
    { type: "SIP", station: "Vijayawada Junction", code: "BZA", ver: "SIP v1.2", who: "R. Sharma", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", leadingIcon: "alert" }, "Overdue"), age: "12d ago" },
    { type: "ESP", station: "Guntur Junction", code: "GNT", ver: "ESP v2.0", who: "K. Naidu", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", leadingIcon: "alert" }, "Overdue"), age: "8d ago" },
    { type: "SIP", station: "Tenali Junction", code: "TEL", ver: "SIP v1.0", who: "S. Reddy", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", dot: true }, "Pending"), age: "3d ago" },
    { type: "ESP", station: "Ongole", code: "OGL", ver: "ESP v1.0", who: "V. Kumar", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", dot: true }, "Pending"), age: "1d ago" },
    { type: "LOP", station: "Rajahmundry", code: "RJY", ver: "LOP v1.0", who: "P. Rao", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "info" }, "Review"), age: "Today" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "ir-card" }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-title" }, "Pending My Approval")), /* @__PURE__ */ React.createElement(Chip, { tone: "danger", variant: "solid" }, "5")), /* @__PURE__ */ React.createElement("div", null, rows.map(
    (r, i) => /* @__PURE__ */ React.createElement("div", { className: "ir-list-row", key: i }, /* @__PURE__ */ React.createElement("div", { className: "ir-doc-badge ir-doc-badge-lg", "data-type": r.type }, r.type), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-list-name" }, r.station, " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-400)", fontWeight: 500 } }, "(", r.code, ")")), /* @__PURE__ */ React.createElement("div", { className: "ir-list-meta" }, r.ver, " \xB7 ", r.who)), /* @__PURE__ */ React.createElement("div", { className: "ir-list-right" }, r.chip, /* @__PURE__ */ React.createElement("span", { className: "ir-list-age" }, r.age)))
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-card-foot" }, /* @__PURE__ */ React.createElement("span", { className: "ir-card-foot-meta" }, "5 awaiting your review"), /* @__PURE__ */ React.createElement("button", { className: "ir-link" }, "View all approvals \u2192")));
};
const DiscrepanciesCard = () => {
  const rows = [
    { count: 12, station: "Vijayawada Junction", code: "BZA", desc: "Track spacing violations \xB7 3 critical", doc: "ESP" },
    { count: 9, station: "Bisalwas Kalan", code: "BIWK", desc: "SOD rule failures \xB7 Signal placement", doc: "SIP" },
    { count: 6, station: "Tenali Junction", code: "TEL", desc: "Platform offset violations", doc: "ESP" },
    { count: 5, station: "Guntur Junction", code: "GNT", desc: "Turnout chainage mismatch", doc: "ESP" },
    { count: 4, station: "Rajahmundry", code: "RJY", desc: "OHE clearance issues", doc: "LOP" },
    { count: 3, station: "Ongole", code: "OGL", desc: "Missing LC gate annotation", doc: "SIP" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "ir-card" }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-title" }, "Discrepancy Hotspots")), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "43 open")), /* @__PURE__ */ React.createElement("div", null, rows.map(
    (r, i) => /* @__PURE__ */ React.createElement("div", { className: "ir-list-row", key: i }, /* @__PURE__ */ React.createElement("div", { className: "ir-disc-count", "data-tone": r.count >= 10 ? "danger" : "warning" }, r.count), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-list-name" }, r.station, " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-400)", fontWeight: 500 } }, "(", r.code, ")")), /* @__PURE__ */ React.createElement("div", { className: "ir-list-meta" }, r.desc)), /* @__PURE__ */ React.createElement("span", { className: "ir-disc-doctype" }, r.doc))
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-card-foot" }, /* @__PURE__ */ React.createElement("span", { className: "ir-card-foot-meta" }, "Across 6 stations"), /* @__PURE__ */ React.createElement("button", { className: "ir-link" }, "View all discrepancies \u2192")));
};
const OverdueCard = () => {
  const rows = [
    { station: "Vijayawada Junction", code: "BZA", desc: "ESP validation started \xB7 no activity", doc: "ESP", days: 12 },
    { station: "Guntur Junction", code: "GNT", desc: "Awaiting approval \xB7 submitted 8d ago", doc: "ESP", days: 8 },
    { station: "Eluru", code: "EE", desc: "Survey data not uploaded \xB7 stalled", doc: "ESP", days: 30 },
    { station: "Secunderabad Jn", code: "SC", desc: "SIP validation incomplete \xB7 5 violations", doc: "SIP", days: 15 },
    { station: "Nanded", code: "NED", desc: "Not started \xB7 added 45 days ago", doc: "ESP", days: 45 },
    { station: "Kurnool City", code: "KRNT", desc: "LOP draft not submitted", doc: "LOP", days: 22 }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "ir-card" }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-title" }, "Overdue / Stalled")), /* @__PURE__ */ React.createElement(Chip, { tone: "danger", variant: "solid" }, "6")), /* @__PURE__ */ React.createElement("div", null, rows.map(
    (r, i) => /* @__PURE__ */ React.createElement("div", { className: "ir-list-row", key: i }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-list-name" }, r.station, " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-400)", fontWeight: 500 } }, "(", r.code, ")")), /* @__PURE__ */ React.createElement("div", { className: "ir-list-meta" }, r.desc)), /* @__PURE__ */ React.createElement("div", { className: "ir-od-right" }, /* @__PURE__ */ React.createElement("span", { className: "ir-disc-doctype" }, r.doc), /* @__PURE__ */ React.createElement("span", { className: "ir-od-days" }, r.days, "d")))
  )), /* @__PURE__ */ React.createElement("div", { className: "ir-card-foot" }, /* @__PURE__ */ React.createElement("span", { className: "ir-card-foot-meta" }, "Total: 6 stations"), /* @__PURE__ */ React.createElement("button", { className: "ir-link" }, "View all stalled stations \u2192")));
};
const DivisionTable = () => {
  const rows = [
    { name: "Vijayawada", stations: 89, esp: 72, sip: 58, lop: 34, overall: 55, status: "ontrack" },
    { name: "Guntur", stations: 64, esp: 60, sip: 40, lop: 18, overall: 39, status: "atrisk" },
    { name: "Hyderabad", stations: 71, esp: 88, sip: 74, lop: 52, overall: 71, status: "ontrack" },
    { name: "Secunderabad", stations: 23, esp: 30, sip: 14, lop: 4, overall: 16, status: "lagging" }
  ];
  const statusChip = {
    ontrack: /* @__PURE__ */ React.createElement(Chip, { tone: "success", dot: true }, "On track"),
    atrisk: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", dot: true }, "At risk"),
    lagging: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", dot: true }, "Lagging")
  };
  const overallColor = (v) => v >= 60 ? "var(--success-text)" : v >= 30 ? "var(--warning-text)" : "var(--danger-text)";
  const PBar = ({ value, color }) => /* @__PURE__ */ React.createElement("div", { className: "ir-pbar" }, /* @__PURE__ */ React.createElement("div", { className: "ir-pbar-track" }, /* @__PURE__ */ React.createElement("div", { className: "ir-pbar-fill", style: { width: `${value}%`, background: color } })), /* @__PURE__ */ React.createElement("span", { className: "ir-pbar-pct" }, value, "%"));
  return /* @__PURE__ */ React.createElement("div", { className: "ir-card" }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head" }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-title" }, "Division-wise Progress"), /* @__PURE__ */ React.createElement("div", { className: "ir-card-head-sub" }, "South Central Railway \xB7 4 divisions")), /* @__PURE__ */ React.createElement("button", { className: "ir-link" }, "Drill down \u2192")), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "ir-divtable" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Division"), /* @__PURE__ */ React.createElement("th", null, "Stations"), /* @__PURE__ */ React.createElement("th", null, "ESP"), /* @__PURE__ */ React.createElement("th", null, "SIP"), /* @__PURE__ */ React.createElement("th", null, "LOP"), /* @__PURE__ */ React.createElement("th", null, "Overall"), /* @__PURE__ */ React.createElement("th", null, "Status"))), /* @__PURE__ */ React.createElement("tbody", null, rows.map(
    (r) => /* @__PURE__ */ React.createElement("tr", { key: r.name }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "ir-div-name" }, r.name), /* @__PURE__ */ React.createElement("div", { className: "ir-div-sub" }, "SCR \xB7 ", r.stations, " stations")), /* @__PURE__ */ React.createElement("td", { className: "tabular", style: { fontWeight: 600, color: "var(--ink-700)" } }, r.stations), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(PBar, { value: r.esp, color: "var(--info)" })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(PBar, { value: r.sip, color: "var(--accent)" })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(PBar, { value: r.lop, color: "var(--warning)" })), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ir-overall", style: { color: overallColor(r.overall) } }, r.overall, "%")), /* @__PURE__ */ React.createElement("td", null, statusChip[r.status]))
  )))));
};
const DashboardPage = ({ embedded = false } = {}) => {
  const [nav, setNav] = useStateD("home");
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const dashboardMain = /* @__PURE__ */ React.createElement("div", { className: "ir-main" }, /* @__PURE__ */ React.createElement(
    AppTopBar,
    {
      crumbs: ["Home"],
      searchPlaceholder: "Search stations, documents, approvals..."
    }
  ), /* @__PURE__ */ React.createElement(TopBar, null), /* @__PURE__ */ React.createElement("div", { className: "ir-content" }, /* @__PURE__ */ React.createElement(KpiStrip, null), /* @__PURE__ */ React.createElement("div", { className: "ir-grid-2" }, /* @__PURE__ */ React.createElement(LifecycleFunnel, null), /* @__PURE__ */ React.createElement(RecentActivity, null)), /* @__PURE__ */ React.createElement("div", { className: "ir-grid-3" }, /* @__PURE__ */ React.createElement(ApprovalsCard, null), /* @__PURE__ */ React.createElement(DiscrepanciesCard, null), /* @__PURE__ */ React.createElement(OverdueCard, null)), /* @__PURE__ */ React.createElement(DivisionTable, null)));
  if (embedded) {
    return /* @__PURE__ */ React.createElement("div", { className: "ir-main ir-main-embedded", "data-theme": t.theme, "data-density": t.density, "data-accent": t.accent }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: ["Home"],
        searchPlaceholder: "Search stations, documents, approvals..."
      }
    ), /* @__PURE__ */ React.createElement(TopBar, null), /* @__PURE__ */ React.createElement("div", { className: "ir-content" }, /* @__PURE__ */ React.createElement(KpiStrip, null), /* @__PURE__ */ React.createElement("div", { className: "ir-grid-2" }, /* @__PURE__ */ React.createElement(LifecycleFunnel, null), /* @__PURE__ */ React.createElement(RecentActivity, null)), /* @__PURE__ */ React.createElement("div", { className: "ir-grid-3" }, /* @__PURE__ */ React.createElement(ApprovalsCard, null), /* @__PURE__ */ React.createElement(DiscrepanciesCard, null), /* @__PURE__ */ React.createElement(OverdueCard, null)), /* @__PURE__ */ React.createElement(DivisionTable, null)));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "ir-app", "data-theme": t.theme, "data-density": t.density, "data-accent": t.accent }, /* @__PURE__ */ React.createElement(IRSidebar, { active: nav, onSelect: setNav }), dashboardMain, /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "Surface" }), /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Theme",
      value: t.theme,
      options: ["light", "sepia", "night"],
      onChange: (v) => setTweak("theme", v)
    }
  ), /* @__PURE__ */ React.createElement(TweakSection, { label: "Layout" }), /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Density",
      value: t.density,
      options: ["dense", "regular", "spacious"],
      onChange: (v) => setTweak("density", v)
    }
  ), /* @__PURE__ */ React.createElement(TweakSection, { label: "Colour" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 500, color: "rgba(41,38,27,.72)", marginBottom: 7 } }, "Accent palette"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, [
    { id: "stripe", bg: "#635BFF", label: "Stripe" },
    { id: "blue", bg: "#0570DE", label: "Blue" },
    { id: "cyan", bg: "#00B8D9", label: "Cyan" },
    { id: "navy", bg: "#0A2540", label: "Navy" }
  ].map((a) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: a.id,
      title: a.label,
      onClick: () => setTweak("accent", a.id),
      style: {
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: a.bg,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
        boxShadow: t.accent === a.id ? "0 0 0 2px white, 0 0 0 4px " + a.bg : "none",
        transition: "box-shadow 150ms"
      }
    },
    t.accent === a.id && /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 14 14", style: { position: "absolute", inset: 0, width: "100%", height: "100%", padding: 4 } }, /* @__PURE__ */ React.createElement("path", { d: "M3 7.2 5.8 10 11 4.2", fill: "none", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", stroke: "white" }))
  ))))));
};
const dashStyle = document.createElement("style");
dashStyle.textContent = window.NAV_CSS + window.DATA_CSS + window.FORM_CSS + dashCSS;
document.head.appendChild(dashStyle);
window.DashboardPage = DashboardPage;
if (!window.__EMBED_DASHBOARD_PAGE) {
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(DashboardPage, null));
}
