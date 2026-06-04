// Gallery shell — section nav + component showcase
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

/* In-context preview — what an app screen looks like */
const InContextPreview = () => {
  const [activeTab, setActiveTab] = useStateApp("active");
  const [activeNav, setActiveNav] = useStateApp("schemas");
  return (
    <div className="gx-frame">
      <div className="gx-frame-chrome">
        <span className="gx-frame-dot r"/><span className="gx-frame-dot y"/><span className="gx-frame-dot g"/>
        <div className="gx-frame-url">verge-rail.app/projects/nec/esp-schemas</div>
      </div>
      <div className="gx-frame-body">
        <Sidebar active={activeNav} onSelect={setActiveNav} />
        <div className="gx-frame-inner">
          <Header crumbs={["Projects", "Northern Eastern Corridor", "ESP schemas"]} env="STAGING" />
          <div className="gx-frame-content">
            <div className="gx-context-overview">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:24}}>
                <div>
                  <h1 style={{fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 6px"}}>ESP schemas</h1>
                  <p style={{margin: 0, color: "var(--ink-500)", fontSize: 13.5, maxWidth: 520}}>
                    Engineering Standard Procedures define the contract that each SIP runtime check validates against. Schemas are versioned and inherit from regional baselines.
                  </p>
                </div>
                <div style={{display: "flex", gap: 8}}>
                  <Btn variant="secondary" leadingIcon="download">Export</Btn>
                  <Btn variant="primary" leadingIcon="plus">New schema</Btn>
                </div>
              </div>
              <div className="gx-grid gx-grid-4">
                <KPICard label="Active schemas" icon="layers" value="248" delta="+12" deltaDir="up" meta="last 30d" spark={[10,12,11,14,13,17,16,19,22,20,24,26]} />
                <KPICard label="Validation runs (24h)" icon="branch" value="1,284" delta="+8.4%" deltaDir="up" meta="vs yesterday" spark={[8,12,10,14,18,16,22,24,20,28,32,30]} />
                <KPICard label="Pass rate" icon="check_circle" value="97.2" unit="%" delta="-0.3%" deltaDir="down" meta="rolling 7d" spark={[98,98,97,98,97,97.2,97.2]} />
                <KPICard label="Open issues" icon="alert" value="14" delta="-3" deltaDir="up" meta="resolved today" chip={<Chip tone="warning" leadingIcon="alert_tri">attention</Chip>} />
              </div>
              <Tabs
                items={[
                  { id: "active",   label: "Active",   count: 6,  icon: "layers" },
                  { id: "draft",    label: "Drafts",   count: 12, icon: "edit" },
                  { id: "archived", label: "Archived", count: 84 },
                  { id: "all",      label: "All",      count: 248 },
                ]}
                active={activeTab}
                onChange={setActiveTab}
              />
              <DataTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ id, eyebrow, title, desc, children }) => (
  <section id={id} className="gx-section">
    <div className="gx-section-head">
      <div className="gx-section-eyebrow">{eyebrow}</div>
      <h2 className="gx-section-title">{title}</h2>
      {desc && <p className="gx-section-desc">{desc}</p>}
    </div>
    {children}
  </section>
);

const Variant = ({ title, spec, children, bg, pad }) => (
  <div className="gx-variant">
    <div className="gx-variant-title">
      <span>{title}</span>
      {spec && <span className="gx-spec">{spec}</span>}
    </div>
    <div className="gx-stage" data-bg={bg} data-pad={pad}>{children}</div>
  </div>
);

const App = () => {
  const [active, setActive] = useStateApp("preview");
  const [modal, setModal] = useStateApp(null);

  useEffectApp(() => {
    const sections = ["preview", "foundations", "sidebar", "header", "search", "kpi", "upload", "tables", "tabs", "chips", "stepper", "empty", "modal", "validation", "buttons", "fields"];
    const onScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) { setActive(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { group: "Overview", items: [
      { id: "preview", label: "In-context preview" },
      { id: "foundations", label: "Foundations" },
    ]},
    { group: "Navigation", items: [
      { id: "sidebar", label: "Sidebar" },
      { id: "header", label: "Header" },
      { id: "search", label: "Search bar" },
      { id: "tabs", label: "Tabs" },
    ]},
    { group: "Data display", items: [
      { id: "kpi", label: "KPI cards" },
      { id: "tables", label: "Data tables" },
      { id: "chips", label: "Status chips" },
      { id: "stepper", label: "Stepper" },
    ]},
    { group: "Actions & input", items: [
      { id: "buttons", label: "Buttons" },
      { id: "fields", label: "Form fields" },
      { id: "upload", label: "Upload cards" },
      { id: "modal", label: "Modal" },
      { id: "validation", label: "Validation panel" },
      { id: "empty", label: "Empty states" },
    ]},
  ];

  return (
    <div className="gallery">
      <nav className="gx-nav">
        <div className="gx-nav-brand">
          <div className="gx-nav-brand-mark"><span>ES</span></div>
          <div>
            <div className="gx-nav-brand-title">Verge·Rail DS</div>
            <div className="gx-nav-brand-sub">v0.4 · 2026.05</div>
          </div>
        </div>
        {nav.map(g => (
          <div key={g.group}>
            <div className="gx-nav-section">{g.group}</div>
            {g.items.map(it => (
              <a key={it.id} href={`#${it.id}`} className="gx-nav-link" data-active={active === it.id}>{it.label}</a>
            ))}
          </div>
        ))}
      </nav>

      <main className="gx-main">
        {/* Hero */}
        <section className="gx-hero">
          <span className="gx-hero-eyebrow"><span className="dot"/>Component library · v0.4</span>
          <h1 className="gx-hero-title">A working surface for railway <em>ESP → SIP</em> automation.</h1>
          <p className="gx-hero-desc">
            The Verge·Rail design system is built for the operators, conformance engineers, and reliability teams who turn engineering standards into runtime procedures. Precise, calm, and dense by design — every component is designed to survive a 14-hour shift.
          </p>
          <div className="gx-hero-meta">
            <div className="gx-hero-meta-item"><span className="gx-hero-meta-label">Components</span><span className="gx-hero-meta-value">42</span></div>
            <div className="gx-hero-meta-item"><span className="gx-hero-meta-label">Tokens</span><span className="gx-hero-meta-value">186</span></div>
            <div className="gx-hero-meta-item"><span className="gx-hero-meta-label">Coverage</span><span className="gx-hero-meta-value">A11y AA</span></div>
            <div className="gx-hero-meta-item"><span className="gx-hero-meta-label">Updated</span><span className="gx-hero-meta-value">May 16</span></div>
          </div>
        </section>

        <Section id="preview" eyebrow="01 · Live system" title="In context" desc="A composed view showing sidebar, header, search, tabs, KPI cards and the data table working together in a real schema-management screen.">
          <InContextPreview />
        </Section>

        <Section id="foundations" eyebrow="02 · Foundations" title="Color & type" desc="Stripe-inspired blue shell with a focused violet action system. Inter for UI, JetBrains Mono for IDs, file paths, and structural data.">
          <Variant title="Brand surfaces & ink scale">
            <div className="gx-tokens">
              {[
                ["Canvas", "var(--canvas)", "#F6F9FC"],
                ["Paper", "var(--paper)", "#FFFFFF"],
                ["Ink 50", "var(--ink-50)", "#F6F9FC"],
                ["Ink 100", "var(--ink-100)", "#EEF3F8"],
                ["Ink 200", "var(--ink-200)", "#E3E8EE"],
                ["Ink 500", "var(--ink-500)", "#697386"],
                ["Ink 800", "var(--ink-800)", "#1B3A57"],
                ["Ink 900", "var(--ink-900)", "#0A2540"],
              ].map(([n,v,h]) => (
                <div key={n} className="gx-token">
                  <div className="gx-token-swatch" style={{background: v}} />
                  <div className="gx-token-name">{n}</div>
                  <div className="gx-token-val">{h}</div>
                </div>
              ))}
            </div>
          </Variant>
          <Variant title="Semantic palette">
            <div className="gx-tokens">
              {[
                ["Accent", "var(--accent)", "#635BFF"],
                ["Success", "var(--success)", "oklch(0.62 0.13 155)"],
                ["Warning", "var(--warning)", "oklch(0.78 0.13 78)"],
                ["Danger", "var(--danger)", "oklch(0.60 0.18 25)"],
                ["Info", "var(--info)", "oklch(0.62 0.13 240)"],
              ].map(([n,v,c]) => (
                <div key={n} className="gx-token">
                  <div className="gx-token-swatch" style={{background: v}} />
                  <div className="gx-token-name">{n}</div>
                  <div className="gx-token-val">{c}</div>
                </div>
              ))}
            </div>
          </Variant>
          <Variant title="Type pairing">
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:24}}>
              <div>
                <div className="gx-token-val" style={{marginBottom: 8}}>Inter · UI</div>
                <div style={{fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15}}>Brake assurance · EU-RST</div>
                <div style={{fontSize: 14, color: "var(--ink-600)", marginTop: 6, maxWidth: 380}}>Defines coupling-force envelopes for class 700 and 745 rolling stock. Inherits from baseline EU-RST-200.</div>
              </div>
              <div>
                <div className="gx-token-val" style={{marginBottom: 8}}>JetBrains Mono · Data</div>
                <div className="mono" style={{fontSize: 14, lineHeight: 1.6, color: "var(--ink-800)"}}>
                  <div>ESP-220-A1 · v3.4.1</div>
                  <div style={{color:"var(--ink-500)"}}>rule RST.brake.001 · pass</div>
                  <div style={{color:"var(--accent-text)"}}>coverage 96.4% · drift 0.31</div>
                </div>
              </div>
            </div>
          </Variant>
        </Section>

        <Section id="sidebar" eyebrow="03 · Navigation" title="Sidebar" desc="Primary navigation. Groups workspace, automation, and admin areas. Persists project context and the signed-in operator.">
          <Variant title="Default" pad="sm">
            <div style={{display:"flex", gap: 24, alignItems: "flex-start"}}>
              <div style={{width: 244, height: 560, border: "var(--hairline)", borderRadius: "var(--r-lg)", overflow: "hidden"}}>
                <Sidebar active="schemas" />
              </div>
              <div style={{flex: 1, paddingTop: 12}}>
                <p className="gx-doctext">Use the sidebar for top-level destinations only. Counts on items reflect actionable scope — <code>open</code>, not <code>total</code>. The active state uses a white pill on the blue rail for high contrast.</p>
                <div className="gx-stack">
                  <div className="gx-flex"><Chip tone="neutral" dot>3 groups</Chip><Chip tone="accent" dot>1 accent badge</Chip><Chip tone="neutral">Fixed width 244px</Chip></div>
                  <div className="gx-flex"><span className="gx-spec">font 13.5px / weight 500</span><span className="gx-spec">radius 8px</span><span className="gx-spec">pad 7×10</span></div>
                </div>
              </div>
            </div>
          </Variant>
        </Section>

        <Section id="header" eyebrow="04 · Navigation" title="Header" desc="Combines breadcrumb, environment indicator, global search, notification controls, and a primary action. Use the env chip to make the current environment unmissable.">
          <Variant title="Default — STAGING">
            <div style={{border:"var(--hairline)", borderRadius: "var(--r-lg)", overflow:"hidden"}}>
              <Header crumbs={["Projects", "Northern Eastern Corridor", "ESP schemas"]} env="STAGING" />
            </div>
          </Variant>
          <Variant title="Production — guard rails on">
            <div style={{border:"var(--hairline)", borderRadius: "var(--r-lg)", overflow:"hidden"}}>
              <Header crumbs={["Projects", "Iberian Network", "Run #4827"]} env="PRODUCTION" />
            </div>
          </Variant>
        </Section>

        <Section id="search" eyebrow="05 · Navigation" title="Search" desc="Two surfaces. The header search is a command-K entry point for everything. The filter search is contextual to a list, with chip filters that stack.">
          <Variant title="Header search · with recents popover" bg="paper">
            <div style={{width: 360}}><HeaderSearch /></div>
          </Variant>
          <Variant title="Filter search · contextual" bg="paper">
            <FilterSearch />
          </Variant>
        </Section>

        <Section id="kpi" eyebrow="06 · Data" title="KPI cards" desc="Compact metric cards. Pair a quantitative value with delta direction, a temporal hint, and an inline sparkline. Use the dark variant sparingly — it announces emphasis.">
          <div className="gx-grid gx-grid-4" style={{marginBottom: 16}}>
            <KPICard label="Active schemas" icon="layers" value="248" delta="+12" deltaDir="up" meta="last 30d" spark={[10,12,11,14,13,17,16,19,22,20,24,26]} />
            <KPICard label="Validation runs (24h)" icon="branch" value="1,284" delta="+8.4%" deltaDir="up" meta="vs yesterday" spark={[8,12,10,14,18,16,22,24,20,28,32,30]} />
            <KPICard label="Pass rate" icon="check_circle" value="97.2" unit="%" delta="-0.3%" deltaDir="down" meta="rolling 7d" spark={[98,98,97,98,97,97.2,97.2]} />
            <KPICard label="Open issues" icon="alert" value="14" delta="-3" deltaDir="up" meta="resolved today" chip={<Chip tone="warning" leadingIcon="alert_tri">attention</Chip>} />
          </div>
          <div className="gx-grid gx-grid-3">
            <KPICard variant="dark" label="Coverage" icon="shield" value="87.4" unit="%" delta="+1.2%" deltaDir="up" meta="across 248 schemas" spark={[80,82,83,85,84,86,87.4]} />
            <KPICard label="Mean run time" icon="clock" value="4.21" unit="s" delta="-0.4s" deltaDir="up" meta="p95: 9.1s" />
            <KPICard label="Failed runs" icon="alert" value="3" delta="0" deltaDir="flat" meta="last 24h" chip={<Chip tone="danger" dot>blocking</Chip>} />
          </div>
        </Section>

        <Section id="upload" eyebrow="07 · Input" title="Upload cards" desc="The drop zone is the entry point for an upload session; file cards represent each artifact and surface its parse state inline. Status chips track the upload through validation.">
          <Variant title="Drop zone" bg="paper">
            <UploadCard />
          </Variant>
          <Variant title="File states" bg="paper">
            <div className="gx-stack">
              <FileCard name="EU-RST-220-brake-assurance.esp" ext="ESP" size="284 KB" meta="14 classes · 142 assertions" status="uploaded" />
              <FileCard name="pantograph-geometry-EN50367.yaml" ext="YAML" size="48 KB" meta="parsing dependencies…" status="uploading" progress={68} />
              <FileCard name="traction-inverter-telemetry.xml" ext="XML" size="1.2 MB" meta="line 84 — invalid attribute" status="error" />
              <FileCard name="door-cycle-SIP-08.zip" ext="ZIP" size="412 KB" meta="3 files · partial baseline" status="warning" />
            </div>
          </Variant>
        </Section>

        <Section id="tables" eyebrow="08 · Data" title="Data tables" desc="Sortable, selectable, with inline status. The toolbar swaps to a bulk-action mode when rows are selected — never two competing toolbars.">
          <DataTable />
        </Section>

        <Section id="tabs" eyebrow="09 · Navigation" title="Tabs" desc="Underline tabs for primary in-page navigation; pill tabs for view-mode toggles where space is tight.">
          <Variant title="Underline · with counts">
            <Tabs
              items={[
                { id: "active",   label: "Active",   count: 6,  icon: "layers" },
                { id: "draft",    label: "Drafts",   count: 12, icon: "edit" },
                { id: "archived", label: "Archived", count: 84 },
                { id: "all",      label: "All",      count: 248 },
              ]}
              active="active"
              onChange={() => {}}
            />
          </Variant>
          <Variant title="Pill · view-mode">
            <div className="gx-flex gx-flex-lg">
              <PillTabs items={[{id:"day",label:"Day"},{id:"week",label:"Week"},{id:"month",label:"Month"}]} active="week" onChange={()=>{}} />
              <PillTabs items={[{id:"list",label:"List"},{id:"graph",label:"Graph"}]} active="list" onChange={()=>{}} />
            </div>
          </Variant>
        </Section>

        <Section id="chips" eyebrow="10 · Data" title="Status chips" desc="The vocabulary for state. Use solid for emphasis (single hero status per row), soft otherwise. Pulsing dot for live activity only.">
          <Variant title="Soft · default">
            <div className="gx-flex">
              <Chip tone="success" leadingIcon="check">Passed</Chip>
              <Chip tone="success" dot>Active</Chip>
              <Chip tone="warning" leadingIcon="alert_tri">3 warnings</Chip>
              <Chip tone="danger" leadingIcon="alert">Failed</Chip>
              <Chip tone="info" pulse>Running</Chip>
              <Chip tone="accent" leadingIcon="flag">Flagged</Chip>
              <Chip tone="neutral">Draft</Chip>
              <Chip tone="neutral" dot>Idle</Chip>
            </div>
          </Variant>
          <Variant title="Solid · emphasis">
            <div className="gx-flex">
              <Chip tone="success" variant="solid" leadingIcon="check">Conformant</Chip>
              <Chip tone="warning" variant="solid">Action required</Chip>
              <Chip tone="danger" variant="solid" leadingIcon="alert">Blocking</Chip>
              <Chip tone="info" variant="solid">Live</Chip>
              <Chip tone="accent" variant="solid">Production</Chip>
              <Chip tone="neutral" variant="solid">Archived</Chip>
            </div>
          </Variant>
          <Variant title="Size">
            <div className="gx-flex">
              <Chip tone="success" leadingIcon="check">Default</Chip>
              <Chip tone="success" size="lg" leadingIcon="check">Large</Chip>
            </div>
          </Variant>
        </Section>

        <Section id="stepper" eyebrow="11 · Data" title="Stepper" desc="Communicates progress through a multi-step procedure. Use the horizontal stepper for guided wizards; the vertical stepper for timelined run logs.">
          <Variant title="Horizontal · wizard" bg="paper">
            <Stepper
              current={2}
              steps={[
                { label: "Source", sub: "ESP file uploaded" },
                { label: "Mapping", sub: "Fields reconciled" },
                { label: "Validation", sub: "Rules running…" },
                { label: "Review", sub: "Pending approval" },
                { label: "Publish", sub: "Awaiting sign-off" },
              ]}
            />
          </Variant>
          <Variant title="Vertical · run log" bg="paper">
            <div style={{maxWidth: 480}}>
              <StepperVertical
                current={3}
                steps={[
                  { state: "done", label: "Schema compiled", sub: "EU-RST-220 → IR · 142 assertions",  meta: ["08:14:02", "1.04s"] },
                  { state: "done", label: "Baseline diff resolved", sub: "Inherits from EU-RST-200", meta: ["08:14:03", "0.18s"] },
                  { state: "done", label: "Static analysis", sub: "1 warning carried forward", meta: ["08:14:03", "0.62s"] },
                  { state: "error", label: "Conformance check", sub: "Brake force assertion missing for class 745", meta: ["08:14:04", "0.31s"] },
                  { state: "pending", label: "Coverage report", sub: "Waiting for previous step" },
                  { state: "pending", label: "Publish artifact", sub: "Manual approval required" },
                ]}
              />
            </div>
          </Variant>
        </Section>

        <Section id="buttons" eyebrow="12 · Action" title="Buttons" desc="Ink primary for the single most important action on a surface. Accent is reserved for marketing or production-affecting actions. Ghost for low-emphasis row actions.">
          <Variant title="Variants">
            <div className="gx-flex">
              <Btn variant="primary">Primary</Btn>
              <Btn variant="accent">Accent</Btn>
              <Btn variant="secondary">Secondary</Btn>
              <Btn variant="ghost">Ghost</Btn>
              <Btn variant="danger">Danger</Btn>
              <Btn variant="link">Link action →</Btn>
            </div>
          </Variant>
          <Variant title="Sizes">
            <div className="gx-flex">
              <Btn variant="primary" size="lg" leadingIcon="play">Run procedure</Btn>
              <Btn variant="primary" leadingIcon="play">Run procedure</Btn>
              <Btn variant="primary" size="sm" leadingIcon="play">Run</Btn>
              <Btn variant="primary" size="xs">XS</Btn>
            </div>
          </Variant>
          <Variant title="With icons">
            <div className="gx-flex">
              <Btn variant="primary" leadingIcon="plus">New schema</Btn>
              <Btn variant="secondary" leadingIcon="upload">Upload</Btn>
              <Btn variant="secondary" trailingIcon="chevron_down">Environment</Btn>
              <Btn variant="ghost" leadingIcon="refresh">Refresh</Btn>
              <Btn variant="ghost" leadingIcon="trash" danger>Delete</Btn>
            </div>
          </Variant>
          <Variant title="Icon-only & loading">
            <div className="gx-flex">
              <Btn variant="secondary" iconOnly leadingIcon="edit" />
              <Btn variant="secondary" iconOnly leadingIcon="copy" />
              <Btn variant="secondary" iconOnly leadingIcon="trash" />
              <Btn variant="ghost" iconOnly leadingIcon="more" />
              <Btn variant="primary" loading>Running</Btn>
              <Btn variant="secondary" disabled>Disabled</Btn>
            </div>
          </Variant>
          <Variant title="Groups">
            <div className="gx-flex">
              <div className="ds-btn-group">
                <Btn variant="secondary" leadingIcon="chevrons_left" iconOnly />
                <Btn variant="secondary" leadingIcon="chevron_left" iconOnly />
                <Btn variant="secondary" leadingIcon="chevron_right" iconOnly />
              </div>
              <div className="ds-btn-split">
                <Btn variant="primary" leadingIcon="play">Run on staging</Btn>
                <Btn variant="primary" iconOnly leadingIcon="chevron_down" />
              </div>
            </div>
          </Variant>
        </Section>

        <Section id="fields" eyebrow="13 · Input" title="Form fields" desc="A consistent 36px control height anchors the form. Use mono prefix/suffix for units. Help text is for instruction; error text replaces it on failure.">
          <div className="gx-form-grid">
            <Field label="Schema ID" required help="Used as the canonical identifier across runs.">
              <TextInput leadingIcon="layers" defaultValue="EU-RST-220" />
            </Field>
            <Field label="Display name" required>
              <TextInput defaultValue="Brake assurance — EU rolling stock" />
            </Field>
            <Field label="Tolerance band" help="Acceptable deviation against baseline.">
              <TextInput defaultValue="0.4" prefix="±" suffix="mm" />
            </Field>
            <Field label="Region" required>
              <Select defaultValue="eu">
                <option value="eu">Northern Eastern Corridor</option>
                <option value="ib">Iberia</option>
                <option value="dach">DACH</option>
                <option value="sca">Scandinavia</option>
              </Select>
            </Field>
            <Field label="Coverage threshold" optional>
              <TextInput defaultValue="95" suffix="%" />
            </Field>
            <Field label="Validation profile" error="Profile not found in catalog">
              <TextInput invalid defaultValue="EN-50367-strict-mode-2025" />
            </Field>
            <Field label="Description" optional className="span-2">
              <Textarea defaultValue="Defines coupling-force envelopes for class 700 and class 745. Inherits from baseline EU-RST-200; supersedes EU-RST-219." rows={3} />
            </Field>
          </div>
          <div className="gx-divider" />
          <Variant title="Choice controls" bg="paper">
            <div className="gx-stack">
              <div className="gx-flex gx-flex-lg">
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Toggle checked={true} /> <span>Strict mode</span></label>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Toggle checked={false} /> <span>Auto-publish on pass</span></label>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Checkbox checked={true} /> <span>Inherit baseline</span></label>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Checkbox indeterminate /> <span>Selected child rules</span></label>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Radio checked={true}/> <span>Replace</span></label>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><Radio /> <span>Append</span></label>
              </div>
              <div className="gx-grid gx-grid-3" style={{marginTop: 8}}>
                <RadioCard checked icon="branch" title="Pull request" desc="Open a review before merging the schema to baseline." />
                <RadioCard icon="play" title="Direct apply" desc="Apply immediately. Suitable for hotfix branches only." />
                <RadioCard icon="clock" title="Scheduled" desc="Apply in the next maintenance window." />
              </div>
            </div>
          </Variant>
        </Section>

        <Section id="modal" eyebrow="14 · Overlay" title="Modal" desc="A single focal task or destructive confirmation. Always title the modal with a verb; secondary describes the consequence; the footer left-slot is for a guard rail like 'cannot be undone'.">
          <div className="gx-flex">
            <Btn variant="secondary" onClick={() => setModal("confirm")}>Open confirm</Btn>
            <Btn variant="secondary" onClick={() => setModal("create")}>Open create form</Btn>
          </div>
        </Section>

        <Section id="validation" eyebrow="15 · Data" title="Validation panel" desc="The artifact at the end of a run. Counts are headline-first; errors are surfaced with file, line, and rule — the three pieces an engineer needs to act.">
          <ValidationPanel />
        </Section>

        <Section id="empty" eyebrow="16 · State" title="Empty states" desc="The first-mile of a feature. State why it's empty, then give the single best next action.">
          <div className="gx-grid gx-grid-3">
            <EmptyState
              kind="inbox"
              title="No procedures yet"
              description="Upload an ESP schema or duplicate a baseline to create your first procedure for this corridor."
              primary="New procedure"
              secondary="Import baseline"
            />
            <EmptyState
              kind="search"
              title="No matching runs"
              description="Try widening the date range or removing the “Failed only” filter."
              primary="Clear filters"
            />
            <EmptyState
              kind="track"
              title="No fleet attached"
              description="Connect a fleet inventory to surface unit-level conformance dashboards."
              primary="Connect fleet"
              secondary="Read docs"
            />
          </div>
        </Section>

        <div style={{padding: "32px 56px 64px", color:"var(--ink-500)", fontSize: 12.5, display:"flex", justifyContent:"space-between"}}>
          <span>Verge·Rail Design System · v0.4 · 2026.05.16</span>
          <span className="mono">© Verge · all marks placeholder</span>
        </div>
      </main>

      {/* Modals */}
      <Modal
        open={modal === "confirm"}
        onClose={() => setModal(null)}
        icon="alert_tri"
        iconTone="danger"
        title="Archive 6 schemas?"
        subtitle="Archived schemas are kept for 90 days, then permanently removed."
        footer={
          <>
            <div className="ds-modal-foot-left">
              <Icon name="info" size={13} />
              <span>Dependent procedures will be paused.</span>
            </div>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" leadingIcon="trash">Archive 6 schemas</Btn>
          </>
        }
      >
        <p style={{margin: 0, fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.55}}>
          You're about to archive the following schemas. Any open validation runs against them will be cancelled.
        </p>
        <div style={{marginTop: 14, border:"var(--hairline)", borderRadius:"var(--r-md)", overflow:"hidden"}}>
          {["ESP-220-A1 · Brake assurance — EU-RST","ESP-118-C3 · Pantograph inspection","ESP-441-B2 · Door cycle conformance","ESP-302-F1 · Traction inverter telemetry","ESP-093-A2 · Wheelset profile baseline","ESP-560-D1 · HVAC envelope sweep"].map((r, i, a) => (
            <div key={r} style={{padding:"8px 12px", display:"flex", justifyContent:"space-between", borderBottom: i < a.length - 1 ? "var(--hairline)" : "none", fontSize:13, alignItems:"center"}}>
              <span className="mono" style={{color:"var(--ink-700)", fontSize: 12.5}}>{r}</span>
              <Chip tone="neutral" size="sm">will pause</Chip>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modal === "create"}
        onClose={() => setModal(null)}
        icon="plus"
        iconTone="accent"
        title="Create new ESP schema"
        subtitle="Schemas live inside the active project and can inherit from a regional baseline."
        size="lg"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="secondary">Save as draft</Btn>
            <Btn variant="primary">Create schema</Btn>
          </>
        }
      >
        <div className="gx-form-grid" style={{maxWidth: "none"}}>
          <Field label="Schema ID" required help="Auto-suggested from region & sequence."><TextInput leadingIcon="layers" defaultValue="EU-RST-249" /></Field>
          <Field label="Display name" required><TextInput placeholder="e.g. Brake assurance" /></Field>
          <Field label="Region" required>
            <Select><option>Northern Eastern Corridor</option><option>Iberia</option></Select>
          </Field>
          <Field label="Baseline">
            <Select><option>EU-RST-200 (recommended)</option><option>None — start blank</option></Select>
          </Field>
          <Field label="Description" optional>
            <Textarea placeholder="What does this schema verify?" rows={3} />
          </Field>
          <Field label="Approval">
            <div className="gx-stack">
              <RadioCard checked icon="branch" title="Pull request" desc="Open a review before merging." />
              <RadioCard icon="play" title="Direct apply" desc="Apply immediately. Hotfix only." />
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  );
};

const styleEl = document.createElement("style");
styleEl.textContent = window.NAV_CSS + window.DATA_CSS + window.FORM_CSS + appCSS;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
