const { useState: useStateData } = React;
const chipCSS = `
.ds-chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: var(--r-full); font-size: 12px; font-weight: 600; letter-spacing: 0.005em; line-height: 1.5; border: 1px solid transparent; white-space: nowrap; }
.ds-chip-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ds-chip[data-tone="success"] { background: var(--success-soft); color: var(--success-text); border-color: oklch(0.9 0.06 155); }
.ds-chip[data-tone="success"] .ds-chip-dot { background: var(--success); }
.ds-chip[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); border-color: oklch(0.9 0.08 80); }
.ds-chip[data-tone="warning"] .ds-chip-dot { background: var(--warning); }
.ds-chip[data-tone="danger"] { background: var(--danger-soft); color: var(--danger-text); border-color: oklch(0.9 0.07 25); }
.ds-chip[data-tone="danger"] .ds-chip-dot { background: var(--danger); }
.ds-chip[data-tone="info"] { background: var(--info-soft); color: var(--info-text); border-color: oklch(0.9 0.06 240); }
.ds-chip[data-tone="info"] .ds-chip-dot { background: var(--info); }
.ds-chip[data-tone="accent"] { background: var(--accent-soft); color: var(--accent-text); border-color: color-mix(in srgb, var(--accent) 22%, var(--accent-soft)); }
.ds-chip[data-tone="accent"] .ds-chip-dot { background: var(--accent); }
.ds-chip[data-tone="neutral"] { background: var(--ink-100); color: var(--ink-700); border-color: var(--ink-200); }
.ds-chip[data-tone="neutral"] .ds-chip-dot { background: var(--ink-500); }
.ds-chip[data-size="lg"] { font-size: 13px; padding: 4px 12px; }
.ds-chip[data-variant="solid"] { border: none; }
.ds-chip[data-variant="solid"][data-tone="success"] { background: var(--success); color: white; }
.ds-chip[data-variant="solid"][data-tone="warning"] { background: var(--warning); color: var(--ink-900); }
.ds-chip[data-variant="solid"][data-tone="danger"] { background: var(--danger); color: white; }
.ds-chip[data-variant="solid"][data-tone="info"] { background: var(--info); color: white; }
.ds-chip[data-variant="solid"][data-tone="accent"] { background: var(--accent); color: white; }
.ds-chip[data-variant="solid"][data-tone="neutral"] { background: var(--ink-800); color: white; }
.ds-chip-pulse { width: 6px; height: 6px; position: relative; }
.ds-chip-pulse::before { content: ""; position: absolute; inset: 0; border-radius: 50%; background: currentColor; }
.ds-chip-pulse::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: currentColor; animation: dsPulse 1.6s infinite; opacity: 0.6; }
@keyframes dsPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.6); opacity: 0; } }
`;
const Chip = ({ tone = "neutral", variant, size, dot, pulse, leadingIcon, children }) => /* @__PURE__ */ React.createElement("span", { className: "ds-chip", "data-tone": tone, "data-variant": variant, "data-size": size }, pulse ? /* @__PURE__ */ React.createElement("span", { className: "ds-chip-pulse", style: { color: `var(--${tone === "neutral" ? "ink-500" : tone})` } }) : dot && /* @__PURE__ */ React.createElement("span", { className: "ds-chip-dot" }), leadingIcon && /* @__PURE__ */ React.createElement(Icon, { name: leadingIcon, size: 11 }), children);
const kpiCSS = `
.ds-kpi { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 18px; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; transition: 150ms; box-shadow: var(--shadow-xs); }
.ds-kpi:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.ds-kpi-head { display: flex; align-items: center; gap: 8px; color: var(--ink-500); font-size: 12.5px; font-weight: 500; }
.ds-kpi-head .icon { color: var(--ink-400); }
.ds-kpi-value { font-size: 30px; font-weight: 600; letter-spacing: -0.025em; color: var(--ink-900); font-variant-numeric: tabular-nums; line-height: 1.1; margin-top: 4px; }
.ds-kpi-unit { font-size: 16px; font-weight: 500; color: var(--ink-500); margin-left: 4px; }
.ds-kpi-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; gap: 10px; }
.ds-kpi-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ds-kpi-delta[data-dir="up"] { color: var(--success-text); }
.ds-kpi-delta[data-dir="down"] { color: var(--danger-text); }
.ds-kpi-delta[data-dir="flat"] { color: var(--ink-500); }
.ds-kpi-spark { height: 32px; width: 90px; }
.ds-kpi-spark path { fill: none; stroke: var(--accent); stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.ds-kpi-spark .fill { fill: var(--accent-soft); stroke: none; opacity: 0.6; }
.ds-kpi-meta { font-size: 12px; color: var(--ink-500); }
.ds-kpi[data-variant="dark"] { background: linear-gradient(180deg, var(--stripe-blue-800), var(--stripe-blue-900)); color: var(--paper); border-color: var(--stripe-blue-900); }
.ds-kpi[data-variant="dark"] .ds-kpi-head, .ds-kpi[data-variant="dark"] .ds-kpi-meta { color: var(--ink-300); }
.ds-kpi[data-variant="dark"] .ds-kpi-value { color: var(--paper); }
.ds-kpi[data-variant="dark"] .ds-kpi-head .icon { color: var(--ink-400); }
.ds-kpi-bigchip { position: absolute; top: 16px; right: 16px; }
`;
const Sparkline = ({ data, height = 32, width = 90, area = true }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 2;
  const range = max - min || 1;
  const points = data.map((d, i) => [pad + i * (width - pad * 2) / (data.length - 1), height - pad - (d - min) / range * (height - pad * 2)]);
  const path = "M " + points.map((p) => p.join(",")).join(" L ");
  const fill = `M ${points[0][0]},${height} L ${points.map((p) => p.join(",")).join(" L ")} L ${points[points.length - 1][0]},${height} Z`;
  return /* @__PURE__ */ React.createElement("svg", { className: "ds-kpi-spark", viewBox: `0 0 ${width} ${height}` }, area && /* @__PURE__ */ React.createElement("path", { className: "fill", d: fill }), /* @__PURE__ */ React.createElement("path", { d: path }));
};
const KPICard = ({ label, icon, value, unit, delta, deltaDir = "up", spark, meta, variant, chip }) => /* @__PURE__ */ React.createElement("div", { className: "ds-kpi", "data-variant": variant }, chip && /* @__PURE__ */ React.createElement("div", { className: "ds-kpi-bigchip" }, chip), /* @__PURE__ */ React.createElement("div", { className: "ds-kpi-head" }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 14 }), /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement("div", { className: "ds-kpi-value tabular" }, value, unit && /* @__PURE__ */ React.createElement("span", { className: "ds-kpi-unit" }, unit)), /* @__PURE__ */ React.createElement("div", { className: "ds-kpi-foot" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, delta != null && /* @__PURE__ */ React.createElement("span", { className: "ds-kpi-delta", "data-dir": deltaDir }, /* @__PURE__ */ React.createElement(Icon, { name: deltaDir === "up" ? "arrow_up" : deltaDir === "down" ? "arrow_down" : "arrow_right", size: 11 }), delta), meta && /* @__PURE__ */ React.createElement("span", { className: "ds-kpi-meta" }, meta)), spark && /* @__PURE__ */ React.createElement(Sparkline, { data: spark })));
const stepperCSS = `
.ds-stepper { display: flex; align-items: stretch; gap: 0; }
.ds-step { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; padding-right: 24px; position: relative; }
.ds-step:last-child { padding-right: 0; }
.ds-step-head { display: flex; align-items: center; gap: 10px; }
.ds-step-circle { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; flex-shrink: 0; transition: 150ms; }
.ds-step[data-state="pending"] .ds-step-circle { background: var(--paper); color: var(--ink-500); border: 1.5px solid var(--ink-200); }
.ds-step[data-state="active"] .ds-step-circle { background: var(--accent); color: var(--paper); border: 1.5px solid var(--accent); box-shadow: var(--shadow-focus); }
.ds-step[data-state="done"] .ds-step-circle { background: var(--accent); color: var(--paper); border: 1.5px solid var(--accent); }
.ds-step[data-state="error"] .ds-step-circle { background: var(--danger-soft); color: var(--danger-text); border: 1.5px solid var(--danger); }
.ds-step-bar { flex: 1; height: 2px; background: var(--ink-200); border-radius: 1px; position: relative; overflow: hidden; }
.ds-step-bar-fill { position: absolute; inset: 0 auto 0 0; background: var(--accent); transition: width 300ms ease; }
.ds-step[data-state="done"] .ds-step-bar-fill { width: 100%; }
.ds-step[data-state="active"] .ds-step-bar-fill { width: 50%; }
.ds-step-body { padding-left: 36px; }
.ds-step-label { font-size: 13px; font-weight: 600; color: var(--ink-900); letter-spacing: -0.005em; }
.ds-step[data-state="pending"] .ds-step-label { color: var(--ink-500); font-weight: 500; }
.ds-step-sub { font-size: 12px; color: var(--ink-500); margin-top: 2px; }

.ds-stepper-vert { display: flex; flex-direction: column; gap: 0; }
.ds-step-vert { display: grid; grid-template-columns: 28px 1fr; gap: 12px 14px; padding-bottom: 14px; position: relative; }
.ds-step-vert:not(:last-child)::before { content: ""; position: absolute; left: 13px; top: 28px; bottom: 0; width: 2px; background: var(--ink-200); }
.ds-step-vert[data-state="done"]:not(:last-child)::before { background: var(--accent); }
.ds-step-vert-circle { grid-row: 1; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; background: var(--paper); border: 1.5px solid var(--ink-200); color: var(--ink-500); z-index: 1; }
.ds-step-vert[data-state="done"] .ds-step-vert-circle { background: var(--accent); color: var(--paper); border-color: var(--accent); }
.ds-step-vert[data-state="active"] .ds-step-vert-circle { background: var(--accent); color: var(--paper); border-color: var(--accent); box-shadow: var(--shadow-focus); }
.ds-step-vert[data-state="error"] .ds-step-vert-circle { background: var(--danger-soft); border-color: var(--danger); color: var(--danger-text); }
.ds-step-vert-body .ds-step-label { font-size: 14px; }
.ds-step-vert-meta { display: flex; gap: 12px; margin-top: 4px; font-size: 11.5px; color: var(--ink-500); font-family: var(--font-mono); }
`;
const Stepper = ({ steps, current }) => /* @__PURE__ */ React.createElement("div", { className: "ds-stepper" }, steps.map((s, i) => {
  const state = s.state || (i < current ? "done" : i === current ? "active" : "pending");
  return /* @__PURE__ */ React.createElement("div", { key: i, className: "ds-step", "data-state": state }, /* @__PURE__ */ React.createElement("div", { className: "ds-step-head" }, /* @__PURE__ */ React.createElement("div", { className: "ds-step-circle" }, state === "done" ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13 }) : state === "error" ? /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 13 }) : i + 1), i < steps.length - 1 && /* @__PURE__ */ React.createElement("div", { className: "ds-step-bar" }, /* @__PURE__ */ React.createElement("div", { className: "ds-step-bar-fill" }))), /* @__PURE__ */ React.createElement("div", { className: "ds-step-body" }, /* @__PURE__ */ React.createElement("div", { className: "ds-step-label" }, s.label), s.sub && /* @__PURE__ */ React.createElement("div", { className: "ds-step-sub" }, s.sub)));
}));
const StepperVertical = ({ steps, current }) => /* @__PURE__ */ React.createElement("div", { className: "ds-stepper-vert" }, steps.map((s, i) => {
  const state = s.state || (i < current ? "done" : i === current ? "active" : "pending");
  return /* @__PURE__ */ React.createElement("div", { key: i, className: "ds-step-vert", "data-state": state }, /* @__PURE__ */ React.createElement("div", { className: "ds-step-vert-circle" }, state === "done" ? /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 13 }) : state === "error" ? /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 13 }) : i + 1), /* @__PURE__ */ React.createElement("div", { className: "ds-step-vert-body" }, /* @__PURE__ */ React.createElement("div", { className: "ds-step-label" }, s.label), s.sub && /* @__PURE__ */ React.createElement("div", { className: "ds-step-sub" }, s.sub), s.meta && /* @__PURE__ */ React.createElement("div", { className: "ds-step-vert-meta" }, s.meta.map((m, j) => /* @__PURE__ */ React.createElement("span", { key: j }, m)))));
}));
const tableCSS = `
.ds-table-wrap { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-xs); }
.ds-table-toolbar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: var(--hairline); background: linear-gradient(180deg, #FFFFFF, var(--ink-50)); }
.ds-table-toolbar-title { font-size: 14px; font-weight: 600; }
.ds-table-toolbar-count { font-size: 12px; color: var(--ink-500); font-variant-numeric: tabular-nums; }
.ds-table-toolbar-spacer { flex: 1; }
.ds-table-scroll { overflow-x: auto; }
.ds-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ds-table thead th { text-align: left; font-weight: 600; color: var(--ink-500); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; padding: 9px 14px; background: var(--ink-50); border-bottom: var(--hairline); white-space: nowrap; user-select: none; }
.ds-table thead th[data-sort] { cursor: pointer; }
.ds-table thead th[data-sort]:hover { color: var(--ink-800); }
.ds-table thead th .ds-th-inner { display: inline-flex; align-items: center; gap: 4px; }
.ds-table thead th[data-active] { color: var(--accent-text); }
.ds-table tbody td { padding: 13px 14px; border-bottom: var(--hairline); vertical-align: middle; }
.ds-table tbody tr { transition: background 100ms; }
.ds-table tbody tr:hover { background: var(--ink-50); }
.ds-table tbody tr[data-selected="true"] { background: var(--accent-soft); }
.ds-table tbody tr[data-selected="true"]:hover { background: color-mix(in srgb, var(--accent-soft) 82%, var(--accent)); }
.ds-table tbody tr:last-child td { border-bottom: none; }
.ds-table .col-checkbox { width: 36px; padding-right: 0; }
.ds-table .col-mono { font-family: var(--font-mono); font-size: 12px; color: var(--ink-700); }
.ds-table .col-actions { width: 60px; text-align: right; }
.ds-table-name { display: flex; align-items: center; gap: 10px; }
.ds-table-name-icon { width: 30px; height: 30px; border-radius: var(--r-sm); background: var(--accent-soft); display: grid; place-items: center; color: var(--accent-text); flex-shrink: 0; }
.ds-table-name-title { font-weight: 600; color: var(--ink-900); }
.ds-table-name-sub { font-size: 11.5px; color: var(--ink-500); font-family: var(--font-mono); margin-top: 1px; }
.ds-table-owner { display: flex; align-items: center; gap: 8px; }
.ds-table-owner-avatar { width: 24px; height: 24px; border-radius: 50%; color: var(--paper); font-size: 10px; font-weight: 700; display: grid; place-items: center; }
.ds-table-foot { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-top: var(--hairline); font-size: 12.5px; color: var(--ink-600); }
.ds-table-pager { display: flex; align-items: center; gap: 4px; }
.ds-page-btn { width: 28px; height: 28px; border-radius: var(--r-sm); border: var(--hairline); background: var(--paper); color: var(--ink-700); cursor: pointer; display: grid; place-items: center; }
.ds-page-btn:hover { background: var(--accent-soft); color: var(--accent-text); border-color: var(--accent); }
.ds-page-btn[disabled] { opacity: 0.4; cursor: default; }
.ds-page-btn[data-current="true"] { background: var(--accent); color: var(--paper); border-color: var(--accent); }

/* Checkbox cell */
.ds-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--ink-300); background: var(--paper); cursor: pointer; display: inline-grid; place-items: center; transition: 120ms; }
.ds-checkbox[data-checked="true"], .ds-checkbox[data-indeterminate="true"] { background: var(--accent); border-color: var(--accent); color: var(--paper); }
.ds-checkbox:hover { border-color: var(--accent); }
.ds-checkbox svg { width: 11px; height: 11px; }
`;
const Checkbox = ({ checked, indeterminate, onChange, ariaLabel }) => /* @__PURE__ */ React.createElement(
  "span",
  {
    role: "checkbox",
    "aria-checked": checked,
    "aria-label": ariaLabel,
    tabIndex: 0,
    className: "ds-checkbox",
    "data-checked": checked,
    "data-indeterminate": indeterminate && !checked,
    onClick: (e) => {
      e.stopPropagation();
      onChange && onChange(!checked);
    },
    onKeyDown: (e) => {
      if (e.key === " ") {
        e.preventDefault();
        onChange && onChange(!checked);
      }
    }
  },
  checked && /* @__PURE__ */ React.createElement(Icon, { name: "check" }),
  indeterminate && !checked && /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 1.5, background: "currentColor", borderRadius: 1 } })
);
const SortHeader = ({ children, sort, current, onSort }) => {
  const active = current?.key === sort;
  return /* @__PURE__ */ React.createElement("th", { "data-sort": sort, "data-active": active || void 0, onClick: () => onSort(sort) }, /* @__PURE__ */ React.createElement("span", { className: "ds-th-inner" }, children, active ? /* @__PURE__ */ React.createElement(Icon, { name: current.dir === "asc" ? "arrow_up" : "arrow_down", size: 11 }) : /* @__PURE__ */ React.createElement(Icon, { name: "sort", size: 11, style: { opacity: 0.4 } })));
};
const DataTable = ({ rows: rowsProp }) => {
  const baseRows = rowsProp || [
    { id: "ESP-220-A1", name: "Brake assurance \u2014 EU-RST", schema: "v3.4.1", owner: "Anya M.", ownerColor: "#635BFF", region: "Northern EU", status: "active", lastRun: "2h ago", coverage: 96 },
    { id: "ESP-118-C3", name: "Pantograph inspection", schema: "v2.1.0", owner: "Reza H.", ownerColor: "#5B8DEF", region: "Iberia", status: "passed", lastRun: "13m ago", coverage: 100 },
    { id: "ESP-441-B2", name: "Door cycle conformance", schema: "v1.8.2", owner: "Kenji T.", ownerColor: "#6BAA75", region: "DACH", status: "warning", lastRun: "1h ago", coverage: 81 },
    { id: "ESP-302-F1", name: "Traction inverter telemetry", schema: "v4.0.0-rc", owner: "Sara V.", ownerColor: "#B57BE6", region: "Benelux", status: "failed", lastRun: "5m ago", coverage: 64 },
    { id: "ESP-093-A2", name: "Wheelset profile baseline", schema: "v2.0.1", owner: "Tomas K.", ownerColor: "#E8B04B", region: "Scandinavia", status: "draft", lastRun: "\u2014", coverage: 0 },
    { id: "ESP-560-D1", name: "HVAC envelope sweep", schema: "v1.3.0", owner: "Mira O.", ownerColor: "#4FB3A9", region: "Northern EU", status: "running", lastRun: "now", coverage: 42 }
  ];
  const [rows, setRows] = useStateData(baseRows);
  const [selected, setSelected] = useStateData({});
  const [sort, setSort] = useStateData({ key: "id", dir: "asc" });
  const allChecked = rows.length > 0 && rows.every((r) => selected[r.id]);
  const someChecked = rows.some((r) => selected[r.id]) && !allChecked;
  const toggleAll = () => {
    const v = !allChecked;
    const next = {};
    rows.forEach((r) => next[r.id] = v);
    setSelected(next);
  };
  const onSort = (key) => {
    setSort((s) => {
      const dir = s.key === key && s.dir === "asc" ? "desc" : "asc";
      const sorted = [...rows].sort((a, b) => {
        const av = a[key], bv = b[key];
        if (typeof av === "number") return dir === "asc" ? av - bv : bv - av;
        return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
      setRows(sorted);
      return { key, dir };
    });
  };
  const statusChip = (s) => {
    const map = {
      active: /* @__PURE__ */ React.createElement(Chip, { tone: "success", dot: true }, "Active"),
      passed: /* @__PURE__ */ React.createElement(Chip, { tone: "success", leadingIcon: "check" }, "Passed"),
      warning: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", leadingIcon: "alert_tri" }, "Warnings"),
      failed: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", leadingIcon: "alert" }, "Failed"),
      draft: /* @__PURE__ */ React.createElement(Chip, { tone: "neutral" }, "Draft"),
      running: /* @__PURE__ */ React.createElement(Chip, { tone: "info", pulse: true }, "Running")
    };
    return map[s] || /* @__PURE__ */ React.createElement(Chip, null, s);
  };
  const selectedCount = Object.values(selected).filter(Boolean).length;
  return /* @__PURE__ */ React.createElement("div", { className: "ds-table-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "ds-table-toolbar" }, selectedCount > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Checkbox, { checked: allChecked, indeterminate: someChecked, onChange: toggleAll }), /* @__PURE__ */ React.createElement("span", { className: "ds-table-toolbar-title" }, selectedCount, " selected"), /* @__PURE__ */ React.createElement("div", { className: "ds-table-toolbar-spacer" }), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "download" }, "Export"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "copy" }, "Duplicate"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", size: "sm", leadingIcon: "trash", danger: true }, "Delete")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "ds-table-toolbar-title" }, "ESP schemas"), /* @__PURE__ */ React.createElement("span", { className: "ds-table-toolbar-count" }, rows.length, " of 248"), /* @__PURE__ */ React.createElement("div", { className: "ds-table-toolbar-spacer" }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "filter" }, "Filter"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", size: "sm", leadingIcon: "download" }, "Export"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", size: "sm", leadingIcon: "plus" }, "New schema"))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-scroll" }, /* @__PURE__ */ React.createElement("table", { className: "ds-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "col-checkbox" }, /* @__PURE__ */ React.createElement(Checkbox, { checked: allChecked, indeterminate: someChecked, onChange: toggleAll })), /* @__PURE__ */ React.createElement(SortHeader, { sort: "id", current: sort, onSort }, "Schema ID"), /* @__PURE__ */ React.createElement(SortHeader, { sort: "name", current: sort, onSort }, "Name"), /* @__PURE__ */ React.createElement("th", null, "Owner"), /* @__PURE__ */ React.createElement(SortHeader, { sort: "region", current: sort, onSort }, "Region"), /* @__PURE__ */ React.createElement(SortHeader, { sort: "coverage", current: sort, onSort }, "Coverage"), /* @__PURE__ */ React.createElement("th", null, "Status"), /* @__PURE__ */ React.createElement(SortHeader, { sort: "lastRun", current: sort, onSort }, "Last run"), /* @__PURE__ */ React.createElement("th", { className: "col-actions" }))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, "data-selected": !!selected[r.id] }, /* @__PURE__ */ React.createElement("td", { className: "col-checkbox" }, /* @__PURE__ */ React.createElement(Checkbox, { checked: !!selected[r.id], onChange: (v) => setSelected((s) => ({ ...s, [r.id]: v })) })), /* @__PURE__ */ React.createElement("td", { className: "col-mono" }, r.id), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "ds-table-name" }, /* @__PURE__ */ React.createElement("div", { className: "ds-table-name-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: "layers", size: 14 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ds-table-name-title" }, r.name), /* @__PURE__ */ React.createElement("div", { className: "ds-table-name-sub" }, r.schema)))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { className: "ds-table-owner" }, /* @__PURE__ */ React.createElement("div", { className: "ds-table-owner-avatar", style: { background: r.ownerColor } }, r.owner.split(" ").map((x) => x[0]).join("")), /* @__PURE__ */ React.createElement("span", null, r.owner))), /* @__PURE__ */ React.createElement("td", null, r.region), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(CoverageBar, { value: r.coverage })), /* @__PURE__ */ React.createElement("td", null, statusChip(r.status)), /* @__PURE__ */ React.createElement("td", { className: "col-mono", style: { color: "var(--ink-500)" } }, r.lastRun), /* @__PURE__ */ React.createElement("td", { className: "col-actions" }, /* @__PURE__ */ React.createElement("button", { className: "ds-icon-btn", style: { width: 28, height: 28, border: "none", background: "transparent" } }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 16 })))))))), /* @__PURE__ */ React.createElement("div", { className: "ds-table-foot" }, /* @__PURE__ */ React.createElement("span", null, "Showing 1\u20136 of 248"), /* @__PURE__ */ React.createElement("div", { className: "ds-table-pager" }, /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", disabled: true }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_left", size: 14 })), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn", "data-current": "true" }, "1"), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn" }, "2"), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn" }, "3"), /* @__PURE__ */ React.createElement("span", { style: { padding: "0 6px", color: "var(--ink-400)" } }, "\u2026"), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn" }, "42"), /* @__PURE__ */ React.createElement("button", { className: "ds-page-btn" }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron_right", size: 14 })))));
};
const CoverageBar = ({ value }) => {
  const tone = value >= 95 ? "success" : value >= 80 ? "warning" : value >= 1 ? "danger" : "neutral";
  const color = `var(--${tone === "neutral" ? "ink-300" : tone})`;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 120 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 6, background: "var(--ink-100)", borderRadius: 3, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: `${value}%`, background: color, borderRadius: 3, transition: "width 300ms" } })), /* @__PURE__ */ React.createElement("span", { className: "mono tabular", style: { fontSize: 11.5, color: "var(--ink-700)", minWidth: 32, textAlign: "right" } }, value, "%"));
};
window.Chip = Chip;
window.KPICard = KPICard;
window.Sparkline = Sparkline;
window.Stepper = Stepper;
window.StepperVertical = StepperVertical;
window.DataTable = DataTable;
window.Checkbox = Checkbox;
window.CoverageBar = CoverageBar;
window.DATA_CSS = chipCSS + kpiCSS + stepperCSS + tableCSS;
