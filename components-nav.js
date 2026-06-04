const { useState, useEffect, useRef, useMemo } = React;
const sidebarCSS = `
.ds-sidebar { width: 244px; background: var(--sidebar-bg); color: var(--sidebar-text); border-right: 1px solid rgba(10,37,64,0.32); display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; box-shadow: 12px 0 34px -28px rgba(10,37,64,0.9); }
.ds-sidebar::before { content: ""; position: absolute; inset: 0; background: var(--sidebar-glow); pointer-events: none; }
.ds-sidebar > * { position: relative; z-index: 1; }
.ds-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 18px 16px; border-bottom: 1px solid var(--sidebar-border); }
.ds-sidebar-mark { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.16); color: var(--paper); display: grid; place-items: center; font-weight: 800; font-family: var(--font-mono); font-size: 12px; letter-spacing: -0.02em; position: relative; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.18); }
.ds-sidebar-mark::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 35%, rgba(99,91,255,0.95) 35%, rgba(99,91,255,0.95) 50%, rgba(0,212,255,0.82) 50%, transparent 64%); opacity: 0.95; }
.ds-sidebar-mark span { position: relative; z-index: 1; }
.ds-sidebar-title { font-weight: 700; font-size: 14px; letter-spacing: 0; line-height: 1; color: var(--paper); }
.ds-sidebar-sub { font-size: 11px; color: var(--sidebar-muted); margin-top: 2px; }
.ds-sidebar-project { margin: 14px 12px 4px; padding: 8px 10px; border-radius: var(--r-md); border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.07); color: var(--paper); display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 150ms; box-shadow: inset 0 1px 0 rgba(255,255,255,0.08); }
.ds-sidebar-project:hover { border-color: rgba(255,255,255,0.24); background: rgba(255,255,255,0.12); }
.ds-sidebar-project-avatar { width: 22px; height: 22px; border-radius: 6px; background: linear-gradient(135deg, var(--stripe-violet), var(--stripe-cyan)); color: var(--paper); display: grid; place-items: center; font-size: 10px; font-weight: 800; }
.ds-sidebar-project-name { font-size: 13px; font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 8px; }
.ds-sidebar-section { padding: 12px 12px 4px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.58); font-weight: 700; }
.ds-sidebar-item { display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 7px 10px; border-radius: var(--r-md); color: rgba(255,255,255,0.78); cursor: pointer; font-size: 13.5px; font-weight: 600; transition: background 120ms, color 120ms, box-shadow 120ms, transform 120ms; position: relative; }
.ds-sidebar-item:hover { background: var(--sidebar-item-hover); color: var(--paper); }
.ds-sidebar-item[data-active="true"] { background: var(--sidebar-item-active); color: var(--sidebar-item-active-text); box-shadow: 0 8px 18px -10px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(255,255,255,0.45); }
.ds-sidebar-item[data-active="true"]::before { content: ""; position: absolute; left: -8px; top: 8px; bottom: 8px; width: 3px; border-radius: 0 3px 3px 0; background: var(--stripe-cyan); }
.ds-sidebar-item[data-active="true"] .ds-sidebar-badge { background: rgba(10,37,64,0.08); color: var(--stripe-blue-900); }
.ds-sidebar-item .icon { color: rgba(255,255,255,0.62); }
.ds-sidebar-item:hover .icon { color: var(--paper); }
.ds-sidebar-item[data-active="true"] .icon { color: var(--accent); }
.ds-sidebar-badge { margin-left: auto; font-size: 11px; padding: 1px 7px; border-radius: var(--r-full); background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.78); font-weight: 700; font-variant-numeric: tabular-nums; }
.ds-sidebar-badge[data-tone="accent"] { background: rgba(99,91,255,0.24); color: #FFFFFF; }
.ds-sidebar-foot { border-top: 1px solid var(--sidebar-border); padding: 10px; display: flex; align-items: center; gap: 10px; background: rgba(6,24,44,0.20); }
.ds-sidebar-user { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--stripe-violet), #2DD4BF); display: grid; place-items: center; color: var(--paper); font-size: 11px; font-weight: 800; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18); }
.ds-sidebar-userinfo { flex: 1; min-width: 0; }
.ds-sidebar-username { font-size: 13px; font-weight: 700; line-height: 1.2; color: var(--paper); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-sidebar-userrole { font-size: 11px; color: var(--sidebar-muted); }
.ds-sidebar-foot-btn { width: 28px; height: 28px; border-radius: var(--r-sm); border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.64); cursor: pointer; display: grid; place-items: center; }
.ds-sidebar-foot-btn:hover { background: rgba(255,255,255,0.12); color: var(--paper); border-color: rgba(255,255,255,0.12); }
@media (max-width: 760px) {
  .ds-sidebar { width: 72px; }
  .ds-sidebar-brand { justify-content: center; padding: 16px 10px; }
  .ds-sidebar-brand > div:not(.ds-sidebar-mark),
  .ds-sidebar-project,
  .ds-sidebar-section,
  .ds-sidebar-item span:not(.ds-sidebar-badge),
  .ds-sidebar-badge,
  .ds-sidebar-userinfo,
  .ds-sidebar-foot-btn { display: none; }
  .ds-sidebar-nav { padding: 12px 8px; }
  .ds-sidebar-item { justify-content: center; padding: 9px 0; min-height: 38px; }
  .ds-sidebar-item[data-active="true"]::before { left: -8px; top: 9px; bottom: 9px; }
  .ds-sidebar-foot { justify-content: center; padding: 12px 8px; }
}
`;
const Sidebar = ({ active = "schemas", onSelect }) => {
  const groups = [
    { label: "Workspace", items: [
      { id: "overview", icon: "home", label: "Overview" },
      { id: "fleet", icon: "train", label: "Fleet", badge: "248" },
      { id: "lines", icon: "track", label: "Lines & track" }
    ] },
    { label: "Automation", items: [
      { id: "schemas", icon: "layers", label: "ESP schemas", badge: "12", badgeTone: "accent" },
      { id: "procedures", icon: "file_check", label: "SIP procedures" },
      { id: "runs", icon: "branch", label: "Validation runs" },
      { id: "reports", icon: "chart", label: "Reports" }
    ] },
    { label: "Admin", items: [
      { id: "team", icon: "users", label: "Team" },
      { id: "policies", icon: "shield", label: "Policies" },
      { id: "docs", icon: "book", label: "Docs" }
    ] }
  ];
  return /* @__PURE__ */ React.createElement("aside", { className: "ds-sidebar" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-brand" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-mark" }, /* @__PURE__ */ React.createElement("span", null, "ES")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-title" }, "Verge", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)" } }, "\xB7"), "Rail"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-sub" }, "ESP \u2192 SIP automation"))), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-project", title: "Switch project" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-project-avatar" }, "NE"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-project-name" }, "Northern Eastern Corridor"), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_down", size: 14 })), /* @__PURE__ */ React.createElement("nav", { className: "ds-sidebar-nav" }, groups.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.label }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-section" }, g.label), g.items.map((it) => /* @__PURE__ */ React.createElement(
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
  ))))), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-foot" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-user" }, "AM"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-userinfo" }, /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-username" }, "Anya M\xF6ller"), /* @__PURE__ */ React.createElement("div", { className: "ds-sidebar-userrole" }, "Lead engineer")), /* @__PURE__ */ React.createElement("button", { className: "ds-sidebar-foot-btn", title: "Settings" }, /* @__PURE__ */ React.createElement(Icon, { name: "settings", size: 15 }))));
};
const headerCSS = `
.ds-header { display: flex; align-items: center; gap: 14px; padding: 12px 24px; background: rgba(255,255,255,0.92); border-bottom: var(--hairline); min-height: 60px; box-shadow: 0 1px 0 rgba(10,37,64,0.03); backdrop-filter: saturate(140%) blur(12px); }
.ds-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-500); flex: 0 1 auto; min-width: 0; }
.ds-breadcrumb a { color: var(--ink-500); text-decoration: none; cursor: pointer; padding: 3px 6px; border-radius: var(--r-sm); }
.ds-breadcrumb a:hover { background: var(--accent-soft); color: var(--accent-text); }
.ds-breadcrumb button { border: none; background: transparent; color: var(--ink-500); cursor: pointer; padding: 3px 6px; border-radius: var(--r-sm); font: inherit; }
.ds-breadcrumb button:hover { background: var(--accent-soft); color: var(--accent-text); }
.ds-breadcrumb .ds-breadcrumb-current { color: var(--ink-900); font-weight: 700; padding: 3px 6px; }
.ds-breadcrumb .ds-breadcrumb-sep { color: var(--ink-300); }
.ds-header-spacer { flex: 1; }
.ds-header-actions { display: flex; align-items: center; gap: 8px; }
.ds-icon-btn { width: 34px; height: 34px; border-radius: var(--r-md); border: 1px solid #D8E0EA; background: #FFFFFF; color: var(--ink-600); cursor: pointer; display: grid; place-items: center; position: relative; transition: background 120ms, border-color 120ms, color 120ms, box-shadow 120ms, transform 120ms; box-shadow: var(--shadow-xs); }
.ds-icon-btn:hover { background: var(--ink-50); color: var(--accent-text); border-color: #C7D2E1; box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.ds-icon-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
.ds-icon-btn[data-shape="circle"] { border-radius: 50%; }
.ds-icon-btn .ds-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); border: 2px solid var(--paper); }
.ds-header-kbd { display: inline-flex; align-items: center; gap: 2px; padding: 1px 5px; border-radius: 4px; border: 1px solid var(--ink-200); background: var(--ink-50); color: var(--ink-500); font-size: 10.5px; font-family: var(--font-mono); }
.ds-app-topbar { min-height: 64px; padding: 0 24px 0 28px; background: rgba(255,255,255,0.94); border-bottom: var(--hairline); display: flex; align-items: center; gap: 16px; flex-shrink: 0; box-shadow: 0 1px 0 rgba(10,37,64,0.03); backdrop-filter: saturate(140%) blur(12px); }
.ds-app-topbar .ds-breadcrumb { font-size: 13px; }
.ds-app-topbar-spacer { flex: 1; min-width: 16px; }
.ds-app-topbar-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
@media (max-width: 960px) {
  .ds-app-topbar { flex-wrap: wrap; height: auto; padding-top: 10px; padding-bottom: 10px; }
  .ds-app-topbar-spacer { display: none; }
  .ds-app-topbar .ds-search { order: 3; width: 100%; }
}
`;
const Header = ({ crumbs = ["ESP schemas", "EU-RST-220"], env = "STAGING" }) => /* @__PURE__ */ React.createElement("header", { className: "ds-header" }, /* @__PURE__ */ React.createElement("nav", { className: "ds-breadcrumb", "aria-label": "Breadcrumb" }, crumbs.slice(0, -1).map((c, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement("a", null, c), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 12, className: "ds-breadcrumb-sep" }))), /* @__PURE__ */ React.createElement("span", { className: "ds-breadcrumb-current" }, crumbs[crumbs.length - 1])), /* @__PURE__ */ React.createElement("div", { className: "ds-header-spacer" }), /* @__PURE__ */ React.createElement(HeaderSearch, null), /* @__PURE__ */ React.createElement("div", { className: "ds-header-actions" }, /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", title: "Notifications" }, /* @__PURE__ */ React.createElement(Icon, { name: "bell" }), /* @__PURE__ */ React.createElement("span", { className: "ds-dot" })), /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", "data-shape": "circle", title: "Create" }, /* @__PURE__ */ React.createElement(Icon, { name: "plus" })), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "plus" }, "New run")));
const AppTopBar = ({
  crumbs = ["Home"],
  searchPlaceholder = "Search stations, documents, approvals..."
}) => {
  const safeCrumbs = crumbs.length ? crumbs : ["Home"];
  const renderCrumb = (crumb, index) => {
    const label = typeof crumb === "string" ? crumb : crumb.label;
    const onClick = typeof crumb === "string" ? null : crumb.onClick;
    const isLast = index === safeCrumbs.length - 1;
    if (isLast) return /* @__PURE__ */ React.createElement("span", { className: "ds-breadcrumb-current", key: `${label}-${index}` }, label);
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: `${label}-${index}` }, onClick ? /* @__PURE__ */ React.createElement("button", { type: "button", onClick }, label) : /* @__PURE__ */ React.createElement("a", null, label), /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 12, className: "ds-breadcrumb-sep" }));
  };
  return /* @__PURE__ */ React.createElement("header", { className: "ds-app-topbar" }, /* @__PURE__ */ React.createElement("nav", { className: "ds-breadcrumb", "aria-label": "Breadcrumb" }, safeCrumbs.map(renderCrumb)), /* @__PURE__ */ React.createElement("div", { className: "ds-app-topbar-spacer" }), /* @__PURE__ */ React.createElement(HeaderSearch, { placeholder: searchPlaceholder }), /* @__PURE__ */ React.createElement("div", { className: "ds-app-topbar-actions" }, /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", title: "Refresh" }, /* @__PURE__ */ React.createElement(Icon, { name: "refresh", size: 15 })), /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", title: "Notifications" }, /* @__PURE__ */ React.createElement(Icon, { name: "bell", size: 15 }), /* @__PURE__ */ React.createElement("span", { className: "ds-dot" })), /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", "data-shape": "circle", title: "Create" }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 15 }))));
};
const searchCSS = `
.ds-search { position: relative; width: 360px; max-width: 100%; }
.ds-search-input { width: 100%; height: 36px; padding: 0 70px 0 36px; border-radius: var(--r-md); border: 1px solid #D8E0EA; background: #FFFFFF; font-size: 13.5px; outline: none; transition: 120ms; color: var(--ink-900); box-shadow: var(--shadow-xs); }
.ds-search-input::placeholder { color: var(--ink-500); }
.ds-search-input:hover { background: var(--paper); border-color: #C7D2E1; }
.ds-search-input:focus { background: var(--paper); border-color: var(--accent); box-shadow: var(--shadow-focus); }
.ds-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--ink-500); pointer-events: none; }
.ds-search-kbd { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.ds-search-pop { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); box-shadow: var(--shadow-lg); padding: 8px; z-index: 30; }
.ds-search-section { padding: 8px 10px 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-500); font-weight: 600; }
.ds-search-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--r-md); cursor: pointer; font-size: 13px; }
.ds-search-item:hover, .ds-search-item[data-focus="true"] { background: var(--accent-soft); color: var(--accent-text); }
.ds-search-item-icon { width: 24px; height: 24px; border-radius: var(--r-sm); background: var(--accent-soft); display: grid; place-items: center; color: var(--accent-text); }
.ds-search-item-meta { margin-left: auto; font-size: 11px; color: var(--ink-500); font-family: var(--font-mono); }
.ds-search-empty { padding: 24px; text-align: center; color: var(--ink-500); font-size: 13px; }
`;
const HeaderSearch = ({ placeholder = "Search schemas, procedures, runs\u2026" } = {}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        ref.current?.querySelector("input")?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const recents = [
    { icon: "book", label: "Aurangabad \xB7 Station Hub", meta: "station" },
    { icon: "file_check", label: "SIP V1 awaiting approval", meta: "approval" },
    { icon: "layers", label: "ESP V7 approved and frozen", meta: "document" },
    { icon: "train", label: "South Central Railway scope", meta: "zone" }
  ];
  const filtered = q ? recents.filter((r) => r.label.toLowerCase().includes(q.toLowerCase())) : recents;
  return /* @__PURE__ */ React.createElement("div", { className: "ds-search", ref }, /* @__PURE__ */ React.createElement(Icon, { name: "search", className: "ds-search-icon", size: 15 }), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "ds-search-input",
      placeholder,
      value: q,
      onChange: (e) => {
        setQ(e.target.value);
        setOpen(true);
      },
      onFocus: () => setOpen(true)
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "ds-header-kbd ds-search-kbd" }, /* @__PURE__ */ React.createElement(Icon, { name: "command", size: 10 }), "K"), open && /* @__PURE__ */ React.createElement("div", { className: "ds-search-pop" }, /* @__PURE__ */ React.createElement("div", { className: "ds-search-section" }, q ? "Results" : "Recent"), filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "ds-search-empty" }, 'No matches for "', q, '"') : filtered.map((r, i) => /* @__PURE__ */ React.createElement("div", { className: "ds-search-item", key: i, "data-focus": i === 0 }, /* @__PURE__ */ React.createElement("div", { className: "ds-search-item-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: r.icon, size: 14 })), /* @__PURE__ */ React.createElement("span", null, r.label), /* @__PURE__ */ React.createElement("span", { className: "ds-search-item-meta" }, r.meta)))));
};
const filterSearchCSS = `
.ds-fsearch { display: flex; flex-direction: column; gap: 10px; }
.ds-fsearch-row { display: flex; gap: 8px; align-items: center; }
.ds-fsearch-input { position: relative; flex: 1; }
.ds-fsearch-input input { width: 100%; height: 40px; padding: 0 12px 0 38px; border-radius: var(--r-md); border: var(--hairline); background: var(--paper); font-size: 14px; outline: none; }
.ds-fsearch-input input:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.ds-fsearch-input .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-500); }
.ds-fsearch-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.ds-fchip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: var(--r-full); border: var(--hairline); background: var(--paper); font-size: 12.5px; font-weight: 500; color: var(--ink-700); cursor: pointer; }
.ds-fchip:hover { border-color: var(--accent); color: var(--accent-text); }
.ds-fchip[data-active="true"] { background: var(--accent); color: var(--paper); border-color: var(--accent); box-shadow: 0 4px 10px -6px rgba(99,91,255,0.65); }
.ds-fchip-x { display: inline-grid; place-items: center; width: 14px; height: 14px; border-radius: 50%; }
.ds-fchip[data-active="true"] .ds-fchip-x:hover { background: rgba(255,255,255,0.16); }
`;
const FilterSearch = () => {
  const [active, setActive] = useState({ "Status: Active": true, "Region: EU": true });
  const chips = ["Status: Active", "Region: EU", "Schema: Brake", "Owner: any", "Updated: 7d"];
  return /* @__PURE__ */ React.createElement("div", { className: "ds-fsearch" }, /* @__PURE__ */ React.createElement("div", { className: "ds-fsearch-row" }, /* @__PURE__ */ React.createElement("div", { className: "ds-fsearch-input" }, /* @__PURE__ */ React.createElement(Icon, { name: "search" }), /* @__PURE__ */ React.createElement("input", { placeholder: "Filter procedures by ID, line, owner\u2026", defaultValue: "brake assurance" })), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "filter" }, "Filters"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "sort" }, "Sort")), /* @__PURE__ */ React.createElement("div", { className: "ds-fsearch-chips" }, chips.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, className: "ds-fchip", "data-active": !!active[c], onClick: () => setActive((a) => ({ ...a, [c]: !a[c] })) }, /* @__PURE__ */ React.createElement("span", null, c), active[c] && /* @__PURE__ */ React.createElement("span", { className: "ds-fchip-x" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 10 })))), /* @__PURE__ */ React.createElement("button", { className: "ds-fchip", style: { borderStyle: "dashed", color: "var(--ink-500)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "plus", size: 12 }), " Add filter")));
};
const tabsCSS = `
.ds-tabs { display: flex; align-items: center; gap: 4px; border-bottom: var(--hairline); }
.ds-tab { position: relative; padding: 10px 14px; font-size: 13.5px; font-weight: 600; color: var(--ink-500); cursor: pointer; background: transparent; border: none; display: inline-flex; align-items: center; gap: 8px; border-radius: var(--r-sm) var(--r-sm) 0 0; }
.ds-tab:hover { color: var(--accent-text); background: var(--accent-soft); }
.ds-tab[data-active="true"] { color: var(--accent-text); }
.ds-tab[data-active="true"]::after { content: ""; position: absolute; left: 8px; right: 8px; bottom: -1px; height: 2px; background: var(--accent); border-radius: 2px 2px 0 0; }
.ds-tab-count { font-size: 11px; padding: 1px 7px; border-radius: var(--r-full); background: var(--ink-100); color: var(--ink-600); font-weight: 600; font-variant-numeric: tabular-nums; }
.ds-tab[data-active="true"] .ds-tab-count { background: var(--accent); color: var(--paper); }

.ds-pilltabs { display: inline-flex; padding: 3px; background: var(--ink-100); border-radius: var(--r-md); box-shadow: inset 0 0 0 1px rgba(10,37,64,0.04); }
.ds-pilltab { padding: 5px 12px; font-size: 12.5px; font-weight: 600; color: var(--ink-600); border-radius: 6px; cursor: pointer; background: transparent; border: none; }
.ds-pilltab:hover { color: var(--accent-text); }
.ds-pilltab[data-active="true"] { background: var(--paper); color: var(--accent-text); box-shadow: var(--shadow-sm); }
`;
const Tabs = ({ items, active, onChange }) => /* @__PURE__ */ React.createElement("div", { className: "ds-tabs", role: "tablist" }, items.map((it) => /* @__PURE__ */ React.createElement("button", { key: it.id, className: "ds-tab", "data-active": active === it.id, onClick: () => onChange(it.id) }, it.icon && /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 14 }), /* @__PURE__ */ React.createElement("span", null, it.label), it.count != null && /* @__PURE__ */ React.createElement("span", { className: "ds-tab-count" }, it.count))));
const PillTabs = ({ items, active, onChange }) => /* @__PURE__ */ React.createElement("div", { className: "ds-pilltabs", role: "tablist" }, items.map((it) => /* @__PURE__ */ React.createElement("button", { key: it.id, className: "ds-pilltab", "data-active": active === it.id, onClick: () => onChange(it.id) }, it.label)));
window.Sidebar = Sidebar;
window.Header = Header;
window.AppTopBar = AppTopBar;
window.HeaderSearch = HeaderSearch;
window.FilterSearch = FilterSearch;
window.Tabs = Tabs;
window.PillTabs = PillTabs;
window.NAV_CSS = sidebarCSS + headerCSS + searchCSS + filterSearchCSS + tabsCSS;
