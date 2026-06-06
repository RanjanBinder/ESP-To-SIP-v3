// Digital Library — Station Registry
// Indian Railways ESP · SIP · LOP Platform
const { useState: useStateLib, useMemo: useMemoLib } = React;

const DL_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "sidebarCollapsed": false,
  "tableDensity": "regular"
}/*EDITMODE-END*/;

/* ─────────────────────────────────────────────────────────────────────
   NEW CSS — only structures not covered by existing component classes.
   Follows exact token and naming conventions of the design system.
───────────────────────────────────────────────────────────────────── */
const libCSS = `
/* ── Login ── */
.ir-login-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(520px,1fr) minmax(420px,520px);
  background: var(--canvas);
  color: var(--ink-900);
  overflow: hidden;
}
.ir-login-visual {
  position: relative;
  min-width: 0;
  padding: 32px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 24px;
  background:
    linear-gradient(90deg, transparent 0 31px, rgba(14,27,44,.06) 31px 32px),
    linear-gradient(180deg, transparent 0 31px, rgba(14,27,44,.05) 31px 32px),
    var(--paper);
  background-size: 32px 32px;
  border-right: var(--hairline);
}
.ir-login-visual::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,.68), rgba(250,250,247,.14));
}
.ir-login-brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ir-login-mark {
  width: 44px;
  height: 44px;
  border-radius: var(--r-md);
  background: var(--ink-900);
  color: var(--paper);
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 800;
}
.ir-login-brand-title { font-size: 15px; font-weight: 800; color: var(--ink-900); line-height: 1.1; }
.ir-login-brand-sub { margin-top: 4px; color: var(--ink-500); font-size: 12.5px; line-height: 1.2; }
.ir-login-scene {
  position: relative;
  z-index: 1;
  align-self: center;
  width: min(720px,100%);
  justify-self: center;
  display: grid;
  gap: 18px;
}
.ir-station-board {
  border: 3px solid var(--ink-900);
  border-radius: var(--r-sm);
  background: #F7C948;
  color: var(--ink-900);
  min-height: 156px;
  padding: 20px 24px;
  display: grid;
  place-items: center;
  text-align: center;
  box-shadow: 0 10px 0 rgba(14,27,44,.08);
}
.ir-board-small {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.ir-board-name {
  margin-top: 10px;
  font-size: 34px;
  line-height: 1.05;
  font-weight: 800;
}
.ir-board-hindi {
  margin-top: 4px;
  font-size: 21px;
  line-height: 1.2;
  font-weight: 800;
}
.ir-board-code {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: var(--r-sm);
  background: var(--ink-900);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
}
.ir-route-panel {
  border: var(--hairline);
  border-radius: var(--r-md);
  background: rgba(255,255,255,.88);
  padding: 16px;
  display: grid;
  gap: 14px;
  box-shadow: var(--shadow-md);
}
.ir-route-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--ink-700);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.ir-route-track {
  position: relative;
  height: 108px;
  border-radius: var(--r-sm);
  background: linear-gradient(180deg, var(--ink-50), var(--paper));
  overflow: hidden;
}
.ir-route-track::before,
.ir-route-track::after {
  content: "";
  position: absolute;
  left: 5%;
  right: 5%;
  height: 4px;
  border-radius: var(--r-full);
  background: var(--ink-800);
}
.ir-route-track::before { top: 42%; }
.ir-route-track::after { top: 58%; }
.ir-track-sleeper {
  position: absolute;
  left: 7%;
  right: 7%;
  top: 48%;
  height: 14px;
  background: repeating-linear-gradient(90deg, transparent 0 20px, var(--ink-300) 20px 23px, transparent 23px 42px);
}
.ir-route-node {
  position: absolute;
  z-index: 1;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 3px solid var(--paper);
  background: var(--success);
  box-shadow: 0 0 0 1px var(--success);
}
.ir-route-node.a { left: 16%; top: calc(50% - 8px); }
.ir-route-node.b { left: 48%; top: calc(50% - 8px); background: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.ir-route-node.c { right: 16%; top: calc(50% - 8px); background: var(--info); box-shadow: 0 0 0 1px var(--info); }
.ir-route-label {
  position: absolute;
  z-index: 1;
  top: 18px;
  transform: translateX(-50%);
  padding: 3px 7px;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink-700);
  font-size: 11px;
  font-weight: 800;
}
.ir-route-label.a { left: 16%; }
.ir-route-label.b { left: 48%; }
.ir-route-label.c { left: 84%; }
.ir-vb-train {
  position: relative;
  z-index: 1;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: rgba(255,255,255,.88);
  padding: 14px 16px 10px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.ir-vb-train-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.ir-vb-train-name {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--ink-700);
}
.ir-vb-train-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: var(--r-sm);
  background: #1B4FA8;
  color: white;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .04em;
}
.ir-vb-train-svg { width: 100%; height: auto; display: block; }
.ir-login-ops {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 10px;
}
.ir-login-op {
  min-width: 0;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: rgba(255,255,255,.84);
  padding: 12px;
}
.ir-login-op span {
  display: block;
  color: var(--ink-500);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.ir-login-op strong {
  display: block;
  margin-top: 5px;
  color: var(--ink-900);
  font-size: 15px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ir-login-panel {
  min-width: 0;
  display: grid;
  place-items: center;
  padding: 32px;
  background: var(--canvas);
}
.ir-login-card {
  width: min(420px,100%);
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  padding: 24px;
  box-shadow: var(--shadow-lg);
}
.ir-login-card-head { display: grid; gap: 12px; margin-bottom: 22px; }
.ir-login-kicker {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 7px;
  min-height: 26px;
  padding: 0 9px;
  border-radius: var(--r-sm);
  background: var(--success-soft);
  color: var(--success-text);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.ir-login-title {
  margin: 0;
  color: var(--ink-900);
  font-size: 25px;
  font-weight: 800;
  line-height: 1.12;
}
.ir-login-sub {
  margin: 0;
  color: var(--ink-500);
  font-size: 13px;
  line-height: 1.45;
}
.ir-login-form { display: grid; gap: 14px; }
.ir-login-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ir-login-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-600);
  font-size: 12.5px;
}
.ir-login-error {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 32px;
  padding: 7px 9px;
  border-radius: var(--r-sm);
  background: var(--danger-soft);
  color: var(--danger-text);
  font-size: 12px;
  font-weight: 700;
}
.ir-login-submit { margin-top: 2px; display: grid; }
.ir-login-submit .ds-btn { width: 100%; justify-content: center; }
.ir-login-foot {
  margin-top: 18px;
  padding-top: 14px;
  border-top: var(--hairline);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--ink-500);
  font-size: 11.5px;
}
.ir-login-secure {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-700);
  font-weight: 800;
}

/* ── Outer layout ── */
.dl-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.dl-layout .ds-sidebar {
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 62%, #F8FAFF 100%);
  color: var(--ink-800);
  border-right: 1px solid rgba(10,37,64,.10);
  box-shadow: 1px 0 0 rgba(255,255,255,.92) inset, 18px 0 34px -32px rgba(10,37,64,.45);
}
.dl-layout .ds-sidebar::before {
  background: linear-gradient(180deg, rgba(99,91,255,.07) 0, rgba(255,255,255,0) 170px);
}
.dl-layout .ds-sidebar-brand,
.dl-layout .ds-sidebar-nav,
.dl-layout .ds-sidebar-foot {
  position: relative;
  z-index: 1;
}
.dl-layout .ds-sidebar-brand {
  border-bottom: 1px solid rgba(10,37,64,.08);
}
.dl-layout .ds-sidebar-mark {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.18);
  padding: 0;
  overflow: hidden;
}
.dl-layout .ds-sidebar-mark::after { display: none; }
.dl-layout .ds-sidebar-mark img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }
.dl-layout .ds-sidebar-brand .ds-sidebar-title,
.dl-layout .ds-sidebar-username {
  color: var(--ink-900);
}
.dl-layout .ds-sidebar-brand .ds-sidebar-sub,
.dl-layout .ds-sidebar-userrole,
.dl-layout .ds-sidebar-section,
.dl-layout .ds-sidebar-foot-btn,
.dl-layout .dl-sidebar-toggle-btn {
  color: var(--ink-500);
}
.dl-layout .ds-sidebar-section {
  letter-spacing: .09em;
}
.dl-layout .ds-sidebar-item {
  color: var(--ink-700);
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
  transition: background 120ms, border-color 120ms, color 120ms, transform 120ms, box-shadow 120ms;
}
.dl-layout .ds-sidebar-item .icon {
  color: var(--ink-500);
}
.dl-layout .ds-sidebar-item:hover {
  background: color-mix(in srgb, var(--accent-soft) 52%, #FFFFFF);
  border-color: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent-text);
  box-shadow: 0 8px 18px -16px rgba(99,91,255,.58);
}
.dl-layout .ds-sidebar-item:hover .icon {
  color: var(--accent);
}
.dl-layout .ds-sidebar-item[data-active="true"] {
  background: linear-gradient(180deg, var(--accent), var(--accent-hover));
  border-color: color-mix(in srgb, var(--accent-hover) 88%, #000);
  color: var(--paper);
  box-shadow: 0 12px 22px -16px rgba(99,91,255,.95), 0 1px 0 rgba(255,255,255,.22) inset;
}
.dl-layout .ds-sidebar-item[data-active="true"]::before {
  background: rgba(255,255,255,.82);
}
.dl-layout .ds-sidebar-item[data-active="true"] .icon,
.dl-layout .ds-sidebar-item[data-active="true"] svg,
.dl-layout .ds-sidebar-item[data-active="true"] .ds-sidebar-badge {
  color: var(--paper);
}
.dl-layout .ds-sidebar-item[data-active="true"] .ds-sidebar-badge {
  background: rgba(255,255,255,.16);
}
.dl-layout .ds-sidebar-badge {
  background: var(--ink-100);
  color: var(--ink-700);
}
.dl-layout .ds-sidebar-foot {
  background: rgba(255,255,255,.72);
  border-top: 1px solid rgba(10,37,64,.08);
}
.dl-layout .ds-sidebar-user {
  background: linear-gradient(135deg, var(--accent), #2DD4BF);
  box-shadow: 0 10px 18px -14px rgba(99,91,255,.95), inset 0 0 0 1px rgba(255,255,255,.32);
}
.dl-layout .ds-sidebar-foot-btn:hover,
.dl-layout .dl-sidebar-toggle-btn:hover {
  background: var(--accent-soft);
  color: var(--accent-text);
}
.dl-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255,255,255,.8) 0, rgba(250,250,247,.98) 170px, var(--canvas) 100%),
    linear-gradient(90deg, rgba(31,95,122,.05) 0 1px, transparent 1px 40px);
  background-size: auto, 40px 40px;
}

/* ── Page header ── */
.dl-page-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 24px 28px 12px;
  background: var(--canvas);
  border-bottom: none;
  box-shadow: none;
  flex-shrink: 0;
  min-height: auto;
}
.dl-page-heading {
  min-width: 0;
  display: grid;
  gap: 7px;
}
.dl-page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--ink-900);
  letter-spacing: 0;
  line-height: 1.1;
}
.dl-page-sub {
  font-size: 13px;
  color: var(--ink-500);
  line-height: 1.35;
  max-width: 640px;
}
.dl-page-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-left: auto;
  flex-shrink: 0;
}
.dl-page-actions .ds-icon-btn,
.dl-page-actions .ds-btn {
  box-shadow: var(--shadow-sm);
}
.dl-page-actions .ds-btn.variant-secondary,
.dl-page-actions .ds-btn.variant-accent {
  min-width: 150px;
}


/* ── Scope bar ── */
.dl-scope-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 28px;
  background: color-mix(in srgb, var(--paper) 92%, var(--accent-soft));
  border-bottom: var(--hairline);
  flex-shrink: 0;
  min-height: 48px;
  box-shadow: 0 1px 0 rgba(14,27,44,.025);
}
.dl-scope-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}
.dl-scope-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}
.dl-scope-select {
  height: 32px;
  padding: 0 26px 0 9px;
  border: 1px solid color-mix(in srgb, var(--ink-200) 78%, var(--accent));
  border-radius: var(--r-md);
  background: var(--paper);
  font-size: 12px;
  font-family: var(--font-sans);
  color: var(--ink-800);
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 6px center;
  background-size: 13px;
  box-shadow: var(--shadow-xs);
  transition: border-color 120ms, box-shadow 120ms, background 120ms;
}
.dl-scope-select:hover { border-color: var(--ink-300); background: #fff; }
.dl-scope-select:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.dl-vdivider { width: 1px; height: 20px; background: var(--ink-200); flex-shrink: 0; }
.dl-scope-count {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: var(--r-full);
  background: var(--ink-900);
  color: var(--paper);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: var(--shadow-xs);
}
.dl-scope-path {
  margin-left: auto;
  min-width: max-content;
  padding: 3px 6px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  box-shadow: var(--shadow-xs);
}

/* ── Search + filter bar ── */
.dl-filter-bar {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 11px 28px 11px;
  background:
    linear-gradient(180deg, var(--paper), color-mix(in srgb, var(--paper) 92%, var(--ink-50)));
  border-bottom: var(--hairline);
  flex-shrink: 0;
  box-shadow: 0 1px 0 rgba(14,27,44,.025);
}
.dl-filter-row { display: flex; gap: 8px; align-items: center; }
.dl-filter-shell { position: relative; flex-shrink: 0; }
.dl-search-wrap { flex: 1; position: relative; }
.dl-search-wrap input {
  width: 100%;
  height: 38px;
  padding: 0 12px 0 34px;
  border: 1px solid color-mix(in srgb, var(--ink-200) 82%, var(--accent));
  border-radius: var(--r-md);
  background: #fff;
  font-size: 13px;
  font-family: var(--font-sans);
  color: var(--ink-900);
  outline: none;
  box-shadow: var(--shadow-sm);
  transition: 120ms;
}
.dl-search-wrap input::placeholder { color: var(--ink-400); }
.dl-search-wrap input:hover { border-color: var(--ink-300); }
.dl-search-wrap input:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.dl-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ink-500);
  pointer-events: none;
}
.dl-chips { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
.dl-filter-bar .ds-fchip {
  min-height: 28px;
  box-shadow: var(--shadow-xs);
}
.dl-filter-bar .ds-fchip[data-active="true"] {
  background: linear-gradient(135deg, var(--ink-900), var(--ink-800));
  border-color: var(--ink-800);
}
.dl-filter-panel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: min(620px, calc(100vw - 56px));
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  border: var(--hairline);
  border-radius: var(--r-lg);
  background: var(--paper);
  box-shadow: var(--shadow-lg);
  z-index: 20;
}
.dl-filter-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.dl-filter-field label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.dl-filter-field select {
  width: 100%;
  height: 32px;
  padding: 0 28px 0 9px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink-800);
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 7px center;
  background-size: 13px;
}
.dl-filter-field select:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.dl-filter-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 2px;
}
.dl-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 10000;
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border: 1px solid oklch(0.9 0.06 155);
  border-radius: var(--r-md);
  background: var(--success-soft);
  color: var(--success-text);
  box-shadow: var(--shadow-lg);
  font-size: 12.5px;
  font-weight: 800;
}

/* ── Add station modal ── */
.dl-add-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.36);
}
.dl-add-modal {
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  overflow: auto;
  box-sizing: border-box;
  background: var(--paper);
  border: var(--hairline);
  border-radius: var(--r-lg);
  box-shadow: 0 18px 54px rgba(0,0,0,0.22);
}
.dl-add-modal[data-size="wide"] { width: min(860px, calc(100vw - 32px)); }
.dl-add-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: var(--hairline);
}
.dl-add-title { font-size: 15px; font-weight: 700; color: var(--ink-900); }
.dl-add-subtitle {
  margin-top: 3px;
  font-size: 12px;
  color: var(--ink-500);
  line-height: 1.35;
}
.dl-add-close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--ink-500);
  cursor: pointer;
}
.dl-add-close:hover { background: var(--ink-50); color: var(--ink-800); }
.dl-add-body {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 18px 16px;
}
.dl-add-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.dl-add-field[data-span="full"] { grid-column: 1 / -1; }
.dl-add-field label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-700);
}
.dl-add-field input,
.dl-add-field select,
.dl-add-field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--ink-50);
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink-900);
  outline: none;
}
.dl-add-field input,
.dl-add-field select {
  height: 34px;
}
.dl-add-field textarea {
  min-height: 148px;
  padding: 9px 10px;
  resize: vertical;
  line-height: 1.45;
}
.dl-add-field select {
  padding-right: 28px;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 13px;
}
.dl-add-field input:focus,
.dl-add-field select:focus,
.dl-add-field textarea:focus {
  border-color: var(--accent);
  background: var(--paper);
  box-shadow: var(--shadow-focus);
}
.dl-bulk-preview {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 10px;
  border-radius: var(--r-md);
  background: var(--ink-50);
  color: var(--ink-600);
  font-size: 12px;
}
.dl-bulk-errors {
  grid-column: 1 / -1;
  display: grid;
  gap: 4px;
  color: var(--danger-text);
  font-size: 11.5px;
  line-height: 1.35;
}
.dl-bulk-page {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 22px 28px 28px;
  background: var(--paper);
}
.dl-bulk-page-head {
  margin-bottom: 16px;
}
.dl-bulk-page-title {
  color: var(--ink-900);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.15;
}
.dl-bulk-page-subtitle {
  margin-top: 5px;
  max-width: 620px;
  color: var(--ink-500);
  font-size: 13px;
  line-height: 1.45;
}
.dl-bulk-panel {
  display: grid;
  border: var(--hairline);
  border-radius: var(--r-lg);
  background: var(--paper);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}
.dl-bulk-workflow {
  display: grid;
  gap: 14px;
  padding: 18px;
}
.dl-bulk-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dl-bulk-upload-zone {
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 132px;
  padding: 18px;
  border: 1.5px dashed var(--ink-300);
  border-radius: var(--r-md);
  background: var(--ink-50);
  color: var(--ink-600);
  text-align: center;
  transition: 140ms ease;
}
.dl-bulk-upload-zone[data-drag="true"] {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-text);
}
.dl-bulk-upload-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  color: var(--ink-700);
}
.dl-bulk-upload-title {
  color: var(--ink-900);
  font-size: 13px;
  font-weight: 800;
}
.dl-bulk-upload-sub {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.35;
}
.dl-bulk-file {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.dl-bulk-file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.dl-bulk-file-name {
  font-size: 12px;
  color: var(--ink-500);
  font-weight: 700;
  font-family: var(--font-mono);
}
.dl-bulk-file-input {
  position: fixed;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.dl-bulk-file-card {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--ink-50);
}
.dl-bulk-file-meta {
  min-width: 0;
  display: grid;
  gap: 2px;
}
.dl-bulk-file-meta strong {
  color: var(--ink-900);
  font-size: 12.5px;
  line-height: 1.25;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dl-bulk-file-meta span {
  color: var(--ink-500);
  font-size: 11.5px;
}
.dl-bulk-link-btn {
  border: 0;
  background: transparent;
  color: var(--accent-text);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}
.dl-bulk-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 12px;
  font-weight: 800;
}
.dl-bulk-extraction {
  display: grid;
  gap: 12px;
  padding: 12px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
}
.dl-bulk-extraction-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dl-bulk-extraction-title {
  color: var(--ink-900);
  font-size: 13px;
  font-weight: 800;
}
.dl-bulk-extraction-sub {
  margin-top: 3px;
  color: var(--ink-500);
  font-size: 11.5px;
}
.dl-bulk-extraction-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.dl-bulk-extraction-card {
  padding: 10px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--ink-50);
}
.dl-bulk-extraction-card[data-tone="success"] { background: var(--success-soft); }
.dl-bulk-extraction-card[data-tone="error"] { background: var(--danger-soft); }
.dl-bulk-extraction-card strong {
  display: block;
  color: var(--ink-900);
  font-size: 20px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.dl-bulk-extraction-card[data-tone="success"] strong { color: var(--success-text); }
.dl-bulk-extraction-card[data-tone="error"] strong { color: var(--danger-text); }
.dl-bulk-extraction-card span {
  display: block;
  margin-top: 5px;
  color: var(--ink-500);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.dl-bulk-extraction-errors {
  display: grid;
  gap: 4px;
  color: var(--danger-text);
  font-size: 11.5px;
  line-height: 1.35;
}
.dl-bulk-summary-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}
.dl-bulk-card {
  padding: 10px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
}
.dl-bulk-card strong {
  display: block;
  color: var(--ink-900);
  font-size: 18px;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.dl-bulk-card span {
  display: block;
  margin-top: 4px;
  color: var(--ink-500);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.dl-bulk-row-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.dl-bulk-row-tab {
  height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink-600);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
.dl-bulk-row-tab[data-active="true"] {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-text);
}
.dl-bulk-review-wrap {
  width: 100%;
  max-height: calc(100vh - 470px);
  min-height: 260px;
  overflow: auto;
  border: var(--hairline);
  border-radius: var(--r-md);
}
.dl-bulk-review {
  width: 100%;
  min-width: 1660px;
  border-collapse: collapse;
  table-layout: fixed;
}
.dl-bulk-review col:nth-child(1) { width: 92px; }
.dl-bulk-review col:nth-child(2) { width: 112px; }
.dl-bulk-review col:nth-child(3) { width: 136px; }
.dl-bulk-review col:nth-child(4) { width: 172px; }
.dl-bulk-review col:nth-child(5) { width: 152px; }
.dl-bulk-review col:nth-child(6) { width: 122px; }
.dl-bulk-review col:nth-child(7) { width: 152px; }
.dl-bulk-review col:nth-child(8) { width: 148px; }
.dl-bulk-review col:nth-child(9) { width: 172px; }
.dl-bulk-review col:nth-child(10) { width: 148px; }
.dl-bulk-review col:nth-child(11) { width: 122px; }
.dl-bulk-review col:nth-child(12) { width: 260px; }
.dl-bulk-review col:nth-child(13) { width: 156px; }
.dl-bulk-review th,
.dl-bulk-review td {
  border-bottom: var(--hairline);
  padding: 7px 8px;
  font-size: 11.5px;
  text-align: left;
  vertical-align: top;
}
.dl-bulk-review th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--ink-50);
  color: var(--ink-500);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .05em;
  text-transform: uppercase;
  white-space: nowrap;
}
.dl-bulk-review input,
.dl-bulk-review select {
  width: 100%;
  height: 28px;
  box-sizing: border-box;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink-900);
  font-family: var(--font-sans);
  font-size: 11.5px;
  padding: 0 7px;
  outline: none;
}
.dl-bulk-review tbody tr:hover td { background: var(--ink-50); transition: background 100ms; }
.dl-bulk-review td[data-invalid="true"] input,
.dl-bulk-review td[data-invalid="true"] select {
  border-color: var(--danger);
  background: var(--danger-soft);
}
.dl-bulk-row-status {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 7px;
  border-radius: var(--r-full);
  font-size: 10.5px;
  font-weight: 600;
  white-space: nowrap;
}
.dl-bulk-row-status[data-status="valid"] { background: var(--success-soft); color: var(--success-text); }
.dl-bulk-row-status[data-status="pending"] { background: var(--accent-soft); color: var(--accent-text); }
.dl-bulk-row-status[data-status="error"],
.dl-bulk-row-status[data-status="duplicate"],
.dl-bulk-row-status[data-status="existing"] { background: var(--danger-soft); color: var(--danger-text); }
.dl-bulk-row-status[data-status="skipped"] { background: var(--ink-100); color: var(--ink-600); }
.dl-bulk-error-msg {
  max-width: 260px;
  color: var(--danger-text);
  line-height: 1.35;
}
.dl-bulk-error-msg[data-muted="true"] { color: var(--ink-500); }
.dl-bulk-error-msg[data-ready="true"] { color: var(--success-text); font-weight: 700; }
.dl-bulk-row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.dl-bulk-remove {
  height: 26px;
  padding: 0 8px;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--danger-text);
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
}
.dl-bulk-empty {
  padding: 22px;
  border: 1px dashed var(--ink-300);
  border-radius: var(--r-md);
  background: var(--ink-50);
  color: var(--ink-500);
  font-size: 12px;
  text-align: center;
}
.dl-bulk-confirm {
  padding: 9px 10px;
  border-radius: var(--r-md);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 12px;
  font-weight: 700;
}
.dl-bulk-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--ink-50);
  color: var(--ink-700);
  font-size: 13px;
  font-weight: 850;
}
.dl-bulk-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--ink-200);
  border-top-color: var(--accent);
  border-radius: var(--r-full);
  animation: dl-spin .8s linear infinite;
}
@keyframes dl-spin { to { transform: rotate(360deg); } }
.dl-bulk-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  border-top: var(--hairline);
  background: color-mix(in srgb, var(--paper) 94%, transparent);
  backdrop-filter: blur(8px);
  border-radius: 0 0 var(--r-lg) var(--r-lg);
}
.dl-bulk-footer-note {
  color: var(--ink-500);
  font-size: 12px;
  line-height: 1.35;
}
.dl-bulk-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.dl-add-note {
  grid-column: 1 / -1;
  padding: 8px 10px;
  border-radius: var(--r-md);
  background: var(--ink-50);
  color: var(--ink-500);
  font-size: 11.5px;
  line-height: 1.4;
}
.dl-add-error {
  grid-column: 1 / -1;
  color: var(--danger-text);
  font-size: 11.5px;
  line-height: 1.35;
}
.dl-add-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px 16px;
  border-top: var(--hairline);
}
@media (max-width: 720px) {
  .ir-login-shell { grid-template-columns: 1fr; overflow-y: auto; }
  .ir-login-panel { order: 1; padding: 22px; place-items: start center; }
  .ir-login-visual { order: 2; min-height: auto; border-right: none; border-top: var(--hairline); padding: 22px; }
  .ir-board-name { font-size: 28px; }
  .ir-login-ops { grid-template-columns: 1fr; }
  .ir-login-card { padding: 20px; }
  .ir-login-form-grid { grid-template-columns: 1fr; }
  .dl-add-body { grid-template-columns: 1fr; }
  .dl-add-field[data-span="full"] { grid-column: auto; }
}

/* ── Table scroll area ── */
.dl-table-area {
  flex: 1;
  overflow: auto;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--accent-soft) 18%, var(--canvas)) 0, var(--canvas) 140px);
}
.dl-table-container {
  margin: 16px 28px 24px;
  border: 1px solid color-mix(in srgb, var(--ink-200) 80%, var(--ink-300));
  border-radius: var(--r-lg);
  background: var(--paper);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
/* Sticky headers */
.dl-table-area .ds-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(180deg, #fff, var(--ink-50));
  text-align: left;
  text-transform: uppercase;
  letter-spacing: .055em;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ink-600);
  border-bottom: 1px solid var(--ink-300);
}
.dl-table-area .ds-table thead th[data-sortable] { cursor: pointer; }
.dl-table-area .ds-table thead th[data-sortable]:hover { color: var(--ink-900); }
.dl-table-area .ds-table {
  table-layout: fixed;
  min-width: 980px;
}
/* Tighter row density for information-dense view */
.dl-table-area .ds-table tbody td { padding: 7px 14px; }
.dl-table-area .ds-table thead th { padding: 7px 14px; }
.dl-table-area .ds-table .col-checkbox { text-align: left; }
.dl-table-area .ds-table tbody .dl-action-table-cell { text-align: right; }
.dl-table-area .ds-table tbody tr {
  cursor: pointer;
  transition: background 120ms, box-shadow 120ms;
}
.dl-table-area .ds-table tbody tr:nth-child(even) {
  background: color-mix(in srgb, var(--ink-50) 46%, var(--paper));
}
.dl-table-area .ds-table tbody tr:hover {
  background: color-mix(in srgb, var(--accent-soft) 40%, var(--paper));
  box-shadow: inset 3px 0 0 var(--accent);
}
.dl-table-area .ds-table tbody tr[data-selected="true"] {
  background: color-mix(in srgb, var(--info-soft) 58%, var(--paper));
  box-shadow: inset 3px 0 0 var(--info);
}
.dl-table-area .ds-table tbody tr[data-new="true"] { background: var(--success-soft); }
.dl-table-area .ds-table tbody tr[data-new="true"] td:first-child { border-left: 3px solid var(--success); }
.dl-station-cell,
.dl-section-cell,
.dl-division-cell {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dl-station-cell {
  font-weight: 600;
  font-size: 13px;
  color: var(--ink-900);
  line-height: 1.35;
  white-space: nowrap;
}
.dl-section-cell,
.dl-division-cell {
  font-size: 12px;
  color: var(--ink-600);
  line-height: 1.35;
}
.dl-section-cell {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.dl-doc-table-cell { text-align: left; overflow: visible; }
.dl-action-table-cell { text-align: right; }
.dl-table-foot-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.dl-page-size {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  color: var(--ink-600);
}
.dl-page-size select {
  height: 28px;
  padding: 0 24px 0 8px;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink-800);
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 6px center;
  background-size: 12px;
}
.dl-page-size select:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.dl-page-ellipsis {
  padding: 0 4px;
  color: var(--ink-400);
}

/* ── Station code pill ── */
.dl-code-pill {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 7px;
  background: var(--ink-900);
  border-radius: var(--r-xs);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--paper);
  letter-spacing: 0.03em;
  margin-top: 2px;
  box-shadow: 0 1px 0 rgba(14,27,44,.1);
}

/* ── Document status (absent) ── */
.dl-doc-absent { font-size: 16px; color: var(--ink-300); font-weight: 400; line-height: 1; }

/* ── Survey tags ── */
.dl-survey-tags { display: flex; gap: 3px; align-items: center; }
.dl-survey-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 3px;
  letter-spacing: 0.03em;
  line-height: 1.4;
}
.dl-survey-tag[data-present="true"]  { background: var(--info); color: #fff; border-color: var(--info); box-shadow: var(--shadow-xs); }
.dl-survey-none {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 7px;
  border-radius: var(--r-full);
  background: var(--danger-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--danger-text);
  font-weight: 600;
}

/* ── Versions ── */
.dl-versions { font-family: var(--font-mono); font-size: 11px; color: var(--ink-500); white-space: nowrap; }
.dl-versions-empty { font-size: 13px; color: var(--ink-300); }

/* ── Last activity ── */
.dl-activity-time { font-size: 12px; color: var(--ink-600); line-height: 1.3; }
.dl-activity-by   { font-size: 10.5px; color: var(--ink-400); margin-top: 1px; }

/* ── Completeness bar ── */
.dl-complete { display: flex; align-items: center; gap: 7px; }
.dl-complete-bar { display: flex; gap: 2px; flex: 1; min-width: 70px; }
.dl-complete-seg { flex: 1; height: 5px; border-radius: 2px; transition: background 200ms; }
.dl-complete-count { font-family: var(--font-mono); font-size: 11px; color: var(--ink-500); white-space: nowrap; }

/* ── Row actions ── */
.dl-row-actions { display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
.dl-row-view-btn {
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 10px;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--accent-text);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 120ms, border-color 120ms;
}
.dl-row-view-btn:hover { border-color: var(--accent); background: var(--accent-soft); }
.dl-row-more-wrap { position: relative; }
.dl-action-icon {
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink-600);
  cursor: pointer;
  transition: background 120ms, border-color 120ms, color 120ms;
}
.dl-action-icon:hover { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-text); }
.dl-row-menu {
  position: absolute;
  z-index: 80;
  top: calc(100% + 6px);
  right: 0;
  width: 178px;
  padding: 5px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  box-shadow: var(--shadow-lg);
}
.dl-row-menu button {
  width: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--ink-700);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}
.dl-row-menu button:hover { background: var(--ink-50); color: var(--ink-900); }

/* ── Sidebar toggle button in brand header ── */
.dl-sidebar-toggle-btn {
  margin-left: auto;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: var(--r-sm);
  border: none;
  background: transparent;
  color: var(--ink-500);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 120ms, color 120ms;
}
.dl-sidebar-toggle-btn:hover {
  background: var(--ink-100);
  color: var(--ink-900);
}
.ds-sidebar[data-collapsed="true"] .dl-sidebar-toggle-btn { margin-left: 0; }

/* ── Table density ── */
.dl-table-area[data-density="compact"] .ds-table tbody td { padding: 3px 14px; }
.dl-table-area[data-density="compact"] .ds-table thead th { padding: 3px 14px; }

/* ── Sidebar collapse/expand ── */
.ds-sidebar {
  flex-shrink: 0;
  overflow: hidden;
  transition: width 220ms cubic-bezier(0.4,0,0.2,1);
}
.ds-sidebar[data-collapsed="true"] { width: 64px; }

/* Hide all text content when collapsed */
.ds-sidebar[data-collapsed="true"] .ds-sidebar-title,
.ds-sidebar[data-collapsed="true"] .ds-sidebar-sub,
.ds-sidebar[data-collapsed="true"] .ds-sidebar-section,
.ds-sidebar[data-collapsed="true"] .ds-sidebar-item > span,
.ds-sidebar[data-collapsed="true"] .ds-sidebar-badge,
.ds-sidebar[data-collapsed="true"] .ds-sidebar-userinfo,
.ds-sidebar[data-collapsed="true"] .ds-sidebar-foot-btn { display: none; }

/* Hide the title-wrapper div (no class) */
.ds-sidebar[data-collapsed="true"] .ds-sidebar-brand > div:not(.ds-sidebar-mark) { display: none; }

/* Brand area: stack vertically so the toggle sits below the IR mark */
.ds-sidebar[data-collapsed="true"] .ds-sidebar-brand {
  flex-direction: column;
  gap: 10px;
  padding: 14px 0;
}

/* Nav: tighter padding, centered square click targets */
.ds-sidebar[data-collapsed="true"] .ds-sidebar-nav { padding: 10px 8px; }
.ds-sidebar[data-collapsed="true"] .ds-sidebar-item {
  width: 40px;
  height: 36px;
  padding: 0;
  margin: 2px auto;
  justify-content: center;
  gap: 0;
}

/* Hairline divider between groups since section labels are hidden */
.ds-sidebar[data-collapsed="true"] .ds-sidebar-nav > div:not(.ds-sidebar-item) {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--ink-100);
}

/* Footer: just the user avatar, centered */
.ds-sidebar[data-collapsed="true"] .ds-sidebar-foot {
  justify-content: center;
  padding: 12px 0;
  gap: 0;
}

/* ── Bulk action bar ── */
.dl-bulk-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 28px;
  background: var(--ink-900);
  border-top: 1px solid var(--ink-800);
  flex-shrink: 0;
  animation: dlBulkIn 160ms ease-out;
}
@keyframes dlBulkIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.dl-bulk-label { font-size: 13px; font-weight: 600; color: var(--paper); }
.dl-bulk-sep { width: 1px; height: 18px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.dl-bulk-action {
  display: inline-flex; align-items: center; gap: 5px;
  height: 28px; padding: 0 10px;
  border-radius: var(--r-md); border: 1px solid rgba(255,255,255,0.14);
  background: transparent; color: rgba(255,255,255,0.8); font-size: 12.5px;
  font-weight: 500; cursor: pointer; font-family: var(--font-sans);
  transition: 120ms; white-space: nowrap;
}
.dl-bulk-action:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.28); }
.dl-bulk-clear {
  background: none; border: none; color: rgba(255,255,255,0.45); font-size: 12.5px;
  cursor: pointer; font-family: var(--font-sans); padding: 0 4px; transition: 120ms;
}
.dl-bulk-clear:hover { color: rgba(255,255,255,0.8); text-decoration: underline; }
/* ── Validated (ESP-only) chip ── */
.ds-chip[data-tone="validated"] { background: oklch(0.94 0.06 295); color: oklch(0.38 0.18 295); border-color: oklch(0.85 0.1 295); }
.ds-chip[data-variant="solid"][data-tone="validated"] { background: oklch(0.42 0.18 295); color: #fff; border-color: oklch(0.42 0.18 295); }

/* ── Status guide button ── */
.dl-status-guide-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 500; color: var(--ink-400);
  background: none; border: 1px solid var(--ink-200);
  border-radius: var(--r-full); padding: 2px 8px; cursor: pointer;
  transition: color 120ms, border-color 120ms, background 120ms;
  white-space: nowrap;
}
.dl-status-guide-btn:hover { color: var(--accent-text); border-color: var(--accent); background: var(--accent-soft); }

/* ── Status guide modal ── */
.dl-sg-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.36);
}
.dl-sg-modal {
  box-sizing: border-box;
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  overflow: auto;
  background: var(--paper); border: var(--hairline);
  border-radius: var(--r-lg); box-shadow: 0 18px 54px rgba(0,0,0,0.22);
  padding: 18px 20px;
}
.dl-sg-head { display: flex; align-items: start; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
.dl-sg-title { font-size: 15px; font-weight: 700; color: var(--ink-900); line-height: 1.2; }
.dl-sg-subtitle { margin-top: 3px; font-size: 12px; color: var(--ink-500); line-height: 1.35; }
.dl-sg-close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: var(--paper);
  border: var(--hairline);
  border-radius: var(--r-md);
  cursor: pointer;
  color: var(--ink-500);
  padding: 0;
}
.dl-sg-close:hover { color: var(--ink-700); }
.dl-sg-rows { display: grid; border: var(--hairline); border-radius: var(--r-md); overflow: hidden; }
.dl-sg-row {
  display: grid;
  grid-template-columns: 24px 198px minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  padding: 9px 12px;
  background: var(--paper);
  border-bottom: var(--hairline);
}
.dl-sg-row:last-child { border-bottom: none; }
.dl-sg-num { font-size: 11px; font-weight: 700; color: var(--ink-400); text-align: right; }
.dl-sg-status-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.dl-sg-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  min-height: 24px;
  padding: 0 8px;
  box-sizing: border-box;
  border-radius: var(--r-full);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dl-sg-status[data-tone="neutral"] { background: var(--ink-800); color: #fff; }
.dl-sg-status[data-tone="warning"] { background: var(--warning); color: var(--ink-900); }
.dl-sg-status[data-tone="info"] { background: var(--info); color: #fff; }
.dl-sg-status[data-tone="accent"] { background: var(--accent); color: #fff; }
.dl-sg-status[data-tone="validated"] { background: oklch(0.42 0.18 295); color: #fff; }
.dl-sg-status[data-tone="danger"] { background: var(--danger); color: #fff; }
.dl-sg-status[data-tone="success"] { background: var(--success); color: #fff; }
.dl-sg-pulse { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; opacity: 0.85; }
.dl-sg-desc { display: block; min-width: 0; font-size: 12px; color: var(--ink-600); line-height: 1.35; overflow-wrap: anywhere; }
.dl-sg-esp { flex-shrink: 0; font-size: 9px; font-weight: 700; background: oklch(0.42 0.18 295); color: #fff; border-radius: 3px; padding: 2px 4px; }
.dl-sg-divider { height: 1px; background: var(--ink-200); }
.dl-sg-footer { margin-top: 10px; padding-top: 9px; border-top: var(--hairline); font-size: 10.5px; color: var(--ink-400); line-height: 1.5; }
@media (max-width: 560px) {
  .dl-sg-overlay { padding: 12px; align-items: flex-start; }
  .dl-sg-modal { width: 100%; max-height: calc(100vh - 24px); padding: 14px; }
  .dl-sg-row {
    grid-template-columns: 22px minmax(0, 1fr);
    row-gap: 5px;
  }
  .dl-sg-desc { grid-column: 2; }
}

/* ── Doc chip tooltip ── */
.dl-doc-tip { position: relative; display: inline-flex; }
.dl-doc-tip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 7px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink-900);
  color: #fff;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: var(--r-sm);
  pointer-events: none;
  opacity: 0;
  transition: opacity 140ms;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
}
.dl-doc-tip::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--ink-900);
  pointer-events: none;
  opacity: 0;
  transition: opacity 140ms;
  z-index: 9999;
}
.dl-doc-tip:hover::after,
.dl-doc-tip:hover::before { opacity: 1; }

/* ── Option B — dot row document column ── */
.dl-doc-summary { position: relative; display: inline-flex; align-items: center; min-width: 0; }
.dl-dot-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: 1px solid var(--ink-200);
  border-radius: var(--r-full);
  background: var(--paper);
  cursor: pointer;
  transition: border-color 120ms, box-shadow 120ms;
}
.dl-dot-row:hover { border-color: var(--ink-300); box-shadow: var(--shadow-xs); }
.dl-dot-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.dl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 150ms;
}
.dl-dot-wrap:hover .dl-dot { transform: scale(1.5); }
.dl-dot-tip {
  position: absolute;
  bottom: calc(100% + 7px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: var(--ink-900);
  color: var(--paper);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  padding: 4px 8px;
  border-radius: var(--r-xs);
  pointer-events: none;
  opacity: 0;
  transition: opacity 120ms;
  z-index: 100;
}
.dl-dot-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--ink-900);
}
.dl-dot-wrap:hover .dl-dot-tip { opacity: 1; }
.dl-dot[data-tone="success"] { background: var(--success); }
.dl-dot[data-tone="info"]    { background: var(--info); }
.dl-dot[data-tone="warning"] { background: var(--warning); }
.dl-dot[data-tone="danger"]  { background: var(--danger); }
.dl-dot[data-tone="neutral"] { background: var(--ink-300); }
.dl-doc-hover-card {
  position: absolute;
  z-index: 90;
  top: 100%;
  right: 0;
  width: min(620px, calc(100vw - 56px));
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  box-shadow: var(--shadow-lg);
  overflow: visible;
}
.dl-doc-hover-card::before {
  content: "";
  position: absolute;
  top: -6px;
  right: 12px;
  width: 10px;
  height: 10px;
  border-left: var(--hairline);
  border-top: var(--hairline);
  background: var(--paper);
  transform: rotate(45deg);
}
.dl-doc-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 140;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(14,27,44,.28);
}
.dl-doc-popover {
  width: min(680px, calc(100vw - 48px));
  max-height: min(620px, calc(100vh - 48px));
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.dl-doc-popover-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: var(--hairline);
}
.dl-doc-popover-title { color: var(--ink-900); font-size: 14px; font-weight: 800; line-height: 1.2; }
.dl-doc-popover-sub { margin-top: 3px; color: var(--ink-500); font-size: 11.5px; line-height: 1.35; }
.dl-doc-popover-close {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink-500);
  cursor: pointer;
}
.dl-doc-popover-close:hover { color: var(--ink-900); background: var(--ink-50); }
.dl-doc-detail-table { width: 100%; border-collapse: collapse; }
.dl-doc-detail-table th {
  padding: 9px 14px;
  border-bottom: var(--hairline);
  background: var(--ink-50);
  color: var(--ink-500);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  text-align: left;
  white-space: nowrap;
}
.dl-doc-detail-table td { padding: 10px 14px; border-bottom: var(--hairline); color: var(--ink-700); font-size: 12px; vertical-align: middle; }
.dl-doc-detail-table tr:last-child td { border-bottom: none; }
.dl-doc-detail-table tr[data-available="false"] td { background: oklch(0.985 0.003 240); }
.dl-doc-detail-label { display: inline-flex; align-items: center; gap: 8px; color: var(--ink-900); font-weight: 700; font-size: 12px; }
.dl-doc-detail-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--ink-300); box-shadow: 0 0 0 2px var(--paper); }
.dl-doc-detail-dot[data-tone="success"] { background: var(--success); }
.dl-doc-detail-dot[data-tone="info"] { background: var(--info); }
.dl-doc-detail-dot[data-tone="warning"] { background: var(--warning); }
.dl-doc-detail-dot[data-tone="danger"] { background: var(--danger); }
.dl-doc-detail-dot[data-tone="neutral"] { background: var(--ink-300); }
.dl-doc-detail-version { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-900); font-weight: 700; letter-spacing: 0.02em; }
.dl-doc-detail-time { font-size: 11.5px; color: var(--ink-600); }
.dl-doc-detail-empty { font-size: 11.5px; color: var(--ink-400); font-weight: 500; }
.dl-doc-detail-action {
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: var(--hairline);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--accent-text);
  font-family: var(--font-sans);
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms, border-color 120ms;
}
.dl-doc-detail-action:hover { border-color: var(--accent); background: var(--accent-soft); }
.dl-doc-detail-action:disabled {
  color: var(--ink-400);
  background: var(--ink-50);
  cursor: not-allowed;
}
.dl-overall-status { display: inline-flex; align-items: center; min-height: 24px; padding: 0 9px; border-radius: var(--r-full); font-size: 11px; font-weight: 600; white-space: nowrap; }
.dl-overall-status[data-tone="success"] { background: var(--success-soft); color: var(--success-text); }
.dl-overall-status[data-tone="info"] { background: var(--info-soft); color: var(--info-text); }
.dl-overall-status[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.dl-overall-status[data-tone="danger"] { background: var(--danger-soft); color: var(--danger-text); }
.dl-overall-status[data-tone="neutral"] { background: var(--ink-100); color: var(--ink-700); }
.dl-scope-count,
.dl-code-pill,
.dl-bulk-bar,
.dl-review-step[data-active="true"],
.dl-page-btn[data-current="true"] { background: var(--accent); border-color: var(--accent); color: var(--paper); }
.dl-filter-bar .ds-fchip[data-active="true"] { background: var(--accent); border-color: var(--accent); color: var(--paper); box-shadow: 0 6px 12px -8px rgba(99,91,255,.75); }
.dl-tab[data-active="true"],
.dl-row-view-btn:hover,
.dl-action-icon:hover,
.dl-doc-detail-action:hover { color: var(--accent-text); border-color: var(--accent); background: var(--accent-soft); }
.dl-doc-mark,
.dl-login-mark,
.ir-login-mark,
.ir-board-code { background: linear-gradient(180deg,var(--stripe-blue-800),var(--stripe-blue-900)); color: var(--paper); }
`;

/* ─────────────────────────────────────────────────────────────────────
   STATION DATA — 12 sample rows covering all document + survey states
───────────────────────────────────────────────────────────────────── */
const ALL_STATIONS = [
{
  id: 1, name: "Vijayawada Junction", code: "BZA", section: "Vijayawada–Gudivada",
  zone: "SCR", division: "Vijayawada",
  esp: "approved", sip: "approved", lop: "approved", toc: true,
  survey: { lidar: true, ortho: true, ts: true },
  versions: "ESP v4 · SIP v2 · LOP v1",
  lastTime: "1 day ago", lastBy: "K. Naidu"
},
{
  id: 2, name: "Guntur Junction", code: "GNT", section: "Guntur–Tenali",
  zone: "SCR", division: "Vijayawada",
  esp: "approved", sip: "under_review", lop: null, toc: false,
  survey: { lidar: true, ortho: true, ts: false },
  versions: "ESP v3 · SIP v1",
  lastTime: "3 hours ago", lastBy: "R. Prasad"
},
{
  id: 3, name: "Tenali Junction", code: "TEL", section: "Guntur–Tenali",
  zone: "SCR", division: "Vijayawada",
  esp: "digitised", sip: "uploaded", lop: null, toc: false,
  survey: { lidar: true, ortho: false, ts: true },
  versions: "ESP v2 · SIP v1",
  lastTime: "5 hours ago", lastBy: "V. Rao"
},
{
  id: 4, name: "Ongole", code: "OGL", section: "Ongole–Nellore",
  zone: "SCR", division: "Vijayawada",
  esp: "pending_review", sip: null, lop: null, toc: false,
  survey: { lidar: false, ortho: true, ts: false },
  versions: null,
  lastTime: "12 hours ago", lastBy: "S. Kumar"
},
{
  id: 5, name: "Eluru", code: "EE", section: "Vijayawada–Eluru",
  zone: "SCR", division: "Vijayawada",
  esp: null, sip: null, lop: null, toc: false,
  survey: { lidar: true, ortho: true, ts: true },
  versions: null,
  lastTime: "2 days ago", lastBy: "P. Murthy"
},
{
  id: 6, name: "Rajahmundry", code: "RJY", section: "Eluru–Samalkot",
  zone: "SCR", division: "Vijayawada",
  esp: "approved", sip: "approved", lop: "digitised", toc: true,
  survey: { lidar: true, ortho: true, ts: false },
  versions: "ESP v3 · SIP v2 · LOP v1",
  lastTime: "6 hours ago", lastBy: "A. Reddy"
},
{
  id: 7, name: "Bhimavaram Town", code: "BVRT", section: "Nidadavolu–Bhimavaram",
  zone: "SCR", division: "Vijayawada",
  esp: "approved", sip: null, lop: null, toc: false,
  survey: { lidar: false, ortho: false, ts: false },
  versions: "ESP v2",
  lastTime: "4 days ago", lastBy: "M. Kishore"
},
{
  id: 8, name: "Nidadavolu", code: "NDD", section: "Nidadavolu–Bhimavaram",
  zone: "SCR", division: "Vijayawada",
  esp: "validated", sip: "digitised", lop: null, toc: false,
  survey: { lidar: false, ortho: false, ts: false },
  versions: "ESP v2 · SIP v1",
  lastTime: "1 day ago", lastBy: "G. Sharma"
},
{
  id: 9, name: "Kakinada Port", code: "COA", section: "Samalkot–Kakinada",
  zone: "SCR", division: "Vijayawada",
  esp: "under_review", sip: null, lop: null, toc: false,
  survey: { lidar: true, ortho: false, ts: false },
  versions: null,
  lastTime: "now", lastBy: "upload system"
},
{
  id: 10, name: "Nuzvid", code: "NZD", section: "Vijayawada–Eluru",
  zone: "SCR", division: "Vijayawada",
  esp: null, sip: null, lop: null, toc: false,
  survey: { lidar: false, ortho: false, ts: false },
  versions: null,
  lastTime: "Just added", lastBy: "Admin"
},
{
  id: 11, name: "Chirala", code: "CLX", section: "Ongole–Nellore",
  zone: "SCR", division: "Vijayawada",
  esp: "approved", sip: null, lop: null, toc: false,
  survey: { lidar: true, ortho: true, ts: false },
  versions: "ESP v2",
  lastTime: "3 days ago", lastBy: "T. Babu"
},
{
  id: 12, name: "Bisalwas Kalan", code: "BIWK", section: "Nagda–Ratlam",
  zone: "WR", division: "Ratlam",
  esp: "approved", sip: "under_review", lop: null, toc: false,
  survey: { lidar: false, ortho: true, ts: true },
  versions: "ESP v2 · SIP v1",
  lastTime: "2 days ago", lastBy: "K. Naidu"
}];

const DOCUMENT_FILTERS = [
  { value: "all", label: "All document types" },
  { value: "esp", label: "ESP available" },
  { value: "sip", label: "SIP available" },
  { value: "lop", label: "LOP available" },
  { value: "missing_any", label: "Missing any ESP/SIP/LOP" },
  { value: "toc", label: "TOC available" }
];

const STATUS_FILTERS = [
  { value: "all", label: "Any document status" },
  { value: "uploaded", label: "Uploaded" },
  { value: "pending_review", label: "Pending Review" },
  { value: "under_review", label: "Under Review" },
  { value: "digitised", label: "Digitised" },
  { value: "validated", label: "Validated" },
  { value: "approved", label: "Approved" },
  { value: "returned_correction", label: "Returned for Correction" },
  { value: "missing", label: "Missing document" }
];

const SURVEY_FILTERS = [
  { value: "all", label: "Any survey data" },
  { value: "lidar", label: "LiDAR available" },
  { value: "ortho", label: "Ortho available" },
  { value: "ts", label: "Total Station available" },
  { value: "all_survey", label: "All survey data available" },
  { value: "missing_survey", label: "Missing survey data" }
];

const COMPLETENESS_FILTERS = [
  { value: "all", label: "Any completeness" },
  { value: "complete", label: "Complete: 5/5" },
  { value: "incomplete", label: "Incomplete: 1-4/5" },
  { value: "not_started", label: "Not started: 0/5" }
];

const DEFAULT_FILTERS = {
  document: "all",
  status: "all",
  survey: "all",
  completeness: "all"
};

const FILTER_LABELS = {
  document: Object.fromEntries(DOCUMENT_FILTERS.map((o) => [o.value, o.label])),
  status: Object.fromEntries(STATUS_FILTERS.map((o) => [o.value, o.label])),
  survey: Object.fromEntries(SURVEY_FILTERS.map((o) => [o.value, o.label])),
  completeness: Object.fromEntries(COMPLETENESS_FILTERS.map((o) => [o.value, o.label]))
};

const SECTION_SCOPE_LABELS = {
  all: "All Sections",
  "VJA-GDV": "Vijayawada–Gudivada",
  "GNT-TEL": "Guntur–Tenali",
  "EE-SLO": "Eluru–Samalkot"
};

const ZONE_OPTIONS = [
  { value: "SCR", label: "SCR — South Central Railway" },
  { value: "WR", label: "WR — Western Railway" },
  { value: "CR", label: "CR — Central Railway" },
  { value: "NR", label: "NR — Northern Railway" },
  { value: "ER", label: "ER — Eastern Railway" }
];

const DIVISION_OPTIONS = {
  SCR: ["Vijayawada", "Guntur", "Hyderabad", "Guntakal", "Nanded"],
  WR: ["Ratlam", "Vadodara", "Mumbai Central", "Ahmedabad"],
  CR: ["Mumbai", "Pune", "Nagpur", "Solapur"],
  NR: ["Delhi", "Ambala", "Lucknow", "Firozpur"],
  ER: ["Howrah", "Sealdah", "Asansol", "Malda"]
};

const SECTION_OPTIONS = {
  Vijayawada: ["Vijayawada–Gudivada", "Vijayawada–Eluru", "Eluru–Samalkot", "Samalkot–Kakinada"],
  Guntur: ["Guntur–Tenali", "Guntur–Nandyal"],
  Hyderabad: ["Secunderabad–Kazipet", "Hyderabad–Vikarabad"],
  Guntakal: ["Guntakal–Renigunta", "Guntakal–Wadi"],
  Nanded: ["Aurangabad–Ankai", "Nanded–Mudkhed", "Parbhani–Purna"],
  Ratlam: ["Nagda–Ratlam", "Ratlam–Godhra", "Ratlam–Chittaurgarh"],
  Vadodara: ["Vadodara–Godhra", "Vadodara–Ahmedabad"],
  "Mumbai Central": ["Mumbai Central–Surat", "Surat–Vadodara"],
  Ahmedabad: ["Ahmedabad–Viramgam", "Ahmedabad–Vadodara"],
  Mumbai: ["CSMT–Kalyan", "Kalyan–Kasara"],
  Pune: ["Pune–Lonavala", "Pune–Daund"],
  Nagpur: ["Nagpur–Wardha", "Nagpur–Itarsi"],
  Solapur: ["Solapur–Daund", "Solapur–Wadi"],
  Delhi: ["Delhi–Ambala", "Delhi–Ghaziabad"],
  Ambala: ["Ambala–Ludhiana", "Ambala–Kalka"],
  Lucknow: ["Lucknow–Kanpur", "Lucknow–Varanasi"],
  Firozpur: ["Firozpur–Ludhiana", "Firozpur–Bathinda"],
  Howrah: ["Howrah–Barddhaman", "Howrah–Kharagpur"],
  Sealdah: ["Sealdah–Krishnanagar", "Sealdah–Bongaon"],
  Asansol: ["Asansol–Dhanbad", "Asansol–Barddhaman"],
  Malda: ["Malda–New Farakka", "Malda–Azimganj"]
};

const TRAIN_DIRECTIONS = [
  "Up",
  "Down",
  "Up ↔ Down",
  "Bidirectional"
];

const AURANGABAD_STATION_DRAFT = {
  zone: "SCR",
  division: "Nanded",
  section: "Aurangabad–Ankai",
  stationName: "Aurangabad",
  stationCode: "AWB",
  stationTitle: "Aurangabad",
  stationId: "AWB-431240",
  cll: "431.240",
  trainDirection: "Up ↔ Down"
};


/* ─────────────────────────────────────────────────────────────────────
   HELPER: Completeness calculation — Survey / ESP / SIP / LOP / TOC
───────────────────────────────────────────────────────────────────── */
const getCompleteness = (s) => {
  const segs = [
  s.survey.lidar || s.survey.ortho || s.survey.ts,
  s.esp === "approved",
  s.sip === "approved",
  s.lop === "approved",
  s.toc === true];

  return { segs, count: segs.filter(Boolean).length };
};

/* ─────────────────────────────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────────────────────────────── */

/* Document-state chip or absence marker */

const DOC_TOOLTIPS = {
  uploaded:            "Document received and stored — awaiting review",
  pending_review:      "Queued for reviewer assignment",
  under_review:        "Actively being reviewed by the team",
  digitised:           "Content extracted and digitised",
  returned_correction: "Returned for correction — will loop back to Under Review",
  validated:           "Validated — ESP document reviewed and signed off (ESP only)",
  approved:            "Verified and approved",
};

const DOC_STATE = {
  uploaded:            () => <Chip tone="neutral"  variant="solid">Uploaded</Chip>,
  pending_review:      () => <Chip tone="warning"  variant="solid">Pending Review</Chip>,
  under_review:        () => <Chip tone="info"     variant="solid" pulse>Under Review</Chip>,
  digitised:           () => <Chip tone="accent"   variant="solid">Digitised</Chip>,
  returned_correction: () => <Chip tone="danger"    variant="solid">Returned for Correction</Chip>,
  validated:           () => <Chip tone="validated" variant="solid">Validated</Chip>,
  approved:            () => <Chip tone="success"   variant="solid" leadingIcon="check">Approved</Chip>,
};
const getLatestDocVersion = (station, docKey) => {
  const label = docKey.toUpperCase();
  if (docKey === "toc") return station.toc ? "TOC available" : "Not available";
  const version = (station.versions || "").split(" · ").find((item) => item.toLowerCase().startsWith(docKey));
  return version || "Not available";
};
const DocChip = ({ state, latestVersion, docLabel }) => {
  const tip = `${docLabel} latest version: ${latestVersion || "Not available"}`;
  if (!state) return <span className="dl-doc-tip" data-tooltip={tip}><span className="dl-doc-absent">—</span></span>;
  const fn = DOC_STATE[state];
  return <span className="dl-doc-tip" data-tooltip={tip}>{fn ? fn() : <span className="dl-doc-absent">—</span>}</span>;
};

const VISIBLE_DOCUMENT_TYPES = [
  { key: "esp", label: "ESP", missingAction: "Upload" },
  { key: "sip", label: "SIP", missingAction: "Generate" },
  { key: "toc", label: "TOC", missingAction: "Generate" },
  { key: "lop", label: "LOP", missingAction: "Generate" }
];

const normalizeDocumentStatus = (state) => {
  if (!state) return "Not Available";
  return {
    uploaded: "Uploaded",
    pending_review: "Under Review",
    under_review: "Under Review",
    digitised: "Digitised",
    returned_correction: "Need Correction",
    validated: "Approved",
    approved: "Approved",
    failed: "Failed"
  }[state] || "Not Available";
};

const getDocumentTone = (status) => {
  if (status === "Approved" || status === "Digitised" || status === "Available") return "success";
  if (status === "Under Review" || status === "Uploaded") return "info";
  if (status === "Need Correction") return "warning";
  if (status === "Failed") return "danger";
  return "neutral";
};

const formatLatestVersion = (station, docKey) => {
  if (docKey === "toc") return station.toc ? "V1 R0 A0" : "Empty";
  const version = (station.versions || "").split(" · ").find((item) => item.toLowerCase().startsWith(docKey));
  if (!version) return "Empty";
  return version.replace(/^[A-Z]+\s*/i, "").toUpperCase().replace(/^V(\d+)$/, "V$1 R0 A0");
};

const getDocumentState = (station, docKey) => docKey === "toc" ? station.toc ? "approved" : null : station[docKey];
const getLatestApprovedVersion = (station, docKey, status) => {
  if (status !== "Approved") return "Empty";
  return formatLatestVersion(station, docKey);
};

const getSurveySummary = (survey = {}) => {
  const labels = [
    survey.lidar ? "LiDAR" : null,
    survey.ortho ? "Ortho" : null,
    survey.ts ? "Total Station" : null
  ].filter(Boolean);
  return labels.length ? labels.join(" · ") : "Empty";
};

const getStationDocuments = (station) => {
  const documentRows = VISIBLE_DOCUMENT_TYPES.map((doc) => {
    const state = getDocumentState(station, doc.key);
    const status = normalizeDocumentStatus(state);
    const latestVersion = getLatestApprovedVersion(station, doc.key, status);
    const available = latestVersion !== "Empty";
    return {
      ...doc,
      available,
      latestVersion,
      status,
      tone: getDocumentTone(status),
      lastUpdated: available ? station.lastTime : "—",
      action: "View"
    };
  });
  const hasSurvey = station.survey?.lidar || station.survey?.ortho || station.survey?.ts;
  return [
    ...documentRows,
    {
      key: "survey",
      label: "Survey Data",
      available: hasSurvey,
      latestVersion: getSurveySummary(station.survey),
      status: hasSurvey ? "Available" : "Not Available",
      tone: hasSurvey ? "success" : "neutral",
      lastUpdated: hasSurvey ? station.lastTime : "—",
      action: "View"
    }
  ];
};

const getOverallStatus = (documents) => {
  const statuses = documents.map((doc) => doc.status);
  if (statuses.includes("Failed")) return { label: "Action Required", tone: "danger" };
  if (statuses.includes("Need Correction")) return { label: "Correction Required", tone: "warning" };
  if (statuses.includes("Under Review")) return { label: "Under Review", tone: "info" };
  if (statuses.every((status) => status === "Approved" || status === "Digitised")) return { label: "Ready", tone: "success" };
  if (statuses.some((status) => status === "Uploaded" || status === "Digitised")) return { label: "In Progress", tone: "info" };
  if (statuses.includes("Not Available")) return { label: "Incomplete", tone: "neutral" };
  return { label: "In Progress", tone: "info" };
};

const DocumentStatusBadge = ({ status }) => (
  <span className="dl-overall-status" data-tone={getDocumentTone(status)}>{status}</span>
);

const OverallStatusBadge = ({ status }) => (
  <span className="dl-overall-status" data-tone={status.tone}>{status.label}</span>
);

const DocumentDetailsTable = ({ documents, onView }) => (
  <table className="dl-doc-detail-table">
    <thead>
      <tr>
        <th>Document</th>
        <th>Latest Approved Version</th>
        <th>Last Updated</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {documents.map((doc) => (
        <tr key={doc.key} data-available={doc.available ? "true" : "false"}>
          <td>
            <span className="dl-doc-detail-label">
              <span className="dl-doc-detail-dot" data-tone={doc.tone} aria-hidden="true" />
              {doc.label}
            </span>
          </td>
          <td>
            {doc.available
              ? <span className="dl-doc-detail-version">{doc.latestVersion}</span>
              : <span className="dl-doc-detail-empty">Not uploaded</span>}
          </td>
          <td>
            {doc.available
              ? <span className="dl-doc-detail-time">{doc.lastUpdated}</span>
              : <span className="dl-doc-detail-empty">—</span>}
          </td>
          <td>
            {doc.available
              ? <button className="dl-doc-detail-action" type="button" onClick={() => onView(doc)}>View</button>
              : <span className="dl-doc-detail-empty">—</span>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const DocumentDetailsPopover = ({ station, documents, onView }) => {
  const [hoverOpen, setHoverOpen] = useStateLib(false);
  const [modalOpen, setModalOpen] = useStateLib(false);
  const availableCount = documents.filter((doc) => doc.key !== "survey" && doc.available).length;

  React.useEffect(() => {
    if (!modalOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  const openModal = (event) => {
    event.stopPropagation();
    setHoverOpen(false);
    setModalOpen(true);
  };
  const viewDocument = (doc) => {
    if (!doc.available) return;
    setHoverOpen(false);
    setModalOpen(false);
    onView?.(doc, station);
  };

  return (
    <div className="dl-doc-summary" onClick={(event) => event.stopPropagation()}>
      <div className="dl-dot-row" role="button" aria-label={`${availableCount} documents — click for details`} onClick={openModal}>
        {documents.filter((d) => d.key !== "survey").map((doc) => (
          <div className="dl-dot-wrap" key={doc.key}>
            <div className="dl-dot" data-tone={doc.tone} />
            <span className="dl-dot-tip">{doc.label} · {doc.status}</span>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="dl-doc-modal-layer" role="presentation" onClick={() => setModalOpen(false)}>
          <div className="dl-doc-popover" role="dialog" aria-modal="true" aria-label={`Document details for ${station.name}`} onClick={(event) => event.stopPropagation()}>
            <div className="dl-doc-popover-head">
              <div>
                <div className="dl-doc-popover-title">Document Details</div>
                <div className="dl-doc-popover-sub">{station.name} · {station.code}</div>
              </div>
              <button className="dl-doc-popover-close" type="button" aria-label="Close document details" onClick={() => setModalOpen(false)}>
                <Icon name="x" size={13} />
              </button>
            </div>
            <DocumentDetailsTable documents={documents} onView={viewDocument} />
          </div>
        </div>
      )}
    </div>
  );
};

const StationRowActions = ({ station, onView, onAction }) => {
  const [open, setOpen] = useStateLib(false);

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menuAction = (label, event) => {
    event.stopPropagation();
    setOpen(false);
    onAction?.(`${label} for ${station.code}`);
  };

  return (
    <div className="dl-row-actions">
      <button className="dl-row-view-btn" type="button" onClick={onView}>
        <Icon name="eye" size={14} /> View
      </button>
      <div className="dl-row-more-wrap">
        <button className="dl-action-icon" type="button" title="More actions" aria-label={`More actions for ${station.name}`} aria-expanded={open ? "true" : "false"} onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}>
          <Icon name="more" size={15} />
        </button>
        {open && (
          <div className="dl-row-menu" role="menu" onClick={(event) => event.stopPropagation()}>
            <button type="button" role="menuitem" onClick={(event) => menuAction("Download documents", event)}>
              <Icon name="download" size={13} /> Download documents
            </button>
            <button type="button" role="menuitem" onClick={(event) => menuAction("View audit trail", event)}>
              <Icon name="clock" size={13} /> View audit trail
            </button>
            <button type="button" role="menuitem" onClick={(event) => menuAction("Edit metadata", event)}>
              <Icon name="edit" size={13} /> Edit metadata
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


/* Status guide button + modal */
const STATUS_GUIDE_ROWS = [
  { n:1, key:"uploaded",            label:"Uploaded",                tone:"neutral",   desc:"Document received and stored" },
  { n:2, key:"pending_review",      label:"Pending Review",          tone:"warning",   desc:"Queued for reviewer assignment" },
  { n:3, key:"under_review",        label:"Under Review",            tone:"info",      desc:"Actively being reviewed", pulse:true },
  { n:4, key:"digitised",           label:"Digitised",               tone:"accent",    desc:"Content extracted and digitised" },
  { n:5, key:"validated",           label:"Validated",               tone:"validated", desc:"Reviewed and signed off", espOnly:true },
  { n:6, key:"returned_correction", label:"Returned for Correction", tone:"danger",    desc:"Sent back — loops to Under Review" },
  { n:7, key:"approved",            label:"Approved",                tone:"success",   desc:"Verified and approved", check:true },
];

const StatusGuide = () => {
  const [open, setOpen] = useStateLib(false);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen(o => !o);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button className="dl-status-guide-btn" onClick={toggle}>
        <Icon name="info" size={11} /> Status guide
      </button>
      {open && ReactDOM.createPortal((
        <div className="dl-sg-overlay" onClick={() => setOpen(false)}>
          <div className="dl-sg-modal" role="dialog" aria-modal="true" aria-labelledby="status-guide-title" onClick={e => e.stopPropagation()}>
          <div className="dl-sg-head">
            <div>
              <div id="status-guide-title" className="dl-sg-title">Document Status Guide</div>
              <div className="dl-sg-subtitle">Statuses apply independently to ESP, SIP and LOP.</div>
            </div>
            <button className="dl-sg-close" onClick={() => setOpen(false)}><Icon name="x" size={13} /></button>
          </div>
          <div className="dl-sg-rows">
            {STATUS_GUIDE_ROWS.map((s, i) => (
              <React.Fragment key={s.key}>
                {s.key === "returned_correction" && <div className="dl-sg-divider" />}
                <div className="dl-sg-row">
                  <span className="dl-sg-num">{s.n}</span>
                  <span className="dl-sg-status-line">
                    <span className="dl-sg-status" data-tone={s.tone}>
                      {s.pulse && <span className="dl-sg-pulse" />}
                      {s.check && <Icon name="check" size={10} />}
                      {s.label}
                    </span>
                    {s.espOnly && <span className="dl-sg-esp">ESP</span>}
                  </span>
                  <span className="dl-sg-desc">{s.desc}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="dl-sg-footer"><strong>Validated</strong> is ESP-only. <strong>Returned for Correction</strong> loops back to Under Review after amendments.</div>
          </div>
        </div>
      ), document.body)}
    </>
  );
};

const AddStationModal = ({ initialZone, initialDivision, initialSectionScope, existingCodes, onAdd, onClose }) => {
  const resolveDivision = (zone, division) =>
  (DIVISION_OPTIONS[zone] || []).includes(division) ? division : (DIVISION_OPTIONS[zone] || [])[0] || "";

  const resolveSection = (division, sectionScope) => {
    const sections = SECTION_OPTIONS[division] || [];
    const scoped = sectionScope !== "all" ? SECTION_SCOPE_LABELS[sectionScope] || sectionScope : "";
    return sections.includes(scoped) ? scoped : sections[0] || "";
  };

  const startDivision = resolveDivision(initialZone, initialDivision);
  const [form, setForm] = useStateLib({
    ...AURANGABAD_STATION_DRAFT
  });

  const code = form.stationCode.trim().toUpperCase();
  const name = form.stationName.trim();
  const duplicateCode = code && existingCodes.has(code);
  const canSubmit = name && code && form.section && !duplicateCode;

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const updateName = (value) =>
  setForm((prev) => ({
    ...prev,
    stationName: value,
    stationTitle: !prev.stationTitle || prev.stationTitle === prev.stationName ? value : prev.stationTitle
  }));

  const updateZone = (value) => {
    const division = resolveDivision(value, "");
    setForm((prev) => ({
      ...prev,
      zone: value,
      division,
      section: resolveSection(division, "all")
    }));
  };

  const updateDivision = (value) =>
  setForm((prev) => ({
    ...prev,
    division: value,
    section: resolveSection(value, "all")
  }));

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd({
      name,
      code,
      section: form.section,
      zone: form.zone,
      division: form.division,
      stationTitle: form.stationTitle.trim() || name,
      stationId: form.stationId.trim(),
      cll: form.cll.trim(),
      trainDirection: form.trainDirection
    });
  };

  return ReactDOM.createPortal((
    <div className="dl-add-overlay" onClick={onClose}>
      <form className="dl-add-modal" role="dialog" aria-modal="true" aria-labelledby="add-station-title"
      onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="dl-add-head">
          <div>
            <div className="dl-add-title" id="add-station-title">Add New Station</div>
            <div className="dl-add-subtitle">Create a station record and add basic railway details.</div>
          </div>
          <button type="button" className="dl-add-close" onClick={onClose}><Icon name="x" size={15} /></button>
        </div>

        <div className="dl-add-body">
          <div className="dl-add-field">
            <label>Station</label>
            <input value={form.stationName} placeholder="e.g. Bisalwas Kalan"
            onChange={(e) => updateName(e.target.value)} />
          </div>
          <div className="dl-add-field">
            <label>Code</label>
            <input value={form.stationCode} placeholder="e.g. BIWK" maxLength={8}
            onChange={(e) => setForm((prev) => ({ ...prev, stationCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") }))} />
          </div>
          <div className="dl-add-field">
            <label>Station Title</label>
            <input value={form.stationTitle} placeholder="Display title"
            onChange={(e) => setForm((prev) => ({ ...prev, stationTitle: e.target.value }))} />
          </div>

          <div className="dl-add-field">
            <label>Station ID</label>
            <input value={form.stationId} placeholder="e.g. 24055"
            onChange={(e) => setForm((prev) => ({ ...prev, stationId: e.target.value }))} />
          </div>
          <div className="dl-add-field">
            <label>Central Line Location</label>
            <input value={form.cll} placeholder="e.g. 433.560"
            onChange={(e) => setForm((prev) => ({ ...prev, cll: e.target.value }))} />
          </div>
          <div className="dl-add-field">
            <label>Train Direction</label>
            <select value={form.trainDirection}
            onChange={(e) => setForm((prev) => ({ ...prev, trainDirection: e.target.value }))}>
              {TRAIN_DIRECTIONS.map((direction) =>
              <option key={direction} value={direction}>{direction}</option>
              )}
            </select>
          </div>

          <div className="dl-add-field">
            <label>Zone</label>
            <select value={form.zone} onChange={(e) => updateZone(e.target.value)}>
              {ZONE_OPTIONS.map((option) =>
              <option key={option.value} value={option.value}>{option.label}</option>
              )}
            </select>
          </div>
          <div className="dl-add-field">
            <label>Division</label>
            <select value={form.division} onChange={(e) => updateDivision(e.target.value)}>
              {(DIVISION_OPTIONS[form.zone] || []).map((division) =>
              <option key={division} value={division}>{division}</option>
              )}
            </select>
          </div>
          <div className="dl-add-field">
            <label>Section</label>
            <select value={form.section}
            onChange={(e) => setForm((prev) => ({ ...prev, section: e.target.value }))}>
              {(SECTION_OPTIONS[form.division] || []).map((section) =>
              <option key={section} value={section}>{section}</option>
              )}
            </select>
          </div>

          <div className="dl-add-note">
            This creates the station registry shell. ESP, SIP, LOP and survey data start empty so the next step can be document upload or survey linking.
          </div>
          {duplicateCode &&
          <div className="dl-add-error">Station code {code} already exists in the Digital Library.</div>}
        </div>

        <div className="dl-add-actions">
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" variant="accent" leadingIcon="plus" disabled={!canSubmit}>Add Station</Btn>
        </div>
      </form>
    </div>
  ), document.body);
};

const BULK_REQUIRED_COLUMNS = [
  "Zone",
  "Division",
  "Section",
  "Station Name",
  "Station Code",
  "Station Title",
  "Station ID",
  "Central Line Location",
  "Train Direction"
];
const BULK_OPTIONAL_COLUMNS = ["State", "Route", "Latitude", "Longitude", "Remarks"];
const BULK_TEMPLATE_COLUMNS = [...BULK_REQUIRED_COLUMNS, ...BULK_OPTIONAL_COLUMNS];
const BULK_SAMPLE_ROW = {
  Zone: "SCR — South Central Railway",
  Division: "Nanded",
  Section: "Aurangabad–Ankai",
  "Station Name": "Aurangabad",
  "Station Code": "AWB",
  "Station Title": "Aurangabad",
  "Station ID": "AWB-431240",
  "Central Line Location": "431.240",
  "Train Direction": "Up ↔ Down",
  State: "",
  Route: "",
  Latitude: "",
  Longitude: "",
  Remarks: ""
};
const BULK_FIELD_KEYS = {
  "Zone": "zone",
  "Division": "division",
  "Section": "section",
  "Station Name": "stationName",
  "Station Code": "stationCode",
  "Station Title": "stationTitle",
  "Station ID": "stationId",
  "Central Line Location": "cll",
  "Train Direction": "trainDirection",
  "State": "state",
  "Route": "route",
  "Latitude": "latitude",
  "Longitude": "longitude",
  "Remarks": "remarks"
};
const BULK_REVIEW_COLUMNS = [
  "Row Number",
  ...BULK_REQUIRED_COLUMNS,
  "Status",
  "Error Message",
  "Action"
];

const normalizeBulkZone = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const direct = ZONE_OPTIONS.find((option) => option.value.toLowerCase() === raw.toLowerCase());
  if (direct) return direct.value;
  const byLabel = ZONE_OPTIONS.find((option) => option.label.toLowerCase() === raw.toLowerCase());
  if (byLabel) return byLabel.value;
  const prefix = raw.split(/[—-]/)[0].trim();
  return prefix.toUpperCase();
};

const stationIdForExisting = (station) => (station.stationId || station.idCode || station.stationID || "").trim().toUpperCase();
const stationIdentity = (name, division, section) => [name, division, section].map((value) => String(value || "").trim().toLowerCase()).join("|");
const isBlankBulkRow = (row) => Object.values(row || {}).every((value) => !String(value || "").trim());
const newBulkRow = (rowNumber, source = {}) => ({
  rowNumber,
  zone: normalizeBulkZone(source.Zone ?? source.zone),
  division: String(source.Division ?? source.division ?? "").trim(),
  section: String(source.Section ?? source.section ?? "").trim(),
  stationName: String(source["Station Name"] ?? source.stationName ?? "").trim(),
  stationCode: String(source["Station Code"] ?? source.stationCode ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, ""),
  stationTitle: String(source["Station Title"] ?? source.stationTitle ?? "").trim(),
  stationId: String(source["Station ID"] ?? source.stationId ?? "").trim(),
  cll: String(source["Central Line Location"] ?? source.cll ?? "").trim(),
  trainDirection: String(source["Train Direction"] ?? source.trainDirection ?? "").trim(),
  state: String(source.State ?? source.state ?? "").trim(),
  route: String(source.Route ?? source.route ?? "").trim(),
  latitude: String(source.Latitude ?? source.latitude ?? "").trim(),
  longitude: String(source.Longitude ?? source.longitude ?? "").trim(),
  remarks: String(source.Remarks ?? source.remarks ?? "").trim(),
  errors: {},
  status: "pending",
  statusLabel: "Pending validation",
  skipReason: "pending"
});

const csvEscape = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const parseCsvRows = (text) => {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((cells) => cells.some((value) => String(value || "").trim()));
};

const rowsFromCsv = (text) => {
  const rows = parseCsvRows(text);
  const headers = (rows[0] || []).map((header) => String(header || "").trim());
  return rows.slice(1).map((cells, index) => {
    const source = {};
    headers.forEach((header, i) => source[header] = cells[i] || "");
    return { source, rowNumber: index + 2 };
  }).filter(({ source }) => !isBlankBulkRow(source));
};

const missingBulkColumns = (headers = []) => {
  const headerSet = new Set(headers.map((header) => String(header || "").trim().toLowerCase()));
  return BULK_REQUIRED_COLUMNS.filter((column) => !headerSet.has(column.toLowerCase()));
};

const formatBulkFileSize = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
};

const bulkRowMessage = (row) => {
  if (row.status === "valid") return "Ready to import";
  if (row.status === "duplicate") return "Duplicate station in uploaded file";
  if (row.status === "existing") return "Station already exists";
  if (row.status === "pending") return "Edited. Validate rows again.";
  if (row.status === "skipped") return "Skipped and will not be imported";
  return Object.values(row.errors || {}).join(" ") || "Fix validation errors";
};

const BulkUploadStationsPage = ({ existingStations = [], onAdd, onClose }) => {
  const [rows, setRows] = useStateLib([]);
  const [uploadedFile, setUploadedFile] = useStateLib(null);
  const [extractionReport, setExtractionReport] = useStateLib(null);
  const [message, setMessage] = useStateLib("Upload a completed station template to begin.");
  const [validated, setValidated] = useStateLib(false);
  const [validating, setValidating] = useStateLib(false);
  const [readingUpload, setReadingUpload] = useStateLib(false);
  const [dragActive, setDragActive] = useStateLib(false);
  const [templateMissing, setTemplateMissing] = useStateLib(false);
  const [rowFilter, setRowFilter] = useStateLib("all");
  const fileInputRef = React.useRef(null);

  const existingCodeSet = useMemoLib(() => new Set(existingStations.map((station) => station.code.toUpperCase())), [existingStations]);
  const existingIdSet = useMemoLib(() => new Set(existingStations.map(stationIdForExisting).filter(Boolean)), [existingStations]);
  const existingNameSet = useMemoLib(() => new Set(existingStations.map((station) => stationIdentity(station.name, station.division, station.section))), [existingStations]);

  const buildExtractionReport = (nextRows, errors = [], fileName = uploadedFile?.name || "") => {
    const successRows = nextRows.filter((row) => row.status === "valid").length;
    const errorRows = nextRows.filter((row) => row.status !== "valid" && row.status !== "skipped").length + errors.length;
    return {
      fileName,
      totalRows: nextRows.length,
      successRows,
      errorRows,
      errors
    };
  };

  const setValidatedRows = (nextRows, nextMessage, errors = [], fileName = uploadedFile?.name || "") => {
    setRows(nextRows);
    setExtractionReport(buildExtractionReport(nextRows, errors, fileName));
    setValidated(true);
    if (nextMessage) setMessage(nextMessage);
    return nextRows;
  };

  const buildValidatedRows = (draftRows = rows) => {
    const codeCounts = {};
    const idCounts = {};
    draftRows.forEach((row) => {
      const code = row.stationCode.trim().toUpperCase();
      const id = row.stationId.trim().toUpperCase();
      if (code) codeCounts[code] = (codeCounts[code] || 0) + 1;
      if (id) idCounts[id] = (idCounts[id] || 0) + 1;
    });

    const nextRows = draftRows.map((row) => {
      const errors = {};
      const required = {
        zone: "Zone",
        division: "Division",
        section: "Section",
        stationName: "Station Name",
        stationCode: "Station Code",
        stationTitle: "Station Title",
        stationId: "Station ID",
        cll: "Central Line Location",
        trainDirection: "Train Direction"
      };
      Object.entries(required).forEach(([key, label]) => {
        if (!String(row[key] || "").trim()) errors[key] = `${label} is required.`;
      });

      const zone = normalizeBulkZone(row.zone);
      if (row.zone && !ZONE_OPTIONS.some((option) => option.value === zone)) errors.zone = "Zone must match allowed master values.";
      if (row.division && !(DIVISION_OPTIONS[zone] || []).includes(row.division)) errors.division = "Division must belong to selected Zone.";
      if (row.section && !(SECTION_OPTIONS[row.division] || []).includes(row.section)) errors.section = "Section must belong to selected Division.";

      const code = row.stationCode.trim().toUpperCase();
      const id = row.stationId.trim().toUpperCase();
      if (code && codeCounts[code] > 1) errors.stationCode = "Station Code is duplicated in uploaded file.";
      else if (code && existingCodeSet.has(code)) errors.stationCode = "Station Code already exists in system.";
      if (id && idCounts[id] > 1) errors.stationId = "Station ID is duplicated in uploaded file.";
      else if (id && existingIdSet.has(id)) errors.stationId = "Station ID already exists in system.";
      if (row.stationName && row.division && row.section && existingNameSet.has(stationIdentity(row.stationName, row.division, row.section))) {
        errors.stationName = "Station Name + Division + Section already exists.";
      }
      if (row.cll && Number.isNaN(Number(row.cll))) errors.cll = "Central Line Location must be numeric.";
      if (row.trainDirection && !TRAIN_DIRECTIONS.includes(row.trainDirection)) errors.trainDirection = "Train Direction must match allowed values.";
      if (row.latitude && Number.isNaN(Number(row.latitude))) errors.latitude = "Latitude must be numeric.";
      if (row.longitude && Number.isNaN(Number(row.longitude))) errors.longitude = "Longitude must be numeric.";

      const values = Object.values(errors);
      const status = values.some((error) => error.includes("uploaded file")) ? "duplicate" :
        values.some((error) => error.includes("already exists")) ? "existing" :
        values.length ? "error" : "valid";

      return {
        ...row,
        zone,
        stationCode: code,
        errors,
        status,
        statusLabel: status === "valid" ? "Valid" : status === "duplicate" ? "Duplicate" : status === "existing" ? "Existing Station" : "Error",
        skipReason: status
      };
    });
    return nextRows;
  };

  const applyValidationResult = (nextRows) => {
    const validRows = nextRows.filter((row) => row.status === "valid").length;
    const errorRows = nextRows.filter((row) => ["error", "duplicate", "existing", "pending"].includes(row.status)).length;
    const nextMessage = validRows && errorRows ?
      "Validation complete. Fix highlighted rows, then validate rows again." :
      validRows ?
        "Validation complete. All rows are ready to import." :
        "No valid station records found. Fix highlighted rows, then validate rows again.";
    return setValidatedRows(nextRows, nextMessage);
  };

  const validateRows = (draftRows = rows) => applyValidationResult(buildValidatedRows(draftRows));

  const runValidation = () => {
    if (!uploadedFile || templateMissing || readingUpload) return;
    setValidating(true);
    setMessage("Validating station records…");
    window.setTimeout(() => {
      applyValidationResult(buildValidatedRows(rows));
      setValidating(false);
    }, 450);
  };

  const stats = useMemoLib(() => {
    const validRows = rows.filter((row) => row.status === "valid").length;
    const pendingRows = rows.filter((row) => row.status === "pending").length;
    const skippedManualRows = rows.filter((row) => row.status === "skipped").length;
    const duplicateRows = rows.filter((row) => row.status === "duplicate").length;
    const existingRows = rows.filter((row) => row.status === "existing").length;
    const errorRows = rows.filter((row) => row.status === "error").length;
    const skippedRows = errorRows + duplicateRows + existingRows + pendingRows + skippedManualRows;
    return { totalRows: rows.length, validRows, errorRows, duplicateRows, existingRows, pendingRows, skippedManualRows, skippedRows };
  }, [rows]);

  const reviewRows = useMemoLib(() => rows.map((row, index) => ({ row, index })).filter(({ row }) => {
    if (rowFilter === "valid") return row.status === "valid";
    if (rowFilter === "skipped") return row.status && row.status !== "valid";
    return true;
  }), [rows, rowFilter]);

  const downloadTemplate = () => {
    const sample = BULK_TEMPLATE_COLUMNS.map((header) => BULK_SAMPLE_ROW[header] || "");
    if (window.XLSX) {
      const workbook = window.XLSX.utils.book_new();
      const templateSheet = window.XLSX.utils.aoa_to_sheet([BULK_TEMPLATE_COLUMNS, sample]);
      const helperRows = [
        ["Zone list", ...ZONE_OPTIONS.map((option) => option.label)],
        ["Division list", ...Object.values(DIVISION_OPTIONS).flat()],
        ["Section list", ...Object.values(SECTION_OPTIONS).flat()],
        ["Train Direction list", ...TRAIN_DIRECTIONS]
      ];
      const helperSheet = window.XLSX.utils.aoa_to_sheet(helperRows);
      window.XLSX.utils.book_append_sheet(workbook, templateSheet, "Stations Template");
      window.XLSX.utils.book_append_sheet(workbook, helperSheet, "Allowed Values");
      window.XLSX.writeFile(workbook, "bulk-upload-stations-template.xlsx");
    } else {
      const helper = [
        [],
        ["Allowed Values"],
        ["Zone list", ...ZONE_OPTIONS.map((option) => option.label)],
        ["Division list", ...Object.values(DIVISION_OPTIONS).flat()],
        ["Section list", ...Object.values(SECTION_OPTIONS).flat()],
        ["Train Direction list", ...TRAIN_DIRECTIONS]
      ];
      const csv = [[...BULK_TEMPLATE_COLUMNS], sample, ...helper].map((row) => row.map(csvEscape).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "bulk-upload-stations-template.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const readUpload = async (file) => {
    if (!file) return;
    setReadingUpload(true);
    setUploadedFile({ name: file.name, size: file.size });
    setRows([]);
    setExtractionReport(null);
    setValidated(false);
    setTemplateMissing(false);
    setRowFilter("all");
    setMessage(`Reading ${file.name}…`);
    try {
      let imported = [];
      let headers = [];
      if (/\.xlsx$/i.test(file.name)) {
        if (!window.XLSX) {
          setMessage("XLSX support is still loading. Use CSV or try again in a moment.");
          return;
        }
        const buffer = await file.arrayBuffer();
        const workbook = window.XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false, defval: "" });
        headers = (rawRows[0] || []).map((header) => String(header || "").trim());
        imported = rawRows.slice(1).map((cells, index) => {
          const source = {};
          headers.forEach((header, i) => source[header] = cells[i] || "");
          return { source, rowNumber: index + 2 };
        }).filter(({ source }) => !isBlankBulkRow(source));
      } else {
        const csvRows = parseCsvRows(await file.text());
        headers = (csvRows[0] || []).map((header) => String(header || "").trim());
        imported = csvRows.slice(1).map((cells, index) => {
          const source = {};
          headers.forEach((header, i) => source[header] = cells[i] || "");
          return { source, rowNumber: index + 2 };
        }).filter(({ source }) => !isBlankBulkRow(source));
      }
      const missingColumns = missingBulkColumns(headers);
      if (missingColumns.length) {
        setRows([]);
        setExtractionReport({
          fileName: file.name,
          totalRows: imported.length,
          successRows: 0,
          errorRows: imported.length || 1,
          errors: [`Missing required columns: ${missingColumns.join(", ")}`]
        });
        setValidated(false);
        setTemplateMissing(true);
        setMessage(`Template columns are missing: ${missingColumns.join(", ")}. Please download and use the latest template.`);
        return;
      }
      const nextRows = imported.filter(({ source }) => !isBlankBulkRow(source)).map(({ source, rowNumber }) => newBulkRow(rowNumber, source));
      if (!nextRows.length) {
        setRows([]);
        setExtractionReport({
          fileName: file.name,
          totalRows: 0,
          successRows: 0,
          errorRows: 0,
          errors: []
        });
        setValidated(false);
        setTemplateMissing(false);
        setMessage("The template was read, but no station rows were found. Add station data and upload again.");
        return;
      }
      const validatedRows = buildValidatedRows(nextRows);
      const validRows = validatedRows.filter((row) => row.status === "valid").length;
      const errorRows = validatedRows.length - validRows;
      setValidatedRows(
        validatedRows,
        errorRows ? "Extraction complete. Fix highlighted rows, then validate rows again." : "Extraction complete. All rows are ready to import.",
        [],
        file.name
      );
      setTemplateMissing(false);
    } catch {
      setRows([]);
      setExtractionReport({
        fileName: file.name,
        totalRows: 0,
        successRows: 0,
        errorRows: 1,
        errors: ["File could not be read as a station template."]
      });
      setValidated(false);
      setTemplateMissing(false);
      setMessage("Could not read upload. Please use the template as .xlsx or .csv.");
    } finally {
      setReadingUpload(false);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    readUpload(file);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    readUpload(event.dataTransfer.files?.[0]);
  };

  const updateCell = (index, key, value) => {
    setRows((current) => {
      const nextRows = current.map((row, i) => {
        if (i !== index) return row;
        const nextErrors = { ...(row.errors || {}) };
        delete nextErrors[key];
        return {
          ...row,
          [key]: key === "stationCode" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "") : value,
          errors: nextErrors,
          status: "pending",
          statusLabel: "Edited",
          skipReason: "pending"
        };
      });
      setExtractionReport(buildExtractionReport(nextRows));
      return nextRows;
    });
  };

  const removeRow = (index) => {
    setRows((current) => {
      const nextRows = current.filter((_, i) => i !== index);
      setExtractionReport(buildExtractionReport(nextRows));
      return nextRows;
    });
  };

  const resetUpload = () => {
    setRows([]);
    setUploadedFile(null);
    setExtractionReport(null);
    setValidated(false);
    setValidating(false);
    setReadingUpload(false);
    setTemplateMissing(false);
    setRowFilter("all");
    setMessage("Upload a completed station template to begin.");
  };

  const skipErrorRows = () => {
    setRows((current) => {
      const nextRows = current.map((row) => ["error", "duplicate", "existing", "pending"].includes(row.status) ? {
        ...row,
        status: "skipped",
        statusLabel: "Skipped",
        skipReason: "skipped"
      } : row);
      setExtractionReport(buildExtractionReport(nextRows));
      return nextRows;
    });
    setMessage("Skipped rows will not be added as stations. Only valid rows will be imported.");
  };

  const importValid = () => {
    const validRows = rows.filter((row) => row.status === "valid");
    const skipped = rows.length - validRows.length;
    if (!validRows.length) return;
    if (!window.confirm(`${validRows.length} valid station${validRows.length === 1 ? "" : "s"} will be added. ${skipped} row${skipped === 1 ? "" : "s"} will be skipped.`)) return;
    onAdd(validRows.map((row) => ({
      name: row.stationName.trim(),
      code: row.stationCode.trim().toUpperCase(),
      section: row.section,
      zone: row.zone,
      division: row.division,
      stationTitle: row.stationTitle.trim(),
      stationId: row.stationId.trim(),
      cll: row.cll.trim(),
      trainDirection: row.trainDirection,
      state: row.state || "",
      route: row.route || "",
      latitude: row.latitude || "",
      longitude: row.longitude || "",
      remarks: row.remarks || ""
    })), skipped);
  };

  const revalidateRow = () => validateRows(rows);

  const fieldControl = (row, rowIndex, header) => {
    const key = BULK_FIELD_KEYS[header];
    const invalid = !!row.errors?.[key];
    const common = {
      value: row[key] || "",
      onChange: (event) => updateCell(rowIndex, key, event.target.value),
      title: row.errors?.[key] || undefined
    };
    if (header === "Zone") {
      return <td key={header} data-invalid={invalid || undefined}><select {...common}>{["", ...ZONE_OPTIONS.map((option) => option.value)].map((value) => <option key={value} value={value}>{value || "Select"}</option>)}</select></td>;
    }
    if (header === "Division") {
      return <td key={header} data-invalid={invalid || undefined}><select {...common}>{["", ...Object.values(DIVISION_OPTIONS).flat()].map((value) => <option key={value} value={value}>{value || "Select"}</option>)}</select></td>;
    }
    if (header === "Section") {
      return <td key={header} data-invalid={invalid || undefined}><select {...common}>{["", ...Object.values(SECTION_OPTIONS).flat()].map((value) => <option key={value} value={value}>{value || "Select"}</option>)}</select></td>;
    }
    if (header === "Train Direction") {
      return <td key={header} data-invalid={invalid || undefined}><select {...common}>{["", ...TRAIN_DIRECTIONS].map((value) => <option key={value} value={value}>{value || "Select"}</option>)}</select></td>;
    }
    return <td key={header} data-invalid={invalid || undefined}><input {...common} /></td>;
  };

  return (
    <div className="dl-bulk-page">
      <div className="dl-bulk-page-head">
        <div>
          <div className="dl-bulk-page-title">Bulk Upload Stations</div>
          <div className="dl-bulk-page-subtitle">
            Upload a station template, validate rows, fix errors, and import valid stations.
          </div>
        </div>
      </div>

      <div className="dl-bulk-panel">
        <div className="dl-bulk-workflow">
          <div className="dl-bulk-toolbar">
            <Btn type="button" variant="secondary" leadingIcon="download" onClick={downloadTemplate}>Download Template</Btn>
            <input
              ref={fileInputRef}
              className="dl-bulk-file-input"
              type="file"
              accept=".xlsx,.csv,text/csv"
              onChange={handleFileChange}
            />
          </div>

          {!uploadedFile && !readingUpload && (
            <div
              className="dl-bulk-upload-zone"
              data-drag={dragActive ? "true" : undefined}
              onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
              onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <div className="dl-bulk-upload-icon"><Icon name="upload" size={19} /></div>
              <div>
                <div className="dl-bulk-upload-title">Drop the completed station template here</div>
                <div className="dl-bulk-upload-sub">Use the downloaded `.xlsx` or `.csv` template with one station per row.</div>
              </div>
              <Btn type="button" variant="secondary" leadingIcon="upload" onClick={openFilePicker}>Upload File</Btn>
            </div>
          )}

          {uploadedFile && (
              <div className="dl-bulk-file-card">
                <div className="dl-bulk-file-meta">
                  <strong>{uploadedFile.name}</strong>
                  <span>{formatBulkFileSize(uploadedFile.size)}</span>
                </div>
                <button type="button" className="dl-bulk-link-btn" onClick={resetUpload}>Remove</button>
              </div>
          )}

          {message && <div className="dl-add-note">{message}</div>}

          {extractionReport && (
            <div className="dl-bulk-extraction">
              <div className="dl-bulk-extraction-head">
                <div>
                  <div className="dl-bulk-extraction-title">Extraction Report</div>
                  <div className="dl-bulk-extraction-sub">{extractionReport.fileName}</div>
                </div>
                {readingUpload && <Chip tone="info" pulse>Reading</Chip>}
              </div>
              <div className="dl-bulk-extraction-grid">
                <div className="dl-bulk-extraction-card">
                  <strong>{extractionReport.totalRows}</strong>
                  <span>Rows Count</span>
                </div>
                <div className="dl-bulk-extraction-card" data-tone="success">
                  <strong>{extractionReport.successRows}</strong>
                  <span>Success</span>
                </div>
                <div className="dl-bulk-extraction-card" data-tone="error">
                  <strong>{extractionReport.errorRows}</strong>
                  <span>Error</span>
                </div>
              </div>
              {!!extractionReport.errors?.length && (
                <div className="dl-bulk-extraction-errors">
                  {extractionReport.errors.map((error, index) => <div key={`${error}-${index}`}>{error}</div>)}
                </div>
              )}
            </div>
          )}

          {!validated && rows.length > 0 && !validating && !readingUpload && (
            <div className="dl-bulk-preview">
              <span>{rows.length} row{rows.length === 1 ? "" : "s"} ready for validation.</span>
              <Btn type="button" variant="primary" size="sm" leadingIcon="check" onClick={runValidation}>Validate File</Btn>
            </div>
          )}

          {validating && (
            <div className="dl-bulk-loading">
              <span className="dl-bulk-spinner" aria-hidden="true" />
              <span>Validating station records…</span>
            </div>
          )}

          {validated && (
            <>
              <div className="dl-bulk-summary-grid">
                <div className="dl-bulk-card"><strong>{stats.totalRows}</strong><span>Total Rows</span></div>
                <div className="dl-bulk-card"><strong>{stats.validRows}</strong><span>Valid Rows</span></div>
                <div className="dl-bulk-card"><strong>{stats.errorRows}</strong><span>Error Rows</span></div>
                <div className="dl-bulk-card"><strong>{stats.duplicateRows}</strong><span>Duplicate Rows</span></div>
                <div className="dl-bulk-card"><strong>{stats.existingRows}</strong><span>Existing Stations</span></div>
                <div className="dl-bulk-card"><strong>{stats.skippedRows}</strong><span>Rows to Fix/Skip</span></div>
              </div>

              <div className="dl-bulk-info">
                <Icon name="info" size={14} />
                <span>Skipped rows will not be added as stations. Only valid rows will be imported.</span>
              </div>

              <div className="dl-bulk-row-tabs" aria-label="Review row filter">
                {[
                  { id: "all", label: "All Rows", count: stats.totalRows },
                  { id: "valid", label: "Valid Rows", count: stats.validRows },
                  { id: "skipped", label: "Rows to Fix", count: stats.skippedRows }
                ].map((tab) =>
                <button
                  type="button"
                  className="dl-bulk-row-tab"
                  data-active={rowFilter === tab.id ? "true" : undefined}
                  key={tab.id}
                  onClick={() => setRowFilter(tab.id)}>
                    {tab.label} <span>{tab.count}</span>
                  </button>
                )}
              </div>
              <div className="dl-bulk-review-wrap">
                <table className="dl-bulk-review">
                  <colgroup>
                    {BULK_REVIEW_COLUMNS.map((header) => <col key={header} />)}
                  </colgroup>
                  <thead>
                    <tr>{BULK_REVIEW_COLUMNS.map((header) => <th key={header}>{header}</th>)}</tr>
                  </thead>
                  <tbody>
                    {reviewRows.length ? reviewRows.map(({ row, index: rowIndex }) => {
                      return (
                        <tr key={`${row.rowNumber}-${rowIndex}`}>
                          <td>{row.rowNumber}</td>
                          {BULK_REQUIRED_COLUMNS.map((header) => fieldControl(row, rowIndex, header))}
                          <td><span className="dl-bulk-row-status" data-status={row.status}>{row.statusLabel}</span></td>
                          <td><div className="dl-bulk-error-msg" data-ready={row.status === "valid" ? "true" : undefined} data-muted={row.status === "skipped" ? "true" : undefined}>{bulkRowMessage(row)}</div></td>
                          <td>
                            <div className="dl-bulk-row-actions">
                              <button className="dl-bulk-remove" type="button" onClick={revalidateRow}>Validate</button>
                              <button className="dl-bulk-remove" type="button" onClick={() => removeRow(rowIndex)}>Remove</button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={BULK_REVIEW_COLUMNS.length}>
                          <div className="dl-bulk-empty">No rows in this view.</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="dl-bulk-footer">
          <div className="dl-bulk-footer-note">Only valid rows will be imported. Skipped rows will not be added as stations.</div>
          <div className="dl-bulk-footer-actions">
            <Btn type="button" variant="secondary" onClick={onClose || resetUpload}>Cancel</Btn>
            <Btn type="button" variant="secondary" leadingIcon="refresh" disabled={!validated || validating || !rows.length} onClick={() => validateRows(rows)}>Validate Rows</Btn>
            <Btn type="button" variant="secondary" leadingIcon="x" disabled={!validated || validating || !(stats.errorRows || stats.duplicateRows || stats.existingRows || stats.pendingRows)} onClick={skipErrorRows}>Skip Error Rows</Btn>
            <Btn type="button" variant="accent" leadingIcon="plus" disabled={!validated || validating || !stats.validRows} onClick={importValid}>Import Valid Stations</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Survey-data tag cluster */
const SurveyCell = ({ survey }) => {
  const available = [["LiDAR", survey.lidar], ["Ortho", survey.ortho], ["TS", survey.ts]].filter(([, present]) => present);
  if (!available.length) return <span className="dl-survey-none">—</span>;
  return (
    <div className="dl-survey-tags">
      {available.map(([lbl]) =>
      <span key={lbl} className="dl-survey-tag" data-present="true">{lbl}</span>
      )}
    </div>);
};

/* Completeness segmented bar */
const CompletenessCell = ({ station }) => {
  const { segs, count } = getCompleteness(station);
  const LABELS = ["Survey", "ESP", "SIP", "LOP", "TOC"];
  return (
    <div className="dl-complete">
      <div className="dl-complete-bar">
        {segs.map((done, i) =>
        <div key={i} className="dl-complete-seg"
        title={`${LABELS[i]}: ${done ? "Complete" : "Incomplete"}`}
        style={{ background: done ? "var(--success)" : "var(--ink-200)" }} />
        )}
      </div>
      <span className="dl-complete-count">{count}/5</span>
    </div>);

};

/* Sortable column header */
const SortTh = ({ children, sortKey, sort, onSort, style }) => {
  const active = sort.key === sortKey;
  return (
    <th style={style} data-sortable="true" data-active={active || undefined}
    onClick={() => onSort(sortKey)}>
      <span className="ds-th-inner">
        {children}
        {active ?
        <Icon name={sort.dir === "asc" ? "arrow_up" : "arrow_down"} size={11} /> :
        <Icon name="sort" size={11} style={{ opacity: 0.35 }} />}
      </span>
    </th>);

};

/* ─────────────────────────────────────────────────────────────────────
   IR SIDEBAR — reuses all .ds-sidebar CSS; updated brand + nav
───────────────────────────────────────────────────────────────────── */
const LibrarySidebar = ({ collapsed, onToggle, active = "library", onNavigate }) => {
  const groups = [
  {
    label: "MANAGE",
    items: [
    { id: "library", icon: "book", label: "Digital Library" },
    { id: "workspace", icon: "layers", label: "Workspace" }]
  },
  {
    label: "REVIEW",
    items: [
    { id: "approvals", icon: "check_circle", label: "Approvals", badge: "7" }]
  },
  {
    label: "SYSTEM",
    items: [
    { id: "help", icon: "info", label: "Help" },
    { id: "settings", icon: "settings", label: "Settings" }]
  }];

  return (
    <aside className="ds-sidebar" data-collapsed={collapsed ? "true" : "false"}>
      <div className="ds-sidebar-brand">
        <div className="ds-sidebar-mark"><img src="ir-logo.png" alt="Indian Railways" /></div>
        <div>
          <div className="ds-sidebar-title">Indian Railways</div>
          <div className="ds-sidebar-sub"></div>
        </div>
        <button className="dl-sidebar-toggle-btn" onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <Icon name={collapsed ? "panel_left_open" : "panel_left_close"} size={16} />
        </button>
      </div>

      <nav className="ds-sidebar-nav">
        {/* Home — standalone, above groups */}
        <div className="ds-sidebar-item" data-active={active === "home" ? "true" : "false"}
          title={collapsed ? "Home" : undefined}
          onClick={() => onNavigate && onNavigate("home")}>
          <Icon name="home" /><span>Home</span>
        </div>

        {groups.map((g) =>
          <div key={g.label}>
            <div className="ds-sidebar-section">{g.label}</div>
            {g.items.map((it) =>
              <div key={it.id} className="ds-sidebar-item"
                data-active={active === it.id ? "true" : "false"}
                title={collapsed ? it.label : undefined}
                onClick={() => onNavigate && onNavigate(it.id)}>
                <Icon name={it.icon} />
                <span>{it.label}</span>
                {it.badge && <span className="ds-sidebar-badge">{it.badge}</span>}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="ds-sidebar-foot">
        <div className="ds-sidebar-user" title={collapsed ? "Sarath" : undefined}>S</div>
        <div className="ds-sidebar-userinfo">
          <div className="ds-sidebar-username">Sarath</div>
          <div className="ds-sidebar-userrole">Admin SCR</div>
        </div>
        <button className="ds-sidebar-foot-btn" title="Sign out" onClick={() => {
          try { sessionStorage.removeItem('ir-login-session'); sessionStorage.removeItem('lr-authed'); } catch(e) {}
          window.location.reload();
        }}>
          <Icon name="log_out" size={15} />
        </button>
      </div>
    </aside>);
};

/* ─────────────────────────────────────────────────────────────────────
   LOGIN — first-run gate
───────────────────────────────────────────────────────────────────── */
const readLoginSession = () => {
  try {
    const stored = window.sessionStorage.getItem("ir-login-session");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const LoginPage = ({ onLogin }) => {
  const [railId, setRailId] = useStateLib("IR-SCR-1024");
  const [password, setPassword] = useStateLib("railway");
  const [division, setDivision] = useStateLib("Nanded");
  const [accessDesk, setAccessDesk] = useStateLib("approver");
  const [remember, setRemember] = useStateLib(false);
  const [error, setError] = useStateLib("");

  const submit = (event) => {
    event.preventDefault();
    if (!railId.trim() || !password.trim()) {
      setError("Rail ID and password are required.");
      return;
    }

    const session = {
      railId: railId.trim(),
      operator: "Ashwini Vaishnav",
      division,
      accessDesk
    };

    try {
      if (remember) {
        window.sessionStorage.setItem("ir-login-session", JSON.stringify(session));
      } else {
        window.sessionStorage.removeItem("ir-login-session");
      }
    } catch {
      // Access can continue even if browser storage is unavailable.
    }

    onLogin(session);
  };

  return (
    <main className="ir-login-shell">
      <section className="ir-login-visual" aria-label="Indian Railways access context">
        <div className="ir-login-brand">
          <div className="ir-login-mark" style={{background:'none',padding:0,overflow:'hidden',borderRadius:'50%'}}><img src="ir-logo.png" alt="Indian Railways" style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>
          <div>
            <div className="ir-login-brand-title">Indian Railways</div>
            <div className="ir-login-brand-sub">ESP, SIP and LOP control desk</div>
          </div>
        </div>

        <div className="ir-login-scene" aria-hidden="true">
          <div className="ir-station-board">
            <div>
              <div className="ir-board-small">भारतीय रेल</div>
              <div className="ir-board-name">Aurangabad</div>
              <div className="ir-board-hindi">औरंगाबाद</div>
              <div className="ir-board-code"><Icon name="train" size={14} /> AWB · SCR</div>
            </div>
          </div>

          <div className="ir-vb-train" aria-label="Vande Bharat Express illustration">
            <div className="ir-vb-train-label">
              <span className="ir-vb-train-name">वन्दे भारत एक्सप्रेस</span>
              <span className="ir-vb-train-badge">Train 18 · SCR</span>
            </div>
            <svg viewBox="0 0 560 95" fill="none" xmlns="http://www.w3.org/2000/svg" className="ir-vb-train-svg" aria-hidden="true">
              <ellipse cx="280" cy="90" rx="272" ry="5" fill="rgba(14,27,44,0.07)"/>
              <rect x="28" y="16" width="504" height="62" fill="white"/>
              <path d="M28 16 C28 16 8 28 6 53 L6 78 L28 78 Z" fill="#1B4FA8"/>
              <path d="M532 16 C532 16 552 28 554 53 L554 78 L532 78 Z" fill="#1B4FA8"/>
              <rect x="6" y="16" width="548" height="15" fill="#1B4FA8"/>
              <rect x="6" y="63" width="548" height="15" fill="#1B4FA8"/>
              <rect x="6" y="31" width="548" height="4" fill="#FF7722"/>
              <rect x="6" y="59" width="548" height="4" fill="#FF7722"/>
              <path d="M16 34 L28 34 L28 63 L16 63 C10 57 8 51 10 45 Z" fill="#C8E6FA" opacity="0.9"/>
              <path d="M544 34 L532 34 L532 63 L544 63 C550 57 552 51 550 45 Z" fill="#C8E6FA" opacity="0.9"/>
              <rect x="36" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="58" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="80" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="102" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="124" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="146" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="168" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="190" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="212" y="16" width="3" height="62" fill="#1B4FA8" opacity="0.3"/>
              <rect x="222" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="244" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="266" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="288" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="310" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="332" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="354" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="376" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="398" y="16" width="3" height="62" fill="#1B4FA8" opacity="0.3"/>
              <rect x="408" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="430" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="452" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="474" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="496" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <rect x="518" y="38" width="16" height="13" rx="1.5" fill="#C8E6FA" opacity="0.85"/>
              <text x="280" y="53" fontFamily="Arial,sans-serif" fontSize="9.5" fontWeight="900" fill="#1B4FA8" textAnchor="middle" letterSpacing="2.5">VANDE BHARAT EXPRESS</text>
              <rect x="30" y="77" width="100" height="5" rx="1.5" fill="#3a3a3a"/>
              <circle cx="52" cy="82" r="6" fill="#1a1a1a" stroke="#666" strokeWidth="1.5"/>
              <circle cx="108" cy="82" r="6" fill="#1a1a1a" stroke="#666" strokeWidth="1.5"/>
              <rect x="230" y="77" width="100" height="5" rx="1.5" fill="#3a3a3a"/>
              <circle cx="252" cy="82" r="6" fill="#1a1a1a" stroke="#666" strokeWidth="1.5"/>
              <circle cx="308" cy="82" r="6" fill="#1a1a1a" stroke="#666" strokeWidth="1.5"/>
              <rect x="430" y="77" width="100" height="5" rx="1.5" fill="#3a3a3a"/>
              <circle cx="452" cy="82" r="6" fill="#1a1a1a" stroke="#666" strokeWidth="1.5"/>
              <circle cx="508" cy="82" r="6" fill="#1a1a1a" stroke="#666" strokeWidth="1.5"/>
              <rect x="0" y="86" width="560" height="3" rx="1.5" fill="#888"/>
              <rect x="0" y="91" width="560" height="3" rx="1.5" fill="#888"/>
            </svg>
          </div>

          <div className="ir-route-panel">
            <div className="ir-route-head">
              <span>Nanded Division</span>
              <span className="mono">431.240 KM</span>
            </div>
            <div className="ir-route-track">
              <div className="ir-track-sleeper" />
              <div className="ir-route-node a" />
              <div className="ir-route-node b" />
              <div className="ir-route-node c" />
              <div className="ir-route-label a">Daulatabad</div>
              <div className="ir-route-label b">AWB</div>
              <div className="ir-route-label c">Chikalthan</div>
            </div>
          </div>
        </div>

        <div className="ir-login-ops">
          <div className="ir-login-op"><span>Zone</span><strong>South Central</strong></div>
          <div className="ir-login-op"><span>Workspace</span><strong>Digital Library</strong></div>
          <div className="ir-login-op"><span>Status</span><strong>SSO Active</strong></div>
        </div>
      </section>

      <section className="ir-login-panel">
        <form className="ir-login-card" onSubmit={submit}>
          <div className="ir-login-card-head">
            <div className="ir-login-kicker"><Icon name="shield" size={13} /> Secure access</div>
            <div>
              <h1 className="ir-login-title">Sign in to RailWorks</h1>
              <p className="ir-login-sub">Use your railway ID to access station documents, approvals and validation workspaces.</p>
            </div>
          </div>

          <div className="ir-login-form">
            <Field label="Rail ID" required>
              <TextInput
                leadingIcon="users"
                value={railId}
                autoComplete="username"
                onChange={(event) => { setRailId(event.target.value); setError(""); }}
              />
            </Field>

            <Field label="Password" required>
              <TextInput
                leadingIcon="lock"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => { setPassword(event.target.value); setError(""); }}
              />
            </Field>

            <div className="ir-login-form-grid">
              <Field label="Division">
                <Select value={division} onChange={(event) => setDivision(event.target.value)}>
                  <option value="Nanded">Nanded</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Guntakal">Guntakal</option>
                </Select>
              </Field>
              <Field label="Access desk">
                <Select value={accessDesk} onChange={(event) => setAccessDesk(event.target.value)}>
                  <option value="approver">Approver</option>
                  <option value="engineering">Engineering</option>
                  <option value="survey">Survey</option>
                  <option value="ohe">OHE</option>
                </Select>
              </Field>
            </div>

            <label className="ir-login-remember">
              <Checkbox checked={remember} onChange={setRemember} ariaLabel="Keep me signed in" />
              <span>Keep me signed in on this device</span>
            </label>

            {error && <div className="ir-login-error"><Icon name="alert" size={13} />{error}</div>}

            <div className="ir-login-submit">
              <Btn type="submit" variant="accent" size="lg" leadingIcon="lock">Sign in</Btn>
            </div>
          </div>

          <div className="ir-login-foot">
            <span className="ir-login-secure"><Icon name="shield" size={13} /> SSO gateway</span>
            <span>Help desk 139</span>
          </div>
        </form>
      </section>
    </main>
  );
};

const DigitalLibraryApp = () => {
  const [session, setSession] = useStateLib(readLoginSession);

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  return <DigitalLibraryPage user={session} />;
};

/* ─────────────────────────────────────────────────────────────────────
   MAIN PAGE — DigitalLibraryPage
───────────────────────────────────────────────────────────────────── */
const DigitalLibraryPage = () => {
  /* Tweaks */
  const [t, setTweak] = useTweaks(DL_TWEAK_DEFAULTS);

  /* Station registry */
  const [stations, setStations] = useStateLib(ALL_STATIONS);
  const [addStationOpen, setAddStationOpen] = useStateLib(false);
  const [hubStation, setHubStation] = useStateLib(null);
  const [activePage, setActivePage] = useStateLib("library");
  const [activeNav, setActiveNav] = useStateLib("library");
  const [recentlyAdded, setRecentlyAdded] = useStateLib(null);
  const [toast, setToast] = useStateLib("");

  /* Scope state */
  const [zone, setZone] = useStateLib("SCR");
  const [division, setDivision] = useStateLib("Vijayawada");
  const [sectionScope, setSectionScope] = useStateLib("all");

  /* Search + filter chips */
  const [search, setSearch] = useStateLib("");
  const [filtersOpen, setFiltersOpen] = useStateLib(false);
  const [filters, setFilters] = useStateLib(DEFAULT_FILTERS);

  /* View toggle */
  const [view, setView] = useStateLib("table");

  /* Row selection */
  const [selected, setSelected] = useStateLib({});

  /* Sort */
  const [sort, setSort] = useStateLib({ key: "name", dir: "asc" });

  /* Pagination */
  const [pageSize, setPageSize] = useStateLib(10);
  const [currentPage, setCurrentPage] = useStateLib(1);

  /* Derived filtered + sorted rows */
  const rows = useMemoLib(() => {
    let list = stations;
    const sectionMap = {
      "VJA-GDV": "Vijayawada–Gudivada",
      "GNT-TEL": "Guntur–Tenali",
      "EE-SLO": "Eluru–Samalkot"
    };

    if (sectionScope !== "all") {
      list = list.filter((s) => s.section === (sectionMap[sectionScope] || SECTION_SCOPE_LABELS[sectionScope] || sectionScope));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
      s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      );
    }

    list = list.filter((s) => {
      const docs = { esp: s.esp, sip: s.sip, toc: s.toc ? "approved" : null, lop: s.lop };
      const docStates = Object.values(docs);
      const hasSurvey = s.survey.lidar || s.survey.ortho || s.survey.ts;
      const { count } = getCompleteness(s);

      if (filters.document === "missing_any" && docStates.every(Boolean)) return false;
      if (["esp", "sip", "toc", "lop"].includes(filters.document) && !docs[filters.document]) return false;

      if (filters.status === "missing") {
        if (["esp", "sip", "toc", "lop"].includes(filters.document)) {
          if (docs[filters.document]) return false;
        } else if (docStates.every(Boolean)) {
          return false;
        }
      } else if (filters.status !== "all") {
        if (["esp", "sip", "toc", "lop"].includes(filters.document)) {
          if (docs[filters.document] !== filters.status) return false;
        } else if (!docStates.includes(filters.status)) {
          return false;
        }
      }

      if (filters.survey === "lidar" && !s.survey.lidar) return false;
      if (filters.survey === "ortho" && !s.survey.ortho) return false;
      if (filters.survey === "ts" && !s.survey.ts) return false;
      if (filters.survey === "all_survey" && !(s.survey.lidar && s.survey.ortho && s.survey.ts)) return false;
      if (filters.survey === "missing_survey" && hasSurvey) return false;

      if (filters.completeness === "complete" && count !== 5) return false;
      if (filters.completeness === "incomplete" && (count === 0 || count === 5)) return false;
      if (filters.completeness === "not_started" && count !== 0) return false;

      return true;
    });

    return [...list].sort((a, b) => {
      const av = a[sort.key] ?? "",bv = b[sort.key] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [stations, search, sort, sectionScope, filters]);

  const existingCodes = useMemoLib(() =>
  new Set(stations.map((s) => s.code.toUpperCase())),
  [stations]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, sectionScope, sort, pageSize]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = rows.length ? (safeCurrentPage - 1) * pageSize : 0;
  const pageEnd = Math.min(pageStart + pageSize, rows.length);
  const pagedRows = rows.slice(pageStart, pageEnd);
  const pageNumbers = totalPages <= 5 ?
  Array.from({ length: totalPages }, (_, i) => i + 1) :
  Array.from(new Set([1, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, totalPages])).
  filter((p) => p >= 1 && p <= totalPages).
  sort((a, b) => a - b);

  /* Selection helpers */
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const allChecked = pagedRows.length > 0 && pagedRows.every((s) => selected[s.id]);
  const someChecked = pagedRows.some((s) => selected[s.id]) && !allChecked;

  const toggleAll = () => {
    const v = !allChecked;
    const next = {};
    pagedRows.forEach((s) => next[s.id] = v);
    setSelected(next);
  };
  const toggleRow = (id, e) => {
    if (e) e.stopPropagation();
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const clearSelection = () => setSelected({});

  const addStation = (station) => {
    const nextId = Math.max(0, ...stations.map((s) => s.id)) + 1;
    setStations((current) => [
    {
      id: nextId,
      ...station,
      addedOrder: Date.now(),
      esp: null,
      sip: null,
      lop: null,
      toc: false,
      survey: { lidar: false, ortho: false, ts: false },
      versions: null,
      lastTime: "Just added",
      lastBy: "Admin"
    },
    ...current]
    );
    setZone(station.zone);
    setDivision(station.division);
    setSectionScope("all");
    setSearch("");
    setFilters(DEFAULT_FILTERS);
    setSort({ key: "addedOrder", dir: "desc" });
    setActiveNav("library");
    setRecentlyAdded({ id: nextId, name: station.name, code: station.code });
    setToast(`${station.name} (${station.code}) added to Digital Library`);
    window.setTimeout(() => setToast(""), 3000);
    setAddStationOpen(false);
    setCurrentPage(1);
  };

  const addStationsBulk = (newStations, skippedRows = 0) => {
    const addedAt = Date.now();
    let nextId = Math.max(0, ...stations.map((s) => s.id)) + 1;
    const additions = newStations.map((station, index) => ({
      id: nextId++,
      ...station,
      addedOrder: addedAt + index,
      esp: null,
      sip: null,
      lop: null,
      toc: false,
      survey: { lidar: false, ortho: false, ts: false },
      versions: null,
      lastTime: "Just added",
      lastBy: "Admin"
    }));
    setStations((current) => [...additions, ...current]);
    const first = newStations[0];
    if (first) {
      setZone(first.zone);
      setDivision(first.division);
    }
    setSectionScope("all");
    setSearch("");
    setFilters(DEFAULT_FILTERS);
    setActivePage("library");
    setActiveNav("library");
    setSort({ key: "addedOrder", dir: "desc" });
    if (additions[0]) {
      setRecentlyAdded({ id: additions[0].id, name: additions[0].name, code: additions[0].code });
    }
    setCurrentPage(1);
    setToast(`${newStations.length} stations added successfully. ${skippedRows} rows skipped.`);
    window.setTimeout(() => setToast(""), 3200);
  };

  /* Sort handler */
  const onSort = (key) =>
  setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const setFilterValue = (key, value) =>
  setFilters((current) => ({ ...current, [key]: value }));

  const clearFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const activeFilterChips = [
  search.trim() ? { key: "search", label: `Search: ${search.trim()}` } : null,
  ...Object.entries(filters).
  filter(([, value]) => value !== "all").
  map(([key, value]) => ({ key, label: FILTER_LABELS[key][value] }))
  ].filter(Boolean);

  const removeFilterChip = (key) => {
    if (key === "search") {
      setSearch("");
      return;
    }
    setFilterValue(key, "all");
  };

  /* Scope breadcrumb label */
  const secLabel = SECTION_SCOPE_LABELS;

  const navLabels = {
    approvals: "Approvals",
    help: "Help",
    settings: "Settings"
  };

  const navigateSidebar = (page) => {
    setActiveNav(page);
    setHubStation(null);
    if (page === "home" || page === "library" || page === "workspace") {
      setActivePage(page);
      return;
    }
    setActivePage("library");
    if (navLabels[page]) {
      setToast(`${navLabels[page]} selected`);
      window.setTimeout(() => setToast(""), 1800);
    }
  };
  const handleEditorModeChange = (active) => {
    if (active && !t.sidebarCollapsed) setTweak('sidebarCollapsed', true);
  };
  const showRowActionToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  if (activePage === "home" && window.DashboardPage) {
    const Dashboard = window.DashboardPage;
    return (
      <div className="dl-layout">
        <LibrarySidebar
          collapsed={t.sidebarCollapsed}
          onToggle={() => setTweak('sidebarCollapsed', !t.sidebarCollapsed)}
          active="home"
          onNavigate={navigateSidebar}
        />
        <Dashboard embedded />
      </div>
    );
  }

  if (activePage === "workspace" && window.WorkspacePage) {
    const Workspace = window.WorkspacePage;
    return (
      <div className="dl-layout">
        <LibrarySidebar
          collapsed={t.sidebarCollapsed}
          onToggle={() => setTweak('sidebarCollapsed', !t.sidebarCollapsed)}
          active="workspace"
          onNavigate={navigateSidebar}
        />
        <Workspace onNavigate={navigateSidebar} />
      </div>
    );
  }

  if (activePage === "bulkUpload") {
    return (
      <div className="dl-layout">
        <LibrarySidebar
          collapsed={t.sidebarCollapsed}
          onToggle={() => setTweak('sidebarCollapsed', !t.sidebarCollapsed)}
          active="library"
          onNavigate={navigateSidebar}
        />

        <div className="dl-content">
          <AppTopBar
            crumbs={[
              { label: "Home", onClick: () => navigateSidebar("home") },
              { label: "Digital Library", onClick: () => navigateSidebar("library") },
              "Bulk Upload Stations"
            ]}
            searchPlaceholder="Search stations, documents, approvals..."
          />
          <BulkUploadStationsPage
            existingStations={stations}
            onAdd={addStationsBulk}
            onClose={() => navigateSidebar("library")}
          />
          {toast && <div className="dl-toast" role="status" aria-live="polite"><Icon name="check_circle" size={16} />{toast}</div>}
        </div>
      </div>
    );
  }

  if (hubStation && window.StationHubPage) {
    const Hub = window.StationHubPage;
    return (
      <div className="dl-layout">
        <LibrarySidebar
          collapsed={t.sidebarCollapsed}
          onToggle={() => setTweak('sidebarCollapsed', !t.sidebarCollapsed)}
          active="library"
          onNavigate={navigateSidebar}
        />
        <Hub
          station={hubStation}
          source="Digital Library"
          onBack={() => {
            setActiveNav("library");
            setHubStation(null);
          }}
          onEditorModeChange={handleEditorModeChange}
        />
      </div>
    );
  }

  return (
    <div className="dl-layout">
      <LibrarySidebar
        collapsed={t.sidebarCollapsed}
        onToggle={() => setTweak('sidebarCollapsed', !t.sidebarCollapsed)}
        active={activeNav}
        onNavigate={navigateSidebar}
      />

      <div className="dl-content">
        <AppTopBar
          crumbs={[{ label: "Home", onClick: () => navigateSidebar("home") }, "Digital Library"]}
          searchPlaceholder="Search stations, documents, approvals..."
        />

        {/* ── Region 1: Page Header ── */}
        <div className="dl-page-header">
          <div className="dl-page-heading">
            <div className="dl-page-title">Digital Library</div>
            <div className="dl-page-sub">
              Central repository of all station records, drawings and survey data
            </div>
          </div>
          <div className="dl-page-actions">
            <button className="ds-icon-btn" title="Export Register">
              <Icon name="download" size={16} />
            </button>
            <Btn variant="secondary" leadingIcon="plus" onClick={() => {
              setHubStation(null);
              setActiveNav("library");
              setActivePage("bulkUpload");
            }}>Add Stations in Bulk</Btn>
            <Btn variant="accent" leadingIcon="plus" onClick={() => setAddStationOpen(true)}>Add Station</Btn>
          </div>
        </div>

        {/* ── Region 2: Scope Bar ── */}
        <div className="dl-scope-bar">
          <span className="dl-scope-label">Scope:</span>

          <div className="dl-scope-controls">
            <select className="dl-scope-select" value={zone}
            onChange={(e) => {
              const nextZone = e.target.value;
              const nextDivision = (DIVISION_OPTIONS[nextZone] || [])[0] || "";
              setZone(nextZone);
              setDivision(nextDivision);
              setSectionScope("all");
            }}>
              {ZONE_OPTIONS.map((option) =>
              <option key={option.value} value={option.value}>{option.label}</option>
              )}
            </select>

            <select className="dl-scope-select" value={division}
            onChange={(e) => {
              setDivision(e.target.value);
              setSectionScope("all");
            }}>
              {(DIVISION_OPTIONS[zone] || []).map((divisionName) =>
              <option key={divisionName} value={divisionName}>{divisionName} Division</option>
              )}
            </select>

            <select className="dl-scope-select" value={sectionScope}
            onChange={(e) => setSectionScope(e.target.value)}>
              <option value="all">All Sections</option>
              {(SECTION_OPTIONS[division] || []).map((sectionName) =>
              <option key={sectionName} value={sectionName}>{sectionName}</option>
              )}
            </select>
          </div>

          <div className="dl-vdivider" />
          <span className="dl-scope-count">{rows.length} stations in scope</span>

          {/* Breadcrumb path indicator */}
          <nav className="ds-breadcrumb dl-scope-path" style={{ fontSize: "12px" }}>
            <a style={{ fontSize: "12px" }}>{zone}</a>
            <Icon name="chevron_right" size={11} className="ds-breadcrumb-sep" />
            <a style={{ fontSize: "12px" }}>{division}</a>
            <Icon name="chevron_right" size={11} className="ds-breadcrumb-sep" />
            <span className="ds-breadcrumb-current" style={{ fontSize: "12px" }}>
              {secLabel[sectionScope] || sectionScope}
            </span>
          </nav>
        </div>

        {/* ── Region 3: Search + Filter Bar ── */}
        <div className="dl-filter-bar">
          <div className="dl-filter-row">
            <div className="dl-search-wrap">
              <Icon name="search" size={14} className="dl-search-icon" />
              <input
                placeholder="Search by station name or code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
              
            </div>
            <div className="dl-filter-shell">
              <Btn
                variant="secondary"
                size="sm"
                leadingIcon="filter"
                trailingIcon={filtersOpen ? "chevron_up" : "chevron_down"}
                onClick={() => setFiltersOpen((open) => !open)}>
                Filters{activeFilterChips.length ? ` (${activeFilterChips.length})` : ""}
              </Btn>
              {filtersOpen && (
                <div className="dl-filter-panel">
                  <div className="dl-filter-field">
                    <label>Document Type</label>
                    <select value={filters.document}
                    onChange={(e) => setFilterValue("document", e.target.value)}>
                      {DOCUMENT_FILTERS.map((option) =>
                      <option key={option.value} value={option.value}>{option.label}</option>
                      )}
                    </select>
                  </div>
                  <div className="dl-filter-field">
                    <label>Document Status</label>
                    <select value={filters.status}
                    onChange={(e) => setFilterValue("status", e.target.value)}>
                      {STATUS_FILTERS.map((option) =>
                      <option key={option.value} value={option.value}>{option.label}</option>
                      )}
                    </select>
                  </div>
                  <div className="dl-filter-field">
                    <label>Survey Data</label>
                    <select value={filters.survey}
                    onChange={(e) => setFilterValue("survey", e.target.value)}>
                      {SURVEY_FILTERS.map((option) =>
                      <option key={option.value} value={option.value}>{option.label}</option>
                      )}
                    </select>
                  </div>
                  <div className="dl-filter-field">
                    <label>Completeness</label>
                    <select value={filters.completeness}
                    onChange={(e) => setFilterValue("completeness", e.target.value)}>
                      {COMPLETENESS_FILTERS.map((option) =>
                      <option key={option.value} value={option.value}>{option.label}</option>
                      )}
                    </select>
                  </div>
                  <div className="dl-filter-actions">
                    <Btn variant="ghost" size="sm" onClick={clearFilters}>Clear all</Btn>
                    <Btn variant="primary" size="sm" onClick={() => setFiltersOpen(false)}>Apply</Btn>
                  </div>
                </div>
              )}
            </div>
            <Btn variant="secondary" size="sm" leadingIcon="sort">Sort</Btn>
            <div className="dl-vdivider" />
            <PillTabs
              items={[{ id: "table", label: "Table" }, { id: "cards", label: "Cards" }]}
              active={view}
              onChange={setView} />
            
          </div>

          <div className="dl-chips">
            {activeFilterChips.length ? activeFilterChips.map((chip) => {
              return (
                <button key={chip.key} className="ds-fchip" data-active="true"
                onClick={() => removeFilterChip(chip.key)}>
                  <span>{chip.label}</span>
                  <span className="ds-fchip-x"><Icon name="x" size={10} /></span>
                </button>);

            }) : (
              <span style={{ fontSize: 12, color: "var(--ink-500)" }}>
                Filters available: document type, document status, survey data, completeness
              </span>
            )}
            <button className="ds-fchip"
            style={{ borderStyle: "dashed", color: "var(--ink-500)" }}
            onClick={() => setFiltersOpen(true)}>
              <Icon name="plus" size={12} />&thinsp;Add filter
            </button>
          </div>
        </div>

        {/* ── Region 4: Station Registry Table ── */}
        <div className="dl-table-area" data-density={t.tableDensity}>

          {view === "cards" ?
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}>
              <EmptyState
              kind="track"
              title="Cards view coming soon"
              description="Switch back to Table view to browse the full station registry."
              secondary="Switch to Table" />
            
            </div> :


          <div className="dl-table-container">
              <table className="ds-table" style={{ width: "100%" }}>
                <colgroup>
                  <col style={{ width: 42 }} />
                  <col style={{ width: 150 }} />
                  <col style={{ width: 76 }} />
                  <col style={{ width: 154 }} />
                  <col style={{ width: 116 }} />
                  <col style={{ width: 72 }} />
                  <col style={{ width: 104 }} />
                  <col style={{ width: 142 }} />
                  <col style={{ width: 126 }} />
                </colgroup>

                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <Checkbox checked={allChecked} indeterminate={someChecked}
                    onChange={toggleAll} />
                    </th>
                    <SortTh sortKey="name" sort={sort} onSort={onSort}>Station</SortTh>
                    <SortTh sortKey="code" sort={sort} onSort={onSort}>Code</SortTh>
                    <th>Section</th>
                    <SortTh sortKey="division" sort={sort} onSort={onSort}>Division</SortTh>
                    <SortTh sortKey="zone" sort={sort} onSort={onSort}>Zone</SortTh>
                    <th>Documents</th>
                    <SortTh sortKey="lastTime" sort={sort} onSort={onSort}>Last Activity</SortTh>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 ?
                <tr>
                      <td colSpan={9} style={{ padding: 0, border: "none" }}>
                        <div style={{ padding: "40px 28px" }}>
                          <EmptyState
                        kind="search"
                        title="No stations match this scope"
                        description="Adjust your search or filter criteria to find stations."
                        secondary="Clear filters" />
                      
                        </div>
                      </td>
                    </tr> :
                pagedRows.map((s) => {
                  const isSelected = !!selected[s.id];
                  const stationDocuments = getStationDocuments(s);
                  return (
                    <tr key={s.id} data-selected={isSelected} data-new={recentlyAdded?.id === s.id ? "true" : undefined}
                    onClick={() => {
                      setActiveNav("library");
                      setHubStation(s);
                    }}>

                        {/* Checkbox */}
                        <td className="col-checkbox"
                      onClick={(e) => toggleRow(s.id, e)}>
                          <Checkbox checked={isSelected}
                        onChange={() => toggleRow(s.id)} />
                        </td>

                        {/* Station name */}
                        <td>
                          <div className="dl-station-cell" title={s.name}>
                            {s.name}
                          </div>
                        </td>

                        {/* Code */}
                        <td>
                          <span className="dl-code-pill">{s.code}</span>
                        </td>

                        {/* Section */}
                        <td>
                          <div className="dl-section-cell" title={s.section}>
                          {s.section}
                          </div>
                        </td>

                        {/* Division */}
                        <td>
                          <div className="dl-division-cell" title={s.division}>
                          {s.division}
                          </div>
                        </td>

                        {/* Zone */}
                        <td style={{ fontSize: 12, color: "var(--ink-700)", fontWeight: 700 }}>
                          {s.zone}
                        </td>

                        {/* Documents */}
                        <td className="dl-doc-table-cell">
                          <DocumentDetailsPopover
                            station={s}
                            documents={stationDocuments}
                            onView={() => {
                              setActiveNav("library");
                              setHubStation(s);
                            }}
                          />
                        </td>

                        {/* Last activity */}
                        <td>
                          <div className="dl-activity-time">{s.lastTime}</div>
                          <div className="dl-activity-by">by {s.lastBy}</div>
                        </td>

                        {/* Row actions */}
                        <td className="dl-action-table-cell" onClick={(e) => e.stopPropagation()}>
                          <StationRowActions
                            station={s}
                            onView={() => {
                              setActiveNav("library");
                              setHubStation(s);
                            }}
                            onAction={showRowActionToast}
                          />
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>

              {/* Table footer */}
              <div className="ds-table-foot">
                <div className="dl-table-foot-left">
                  <span>
                    Showing {rows.length ? pageStart + 1 : 0}-{pageEnd} of {rows.length} visible stations
                    {activeFilterChips.length > 0 &&
                    <span style={{ color: "var(--ink-500)" }}> — {activeFilterChips.length} filter{activeFilterChips.length !== 1 ? "s" : ""} active</span>}
                  </span>
                  <label className="dl-page-size">
                    <span>Rows per page</span>
                    <select value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}>
                      {[5, 10, 25, 50].map((size) =>
                      <option key={size} value={size}>{size}</option>
                      )}
                    </select>
                  </label>
                </div>
                <div className="ds-table-pager">
                  <button className="ds-page-btn" disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                    <Icon name="chevron_left" size={14} />
                  </button>
                  {pageNumbers.map((page, i) => (
                    <React.Fragment key={page}>
                      {i > 0 && page - pageNumbers[i - 1] > 1 &&
                      <span className="dl-page-ellipsis">…</span>}
                      <button className="ds-page-btn"
                      data-current={page === safeCurrentPage ? "true" : undefined}
                      onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                  <button className="ds-page-btn" disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                    <Icon name="chevron_right" size={14} />
                  </button>
                </div>
              </div>
            </div>

          }
        </div>

        {/* ── Region 6: Bulk Action Bar (visible when ≥1 row selected) ── */}
        {selectedCount > 0 &&
        <div className="dl-bulk-bar">
            <Icon name="check_circle" size={15}
          style={{ color: "rgba(255,255,255,0.45)", flexShrink: 0 }} />
            <span className="dl-bulk-label">
              {selectedCount} station{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <div className="dl-bulk-sep" />
            <button className="dl-bulk-action">
              <Icon name="download" size={13} />Export selected
            </button>
            <button className="dl-bulk-action">
              <Icon name="file" size={13} />Download documents
            </button>
            <button className="dl-bulk-action">
              <Icon name="pin" size={13} />Add to…
            </button>
            <div style={{ flex: 1 }} />
            <button className="dl-bulk-clear" onClick={clearSelection}>
              Clear selection
            </button>
          </div>
        }

      </div>

      {addStationOpen &&
      <AddStationModal
        initialZone={zone}
        initialDivision={division}
        initialSectionScope={sectionScope}
        existingCodes={existingCodes}
        onAdd={addStation}
        onClose={() => setAddStationOpen(false)}
      />}

      {toast && <div className="dl-toast" role="status" aria-live="polite"><Icon name="check_circle" size={16} />{toast}</div>}

      {/* ── Tweaks panel ── */}
      <TweaksPanel>
        <TweakSection label="Sidebar" />
        <TweakToggle
          label="Collapse sidebar"
          value={t.sidebarCollapsed}
          onChange={(v) => setTweak('sidebarCollapsed', v)}
        />
        <TweakSection label="Table" />
        <TweakRadio
          label="Density"
          value={t.tableDensity}
          options={['compact', 'regular']}
          onChange={(v) => setTweak('tableDensity', v)}
        />
      </TweaksPanel>

    </div>);

};

/* ─────────────────────────────────────────────────────────────────────
   INJECT CSS + MOUNT
───────────────────────────────────────────────────────────────────── */
const dlStyleEl = document.createElement("style");
dlStyleEl.textContent = window.NAV_CSS + window.DATA_CSS + window.FORM_CSS + libCSS;
document.head.appendChild(dlStyleEl);

ReactDOM.createRoot(document.getElementById("root")).render(<DigitalLibraryApp />);
