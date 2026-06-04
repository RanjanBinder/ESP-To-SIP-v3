const { useState: useStateApp, useEffect: useEffectApp } = React;
const appCSS = `
.gallery { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.gx-nav { background: var(--sidebar-bg); color: var(--paper); border-right: 1px solid rgba(10,37,64,0.32); position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 24px 0; box-shadow: 12px 0 34px -28px rgba(10,37,64,0.9); }
.gx-nav-brand { padding: 0 24px 18px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--sidebar-border); margin-bottom: 16px; }
.gx-nav-brand-mark { width: 26px; height: 26px; border-radius: 7px; background: rgba(255,255,255,0.16); color: var(--paper); display: grid; place-items: center; font-weight: 800; font-family: var(--font-mono); font-size: 11px; position: relative; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16); }
.gx-nav-brand-mark::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 35%, rgba(99,91,255,0.95) 35%, rgba(99,91,255,0.95) 50%, rgba(0,212,255,0.82) 50%, transparent 64%); }
.gx-nav-brand-mark span { position: relative; z-index: 1; }
.gx-nav-brand-title { font-size: 13.5px; font-weight: 800; letter-spacing: 0; color: var(--paper); }
.gx-nav-brand-sub { font-size: 11px; color: var(--sidebar-muted); font-family: var(--font-mono); margin-top: 1px; }
.gx-nav-section { padding: 14px 24px 4px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.58); font-weight: 700; }
.gx-nav-link { display: block; padding: 6px 24px; font-size: 13px; color: rgba(255,255,255,0.76); text-decoration: none; cursor: pointer; border-left: 2px solid transparent; font-weight: 600; }
.gx-nav-link:hover { color: var(--paper); background: rgba(255,255,255,0.10); }
.gx-nav-link[data-active="true"] { color: var(--stripe-blue-900); font-weight: 700; border-left-color: var(--stripe-cyan); background: var(--paper); }
.gx-main { padding: 0; max-width: none; }
.gx-hero { padding: 56px 56px 32px; border-bottom: var(--hairline); background: var(--paper); }
.gx-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 4px 10px; border-radius: var(--r-full); background: var(--ink-100); font-size: 11.5px; font-weight: 600; color: var(--ink-700); letter-spacing: 0.03em; text-transform: uppercase; }
.gx-hero-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.gx-hero-title { font-size: 36px; font-weight: 600; letter-spacing: -0.028em; line-height: 1.1; margin: 16px 0 12px; max-width: 720px; }
.gx-hero-title em { font-style: normal; color: var(--accent); }
.gx-hero-desc { font-size: 15.5px; color: var(--ink-600); line-height: 1.55; max-width: 640px; }
.gx-hero-meta { display: flex; gap: 24px; margin-top: 28px; padding-top: 20px; border-top: var(--hairline); }
.gx-hero-meta-item { display: flex; flex-direction: column; gap: 2px; }
.gx-hero-meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-500); font-weight: 600; }
.gx-hero-meta-value { font-size: 16px; font-weight: 600; color: var(--ink-900); font-variant-numeric: tabular-nums; }

.gx-section { padding: 48px 56px; border-bottom: var(--hairline); }
.gx-section-head { margin-bottom: 28px; }
.gx-section-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-500); font-weight: 600; font-family: var(--font-mono); }
.gx-section-title { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 4px 0 8px; }
.gx-section-desc { font-size: 14px; color: var(--ink-600); max-width: 640px; line-height: 1.55; }

.gx-variant { margin-bottom: 28px; }
.gx-variant-title { font-size: 13px; font-weight: 600; color: var(--ink-700); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.gx-variant-title::before { content: ""; width: 4px; height: 4px; border-radius: 50%; background: var(--ink-400); }
.gx-variant-title .ds-chip { font-size: 10.5px; padding: 1px 6px; }
.gx-stage { position: relative; padding: 28px; background: var(--canvas); border: var(--hairline); border-radius: var(--r-lg); }
.gx-stage[data-pad="sm"] { padding: 18px; }
.gx-stage[data-bg="paper"] { background: var(--paper); }
.gx-stage[data-bg="grid"] {
  background-color: var(--canvas);
  background-image:
    linear-gradient(var(--ink-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--ink-100) 1px, transparent 1px);
  background-size: 24px 24px;
}

.gx-flex { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.gx-flex-lg { gap: 16px; }
.gx-grid { display: grid; gap: 16px; }
.gx-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gx-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gx-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

.gx-divider { height: 1px; background: var(--ink-200); margin: 24px 0; }

/* In-context preview frame */
.gx-frame { background: var(--paper); border: var(--hairline); border-radius: var(--r-xl); overflow: hidden; box-shadow: var(--shadow-md); }
.gx-frame-chrome { height: 28px; background: var(--ink-50); border-bottom: var(--hairline); display: flex; align-items: center; padding: 0 12px; gap: 6px; }
.gx-frame-dot { width: 10px; height: 10px; border-radius: 50%; }
.gx-frame-dot.r { background: oklch(0.7 0.16 25); }
.gx-frame-dot.y { background: oklch(0.82 0.14 78); }
.gx-frame-dot.g { background: oklch(0.74 0.13 145); }
.gx-frame-url { margin-left: 16px; flex: 1; height: 18px; background: var(--paper); border: var(--hairline); border-radius: 4px; font-family: var(--font-mono); font-size: 10.5px; color: var(--ink-500); padding: 0 8px; display: flex; align-items: center; max-width: 360px; }
.gx-frame-body { display: grid; grid-template-columns: 244px 1fr; height: 720px; }
.gx-frame-inner { display: flex; flex-direction: column; overflow: hidden; background: var(--canvas); }
.gx-frame-content { flex: 1; padding: 24px; overflow-y: auto; }

.gx-context-overview { display: grid; gap: 16px; }

/* Live area swatches */
.gx-tokens { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.gx-token { background: var(--paper); border: var(--hairline); border-radius: var(--r-md); padding: 12px; }
.gx-token-swatch { height: 48px; border-radius: var(--r-sm); margin-bottom: 10px; border: 1px solid rgba(14,27,44,0.06); }
.gx-token-name { font-size: 12px; font-weight: 600; }
.gx-token-val { font-size: 11px; font-family: var(--font-mono); color: var(--ink-500); margin-top: 2px; }

.gx-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px 20px; max-width: 640px; }
.gx-form-grid > .span-2 { grid-column: span 2; }

.gx-spec { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: var(--r-sm); background: var(--ink-100); color: var(--ink-700); font-size: 11px; font-family: var(--font-mono); }

.gx-stack { display: flex; flex-direction: column; gap: 10px; }

.gx-doctext { font-size: 13px; color: var(--ink-600); margin-bottom: 12px; line-height: 1.55; max-width: 560px; }
.gx-doctext code { font-family: var(--font-mono); background: var(--ink-100); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
`;
const InContextPreview = () => {
  const [activeTab, setActiveTab] = useStateApp("active");
  const [activeNav, setActiveNav] = useStateApp("schemas");
  return /* @__PURE__ */ React.createElement("div", { className: "gx-frame" }, /* @__PURE__ */ React.createElement("div", { className: "gx-frame-chrome" }, /* @__PURE__ */ React.createElement("span", { className: "gx-frame-dot r" }), /* @__PURE__ */ React.createElement("span", { className: "gx-frame-dot y" }), /* @__PURE__ */ React.createElement("span", { className: "gx-frame-dot g" }), /* @__PURE__ */ React.createElement("div", { className: "gx-frame-url" }, "verge-rail.app/projects/nec/esp-schemas")), /* @__PURE__ */ React.createElement("div", { className: "gx-frame-body" }, /* @__PURE__ */ React.createElement(Sidebar, { active: activeNav, onSelect: setActiveNav }), /* @__PURE__ */ React.createElement("div", { className: "gx-frame-inner" }, /* @__PURE__ */ React.createElement(Header, { crumbs: ["Projects", "Northern Eastern Corridor", "ESP schemas"], env: "STAGING" }), /* @__PURE__ */ React.createElement("div", { className: "gx-frame-content" }, /* @__PURE__ */ React.createElement("div", { className: "gx-context-overview" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 6px" } }, "ESP schemas"), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, color: "var(--ink-500)", fontSize: 13.5, maxWidth: 520 } }, "Engineering Standard Procedures define the contract that each SIP runtime check validates against. Schemas are versioned and inherit from regional baselines.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "download" }, "Export"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "plus" }, "New schema"))), /* @__PURE__ */ React.createElement("div", { className: "gx-grid gx-grid-4" }, /* @__PURE__ */ React.createElement(KPICard, { label: "Active schemas", icon: "layers", value: "248", delta: "+12", deltaDir: "up", meta: "last 30d", spark: [10, 12, 11, 14, 13, 17, 16, 19, 22, 20, 24, 26] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Validation runs (24h)", icon: "branch", value: "1,284", delta: "+8.4%", deltaDir: "up", meta: "vs yesterday", spark: [8, 12, 10, 14, 18, 16, 22, 24, 20, 28, 32, 30] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Pass rate", icon: "check_circle", value: "97.2", unit: "%", delta: "-0.3%", deltaDir: "down", meta: "rolling 7d", spark: [98, 98, 97, 98, 97, 97.2, 97.2] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Open issues", icon: "alert", value: "14", delta: "-3", deltaDir: "up", meta: "resolved today", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", leadingIcon: "alert_tri" }, "attention") })), /* @__PURE__ */ React.createElement(
    Tabs,
    {
      items: [
        { id: "active", label: "Active", count: 6, icon: "layers" },
        { id: "draft", label: "Drafts", count: 12, icon: "edit" },
        { id: "archived", label: "Archived", count: 84 },
        { id: "all", label: "All", count: 248 }
      ],
      active: activeTab,
      onChange: setActiveTab
    }
  ), /* @__PURE__ */ React.createElement(DataTable, null))))));
};
const Section = ({ id, eyebrow, title, desc, children }) => /* @__PURE__ */ React.createElement("section", { id, className: "gx-section" }, /* @__PURE__ */ React.createElement("div", { className: "gx-section-head" }, /* @__PURE__ */ React.createElement("div", { className: "gx-section-eyebrow" }, eyebrow), /* @__PURE__ */ React.createElement("h2", { className: "gx-section-title" }, title), desc && /* @__PURE__ */ React.createElement("p", { className: "gx-section-desc" }, desc)), children);
const Variant = ({ title, spec, children, bg, pad }) => /* @__PURE__ */ React.createElement("div", { className: "gx-variant" }, /* @__PURE__ */ React.createElement("div", { className: "gx-variant-title" }, /* @__PURE__ */ React.createElement("span", null, title), spec && /* @__PURE__ */ React.createElement("span", { className: "gx-spec" }, spec)), /* @__PURE__ */ React.createElement("div", { className: "gx-stage", "data-bg": bg, "data-pad": pad }, children));
const App = () => {
  const [active, setActive] = useStateApp("preview");
  const [modal, setModal] = useStateApp(null);
  useEffectApp(() => {
    const sections = ["preview", "foundations", "sidebar", "header", "search", "kpi", "upload", "tables", "tabs", "chips", "stepper", "empty", "modal", "validation", "buttons", "fields"];
    const onScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = [
    { group: "Overview", items: [
      { id: "preview", label: "In-context preview" },
      { id: "foundations", label: "Foundations" }
    ] },
    { group: "Navigation", items: [
      { id: "sidebar", label: "Sidebar" },
      { id: "header", label: "Header" },
      { id: "search", label: "Search bar" },
      { id: "tabs", label: "Tabs" }
    ] },
    { group: "Data display", items: [
      { id: "kpi", label: "KPI cards" },
      { id: "tables", label: "Data tables" },
      { id: "chips", label: "Status chips" },
      { id: "stepper", label: "Stepper" }
    ] },
    { group: "Actions & input", items: [
      { id: "buttons", label: "Buttons" },
      { id: "fields", label: "Form fields" },
      { id: "upload", label: "Upload cards" },
      { id: "modal", label: "Modal" },
      { id: "validation", label: "Validation panel" },
      { id: "empty", label: "Empty states" }
    ] }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "gallery" }, /* @__PURE__ */ React.createElement("nav", { className: "gx-nav" }, /* @__PURE__ */ React.createElement("div", { className: "gx-nav-brand" }, /* @__PURE__ */ React.createElement("div", { className: "gx-nav-brand-mark" }, /* @__PURE__ */ React.createElement("span", null, "ES")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gx-nav-brand-title" }, "Verge\xB7Rail DS"), /* @__PURE__ */ React.createElement("div", { className: "gx-nav-brand-sub" }, "v0.4 \xB7 2026.05"))), nav.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.group }, /* @__PURE__ */ React.createElement("div", { className: "gx-nav-section" }, g.group), g.items.map((it) => /* @__PURE__ */ React.createElement("a", { key: it.id, href: `#${it.id}`, className: "gx-nav-link", "data-active": active === it.id }, it.label))))), /* @__PURE__ */ React.createElement("main", { className: "gx-main" }, /* @__PURE__ */ React.createElement("section", { className: "gx-hero" }, /* @__PURE__ */ React.createElement("span", { className: "gx-hero-eyebrow" }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), "Component library \xB7 v0.4"), /* @__PURE__ */ React.createElement("h1", { className: "gx-hero-title" }, "A working surface for railway ", /* @__PURE__ */ React.createElement("em", null, "ESP \u2192 SIP"), " automation."), /* @__PURE__ */ React.createElement("p", { className: "gx-hero-desc" }, "The Verge\xB7Rail design system is built for the operators, conformance engineers, and reliability teams who turn engineering standards into runtime procedures. Precise, calm, and dense by design \u2014 every component is designed to survive a 14-hour shift."), /* @__PURE__ */ React.createElement("div", { className: "gx-hero-meta" }, /* @__PURE__ */ React.createElement("div", { className: "gx-hero-meta-item" }, /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-label" }, "Components"), /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-value" }, "42")), /* @__PURE__ */ React.createElement("div", { className: "gx-hero-meta-item" }, /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-label" }, "Tokens"), /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-value" }, "186")), /* @__PURE__ */ React.createElement("div", { className: "gx-hero-meta-item" }, /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-label" }, "Coverage"), /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-value" }, "A11y AA")), /* @__PURE__ */ React.createElement("div", { className: "gx-hero-meta-item" }, /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-label" }, "Updated"), /* @__PURE__ */ React.createElement("span", { className: "gx-hero-meta-value" }, "May 16")))), /* @__PURE__ */ React.createElement(Section, { id: "preview", eyebrow: "01 \xB7 Live system", title: "In context", desc: "A composed view showing sidebar, header, search, tabs, KPI cards and the data table working together in a real schema-management screen." }, /* @__PURE__ */ React.createElement(InContextPreview, null)), /* @__PURE__ */ React.createElement(Section, { id: "foundations", eyebrow: "02 \xB7 Foundations", title: "Color & type", desc: "Stripe-inspired blue shell with a focused violet action system. Inter for UI, JetBrains Mono for IDs, file paths, and structural data." }, /* @__PURE__ */ React.createElement(Variant, { title: "Brand surfaces & ink scale" }, /* @__PURE__ */ React.createElement("div", { className: "gx-tokens" }, [
    ["Canvas", "var(--canvas)", "#F6F9FC"],
    ["Paper", "var(--paper)", "#FFFFFF"],
    ["Ink 50", "var(--ink-50)", "#F6F9FC"],
    ["Ink 100", "var(--ink-100)", "#EEF3F8"],
    ["Ink 200", "var(--ink-200)", "#E3E8EE"],
    ["Ink 500", "var(--ink-500)", "#697386"],
    ["Ink 800", "var(--ink-800)", "#1B3A57"],
    ["Ink 900", "var(--ink-900)", "#0A2540"]
  ].map(([n, v, h]) => /* @__PURE__ */ React.createElement("div", { key: n, className: "gx-token" }, /* @__PURE__ */ React.createElement("div", { className: "gx-token-swatch", style: { background: v } }), /* @__PURE__ */ React.createElement("div", { className: "gx-token-name" }, n), /* @__PURE__ */ React.createElement("div", { className: "gx-token-val" }, h))))), /* @__PURE__ */ React.createElement(Variant, { title: "Semantic palette" }, /* @__PURE__ */ React.createElement("div", { className: "gx-tokens" }, [
    ["Accent", "var(--accent)", "#635BFF"],
    ["Success", "var(--success)", "oklch(0.62 0.13 155)"],
    ["Warning", "var(--warning)", "oklch(0.78 0.13 78)"],
    ["Danger", "var(--danger)", "oklch(0.60 0.18 25)"],
    ["Info", "var(--info)", "oklch(0.62 0.13 240)"]
  ].map(([n, v, c]) => /* @__PURE__ */ React.createElement("div", { key: n, className: "gx-token" }, /* @__PURE__ */ React.createElement("div", { className: "gx-token-swatch", style: { background: v } }), /* @__PURE__ */ React.createElement("div", { className: "gx-token-name" }, n), /* @__PURE__ */ React.createElement("div", { className: "gx-token-val" }, c))))), /* @__PURE__ */ React.createElement(Variant, { title: "Type pairing" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gx-token-val", style: { marginBottom: 8 } }, "Inter \xB7 UI"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15 } }, "Brake assurance \xB7 EU-RST"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--ink-600)", marginTop: 6, maxWidth: 380 } }, "Defines coupling-force envelopes for class 700 and 745 rolling stock. Inherits from baseline EU-RST-200.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "gx-token-val", style: { marginBottom: 8 } }, "JetBrains Mono \xB7 Data"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 14, lineHeight: 1.6, color: "var(--ink-800)" } }, /* @__PURE__ */ React.createElement("div", null, "ESP-220-A1 \xB7 v3.4.1"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-500)" } }, "rule RST.brake.001 \xB7 pass"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent-text)" } }, "coverage 96.4% \xB7 drift 0.31")))))), /* @__PURE__ */ React.createElement(Section, { id: "sidebar", eyebrow: "03 \xB7 Navigation", title: "Sidebar", desc: "Primary navigation. Groups workspace, automation, and admin areas. Persists project context and the signed-in operator." }, /* @__PURE__ */ React.createElement(Variant, { title: "Default", pad: "sm" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 244, height: 560, border: "var(--hairline)", borderRadius: "var(--r-lg)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(Sidebar, { active: "schemas" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, paddingTop: 12 } }, /* @__PURE__ */ React.createElement("p", { className: "gx-doctext" }, "Use the sidebar for top-level destinations only. Counts on items reflect actionable scope \u2014 ", /* @__PURE__ */ React.createElement("code", null, "open"), ", not ", /* @__PURE__ */ React.createElement("code", null, "total"), ". The active state uses a white pill on the blue rail for high contrast."), /* @__PURE__ */ React.createElement("div", { className: "gx-stack" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", dot: true }, "3 groups"), /* @__PURE__ */ React.createElement(Chip, { tone: "accent", dot: true }, "1 accent badge"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Fixed width 244px")), /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement("span", { className: "gx-spec" }, "font 13.5px / weight 500"), /* @__PURE__ */ React.createElement("span", { className: "gx-spec" }, "radius 8px"), /* @__PURE__ */ React.createElement("span", { className: "gx-spec" }, "pad 7\xD710"))))))), /* @__PURE__ */ React.createElement(Section, { id: "header", eyebrow: "04 \xB7 Navigation", title: "Header", desc: "Combines breadcrumb, environment indicator, global search, notification controls, and a primary action. Use the env chip to make the current environment unmissable." }, /* @__PURE__ */ React.createElement(Variant, { title: "Default \u2014 STAGING" }, /* @__PURE__ */ React.createElement("div", { style: { border: "var(--hairline)", borderRadius: "var(--r-lg)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(Header, { crumbs: ["Projects", "Northern Eastern Corridor", "ESP schemas"], env: "STAGING" }))), /* @__PURE__ */ React.createElement(Variant, { title: "Production \u2014 guard rails on" }, /* @__PURE__ */ React.createElement("div", { style: { border: "var(--hairline)", borderRadius: "var(--r-lg)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(Header, { crumbs: ["Projects", "Iberian Network", "Run #4827"], env: "PRODUCTION" })))), /* @__PURE__ */ React.createElement(Section, { id: "search", eyebrow: "05 \xB7 Navigation", title: "Search", desc: "Two surfaces. The header search is a command-K entry point for everything. The filter search is contextual to a list, with chip filters that stack." }, /* @__PURE__ */ React.createElement(Variant, { title: "Header search \xB7 with recents popover", bg: "paper" }, /* @__PURE__ */ React.createElement("div", { style: { width: 360 } }, /* @__PURE__ */ React.createElement(HeaderSearch, null))), /* @__PURE__ */ React.createElement(Variant, { title: "Filter search \xB7 contextual", bg: "paper" }, /* @__PURE__ */ React.createElement(FilterSearch, null))), /* @__PURE__ */ React.createElement(Section, { id: "kpi", eyebrow: "06 \xB7 Data", title: "KPI cards", desc: "Compact metric cards. Pair a quantitative value with delta direction, a temporal hint, and an inline sparkline. Use the dark variant sparingly \u2014 it announces emphasis." }, /* @__PURE__ */ React.createElement("div", { className: "gx-grid gx-grid-4", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(KPICard, { label: "Active schemas", icon: "layers", value: "248", delta: "+12", deltaDir: "up", meta: "last 30d", spark: [10, 12, 11, 14, 13, 17, 16, 19, 22, 20, 24, 26] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Validation runs (24h)", icon: "branch", value: "1,284", delta: "+8.4%", deltaDir: "up", meta: "vs yesterday", spark: [8, 12, 10, 14, 18, 16, 22, 24, 20, 28, 32, 30] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Pass rate", icon: "check_circle", value: "97.2", unit: "%", delta: "-0.3%", deltaDir: "down", meta: "rolling 7d", spark: [98, 98, 97, 98, 97, 97.2, 97.2] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Open issues", icon: "alert", value: "14", delta: "-3", deltaDir: "up", meta: "resolved today", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", leadingIcon: "alert_tri" }, "attention") })), /* @__PURE__ */ React.createElement("div", { className: "gx-grid gx-grid-3" }, /* @__PURE__ */ React.createElement(KPICard, { variant: "dark", label: "Coverage", icon: "shield", value: "87.4", unit: "%", delta: "+1.2%", deltaDir: "up", meta: "across 248 schemas", spark: [80, 82, 83, 85, 84, 86, 87.4] }), /* @__PURE__ */ React.createElement(KPICard, { label: "Mean run time", icon: "clock", value: "4.21", unit: "s", delta: "-0.4s", deltaDir: "up", meta: "p95: 9.1s" }), /* @__PURE__ */ React.createElement(KPICard, { label: "Failed runs", icon: "alert", value: "3", delta: "0", deltaDir: "flat", meta: "last 24h", chip: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", dot: true }, "blocking") }))), /* @__PURE__ */ React.createElement(Section, { id: "upload", eyebrow: "07 \xB7 Input", title: "Upload cards", desc: "The drop zone is the entry point for an upload session; file cards represent each artifact and surface its parse state inline. Status chips track the upload through validation." }, /* @__PURE__ */ React.createElement(Variant, { title: "Drop zone", bg: "paper" }, /* @__PURE__ */ React.createElement(UploadCard, null)), /* @__PURE__ */ React.createElement(Variant, { title: "File states", bg: "paper" }, /* @__PURE__ */ React.createElement("div", { className: "gx-stack" }, /* @__PURE__ */ React.createElement(FileCard, { name: "EU-RST-220-brake-assurance.esp", ext: "ESP", size: "284 KB", meta: "14 classes \xB7 142 assertions", status: "uploaded" }), /* @__PURE__ */ React.createElement(FileCard, { name: "pantograph-geometry-EN50367.yaml", ext: "YAML", size: "48 KB", meta: "parsing dependencies\u2026", status: "uploading", progress: 68 }), /* @__PURE__ */ React.createElement(FileCard, { name: "traction-inverter-telemetry.xml", ext: "XML", size: "1.2 MB", meta: "line 84 \u2014 invalid attribute", status: "error" }), /* @__PURE__ */ React.createElement(FileCard, { name: "door-cycle-SIP-08.zip", ext: "ZIP", size: "412 KB", meta: "3 files \xB7 partial baseline", status: "warning" })))), /* @__PURE__ */ React.createElement(Section, { id: "tables", eyebrow: "08 \xB7 Data", title: "Data tables", desc: "Sortable, selectable, with inline status. The toolbar swaps to a bulk-action mode when rows are selected \u2014 never two competing toolbars." }, /* @__PURE__ */ React.createElement(DataTable, null)), /* @__PURE__ */ React.createElement(Section, { id: "tabs", eyebrow: "09 \xB7 Navigation", title: "Tabs", desc: "Underline tabs for primary in-page navigation; pill tabs for view-mode toggles where space is tight." }, /* @__PURE__ */ React.createElement(Variant, { title: "Underline \xB7 with counts" }, /* @__PURE__ */ React.createElement(
    Tabs,
    {
      items: [
        { id: "active", label: "Active", count: 6, icon: "layers" },
        { id: "draft", label: "Drafts", count: 12, icon: "edit" },
        { id: "archived", label: "Archived", count: 84 },
        { id: "all", label: "All", count: 248 }
      ],
      active: "active",
      onChange: () => {
      }
    }
  )), /* @__PURE__ */ React.createElement(Variant, { title: "Pill \xB7 view-mode" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex gx-flex-lg" }, /* @__PURE__ */ React.createElement(PillTabs, { items: [{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }], active: "week", onChange: () => {
  } }), /* @__PURE__ */ React.createElement(PillTabs, { items: [{ id: "list", label: "List" }, { id: "graph", label: "Graph" }], active: "list", onChange: () => {
  } })))), /* @__PURE__ */ React.createElement(Section, { id: "chips", eyebrow: "10 \xB7 Data", title: "Status chips", desc: "The vocabulary for state. Use solid for emphasis (single hero status per row), soft otherwise. Pulsing dot for live activity only." }, /* @__PURE__ */ React.createElement(Variant, { title: "Soft \xB7 default" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", leadingIcon: "check" }, "Passed"), /* @__PURE__ */ React.createElement(Chip, { tone: "success", dot: true }, "Active"), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", leadingIcon: "alert_tri" }, "3 warnings"), /* @__PURE__ */ React.createElement(Chip, { tone: "danger", leadingIcon: "alert" }, "Failed"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", pulse: true }, "Running"), /* @__PURE__ */ React.createElement(Chip, { tone: "accent", leadingIcon: "flag" }, "Flagged"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Draft"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", dot: true }, "Idle"))), /* @__PURE__ */ React.createElement(Variant, { title: "Solid \xB7 emphasis" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", variant: "solid", leadingIcon: "check" }, "Conformant"), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", variant: "solid" }, "Action required"), /* @__PURE__ */ React.createElement(Chip, { tone: "danger", variant: "solid", leadingIcon: "alert" }, "Blocking"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", variant: "solid" }, "Live"), /* @__PURE__ */ React.createElement(Chip, { tone: "accent", variant: "solid" }, "Production"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", variant: "solid" }, "Archived"))), /* @__PURE__ */ React.createElement(Variant, { title: "Size" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", leadingIcon: "check" }, "Default"), /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "lg", leadingIcon: "check" }, "Large")))), /* @__PURE__ */ React.createElement(Section, { id: "stepper", eyebrow: "11 \xB7 Data", title: "Stepper", desc: "Communicates progress through a multi-step procedure. Use the horizontal stepper for guided wizards; the vertical stepper for timelined run logs." }, /* @__PURE__ */ React.createElement(Variant, { title: "Horizontal \xB7 wizard", bg: "paper" }, /* @__PURE__ */ React.createElement(
    Stepper,
    {
      current: 2,
      steps: [
        { label: "Source", sub: "ESP file uploaded" },
        { label: "Mapping", sub: "Fields reconciled" },
        { label: "Validation", sub: "Rules running\u2026" },
        { label: "Review", sub: "Pending approval" },
        { label: "Publish", sub: "Awaiting sign-off" }
      ]
    }
  )), /* @__PURE__ */ React.createElement(Variant, { title: "Vertical \xB7 run log", bg: "paper" }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 480 } }, /* @__PURE__ */ React.createElement(
    StepperVertical,
    {
      current: 3,
      steps: [
        { state: "done", label: "Schema compiled", sub: "EU-RST-220 \u2192 IR \xB7 142 assertions", meta: ["08:14:02", "1.04s"] },
        { state: "done", label: "Baseline diff resolved", sub: "Inherits from EU-RST-200", meta: ["08:14:03", "0.18s"] },
        { state: "done", label: "Static analysis", sub: "1 warning carried forward", meta: ["08:14:03", "0.62s"] },
        { state: "error", label: "Conformance check", sub: "Brake force assertion missing for class 745", meta: ["08:14:04", "0.31s"] },
        { state: "pending", label: "Coverage report", sub: "Waiting for previous step" },
        { state: "pending", label: "Publish artifact", sub: "Manual approval required" }
      ]
    }
  )))), /* @__PURE__ */ React.createElement(Section, { id: "buttons", eyebrow: "12 \xB7 Action", title: "Buttons", desc: "Ink primary for the single most important action on a surface. Accent is reserved for marketing or production-affecting actions. Ghost for low-emphasis row actions." }, /* @__PURE__ */ React.createElement(Variant, { title: "Variants" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary" }, "Primary"), /* @__PURE__ */ React.createElement(Btn, { variant: "accent" }, "Accent"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary" }, "Secondary"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost" }, "Ghost"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger" }, "Danger"), /* @__PURE__ */ React.createElement(Btn, { variant: "link" }, "Link action \u2192"))), /* @__PURE__ */ React.createElement(Variant, { title: "Sizes" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "lg", leadingIcon: "play" }, "Run procedure"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "play" }, "Run procedure"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", leadingIcon: "play" }, "Run"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "xs" }, "XS"))), /* @__PURE__ */ React.createElement(Variant, { title: "With icons" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "plus" }, "New schema"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "upload" }, "Upload"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", trailingIcon: "chevron_down" }, "Environment"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", leadingIcon: "refresh" }, "Refresh"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", leadingIcon: "trash", danger: true }, "Delete"))), /* @__PURE__ */ React.createElement(Variant, { title: "Icon-only & loading" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", iconOnly: true, leadingIcon: "edit" }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", iconOnly: true, leadingIcon: "copy" }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", iconOnly: true, leadingIcon: "trash" }), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", iconOnly: true, leadingIcon: "more" }), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", loading: true }, "Running"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", disabled: true }, "Disabled"))), /* @__PURE__ */ React.createElement(Variant, { title: "Groups" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement("div", { className: "ds-btn-group" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "chevrons_left", iconOnly: true }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "chevron_left", iconOnly: true }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "chevron_right", iconOnly: true })), /* @__PURE__ */ React.createElement("div", { className: "ds-btn-split" }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", leadingIcon: "play" }, "Run on staging"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", iconOnly: true, leadingIcon: "chevron_down" }))))), /* @__PURE__ */ React.createElement(Section, { id: "fields", eyebrow: "13 \xB7 Input", title: "Form fields", desc: "A consistent 36px control height anchors the form. Use mono prefix/suffix for units. Help text is for instruction; error text replaces it on failure." }, /* @__PURE__ */ React.createElement("div", { className: "gx-form-grid" }, /* @__PURE__ */ React.createElement(Field, { label: "Schema ID", required: true, help: "Used as the canonical identifier across runs." }, /* @__PURE__ */ React.createElement(TextInput, { leadingIcon: "layers", defaultValue: "EU-RST-220" })), /* @__PURE__ */ React.createElement(Field, { label: "Display name", required: true }, /* @__PURE__ */ React.createElement(TextInput, { defaultValue: "Brake assurance \u2014 EU rolling stock" })), /* @__PURE__ */ React.createElement(Field, { label: "Tolerance band", help: "Acceptable deviation against baseline." }, /* @__PURE__ */ React.createElement(TextInput, { defaultValue: "0.4", prefix: "\xB1", suffix: "mm" })), /* @__PURE__ */ React.createElement(Field, { label: "Region", required: true }, /* @__PURE__ */ React.createElement(Select, { defaultValue: "eu" }, /* @__PURE__ */ React.createElement("option", { value: "eu" }, "Northern Eastern Corridor"), /* @__PURE__ */ React.createElement("option", { value: "ib" }, "Iberia"), /* @__PURE__ */ React.createElement("option", { value: "dach" }, "DACH"), /* @__PURE__ */ React.createElement("option", { value: "sca" }, "Scandinavia"))), /* @__PURE__ */ React.createElement(Field, { label: "Coverage threshold", optional: true }, /* @__PURE__ */ React.createElement(TextInput, { defaultValue: "95", suffix: "%" })), /* @__PURE__ */ React.createElement(Field, { label: "Validation profile", error: "Profile not found in catalog" }, /* @__PURE__ */ React.createElement(TextInput, { invalid: true, defaultValue: "EN-50367-strict-mode-2025" })), /* @__PURE__ */ React.createElement(Field, { label: "Description", optional: true, className: "span-2" }, /* @__PURE__ */ React.createElement(Textarea, { defaultValue: "Defines coupling-force envelopes for class 700 and class 745. Inherits from baseline EU-RST-200; supersedes EU-RST-219.", rows: 3 }))), /* @__PURE__ */ React.createElement("div", { className: "gx-divider" }), /* @__PURE__ */ React.createElement(Variant, { title: "Choice controls", bg: "paper" }, /* @__PURE__ */ React.createElement("div", { className: "gx-stack" }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex gx-flex-lg" }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Toggle, { checked: true }), " ", /* @__PURE__ */ React.createElement("span", null, "Strict mode")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Toggle, { checked: false }), " ", /* @__PURE__ */ React.createElement("span", null, "Auto-publish on pass")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Checkbox, { checked: true }), " ", /* @__PURE__ */ React.createElement("span", null, "Inherit baseline")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Checkbox, { indeterminate: true }), " ", /* @__PURE__ */ React.createElement("span", null, "Selected child rules")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Radio, { checked: true }), " ", /* @__PURE__ */ React.createElement("span", null, "Replace")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Radio, null), " ", /* @__PURE__ */ React.createElement("span", null, "Append"))), /* @__PURE__ */ React.createElement("div", { className: "gx-grid gx-grid-3", style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement(RadioCard, { checked: true, icon: "branch", title: "Pull request", desc: "Open a review before merging the schema to baseline." }), /* @__PURE__ */ React.createElement(RadioCard, { icon: "play", title: "Direct apply", desc: "Apply immediately. Suitable for hotfix branches only." }), /* @__PURE__ */ React.createElement(RadioCard, { icon: "clock", title: "Scheduled", desc: "Apply in the next maintenance window." }))))), /* @__PURE__ */ React.createElement(Section, { id: "modal", eyebrow: "14 \xB7 Overlay", title: "Modal", desc: "A single focal task or destructive confirmation. Always title the modal with a verb; secondary describes the consequence; the footer left-slot is for a guard rail like 'cannot be undone'." }, /* @__PURE__ */ React.createElement("div", { className: "gx-flex" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => setModal("confirm") }, "Open confirm"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => setModal("create") }, "Open create form"))), /* @__PURE__ */ React.createElement(Section, { id: "validation", eyebrow: "15 \xB7 Data", title: "Validation panel", desc: "The artifact at the end of a run. Counts are headline-first; errors are surfaced with file, line, and rule \u2014 the three pieces an engineer needs to act." }, /* @__PURE__ */ React.createElement(ValidationPanel, null)), /* @__PURE__ */ React.createElement(Section, { id: "empty", eyebrow: "16 \xB7 State", title: "Empty states", desc: "The first-mile of a feature. State why it's empty, then give the single best next action." }, /* @__PURE__ */ React.createElement("div", { className: "gx-grid gx-grid-3" }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      kind: "inbox",
      title: "No procedures yet",
      description: "Upload an ESP schema or duplicate a baseline to create your first procedure for this corridor.",
      primary: "New procedure",
      secondary: "Import baseline"
    }
  ), /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      kind: "search",
      title: "No matching runs",
      description: "Try widening the date range or removing the \u201CFailed only\u201D filter.",
      primary: "Clear filters"
    }
  ), /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      kind: "track",
      title: "No fleet attached",
      description: "Connect a fleet inventory to surface unit-level conformance dashboards.",
      primary: "Connect fleet",
      secondary: "Read docs"
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: "32px 56px 64px", color: "var(--ink-500)", fontSize: 12.5, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, "Verge\xB7Rail Design System \xB7 v0.4 \xB7 2026.05.16"), /* @__PURE__ */ React.createElement("span", { className: "mono" }, "\xA9 Verge \xB7 all marks placeholder"))), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: modal === "confirm",
      onClose: () => setModal(null),
      icon: "alert_tri",
      iconTone: "danger",
      title: "Archive 6 schemas?",
      subtitle: "Archived schemas are kept for 90 days, then permanently removed.",
      footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "ds-modal-foot-left" }, /* @__PURE__ */ React.createElement(Icon, { name: "info", size: 13 }), /* @__PURE__ */ React.createElement("span", null, "Dependent procedures will be paused.")), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setModal(null) }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", leadingIcon: "trash" }, "Archive 6 schemas"))
    },
    /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.55 } }, "You're about to archive the following schemas. Any open validation runs against them will be cancelled."),
    /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, border: "var(--hairline)", borderRadius: "var(--r-md)", overflow: "hidden" } }, ["ESP-220-A1 \xB7 Brake assurance \u2014 EU-RST", "ESP-118-C3 \xB7 Pantograph inspection", "ESP-441-B2 \xB7 Door cycle conformance", "ESP-302-F1 \xB7 Traction inverter telemetry", "ESP-093-A2 \xB7 Wheelset profile baseline", "ESP-560-D1 \xB7 HVAC envelope sweep"].map((r, i, a) => /* @__PURE__ */ React.createElement("div", { key: r, style: { padding: "8px 12px", display: "flex", justifyContent: "space-between", borderBottom: i < a.length - 1 ? "var(--hairline)" : "none", fontSize: 13, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { color: "var(--ink-700)", fontSize: 12.5 } }, r), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "will pause"))))
  ), /* @__PURE__ */ React.createElement(
    Modal,
    {
      open: modal === "create",
      onClose: () => setModal(null),
      icon: "plus",
      iconTone: "accent",
      title: "Create new ESP schema",
      subtitle: "Schemas live inside the active project and can inherit from a regional baseline.",
      size: "lg",
      footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setModal(null) }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary" }, "Save as draft"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary" }, "Create schema"))
    },
    /* @__PURE__ */ React.createElement("div", { className: "gx-form-grid", style: { maxWidth: "none" } }, /* @__PURE__ */ React.createElement(Field, { label: "Schema ID", required: true, help: "Auto-suggested from region & sequence." }, /* @__PURE__ */ React.createElement(TextInput, { leadingIcon: "layers", defaultValue: "EU-RST-249" })), /* @__PURE__ */ React.createElement(Field, { label: "Display name", required: true }, /* @__PURE__ */ React.createElement(TextInput, { placeholder: "e.g. Brake assurance" })), /* @__PURE__ */ React.createElement(Field, { label: "Region", required: true }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "Northern Eastern Corridor"), /* @__PURE__ */ React.createElement("option", null, "Iberia"))), /* @__PURE__ */ React.createElement(Field, { label: "Baseline" }, /* @__PURE__ */ React.createElement(Select, null, /* @__PURE__ */ React.createElement("option", null, "EU-RST-200 (recommended)"), /* @__PURE__ */ React.createElement("option", null, "None \u2014 start blank"))), /* @__PURE__ */ React.createElement(Field, { label: "Description", optional: true }, /* @__PURE__ */ React.createElement(Textarea, { placeholder: "What does this schema verify?", rows: 3 })), /* @__PURE__ */ React.createElement(Field, { label: "Approval" }, /* @__PURE__ */ React.createElement("div", { className: "gx-stack" }, /* @__PURE__ */ React.createElement(RadioCard, { checked: true, icon: "branch", title: "Pull request", desc: "Open a review before merging." }), /* @__PURE__ */ React.createElement(RadioCard, { icon: "play", title: "Direct apply", desc: "Apply immediately. Hotfix only." }))))
  ));
};
const styleEl = document.createElement("style");
styleEl.textContent = window.NAV_CSS + window.DATA_CSS + window.FORM_CSS + appCSS;
document.head.appendChild(styleEl);
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
