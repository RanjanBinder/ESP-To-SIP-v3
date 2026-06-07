(() => {
  const { useState, useMemo, useEffect, useRef } = React;
  const wsCSS = `
/* \u2500\u2500 Workspace layout \u2500\u2500 */
.ws-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
  background: var(--canvas);
}

/* \u2500\u2500 Prominent page-level filter bar \u2500\u2500 */
.ws-filter-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
  gap: 14px;
  padding: 16px 28px 18px;
  background: var(--paper);
  border-bottom: var(--hairline);
  flex-shrink: 0;
  align-items: end;
}
.ws-filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.ws-filter-field label {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ws-filter-select {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 14px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-900);
  outline: none;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: 120ms;
  box-shadow: var(--shadow-xs);
}
.ws-filter-select:hover { border-color: var(--ink-300); background-color: var(--ink-50); }
.ws-filter-select:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.ws-filter-select[data-active="true"] {
  border-color: var(--accent);
  background-color: var(--accent-soft);
  color: var(--accent-text);
}
.ws-filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 2px;
}
@media (max-width: 1000px) {
  .ws-filter-bar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ws-filter-actions { grid-column: 1 / -1; justify-content: flex-end; }
}

/* \u2500\u2500 Chips bar \u2500\u2500 */
.ws-chips-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 28px;
  background: var(--paper);
  border-bottom: var(--hairline);
  flex-shrink: 0;
}
.ws-chips-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
  white-space: nowrap;
}
.ws-chips-row {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
}
.ws-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: var(--r-full);
  border: var(--hairline);
  background: var(--paper);
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-700);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background 120ms, border-color 120ms, color 120ms;
  white-space: nowrap;
}
.ws-chip:hover { border-color: var(--ink-400); background: var(--ink-50); }
.ws-chip[data-active="true"] {
  background: var(--accent);
  color: var(--paper);
  border-color: var(--accent);
  box-shadow: 0 6px 12px -8px rgba(99,91,255,0.75);
}
.ws-chip-x { display: inline-grid; place-items: center; }

/* \u2500\u2500 Search row \u2500\u2500 */
.ws-search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 28px;
  background: var(--paper);
  border-bottom: var(--hairline);
  flex-shrink: 0;
}
.ws-search-wrap {
  position: relative;
  flex: 1;
  max-width: 480px;
}
.ws-search-input {
  width: 100%;
  height: 34px;
  padding: 0 32px 0 34px;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--ink-50);
  font-size: 13px;
  font-family: var(--font-sans);
  color: var(--ink-900);
  outline: none;
  transition: 120ms;
}
.ws-search-input::placeholder { color: var(--ink-400); }
.ws-search-input:hover { background: var(--paper); border-color: var(--ink-300); }
.ws-search-input:focus { background: var(--paper); border-color: var(--accent); box-shadow: var(--shadow-focus); }
.ws-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ink-500);
  pointer-events: none;
}
.ws-search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--ink-400);
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: 50%;
}
.ws-search-clear:hover { background: var(--ink-100); color: var(--ink-700); }
.ws-result-count {
  font-size: 12px;
  color: var(--ink-500);
  white-space: nowrap;
  flex-shrink: 0;
}

/* \u2500\u2500 Table area \u2500\u2500 */
.ws-table-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 24px;
}
.ws-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.ws-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 9px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-500);
  background: var(--ink-50);
  border-bottom: var(--hairline);
  white-space: nowrap;
}
.ws-table tbody td {
  padding: 10px 14px;
  border-bottom: var(--hairline);
  vertical-align: middle;
  color: var(--ink-800);
}
.ws-table tbody tr:hover td { background: var(--ink-50); }
.ws-table tbody tr:last-child td { border-bottom: none; }

/* \u2500\u2500 Station cell \u2500\u2500 */
.ws-station-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-900);
  line-height: 1.3;
}

/* \u2500\u2500 Hover tooltip wrapper (any cell value) \u2500\u2500 */
.ws-tip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: help;
  border-bottom: 1px dotted var(--ink-300);
}
.ws-tip > .ws-tip-i {
  color: var(--ink-300);
  display: inline-grid;
  place-items: center;
}
.ws-tip:hover > .ws-tip-i { color: var(--ink-500); }
.ws-tip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  z-index: 1000;
  min-width: 180px;
  max-width: 320px;
  padding: 8px 10px;
  border-radius: var(--r-md);
  background: var(--ink-900);
  color: var(--paper);
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.01em;
  white-space: pre-line;
  text-align: left;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  pointer-events: none;
  transform: translateY(2px);
  transition: opacity 120ms, transform 120ms;
}
.ws-tip::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 2px);
  left: 14px;
  z-index: 1000;
  border: 6px solid transparent;
  border-top-color: var(--ink-900);
  opacity: 0;
  transition: opacity 120ms;
}
.ws-tip:hover::after,
.ws-tip:hover::before { opacity: 1; transform: translateY(0); }

/* \u2500\u2500 Document cell \u2500\u2500 */
.ws-doc-cell {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.ws-doc-file {
  font-size: 12.5px;
  font-family: var(--font-mono);
  color: var(--ink-900);
  font-weight: 700;
  letter-spacing: 0.01em;
}
.ws-doc-updated {
  font-size: 11px;
  color: var(--ink-500);
  font-variant-numeric: tabular-nums;
}

/* \u2500\u2500 Type badge (custom palette per document family) \u2500\u2500 */
.ws-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 22px;
  padding: 0 9px;
  border-radius: var(--r-sm);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1px solid transparent;
  font-family: var(--font-sans);
}
/* ESP \u2014 purple */
.ws-type[data-type="ESP"] {
  background: oklch(0.94 0.06 295);
  color: oklch(0.38 0.18 295);
  border-color: oklch(0.85 0.10 295);
}
/* SIP \u2014 teal */
.ws-type[data-type="SIP"] {
  background: oklch(0.94 0.05 195);
  color: oklch(0.36 0.10 200);
  border-color: oklch(0.85 0.07 200);
}
/* LOP \u2014 blue */
.ws-type[data-type="LOP"] {
  background: oklch(0.94 0.05 240);
  color: oklch(0.38 0.13 240);
  border-color: oklch(0.85 0.08 240);
}
/* TOC \u2014 coral */
.ws-type[data-type="TOC"] {
  background: oklch(0.94 0.06 30);
  color: oklch(0.45 0.15 30);
  border-color: oklch(0.85 0.10 30);
}
/* Other \u2014 neutral */
.ws-type[data-type="Other"] {
  background: var(--ink-100);
  color: var(--ink-700);
  border-color: var(--ink-200);
}

/* \u2500\u2500 Status pill (lifecycle) \u2500\u2500 */
.ws-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 22px;
  padding: 0 9px;
  border-radius: var(--r-full);
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid transparent;
}
.ws-status::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.ws-status[data-status="Draft"] {
  background: var(--ink-100);
  color: var(--ink-600);
  border-color: var(--ink-200);
}
.ws-status[data-status="Active"] {
  background: var(--success-soft);
  color: var(--success-text);
  border-color: oklch(0.9 0.06 155);
}
.ws-status[data-status="Frozen"] {
  background: var(--info-soft);
  color: var(--info-text);
  border-color: oklch(0.9 0.06 240);
}

/* \u2500\u2500 Stage cell \u2500\u2500 */
.ws-stage-col {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

/* \u2500\u2500 Assignee cell \u2500\u2500 */
.ws-assignee-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-900);
  line-height: 1.3;
}
.ws-assignee-role {
  font-size: 11px;
  color: var(--ink-500);
  margin-top: 1px;
}
.ws-unassigned {
  font-size: 12px;
  color: var(--ink-400);
  font-style: italic;
}

/* \u2500\u2500 Issues cell \u2500\u2500 */
.ws-issues-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: var(--r-full);
  background: var(--danger-soft);
  color: var(--danger-text);
  font-size: 11.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ws-no-issues {
  color: var(--ink-400);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

/* \u2500\u2500 "(you)" tag for current user rows \u2500\u2500 */
.ws-table tbody tr[data-mine="true"] td { background: oklch(0.97 0.02 240); }
.ws-table tbody tr[data-mine="true"]:hover td { background: oklch(0.95 0.03 240); }
.ws-you-tag {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  padding: 0 6px;
  height: 17px;
  border-radius: var(--r-sm);
  background: var(--info-soft);
  color: var(--info-text);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  border: 1px solid oklch(0.9 0.06 240);
}

/* \u2500\u2500 Time cell \u2500\u2500 */
.ws-time { font-size: 12px; color: var(--ink-700); font-variant-numeric: tabular-nums; }
.ws-time[data-overdue="true"] { color: var(--danger-text); font-weight: 700; }

/* \u2500\u2500 Row actions \u2500\u2500 */
.ws-row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  position: relative;
}
.ws-action-primary {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--r-md);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--ink-200));
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-sans);
  white-space: nowrap;
  transition: 120ms;
}
.ws-action-primary:hover {
  background: color-mix(in srgb, var(--accent-soft) 72%, #fff);
  border-color: var(--accent);
}
.ws-action-more {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-md);
  border: var(--hairline);
  background: var(--paper);
  color: var(--ink-500);
  cursor: pointer;
  transition: 120ms;
}
.ws-action-more:hover { background: var(--ink-50); border-color: var(--ink-300); color: var(--ink-800); }
.ws-action-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 100;
  min-width: 168px;
  background: var(--paper);
  border: var(--hairline);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  display: flex;
  flex-direction: column;
}
.ws-action-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: var(--ink-700);
  font-size: 12.5px;
  font-family: var(--font-sans);
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--r-sm);
  text-align: left;
  transition: 120ms;
}
.ws-action-menu-item:hover { background: var(--ink-50); color: var(--ink-900); }
.ws-action-menu-sep {
  height: 1px;
  background: var(--ink-100);
  margin: 3px 0;
}

/* \u2500\u2500 Assignment modal \u2500\u2500 */
.ws-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.36);
}
.ws-modal {
  width: min(600px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  overflow: auto;
  box-sizing: border-box;
  background: var(--paper);
  border: var(--hairline);
  border-radius: var(--r-lg);
  box-shadow: 0 18px 54px rgba(0,0,0,0.22);
}
.ws-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: var(--hairline);
}
.ws-modal-title { font-size: 15px; font-weight: 700; color: var(--ink-900); }
.ws-modal-sub { margin-top: 3px; font-size: 12px; color: var(--ink-500); }
.ws-modal-close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--paper);
  color: var(--ink-500);
  cursor: pointer;
}
.ws-modal-close:hover { color: var(--ink-900); background: var(--ink-50); }
.ws-modal-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--ink-50);
  border-bottom: var(--hairline);
  font-size: 12.5px;
  flex-wrap: wrap;
}
.ws-modal-summary-station {
  font-weight: 600;
  color: var(--ink-900);
}
.ws-modal-dot { color: var(--ink-300); }
.ws-modal-body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 18px 16px;
}
.ws-modal-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.ws-modal-field[data-span="full"] { grid-column: 1 / -1; }
.ws-modal-field label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-700);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ws-modal-field input,
.ws-modal-field select,
.ws-modal-field textarea {
  width: 100%;
  box-sizing: border-box;
  border: var(--hairline);
  border-radius: var(--r-md);
  background: var(--ink-50);
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink-900);
  outline: none;
  transition: 120ms;
}
.ws-modal-field input,
.ws-modal-field select { height: 34px; padding: 0 10px; }
.ws-modal-field select {
  padding-right: 28px;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 13px;
}
.ws-modal-field textarea {
  min-height: 72px;
  padding: 8px 10px;
  resize: vertical;
  line-height: 1.5;
}
.ws-modal-field input:focus,
.ws-modal-field select:focus,
.ws-modal-field textarea:focus {
  border-color: var(--accent);
  background: var(--paper);
  box-shadow: var(--shadow-focus);
}
.ws-modal-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: var(--hairline);
}

/* \u2500\u2500 Sort header \u2500\u2500 */
.ws-sort-th {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.ws-sort-th:hover { color: var(--ink-800); }
.ws-sort-inner { display: inline-flex; align-items: center; gap: 4px; }

/* \u2500\u2500 Empty state override \u2500\u2500 */
.ws-empty { padding: 64px 28px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
.ws-empty-icon { width: 48px; height: 48px; border-radius: var(--r-lg); background: var(--ink-100); display: grid; place-items: center; color: var(--ink-400); margin-bottom: 8px; }
.ws-empty-title { font-size: 15px; font-weight: 700; color: var(--ink-900); }
.ws-empty-sub { font-size: 13px; color: var(--ink-500); max-width: 340px; line-height: 1.45; }
.ws-empty-actions { display: flex; gap: 8px; margin-top: 4px; }
`;
  const WS_CURRENT_USER = {
    name: "Priya Nair",
    designation: "SSE/Design",
    department: "Engineering",
    role: "Editor",
    initials: "PN"
  };
  const WS_ZONE_DIVISIONS = {
    SCR: ["NED", "HYB"],
    CR: ["PUNE"]
  };
  const WS_DIVISION_SECTIONS = {
    NED: ["NED-AWB", "AWB-J"],
    HYB: ["HYB-SC", "SC-KZJ"],
    PUNE: ["PUNE-LNL", "PUNE-DD"]
  };
  const WS_ASSIGNEES = [
    { id: 1, name: "Rajesh Kumar", designation: "SSE/P.Way", department: "Engineering" },
    { id: 2, name: "Anil Sharma", designation: "JE/Drawing", department: "Engineering" },
    { id: 3, name: "Priya Nair", designation: "SSE/Design", department: "Engineering" },
    { id: 4, name: "Sandeep Reddy", designation: "SSE/Signal", department: "S&T" },
    { id: 5, name: "Neha Verma", designation: "JE/Signal", department: "S&T" },
    { id: 6, name: "Amit Choudhary", designation: "SSE/OHE", department: "OHE" },
    { id: 7, name: "Kavita Rao", designation: "JE/OHE", department: "OHE" },
    { id: 8, name: "Manoj Singh", designation: "AEN/Yard", department: "Engineering" }
  ];
  const INITIAL_WORK_ITEMS = [
    {
      id: "WI-001",
      priority: "Critical",
      workItemTitle: "Assign generated LOP draft",
      zone: "SCR",
      division: "NED",
      section: "NED-AWB",
      stationCode: "AWB",
      stationName: "Aurangabad",
      documentType: "LOP",
      fileName: "AWB-LOP-V0-R0-A0",
      stage: "Unassigned",
      assignedTo: null,
      dueDate: null,
      openIssues: 0,
      validationStatus: "Pending",
      lastUpdated: "2026-05-28 13:10"
    },
    {
      id: "WI-002",
      priority: "High",
      workItemTitle: "Resolve validation issues",
      zone: "SCR",
      division: "NED",
      section: "NED-AWB",
      stationCode: "AWB",
      stationName: "Aurangabad",
      documentType: "ESP",
      fileName: "AWB-V0-R0-A0",
      stage: "Validation Failed",
      assignedTo: { name: "Rajesh Kumar", designation: "SSE/P.Way", department: "Engineering" },
      dueDate: "2026-05-30",
      openIssues: 5,
      validationStatus: "Issues Found",
      lastUpdated: "2026-05-28 16:20"
    },
    {
      id: "WI-003",
      priority: "Medium",
      workItemTitle: "Continue digital ESP editing",
      zone: "SCR",
      division: "NED",
      section: "NED-AWB",
      stationCode: "AWB",
      stationName: "Aurangabad",
      documentType: "ESP",
      fileName: "AWB-V1-R0-A0",
      stage: "In Editing",
      assignedTo: { name: "Priya Nair", designation: "SSE/Design", department: "Engineering" },
      dueDate: "2026-05-31",
      openIssues: 2,
      validationStatus: "Issues Found",
      lastUpdated: "2026-05-28 14:05"
    },
    {
      id: "WI-004",
      priority: "Medium",
      workItemTitle: "Start SIP draft work",
      zone: "SCR",
      division: "NED",
      section: "NED-AWB",
      stationCode: "AWB",
      stationName: "Aurangabad",
      documentType: "SIP",
      fileName: "AWB-SIP-V0-R0-A0",
      stage: "Assigned",
      assignedTo: { name: "Sandeep Reddy", designation: "SSE/Signal", department: "S&T" },
      dueDate: "2026-06-01",
      openIssues: 0,
      validationStatus: "Pending",
      lastUpdated: "2026-05-28 15:30"
    },
    {
      id: "WI-005",
      priority: "High",
      workItemTitle: "Address returned comments",
      zone: "SCR",
      division: "HYB",
      section: "HYB-SC",
      stationCode: "SC",
      stationName: "Secunderabad",
      documentType: "ESP",
      fileName: "SC-V1-R1-A0",
      stage: "Returned with Comments",
      assignedTo: { name: "Manoj Singh", designation: "AEN/Yard", department: "Engineering" },
      dueDate: "2026-05-29",
      openIssues: 3,
      validationStatus: "Issues Found",
      lastUpdated: "2026-05-27 18:40"
    },
    {
      id: "WI-006",
      priority: "Low",
      workItemTitle: "Review generated document",
      zone: "SCR",
      division: "HYB",
      section: "HYB-SC",
      stationCode: "HYB",
      stationName: "Hyderabad",
      documentType: "ESP",
      fileName: "HYB-V0-R0-A0",
      stage: "Generated",
      assignedTo: null,
      dueDate: null,
      openIssues: 0,
      validationStatus: "Pending",
      lastUpdated: "2026-05-28 12:45"
    },
    {
      id: "WI-007",
      priority: "High",
      workItemTitle: "Resolve TOC validation conflicts",
      zone: "CR",
      division: "PUNE",
      section: "PUNE-LNL",
      stationCode: "PUNE",
      stationName: "Pune",
      documentType: "TOC",
      fileName: "PUNE-TOC-V0-R0-A0",
      stage: "Validation Failed",
      assignedTo: { name: "Neha Verma", designation: "JE/Signal", department: "S&T" },
      dueDate: "2026-05-30",
      openIssues: 4,
      validationStatus: "Issues Found",
      lastUpdated: "2026-05-28 11:25"
    },
    {
      id: "WI-008",
      priority: "Medium",
      workItemTitle: "Submit ESP for review",
      zone: "SCR",
      division: "NED",
      section: "AWB-J",
      stationCode: "JLN",
      stationName: "Jalna",
      documentType: "ESP",
      fileName: "JLN-V0-R0-A0",
      stage: "Ready for Review",
      assignedTo: { name: "Anil Sharma", designation: "JE/Drawing", department: "Engineering" },
      dueDate: "2026-05-30",
      openIssues: 0,
      validationStatus: "Passed",
      lastUpdated: "2026-05-28 17:10"
    }
  ];
  const STAGE_TONES = {
    "Generated": "neutral",
    // gray
    "Unassigned": "neutral",
    // gray
    "Assigned": "warning",
    // amber
    "Draft": "neutral",
    // gray
    "In Editing": "accent",
    // teal
    "Validation Pending": "warning",
    // amber
    "Validation Failed": "danger",
    // red
    "Ready for Review": "info",
    // blue
    "Submitted for Review": "info",
    // blue
    "Returned with Comments": "warning",
    // amber
    "Approved": "success"
    // green
  };
  const STATUS_BY_STAGE = {
    "Generated": "Draft",
    "Unassigned": "Draft",
    "Assigned": "Draft",
    "Draft": "Active",
    "In Editing": "Active",
    "Validation Pending": "Active",
    "Validation Failed": "Active",
    "Ready for Review": "Active",
    "Submitted for Review": "Active",
    "Returned with Comments": "Active",
    "Approved": "Frozen"
  };
  const STATUS_TONES = {
    Draft: "neutral",
    // gray — pre-work
    Active: "success",
    // green — work in progress
    Frozen: "info"
    // blue — post-EDAS, locked
  };
  const PRIORITY_TONES = {
    Critical: "danger",
    High: "warning",
    Medium: "info",
    Low: "neutral"
  };
  const STAGE_PRIMARY = {
    "Generated": "Assign",
    "Unassigned": "Assign",
    "Assigned": "Start",
    "Draft": "Continue",
    "In Editing": "Continue",
    "Validation Pending": "Run Validation",
    "Validation Failed": "Open Issues",
    "Ready for Review": "Submit for Review",
    "Submitted for Review": "Track Review",
    "Returned with Comments": "View Comments",
    "Approved": "Export"
  };
  const STAGE_ACTIONS = {
    "Generated": ["View", "Clone", "Assign"],
    "Unassigned": ["View", "Clone", "Assign"],
    "Assigned": ["View", "Clone", "Start", "Reassign"],
    "Draft": ["View", "Clone", "Continue", "Assign"],
    "In Editing": ["View", "Clone", "Continue", "Reassign"],
    "Validation Pending": ["View", "Run Validation", "Reassign"],
    "Validation Failed": ["View", "Open Issues", "Clone", "Reassign"],
    "Ready for Review": ["View", "Clone", "Submit for Review", "Reassign"],
    "Submitted for Review": ["View", "Track Review"],
    "Returned with Comments": ["View", "View Comments", "Continue", "Reassign"],
    "Approved": ["View", "Clone", "Export"]
  };
  const QUICK_FILTERS = [
    { id: "assigned_me", label: "Assigned to Me" },
    { id: "unassigned", label: "Unassigned" },
    { id: "in_editing", label: "In Editing" },
    { id: "validation_issues", label: "Validation Issues" },
    { id: "ready_review", label: "Ready for Review" },
    { id: "returned", label: "Returned" },
    { id: "recently_updated", label: "Recently Updated" }
  ];
  const StageBadge = ({ stage }) => /* @__PURE__ */ React.createElement(Chip, { tone: STAGE_TONES[stage] || "neutral" }, stage);
  const PriorityBadge = ({ priority }) => /* @__PURE__ */ React.createElement(Chip, { tone: PRIORITY_TONES[priority] || "neutral", size: "sm", dot: true }, priority);
  const TypeBadge = ({ docType }) => /* @__PURE__ */ React.createElement("span", { className: "ws-type", "data-type": docType }, docType);
  const StatusBadge = ({ status }) => /* @__PURE__ */ React.createElement("span", { className: "ws-status", "data-status": status }, status);
  const RowActions = ({ item, onAssign, onToast }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
      if (!menuOpen) return;
      const handler = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);
    const primary = STAGE_PRIMARY[item.stage] || "View";
    const allActions = STAGE_ACTIONS[item.stage] || ["View"];
    const secondary = allActions.filter((a) => a !== primary);
    const handleAction = (action) => {
      setMenuOpen(false);
      if (action === "Assign" || action === "Reassign") {
        onAssign(item);
      } else {
        onToast(`${action}: ${item.fileName}`);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "ws-row-actions", ref: menuRef }, /* @__PURE__ */ React.createElement("button", { className: "ws-action-primary", onClick: () => handleAction(primary) }, primary), secondary.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "ws-action-more", title: "More actions", onClick: () => setMenuOpen((o) => !o) }, /* @__PURE__ */ React.createElement(Icon, { name: "more", size: 14 })), menuOpen && /* @__PURE__ */ React.createElement("div", { className: "ws-action-menu" }, secondary.map((action, idx) => /* @__PURE__ */ React.createElement("button", { key: action, className: "ws-action-menu-item", onClick: () => handleAction(action) }, action)))));
  };
  const AssignModal = ({ item, onClose, onSave }) => {
    const [assigneeName, setAssigneeName] = useState(item.assignedTo?.name || "");
    const [dueDate, setDueDate] = useState(item.dueDate || "");
    const [priority, setPriority] = useState(item.priority || "Medium");
    const [notes, setNotes] = useState("");
    useEffect(() => {
      const handler = (e) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [onClose]);
    const handleSave = () => {
      const selectedAssignee = WS_ASSIGNEES.find((a) => a.name === assigneeName);
      const newStage = item.stage === "Unassigned" || item.stage === "Generated" ? "Assigned" : item.stage;
      onSave({
        ...item,
        assignedTo: selectedAssignee || null,
        dueDate: dueDate || null,
        priority,
        stage: newStage,
        lastUpdated: "2026-05-29 " + (/* @__PURE__ */ new Date()).toTimeString().slice(0, 5)
      });
    };
    return ReactDOM.createPortal(
      /* @__PURE__ */ React.createElement("div", { className: "ws-modal-overlay", onClick: onClose }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "ws-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "ws-modal-title",
          onClick: (e) => e.stopPropagation()
        },
        /* @__PURE__ */ React.createElement("div", { className: "ws-modal-head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "ws-modal-title", id: "ws-modal-title" }, "Assign Work Item"), /* @__PURE__ */ React.createElement("div", { className: "ws-modal-sub" }, item.workItemTitle)), /* @__PURE__ */ React.createElement("button", { className: "ws-modal-close", "aria-label": "Close", onClick: onClose }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 15 }))),
        /* @__PURE__ */ React.createElement("div", { className: "ws-modal-summary" }, /* @__PURE__ */ React.createElement("span", { className: "ws-modal-summary-station" }, item.stationName, " (", item.stationCode, ")"), /* @__PURE__ */ React.createElement("span", { className: "ws-modal-dot" }, "\xB7"), /* @__PURE__ */ React.createElement(TypeBadge, { docType: item.documentType }), /* @__PURE__ */ React.createElement("span", { className: "ws-modal-dot" }, "\xB7"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-700)", fontWeight: 700 } }, item.fileName), /* @__PURE__ */ React.createElement("span", { className: "ws-modal-dot" }, "\xB7"), /* @__PURE__ */ React.createElement(StageBadge, { stage: item.stage })),
        /* @__PURE__ */ React.createElement("div", { className: "ws-modal-body" }, /* @__PURE__ */ React.createElement("div", { className: "ws-modal-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", null, "Assign To"), /* @__PURE__ */ React.createElement("select", { value: assigneeName, onChange: (e) => setAssigneeName(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 Select assignee \u2014"), WS_ASSIGNEES.map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.name }, a.name, " \xB7 ", a.designation, " \xB7 ", a.department)))), /* @__PURE__ */ React.createElement("div", { className: "ws-modal-field" }, /* @__PURE__ */ React.createElement("label", null, "Due Date"), /* @__PURE__ */ React.createElement("input", { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "ws-modal-field" }, /* @__PURE__ */ React.createElement("label", null, "Priority"), /* @__PURE__ */ React.createElement("select", { value: priority, onChange: (e) => setPriority(e.target.value) }, ["Low", "Medium", "High", "Critical"].map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }, p)))), /* @__PURE__ */ React.createElement("div", { className: "ws-modal-field", "data-span": "full" }, /* @__PURE__ */ React.createElement("label", null, "Notes / Instructions ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, textTransform: "none", letterSpacing: 0 } }, "(optional)")), /* @__PURE__ */ React.createElement(
          "textarea",
          {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Add instructions or notes for the assignee..."
          }
        ))),
        /* @__PURE__ */ React.createElement("div", { className: "ws-modal-foot" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancel"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: handleSave, disabled: !assigneeName }, item.assignedTo ? "Reassign" : "Assign"))
      )),
      document.body
    );
  };
  const SortTh = ({ children, sortKey, sort, onSort, style }) => /* @__PURE__ */ React.createElement("th", { className: "ws-sort-th", style, onClick: () => onSort(sortKey) }, /* @__PURE__ */ React.createElement("span", { className: "ws-sort-inner" }, children, sort.key === sortKey && /* @__PURE__ */ React.createElement(Icon, { name: sort.dir === "asc" ? "chevron_up" : "chevron_down", size: 11 })));
  const WsEmptyState = ({ noItems, onGoToLibrary, onResetFilters }) => /* @__PURE__ */ React.createElement("div", { className: "ws-empty" }, /* @__PURE__ */ React.createElement("div", { className: "ws-empty-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: noItems ? "layers" : "search", size: 22 })), /* @__PURE__ */ React.createElement("div", { className: "ws-empty-title" }, noItems ? "No workspace items yet." : "No items match your filters."), /* @__PURE__ */ React.createElement("div", { className: "ws-empty-sub" }, noItems ? "Generated digital documents will appear here when work is created." : "Try adjusting your filters or search query to find work items."), /* @__PURE__ */ React.createElement("div", { className: "ws-empty-actions" }, noItems ? /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onGoToLibrary }, "Go to Digital Library") : /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onResetFilters }, "Reset Filters")));
  const WorkspacePage = ({ onNavigate }) => {
    const assignedZones = ["SCR", "CR"];
    const [zone, setZone] = useState("all");
    const [division, setDivision] = useState("all");
    const [section, setSection] = useState("all");
    const [docType, setDocType] = useState("all");
    const [activeChips, setActiveChips] = useState({});
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "lastUpdated", dir: "desc" });
    const [items, setItems] = useState(INITIAL_WORK_ITEMS);
    const [assignItem, setAssignItem] = useState(null);
    const [toast, setToast] = useState("");
    const availableDivisions = useMemo(() => {
      if (zone === "all") return assignedZones.flatMap((z) => WS_ZONE_DIVISIONS[z] || []);
      return WS_ZONE_DIVISIONS[zone] || [];
    }, [zone]);
    const availableSections = useMemo(() => {
      if (division === "all") return availableDivisions.flatMap((d) => WS_DIVISION_SECTIONS[d] || []);
      return WS_DIVISION_SECTIONS[division] || [];
    }, [division, availableDivisions]);
    const resetFilters = () => {
      setZone("all");
      setDivision("all");
      setSection("all");
      setDocType("all");
      setActiveChips({});
      setSearch("");
    };
    const toggleChip = (id) => setActiveChips((prev) => ({ ...prev, [id]: !prev[id] }));
    const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const filteredItems = useMemo(() => {
      let list = [...items];
      if (zone !== "all") list = list.filter((i) => i.zone === zone);
      if (division !== "all") list = list.filter((i) => i.division === division);
      if (section !== "all") list = list.filter((i) => i.section === section);
      if (docType !== "all") list = list.filter((i) => i.documentType === docType);
      if (activeChips.assigned_me) list = list.filter((i) => i.assignedTo?.name === WS_CURRENT_USER.name);
      if (activeChips.unassigned) list = list.filter((i) => !i.assignedTo);
      if (activeChips.in_editing) list = list.filter((i) => i.stage === "In Editing");
      if (activeChips.validation_issues) list = list.filter((i) => i.validationStatus === "Issues Found" || i.stage === "Validation Failed");
      if (activeChips.ready_review) list = list.filter((i) => i.stage === "Ready for Review");
      if (activeChips.returned) list = list.filter((i) => i.stage === "Returned with Comments");
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(
          (i) => i.workItemTitle.toLowerCase().includes(q) || i.stationName.toLowerCase().includes(q) || i.stationCode.toLowerCase().includes(q) || i.fileName.toLowerCase().includes(q) || i.documentType.toLowerCase().includes(q) || (i.assignedTo?.name || "").toLowerCase().includes(q) || (i.assignedTo?.designation || "").toLowerCase().includes(q)
        );
      }
      list.sort((a, b) => {
        if (sort.key === "priority") {
          const av2 = PRIORITY_ORDER[a.priority] ?? 4;
          const bv2 = PRIORITY_ORDER[b.priority] ?? 4;
          return sort.dir === "asc" ? av2 - bv2 : bv2 - av2;
        }
        if (sort.key === "openIssues") {
          return sort.dir === "asc" ? a.openIssues - b.openIssues : b.openIssues - a.openIssues;
        }
        let av, bv;
        if (sort.key === "status") {
          av = STATUS_BY_STAGE[a.stage] || "";
          bv = STATUS_BY_STAGE[b.stage] || "";
        } else {
          av = String(a[sort.key] || "");
          bv = String(b[sort.key] || "");
        }
        const cmp = String(bv).localeCompare(String(av));
        return sort.dir === "desc" ? cmp : -cmp;
      });
      return list;
    }, [items, zone, division, section, docType, activeChips, search, sort]);
    const handleSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
    const showToast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(""), 2600);
    };
    const handleAssignSave = (updated) => {
      setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
      setAssignItem(null);
      showToast(`Work item assigned to ${updated.assignedTo?.name}`);
    };
    const isOverdue = (dueDate) => {
      if (!dueDate) return false;
      return new Date(dueDate) < /* @__PURE__ */ new Date("2026-05-29");
    };
    return /* @__PURE__ */ React.createElement("div", { className: "ws-content" }, /* @__PURE__ */ React.createElement(
      AppTopBar,
      {
        crumbs: [
          { label: "Home", onClick: () => onNavigate && onNavigate("home") },
          "Workspace"
        ],
        searchPlaceholder: "Search stations, documents, approvals..."
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dl-page-header" }, /* @__PURE__ */ React.createElement("div", { className: "dl-page-icon-badge" }, /* @__PURE__ */ React.createElement(Icon, { name: "inbox", size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "dl-page-heading" }, /* @__PURE__ */ React.createElement("div", { className: "dl-page-title" }, "Workspace"), /* @__PURE__ */ React.createElement("div", { className: "dl-page-sub" }, "Manage your assigned work"))), /* @__PURE__ */ React.createElement("div", { className: "ws-filter-bar" }, /* @__PURE__ */ React.createElement("div", { className: "ws-filter-field" }, /* @__PURE__ */ React.createElement("label", null, "Zone"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "ws-filter-select",
        "data-active": zone !== "all",
        value: zone,
        onChange: (e) => {
          setZone(e.target.value);
          setDivision("all");
          setSection("all");
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Zones"),
      assignedZones.map((z) => /* @__PURE__ */ React.createElement("option", { key: z, value: z }, z))
    )), /* @__PURE__ */ React.createElement("div", { className: "ws-filter-field" }, /* @__PURE__ */ React.createElement("label", null, "Division"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "ws-filter-select",
        "data-active": division !== "all",
        value: division,
        onChange: (e) => {
          setDivision(e.target.value);
          setSection("all");
        }
      },
      /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Divisions"),
      availableDivisions.map((d) => /* @__PURE__ */ React.createElement("option", { key: d, value: d }, d))
    )), /* @__PURE__ */ React.createElement("div", { className: "ws-filter-field" }, /* @__PURE__ */ React.createElement("label", null, "Section"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "ws-filter-select",
        "data-active": section !== "all",
        value: section,
        onChange: (e) => setSection(e.target.value)
      },
      /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Sections"),
      availableSections.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s))
    )), /* @__PURE__ */ React.createElement("div", { className: "ws-filter-field" }, /* @__PURE__ */ React.createElement("label", null, "Document Type"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "ws-filter-select",
        "data-active": docType !== "all",
        value: docType,
        onChange: (e) => setDocType(e.target.value)
      },
      /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Types"),
      ["ESP", "SIP", "TOC", "LOP", "Other"].map((t) => /* @__PURE__ */ React.createElement("option", { key: t, value: t }, t))
    )), /* @__PURE__ */ React.createElement("div", { className: "ws-filter-actions" }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: resetFilters }, "Reset Filters"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", leadingIcon: "refresh", iconOnly: true, title: "Refresh", onClick: () => showToast("Work queue refreshed") }))), /* @__PURE__ */ React.createElement("div", { className: "ws-chips-bar" }, /* @__PURE__ */ React.createElement("span", { className: "ws-chips-label" }, "Filter"), /* @__PURE__ */ React.createElement("div", { className: "ws-chips-row" }, QUICK_FILTERS.map((f) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: f.id,
        className: "ws-chip",
        "data-active": !!activeChips[f.id],
        onClick: () => toggleChip(f.id)
      },
      f.label,
      activeChips[f.id] && /* @__PURE__ */ React.createElement("span", { className: "ws-chip-x" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 10 }))
    )))), /* @__PURE__ */ React.createElement("div", { className: "ws-search-row" }, /* @__PURE__ */ React.createElement("div", { className: "ws-search-wrap" }, /* @__PURE__ */ React.createElement(Icon, { name: "search", className: "ws-search-icon", size: 15 }), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "ws-search-input",
        placeholder: "Search station, document, file name, assignee\u2026",
        value: search,
        onChange: (e) => setSearch(e.target.value)
      }
    ), search && /* @__PURE__ */ React.createElement("button", { className: "ws-search-clear", onClick: () => setSearch(""), "aria-label": "Clear search" }, /* @__PURE__ */ React.createElement(Icon, { name: "x", size: 12 }))), /* @__PURE__ */ React.createElement("span", { className: "ws-result-count" }, filteredItems.length, " item", filteredItems.length !== 1 ? "s" : "")), /* @__PURE__ */ React.createElement("div", { className: "ws-table-area" }, filteredItems.length === 0 ? /* @__PURE__ */ React.createElement(
      WsEmptyState,
      {
        noItems: items.length === 0,
        onGoToLibrary: () => onNavigate && onNavigate("library"),
        onResetFilters: resetFilters
      }
    ) : /* @__PURE__ */ React.createElement("table", { className: "ws-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Station"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "fileName", sort, onSort: handleSort }, "Document"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "documentType", sort, onSort: handleSort }, "Type"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "stage", sort, onSort: handleSort }, "Stage"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "status", sort, onSort: handleSort }, "Status"), /* @__PURE__ */ React.createElement(SortTh, { sortKey: "openIssues", sort, onSort: handleSort }, "Issues"), /* @__PURE__ */ React.createElement("th", null, "Assigned To"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right" } }, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, filteredItems.map((item) => {
      const status = STATUS_BY_STAGE[item.stage] || "Draft";
      const isMine = item.assignedTo?.name === WS_CURRENT_USER.name;
      const stationTip = `${item.stationName} (${item.stationCode})
Zone: ${item.zone}
Division: ${item.division}
Section: ${item.section}`;
      const docTip = `${item.fileName}
Work item: ${item.workItemTitle}
Last updated: ${item.lastUpdated}` + (item.dueDate ? `
Due: ${item.dueDate}${isOverdue(item.dueDate) ? " (overdue)" : ""}` : "");
      const typeTip = `Document family: ${item.documentType}`;
      const stageTip = `Stage: ${item.stage}
Priority: ${item.priority}
Work ID: ${item.id}`;
      const statusTip = `Lifecycle: ${status}
${status === "Draft" ? "Pre-work \u2014 not yet active" : status === "Active" ? "Editor working or under review/validation" : "Locked after EDAS approval"}`;
      const issuesTip = item.openIssues > 0 ? `${item.openIssues} open issue${item.openIssues !== 1 ? "s" : ""}
Validation: ${item.validationStatus}` : `No open issues
Validation: ${item.validationStatus}`;
      const assigneeTip = item.assignedTo ? `${item.assignedTo.name}
${item.assignedTo.designation} \xB7 ${item.assignedTo.department}` : "No assignee \u2014 needs assignment";
      return /* @__PURE__ */ React.createElement("tr", { key: item.id, "data-mine": isMine ? "true" : void 0 }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": stationTip }, /* @__PURE__ */ React.createElement("span", { className: "ws-station-name" }, item.stationName))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": docTip }, /* @__PURE__ */ React.createElement("span", { className: "ws-doc-cell" }, /* @__PURE__ */ React.createElement("span", { className: "ws-doc-file" }, item.fileName), /* @__PURE__ */ React.createElement("span", { className: "ws-doc-updated" }, item.lastUpdated, item.dueDate && isOverdue(item.dueDate) && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--danger-text)", fontWeight: 700, marginLeft: 6 } }, "\xB7 overdue"))))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": typeTip }, /* @__PURE__ */ React.createElement(TypeBadge, { docType: item.documentType }))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": stageTip }, /* @__PURE__ */ React.createElement(StageBadge, { stage: item.stage }))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": statusTip }, /* @__PURE__ */ React.createElement(StatusBadge, { status }))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": issuesTip }, item.openIssues > 0 ? /* @__PURE__ */ React.createElement("span", { className: "ws-issues-badge" }, item.openIssues) : /* @__PURE__ */ React.createElement("span", { className: "ws-no-issues" }, "0"))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: "ws-tip", "data-tip": assigneeTip }, item.assignedTo ? /* @__PURE__ */ React.createElement("span", { className: "ws-assignee-name" }, item.assignedTo.name, isMine && /* @__PURE__ */ React.createElement("span", { className: "ws-you-tag" }, "you")) : /* @__PURE__ */ React.createElement("span", { className: "ws-unassigned" }, "Unassigned"))), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement(
        RowActions,
        {
          item,
          onAssign: setAssignItem,
          onToast: showToast
        }
      )));
    })))), assignItem && /* @__PURE__ */ React.createElement(
      AssignModal,
      {
        item: assignItem,
        onClose: () => setAssignItem(null),
        onSave: handleAssignSave
      }
    ), toast && /* @__PURE__ */ React.createElement("div", { className: "dl-toast", role: "status", "aria-live": "polite" }, /* @__PURE__ */ React.createElement(Icon, { name: "check_circle", size: 16 }), toast));
  };
  window.WorkspacePage = WorkspacePage;
  const wsStyleEl = document.createElement("style");
  wsStyleEl.textContent = wsCSS;
  document.head.appendChild(wsStyleEl);
})();
