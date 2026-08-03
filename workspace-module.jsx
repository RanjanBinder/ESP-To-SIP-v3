// Workspace module — My Files · Shared Workspace · Upload · Extraction review · Submission · Review
//
// Implemented against this project's actual conventions (no-build global JSX, vendored React UMD,
// shared design system in components-*.jsx). Exposes window.WorkspaceModulePage and
// window.useWorkspaceCounts for the sidebar badges.
//
// All data is fixture-driven. Every mutation resolves after a simulated delay.

(() => {
  const { useEffect, useMemo, useRef, useState, useCallback, useSyncExternalStore } = React;
  const Icon = window.Icon;
  const Btn = window.Btn;
  const Chip = window.Chip;
  const Modal = window.Modal;
  const Field = window.Field;
  const TextInput = window.TextInput;
  const Select = window.Select;
  const Textarea = window.Textarea;
  const Checkbox = window.Checkbox;
  const KPICard = window.KPICard;
  const EmptyState = window.EmptyState;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ═══════════════════════ Stage configuration ═══════════════════════ */
  // Single source of truth for how a stage presents. Never hard-code a stage
  // label, tone or action anywhere else.

  const STAGE_CONFIG = {
    UPLOADED:                  { label: "Uploaded",              tone: "neutral", primaryAction: { label: "Start extraction",   intent: "START_EXTRACTION" } },
    EXTRACTING:                { label: "Extracting",            tone: "info",    primaryAction: { label: "View progress",      intent: "VIEW_PROGRESS", disabled: true } },
    NEEDS_REVIEW:              { label: "Needs review",          tone: "warning", primaryAction: { label: "Review extraction",  intent: "REVIEW_EXTRACTION" } },
    EXTRACTED:                 { label: "Extracted",             tone: "neutral", primaryAction: { label: "Open editor",        intent: "OPEN_EDITOR" } },
    IN_EDITING:                { label: "In editing",            tone: "info",    primaryAction: { label: "Resume editing",     intent: "OPEN_EDITOR" } },
    VALIDATION_FAILED:         { label: "Validation failed",     tone: "danger",  primaryAction: { label: "View violations",    intent: "VIEW_VIOLATIONS" } },
    READY_FOR_SUBMISSION:      { label: "Ready to submit",       tone: "success", primaryAction: { label: "Submit for approval", intent: "SUBMIT" } },
    UNDER_INTERNAL_CHECK:      { label: "Under internal check",  tone: "info",    primaryAction: null },
    PROVISIONAL_COMMENTS_OPEN: { label: "Comments open",         tone: "info",    primaryAction: null },
    COMMENTS_CONSOLIDATED:     { label: "Comments consolidated", tone: "neutral", primaryAction: null },
    UNDER_SIGNATURE:           { label: "Under signature",       tone: "info",    primaryAction: null },
    APPROVED:                  { label: "Approved",              tone: "success", primaryAction: null },
    REJECTED:                  { label: "Rejected",              tone: "danger",  primaryAction: { label: "View comments",      intent: "VIEW_COMMENTS" } },
  };

  const stageLabel = (stage) => (STAGE_CONFIG[stage] || {}).label || stage;

  // Document type tints — defined once, derived from tokens.
  const DOC_TYPE_CONFIG = {
    ESP:      { label: "ESP",      tint: "var(--accent-soft)",  ink: "var(--accent-text)" },
    SIP:      { label: "SIP",      tint: "var(--info-soft)",    ink: "var(--info-text)" },
    TOC:      { label: "TOC",      tint: "var(--success-soft)", ink: "var(--success-text)" },
    LOP:      { label: "LOP",      tint: "var(--warning-soft)", ink: "var(--warning-text)" },
    SURVEY:   { label: "Survey",   tint: "var(--ink-100)",      ink: "var(--ink-600)" },
    GRADIENT: { label: "Gradient", tint: "var(--danger-soft)",  ink: "var(--danger-text)" },
  };

  const SOURCE_TYPE_LABEL = {
    UPLOADED: "Uploaded drawing",
    REVISION_OF_APPROVED: "Revision of approved",
    GENERATED_FROM_UPSTREAM: "Generated from upstream",
  };

  /* ── My Files visual palette (matches the approved mockup exactly) ── */
  // These literal hex values are the design spec for the My Files table; keep them
  // in sync with the mockup rather than the token file.
  const MF = {
    indigo: "#4338ca", indigoHover: "#3730a3", indigoSoft: "#eef2ff", indigoBorder: "#dfe3fb",
    ink: "#0f172a", ink2: "#1e293b", ink3: "#334155", ink4: "#475569",
    muted: "#64748b", faint: "#94a3b8", faint2: "#cbd5e1",
    line: "#e7eaee", line2: "#eef0f3", border: "#d4d8e0", pageHover: "#fafbff", head: "#fafbfc",
  };
  const MF_TYPE_BADGE = {
    TOC: ["#eef2ff", "#4338ca"], ESP: ["#ecfdf5", "#047857"], LOP: ["#fff7ed", "#c2410c"],
    SIP: ["#fef2f2", "#be123c"], SURVEY: ["#f1f5f9", "#475569"], GRADIENT: ["#fef2f2", "#be123c"],
  };
  const MF_STATE_VISUAL = {
    EXTRACTED:            ["#ecfdf5", "#065f46", "#10b981"],
    UPLOADED:             ["#f1f5f9", "#475569", "#94a3b8"],
    VALIDATION_FAILED:    ["#fef2f2", "#b91c1c", "#ef4444"],
    EXTRACTING:           ["#eff6ff", "#1d4ed8", "#3b82f6"],
    NEEDS_REVIEW:         ["#fffbeb", "#b45309", "#f59e0b"],
    IN_EDITING:           ["#f5f3ff", "#6d28d9", "#8b5cf6"],
    READY_FOR_SUBMISSION: ["#ecfdf5", "#047857", "#10b981"],
    REJECTED:             ["#fef2f2", "#b91c1c", "#ef4444"],
  };
  // Which stat card a stage rolls up into.
  const MF_GROUP_OF = (stage) => {
    if (["UPLOADED", "EXTRACTING", "EXTRACTED", "IN_EDITING"].includes(stage)) return "progress";
    if (stage === "NEEDS_REVIEW") return "review";
    if (stage === "VALIDATION_FAILED") return "failed";
    if (stage === "READY_FOR_SUBMISSION") return "ready";
    return "other";
  };
  const MF_GROUP_LABEL = { progress: "In progress", review: "Needs review", failed: "Validation failed", ready: "Ready to submit" };

  /* ═══════════════════════ Approval chains ═══════════════════════ */

  const APPROVAL_CHAINS = {
    ESP:               ["Preparer", "SSE/DEN check", "AEN", "Sr. DEN"],
    SIP_INTERNAL:      ["JE/SSE Drawings", "ASTE/SSTE HQ"],
    SIP_PROVISIONAL:   ["Sr. DSTE", "Sr. DOM", "DyCSTE (Exec. Agency)", "CTPM / SAG"],
    SIP_APPROVAL:      ["JE/SSE Drawings", "ASTE/SSTE HQ", "DyCSTE HQ", "CTPM (Operating)", "CSTE"],
    TOC:               ["JE/SSE Drawings", "ASTE/SSTE HQ", "DyCSTE HQ"],
    LOP:               ["SSE/OHE", "AEE/TrD", "Sr. DEE/TrD"],
  };

  const chainFor = (documentType, route) => {
    if (documentType === "SIP") return APPROVAL_CHAINS[route === "PROVISIONAL" ? "SIP_PROVISIONAL" : route === "APPROVAL" ? "SIP_APPROVAL" : "SIP_INTERNAL"];
    return APPROVAL_CHAINS[documentType] || APPROVAL_CHAINS.ESP;
  };

  /* ═══════════════════════ Formatters ═══════════════════════ */

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const fmtDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
  };

  const fmtShort = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${hh}:${mm}`;
  };

  const fmtDay = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  const daysUntil = (iso) => {
    if (!iso) return null;
    const ms = new Date(iso).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
  };

  const fmtBytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
    return `${(n / 1048576).toFixed(1)} MB`;
  };

  const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

  /* ═══════════════════════ Fixtures ═══════════════════════ */

  const CURRENT_USER = {
    id: "u-001",
    name: "R. Kumar",
    designation: "SSE/Drawings",
    department: "SNT",
    division: "Guntur",
    zone: "SCR",
  };

  const USERS = {
    kumar: CURRENT_USER,
    rao:    { id: "u-002", name: "A. Rao",      designation: "SSE/Drawings",  department: "SNT",       division: "Guntur", zone: "SCR" },
    reddy:  { id: "u-003", name: "K. Reddy",    designation: "ASTE/HQ",       department: "SNT",       division: "Guntur", zone: "SCR" },
    sharma: { id: "u-004", name: "P. Sharma",   designation: "DyCSTE HQ",     department: "SNT",       division: "Guntur", zone: "SCR" },
    naidu:  { id: "u-005", name: "S. Naidu",    designation: "Sr. DSTE",      department: "SNT",       division: "Guntur", zone: "SCR" },
    das:    { id: "u-006", name: "M. Das",      designation: "Sr. DOM",       department: "OPERATING", division: "Guntur", zone: "SCR" },
    iyer:   { id: "u-007", name: "V. Iyer",     designation: "CTPM (Operating)", department: "OPERATING", division: "Guntur", zone: "SCR" },
    bose:   { id: "u-008", name: "T. Bose",     designation: "Sr. DEE/TrD",   department: "ELEC",      division: "Guntur", zone: "SCR" },
  };

  const mkStation = (name, code, section, extra) => ({
    id: `st-${code.toLowerCase()}`,
    name, code,
    zone: "SCR",
    division: "Guntur",
    section,
    ...extra,
  });

  const STATIONS = [
    mkStation("Pothulapadu",    "PTPD", "Guntur–Tenali",    { classOfStation: "C", standardOfInterlocking: "SEI" }),
    mkStation("Nambur",         "NBM",  "Guntur–Tenali",    { classOfStation: "D", standardOfInterlocking: "SEI" }),
    mkStation("Sattenapalle",   "SAP",  "Guntur–Nadikudi",  { classOfStation: "B", standardOfInterlocking: "PI" }),
    mkStation("Tenali",         "TEL",  "Guntur–Tenali",    { classOfStation: "A", standardOfInterlocking: "EI" }),
    mkStation("Guntur",         "GNT",  "Guntur Junction",  { classOfStation: "A", standardOfInterlocking: "EI" }),
    mkStation("Krishna Canal",  "KCC",  "Guntur–Tenali",    { classOfStation: "D", standardOfInterlocking: "SEI" }),
    mkStation("Phirangipuram",  "PRM",  "Guntur–Nadikudi",  { classOfStation: "D", standardOfInterlocking: "SEI" }),
    mkStation("Vejendla",       "VJD",  "Guntur–Nadikudi",  { classOfStation: "C", standardOfInterlocking: "SEI" }),
  ];

  // Revision baselines shown by the Create Revision flow. The fixture keeps the
  // selector scoped to the selected station and to ESP/SIP documents only.
  const REVISION_ZONE_LABELS = { SCR: "South Central Railway" };
  const REVISION_BASELINES = STATIONS.flatMap((st, index) => ([
    {
      id: `base-${st.code.toLowerCase()}-esp`, stationId: st.id, documentType: "ESP",
      drawingNumber: `GM(W)/SCR/YARDS/GNT/${st.code}/431/202${(index % 4) + 2}`,
      name: `Engineering Scale Plan — ${st.name}`,
      generatedFrom: "Approved station record",
      version: `V${(index % 4) + 2}-R0-A${index % 3}`,
      status: index % 3 === 1 ? "In Review" : "Approved",
      modifiedAt: `2026-07-${String(8 + index).padStart(2, "0")}`,
      approvalDate: `2026-06-${String(10 + index).padStart(2, "0")}`,
    },
    {
      id: `base-${st.code.toLowerCase()}-sip`, stationId: st.id, documentType: "SIP",
      drawingNumber: `GM(W)/SCR/SIP/GNT/${st.code}/214/202${(index % 4) + 2}`,
      name: `Signal Interlocking Plan — ${st.name}`,
      generatedFrom: `${st.code} ESP V${(index % 4) + 2}`,
      version: `V${(index % 3) + 1}-R0-A${(index + 1) % 3}`,
      status: index % 3 === 2 ? "In Review" : "Approved",
      modifiedAt: `2026-07-${String(12 + index).padStart(2, "0")}`,
      approvalDate: `2026-06-${String(14 + index).padStart(2, "0")}`,
    },
  ]));

  const station = (code) => STATIONS.find((s) => s.code === code);

  const noViolations = { v1Open: 0, v2Open: 0, corrected: 0, justified: 0, lastRunAt: null };

  const DRAFTS_FIXTURE = [
    {
      id: "d-001",
      station: station("PTPD"),
      documentType: "ESP",
      draftVersion: "v4.2",
      parentVersion: "v3",
      status: "DRAFT",
      stage: "VALIDATION_FAILED",
      sourceType: "REVISION_OF_APPROVED",
      sourceDocId: "doc-esp-ptpd-v3",
      sourceDocVersion: "v3",
      sourceDocStatus: "ACTIVE",
      owner: USERS.kumar,
      createdAt: "2026-07-14T09:10:00",
      modifiedAt: "2026-07-21T14:22:00",
      violations: { v1Open: 3, v2Open: 1, corrected: 6, justified: 2, lastRunAt: "2026-07-21T14:02:00" },
      extraction: { total: 52, mandatoryOpen: 0, reviewed: 52 },
      metadataComplete: true,
      advisories: [{
        kind: "SOURCE_REVISION_IN_PROGRESS",
        severity: "WARNING",
        message: "ESP v5 revision in progress by A. Rao. Work started now may require rework.",
        relatedDocId: "d-esp-ptpd-v5",
      }],
    },
    {
      id: "d-002",
      station: station("NBM"),
      documentType: "ESP",
      draftVersion: "v2.0",
      parentVersion: "v1",
      status: "DRAFT",
      stage: "NEEDS_REVIEW",
      sourceType: "UPLOADED",
      sourceDocId: null,
      sourceDocVersion: null,
      sourceDocStatus: null,
      owner: USERS.kumar,
      createdAt: "2026-07-18T11:00:00",
      modifiedAt: "2026-07-21T10:05:00",
      violations: { ...noViolations },
      extraction: { total: 47, mandatoryOpen: 12, reviewed: 35 },
      metadataComplete: true,
      advisories: [],
    },
    {
      id: "d-003",
      station: station("SAP"),
      documentType: "SIP",
      draftVersion: "v1.0",
      parentVersion: null,
      status: "DRAFT",
      stage: "READY_FOR_SUBMISSION",
      sourceType: "GENERATED_FROM_UPSTREAM",
      sourceDocId: "doc-esp-sap-v2",
      sourceDocVersion: "v2",
      sourceDocStatus: "ACTIVE",
      owner: USERS.kumar,
      createdAt: "2026-07-12T08:30:00",
      modifiedAt: "2026-07-20T16:40:00",
      violations: { v1Open: 0, v2Open: 0, corrected: 9, justified: 3, lastRunAt: "2026-07-20T16:35:00" },
      extraction: { total: 61, mandatoryOpen: 0, reviewed: 61 },
      metadataComplete: true,
      advisories: [],
    },
    {
      id: "d-004",
      station: station("TEL"),
      documentType: "ESP",
      draftVersion: "v3.1",
      parentVersion: "v3",
      status: "DRAFT",
      stage: "EXTRACTING",
      sourceType: "UPLOADED",
      sourceDocId: null,
      sourceDocVersion: null,
      sourceDocStatus: null,
      owner: USERS.kumar,
      createdAt: "2026-07-21T13:55:00",
      modifiedAt: "2026-07-21T14:01:00",
      violations: { ...noViolations },
      extraction: { total: 0, mandatoryOpen: 0, reviewed: 0 },
      metadataComplete: false,
      advisories: [],
    },
    {
      id: "d-005",
      station: station("GNT"),
      documentType: "SIP",
      draftVersion: "v2.3",
      parentVersion: "v2",
      status: "DRAFT",
      stage: "REJECTED",
      sourceType: "REVISION_OF_APPROVED",
      sourceDocId: "doc-sip-gnt-v2",
      sourceDocVersion: "v2",
      sourceDocStatus: "ACTIVE",
      owner: USERS.kumar,
      createdAt: "2026-06-28T10:00:00",
      modifiedAt: "2026-07-19T09:15:00",
      violations: { v1Open: 0, v2Open: 0, corrected: 4, justified: 1, lastRunAt: "2026-07-17T12:00:00" },
      extraction: { total: 58, mandatoryOpen: 0, reviewed: 58 },
      metadataComplete: true,
      rejectionReason: "Return crossover at Guntur end not to scale; platform clearance dimension missing.",
      commentCount: 5,
      advisories: [],
    },
    {
      id: "d-006",
      station: station("KCC"),
      documentType: "LOP",
      draftVersion: "v1.3",
      parentVersion: "v1",
      status: "DRAFT",
      stage: "IN_EDITING",
      sourceType: "REVISION_OF_APPROVED",
      sourceDocId: "doc-lop-kcc-v1",
      sourceDocVersion: "v1",
      sourceDocStatus: "ACTIVE",
      owner: USERS.kumar,
      createdAt: "2026-07-09T14:20:00",
      modifiedAt: "2026-07-21T08:45:00",
      violations: { v1Open: 0, v2Open: 2, corrected: 1, justified: 0, lastRunAt: "2026-07-20T11:30:00" },
      extraction: { total: 34, mandatoryOpen: 0, reviewed: 34 },
      metadataComplete: true,
      advisories: [],
    },
    {
      id: "d-007",
      station: station("PRM"),
      documentType: "ESP",
      draftVersion: "v1.0",
      parentVersion: null,
      status: "DRAFT",
      stage: "UPLOADED",
      sourceType: "UPLOADED",
      sourceDocId: null,
      sourceDocVersion: null,
      sourceDocStatus: null,
      owner: USERS.kumar,
      createdAt: "2026-07-21T15:30:00",
      modifiedAt: "2026-07-21T15:30:00",
      violations: { ...noViolations },
      extraction: null,
      metadataComplete: false,
      advisories: [],
    },
    {
      id: "d-008",
      station: station("VJD"),
      documentType: "SIP",
      draftVersion: "v1.0",
      parentVersion: null,
      status: "DRAFT",
      stage: "READY_FOR_SUBMISSION",
      sourceType: "GENERATED_FROM_UPSTREAM",
      sourceDocId: "doc-esp-vjd-v1",
      sourceDocVersion: "v1",
      sourceDocStatus: "DRAFT",           // ← blocks submission (business rule 4)
      owner: USERS.kumar,
      createdAt: "2026-07-15T09:00:00",
      modifiedAt: "2026-07-20T17:10:00",
      violations: { v1Open: 0, v2Open: 0, corrected: 5, justified: 1, lastRunAt: "2026-07-20T17:05:00" },
      extraction: { total: 44, mandatoryOpen: 0, reviewed: 44 },
      metadataComplete: true,
      advisories: [{
        kind: "PROMOTION_BLOCKED",
        severity: "BLOCKING",
        message: "Source ESP v1 for Vejendla is still a draft. This SIP cannot be submitted until the source ESP is approved and active.",
        relatedDocId: "doc-esp-vjd-v1",
      }],
    },
  ];

  // Version-control metadata for the My Files table (check-out / check-in / alteration /
  // notes). Kept beside the drafts and merged in so the draft objects above stay readable.
  // checkedOutBy = who currently holds the file locked for editing (null = checked in).
  const DRAFT_META = {
    "d-001": { checkedOutBy: USERS.kumar, checkedInBy: USERS.kumar, alteration: "Alt. 4", notes: "SOD rerun pending after crossover correction.", commentCount: 2 },
    "d-002": { checkedOutBy: USERS.kumar, checkedInBy: USERS.rao,   alteration: "Alt. 2", notes: "12 low-confidence assets flagged for review.", commentCount: 0 },
    "d-003": { checkedOutBy: null,        checkedInBy: USERS.kumar, alteration: "Alt. 1", notes: "Generated from ESP v2 (active).", commentCount: 1 },
    "d-004": { checkedOutBy: USERS.kumar, checkedInBy: null,        alteration: "Alt. 3", notes: "Extraction running.", commentCount: 0 },
    "d-005": { checkedOutBy: USERS.kumar, checkedInBy: USERS.reddy, alteration: "Alt. 3", notes: "Returned — platform clearance dimension missing.", commentCount: 5 },
    "d-006": { checkedOutBy: USERS.kumar, checkedInBy: USERS.kumar, alteration: "Alt. 2", notes: "OHE mast spacing under revision.", commentCount: 0 },
    "d-007": { checkedOutBy: USERS.kumar, checkedInBy: null,        alteration: "Alt. 1", notes: "Awaiting extraction.", commentCount: 0 },
    "d-008": { checkedOutBy: null,        checkedInBy: USERS.kumar, alteration: "Alt. 1", notes: "Submission blocked — source ESP still a draft.", commentCount: 0 },
  };
  DRAFTS_FIXTURE.forEach((d) => Object.assign(d, DRAFT_META[d.id]));

  // A display file name for a draft. Uploaded drafts keep their original file name;
  // everything else gets a synthesised, stable identifier.
  const draftFileName = (d) =>
    (d.fileNames && d.fileNames[0]) || `${d.station.code}-${d.documentType}-${d.draftVersion}`;

  // Alteration label derived from a version like "v4.2" → "Alt. 4".
  const alterationFor = (version) => {
    const m = /v?(\d+)/.exec(version || "");
    return m ? `Alt. ${m[1]}` : "Alt. 1";
  };

  // Build an approval chain with the first `done` stages complete.
  const mkChain = (labels, actors, done, rejectedAt) =>
    labels.map((label, i) => ({
      order: i,
      label,
      actor: actors[i] || null,
      state: rejectedAt === i ? "REJECTED" : i < done ? "COMPLETE" : i === done ? "CURRENT" : "PENDING",
      actedAt: i < done ? `2026-07-${String(10 + i).padStart(2, "0")}T10:30:00` : null,
      action: rejectedAt === i ? "REJECTED" : i < done ? (i === labels.length - 1 ? "SIGNED" : "APPROVED") : null,
    }));

  const SHARED_FIXTURE = [
    {
      id: "s-001",
      station: station("PTPD"),
      documentType: "SIP",
      version: "v4.0",
      stage: "PROVISIONAL_COMMENTS_OPEN",
      legend: "Draft Signalling Interlocking Plan for Comments",
      submittedBy: USERS.kumar,
      submittedAt: "2026-07-16T11:20:00",
      chain: mkChain(APPROVAL_CHAINS.SIP_PROVISIONAL, [USERS.naidu, USERS.das, USERS.sharma, USERS.iyer], 1),
      commentWindow: { open: true, closesAt: "2026-07-28T23:59:00", commentCount: 12, departmentsResponded: 3 },
      awaitingCurrentUser: false,
      advisories: [],
    },
    {
      id: "s-002",
      station: station("NBM"),
      documentType: "ESP",
      version: "v2.0",
      stage: "UNDER_SIGNATURE",
      legend: "Engineering Scale Plan — Nambur",
      submittedBy: USERS.rao,
      submittedAt: "2026-07-11T09:00:00",
      chain: mkChain(APPROVAL_CHAINS.ESP, [USERS.rao, USERS.kumar, USERS.reddy, USERS.sharma], 2),
      commentWindow: null,
      awaitingCurrentUser: true,
      advisories: [],
    },
    {
      id: "s-003",
      station: station("TEL"),
      documentType: "SIP",
      version: "v3.0",
      stage: "UNDER_INTERNAL_CHECK",
      legend: "Signalling Interlocking Plan — internal check",
      submittedBy: USERS.kumar,
      submittedAt: "2026-07-20T15:00:00",
      chain: mkChain(APPROVAL_CHAINS.SIP_INTERNAL, [USERS.kumar, USERS.reddy], 1),
      commentWindow: null,
      awaitingCurrentUser: false,
      advisories: [],
    },
    {
      id: "s-004",
      station: station("GNT"),
      documentType: "TOC",
      version: "v1.2",
      stage: "UNDER_SIGNATURE",
      legend: "Table of Control — Guntur Junction",
      submittedBy: USERS.rao,
      submittedAt: "2026-07-13T10:10:00",
      chain: mkChain(APPROVAL_CHAINS.TOC, [USERS.rao, USERS.kumar, USERS.sharma], 2),
      commentWindow: null,
      awaitingCurrentUser: false,
      advisories: [],
    },
    {
      id: "s-005",
      station: station("SAP"),
      documentType: "ESP",
      version: "v2.0",
      stage: "COMMENTS_CONSOLIDATED",
      legend: "Engineering Scale Plan — Sattenapalle",
      submittedBy: USERS.kumar,
      submittedAt: "2026-07-05T08:40:00",
      chain: mkChain(APPROVAL_CHAINS.ESP, [USERS.kumar, USERS.reddy, USERS.sharma, USERS.naidu], 3),
      commentWindow: { open: false, closesAt: "2026-07-15T23:59:00", commentCount: 8, departmentsResponded: 4 },
      awaitingCurrentUser: false,
      advisories: [],
    },
  ];

  /* ── Extracted assets for Pothulapadu — exactly 12 requiring review ── */

  const buildAssets = () => {
    const out = [];
    let n = 0;
    const add = (a) => { out.push({ id: `a-${String(++n).padStart(3, "0")}`, reviewState: "PENDING", requiresReview: false, ...a }); };

    // 6 tracks — LINE, high confidence
    const trackYs = [120, 160, 200, 240, 280, 320];
    trackYs.forEach((y, i) => add({
      assetType: "TRACK", geometry: "LINE", chainage: `km 312.${100 + i * 20}`,
      coordinates: { x: 60, y, z: 12.4 }, source: "LIDAR", confidence: 0.93 + (i % 3) * 0.02,
      points: [60, y, 300, y, 560, y - (i % 2 ? 6 : 0), 840, y],
      label: `Line ${i + 1}`,
    }));

    // 8 turnouts — POINT, 3 below 0.7 (mandatory review)
    const turnouts = [
      { x: 300, y: 140, c: 0.91 }, { x: 420, y: 180, c: 0.88 }, { x: 540, y: 220, c: 0.64 },
      { x: 660, y: 260, c: 0.79 }, { x: 250, y: 300, c: 0.58 }, { x: 700, y: 160, c: 0.83 },
      { x: 480, y: 320, c: 0.66 }, { x: 620, y: 120, c: 0.9 },
    ];
    turnouts.forEach((t, i) => add({
      assetType: "TURNOUT", geometry: "POINT", chainage: `km 312.${210 + i * 12}`,
      coordinates: { x: t.x, y: t.y, z: 12.4 }, orientation: i % 2 ? 45 : 135,
      source: i % 3 === 0 ? "CAD" : "AI", confidence: t.c, requiresReview: t.c < 0.7,
      label: `Turnout ${101 + i}`,
    }));

    // 12 signals — POINT, mixed (4 below 0.7)
    const signals = [
      { x: 140, y: 110, c: 0.95 }, { x: 220, y: 150, c: 0.87 }, { x: 340, y: 190, c: 0.62 },
      { x: 460, y: 230, c: 0.81 }, { x: 580, y: 270, c: 0.68 }, { x: 700, y: 310, c: 0.9 },
      { x: 180, y: 250, c: 0.55 }, { x: 760, y: 130, c: 0.86 }, { x: 400, y: 290, c: 0.92 },
      { x: 520, y: 150, c: 0.69 }, { x: 640, y: 210, c: 0.84 }, { x: 280, y: 330, c: 0.88 },
    ];
    signals.forEach((s, i) => add({
      assetType: "SIGNAL", geometry: "POINT", chainage: `km 312.${300 + i * 9}`,
      coordinates: { x: s.x, y: s.y, z: 13.1 }, orientation: i % 2 ? 0 : 180,
      source: "AI", confidence: s.c, requiresReview: s.c < 0.7,
      label: `Signal S${i + 1}`,
    }));

    // 2 platforms — POLYGON
    [{ y: 90, n: 1 }, { y: 350, n: 2 }].forEach((p, i) => add({
      assetType: "PLATFORM", geometry: "POLYGON", chainage: "km 312.250",
      coordinates: { x: 260, y: p.y, z: 12.9 }, source: "LIDAR", confidence: 0.9,
      points: [260, p.y - 12, 620, p.y - 12, 620, p.y + 12, 260, p.y + 12],
      label: `Platform ${p.n}`,
    }));

    // 4 buildings — POLYGON, 2 mandatory
    const buildings = [
      { x: 120, y: 380, c: 0.82, l: "Station building" },
      { x: 700, y: 380, c: 0.61, l: "Relay room" },
      { x: 820, y: 250, c: 0.59, l: "Cabin" },
      { x: 60, y: 60, c: 0.88, l: "Store shed" },
    ];
    buildings.forEach((b) => add({
      assetType: "BUILDING", geometry: "POLYGON", chainage: "km 312.260",
      coordinates: { x: b.x, y: b.y, z: 12.0 }, source: "CAD", confidence: b.c,
      requiresReview: b.c < 0.7,
      points: [b.x - 34, b.y - 18, b.x + 34, b.y - 18, b.x + 34, b.y + 18, b.x - 34, b.y + 18],
      label: b.l,
    }));

    // 3 redundant rail candidates (released rails)
    [{ y: 400 }, { y: 420 }, { y: 440 }].forEach((r, i) => add({
      assetType: "TRACK", geometry: "LINE", chainage: `km 312.${480 + i * 15}`,
      coordinates: { x: 200, y: r.y, z: 12.2 }, source: "LIDAR", confidence: 0.74,
      isRedundantCandidate: true,
      points: [200, r.y, 430, r.y, 660, r.y],
      label: `Released rail ${i + 1}`,
    }));

    // Remainder — fouling marks, glued joints, SEJs, dead ends
    const misc = [
      { t: "FOULING_MARK", x: 330, y: 250, c: 0.86, l: "Fouling mark FM-1" },
      { t: "FOULING_MARK", x: 560, y: 300, c: 0.64, l: "Fouling mark FM-2" },
      { t: "GLUED_JOINT",  x: 240, y: 200, c: 0.89, l: "Glued joint GJ-1" },
      { t: "GLUED_JOINT",  x: 610, y: 240, c: 0.91, l: "Glued joint GJ-2" },
      { t: "SEJ",          x: 430, y: 120, c: 0.66, l: "SEJ-1" },
      { t: "SEJ",          x: 750, y: 220, c: 0.85, l: "SEJ-2" },
      { t: "DEAD_END",     x: 860, y: 320, c: 0.78, l: "Dead end DE-1" },
      { t: "DEAD_END",     x: 100, y: 330, c: 0.63, l: "Dead end DE-2" },
    ];
    misc.forEach((m) => add({
      assetType: m.t, geometry: "POINT", chainage: "km 312.400",
      coordinates: { x: m.x, y: m.y, z: 12.5 }, source: "AI", confidence: m.c,
      requiresReview: m.c < 0.7, label: m.l,
    }));

    return out;
  };

  const ASSETS_FIXTURE = buildAssets();

  const COMMENTS_FIXTURE = [
    { id: "c-001", docId: "s-001", authorId: "u-006", authorName: "M. Das", authorDesignation: "Sr. DOM", department: "OPERATING",
      text: "Starter signal for Line 2 is shown beyond the fouling mark. Please reposition to comply with the standard clearance.",
      anchor: { assetId: "a-016" }, severity: "MAJOR", state: "OPEN", createdAt: "2026-07-17T10:20:00", parentId: null, attachments: [] },
    { id: "c-002", docId: "s-001", authorId: "u-005", authorName: "S. Naidu", authorDesignation: "Sr. DSTE", department: "SNT",
      text: "Agreed. Also confirm the overlap distance shown at the Tenali end.", anchor: null,
      severity: "MINOR", state: "OPEN", createdAt: "2026-07-17T12:05:00", parentId: "c-001", attachments: [] },
    { id: "c-003", docId: "s-001", authorId: "u-008", authorName: "T. Bose", authorDesignation: "Sr. DEE/TrD", department: "ELEC",
      text: "OHE mast positions between km 312.250 and 312.300 conflict with the proposed signal locations.",
      anchor: { assetId: "a-020" }, severity: "MAJOR", state: "ACKNOWLEDGED", createdAt: "2026-07-18T09:30:00", parentId: null,
      attachments: [{ name: "ohe-conflict-sketch.pdf", size: 284000 }] },
    { id: "c-004", docId: "s-001", authorId: "u-007", authorName: "V. Iyer", authorDesignation: "CTPM (Operating)", department: "OPERATING",
      text: "Legend block is legible. No comment from Operating on the platform layout.", anchor: null,
      severity: "INFO", state: "ADDRESSED", createdAt: "2026-07-19T14:00:00", parentId: null, attachments: [] },
    { id: "c-005", docId: "s-002", authorId: "u-003", authorName: "K. Reddy", authorDesignation: "ASTE/HQ", department: "SNT",
      text: "Gradient values at the Guntur end need to match the approved gradient chart.", anchor: null,
      severity: "MAJOR", state: "OPEN", createdAt: "2026-07-14T11:45:00", parentId: null, attachments: [] },
  ];

  /* ═══════════════════════ Store ═══════════════════════ */
  // Tiny observable singleton. Lives outside React so the sidebar badges and the
  // page can both subscribe. All six business rules are enforced HERE, never in
  // a component.

  const createStore = (initial) => {
    let state = initial;
    const listeners = new Set();
    return {
      getState: () => state,
      subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
      set: (patch) => {
        const next = typeof patch === "function" ? patch(state) : patch;
        state = Object.assign({}, state, next);
        listeners.forEach((fn) => fn());
      },
    };
  };

  const EMPTY_FILTERS = {
    stationId: null, documentType: null, stage: null,
    sourceType: null, ownerId: null, dateFrom: null, dateTo: null,
  };

  const store = createStore({
    activeTab: "MY_FILES",
    viewMode: "CARD",
    drafts: DRAFTS_FIXTURE,
    sharedItems: SHARED_FIXTURE,
    comments: COMMENTS_FIXTURE,
    // Filters and sort are kept per tab so switching tabs preserves each view.
    filters: { MY_FILES: { ...EMPTY_FILTERS }, SHARED: { ...EMPTY_FILTERS } },
    search: { MY_FILES: "", SHARED: "" },
    sortBy: { MY_FILES: "MODIFIED_DESC", SHARED: "MODIFIED_DESC" },
    loading: false,
    busyId: null,
    toast: null,
  });

  const S = store.getState;

  let toastTimer = null;
  const toast = (message, tone = "success") => {
    store.set({ toast: { message, tone, key: Date.now() } });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => store.set({ toast: null }), 4200);
  };

  const patchDraft = (id, patch) => store.set((s) => ({
    drafts: s.drafts.map((d) => (d.id === id ? Object.assign({}, d, typeof patch === "function" ? patch(d) : patch) : d)),
  }));

  const patchShared = (id, patch) => store.set((s) => ({
    sharedItems: s.sharedItems.map((it) => (it.id === id ? Object.assign({}, it, typeof patch === "function" ? patch(it) : patch) : it)),
  }));

  /* ── UI state actions ── */
  const setActiveTab = (tab) => store.set({ activeTab: tab });
  const setViewMode = (mode) => store.set({ viewMode: mode });
  const setFilter = (key, value) => store.set((s) => ({
    filters: { ...s.filters, [s.activeTab]: { ...s.filters[s.activeTab], [key]: value || null } },
  }));
  const clearFilters = () => store.set((s) => ({
    filters: { ...s.filters, [s.activeTab]: { ...EMPTY_FILTERS } },
    search: { ...s.search, [s.activeTab]: "" },
  }));
  const setSearch = (value) => store.set((s) => ({ search: { ...s.search, [s.activeTab]: value } }));
  const setSort = (sortBy) => store.set((s) => ({ sortBy: { ...s.sortBy, [s.activeTab]: sortBy } }));

  /* ── Mutations ── */

  const createDraftFromUpload = async (payload) => {
    store.set({ loading: true });
    await sleep(600);
    const st = STATIONS.find((x) => x.id === payload.stationId) || STATIONS[0];
    const draft = {
      id: uid("d"),
      station: st,
      documentType: payload.documentType,
      draftVersion: payload.version || "v1.0",
      parentVersion: null,
      status: "DRAFT",
      stage: "UPLOADED",
      sourceType: "UPLOADED",
      sourceDocId: null,
      sourceDocVersion: null,
      sourceDocStatus: null,
      owner: CURRENT_USER,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      violations: { ...noViolations },
      extraction: null,
      metadataComplete: Boolean(payload.metadataComplete),
      advisories: [],
      fileNames: (payload.files || []).map((f) => f.name),
      checkedOutBy: CURRENT_USER,
      checkedInBy: null,
      alteration: alterationFor(payload.version || "v1.0"),
      notes: "Just uploaded — awaiting extraction.",
      commentCount: 0,
    };
    store.set((s) => ({ drafts: [draft, ...s.drafts], loading: false }));
    toast("Draft created from upload");
    return draft;
  };

  // Rule 1 — one open draft per station + document type.
  const createRevision = async (stationId, documentType, baseline) => {
    const existing = S().drafts.find(
      (d) => d.station.id === stationId && d.documentType === documentType &&
             (d.status === "DRAFT" || d.status === "IN_APPROVAL")
    );
    if (existing) {
      toast(
        `A ${documentType} draft for ${existing.station.name} is already open with ${existing.owner.name} since ${fmtDay(existing.createdAt)}. Ask them to hand it over, or wait until it is submitted.`,
        "danger"
      );
      return { blocked: true, existingOwner: existing.owner, since: existing.createdAt };
    }
    store.set({ loading: true });
    await sleep(600);
    const st = STATIONS.find((x) => x.id === stationId) || STATIONS[0];
    const draft = {
      id: uid("d"), station: st, documentType,
      draftVersion: "v1.0", parentVersion: baseline ? baseline.version : null, status: "DRAFT", stage: "EXTRACTED",
      sourceType: "REVISION_OF_APPROVED", sourceDocId: baseline ? baseline.id : `doc-${documentType.toLowerCase()}-${st.code.toLowerCase()}`,
      sourceDocVersion: baseline ? baseline.version : "v1", sourceDocStatus: baseline && baseline.status === "In Review" ? "IN_REVIEW" : "ACTIVE",
      owner: CURRENT_USER, createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(),
      violations: { ...noViolations }, extraction: { total: 0, mandatoryOpen: 0, reviewed: 0 },
      metadataComplete: true, advisories: [],
      checkedOutBy: CURRENT_USER, checkedInBy: CURRENT_USER, alteration: "Alt. 1",
      notes: baseline ? `New revision of ${baseline.drawingNumber} (${baseline.version}).` : "New revision of the approved document.", commentCount: 0,
    };
    store.set((s) => ({ drafts: [draft, ...s.drafts], loading: false }));
    toast(`Revision created for ${st.name}`);
    return draft;
  };

  const startExtraction = async (draftId) => {
    store.set({ busyId: draftId });
    patchDraft(draftId, { stage: "EXTRACTING", extraction: { total: 0, mandatoryOpen: 0, reviewed: 0 } });
    await sleep(2400);
    patchDraft(draftId, {
      stage: "NEEDS_REVIEW",
      extraction: { total: ASSETS_FIXTURE.length, mandatoryOpen: 12, reviewed: ASSETS_FIXTURE.length - 12 },
      modifiedAt: new Date().toISOString(),
    });
    store.set({ busyId: null });
    toast("Extraction finished — 12 items need review");
  };

  // Rule 2 — cannot complete extraction while mandatory items remain.
  const completeExtraction = async (draftId) => {
    const d = S().drafts.find((x) => x.id === draftId);
    if (!d) return;
    if (d.extraction && d.extraction.mandatoryOpen > 0) {
      toast(`${d.extraction.mandatoryOpen} mandatory items still need a decision. Confirm, correct or reject each one before completing.`, "danger");
      throw new Error("MANDATORY_OPEN");
    }
    store.set({ busyId: draftId });
    await sleep(600);
    patchDraft(draftId, { stage: "EXTRACTED", modifiedAt: new Date().toISOString() });
    store.set({ busyId: null });
    toast("Extraction complete");
  };

  const runSodCheck = async (draftId) => {
    store.set({ busyId: draftId });
    await sleep(900);
    const d = S().drafts.find((x) => x.id === draftId);
    const open = d ? d.violations.v1Open + d.violations.v2Open : 0;
    patchDraft(draftId, {
      stage: open > 0 ? "VALIDATION_FAILED" : "READY_FOR_SUBMISSION",
      violations: Object.assign({}, d.violations, { lastRunAt: new Date().toISOString() }),
      modifiedAt: new Date().toISOString(),
    });
    store.set({ busyId: null });
    toast(open > 0 ? `SOD check found ${open} open violations` : "SOD check passed — ready to submit", open > 0 ? "danger" : "success");
  };

  // Returns a list of blocking reasons, empty when the draft may be submitted.
  // Rules 3 and 4 live here so the checklist and the submit action always agree.
  const submitBlockers = (d) => {
    const out = [];
    if (!d) return ["Draft not found."];
    if (d.extraction && d.extraction.mandatoryOpen > 0)
      out.push(`${d.extraction.mandatoryOpen} extraction items still need review.`);
    const open = d.violations.v1Open + d.violations.v2Open;
    if (open > 0)
      out.push(`${d.violations.v1Open} V1 and ${d.violations.v2Open} V2 violations are still open.`);
    if (!d.metadataComplete)
      out.push("Station metadata is incomplete.");
    if (d.sourceType === "GENERATED_FROM_UPSTREAM" && d.sourceDocStatus !== "ACTIVE")
      out.push(`Source ${d.documentType === "SIP" ? "ESP" : "document"} ${d.sourceDocVersion} is ${String(d.sourceDocStatus || "missing").toLowerCase()}, not active.`);
    return out;
  };

  const submitForApproval = async (draftId, options = {}) => {
    const d = S().drafts.find((x) => x.id === draftId);
    const blockers = submitBlockers(d);
    if (blockers.length) {
      toast(blockers[0], "danger");
      throw new Error("SUBMIT_BLOCKED");
    }
    store.set({ busyId: draftId });
    await sleep(700);
    const labels = chainFor(d.documentType, options.route);
    const item = {
      id: uid("s"),
      station: d.station,
      documentType: d.documentType,
      version: d.draftVersion,
      stage: d.documentType === "SIP" && options.route === "PROVISIONAL" ? "PROVISIONAL_COMMENTS_OPEN" : "UNDER_INTERNAL_CHECK",
      legend: options.legend || `${d.documentType} — ${d.station.name}`,
      submittedBy: CURRENT_USER,
      submittedAt: new Date().toISOString(),
      chain: labels.map((label, i) => ({
        order: i, label, actor: i === 0 ? CURRENT_USER : null,
        state: i === 0 ? "CURRENT" : "PENDING", actedAt: null, action: null,
      })),
      commentWindow: options.route === "PROVISIONAL"
        ? { open: true, closesAt: new Date(Date.now() + 7 * 86400000).toISOString(), commentCount: 0, departmentsResponded: 0 }
        : null,
      awaitingCurrentUser: false,
      advisories: [],
      note: options.note || "",
      originDraft: d,
    };
    store.set((s) => ({
      drafts: s.drafts.filter((x) => x.id !== draftId),
      sharedItems: [item, ...s.sharedItems],
      busyId: null,
    }));
    toast("Submitted for approval");
    return item;
  };

  // Rule 5 — recall only while no stage has acted.
  const recallSubmission = async (itemId) => {
    const it = S().sharedItems.find((x) => x.id === itemId);
    if (!it) return;
    const acted = it.chain.some((c) => c.state === "COMPLETE" || c.state === "REJECTED");
    if (acted) {
      const who = it.chain.find((c) => c.state === "COMPLETE");
      toast(`Cannot recall — ${who ? who.label : "an approver"} has already acted on this submission.`, "danger");
      throw new Error("RECALL_BLOCKED");
    }
    store.set({ busyId: itemId });
    await sleep(600);
    const draft = it.originDraft
      ? Object.assign({}, it.originDraft, { stage: "READY_FOR_SUBMISSION", status: "DRAFT", modifiedAt: new Date().toISOString(), checkedOutBy: null, checkedInBy: CURRENT_USER, notes: "Recalled from approval." })
      : {
          id: uid("d"), station: it.station, documentType: it.documentType,
          draftVersion: it.version, parentVersion: null, status: "DRAFT", stage: "READY_FOR_SUBMISSION",
          sourceType: "UPLOADED", sourceDocId: null, sourceDocVersion: null, sourceDocStatus: null,
          owner: CURRENT_USER, createdAt: it.submittedAt, modifiedAt: new Date().toISOString(),
          violations: { ...noViolations }, extraction: null, metadataComplete: true, advisories: [],
          checkedOutBy: null, checkedInBy: CURRENT_USER, alteration: alterationFor(it.version), notes: "Recalled from approval.", commentCount: 0,
        };
    store.set((s) => ({
      sharedItems: s.sharedItems.filter((x) => x.id !== itemId),
      drafts: [draft, ...s.drafts],
      busyId: null,
    }));
    toast("Submission recalled");
  };

  const approveStage = async (itemId) => {
    const it = S().sharedItems.find((x) => x.id === itemId);
    if (!it) return;
    store.set({ busyId: itemId });
    await sleep(700);
    const idx = it.chain.findIndex((c) => c.state === "CURRENT");
    if (idx === -1) { store.set({ busyId: null }); return; }
    const isFinal = idx === it.chain.length - 1;
    const chain = it.chain.map((c, i) => {
      if (i === idx) return Object.assign({}, c, { state: "COMPLETE", actor: c.actor || CURRENT_USER, actedAt: new Date().toISOString(), action: isFinal ? "SIGNED" : "APPROVED" });
      if (i === idx + 1) return Object.assign({}, c, { state: "CURRENT" });
      return c;
    });
    if (isFinal) {
      store.set((s) => ({ sharedItems: s.sharedItems.filter((x) => x.id !== itemId), busyId: null }));
      toast(`${it.documentType} ${it.version} for ${it.station.name} approved and promoted`);
      return;
    }
    patchShared(itemId, { chain, awaitingCurrentUser: false, stage: "UNDER_SIGNATURE" });
    store.set({ busyId: null });
    toast("Stage approved");
  };

  const rejectStage = async (itemId, reason) => {
    const it = S().sharedItems.find((x) => x.id === itemId);
    if (!it) return;
    store.set({ busyId: itemId });
    await sleep(700);
    const idx = Math.max(0, it.chain.findIndex((c) => c.state === "CURRENT"));
    const itemComments = S().comments.filter((c) => c.docId === itemId);
    const draft = Object.assign({}, it.originDraft || {}, {
      id: uid("d"),
      station: it.station,
      documentType: it.documentType,
      draftVersion: it.version,
      parentVersion: null,
      status: "DRAFT",
      stage: "REJECTED",
      sourceType: (it.originDraft && it.originDraft.sourceType) || "UPLOADED",
      sourceDocId: null, sourceDocVersion: null, sourceDocStatus: null,
      owner: CURRENT_USER,
      createdAt: it.submittedAt,
      modifiedAt: new Date().toISOString(),
      violations: (it.originDraft && it.originDraft.violations) || { ...noViolations },
      extraction: (it.originDraft && it.originDraft.extraction) || null,
      metadataComplete: true,
      advisories: [],
      rejectionReason: reason,
      rejectedBy: it.chain[idx] ? it.chain[idx].label : "Approver",
      commentCount: itemComments.length,
      returnedComments: itemComments,
      checkedOutBy: CURRENT_USER,
      checkedInBy: it.chain[idx] ? it.chain[idx].actor : null,
      alteration: (it.originDraft && it.originDraft.alteration) || alterationFor(it.version),
      notes: `Returned: ${reason}`,
    });
    store.set((s) => ({
      sharedItems: s.sharedItems.filter((x) => x.id !== itemId),
      drafts: [draft, ...s.drafts],
      busyId: null,
    }));
    toast("Returned to the preparer with comments", "danger");
  };

  const transferOwnership = async (draftId, userId) => {
    const user = Object.values(USERS).find((u) => u.id === userId);
    if (!user) return;
    store.set({ busyId: draftId });
    await sleep(600);
    patchDraft(draftId, { owner: user, modifiedAt: new Date().toISOString() });
    store.set({ busyId: null });
    toast(`Ownership transferred to ${user.name}`);
  };

  // Rule 6 — delete only a DRAFT.
  const deleteDraft = async (draftId) => {
    const d = S().drafts.find((x) => x.id === draftId);
    if (!d) return;
    if (d.status !== "DRAFT") {
      toast("Only drafts can be deleted. This document is already in approval.", "danger");
      throw new Error("DELETE_BLOCKED");
    }
    store.set({ busyId: draftId });
    await sleep(500);
    store.set((s) => ({ drafts: s.drafts.filter((x) => x.id !== draftId), busyId: null }));
    toast("Draft deleted");
  };

  const addComment = (docId, text, severity, anchor) => {
    const c = {
      id: uid("c"), docId, authorId: CURRENT_USER.id, authorName: CURRENT_USER.name,
      authorDesignation: CURRENT_USER.designation, department: CURRENT_USER.department,
      text, anchor: anchor || null, severity: severity || "INFO", state: "OPEN",
      createdAt: new Date().toISOString(), parentId: null, attachments: [],
    };
    store.set((s) => ({ comments: [...s.comments, c] }));
    patchShared(docId, (it) => ({
      commentWindow: it.commentWindow
        ? Object.assign({}, it.commentWindow, { commentCount: it.commentWindow.commentCount + 1 })
        : it.commentWindow,
    }));
    toast("Comment added");
    return c;
  };

  const setCommentState = (commentId, state) => {
    store.set((s) => ({ comments: s.comments.map((c) => (c.id === commentId ? Object.assign({}, c, { state }) : c)) }));
  };

  /* ═══════════════════════ Selectors ═══════════════════════ */

  const useStore = () => useSyncExternalStore(store.subscribe, store.getState, store.getState);

  const matchesFilters = (row, f, q) => {
    if (f.stationId && row.station.id !== f.stationId) return false;
    if (f.documentType && row.documentType !== f.documentType) return false;
    if (f.stage && row.stage !== f.stage) return false;
    if (f.sourceType && row.sourceType !== f.sourceType) return false;
    if (f.ownerId && (row.owner || row.submittedBy).id !== f.ownerId) return false;
    const when = row.modifiedAt || row.submittedAt;
    if (f.dateFrom && when && when < f.dateFrom) return false;
    if (f.dateTo && when && when > `${f.dateTo}T23:59:59`) return false;
    if (q) {
      const hay = `${row.station.name} ${row.station.code} ${row.documentType} ${row.draftVersion || row.version} ${stageLabel(row.stage)}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  };

  const sortRows = (rows, sortBy) => {
    const out = rows.slice();
    const at = (r) => new Date(r.modifiedAt || r.submittedAt).getTime();
    if (sortBy === "MODIFIED_ASC") out.sort((a, b) => at(a) - at(b));
    else if (sortBy === "STATION") out.sort((a, b) => a.station.name.localeCompare(b.station.name));
    else if (sortBy === "STAGE") out.sort((a, b) => stageLabel(a.stage).localeCompare(stageLabel(b.stage)));
    else out.sort((a, b) => at(b) - at(a));
    return out;
  };

  const useFilteredDrafts = (s) => useMemo(
    () => sortRows(s.drafts.filter((d) => matchesFilters(d, s.filters.MY_FILES, s.search.MY_FILES)), s.sortBy.MY_FILES),
    [s.drafts, s.filters.MY_FILES, s.search.MY_FILES, s.sortBy.MY_FILES]
  );

  const useFilteredSharedItems = (s) => useMemo(
    () => sortRows(s.sharedItems.filter((it) => matchesFilters(it, s.filters.SHARED, s.search.SHARED)), s.sortBy.SHARED),
    [s.sharedItems, s.filters.SHARED, s.search.SHARED, s.sortBy.SHARED]
  );

  const myFilesKpis = (drafts) => ({
    inProgress: drafts.filter((d) => ["UPLOADED", "EXTRACTING", "EXTRACTED", "IN_EDITING"].includes(d.stage)).length,
    needsReview: drafts.filter((d) => d.stage === "NEEDS_REVIEW").length,
    validationFailed: drafts.filter((d) => d.stage === "VALIDATION_FAILED").length,
    readyToSubmit: drafts.filter((d) => d.stage === "READY_FOR_SUBMISSION").length,
  });

  const sharedKpis = (items) => ({
    awaitingYourAction: items.filter((it) => it.awaitingCurrentUser).length,
    commentsOpen: items.filter((it) => it.commentWindow && it.commentWindow.open).length,
    underSignature: items.filter((it) => it.stage === "UNDER_SIGNATURE").length,
    returned: items.filter((it) => it.stage === "REJECTED").length,
  });

  // Sidebar badge counts — Shared counts only what awaits the current user.
  const useWorkspaceCounts = () => {
    const s = useStore();
    return useMemo(() => ({
      myFiles: s.drafts.length,
      shared: s.sharedItems.filter((it) => it.awaitingCurrentUser).length,
    }), [s.drafts, s.sharedItems]);
  };

  /* ═══════════════════════ Small shared components ═══════════════════════ */

  const StageBadge = ({ stage }) => {
    const cfg = STAGE_CONFIG[stage];
    if (!cfg) return null;
    return <Chip tone={cfg.tone} dot>{cfg.label}</Chip>;
  };

  const DocTypeChip = ({ type }) => {
    const cfg = DOC_TYPE_CONFIG[type] || DOC_TYPE_CONFIG.ESP;
    return (
      <span className="wm-type-chip" style={{ background: cfg.tint, color: cfg.ink }}>
        {cfg.label}
      </span>
    );
  };

  const ViolationSummary = ({ violations, compact }) => {
    const open = violations.v1Open + violations.v2Open;
    if (open === 0 && !violations.corrected && !violations.justified) {
      return <span className="wm-viol wm-viol-clean"><Icon name="check_circle" size={13} />No open violations</span>;
    }
    return (
      <div className="wm-viol-row">
        {open > 0 ? (
          <span className="wm-viol wm-viol-open">
            <Icon name="alert_tri" size={13} />
            {violations.v1Open} V1 · {violations.v2Open} V2 open
          </span>
        ) : (
          <span className="wm-viol wm-viol-clean"><Icon name="check_circle" size={13} />All violations resolved</span>
        )}
        {!compact && (
          <span className="wm-viol-meta">
            {violations.corrected} corrected · {violations.justified} justified
            {violations.lastRunAt ? ` · Last run ${fmtShort(violations.lastRunAt)}` : ""}
          </span>
        )}
      </div>
    );
  };

  const ADVISORY_TONE = { INFO: "info", WARNING: "warning", BLOCKING: "danger" };

  const DependencyBanner = ({ advisories }) => {
    if (!advisories || !advisories.length) return null;
    return (
      <div className="wm-advisories">
        {advisories.map((a, i) => (
          <div key={i} className="wm-advisory" data-tone={ADVISORY_TONE[a.severity] || "info"}>
            <Icon name={a.severity === "BLOCKING" ? "lock" : "alert_tri"} size={14} />
            <span>{a.message}</span>
          </div>
        ))}
      </div>
    );
  };

  const KpiStrip = ({ items }) => (
    <div className="wm-kpis">
      {items.map((k) => (
        <KPICard key={k.label} label={k.label} icon={k.icon} value={k.value} meta={k.meta} variant={k.variant} />
      ))}
    </div>
  );

  /* ── Filters popover — every field filter lives in one place ── */

  // Human-readable summary of an active filter, for the chips under the toolbar.
  const filterChipLabel = (key, value) => {
    switch (key) {
      case "stationId": { const s = STATIONS.find((x) => x.id === value); return s ? `${s.name} (${s.code})` : value; }
      case "documentType": return (DOC_TYPE_CONFIG[value] || {}).label || value;
      case "stage": return stageLabel(value);
      case "sourceType": return SOURCE_TYPE_LABEL[value] || value;
      case "dateFrom": return `From ${fmtDay(value)}`;
      case "dateTo": return `To ${fmtDay(value)}`;
      default: return String(value);
    }
  };

  const FilterPopover = ({ tab, filters, stageOptions, onFilter, onClear, activeCount }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      if (!open) return;
      const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onEsc);
      return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
    }, [open]);

    return (
      <div className="wm-filter-pop-wrap" ref={ref}>
        <button
          className="wm-filter-btn"
          data-active={activeCount > 0 ? "true" : undefined}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Icon name="filter" size={15} />
          Filters
          {activeCount > 0 && <span className="wm-filter-badge">{activeCount}</span>}
        </button>

        {open && (
          <div className="wm-filter-pop" role="dialog" aria-label="Filters">
            <div className="wm-filter-pop-head">
              <span>Filters</span>
              {activeCount > 0 && <button className="wm-linkbtn" onClick={onClear}>Clear all</button>}
            </div>
            <div className="wm-filter-pop-grid">
              <Field label="Station">
                <Select value={filters.stationId || ""} onChange={(e) => onFilter("stationId", e.target.value)}>
                  <option value="">All stations</option>
                  {STATIONS.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </Select>
              </Field>
              <Field label="Type">
                <Select value={filters.documentType || ""} onChange={(e) => onFilter("documentType", e.target.value)}>
                  <option value="">All types</option>
                  {Object.keys(DOC_TYPE_CONFIG).map((t) => <option key={t} value={t}>{DOC_TYPE_CONFIG[t].label}</option>)}
                </Select>
              </Field>
              <Field label="State">
                <Select value={filters.stage || ""} onChange={(e) => onFilter("stage", e.target.value)}>
                  <option value="">All states</option>
                  {stageOptions.map((st) => <option key={st} value={st}>{stageLabel(st)}</option>)}
                </Select>
              </Field>
              {tab === "MY_FILES" && (
                <Field label="Source">
                  <Select value={filters.sourceType || ""} onChange={(e) => onFilter("sourceType", e.target.value)}>
                    <option value="">All sources</option>
                    {Object.keys(SOURCE_TYPE_LABEL).map((k) => <option key={k} value={k}>{SOURCE_TYPE_LABEL[k]}</option>)}
                  </Select>
                </Field>
              )}
              <Field label="Modified from">
                <TextInput type="date" value={filters.dateFrom || ""} onChange={(e) => onFilter("dateFrom", e.target.value)} />
              </Field>
              <Field label="Modified to">
                <TextInput type="date" value={filters.dateTo || ""} onChange={(e) => onFilter("dateTo", e.target.value)} />
              </Field>
            </div>
            <div className="wm-filter-pop-foot">
              <Btn size="sm" variant="secondary" onClick={() => setOpen(false)}>Done</Btn>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── Filter bar — search + one Filters control + sort + view ── */

  const FilterBar = ({ tab, filters, search, sortBy, viewMode, stageOptions, onFilter, onSearch, onSort, onView, onClear }) => {
    const activeFilters = Object.entries(filters).filter(([, v]) => Boolean(v));
    const filterCount = activeFilters.length;
    return (
      <div className="wm-filterbar">
        <div className="wm-filter-row">
          <div className="wm-search">
            <Icon name="search" size={15} />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={tab === "MY_FILES" ? "Search your files" : "Search shared items"}
              aria-label="Search"
            />
            {search && (
              <button className="wm-search-x" onClick={() => onSearch("")} aria-label="Clear search">
                <Icon name="x" size={13} />
              </button>
            )}
          </div>

          <FilterPopover
            tab={tab}
            filters={filters}
            stageOptions={stageOptions}
            onFilter={onFilter}
            onClear={onClear}
            activeCount={filterCount}
          />

          <div className="wm-filter-spacer" />

          <Select value={sortBy} onChange={(e) => onSort(e.target.value)} aria-label="Sort by">
            <option value="MODIFIED_DESC">Newest first</option>
            <option value="MODIFIED_ASC">Oldest first</option>
            <option value="STATION">Station</option>
            <option value="STAGE">State</option>
          </Select>

          <div className="wm-viewtoggle" role="group" aria-label="View mode">
            <button data-active={viewMode === "CARD"} onClick={() => onView("CARD")} aria-label="Card view" title="Card view">
              <Icon name="layers" size={15} />
            </button>
            <button data-active={viewMode === "TABLE"} onClick={() => onView("TABLE")} aria-label="Table view" title="Table view">
              <Icon name="grip" size={15} />
            </button>
          </div>
        </div>

        {(filterCount > 0 || search) && (
          <div className="wm-filter-active">
            {activeFilters.map(([key, value]) => (
              <span key={key} className="wm-fchip">
                {filterChipLabel(key, value)}
                <button onClick={() => onFilter(key, null)} aria-label={`Remove ${filterChipLabel(key, value)} filter`}>
                  <Icon name="x" size={11} />
                </button>
              </span>
            ))}
            <button className="wm-linkbtn" onClick={onClear}>Clear all</button>
          </div>
        )}
      </div>
    );
  };

  /* ── Row action menu ── */

  const ActionMenu = ({ items }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      if (!open) return;
      const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onEsc);
      return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onEsc); };
    }, [open]);
    const usable = items.filter(Boolean);
    if (!usable.length) return null;
    return (
      <div className="wm-menu-wrap" ref={ref}>
        <button className="wm-icon-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="More actions">
          <Icon name="more" size={16} />
        </button>
        {open && (
          <div className="wm-menu" role="menu">
            {usable.map((it) => (
              <button
                key={it.label}
                role="menuitem"
                className="wm-menu-item"
                data-danger={it.danger ? "true" : undefined}
                disabled={it.disabled}
                title={it.disabledReason}
                onClick={() => { setOpen(false); it.onClick(); }}
              >
                {it.icon && <Icon name={it.icon} size={14} />}
                {it.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════════════ Draft card ═══════════════════════ */

  const DraftCard = ({ draft, busy, onIntent, onViewLayout, onMenuAction }) => {
    const cfg = STAGE_CONFIG[draft.stage] || {};
    const primary = cfg.primaryAction;
    const blocking = (draft.advisories || []).some((a) => a.severity === "BLOCKING");
    const primaryDisabled = Boolean(primary && primary.disabled) || blocking || busy;

    return (
      <article className="wm-card">
        <header className="wm-card-head">
          <DocTypeChip type={draft.documentType} />
          <h3 className="wm-card-title">
            {draft.station.name} <span className="wm-card-code">({draft.station.code})</span>
          </h3>
          <div className="wm-card-head-right"><StageBadge stage={draft.stage} /></div>
        </header>

        <div className="wm-card-sub muted">
          {draft.station.zone} · {draft.station.division} · {draft.station.section}
        </div>

        <div className="wm-card-body">
          <div className="wm-card-version">
            <strong>{draft.documentType} {draft.draftVersion}</strong>
            {draft.parentVersion && <span className="muted"> · parent {draft.parentVersion} active</span>}
          </div>

          {draft.stage === "EXTRACTING" ? (
            <ExtractionInlineProgress />
          ) : draft.extraction && draft.extraction.mandatoryOpen > 0 ? (
            <div className="wm-viol-row">
              <span className="wm-viol wm-viol-open">
                <Icon name="alert_tri" size={13} />
                {draft.extraction.mandatoryOpen} of {draft.extraction.total} items need review
              </span>
            </div>
          ) : (
            <ViolationSummary violations={draft.violations} />
          )}

          {draft.stage === "REJECTED" && draft.rejectionReason && (
            <div className="wm-reject-note">
              <Icon name="alert" size={13} />
              <span>
                <strong>Returned{draft.rejectedBy ? ` by ${draft.rejectedBy}` : ""}:</strong> {draft.rejectionReason}
              </span>
            </div>
          )}

          <div className="wm-card-meta muted">
            <div>{SOURCE_TYPE_LABEL[draft.sourceType]}{draft.sourceDocVersion ? ` ${draft.documentType === "SIP" ? "ESP" : ""} ${draft.sourceDocVersion}` : ""}</div>
            <div>Modified {fmtDateTime(draft.modifiedAt)} by {draft.owner.name}</div>
          </div>

          <DependencyBanner advisories={draft.advisories} />
        </div>

        <footer className="wm-card-foot">
          {primary && (
            <Btn
              variant="primary"
              size="sm"
              disabled={primaryDisabled}
              loading={busy}
              title={blocking ? "Blocked by a dependency on this draft" : undefined}
              onClick={() => onIntent(primary.intent, draft)}
            >
              {primary.label}
            </Btn>
          )}
          {/* Always available, every stage — read-only peek without finishing review. */}
          <Btn variant="secondary" size="sm" onClick={() => onViewLayout(draft)}>View layout</Btn>
          <div className="wm-card-foot-spacer" />
          <ActionMenu
            items={[
              { label: "Run SOD check", icon: "shield", onClick: () => onMenuAction("SOD", draft) },
              { label: "Compare versions", icon: "layers", onClick: () => onMenuAction("COMPARE", draft) },
              { label: "Transfer ownership", icon: "users", onClick: () => onMenuAction("TRANSFER", draft) },
              {
                label: "Delete draft", icon: "trash", danger: true,
                disabled: draft.status !== "DRAFT",
                disabledReason: draft.status !== "DRAFT" ? "Only drafts can be deleted" : undefined,
                onClick: () => onMenuAction("DELETE", draft),
              },
            ]}
          />
        </footer>
      </article>
    );
  };

  const ExtractionInlineProgress = () => (
    <div className="wm-inline-prog">
      <div className="wm-inline-prog-bar"><div className="wm-inline-prog-fill" /></div>
      <span className="muted">Extracting assets…</span>
    </div>
  );

  /* ═══════════════════════ File details modal ═══════════════════════ */

  const DetailRow = ({ label, children }) => (
    <div className="wm-detail-row">
      <dt className="wm-detail-label">{label}</dt>
      <dd className="wm-detail-value">{children}</dd>
    </div>
  );

  const FileDetailsModal = ({ draft, onClose, onIntent, onViewLayout, onMenuAction }) => {
    if (!draft) return null;
    const cfg = STAGE_CONFIG[draft.stage] || {};
    const primary = cfg.primaryAction;
    const blocking = (draft.advisories || []).some((a) => a.severity === "BLOCKING");
    const act = (fn) => { onClose(); fn(); };
    return (
      <Modal
        open={Boolean(draft)}
        onClose={onClose}
        icon="file"
        iconTone="info"
        title={draftFileName(draft)}
        subtitle={`${draft.station.name} (${draft.station.code}) · ${draft.station.section}`}
        size="lg"
        footer={
          <div className="wm-modal-foot">
            <div className="wm-modal-foot-msg" />
            <Btn variant="ghost" onClick={onClose}>Close</Btn>
            <Btn variant="secondary" onClick={() => act(() => onViewLayout(draft))}>View layout</Btn>
            {primary && (
              <Btn
                variant="primary"
                disabled={Boolean(primary.disabled) || blocking}
                onClick={() => act(() => onIntent(primary.intent, draft))}
              >
                {primary.label}
              </Btn>
            )}
          </div>
        }
      >
        <dl className="wm-detail-grid">
          <DetailRow label="File name">{draftFileName(draft)}</DetailRow>
          <DetailRow label="Document type"><DocTypeChip type={draft.documentType} /></DetailRow>
          <DetailRow label="Version">{draft.draftVersion}{draft.parentVersion ? ` · parent ${draft.parentVersion}` : ""}</DetailRow>
          <DetailRow label="Alteration">{draft.alteration || "—"}</DetailRow>
          <DetailRow label="State"><StageBadge stage={draft.stage} /></DetailRow>
          <DetailRow label="Source">{SOURCE_TYPE_LABEL[draft.sourceType]}{draft.sourceDocVersion ? ` ${draft.sourceDocVersion}` : ""}</DetailRow>
          <DetailRow label="Checked out by">{draft.checkedOutBy ? draft.checkedOutBy.name : "Checked in"}</DetailRow>
          <DetailRow label="Checked in by">{draft.checkedInBy ? draft.checkedInBy.name : "—"}</DetailRow>
          <DetailRow label="Owner">{draft.owner.name} · {draft.owner.designation}</DetailRow>
          <DetailRow label="Created">{fmtDateTime(draft.createdAt)}</DetailRow>
          <DetailRow label="Modified">{fmtDateTime(draft.modifiedAt)}</DetailRow>
          <DetailRow label="Comments">{draft.commentCount || 0}</DetailRow>
        </dl>

        <div className="wm-detail-block">
          <ViolationSummary violations={draft.violations} />
        </div>
        {draft.notes && <div className="wm-detail-block"><span className="wm-detail-label">Notes</span><p className="wm-detail-notes">{draft.notes}</p></div>}
        <DependencyBanner advisories={draft.advisories} />

        <div className="wm-detail-actions">
          <Btn size="sm" variant="secondary" leadingIcon="shield" onClick={() => act(() => onMenuAction("SOD", draft))}>Run SOD check</Btn>
          <Btn size="sm" variant="secondary" leadingIcon="users" onClick={() => act(() => onMenuAction("TRANSFER", draft))}>Transfer ownership</Btn>
          <Btn size="sm" variant="ghost" danger disabled={draft.status !== "DRAFT"} onClick={() => act(() => onMenuAction("DELETE", draft))}>Delete draft</Btn>
        </div>
      </Modal>
    );
  };

  /* ═══════════════════════ Draft table ═══════════════════════ */

  const CheckedByCell = ({ user, locked }) => {
    if (!user) return <span className="muted">—</span>;
    return (
      <span className="wm-checkcell">
        {locked && <Icon name="lock" size={12} />}
        {user.name}
      </span>
    );
  };

  const DraftTable = ({ drafts, busyId, onIntent, onViewLayout, onMenuAction }) => {
    const [detailsDraft, setDetailsDraft] = useState(null);
    // Keep the open modal in step with the latest store data for that draft.
    const liveDetails = detailsDraft ? drafts.find((d) => d.id === detailsDraft.id) || detailsDraft : null;
    return (
      <div className="wm-table-wrap">
        <table className="ds-table wm-table">
          <thead>
            <tr>
              <th>File name</th>
              <th>Version</th>
              <th>Checked out by</th>
              <th>Checked in by</th>
              <th>State</th>
              <th>Alteration</th>
              <th>Comments</th>
              <th>Notes</th>
              <th style={{ textAlign: "right" }}>File details</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((d) => (
              <tr key={d.id}>
                <td>
                  <button className="wm-filename" onClick={() => setDetailsDraft(d)} title="Open file details">
                    <DocTypeChip type={d.documentType} />
                    <span className="wm-filename-text">{draftFileName(d)}</span>
                  </button>
                  <div className="muted wm-td-sub">{d.station.name} · {d.station.section}</div>
                </td>
                <td className="tabular">{d.draftVersion}</td>
                <td><CheckedByCell user={d.checkedOutBy} locked /></td>
                <td><CheckedByCell user={d.checkedInBy} /></td>
                <td><StageBadge stage={d.stage} /></td>
                <td className="tabular">{d.alteration || "—"}</td>
                <td className="tabular">
                  {d.commentCount > 0
                    ? <span className="wm-comment-count"><Icon name="flag" size={12} />{d.commentCount}</span>
                    : <span className="muted">—</span>}
                </td>
                <td>
                  {d.notes
                    ? <span className="wm-notes" title={d.notes}>{d.notes}</span>
                    : <span className="muted">—</span>}
                </td>
                <td>
                  <div className="wm-td-actions">
                    <Btn size="sm" variant="secondary" leadingIcon="info" onClick={() => setDetailsDraft(d)}>Details</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <FileDetailsModal
          draft={liveDetails}
          onClose={() => setDetailsDraft(null)}
          onIntent={onIntent}
          onViewLayout={onViewLayout}
          onMenuAction={onMenuAction}
        />
      </div>
    );
  };

  /* ═══════════════════════ Upload flow ═══════════════════════ */

  const ACCEPTED_EXT = ["dxf", "dwg", "pdf", "las", "laz"];

  // Per-file validation. Every rejection states what happened and what to do.
  const validateFile = (file) => {
    const name = file.name || "";
    const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
    if (!ext || !ACCEPTED_EXT.includes(ext)) {
      return {
        ok: false,
        reason: `Unsupported file type “.${ext || "none"}” — this format cannot be read. Upload a DXF, DWG, PDF, LAS or LAZ file instead.`,
      };
    }
    if (file.size === 0) {
      return { ok: false, reason: "File is empty — nothing to read. Replace the file or upload a different format." };
    }
    if (file.size > 120 * 1024 * 1024) {
      return { ok: false, reason: `File is ${fmtBytes(file.size)}, over the 120 MB limit. Split the drawing or upload a compressed LAZ.` };
    }
    // Simulated integrity check — a file whose name marks it corrupt fails to parse.
    if (/corrupt|damaged/i.test(name)) {
      return { ok: false, reason: "File corrupt — cannot read entity table. Replace the file or upload a different format." };
    }
    return { ok: true, reason: null };
  };

  const UPLOAD_STEPS = [
    { id: 0, label: "Context" },
    { id: 1, label: "Files" },
    { id: 2, label: "Validation" },
    { id: 3, label: "Metadata" },
  ];

  const StepContext = ({ form, setForm }) => (
    <div className="wm-form-grid">
      <Field label="Station" required help="Determines which layout the extraction is matched against.">
        <Select value={form.stationId} onChange={(e) => setForm({ stationId: e.target.value })}>
          <option value="">Select a station</option>
          {STATIONS.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
        </Select>
      </Field>
      <Field label="Document type" required>
        <Select value={form.documentType} onChange={(e) => setForm({ documentType: e.target.value })}>
          {Object.keys(DOC_TYPE_CONFIG).map((t) => <option key={t} value={t}>{DOC_TYPE_CONFIG[t].label}</option>)}
        </Select>
      </Field>
      <Field label="Version" required>
        <TextInput value={form.version} onChange={(e) => setForm({ version: e.target.value })} placeholder="v1.0" />
      </Field>
      <Field label="Survey date" optional>
        <TextInput type="date" value={form.surveyDate} onChange={(e) => setForm({ surveyDate: e.target.value })} />
      </Field>
      <div className="wm-form-full">
        <Field label="Purpose" optional help="Shown to reviewers alongside the drawing.">
          <Textarea
            value={form.purpose}
            onChange={(e) => setForm({ purpose: e.target.value })}
            placeholder="Doubling works between Guntur and Tenali"
            rows={3}
          />
        </Field>
      </div>
    </div>
  );

  const StepFiles = ({ form, setForm }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const addFiles = (list) => {
      const incoming = Array.from(list).map((f) => ({
        name: f.name,
        size: f.size,
        // Validation runs immediately so the reason is visible before Next.
        validation: validateFile(f),
      }));
      setForm({ files: [...form.files, ...incoming] });
    };

    // Fixture shortcut so the flow is demonstrable without a real file picker.
    const addSample = (name, size) => {
      setForm({ files: [...form.files, { name, size, validation: validateFile({ name, size }) }] });
    };

    return (
      <div>
        <div
          className="wm-drop"
          data-dragging={dragging}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current && inputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current && inputRef.current.click(); } }}
        >
          <Icon name="upload" size={22} />
          <div className="wm-drop-title">Drop drawings here or browse</div>
          <div className="muted">DXF, DWG, PDF, LAS or LAZ · up to 120 MB each</div>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
        </div>

        <div className="wm-sample-row">
          <span className="muted">Add a sample:</span>
          <button className="wm-linkbtn" onClick={() => addSample("PTPD-esp-survey.dxf", 4_200_000)}>valid DXF</button>
          <button className="wm-linkbtn" onClick={() => addSample("lidar-scan.xyz", 8_100_000)}>unsupported .xyz</button>
          <button className="wm-linkbtn" onClick={() => addSample("corrupt-entities.dwg", 2_000_000)}>corrupt DWG</button>
        </div>

        <div className="wm-filelist">
          {form.files.length === 0 && <div className="muted wm-filelist-empty">No files added yet.</div>}
          {form.files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="wm-file" data-ok={f.validation.ok}>
              <Icon name={f.validation.ok ? "file" : "alert"} size={16} />
              <div className="wm-file-main">
                <div className="wm-file-name">{f.name}</div>
                <div className="wm-file-meta muted">{fmtBytes(f.size)}</div>
                {!f.validation.ok && <div className="wm-file-error">{f.validation.reason}</div>}
              </div>
              <button
                className="wm-icon-btn"
                aria-label={`Remove ${f.name}`}
                onClick={() => setForm({ files: form.files.filter((_, j) => j !== i) })}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StepValidation = ({ form }) => {
    const ok = form.files.filter((f) => f.validation.ok);
    const bad = form.files.filter((f) => !f.validation.ok);
    return (
      <div className="wm-validation">
        <div className="wm-validation-summary">
          <span className="wm-viol wm-viol-clean"><Icon name="check_circle" size={14} />{ok.length} file{ok.length === 1 ? "" : "s"} ready</span>
          {bad.length > 0 && <span className="wm-viol wm-viol-open"><Icon name="alert_tri" size={14} />{bad.length} rejected</span>}
        </div>

        {bad.length > 0 && (
          <div className="wm-advisory" data-tone="danger">
            <Icon name="alert_tri" size={14} />
            <span>Rejected files are not uploaded. Remove them or replace them before continuing.</span>
          </div>
        )}

        <ul className="wm-checklist">
          {ok.map((f, i) => (
            <li key={i} className="wm-check-row" data-pass="true">
              <Icon name="check_circle" size={15} />
              <div>
                <div>{f.name}</div>
                <div className="muted">Readable · entity table parsed · {fmtBytes(f.size)}</div>
              </div>
            </li>
          ))}
          {bad.map((f, i) => (
            <li key={i} className="wm-check-row" data-pass="false">
              <Icon name="alert" size={15} />
              <div>
                <div>{f.name}</div>
                <div className="wm-file-error">{f.validation.reason}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const StepMetadata = ({ form, setForm }) => (
    <div className="wm-form-grid">
      <Field label="Class of station" required>
        <Select value={form.classOfStation} onChange={(e) => setForm({ classOfStation: e.target.value })}>
          <option value="">Select</option>
          {["A", "B", "C", "D", "E"].map((c) => <option key={c} value={c}>Class {c}</option>)}
        </Select>
      </Field>
      <Field label="Standard of interlocking" required>
        <Select value={form.standardOfInterlocking} onChange={(e) => setForm({ standardOfInterlocking: e.target.value })}>
          <option value="">Select</option>
          {["SEI", "PI", "RRI", "EI"].map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
      </Field>
      <Field label="Section" optional>
        <TextInput value={form.section} onChange={(e) => setForm({ section: e.target.value })} placeholder="Guntur–Tenali" />
      </Field>
      <Field label="Chainage from" optional>
        <TextInput value={form.chainage} onChange={(e) => setForm({ chainage: e.target.value })} placeholder="km 312.100" />
      </Field>
      <div className="wm-form-full">
        <Field label="Legend" optional help="Appears in the title block and in Shared Workspace.">
          <TextInput value={form.legend} onChange={(e) => setForm({ legend: e.target.value })} placeholder="Draft Engineering Scale Plan" />
        </Field>
      </div>
    </div>
  );

  const UploadModal = ({ open, onClose, onComplete }) => {
    const [step, setStep] = useState(0);
    const [busy, setBusy] = useState(false);
    const [form, setFormState] = useState({
      stationId: "", documentType: "ESP", version: "v1.0", surveyDate: "", purpose: "",
      files: [], classOfStation: "", standardOfInterlocking: "", section: "", chainage: "", legend: "",
    });
    const setForm = (patch) => setFormState((f) => Object.assign({}, f, patch));

    useEffect(() => {
      if (open) { setStep(0); setBusy(false); setFormState((f) => Object.assign({}, f, { files: [] })); }
    }, [open]);

    const goodFiles = form.files.filter((f) => f.validation.ok);
    const badFiles = form.files.filter((f) => !f.validation.ok);

    // Gating per step — Next is blocked with a visible reason.
    const blockedReason = (() => {
      if (step === 0) {
        if (!form.stationId) return "Select a station to continue.";
        if (!form.version.trim()) return "Enter a version to continue.";
        return null;
      }
      if (step === 1) {
        if (form.files.length === 0) return "Add at least one file to continue.";
        if (badFiles.length > 0) return `${badFiles.length} file${badFiles.length === 1 ? " is" : "s are"} rejected. Remove or replace ${badFiles.length === 1 ? "it" : "them"} to continue.`;
        return null;
      }
      if (step === 2) {
        if (goodFiles.length === 0) return "No readable files to upload.";
        return null;
      }
      if (!form.classOfStation) return "Select the class of station to finish.";
      if (!form.standardOfInterlocking) return "Select the standard of interlocking to finish.";
      return null;
    })();

    const finish = async () => {
      setBusy(true);
      const draft = await createDraftFromUpload({
        stationId: form.stationId,
        documentType: form.documentType,
        version: form.version,
        files: goodFiles,
        metadataComplete: Boolean(form.classOfStation && form.standardOfInterlocking),
      });
      setBusy(false);
      onComplete && onComplete(draft);
      onClose();
    };

    if (!open) return null;

    return (
      <Modal
        open={open}
        onClose={onClose}
        icon="upload"
        iconTone="info"
        title="Upload a drawing"
        subtitle="Four steps — context, files, validation, metadata."
        size="lg"
        footer={
          <div className="wm-modal-foot">
            <div className="wm-modal-foot-msg">
              {blockedReason && <span className="wm-file-error">{blockedReason}</span>}
            </div>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            {step > 0 && <Btn variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Btn>}
            {step < 3 ? (
              <Btn variant="primary" disabled={Boolean(blockedReason)} onClick={() => setStep((s) => s + 1)}>Next</Btn>
            ) : (
              <Btn variant="primary" loading={busy} disabled={Boolean(blockedReason)} onClick={finish}>Create draft</Btn>
            )}
          </div>
        }
      >
        <div className="wm-upload-steps">
          {UPLOAD_STEPS.map((s) => (
            <div key={s.id} className="wm-upload-step" data-state={s.id < step ? "done" : s.id === step ? "active" : "pending"}>
              <span className="wm-upload-step-dot">{s.id < step ? <Icon name="check" size={12} /> : s.id + 1}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="wm-upload-body">
          {step === 0 && <StepContext form={form} setForm={setForm} />}
          {step === 1 && <StepFiles form={form} setForm={setForm} />}
          {step === 2 && <StepValidation form={form} />}
          {step === 3 && <StepMetadata form={form} setForm={setForm} />}
        </div>
      </Modal>
    );
  };

  /* ═══════════════════════ Extraction review ═══════════════════════ */

  const ASSET_CATEGORIES = [
    { id: "TRACK",        label: "Tracks" },
    { id: "TURNOUT",      label: "Turnouts" },
    { id: "SIGNAL",       label: "Signals" },
    { id: "PLATFORM",     label: "Platforms" },
    { id: "BUILDING",     label: "Buildings" },
    { id: "FOULING_MARK", label: "Fouling marks" },
    { id: "GLUED_JOINT",  label: "Glued joints" },
    { id: "SEJ",          label: "SEJs" },
    { id: "DEAD_END",     label: "Dead ends" },
  ];

  const ASSET_TYPE_LABEL = ASSET_CATEGORIES.reduce((m, c) => { m[c.id] = c.label.replace(/s$/, ""); return m; }, {});

  // Confidence bands drive stroke treatment — one place, used by canvas and cards.
  const confidenceBand = (c) => (c >= 0.85 ? "high" : c >= 0.7 ? "medium" : "low");
  const BAND_STROKE = {
    high:   { stroke: "var(--ink-700)", dash: null,    tone: "success" },
    medium: { stroke: "var(--warning)", dash: "6 4",   tone: "warning" },
    low:    { stroke: "var(--danger)",  dash: "4 3",   tone: "danger" },
  };

  const EXTRACTION_PHASES = [
    "Reading source geometry",
    "Classifying track centrelines",
    "Detecting turnouts and crossings",
    "Locating signals and marks",
    "Cross-checking against station layout",
  ];

  const ExtractionProgress = ({ phase }) => (
    <div className="wm-extract-progress">
      <div className="wm-extract-phases">
        {EXTRACTION_PHASES.map((p, i) => (
          <div key={p} className="wm-extract-phase" data-state={i < phase ? "done" : i === phase ? "active" : "pending"}>
            <span className="wm-extract-phase-dot">
              {i < phase ? <Icon name="check" size={12} /> : i === phase ? <span className="wm-pulse-dot" /> : i + 1}
            </span>
            <span>{p}</span>
          </div>
        ))}
      </div>
      <div className="wm-progressbar"><div className="wm-progressbar-fill" style={{ width: `${(phase / EXTRACTION_PHASES.length) * 100}%` }} /></div>
    </div>
  );

  /* ── Canvas (SVG — this project has no Konva; SVG keeps it dependency-free) ── */

  const ExtractionCanvas = ({ assets, visible, selectedId, onSelect }) => {
    const shown = assets.filter((a) => visible[a.assetType] !== false);
    return (
      <div className="wm-canvas">
        <svg viewBox="0 0 920 480" className="wm-canvas-svg" role="img" aria-label="Extracted station layout">
          <defs>
            <pattern id="wm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--ink-100)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="920" height="480" fill="url(#wm-grid)" />

          {shown.map((a) => {
            const band = BAND_STROKE[confidenceBand(a.confidence)];
            const selected = selectedId === a.id;
            const reviewed = a.reviewState !== "PENDING";
            const stroke = a.isRedundantCandidate ? "var(--ink-400)" : reviewed ? "var(--success)" : band.stroke;
            const common = {
              stroke,
              strokeWidth: selected ? 4 : a.geometry === "LINE" ? 2.5 : 2,
              strokeDasharray: a.isRedundantCandidate ? "2 4" : reviewed ? null : band.dash,
              className: "wm-shape",
              tabIndex: 0,
              role: "button",
              "aria-label": `${ASSET_TYPE_LABEL[a.assetType] || a.assetType} ${a.label}, confidence ${Math.round(a.confidence * 100)} percent`,
              onClick: () => onSelect(a.id),
              onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(a.id); } },
            };

            if (a.geometry === "LINE") {
              return <polyline key={a.id} {...common} fill="none" points={pairs(a.points)} />;
            }
            if (a.geometry === "POLYGON") {
              return <polygon key={a.id} {...common} fill="var(--ink-50)" fillOpacity="0.7" points={pairs(a.points)} />;
            }
            return (
              <g key={a.id}>
                <circle {...common} cx={a.coordinates.x} cy={a.coordinates.y} r={selected ? 9 : 6} fill="var(--paper)" />
                {a.requiresReview && a.reviewState === "PENDING" && (
                  <circle cx={a.coordinates.x} cy={a.coordinates.y} r="13" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="3 3" className="wm-marker" />
                )}
              </g>
            );
          })}
        </svg>

        <div className="wm-canvas-legend">
          <span><i style={{ background: "var(--ink-700)" }} /> ≥ 85% confidence</span>
          <span><i style={{ background: "var(--warning)" }} /> 70–85%</span>
          <span><i style={{ background: "var(--danger)" }} /> below 70% — needs review</span>
          <span><i style={{ background: "var(--success)" }} /> reviewed</span>
        </div>
      </div>
    );
  };

  const pairs = (pts) => {
    const out = [];
    for (let i = 0; i < pts.length; i += 2) out.push(`${pts[i]},${pts[i + 1]}`);
    return out.join(" ");
  };

  /* ── Review cards ── */

  const AssetReviewCard = ({ asset, selected, onSelect, onAction, innerRef }) => {
    const band = confidenceBand(asset.confidence);
    return (
      <div
        ref={innerRef}
        className="wm-asset"
        data-selected={selected}
        data-state={asset.reviewState}
        onClick={() => onSelect(asset.id)}
      >
        <div className="wm-asset-head">
          <span className="wm-asset-type">{ASSET_TYPE_LABEL[asset.assetType] || asset.assetType}</span>
          <span className="wm-asset-label">{asset.label}</span>
          <Chip tone={BAND_STROKE[band].tone} size="sm">{Math.round(asset.confidence * 100)}%</Chip>
        </div>
        <div className="wm-asset-meta muted">
          {asset.chainage} · {asset.geometry.toLowerCase()} · source {asset.source.toLowerCase()}
          {asset.orientation != null ? ` · ${asset.orientation}°` : ""}
        </div>
        {asset.reviewState === "PENDING" ? (
          <div className="wm-asset-actions">
            <Btn size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); onAction(asset.id, "CONFIRMED"); }}>Confirm</Btn>
            <Btn size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onAction(asset.id, "CORRECTED"); }}>Correct</Btn>
            <Btn size="sm" variant="ghost" danger onClick={(e) => { e.stopPropagation(); onAction(asset.id, "REJECTED"); }}>Reject</Btn>
          </div>
        ) : (
          <div className="wm-asset-done">
            <Icon name="check_circle" size={13} />
            {asset.reviewState === "CONFIRMED" ? "Confirmed" : asset.reviewState === "CORRECTED" ? "Corrected" : "Rejected"}
            <button className="wm-linkbtn" onClick={(e) => { e.stopPropagation(); onAction(asset.id, "PENDING"); }}>Undo</button>
          </div>
        )}
      </div>
    );
  };

  const RedundantRailPanel = ({ assets, selectedId, onSelect, onAction }) => {
    if (!assets.length) return null;
    return (
      <section className="wm-panel-section">
        <h4 className="wm-panel-title">
          Redundant rail candidates
          <span className="wm-panel-count">{assets.length}</span>
        </h4>
        <p className="muted wm-panel-hint">
          Detected as released rails. Keep them if they are still in service, exclude them from the extraction otherwise.
        </p>
        {assets.map((a) => (
          <div key={a.id} className="wm-asset" data-selected={selectedId === a.id} data-state={a.reviewState} onClick={() => onSelect(a.id)}>
            <div className="wm-asset-head">
              <span className="wm-asset-type">Released rail</span>
              <span className="wm-asset-label">{a.label}</span>
              <Chip tone="neutral" size="sm">{Math.round(a.confidence * 100)}%</Chip>
            </div>
            <div className="wm-asset-meta muted">{a.chainage}</div>
            {a.reviewState === "PENDING" ? (
              <div className="wm-asset-actions">
                <Btn size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onAction(a.id, "CONFIRMED"); }}>Keep</Btn>
                <Btn size="sm" variant="ghost" danger onClick={(e) => { e.stopPropagation(); onAction(a.id, "REJECTED"); }}>Exclude</Btn>
              </div>
            ) : (
              <div className="wm-asset-done">
                <Icon name="check_circle" size={13} />
                {a.reviewState === "REJECTED" ? "Excluded" : "Kept"}
                <button className="wm-linkbtn" onClick={(e) => { e.stopPropagation(); onAction(a.id, "PENDING"); }}>Undo</button>
              </div>
            )}
          </div>
        ))}
      </section>
    );
  };

  const ReviewQueuePanel = ({ assets, selectedId, onSelect, onAction, cardRefs, onBulkConfirm }) => {
    const mandatory = assets.filter((a) => a.requiresReview && !a.isRedundantCandidate);
    const optional = assets.filter((a) => !a.requiresReview && !a.isRedundantCandidate);
    const bulkTargets = optional.filter((a) => a.reviewState === "PENDING" && a.confidence >= 0.85);

    return (
      <div className="wm-queue">
        <section className="wm-panel-section">
          <h4 className="wm-panel-title">
            Needs review
            <span className="wm-panel-count" data-tone="danger">{mandatory.filter((a) => a.reviewState === "PENDING").length}</span>
          </h4>
          {mandatory.length === 0 && <p className="muted wm-panel-hint">Nothing mandatory in this extraction.</p>}
          {mandatory.map((a) => (
            <AssetReviewCard
              key={a.id}
              asset={a}
              selected={selectedId === a.id}
              onSelect={onSelect}
              onAction={onAction}
              innerRef={(el) => { cardRefs.current[a.id] = el; }}
            />
          ))}
        </section>

        <RedundantRailPanel
          assets={assets.filter((a) => a.isRedundantCandidate)}
          selectedId={selectedId}
          onSelect={onSelect}
          onAction={onAction}
        />

        <section className="wm-panel-section">
          <h4 className="wm-panel-title">
            Other assets
            <span className="wm-panel-count">{optional.length}</span>
          </h4>
          {bulkTargets.length > 0 && (
            <Btn size="sm" variant="secondary" onClick={onBulkConfirm} style={{ marginBottom: 10 }}>
              Confirm all above 85% ({bulkTargets.length})
            </Btn>
          )}
          {optional.map((a) => (
            <AssetReviewCard
              key={a.id}
              asset={a}
              selected={selectedId === a.id}
              onSelect={onSelect}
              onAction={onAction}
              innerRef={(el) => { cardRefs.current[a.id] = el; }}
            />
          ))}
        </section>
      </div>
    );
  };

  const ExtractionReviewPage = ({ draft, onBack, onOpenEditor }) => {
    const [assets, setAssets] = useState(() =>
      ASSETS_FIXTURE.map((a) => Object.assign({}, a, {
        // Non-mandatory items start reviewed so the fixture matches draft #2:
        // 12 mandatory open out of 47+ total.
        reviewState: a.requiresReview || a.isRedundantCandidate ? "PENDING" : "CONFIRMED",
      }))
    );
    const [selectedId, setSelectedId] = useState(null);
    const [visible, setVisible] = useState(() =>
      ASSET_CATEGORIES.reduce((m, c) => { m[c.id] = true; return m; }, {})
    );
    const [phase, setPhase] = useState(draft.stage === "EXTRACTING" ? 0 : EXTRACTION_PHASES.length);
    const [busy, setBusy] = useState(false);
    const cardRefs = useRef({});
    const scrollRef = useRef(null);

    // Simulated extraction phases when arriving mid-extraction.
    useEffect(() => {
      if (draft.stage !== "EXTRACTING") return;
      let p = 0;
      const t = setInterval(() => {
        p += 1;
        setPhase(p);
        if (p >= EXTRACTION_PHASES.length) clearInterval(t);
      }, 700);
      return () => clearInterval(t);
    }, [draft.stage]);

    const mandatoryOpen = assets.filter((a) => a.requiresReview && !a.isRedundantCandidate && a.reviewState === "PENDING").length;
    const mandatoryTotal = assets.filter((a) => a.requiresReview && !a.isRedundantCandidate).length;
    const reviewedMandatory = mandatoryTotal - mandatoryOpen;

    // Canvas → panel sync. Selecting a shape scrolls its card into view.
    const select = useCallback((id) => {
      setSelectedId(id);
      const el = cardRefs.current[id];
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }, []);

    const act = (id, state) => {
      setAssets((prev) => prev.map((a) => (a.id === id ? Object.assign({}, a, { reviewState: state }) : a)));
      setSelectedId(id);
    };

    const bulkConfirm = () => {
      setAssets((prev) => prev.map((a) =>
        !a.requiresReview && !a.isRedundantCandidate && a.reviewState === "PENDING" && a.confidence >= 0.85
          ? Object.assign({}, a, { reviewState: "CONFIRMED" })
          : a
      ));
      toast("Confirmed all assets above 85% confidence");
    };

    // Keep the store in step so My Files reflects review progress.
    useEffect(() => {
      patchDraft(draft.id, { extraction: { total: assets.length, mandatoryOpen, reviewed: assets.length - mandatoryOpen } });
    }, [mandatoryOpen]);

    const complete = async () => {
      setBusy(true);
      try {
        await completeExtraction(draft.id);
        onBack();
      } catch (e) { /* store already surfaced the reason */ }
      setBusy(false);
    };

    const extracting = draft.stage === "EXTRACTING" && phase < EXTRACTION_PHASES.length;

    return (
      <div className="wm-review-page">
        <header className="wm-review-head">
          <button className="wm-backbtn" onClick={onBack}><Icon name="chevron_left" size={16} />My Files</button>
          <div>
            <h2 className="wm-review-title">{draft.station.name} ({draft.station.code}) — extraction review</h2>
            <div className="muted">{draft.documentType} {draft.draftVersion} · {draft.station.section}</div>
          </div>
          <div className="wm-review-head-right"><StageBadge stage={draft.stage} /></div>
        </header>

        {extracting ? (
          <div className="wm-extract-shell"><ExtractionProgress phase={phase} /></div>
        ) : (
          <div className="wm-review-split">
            <div className="wm-review-canvas">
              <div className="wm-layer-toggles">
                {ASSET_CATEGORIES.map((c) => {
                  const count = assets.filter((a) => a.assetType === c.id).length;
                  if (!count) return null;
                  return (
                    <label key={c.id} className="wm-layer-toggle">
                      <input
                        type="checkbox"
                        checked={visible[c.id] !== false}
                        onChange={(e) => setVisible((v) => Object.assign({}, v, { [c.id]: e.target.checked }))}
                      />
                      {c.label} <span className="muted">{count}</span>
                    </label>
                  );
                })}
              </div>
              <ExtractionCanvas assets={assets} visible={visible} selectedId={selectedId} onSelect={select} />
            </div>

            <aside className="wm-review-panel" ref={scrollRef}>
              <ReviewQueuePanel
                assets={assets}
                selectedId={selectedId}
                onSelect={select}
                onAction={act}
                cardRefs={cardRefs}
                onBulkConfirm={bulkConfirm}
              />
            </aside>
          </div>
        )}

        <footer className="wm-review-foot">
          <span className="tabular">
            {reviewedMandatory} of {mandatoryTotal} mandatory items reviewed
          </span>
          <div className="wm-review-foot-spacer" />
          <Btn variant="secondary" onClick={() => onOpenEditor(draft)}>Open editor</Btn>
          <Btn
            variant="primary"
            loading={busy}
            disabled={mandatoryOpen > 0 || extracting}
            title={mandatoryOpen > 0 ? `${mandatoryOpen} mandatory items still need a decision` : undefined}
            onClick={complete}
          >
            Complete extraction
          </Btn>
        </footer>
      </div>
    );
  };

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ═══════════════════════ Submission ═══════════════════════ */

  // The four checks mirror the store's submitBlockers so the checklist and the
  // Submit button can never disagree.
  const buildChecks = (d) => [
    {
      id: "extraction",
      label: "Extraction complete, no open mandatory items",
      pass: !d.extraction || d.extraction.mandatoryOpen === 0,
      detail: d.extraction && d.extraction.mandatoryOpen > 0
        ? `${d.extraction.mandatoryOpen} items still need a decision`
        : "All extracted assets reviewed",
      jump: "REVIEW_EXTRACTION",
      jumpLabel: "Go to extraction review",
    },
    {
      id: "violations",
      label: "All violations corrected or justified",
      pass: d.violations.v1Open + d.violations.v2Open === 0,
      detail: d.violations.v1Open + d.violations.v2Open > 0
        ? `${d.violations.v1Open} V1 and ${d.violations.v2Open} V2 still open`
        : `${d.violations.corrected} corrected · ${d.violations.justified} justified`,
      jump: "VIEW_VIOLATIONS",
      jumpLabel: "Go to violations",
    },
    {
      id: "metadata",
      label: "Station metadata complete",
      pass: Boolean(d.metadataComplete),
      detail: d.metadataComplete ? "Class and interlocking standard recorded" : "Class of station or interlocking standard missing",
      jump: "EDIT_METADATA",
      jumpLabel: "Go to metadata",
    },
    {
      id: "source",
      label: "Source document approved",
      pass: d.sourceType !== "GENERATED_FROM_UPSTREAM" || d.sourceDocStatus === "ACTIVE",
      detail: d.sourceType !== "GENERATED_FROM_UPSTREAM"
        ? "Not generated from an upstream document"
        : `Source ${d.documentType === "SIP" ? "ESP" : "document"} ${d.sourceDocVersion} is ${String(d.sourceDocStatus || "missing").toLowerCase()}`,
      jump: null,
    },
  ];

  const PreSubmitChecklist = ({ draft, onJump }) => {
    const checks = buildChecks(draft);
    return (
      <ul className="wm-checklist">
        {checks.map((c) => (
          <li key={c.id} className="wm-check-row" data-pass={c.pass ? "true" : "false"}>
            <Icon name={c.pass ? "check_circle" : "alert"} size={16} />
            <div className="wm-check-main">
              <div className="wm-check-label">{c.label}</div>
              <div className={c.pass ? "muted" : "wm-file-error"}>{c.detail}</div>
            </div>
            {!c.pass && c.jump && (
              <button className="wm-linkbtn" onClick={() => onJump(c.jump, draft)}>{c.jumpLabel}</button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const SubmitModal = ({ open, draft, onClose, onJump, onSubmitted }) => {
    const [route, setRoute] = useState("INTERNAL");
    const [note, setNote] = useState("");
    const [legend, setLegend] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
      if (open && draft) {
        setRoute("INTERNAL");
        setNote("");
        setLegend(`${draft.documentType} — ${draft.station.name}`);
      }
    }, [open, draft && draft.id]);

    if (!open || !draft) return null;

    const checks = buildChecks(draft);
    const failing = checks.filter((c) => !c.pass);
    const chain = chainFor(draft.documentType, route);

    const submit = async () => {
      setBusy(true);
      try {
        await submitForApproval(draft.id, { route, note, legend });
        onSubmitted();
        onClose();
      } catch (e) { /* store surfaced the reason */ }
      setBusy(false);
    };

    return (
      <Modal
        open={open}
        onClose={onClose}
        icon="upload"
        iconTone={failing.length ? "danger" : "success"}
        title="Submit for approval"
        subtitle={`${draft.documentType} ${draft.draftVersion} · ${draft.station.name} (${draft.station.code})`}
        size="lg"
        footer={
          <div className="wm-modal-foot">
            <div className="wm-modal-foot-msg">
              {failing.length > 0 && (
                <span className="wm-file-error">
                  {failing.length} check{failing.length === 1 ? "" : "s"} failing — resolve {failing.length === 1 ? "it" : "them"} before submitting.
                </span>
              )}
            </div>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" loading={busy} disabled={failing.length > 0} onClick={submit}>
              Submit for approval
            </Btn>
          </div>
        }
      >
        <section className="wm-submit-section">
          <h4 className="wm-panel-title">Pre-submission checks</h4>
          <PreSubmitChecklist draft={draft} onJump={onJump} />
        </section>

        {draft.documentType === "SIP" && (
          <section className="wm-submit-section">
            <h4 className="wm-panel-title">Approval route</h4>
            <div className="wm-route-choices">
              {[
                { id: "INTERNAL", label: "Internal check", desc: "Two-stage internal verification before circulation." },
                { id: "PROVISIONAL", label: "Provisional — open for comments", desc: "Circulates to other departments for a seven-day comment window." },
                { id: "APPROVAL", label: "Full approval", desc: "Five-stage chain ending with CSTE signature." },
              ].map((r) => (
                <label key={r.id} className="wm-route" data-selected={route === r.id}>
                  <input type="radio" name="wm-route" checked={route === r.id} onChange={() => setRoute(r.id)} />
                  <div>
                    <div className="wm-route-label">{r.label}</div>
                    <div className="muted">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="wm-submit-section">
          <h4 className="wm-panel-title">Approval chain</h4>
          <ApprovalChainStepper chain={chain.map((label, i) => ({
            order: i, label, actor: i === 0 ? CURRENT_USER : null,
            state: i === 0 ? "CURRENT" : "PENDING", actedAt: null, action: null,
          }))} />
        </section>

        <section className="wm-submit-section wm-form-grid">
          <div className="wm-form-full">
            <Field label="Legend" optional help="Appears in the title block and in Shared Workspace.">
              <TextInput value={legend} onChange={(e) => setLegend(e.target.value)} />
            </Field>
          </div>
          <div className="wm-form-full">
            <Field label="Note to approvers" optional>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Summarise what changed in this revision." />
            </Field>
          </div>
        </section>
      </Modal>
    );
  };

  /* ═══════════════════════ Approval chain stepper ═══════════════════════ */

  const CHAIN_STATE_LABEL = { COMPLETE: "Complete", CURRENT: "In progress", PENDING: "Pending", REJECTED: "Returned" };

  const ApprovalChainStepper = ({ chain }) => (
    <div className="wm-chain" style={{ "--wm-chain-n": chain.length }}>
      {chain.map((s, i) => {
        const tip = [
          s.actor ? `${s.actor.name} · ${s.actor.designation}` : "Not yet assigned",
          s.action ? `${s.action.toLowerCase()} ${fmtDateTime(s.actedAt)}` : CHAIN_STATE_LABEL[s.state],
        ].join("\n");
        return (
          <div key={i} className="wm-chain-node" data-state={s.state}>
            {i > 0 && <span className="wm-chain-line" aria-hidden="true" />}
            <button className="wm-chain-dot" title={tip} aria-label={`${s.label}: ${CHAIN_STATE_LABEL[s.state]}`}>
              {s.state === "COMPLETE" ? <Icon name="check" size={13} />
                : s.state === "REJECTED" ? <Icon name="x" size={13} />
                : i + 1}
            </button>
            <span className="wm-chain-label" title={s.label}>{s.label}</span>
            {s.actor && <span className="wm-chain-actor muted" title={s.actor.name}>{s.actor.name}</span>}
          </div>
        );
      })}
    </div>
  );

  /* ═══════════════════════ Shared Workspace ═══════════════════════ */

  const SharedItemCard = ({ item, busy, onOpen, onApprove, onReject, onRecall }) => {
    const current = item.chain.find((c) => c.state === "CURRENT");
    const acted = item.chain.some((c) => c.state === "COMPLETE" || c.state === "REJECTED");
    const closes = item.commentWindow && item.commentWindow.closesAt ? daysUntil(item.commentWindow.closesAt) : null;

    return (
      <article className="wm-card" data-awaiting={item.awaitingCurrentUser ? "true" : undefined}>
        <header className="wm-card-head">
          <DocTypeChip type={item.documentType} />
          <h3 className="wm-card-title">
            {item.station.name} <span className="wm-card-code">({item.station.code})</span>
          </h3>
          <div className="wm-card-head-right">
            {item.awaitingCurrentUser && <Chip tone="warning" dot>Awaiting you</Chip>}
            <StageBadge stage={item.stage} />
          </div>
        </header>

        <div className="wm-card-sub muted">
          {item.station.zone} · {item.station.division} · {item.station.section}
        </div>

        <div className="wm-card-body">
          <div className="wm-card-version">
            <strong>{item.documentType} {item.version}</strong>
            {item.legend && <span className="muted"> · {item.legend}</span>}
          </div>

          {item.commentWindow && (
            <div className="wm-comment-window" data-open={item.commentWindow.open}>
              <Icon name={item.commentWindow.open ? "clock" : "check_circle"} size={13} />
              {item.commentWindow.open
                ? `Comments open — closes in ${closes} day${closes === 1 ? "" : "s"} · ${item.commentWindow.commentCount} comments from ${item.commentWindow.departmentsResponded} departments`
                : `Comment window closed · ${item.commentWindow.commentCount} comments consolidated`}
            </div>
          )}

          <ApprovalChainStepper chain={item.chain} />

          <div className="wm-card-meta muted">
            <div>Submitted {fmtDateTime(item.submittedAt)} by {item.submittedBy.name}</div>
            {current && <div>Now with {current.label}{current.actor ? ` · ${current.actor.name}` : ""}</div>}
          </div>

          <DependencyBanner advisories={item.advisories} />
        </div>

        <footer className="wm-card-foot">
          <Btn variant="secondary" size="sm" onClick={() => onOpen(item)}>
            {item.commentWindow && item.commentWindow.open ? "Review and comment" : "View document"}
          </Btn>
          {item.awaitingCurrentUser && (
            <>
              <Btn variant="primary" size="sm" loading={busy} onClick={() => onApprove(item)}>Approve</Btn>
              <Btn variant="ghost" size="sm" danger onClick={() => onReject(item)}>Return</Btn>
            </>
          )}
          <div className="wm-card-foot-spacer" />
          <ActionMenu
            items={[
              {
                label: "Recall submission", icon: "refresh",
                disabled: acted,
                disabledReason: acted ? "An approver has already acted" : undefined,
                onClick: () => onRecall(item),
              },
            ]}
          />
        </footer>
      </article>
    );
  };

  const RejectModal = ({ open, item, onClose, onDone }) => {
    const [reason, setReason] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => { if (open) setReason(""); }, [open]);
    if (!open || !item) return null;
    return (
      <Modal
        open={open}
        onClose={onClose}
        icon="alert_tri"
        iconTone="danger"
        title="Return to the preparer"
        subtitle={`${item.documentType} ${item.version} · ${item.station.name}`}
        footer={
          <div className="wm-modal-foot">
            <div className="wm-modal-foot-msg">
              {!reason.trim() && <span className="wm-file-error">Give a reason so the preparer knows what to fix.</span>}
            </div>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn
              variant="primary" danger loading={busy} disabled={!reason.trim()}
              onClick={async () => { setBusy(true); await rejectStage(item.id, reason.trim()); setBusy(false); onDone(); onClose(); }}
            >
              Return with comments
            </Btn>
          </div>
        }
      >
        <p className="muted" style={{ marginTop: 0 }}>
          The document goes back to My Files marked returned, with every comment on this submission attached.
        </p>
        <Field label="Reason" required>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4}
            placeholder="Return crossover at the Guntur end is not to scale." />
        </Field>
      </Modal>
    );
  };

  /* ═══════════════════════ Review and comment ═══════════════════════ */

  const SEVERITY_TONE = { INFO: "info", MINOR: "warning", MAJOR: "danger" };
  const COMMENT_STATE_LABEL = { OPEN: "Open", ACKNOWLEDGED: "Acknowledged", ADDRESSED: "Addressed", REJECTED: "Not accepted" };

  const CommentThread = ({ comment, replies, selectedAssetId, onSelectAnchor, onSetState }) => (
    <div className="wm-comment" data-anchored={comment.anchor && comment.anchor.assetId === selectedAssetId ? "true" : undefined}>
      <div className="wm-comment-head">
        <div className="wm-avatar" aria-hidden="true">{comment.authorName.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
        <div className="wm-comment-who">
          <div className="wm-comment-name">{comment.authorName}</div>
          <div className="muted">{comment.authorDesignation} · {comment.department}</div>
        </div>
        <Chip tone={SEVERITY_TONE[comment.severity]} size="sm">{comment.severity.toLowerCase()}</Chip>
      </div>

      <p className="wm-comment-text">{comment.text}</p>

      <div className="wm-comment-foot">
        <span className="muted">{fmtDateTime(comment.createdAt)}</span>
        {comment.anchor && comment.anchor.assetId && (
          <button className="wm-linkbtn" onClick={() => onSelectAnchor(comment.anchor.assetId)}>Show on drawing</button>
        )}
        <div className="wm-comment-foot-spacer" />
        <Chip tone={comment.state === "OPEN" ? "neutral" : comment.state === "REJECTED" ? "danger" : "success"} size="sm">
          {COMMENT_STATE_LABEL[comment.state]}
        </Chip>
      </div>

      {comment.attachments.length > 0 && (
        <div className="wm-attachments">
          {comment.attachments.map((a) => (
            <span key={a.name} className="wm-attachment"><Icon name="file" size={12} />{a.name} <span className="muted">{fmtBytes(a.size)}</span></span>
          ))}
        </div>
      )}

      {comment.state === "OPEN" && (
        <div className="wm-comment-actions">
          <button className="wm-linkbtn" onClick={() => onSetState(comment.id, "ACKNOWLEDGED")}>Acknowledge</button>
          <button className="wm-linkbtn" onClick={() => onSetState(comment.id, "ADDRESSED")}>Mark addressed</button>
          <button className="wm-linkbtn" data-danger="true" onClick={() => onSetState(comment.id, "REJECTED")}>Not accepted</button>
        </div>
      )}

      {replies.length > 0 && (
        <div className="wm-replies">
          {replies.map((r) => (
            <div key={r.id} className="wm-reply">
              <div className="wm-comment-head">
                <div className="wm-avatar wm-avatar-sm" aria-hidden="true">{r.authorName.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
                <div className="wm-comment-who">
                  <div className="wm-comment-name">{r.authorName}</div>
                  <div className="muted">{r.authorDesignation}</div>
                </div>
              </div>
              <p className="wm-comment-text">{r.text}</p>
              <span className="muted">{fmtDateTime(r.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const NewCommentForm = ({ onAdd, anchorAssetId, onClearAnchor }) => {
    const [text, setText] = useState("");
    const [severity, setSeverity] = useState("INFO");
    return (
      <div className="wm-newcomment">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Add a comment for the preparer"
          aria-label="New comment"
        />
        <div className="wm-newcomment-row">
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)} aria-label="Severity">
            <option value="INFO">Info</option>
            <option value="MINOR">Minor</option>
            <option value="MAJOR">Major</option>
          </Select>
          {anchorAssetId && (
            <span className="wm-anchor-chip">
              Pinned to selection
              <button onClick={onClearAnchor} aria-label="Clear pin"><Icon name="x" size={11} /></button>
            </span>
          )}
          <div className="wm-filter-spacer" />
          <Btn
            size="sm" variant="primary" disabled={!text.trim()}
            onClick={() => { onAdd(text.trim(), severity, anchorAssetId ? { assetId: anchorAssetId } : null); setText(""); }}
          >
            Add comment
          </Btn>
        </div>
      </div>
    );
  };

  const ApproverActionBar = ({ item, busy, onApprove, onReject }) => {
    if (!item.awaitingCurrentUser) return null;
    const current = item.chain.find((c) => c.state === "CURRENT");
    return (
      <div className="wm-approverbar">
        <Icon name="shield" size={16} />
        <span>This submission is waiting on <strong>{current ? current.label : "you"}</strong>.</span>
        <div className="wm-filter-spacer" />
        <Btn variant="ghost" size="sm" danger onClick={onReject}>Return with comments</Btn>
        <Btn variant="primary" size="sm" loading={busy} onClick={onApprove}>Approve and forward</Btn>
      </div>
    );
  };

  const ReviewCommentPage = ({ item, comments, busy, onBack, onApprove, onReject, onAddComment, onSetCommentState }) => {
    const [selectedAssetId, setSelectedAssetId] = useState(null);
    const [visible] = useState(() => ASSET_CATEGORIES.reduce((m, c) => { m[c.id] = true; return m; }, {}));
    const roots = comments.filter((c) => !c.parentId);
    const repliesFor = (id) => comments.filter((c) => c.parentId === id);

    // Read-only assets — reviewers cannot change the extraction.
    const readOnlyAssets = useMemo(() => ASSETS_FIXTURE.map((a) => Object.assign({}, a, { reviewState: "CONFIRMED" })), []);

    return (
      <div className="wm-review-page">
        <header className="wm-review-head">
          <button className="wm-backbtn" onClick={onBack}><Icon name="chevron_left" size={16} />Shared Workspace</button>
          <div>
            <h2 className="wm-review-title">{item.station.name} ({item.station.code}) — {item.documentType} {item.version}</h2>
            <div className="muted">{item.legend} · submitted by {item.submittedBy.name} on {fmtDay(item.submittedAt)}</div>
          </div>
          <div className="wm-review-head-right">
            <Chip tone="neutral" leadingIcon="lock">Read only</Chip>
            <StageBadge stage={item.stage} />
          </div>
        </header>

        <ApproverActionBar item={item} busy={busy} onApprove={onApprove} onReject={onReject} />

        <div className="wm-review-split">
          <div className="wm-review-canvas">
            <ExtractionCanvas
              assets={readOnlyAssets}
              visible={visible}
              selectedId={selectedAssetId}
              onSelect={setSelectedAssetId}
            />
          </div>

          <aside className="wm-review-panel">
            <section className="wm-panel-section">
              <h4 className="wm-panel-title">
                Comments
                <span className="wm-panel-count">{comments.length}</span>
              </h4>

              {item.commentWindow && (
                <div className="wm-comment-window" data-open={item.commentWindow.open}>
                  <Icon name={item.commentWindow.open ? "clock" : "check_circle"} size={13} />
                  {item.commentWindow.open
                    ? `Open — closes ${fmtDay(item.commentWindow.closesAt)}`
                    : `Closed ${fmtDay(item.commentWindow.closesAt)}`}
                </div>
              )}

              {roots.length === 0 && <p className="muted wm-panel-hint">No comments yet. Add the first one below.</p>}

              {roots.map((c) => (
                <CommentThread
                  key={c.id}
                  comment={c}
                  replies={repliesFor(c.id)}
                  selectedAssetId={selectedAssetId}
                  onSelectAnchor={setSelectedAssetId}
                  onSetState={onSetCommentState}
                />
              ))}
            </section>

            <NewCommentForm
              onAdd={onAddComment}
              anchorAssetId={selectedAssetId}
              onClearAnchor={() => setSelectedAssetId(null)}
            />
          </aside>
        </div>
      </div>
    );
  };

  /* ═══════════════════════ Transfer ownership ═══════════════════════ */

  const TransferModal = ({ open, draft, onClose }) => {
    const [userId, setUserId] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => { if (open) setUserId(""); }, [open]);
    if (!open || !draft) return null;
    const candidates = Object.values(USERS).filter((u) => u.id !== draft.owner.id);
    return (
      <Modal
        open={open} onClose={onClose} icon="users" iconTone="info"
        title="Transfer ownership"
        subtitle={`${draft.documentType} ${draft.draftVersion} · ${draft.station.name}`}
        footer={
          <div className="wm-modal-foot">
            <div className="wm-modal-foot-msg" />
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" loading={busy} disabled={!userId}
              onClick={async () => { setBusy(true); await transferOwnership(draft.id, userId); setBusy(false); onClose(); }}>
              Transfer
            </Btn>
          </div>
        }
      >
        <p className="muted" style={{ marginTop: 0 }}>
          The new owner picks the draft up at its current stage. You keep read access.
        </p>
        <Field label="New owner" required>
          <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select a person</option>
            {candidates.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.designation}</option>)}
          </Select>
        </Field>
      </Modal>
    );
  };

  const ConfirmDeleteModal = ({ open, draft, onClose }) => {
    const [busy, setBusy] = useState(false);
    if (!open || !draft) return null;
    return (
      <Modal
        open={open} onClose={onClose} icon="alert_tri" iconTone="danger"
        title="Delete this draft?"
        subtitle={`${draft.documentType} ${draft.draftVersion} · ${draft.station.name}`}
        footer={
          <div className="wm-modal-foot">
            <div className="wm-modal-foot-msg" />
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" danger loading={busy}
              onClick={async () => { setBusy(true); try { await deleteDraft(draft.id); } catch (e) {} setBusy(false); onClose(); }}>
              Delete draft
            </Btn>
          </div>
        }
      >
        <p style={{ marginTop: 0 }}>
          The draft and its extraction results are removed. Approved versions of this document are not affected.
        </p>
      </Modal>
    );
  };

  const ReturnedCommentsModal = ({ open, draft, onClose }) => {
    if (!open || !draft) return null;
    const list = draft.returnedComments || [];
    return (
      <Modal
        open={open} onClose={onClose} icon="alert" iconTone="danger"
        title="Returned with comments"
        subtitle={`${draft.documentType} ${draft.draftVersion} · ${draft.station.name}`}
        size="lg"
        footer={<div className="wm-modal-foot"><div className="wm-modal-foot-msg" /><Btn variant="primary" onClick={onClose}>Close</Btn></div>}
      >
        {draft.rejectionReason && (
          <div className="wm-advisory" data-tone="danger" style={{ marginBottom: 14 }}>
            <Icon name="alert_tri" size={14} />
            <span><strong>{draft.rejectedBy || "Approver"}:</strong> {draft.rejectionReason}</span>
          </div>
        )}
        {list.length === 0
          ? <p className="muted" style={{ margin: 0 }}>{draft.commentCount || 0} comments were recorded against this submission.</p>
          : list.map((c) => (
              <div key={c.id} className="wm-comment">
                <div className="wm-comment-head">
                  <div className="wm-avatar" aria-hidden="true">{c.authorName.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
                  <div className="wm-comment-who">
                    <div className="wm-comment-name">{c.authorName}</div>
                    <div className="muted">{c.authorDesignation} · {c.department}</div>
                  </div>
                  <Chip tone={SEVERITY_TONE[c.severity]} size="sm">{c.severity.toLowerCase()}</Chip>
                </div>
                <p className="wm-comment-text">{c.text}</p>
                <span className="muted">{fmtDateTime(c.createdAt)}</span>
              </div>
            ))}
      </Modal>
    );
  };

  /* ═══════════════════════ Revision workspace ═══════════════════════ */

  // This is deliberately a package-level surface rather than another document editor.
  // A formal revision belongs to the station and its document set; the selected document
  // is simply the one currently open for editing.
  const revisionPackageFor = (draft) => {
    const code = draft.station.code;
    const baseVersion = (draft.sourceDocVersion || draft.parentVersion || "v1").toUpperCase().replace(/^V?/, "V");
    return {
      id: `${code}-REV-2026-003`,
      title: `${draft.station.name} Yard – Layout Revision`,
      station: draft.station,
      baseVersion,
      targetDate: "30 Aug 2026",
      reason: "Update the approved plan to reflect the proposed yard layout changes.",
      authority: "GM(W)/SCR/2026/118",
    };
  };

  const RevisionDocumentIcon = ({ type }) => (
    <span className="rw-doc-mark" data-type={type}>{type}</span>
  );

  const RevisionPlan = ({ mode = "revised", label, documentType }) => {
    const showPrevious = mode === "overlay";
    const showNew = mode !== "approved";
    return (
      <div className="rw-plan" data-mode={mode} aria-label={`${label || "Revision"} drawing preview`}>
        {label && <div className="rw-plan-label">{label}</div>}
        <div className="rw-plan-topline">
          <span>{documentType} yard layout</span>
          <span className="mono">Scale 1:1000</span>
        </div>
        <svg className="rw-plan-svg" viewBox="0 0 740 360" role="img" aria-label={`${documentType} engineering plan`}>
          <g fill="none" stroke="var(--ink-300)" strokeWidth="1">
            <path d="M44 52H698M44 102H698M44 152H698M44 202H698M44 252H698M44 302H698" opacity=".55" />
            <path d="M72 26V334M154 26V334M236 26V334M318 26V334M400 26V334M482 26V334M564 26V334M646 26V334" opacity=".35" />
          </g>
          <g fill="none" stroke="var(--ink-700)" strokeWidth="5" strokeLinecap="round">
            <path d="M42 105C166 105 240 104 334 105S542 105 694 105" />
            <path d="M42 190C186 190 267 190 360 189S548 189 694 190" />
            <path d="M42 270C150 270 216 270 296 270S531 270 694 270" />
            <path d="M218 105C245 129 256 157 258 189" />
            <path d="M466 189C488 213 500 240 503 270" />
          </g>
          <g fill="none" stroke="var(--ink-500)" strokeWidth="2" strokeDasharray="7 7">
            <path d="M52 124H686M52 209H686M52 289H686" />
          </g>
          <g fill="var(--paper)" stroke="var(--ink-500)" strokeWidth="2">
            <rect x="92" y="76" width="88" height="18" rx="2" />
            <rect x="340" y="162" width="104" height="18" rx="2" />
            <rect x="536" y="243" width="92" height="18" rx="2" />
          </g>
          <g fontFamily="var(--font-mono)" fontSize="12" fill="var(--ink-600)">
            <text x="96" y="68">PLATFORM 1</text>
            <text x="344" y="154">PIT LINE</text>
            <text x="540" y="235">PLATFORM 2</text>
            <text x="44" y="94">UP MAIN</text>
            <text x="44" y="179">LOOP</text>
            <text x="44" y="259">DOWN MAIN</text>
          </g>
          {showPrevious && (
            <g fill="none" stroke="var(--success)" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 7">
              <path d="M436 190C470 205 493 227 524 270" />
              <path d="M510 105C532 126 546 151 548 190" />
            </g>
          )}
          {showNew && (
            <g fill="none" stroke="var(--danger)" strokeWidth="5" strokeLinecap="round">
              <path d="M430 190C454 216 473 243 503 270" />
              <path d="M510 105C529 133 539 158 540 190" />
              <path d="M594 190H662" />
            </g>
          )}
          {showNew && (
            <g fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--danger-text)">
              <text x="446" y="232">MODIFIED CONNECTIVITY</text>
              <text x="580" y="179">NEW BUFFER STOP</text>
            </g>
          )}
        </svg>
        <div className="rw-plan-scale"><span /> 0&nbsp;&nbsp;&nbsp;&nbsp;50 m</div>
      </div>
    );
  };

  const RevisionDocumentTree = ({ documents, selected, onSelect, activeInfo, onInfoSelect }) => (
    <aside className="rw-left-panel" aria-label="Revision navigation">
      <div className="rw-panel-heading">Documents</div>
      <div className="rw-doc-tree">
        {documents.map((document) => (
          <button
            key={document.id}
            className="rw-tree-row"
            data-active={selected === document.id ? "true" : undefined}
            onClick={() => onSelect(document.id)}
          >
            <RevisionDocumentIcon type={document.type} />
            <span className="rw-tree-main"><strong>{document.type}</strong><small>{document.state}</small></span>
            {document.impactReview && <Icon name="alert" size={14} className="rw-tree-alert" />}
          </button>
        ))}
      </div>
      <div className="rw-left-divider" />
      <div className="rw-panel-heading">Revision information</div>
      <div className="rw-info-tree">
        {[
          ["changes", "Changes", "edit"],
          ["impact", "Impacted Assets", "alert"],
          ["validation", "Validation", "shield"],
          ["comments", "Comments", "inbox"],
          ["history", "History", "clock"],
        ].map(([id, name, icon]) => (
          <button key={id} className="rw-info-row" data-active={activeInfo === id ? "true" : undefined} onClick={() => onInfoSelect(id)}>
            <Icon name={icon} size={15} />
            <span>{name}</span>
            {id === "comments" && <span className="rw-nav-count">3</span>}
            {id === "validation" && <span className="rw-nav-count" data-warning="true">1</span>}
          </button>
        ))}
      </div>
      <div className="rw-team-brief">
        <div className="rw-team-avatars"><span>RK</span><span>AR</span><span>MD</span><span>+2</span></div>
        <div><strong>Revision team</strong><small>5 members have access</small></div>
      </div>
    </aside>
  );

  const RevisionSidePanel = ({ packageData, activeInfo, validationComplete, onAddComment, onManageAccess }) => {
    const sectionTitle = {
      changes: "Change Summary", impact: "Impacted Assets", validation: "Validation", comments: "Collaboration", history: "Revision History",
    }[activeInfo] || "Revision Details";
    return (
      <aside className="rw-right-panel" aria-label="Revision details">
        <section className="rw-side-section">
          <h3 className="rw-side-title">Revision Details</h3>
          <dl className="rw-key-values">
            <div><dt>Revision reason</dt><dd>{packageData.reason}</dd></div>
            <div><dt>Authority reference</dt><dd className="mono">{packageData.authority}</dd></div>
            <div><dt>Owner</dt><dd>R. Kumar · SSE/Drawings</dd></div>
            <div><dt>Current stage</dt><dd><Chip tone="info" size="sm">Draft revision</Chip></dd></div>
          </dl>
        </section>

        <section className="rw-side-section" data-focus={activeInfo === "changes" || activeInfo === "impact" ? "true" : undefined}>
          <h3 className="rw-side-title">{sectionTitle === "Impacted Assets" ? sectionTitle : "Change Summary"}</h3>
          <div className="rw-change-grid">
            <div><strong>2</strong><span>Added assets</span></div>
            <div><strong>3</strong><span>Modified assets</span></div>
            <div><strong>1</strong><span>Removed assets</span></div>
            <div><strong>2</strong><span>Impacted documents</span></div>
          </div>
          <div className="rw-impact-note"><Icon name="alert" size={14} /><span>SIP and LOP remain marked <strong>Impact Review Required</strong>.</span></div>
        </section>

        <section className="rw-side-section" data-focus={activeInfo === "validation" ? "true" : undefined}>
          <h3 className="rw-side-title">Validation</h3>
          <ul className="rw-check-list">
            <li data-tone="success"><Icon name="check_circle" size={15} /><span><strong>{validationComplete ? "18" : "17"} passed checks</strong><small>Track geometry and drawing rules</small></span></li>
            <li data-tone="warning"><Icon name="alert" size={15} /><span><strong>1 warning</strong><small>Buffer-stop clearance needs review</small></span></li>
            <li data-tone="info"><Icon name="info" size={15} /><span><strong>Impact review required</strong><small>Related SIP is not included</small></span></li>
          </ul>
        </section>

        <section className="rw-side-section" data-focus={activeInfo === "comments" ? "true" : undefined}>
          <div className="rw-side-title-row"><h3 className="rw-side-title">Collaboration</h3><button className="rw-link" onClick={onAddComment}>Add comment</button></div>
          <div className="rw-comment-brief"><span className="wm-avatar">MD</span><p><strong>M. Das</strong> mentioned you<br /><small>Please confirm the platform clearance before submission.</small></p></div>
          <div className="rw-comment-brief"><span className="wm-avatar">AR</span><p><strong>A. Rao</strong> replied<br /><small>ESP changes are ready for validation.</small></p></div>
          <button className="rw-access-link" onClick={onManageAccess}><Icon name="users" size={14} /> Manage revision access</button>
        </section>
      </aside>
    );
  };

  const RevisionWorkspacePage = ({ draft, onBack }) => {
    const packageData = useMemo(() => revisionPackageFor(draft), [draft]);
    const documents = useMemo(() => [
      { id: "esp", type: "ESP", name: "Engineering Scale Plan", drawing: `${packageData.station.code}-ESP-431`, base: packageData.baseVersion, state: "Editing" },
      { id: "sip", type: "SIP", name: "Signal Interlocking Plan", drawing: `${packageData.station.code}-SIP-431`, base: "V4-R0-A1", state: "Impact review", impactReview: true },
      { id: "lop", type: "LOP", name: "Layout of Plan", drawing: `${packageData.station.code}-LOP-118`, base: "V2-R0-A0", state: "Impact review", impactReview: true },
      { id: "supporting", type: "SUP", name: "Supporting Documents", drawing: "Authority reference", base: "—", state: "2 files" },
    ], [packageData]);
    const [selectedDocument, setSelectedDocument] = useState("esp");
    const [compareMode, setCompareMode] = useState("revised");
    const [activeInfo, setActiveInfo] = useState("changes");
    const [saveState, setSaveState] = useState("All changes saved");
    const [validationComplete, setValidationComplete] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const selected = documents.find((document) => document.id === selectedDocument) || documents[0];

    const save = () => {
      setSaveState("Saving changes…");
      window.setTimeout(() => { setSaveState("All changes saved"); toast("Revision workspace saved"); }, 550);
    };
    const validate = () => {
      setValidationComplete(true);
      setActiveInfo("validation");
      toast("Validation complete — 18 checks passed and 1 impact review remains", "success");
    };

    return (
      <div className="rw-page">
        <header className="rw-header">
          <button className="rw-back" onClick={onBack}><Icon name="chevron_left" size={16} /> Workspace</button>
          <div className="rw-head-copy">
            <div className="rw-title-line"><h1>{packageData.title}</h1><Chip tone={submitted ? "info" : "warning"} size="sm">{submitted ? "Submitted" : "Draft"}</Chip></div>
            <div className="rw-meta"><span className="mono">{packageData.id}</span><i /> <span>{packageData.station.name} ({packageData.station.code})</span><i /> <span>Owner: R. Kumar</span><i /> <span>Target: {packageData.targetDate}</span></div>
          </div>
          <div className="rw-save-state"><Icon name="check_circle" size={14} /> {saveState}</div>
          <div className="rw-header-actions">
            <Btn variant="secondary" size="sm" leadingIcon="refresh" onClick={save}>Save</Btn>
            <Btn variant="secondary" size="sm" leadingIcon="shield" onClick={validate}>Run Validation</Btn>
            <Btn variant="secondary" size="sm" leadingIcon="copy" onClick={() => setCompareMode("side-by-side")}>Compare Versions</Btn>
            <Btn variant="primary" size="sm" leadingIcon="arrow_right" disabled={submitted} onClick={() => setSubmitOpen(true)}>Submit for Review</Btn>
          </div>
        </header>

        <div className="rw-toolbar">
          <div className="rw-breadcrumb"><RevisionDocumentIcon type={selected.type} /><strong>{selected.type}</strong><Icon name="chevron_right" size={14} /><span>{selected.name}</span><span className="rw-baseline"><Icon name="lock" size={12} /> Baseline {selected.base}</span></div>
          <div className="rw-view-modes" role="group" aria-label="Version comparison mode">
            {[
              ["revised", "Revised Version"], ["approved", "Approved Version"], ["side-by-side", "Side-by-Side"], ["overlay", "Overlay"],
            ].map(([id, label]) => <button key={id} data-active={compareMode === id ? "true" : undefined} onClick={() => setCompareMode(id)}>{label}</button>)}
          </div>
          <button className="rw-more" aria-label="More revision actions"><Icon name="more" size={18} /></button>
        </div>

        <div className="rw-work-area">
          <RevisionDocumentTree documents={documents} selected={selectedDocument} onSelect={setSelectedDocument} activeInfo={activeInfo} onInfoSelect={setActiveInfo} />
          <main className="rw-editor">
            <div className="rw-editor-context"><span>{compareMode === "approved" ? "Approved baseline · read only" : "Editable revision copy"}</span><span className="rw-editor-dot" /><span>{selected.drawing}</span><span className="rw-editor-spacer" /><button onClick={() => toast("Zoom controls are available in the editor")}>100%</button><button aria-label="Fit drawing"><Icon name="maximize" size={15} /></button></div>
            <div className="rw-canvas-wrap" data-side-by-side={compareMode === "side-by-side" ? "true" : undefined}>
              {compareMode === "side-by-side" ? <>
                <RevisionPlan mode="approved" label="Approved Version · read only" documentType={selected.type} />
                <RevisionPlan mode="revised" label="Revised Version · working copy" documentType={selected.type} />
              </> : <RevisionPlan mode={compareMode} documentType={selected.type} />}
            </div>
            <footer className="rw-canvas-foot"><span><i data-change="new" /> New or modified item</span><span><i data-change="previous" /> Previous or removed item</span><span className="rw-canvas-foot-spacer" /><span>{compareMode === "approved" ? "Approved baseline is locked" : "Working copy is editable"}</span></footer>
          </main>
          <RevisionSidePanel packageData={packageData} activeInfo={activeInfo} validationComplete={validationComplete} onAddComment={() => { setActiveInfo("comments"); toast("Comment composer opened in the collaboration panel"); }} onManageAccess={() => toast("Revision access controls opened")} />
        </div>

        <footer className="rw-bottom-bar">
          <span>Formal revisions are stored against the station and documents. Authorized managers and audit users retain access.</span>
          <div><button onClick={() => toast("Revision history opened")}>View Revision History</button><button onClick={() => toast("Cancel revision requires owner confirmation")} data-danger="true">Cancel Revision</button></div>
        </footer>

        <Modal
          open={submitOpen}
          onClose={() => setSubmitOpen(false)}
          icon="arrow_right"
          iconTone="info"
          title="Submit revision for review?"
          subtitle={`${packageData.id} · ${packageData.station.name}`}
          footer={<div className="wm-modal-foot"><div className="wm-modal-foot-msg" /><Btn variant="ghost" onClick={() => setSubmitOpen(false)}>Back to editing</Btn><Btn variant="primary" onClick={() => { setSubmitted(true); setSubmitOpen(false); toast("Revision submitted for review"); }}>Submit for Review</Btn></div>}
        >
          <div className="rw-submit-note"><Icon name="lock" size={16} /><span>The approved baseline remains frozen. The revision team will retain the editable working copies until review is complete.</span></div>
          <div className="rw-submit-summary"><span>Included</span><strong>ESP working copy</strong><span>Impact review</span><strong>SIP and LOP</strong><span>Open warning</span><strong>Buffer-stop clearance</strong></div>
        </Modal>
      </div>
    );
  };

  /* ═══════════════════════ Create revision ═══════════════════════ */

  const RevisionPickerPage = ({ onBack, onCreate }) => {
    const [zone, setZone] = useState(CURRENT_USER.zone);
    const [division, setDivision] = useState(CURRENT_USER.division);
    const [section, setSection] = useState("");
    const [stationId, setStationId] = useState("");
    const [documentType, setDocumentType] = useState("ALL");
    const [query, setQuery] = useState("");
    const [baselineId, setBaselineId] = useState("");
    const [busy, setBusy] = useState(false);

    const zones = Array.from(new Set(STATIONS.map((st) => st.zone)));
    const divisions = Array.from(new Set(STATIONS.filter((st) => st.zone === zone).map((st) => st.division)));
    const sections = Array.from(new Set(STATIONS.filter((st) => st.zone === zone && st.division === division).map((st) => st.section)));
    const stations = STATIONS.filter((st) => st.zone === zone && st.division === division && (!section || st.section === section));
    const filtered = REVISION_BASELINES.filter((item) => {
      const itemStation = STATIONS.find((st) => st.id === item.stationId);
      if (!itemStation) return false;
      if (zone && itemStation.zone !== zone) return false;
      if (division && itemStation.division !== division) return false;
      if (section && itemStation.section !== section) return false;
      if (stationId && item.stationId !== stationId) return false;
      if (documentType !== "ALL" && item.documentType !== documentType) return false;
      if (query.trim()) {
        const haystack = `${item.drawingNumber} ${item.name} ${item.generatedFrom} ${itemStation.name} ${itemStation.code} ${item.version}`.toLowerCase();
        if (!haystack.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    });
    const selectedBaseline = REVISION_BASELINES.find((item) => item.id === baselineId);
    const selectedStation = selectedBaseline && STATIONS.find((st) => st.id === selectedBaseline.stationId);
    const resetFilters = () => {
      setZone(CURRENT_USER.zone); setDivision(CURRENT_USER.division); setSection(""); setStationId("");
      setDocumentType("ALL"); setQuery(""); setBaselineId("");
    };
    const create = async () => {
      if (!selectedBaseline || busy) return;
      setBusy(true);
      await onCreate(selectedBaseline);
      setBusy(false);
    };

    return (
      <div className="rp-page">
        <div className="rp-breadcrumb-bar">
          <nav className="ds-breadcrumb" aria-label="Breadcrumb">
            <button onClick={onBack}>Workspace</button>
            <Icon name="chevron_right" size={12} className="ds-breadcrumb-sep" />
            <span className="ds-breadcrumb-current">Create Revision</span>
          </nav>
        </div>
        <header className="rp-header">
          <div className="rp-head-copy"><h1>Create Revision</h1><p>Choose a single approved or in-review document. Its baseline stays locked while the revision is created as a separate working copy.</p></div>
          <div className="rp-head-note"><Icon name="shield" size={15} /><span>Authorized documents only</span></div>
        </header>

        <div className="rp-content">
          <section className="rp-library" aria-label="Available revision baseline files">
            <div className="rp-filter-head"><div><h2>Find a document</h2><p>Use the location and document filters to narrow the revision library.</p></div><button className="rp-reset" onClick={resetFilters}>Reset filters</button></div>
            <div className="rp-filter-panel">
              <div className="rp-filter-grid">
                <Field label="Zone"><Select value={zone} onChange={(event) => { setZone(event.target.value); setDivision(""); setSection(""); setStationId(""); setBaselineId(""); }}><option value="">All Zones</option>{zones.map((value) => <option key={value} value={value}>{REVISION_ZONE_LABELS[value] || value}</option>)}</Select></Field>
                <Field label="Division"><Select disabled={!zone} value={division} onChange={(event) => { setDivision(event.target.value); setSection(""); setStationId(""); setBaselineId(""); }}><option value="">All Divisions</option>{divisions.map((value) => <option key={value} value={value}>{value}</option>)}</Select></Field>
                <Field label="Section"><Select disabled={!division} value={section} onChange={(event) => { setSection(event.target.value); setStationId(""); setBaselineId(""); }}><option value="">All Sections</option>{sections.map((value) => <option key={value} value={value}>{value}</option>)}</Select></Field>
                <Field label="Station"><Select disabled={!section} value={stationId} onChange={(event) => { setStationId(event.target.value); setBaselineId(""); }}><option value="">All Stations</option>{stations.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</Select></Field>
                <Field label="Document type"><Select value={documentType} onChange={(event) => { setDocumentType(event.target.value); setBaselineId(""); }}><option value="ALL">All document types</option><option value="ESP">ESP</option><option value="SIP">SIP</option></Select></Field>
                <div className="rp-search-field"><Field label="Search"><TextInput leadingIcon="search" placeholder="Search file name, drawing number, station, or generated from..." value={query} onChange={(event) => { setQuery(event.target.value); setBaselineId(""); }} /></Field></div>
              </div>
            </div>
            <div className="rp-result-meta"><span><strong>{filtered.length}</strong> available files</span><span>Approved and In Review documents only</span></div>
            <div className="rp-file-card">
              <div className="rp-file-head"><span /><span>File Name</span><span>Document</span><span>Station</span><span>Generated From</span><span>State</span><span>Last Updated</span></div>
              <div className="rp-file-list" role="radiogroup" aria-label="Select a document to revise">
                {filtered.length ? filtered.map((item) => {
                  const itemStation = STATIONS.find((st) => st.id === item.stationId);
                  return <button key={item.id} className="rp-file-row" data-selected={baselineId === item.id ? "true" : undefined} onClick={() => setBaselineId(item.id)} role="radio" aria-checked={baselineId === item.id}>
                    <span className="rp-radio" data-selected={baselineId === item.id ? "true" : undefined} />
                    <span className="rp-document"><RevisionDocumentIcon type={item.documentType} /><span><strong>{item.drawingNumber}</strong><small>{item.name}</small></span></span>
                    <span className="rp-document-type"><RevisionDocumentIcon type={item.documentType} /><strong>{item.documentType}</strong></span>
                    <span className="rp-station"><strong>{itemStation.name}</strong><small>{itemStation.code}</small></span>
                    <span className="rp-generated"><strong>{item.generatedFrom}</strong></span>
                    <Chip tone={item.status === "Approved" ? "success" : "warning"} size="sm">{item.status}</Chip>
                    <span className="rp-updated">{fmtDay(item.modifiedAt)}</span>
                  </button>;
                }) : <div className="rp-empty"><Icon name="search" size={19} /><strong>No available files match these filters.</strong><span>Broaden the station, document type, or search filters.</span></div>}
              </div>
            </div>
          </section>

          <aside className="rp-selection" aria-label="Revision selection">
            <div className="rp-selection-head"><h2>Revision selection</h2><span>1 document</span></div>
            {selectedBaseline && selectedStation ? <>
              <div className="rp-selected-file"><RevisionDocumentIcon type={selectedBaseline.documentType} /><div><strong>{selectedBaseline.drawingNumber}</strong><span>{selectedBaseline.name}</span></div></div>
              <dl className="rp-details"><div><dt>Station</dt><dd>{selectedStation.name} ({selectedStation.code})</dd></div><div><dt>Location</dt><dd>{selectedStation.division} · {selectedStation.section}</dd></div><div><dt>Current status</dt><dd><Chip tone={selectedBaseline.status === "Approved" ? "success" : "warning"} size="sm">{selectedBaseline.status}</Chip></dd></div></dl>
              <div className="rp-lock-note"><Icon name="lock" size={15} /><span>The baseline remains locked and unchanged. The revision will use a new editable working copy.</span></div>
            </> : <div className="rp-no-selection"><Icon name="file_check" size={24} /><strong>Select a file to continue</strong><span>Its document, station and version details will appear here.</span></div>}
            <div className="rp-selection-footer"><Btn variant="primary" leadingIcon="arrow_right" loading={busy} disabled={!selectedBaseline} onClick={create}>Start Revision</Btn><span>{selectedBaseline ? "The revision workspace opens next." : "Choose one available file."}</span></div>
          </aside>
        </div>
      </div>
    );
  };

  /* ═══════════════════════ Toast ═══════════════════════ */

  const ToastHost = ({ toast }) => {
    if (!toast) return null;
    return (
      <div className="wm-toast" data-tone={toast.tone} role="status" aria-live="polite">
        <Icon name={toast.tone === "danger" ? "alert_tri" : "check_circle"} size={16} />
        <span>{toast.message}</span>
      </div>
    );
  };

  /* ═══════════════════════ List views ═══════════════════════ */

  const MY_FILES_STAGES = ["UPLOADED", "EXTRACTING", "NEEDS_REVIEW", "EXTRACTED", "IN_EDITING", "VALIDATION_FAILED", "READY_FOR_SUBMISSION", "REJECTED"];
  const SHARED_STAGES = ["UNDER_INTERNAL_CHECK", "PROVISIONAL_COMMENTS_OPEN", "COMMENTS_CONSOLIDATED", "UNDER_SIGNATURE", "APPROVED", "REJECTED"];

  // Tiny inline-SVG helper so the My Files page can match the mockup's icons exactly.
  const Ico = ({ size = 15, stroke = "currentColor", sw = 2, fill = "none", children }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw}>{children}</svg>
  );

  // Sortable-column header + its up/down indicator. Defined at module scope (not inside
  // MyFilesPage's render body) so React keeps the same <th> DOM node across renders instead
  // of remounting it every click — remounting would drop focus and defeat the data-active styling.
  const SortIcon = ({ active, dir }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ flex: "none" }}>
      <path d="m7 10 5-5 5 5" stroke={active && dir === "asc" ? MF.indigo : "#c7cdd6"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m7 14 5 5 5-5" stroke={active && dir === "desc" ? MF.indigo : "#c7cdd6"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const SortTh = ({ children, sortByKey, align, sortKey, sortDir, onToggle }) => {
    const active = sortKey === sortByKey;
    const justify = align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start";
    return (
      <th
        className="mf-th-sortable"
        data-active={active}
        style={{ textAlign: align || "left", cursor: "pointer", userSelect: "none" }}
        onClick={() => onToggle(sortByKey)}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, justifyContent: justify, width: "100%" }}>
          {children}
          <SortIcon active={active} dir={sortDir} />
        </span>
      </th>
    );
  };

  const MyFilesPage = ({ s, onIntent, onViewLayout, onMenuAction, onUpload, onNewRevision }) => {
    const all = s.drafts;
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState("date");
    const [sortDir, setSortDir] = useState("desc");
    const [station, setStation] = useState("all");
    const [type, setType] = useState("all");
    const [stateF, setStateF] = useState("all");
    const [source, setSource] = useState("all");
    const [group, setGroup] = useState("all");
    const [view, setView] = useState("list");
    const [hover, setHover] = useState(-1);
    const [detailsDraft, setDetailsDraft] = useState(null);

    // ── filter ──
    let rows = all.filter((d) => {
      if (group !== "all" && MF_GROUP_OF(d.stage) !== group) return false;
      if (station !== "all" && d.station.name !== station) return false;
      if (type !== "all" && d.documentType !== type) return false;
      if (stateF !== "all" && stageLabel(d.stage) !== stateF) return false;
      if (source !== "all") {
        const src = d.checkedInBy ? d.checkedInBy.name : null;
        if (source === "none" && src) return false;
        if (source !== "none" && src !== source) return false;
      }
      if (query) {
        const hay = `${draftFileName(d)} ${d.station.name} ${d.station.section} ${d.notes || ""} ${d.owner.name}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
    const sortDirMul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") rows = [...rows].sort((a, b) => sortDirMul * draftFileName(a).localeCompare(draftFileName(b)));
    else if (sortKey === "version") rows = [...rows].sort((a, b) => sortDirMul * (parseFloat(a.draftVersion.slice(1)) - parseFloat(b.draftVersion.slice(1))));
    else if (sortKey === "state") rows = [...rows].sort((a, b) => sortDirMul * stageLabel(a.stage).localeCompare(stageLabel(b.stage)));
    else rows = [...rows].sort((a, b) => sortDirMul * (new Date(a.modifiedAt) - new Date(b.modifiedAt)));

    // ── stat cards ──
    const counts = {
      progress: all.filter((d) => MF_GROUP_OF(d.stage) === "progress").length,
      review:   all.filter((d) => MF_GROUP_OF(d.stage) === "review").length,
      failed:   all.filter((d) => MF_GROUP_OF(d.stage) === "failed").length,
      ready:    all.filter((d) => MF_GROUP_OF(d.stage) === "ready").length,
    };
    const statMeta = [
      { key: "progress", label: "In progress",       count: counts.progress, iconBg: "#eff6ff", iconColor: "#2563eb", accent: "#3b82f6", icon: (<Ico><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>) },
      { key: "review",   label: "Needs review",       count: counts.review,   iconBg: "#fffbeb", iconColor: "#d97706", accent: "#f59e0b", icon: (<Ico><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17h.01" /></Ico>) },
      { key: "failed",   label: "Validation failed",  count: counts.failed,   iconBg: "#fef2f2", iconColor: "#dc2626", accent: "#ef4444", icon: (<Ico><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></Ico>) },
      { key: "ready",    label: "Ready to submit",    count: counts.ready,    iconBg: "#ecfdf5", iconColor: "#059669", accent: "#10b981", icon: (<Ico><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></Ico>) },
    ];

    // ── filter controls ──
    const stationOpts = ["all", ...Array.from(new Set(all.map((d) => d.station.name)))];
    const typeOpts = ["all", ...Array.from(new Set(all.map((d) => d.documentType)))];
    const stateOpts = ["all", ...Array.from(new Set(all.map((d) => stageLabel(d.stage))))];
    const sourceOpts = ["all", ...Array.from(new Set(all.map((d) => d.checkedInBy && d.checkedInBy.name).filter(Boolean))), "none"];
    const selStyle = { appearance: "none", WebkitAppearance: "none", padding: "8px 30px 8px 12px", border: `1px solid ${MF.border}`, borderRadius: 9, fontSize: 13, fontFamily: "inherit", fontWeight: 500, color: MF.ink3, background: "#fff", cursor: "pointer", outline: "none", minWidth: 118 };
    const chevron = (<span style={{ position: "absolute", right: 9, pointerEvents: "none", color: MF.faint, display: "flex" }}><Ico><path d="m6 9 6 6 6-6" /></Ico></span>);
    const Select2 = ({ value, onChange, options, fmt, minW }) => (
      <label style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <select className="mf-select" value={value} onChange={onChange} style={{ ...selStyle, minWidth: minW || 118 }}>
          {options.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
        </select>
        {chevron}
      </label>
    );

    // ── active chips ──
    const chips = [];
    if (group !== "all") chips.push({ label: MF_GROUP_LABEL[group], onRemove: () => setGroup("all") });
    if (station !== "all") chips.push({ label: station, onRemove: () => setStation("all") });
    if (type !== "all") chips.push({ label: type, onRemove: () => setType("all") });
    if (stateF !== "all") chips.push({ label: stateF, onRemove: () => setStateF("all") });
    if (source !== "all") chips.push({ label: source === "none" ? "Not checked in" : source, onRemove: () => setSource("all") });
    const clearAll = () => { setGroup("all"); setStation("all"); setType("all"); setStateF("all"); setSource("all"); setQuery(""); };
    const hasFilters = chips.length > 0;

    const liveDetails = detailsDraft ? all.find((d) => d.id === detailsDraft.id) || detailsDraft : null;
    const toggleSort = (key) => {
      if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else { setSortKey(key); setSortDir("asc"); }
    };

    return (
      <div className="mf">
        {/* stat cards */}
        <div className="mf-stats">
          {statMeta.map((m) => {
            const active = group === m.key;
            return (
              <button
                key={m.key}
                className="mf-stat"
                onClick={() => setGroup((g) => (g === m.key ? "all" : m.key))}
                style={{ border: `1.5px solid ${active ? m.accent : MF.line}`, boxShadow: active ? `0 2px 10px ${m.accent}33` : "0 1px 2px rgba(15,23,42,.04)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", background: m.iconBg, color: m.iconColor }}>{m.icon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: MF.ink4 }}>{m.label}</span>
                  <span style={{ marginLeft: "auto", display: active ? "flex" : "none", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: m.accent, color: "#fff" }}>
                    <Ico size={15} sw={2.4}><path d="m5 12 4.5 4.5L19 6" /></Ico>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: "-.02em", color: MF.ink }}>{m.count}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: active ? m.iconColor : MF.faint }}>{active ? "Filtering" : "View files"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* controls + table card */}
        <div className="mf-card">
          <div className="mf-controls">
            <div className="mf-search">
              <span className="mf-search-ico"><Ico size={16}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></Ico></span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files, stations, notes…" />
            </div>

            <Select2 value={station} onChange={(e) => setStation(e.target.value)} options={stationOpts} fmt={(o) => (o === "all" ? "All stations" : o)} minW={130} />
            <Select2 value={type} onChange={(e) => setType(e.target.value)} options={typeOpts} fmt={(o) => (o === "all" ? "All types" : o)} />
            <Select2 value={stateF} onChange={(e) => setStateF(e.target.value)} options={stateOpts} fmt={(o) => (o === "all" ? "All states" : o)} minW={140} />
            <Select2 value={source} onChange={(e) => setSource(e.target.value)} options={sourceOpts} fmt={(o) => (o === "all" ? "All checked in by" : o === "none" ? "Not checked in" : o)} minW={140} />

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <select
                  className="mf-select"
                  value={`${sortKey}-${sortDir}`}
                  onChange={(e) => { const [k, d] = e.target.value.split("-"); setSortKey(k); setSortDir(d); }}
                  style={selStyle}
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="state-asc">State</option>
                </select>
                {chevron}
              </label>
              <div className="mf-viewtoggle">
                <button title="List view" data-active={view === "list"} onClick={() => setView("list")}>
                  <Ico size={16}><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></Ico>
                </button>
                <button title="Grid view" data-active={view === "grid"} onClick={() => setView("grid")}>
                  <Ico size={16}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></Ico>
                </button>
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="mf-chips">
              <span style={{ fontSize: 12, color: MF.faint, fontWeight: 500 }}>Active:</span>
              {chips.map((c, i) => (
                <button key={i} className="mf-chip" onClick={c.onRemove}>
                  {c.label}
                  <Ico size={13} sw={2.4}><path d="M6 6l12 12M18 6 6 18" /></Ico>
                </button>
              ))}
              <button className="mf-clear" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {view === "grid" ? (
            <div style={{ padding: 16, borderTop: `1px solid ${MF.line2}` }}>
              {rows.length === 0 ? <MfEmpty onClear={clearAll} /> : (
                <div className="wm-cardgrid">
                  {rows.map((d) => (
                    <DraftCard key={d.id} draft={d} busy={s.busyId === d.id} onIntent={onIntent} onViewLayout={onViewLayout} onMenuAction={onMenuAction} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mf-tablewrap">
              <table className="mf-table">
                <colgroup>
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "8%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <SortTh sortByKey="name" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort}>FILE NAME</SortTh>
                    <SortTh sortByKey="version" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort}>VERSION</SortTh>
                    <th style={{ textAlign: "left" }}>CHECKED OUT BY</th>
                    <th style={{ textAlign: "left" }}>CHECKED IN BY</th>
                    <SortTh sortByKey="state" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort}>STATE</SortTh>
                    <th style={{ textAlign: "left" }}>ALTERATION</th>
                    <th style={{ textAlign: "center" }}>COMMENTS</th>
                    <th style={{ textAlign: "left" }}>NOTES</th>
                    <th style={{ textAlign: "right" }}>FILE DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d, i) => {
                    const [tbg, tfg] = MF_TYPE_BADGE[d.documentType] || ["#f1f5f9", "#475569"];
                    const [sbg, sfg, dot] = MF_STATE_VISUAL[d.stage] || ["#f1f5f9", "#475569", "#94a3b8"];
                    return (
                      <tr key={d.id} style={{ background: hover === i ? MF.pageHover : "#fff" }} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}>
                        <td style={{ verticalAlign: "top" }}>
                          <div style={{ display: "flex", gap: 11, minWidth: 0 }}>
                            <span style={{ flex: "none", width: 34, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, letterSpacing: ".03em", borderRadius: 6, background: tbg, color: tfg }}>{d.documentType}</span>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <button className="mf-filename" title={draftFileName(d)} onClick={() => setDetailsDraft(d)}>
                                <span className="mf-filename-text">{draftFileName(d)}</span>
                                {d.checkedOutBy && <Ico size={12} stroke="#94a3b8"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Ico>}
                              </button>
                              <div className="mf-ellip" title={`${d.station.name} · ${d.station.section}`} style={{ fontSize: 12, color: MF.faint, marginTop: 3 }}>{d.station.name} · {d.station.section}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ verticalAlign: "top", fontSize: 13, color: MF.ink4, fontVariantNumeric: "tabular-nums" }}>{d.draftVersion}</td>
                        <td style={{ verticalAlign: "top" }}>
                          {d.checkedOutBy ? (
                            <span className="mf-ellip" title={d.checkedOutBy.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: MF.ink4 }}>
                              <Ico size={12} stroke="#94a3b8"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Ico>
                              <span className="mf-ellip">{d.checkedOutBy.name}</span>
                            </span>
                          ) : <span style={{ fontSize: 13, color: MF.faint2 }}>—</span>}
                        </td>
                        <td style={{ verticalAlign: "top" }}>
                          <span className="mf-ellip" title={d.checkedInBy ? d.checkedInBy.name : ""} style={{ fontSize: 13, color: d.checkedInBy ? MF.ink4 : MF.faint2 }}>{d.checkedInBy ? d.checkedInBy.name : "—"}</span>
                        </td>
                        <td style={{ verticalAlign: "top" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: sbg, color: sfg, whiteSpace: "nowrap" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flex: "none" }} />
                            {stageLabel(d.stage)}
                          </span>
                        </td>
                        <td style={{ verticalAlign: "top", fontSize: 13, color: MF.ink4, fontVariantNumeric: "tabular-nums" }}>{d.alteration || "—"}</td>
                        <td style={{ verticalAlign: "top", textAlign: "center" }}>
                          {d.commentCount > 0
                            ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#b45309" }}><Ico size={14} stroke="#f59e0b"><path d="M4 4h16v11H9l-5 4z" /></Ico>{d.commentCount}</span>
                            : <span style={{ fontSize: 13, fontWeight: 600, color: MF.faint2 }}>—</span>}
                        </td>
                        <td style={{ verticalAlign: "top", maxWidth: 280 }}>
                          <span title={d.notes} className="mf-notes">{d.notes || "—"}</span>
                        </td>
                        <td style={{ verticalAlign: "top", textAlign: "right" }}>
                          <button className="mf-details" onClick={() => setDetailsDraft(d)}>
                            <Ico size={14}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Ico>
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {rows.length === 0 && <MfEmpty onClear={clearAll} />}
            </div>
          )}

          {/* footer */}
          <div className="mf-foot">
            <span style={{ fontSize: 12.5, color: MF.muted }}>Showing <b style={{ color: MF.ink3 }}>{rows.length}</b> of {all.length} files</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <button className="mf-pgbtn" disabled>Previous</button>
              <button className="mf-pgbtn" data-active="true">1</button>
              <button className="mf-pgbtn">Next</button>
            </div>
          </div>
        </div>

        <FileDetailsModal
          draft={liveDetails}
          onClose={() => setDetailsDraft(null)}
          onIntent={onIntent}
          onViewLayout={onViewLayout}
          onMenuAction={onMenuAction}
        />
      </div>
    );
  };

  const MfEmpty = ({ onClear }) => (
    <div style={{ padding: "56px 20px", textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#94a3b8" }}>
        <Ico size={24} sw={1.8}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></Ico>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>No files match your filters</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 5 }}>Try clearing filters or adjusting your search.</div>
      <button className="mf-pgbtn" style={{ marginTop: 16 }} onClick={onClear}>Clear all filters</button>
    </div>
  );

  const SharedWorkspacePage = ({ s, items, onOpen, onApprove, onReject, onRecall }) => {
    const kpis = sharedKpis(s.sharedItems);
    const awaiting = items.filter((it) => it.awaitingCurrentUser);
    const rest = items.filter((it) => !it.awaitingCurrentUser);

    return (
      <>
        <KpiStrip items={[
          { label: "Awaiting your action", icon: "bell",        value: kpis.awaitingYourAction, variant: kpis.awaitingYourAction ? "warning" : undefined },
          { label: "Comments open",        icon: "clock",       value: kpis.commentsOpen },
          { label: "Under signature",      icon: "shield",      value: kpis.underSignature },
          { label: "Returned",             icon: "alert",       value: kpis.returned,           variant: kpis.returned ? "danger" : undefined },
        ]} />

        <FilterBar
          tab="SHARED"
          filters={s.filters.SHARED}
          search={s.search.SHARED}
          sortBy={s.sortBy.SHARED}
          viewMode="CARD"
          stageOptions={SHARED_STAGES}
          onFilter={setFilter}
          onSearch={setSearch}
          onSort={setSort}
          onView={() => {}}
          onClear={clearFilters}
        />

        {items.length === 0 ? (
          <EmptyState
            kind="inbox"
            title="Nothing shared yet"
            description="Documents you submit for approval, and documents waiting on your signature, appear here."
          />
        ) : (
          <>
            {awaiting.length > 0 && (
              <section className="wm-section">
                <h3 className="wm-section-title">
                  Awaiting your action
                  <span className="wm-panel-count" data-tone="warning">{awaiting.length}</span>
                </h3>
                <div className="wm-cardgrid">
                  {awaiting.map((it) => (
                    <SharedItemCard key={it.id} item={it} busy={s.busyId === it.id}
                      onOpen={onOpen} onApprove={onApprove} onReject={onReject} onRecall={onRecall} />
                  ))}
                </div>
              </section>
            )}

            <section className="wm-section">
              <h3 className="wm-section-title">
                All shared items
                <span className="wm-panel-count">{rest.length}</span>
              </h3>
              {rest.length === 0 ? (
                <p className="muted">Everything shared is waiting on you.</p>
              ) : (
                <div className="wm-cardgrid">
                  {rest.map((it) => (
                    <SharedItemCard key={it.id} item={it} busy={s.busyId === it.id}
                      onOpen={onOpen} onApprove={onApprove} onReject={onReject} onRecall={onRecall} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </>
    );
  };

  /* ═══════════════════════ Module root ═══════════════════════ */

  const WorkspaceModulePage = ({ onNavigate, initialTab }) => {
    const s = useStore();
    const drafts = useFilteredDrafts(s);
    const sharedItems = useFilteredSharedItems(s);

    // view: { name: 'LIST' | 'CREATE_REVISION' | 'EXTRACTION' | 'REVIEW' | 'REVISION', id }
    const [view, setView] = useState({ name: "LIST" });
    const [uploadOpen, setUploadOpen] = useState(false);
    const [submitDraft, setSubmitDraft] = useState(null);
    const [transferDraft, setTransferDraft] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [returnedDraft, setReturnedDraft] = useState(null);
    const [rejectItem, setRejectItem] = useState(null);

    useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);

    const goEditor = (draft) => {
      // The editor is an existing screen — route to it, never rebuild it here.
      if (onNavigate) onNavigate("library", { draftId: draft.id });
      else toast("Opening the editor");
    };

    const openNewRevision = () => setView({ name: "CREATE_REVISION" });

    const createRevisionFromBaseline = async (baseline) => {
      const draft = await createRevision(baseline.stationId, baseline.documentType, baseline);
      if (!draft || draft.blocked) return;
      setView({ name: "REVISION", id: draft.id });
      return draft;
    };

    const onIntent = (intent, draft) => {
      switch (intent) {
        case "START_EXTRACTION":
          startExtraction(draft.id);
          setView({ name: "EXTRACTION", id: draft.id });
          break;
        case "VIEW_PROGRESS":
        case "REVIEW_EXTRACTION":
          setView({ name: "EXTRACTION", id: draft.id });
          break;
        case "OPEN_EDITOR":
          goEditor(draft);
          break;
        case "VIEW_VIOLATIONS":
          toast(`${draft.violations.v1Open} V1 and ${draft.violations.v2Open} V2 violations open — opening the validation panel in the editor.`, "danger");
          goEditor(draft);
          break;
        case "SUBMIT":
          setSubmitDraft(draft);
          break;
        case "VIEW_COMMENTS":
          setReturnedDraft(draft);
          break;
        case "EDIT_METADATA":
          toast("Station metadata is edited in the document properties panel.");
          goEditor(draft);
          break;
        default:
          break;
      }
    };

    const onMenuAction = (action, draft) => {
      if (action === "SOD") runSodCheck(draft.id);
      else if (action === "TRANSFER") setTransferDraft(draft);
      else if (action === "DELETE") setDeleteTarget(draft);
      else if (action === "COMPARE") { toast("Opening version compare"); goEditor(draft); }
    };

    const currentDraft = view.name === "EXTRACTION" ? s.drafts.find((d) => d.id === view.id) : null;
    const currentItem = view.name === "REVIEW" ? s.sharedItems.find((it) => it.id === view.id) : null;
    const currentRevisionDraft = view.name === "REVISION" ? s.drafts.find((d) => d.id === view.id) : null;

    // A draft can vanish from under an open screen (submitted, deleted) — fall back.
    useEffect(() => {
      if (view.name === "EXTRACTION" && !currentDraft) setView({ name: "LIST" });
      if (view.name === "REVIEW" && !currentItem) setView({ name: "LIST" });
      if (view.name === "REVISION" && !currentRevisionDraft) setView({ name: "LIST" });
    }, [view.name, currentDraft, currentItem, currentRevisionDraft]);

    if (view.name === "EXTRACTION" && currentDraft) {
      return (
        <div className="wm-root wm-root-full">
          <ExtractionReviewPage
            draft={currentDraft}
            onBack={() => setView({ name: "LIST" })}
            onOpenEditor={goEditor}
          />
          <ToastHost toast={s.toast} />
        </div>
      );
    }

    if (view.name === "REVIEW" && currentItem) {
      return (
        <div className="wm-root wm-root-full">
          <ReviewCommentPage
            item={currentItem}
            comments={s.comments.filter((c) => c.docId === currentItem.id)}
            busy={s.busyId === currentItem.id}
            onBack={() => setView({ name: "LIST" })}
            onApprove={() => approveStage(currentItem.id)}
            onReject={() => setRejectItem(currentItem)}
            onAddComment={(text, severity, anchor) => addComment(currentItem.id, text, severity, anchor)}
            onSetCommentState={setCommentState}
          />
          <RejectModal
            open={Boolean(rejectItem)}
            item={rejectItem}
            onClose={() => setRejectItem(null)}
            onDone={() => setView({ name: "LIST" })}
          />
          <ToastHost toast={s.toast} />
        </div>
      );
    }

    if (view.name === "REVISION" && currentRevisionDraft) {
      return (
        <div className="wm-root wm-root-full">
          <RevisionWorkspacePage draft={currentRevisionDraft} onBack={() => setView({ name: "LIST" })} />
          <ToastHost toast={s.toast} />
        </div>
      );
    }

    if (view.name === "CREATE_REVISION") {
      return (
        <div className="wm-root wm-root-full">
          <RevisionPickerPage onBack={() => setView({ name: "LIST" })} onCreate={createRevisionFromBaseline} />
          <ToastHost toast={s.toast} />
        </div>
      );
    }

    const tabItems = [
      { id: "MY_FILES", label: `My Files (${s.drafts.length})` },
      { id: "SHARED", label: `Shared Workspace (${s.sharedItems.filter((it) => it.awaitingCurrentUser).length})` },
    ];

    return (
      <div className="mf-page">
        <header style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-.02em" }}>Workspace</h1>
            <div style={{ marginTop: 5, fontSize: 13.5, color: "#64748b" }}>
              {CURRENT_USER.name} · {CURRENT_USER.designation} · {CURRENT_USER.division} division, {CURRENT_USER.zone}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button className="mf-btn-ghost" onClick={openNewRevision}>
              <Ico size={16}><path d="M4 4h11l5 5v11H4z" /><path d="M8 4v6h7" /><path d="M8 15h8" /></Ico>
              Create Revision
            </button>
            <button className="mf-btn-primary" onClick={() => setUploadOpen(true)}>
              <Ico size={16}><path d="M12 16V5M8 9l4-4 4 4" /><path d="M5 20h14" /></Ico>
              Upload a drawing
            </button>
          </div>
        </header>

        <div className="mf-tabs">
          {tabItems.map((t) => {
            const active = s.activeTab === t.id;
            const m = /^(.*?) \((\d+)\)$/.exec(t.label) || [null, t.label, ""];
            return (
              <button
                key={t.id}
                className="mf-tab"
                data-active={active ? "true" : "false"}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id)}
              >
                {m[1]} <span style={{ color: active ? "#94a3b8" : "#cbd5e1", fontWeight: 500 }}>({m[2]})</span>
              </button>
            );
          })}
        </div>

        <div className="wm-content">
          {s.activeTab === "MY_FILES" ? (
            <MyFilesPage
              s={s}
              drafts={drafts}
              onIntent={onIntent}
              onViewLayout={(d) => setView({ name: "EXTRACTION", id: d.id })}
              onMenuAction={onMenuAction}
              onUpload={() => setUploadOpen(true)}
              onNewRevision={openNewRevision}
            />
          ) : (
            <SharedWorkspacePage
              s={s}
              items={sharedItems}
              onOpen={(it) => setView({ name: "REVIEW", id: it.id })}
              onApprove={(it) => approveStage(it.id)}
              onReject={(it) => setRejectItem(it)}
              onRecall={(it) => { recallSubmission(it.id).catch(() => {}); }}
            />
          )}
        </div>

        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onComplete={() => setActiveTab("MY_FILES")}
        />
        <SubmitModal
          open={Boolean(submitDraft)}
          draft={submitDraft ? s.drafts.find((d) => d.id === submitDraft.id) : null}
          onClose={() => setSubmitDraft(null)}
          onJump={(intent, d) => { setSubmitDraft(null); onIntent(intent, d); }}
          onSubmitted={() => setActiveTab("SHARED")}
        />
        <TransferModal open={Boolean(transferDraft)} draft={transferDraft} onClose={() => setTransferDraft(null)} />
        <ConfirmDeleteModal open={Boolean(deleteTarget)} draft={deleteTarget} onClose={() => setDeleteTarget(null)} />
        <ReturnedCommentsModal open={Boolean(returnedDraft)} draft={returnedDraft} onClose={() => setReturnedDraft(null)} />
        <RejectModal
          open={Boolean(rejectItem)}
          item={rejectItem}
          onClose={() => setRejectItem(null)}
          onDone={() => setActiveTab("MY_FILES")}
        />

        <ToastHost toast={s.toast} />
      </div>
    );
  };

  /* ═══════════════════════ Styles ═══════════════════════ */
  // Colours come from tokens.css custom properties only — no literals here.

  const wmCSS = `
.wm-root { padding: 24px 28px 64px; max-width: 1560px; margin: 0 auto; }
.wm-root-full { padding: 0; max-width: none; height: 100%; display: flex; flex-direction: column; }

.wm-header { display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
.wm-title { font-size: 24px; font-weight: 650; letter-spacing: -0.02em; margin: 0; }
.wm-subtitle { margin: 4px 0 0; font-size: 13px; }
.wm-header-actions { margin-left: auto; display: flex; gap: 10px; flex-wrap: wrap; }

/* Tabs */
.wm-tabs { display: flex; gap: 4px; border-bottom: var(--hairline); margin-bottom: 20px; }
.wm-tab {
  appearance: none; background: transparent; border: 0; cursor: pointer;
  padding: 10px 14px; font-size: 14px; font-weight: 500; color: var(--ink-500);
  border-bottom: 2px solid transparent; margin-bottom: -1px; transition: 140ms;
}
.wm-tab:hover { color: var(--ink-800); }
.wm-tab[data-active="true"] { color: var(--accent-text); border-bottom-color: var(--accent); }
.wm-tab:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: var(--r-sm); }

/* KPIs */
.wm-kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }

/* Filter bar */
.wm-filterbar { margin-bottom: 18px; }
.wm-filter-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.wm-filter-spacer { flex: 1; }
.wm-search {
  display: flex; align-items: center; gap: 8px; background: var(--paper);
  border: var(--hairline); border-radius: var(--r-md); padding: 7px 10px; min-width: 240px;
  color: var(--ink-400);
}
.wm-search:focus-within { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.wm-search input { flex: 1; border: 0; outline: 0; background: transparent; min-width: 0; color: var(--ink-900); }
.wm-search-x { border: 0; background: transparent; cursor: pointer; color: var(--ink-400); display: flex; padding: 2px; }
.wm-search-x:hover { color: var(--ink-700); }

.wm-viewtoggle { display: flex; border: var(--hairline); border-radius: var(--r-md); overflow: hidden; }
.wm-viewtoggle button {
  border: 0; background: var(--paper); cursor: pointer; padding: 7px 10px;
  color: var(--ink-500); display: flex; align-items: center;
}
.wm-viewtoggle button[data-active="true"] { background: var(--accent-soft); color: var(--accent-text); }
.wm-viewtoggle button:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

.wm-filter-active { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 12.5px; flex-wrap: wrap; }
.wm-fchip {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500;
  background: var(--accent-soft); color: var(--accent-text);
  border-radius: var(--r-full); padding: 3px 6px 3px 11px;
}
.wm-fchip button { border: 0; background: transparent; cursor: pointer; color: inherit; display: flex; padding: 2px; border-radius: var(--r-full); }
.wm-fchip button:hover { background: rgba(0,0,0,0.06); }

/* Filters popover */
.wm-filter-pop-wrap { position: relative; }
.wm-filter-btn {
  display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
  border: var(--hairline); background: var(--paper); border-radius: var(--r-md);
  padding: 8px 12px; font: inherit; font-size: 13.5px; color: var(--ink-700);
}
.wm-filter-btn:hover { background: var(--ink-50); }
.wm-filter-btn[data-active="true"] { border-color: var(--accent); color: var(--accent-text); background: var(--accent-soft); }
.wm-filter-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.wm-filter-badge {
  font-size: 11px; font-weight: 700; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: var(--r-full); background: var(--accent); color: var(--paper);
  display: inline-grid; place-items: center;
}
.wm-filter-pop {
  position: absolute; left: 0; top: calc(100% + 6px); z-index: 50; width: 380px;
  max-width: calc(100vw - 40px); background: var(--paper); border: var(--hairline);
  border-radius: var(--r-lg); box-shadow: var(--shadow-lg); padding: 14px;
}
.wm-filter-pop-head { display: flex; align-items: center; justify-content: space-between; font-weight: 600; font-size: 13.5px; margin-bottom: 12px; }
.wm-filter-pop-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.wm-filter-pop-foot { display: flex; justify-content: flex-end; margin-top: 14px; }

.wm-linkbtn {
  border: 0; background: transparent; cursor: pointer; padding: 0;
  color: var(--accent-text); font: inherit; font-weight: 500; text-decoration: underline;
  text-underline-offset: 2px;
}
.wm-linkbtn:hover { color: var(--accent-hover); }
.wm-linkbtn[data-danger="true"] { color: var(--danger-text); }
.wm-linkbtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: var(--r-xs); }

/* Sections */
.wm-section { margin-bottom: 28px; }
.wm-section-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; margin: 0 0 12px; }

/* Card grid */
.wm-cardgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 14px; }

.wm-card {
  background: var(--paper); border: var(--hairline); border-radius: var(--r-lg);
  padding: 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow-xs);
  transition: box-shadow 140ms, border-color 140ms;
}
.wm-card:hover { box-shadow: var(--shadow-md); }
.wm-card[data-awaiting="true"] { border-color: var(--warning); }

.wm-card-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.wm-card-title { font-size: 15px; font-weight: 600; margin: 0; flex: 1; min-width: 0; }
.wm-card-code { color: var(--ink-500); font-weight: 500; }
.wm-card-head-right { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.wm-card-sub { font-size: 12.5px; margin-top: -6px; }
.wm-card-body { display: flex; flex-direction: column; gap: 8px; }
.wm-card-version { font-size: 13.5px; }
.wm-card-meta { font-size: 12.5px; display: flex; flex-direction: column; gap: 2px; }
.wm-card-foot { display: flex; align-items: center; gap: 8px; padding-top: 10px; border-top: var(--hairline); flex-wrap: wrap; }
.wm-card-foot-spacer { flex: 1; }

.wm-type-chip {
  font-size: 11px; font-weight: 700; letter-spacing: 0.04em; padding: 3px 7px;
  border-radius: var(--r-sm); text-transform: uppercase;
}

/* Violations */
.wm-viol-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.wm-viol { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 500; }
.wm-viol-open { color: var(--danger-text); }
.wm-viol-clean { color: var(--success-text); }
.wm-viol-meta { font-size: 12px; color: var(--ink-500); }

/* Advisories */
.wm-advisories { display: flex; flex-direction: column; gap: 6px; }
.wm-advisory {
  display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px;
  padding: 9px 11px; border-radius: var(--r-md); border: 1px solid transparent; line-height: 1.45;
}
.wm-advisory[data-tone="info"]    { background: var(--info-soft);    color: var(--info-text);    border-color: var(--info); }
.wm-advisory[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); border-color: var(--warning); }
.wm-advisory[data-tone="danger"]  { background: var(--danger-soft);  color: var(--danger-text);  border-color: var(--danger); }

.wm-reject-note {
  display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; line-height: 1.45;
  background: var(--danger-soft); color: var(--danger-text); padding: 9px 11px; border-radius: var(--r-md);
}

/* Inline extraction progress */
.wm-inline-prog { display: flex; align-items: center; gap: 10px; font-size: 12.5px; }
.wm-inline-prog-bar { flex: 1; height: 5px; background: var(--ink-100); border-radius: var(--r-full); overflow: hidden; }
.wm-inline-prog-fill { height: 100%; width: 40%; background: var(--accent); border-radius: var(--r-full); animation: wm-indet 1.5s ease-in-out infinite; }
@keyframes wm-indet { 0% { transform: translateX(-100%); } 100% { transform: translateX(280%); } }

.wm-progressbar { height: 6px; background: var(--ink-100); border-radius: var(--r-full); overflow: hidden; margin-top: 14px; }
.wm-progressbar-fill { height: 100%; background: var(--accent); border-radius: var(--r-full); transition: width 400ms ease; }

/* Menus */
.wm-menu-wrap { position: relative; }
.wm-icon-btn {
  border: var(--hairline); background: var(--paper); border-radius: var(--r-md); cursor: pointer;
  padding: 6px; color: var(--ink-600); display: flex; align-items: center;
}
.wm-icon-btn:hover { background: var(--ink-50); color: var(--ink-900); }
.wm-icon-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.wm-menu {
  position: absolute; right: 0; top: calc(100% + 4px); z-index: 40; min-width: 200px;
  background: var(--paper); border: var(--hairline); border-radius: var(--r-md);
  box-shadow: var(--shadow-lg); padding: 4px;
}
.wm-menu-item {
  display: flex; align-items: center; gap: 8px; width: 100%; text-align: left;
  border: 0; background: transparent; cursor: pointer; padding: 8px 10px;
  border-radius: var(--r-sm); font: inherit; font-size: 13px; color: var(--ink-800);
}
.wm-menu-item:hover:not(:disabled) { background: var(--ink-50); }
.wm-menu-item:disabled { color: var(--ink-400); cursor: not-allowed; }
.wm-menu-item[data-danger="true"]:not(:disabled) { color: var(--danger-text); }
.wm-menu-item:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

/* Table */
.wm-table-wrap { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); overflow-x: auto; }
.wm-table { width: 100%; min-width: 1080px; }
.wm-td-station { font-weight: 550; }
.wm-td-sub { font-size: 12px; margin-top: 2px; }
.wm-td-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }

/* File-name cell */
.wm-filename {
  display: inline-flex; align-items: center; gap: 7px; border: 0; background: transparent;
  cursor: pointer; padding: 0; font: inherit; color: var(--accent-text); font-weight: 550;
  text-align: left;
}
.wm-filename-text { text-decoration: underline; text-underline-offset: 2px; }
.wm-filename:hover .wm-filename-text { color: var(--accent-hover); }
.wm-filename:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: var(--r-xs); }

.wm-checkcell { display: inline-flex; align-items: center; gap: 5px; }
.wm-checkcell .icon { color: var(--ink-400); }
.wm-comment-count { display: inline-flex; align-items: center; gap: 5px; color: var(--ink-700); }
.wm-comment-count .icon { color: var(--warning); }
.wm-notes {
  display: inline-block; max-width: 240px; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; vertical-align: bottom; color: var(--ink-600);
}

/* File details modal */
.wm-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 24px; margin: 0 0 14px; }
.wm-detail-row { display: flex; align-items: baseline; gap: 10px; padding: 7px 0; border-bottom: var(--hairline); }
.wm-detail-label { font-size: 12px; color: var(--ink-500); font-weight: 500; min-width: 120px; margin: 0; }
.wm-detail-value { font-size: 13px; color: var(--ink-900); margin: 0; }
.wm-detail-block { margin: 12px 0; }
.wm-detail-notes { font-size: 13px; line-height: 1.5; margin: 6px 0 0; color: var(--ink-700); }
.wm-detail-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; padding-top: 14px; border-top: var(--hairline); }

/* Empty */
.wm-empty-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.wm-empty-actions { display: flex; gap: 10px; margin-top: -18px; }

/* Approval chain */
.wm-chain { display: grid; grid-template-columns: repeat(var(--wm-chain-n), minmax(0, 1fr)); gap: 0; margin: 4px 0; }
.wm-chain-node { display: flex; flex-direction: column; align-items: center; gap: 4px; position: relative; min-width: 0; padding: 0 2px; }
.wm-chain-line {
  position: absolute; top: 13px; right: 50%; width: 100%; height: 2px;
  background: var(--ink-200); z-index: 0;
}
.wm-chain-node[data-state="COMPLETE"] .wm-chain-line,
.wm-chain-node[data-state="CURRENT"] .wm-chain-line { background: var(--accent); }
.wm-chain-dot {
  position: relative; z-index: 1; width: 26px; height: 26px; border-radius: var(--r-full);
  display: grid; place-items: center; font-size: 11.5px; font-weight: 600; cursor: pointer;
  border: 2px solid var(--ink-300); background: var(--paper); color: var(--ink-500);
}
.wm-chain-node[data-state="COMPLETE"] .wm-chain-dot { background: var(--accent); border-color: var(--accent); color: var(--paper); }
.wm-chain-node[data-state="CURRENT"] .wm-chain-dot {
  border-color: var(--accent); color: var(--accent-text);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.wm-chain-node[data-state="REJECTED"] .wm-chain-dot { background: var(--danger); border-color: var(--danger); color: var(--paper); }
.wm-chain-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.wm-chain-label {
  font-size: 11px; text-align: center; line-height: 1.3; color: var(--ink-700);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
}
.wm-chain-actor { font-size: 10.5px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.wm-comment-window {
  display: flex; align-items: center; gap: 6px; font-size: 12.5px;
  padding: 7px 10px; border-radius: var(--r-md); background: var(--ink-50); color: var(--ink-600);
}
.wm-comment-window[data-open="true"] { background: var(--info-soft); color: var(--info-text); }

/* Upload */
.wm-upload-steps { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
.wm-upload-step { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--ink-400); }
.wm-upload-step-dot {
  width: 22px; height: 22px; border-radius: var(--r-full); display: grid; place-items: center;
  border: 1.5px solid var(--ink-300); font-size: 11px; font-weight: 600;
}
.wm-upload-step[data-state="active"] { color: var(--accent-text); font-weight: 600; }
.wm-upload-step[data-state="active"] .wm-upload-step-dot { border-color: var(--accent); color: var(--accent-text); background: var(--accent-soft); }
.wm-upload-step[data-state="done"] { color: var(--success-text); }
.wm-upload-step[data-state="done"] .wm-upload-step-dot { background: var(--success); border-color: var(--success); color: var(--paper); }
.wm-upload-body { min-height: 260px; }

.wm-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.wm-form-full { grid-column: 1 / -1; }

.wm-drop {
  border: 2px dashed var(--ink-300); border-radius: var(--r-lg); padding: 28px;
  display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
  color: var(--ink-500); background: var(--ink-50); transition: 140ms;
}
.wm-drop:hover, .wm-drop[data-dragging="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-text); }
.wm-drop:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.wm-drop-title { font-size: 14px; font-weight: 600; color: var(--ink-800); }

.wm-sample-row { display: flex; align-items: center; gap: 10px; margin: 10px 0; font-size: 12.5px; flex-wrap: wrap; }
.wm-filelist { display: flex; flex-direction: column; gap: 8px; }
.wm-filelist-empty { font-size: 13px; padding: 8px 0; }
.wm-file {
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px;
  border: var(--hairline); border-radius: var(--r-md); background: var(--paper);
}
.wm-file[data-ok="false"] { border-color: var(--danger); background: var(--danger-soft); color: var(--danger-text); }
.wm-file-main { flex: 1; min-width: 0; }
.wm-file-name { font-size: 13px; font-weight: 550; word-break: break-word; }
.wm-file-meta { font-size: 12px; }
.wm-file-error { font-size: 12px; color: var(--danger-text); line-height: 1.4; margin-top: 2px; }

.wm-validation { display: flex; flex-direction: column; gap: 12px; }
.wm-validation-summary { display: flex; gap: 16px; flex-wrap: wrap; }

.wm-checklist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.wm-check-row {
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px;
  border: var(--hairline); border-radius: var(--r-md); font-size: 13px;
}
.wm-check-row[data-pass="true"]  { color: var(--success-text); border-color: var(--success); background: var(--success-soft); }
.wm-check-row[data-pass="false"] { color: var(--danger-text);  border-color: var(--danger);  background: var(--danger-soft); }
.wm-check-main { flex: 1; min-width: 0; }
.wm-check-label { font-weight: 550; color: var(--ink-900); }

.wm-modal-foot { display: flex; align-items: center; gap: 10px; width: 100%; }
.wm-modal-foot-msg { flex: 1; min-width: 0; }

.wm-submit-section { margin-bottom: 20px; }
.wm-route-choices { display: flex; flex-direction: column; gap: 8px; }
.wm-route {
  display: flex; gap: 10px; align-items: flex-start; padding: 11px 13px; cursor: pointer;
  border: var(--hairline); border-radius: var(--r-md); font-size: 13px;
}
.wm-route[data-selected="true"] { border-color: var(--accent); background: var(--accent-soft); }
.wm-route-label { font-weight: 600; }

/* Extraction / review screens */
.wm-review-page { display: flex; flex-direction: column; height: 100%; min-height: 0; background: var(--canvas); }
.wm-review-head {
  display: flex; align-items: center; gap: 14px; padding: 14px 20px;
  border-bottom: var(--hairline); background: var(--paper); flex-wrap: wrap;
}
.wm-review-title { font-size: 16px; font-weight: 600; margin: 0; }
.wm-review-head-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.wm-backbtn {
  display: flex; align-items: center; gap: 4px; border: var(--hairline); background: var(--paper);
  border-radius: var(--r-md); padding: 6px 10px; cursor: pointer; font: inherit; font-size: 13px; color: var(--ink-700);
}
.wm-backbtn:hover { background: var(--ink-50); }
.wm-backbtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }

.wm-review-split { flex: 1; display: flex; min-height: 0; }
.wm-review-canvas { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 14px; gap: 10px; }
.wm-review-panel {
  width: 380px; flex-shrink: 0; border-left: var(--hairline); background: var(--paper);
  overflow-y: auto; padding: 14px;
}

.wm-layer-toggles { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12.5px; }
.wm-layer-toggle { display: flex; align-items: center; gap: 5px; cursor: pointer; color: var(--ink-700); }

.wm-canvas { flex: 1; min-height: 0; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); overflow: hidden; position: relative; }
.wm-canvas-svg { width: 100%; height: 100%; display: block; }
.wm-shape { cursor: pointer; }
.wm-shape:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.wm-marker { animation: wm-pulse 1.8s ease-in-out infinite; }
@keyframes wm-pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
.wm-canvas-legend {
  position: absolute; left: 12px; bottom: 12px; display: flex; gap: 14px; flex-wrap: wrap;
  background: var(--paper); border: var(--hairline); border-radius: var(--r-md);
  padding: 7px 11px; font-size: 11.5px; color: var(--ink-600); box-shadow: var(--shadow-sm);
}
.wm-canvas-legend span { display: flex; align-items: center; gap: 5px; }
.wm-canvas-legend i { width: 12px; height: 3px; border-radius: var(--r-full); display: inline-block; }

.wm-extract-shell { flex: 1; display: grid; place-items: center; padding: 40px; }
.wm-extract-progress { width: min(560px, 100%); background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); padding: 24px; }
.wm-extract-phases { display: flex; flex-direction: column; gap: 12px; }
.wm-extract-phase { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-400); }
.wm-extract-phase-dot {
  width: 24px; height: 24px; border-radius: var(--r-full); display: grid; place-items: center;
  border: 1.5px solid var(--ink-300); font-size: 11px; font-weight: 600;
}
.wm-extract-phase[data-state="active"] { color: var(--accent-text); font-weight: 600; }
.wm-extract-phase[data-state="active"] .wm-extract-phase-dot { border-color: var(--accent); background: var(--accent-soft); }
.wm-extract-phase[data-state="done"] { color: var(--success-text); }
.wm-extract-phase[data-state="done"] .wm-extract-phase-dot { background: var(--success); border-color: var(--success); color: var(--paper); }
.wm-pulse-dot { width: 8px; height: 8px; border-radius: var(--r-full); background: var(--accent); animation: wm-pulse 1.2s ease-in-out infinite; }

.wm-panel-section { margin-bottom: 22px; }
.wm-panel-title { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; margin: 0 0 10px; }
.wm-panel-count {
  font-size: 11.5px; font-weight: 600; background: var(--ink-100); color: var(--ink-600);
  padding: 1px 7px; border-radius: var(--r-full);
}
.wm-panel-count[data-tone="danger"]  { background: var(--danger-soft);  color: var(--danger-text); }
.wm-panel-count[data-tone="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.wm-panel-hint { font-size: 12.5px; margin: 0 0 10px; line-height: 1.45; }

.wm-asset {
  border: var(--hairline); border-radius: var(--r-md); padding: 10px 12px; margin-bottom: 8px;
  cursor: pointer; background: var(--paper); transition: 140ms;
}
.wm-asset:hover { border-color: var(--ink-300); }
.wm-asset[data-selected="true"] { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.wm-asset[data-state="CONFIRMED"], .wm-asset[data-state="CORRECTED"] { background: var(--success-soft); }
.wm-asset[data-state="REJECTED"] { background: var(--ink-50); opacity: 0.75; }
.wm-asset-head { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.wm-asset-type { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-500); }
.wm-asset-label { font-size: 13px; font-weight: 550; flex: 1; min-width: 0; }
.wm-asset-meta { font-size: 11.5px; margin-top: 3px; }
.wm-asset-actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
.wm-asset-done { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 12px; color: var(--success-text); }

.wm-review-foot {
  display: flex; align-items: center; gap: 10px; padding: 12px 20px;
  border-top: var(--hairline); background: var(--paper); flex-wrap: wrap;
}
.wm-review-foot-spacer { flex: 1; }

.wm-approverbar {
  display: flex; align-items: center; gap: 10px; padding: 10px 20px; flex-wrap: wrap;
  background: var(--warning-soft); color: var(--warning-text); border-bottom: var(--hairline); font-size: 13px;
}

/* Comments */
.wm-comment { border: var(--hairline); border-radius: var(--r-md); padding: 11px 13px; margin-bottom: 10px; background: var(--paper); }
.wm-comment[data-anchored="true"] { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.wm-comment-head { display: flex; align-items: center; gap: 8px; }
.wm-avatar {
  width: 28px; height: 28px; border-radius: var(--r-full); background: var(--accent-soft);
  color: var(--accent-text); display: grid; place-items: center; font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.wm-avatar-sm { width: 22px; height: 22px; font-size: 10px; }
.wm-comment-who { flex: 1; min-width: 0; font-size: 12px; }
.wm-comment-name { font-size: 13px; font-weight: 600; }
.wm-comment-text { font-size: 13px; line-height: 1.5; margin: 8px 0; }
.wm-comment-foot { display: flex; align-items: center; gap: 10px; font-size: 11.5px; flex-wrap: wrap; }
.wm-comment-foot-spacer { flex: 1; }
.wm-comment-actions { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; }
.wm-attachments { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.wm-attachment {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px;
  background: var(--ink-50); border-radius: var(--r-sm); padding: 3px 7px;
}
.wm-replies { margin-top: 8px; padding-left: 12px; border-left: 2px solid var(--ink-200); }
.wm-reply { margin-top: 8px; font-size: 12.5px; }

.wm-newcomment {
  position: sticky; bottom: 0; background: var(--paper); border-top: var(--hairline);
  padding-top: 12px; display: flex; flex-direction: column; gap: 8px;
}
.wm-newcomment-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.wm-anchor-chip {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px;
  background: var(--accent-soft); color: var(--accent-text); border-radius: var(--r-full); padding: 3px 5px 3px 9px;
}
.wm-anchor-chip button { border: 0; background: transparent; cursor: pointer; color: inherit; display: flex; padding: 2px; }

/* Toast */
.wm-toast {
  position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%); z-index: 300;
  display: flex; align-items: center; gap: 9px; max-width: min(560px, calc(100vw - 40px));
  background: var(--ink-900); color: var(--paper); padding: 11px 16px;
  border-radius: var(--r-md); box-shadow: var(--shadow-lg); font-size: 13px; line-height: 1.45;
}
.wm-toast[data-tone="danger"] { background: var(--danger); }

@media (max-width: 1180px) {
  .wm-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wm-cardgrid { grid-template-columns: 1fr; }
  .wm-review-panel { width: 320px; }
  .wm-form-grid { grid-template-columns: 1fr; }
  .wm-detail-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .wm-inline-prog-fill { animation: none; width: 100%; }
  .wm-marker, .wm-pulse-dot { animation: none; }
  .wm-progressbar-fill { transition: none; }
  .wm-card, .wm-asset, .wm-tab { transition: none; }
}
`;

  /* ═══════════════════════ Exports ═══════════════════════ */

  window.WorkspaceModulePage = WorkspaceModulePage;
  window.useWorkspaceCounts = useWorkspaceCounts;
  // Exposed for debugging and for other screens that want to read workspace state.
  window.WorkspaceModuleStore = store;
  window.WorkspaceModuleActions = {
    createDraftFromUpload, createRevision, startExtraction, completeExtraction,
    runSodCheck, submitBlockers, submitForApproval, recallSubmission,
    approveStage, rejectStage, transferOwnership, deleteDraft,
    addComment, setCommentState, validateFile,
  };

  /* ═══════════════════════ My Files styles (mockup) ═══════════════════════ */
  const mfCSS = `
/* Fill the shell edge-to-edge and full height, like the Digital Library content area. */
.mf-page { padding: 26px 34px 40px; width: 100%; min-height: 100%; box-sizing: border-box; background: #f6f7f9; }
@media (max-width: 900px) { .mf-page { padding: 20px 16px 32px; } }

/* Tabs */
.mf-tabs { display: flex; gap: 26px; margin-top: 20px; border-bottom: 1px solid #e7eaee; }
.mf-tab {
  background: none; border: none; padding: 0 2px 12px; font-size: 14px; font-weight: 500;
  color: #64748b; cursor: pointer; margin-bottom: -1px; font-family: inherit;
}
.mf-tab:hover { color: #334155; }
.mf-tab[data-active="true"] { color: #4338ca; font-weight: 600; border-bottom: 2.5px solid #4338ca; }
.mf-tab:focus-visible { outline: 2px solid #4338ca; outline-offset: 2px; border-radius: 4px; }

/* Header buttons */
.mf-btn-ghost, .mf-btn-primary {
  display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 13.5px;
  font-weight: 600; border-radius: 9px; cursor: pointer; font-family: inherit;
}
.mf-btn-ghost { border: 1px solid #d4d8e0; background: #fff; color: #334155; }
.mf-btn-ghost:hover { background: #f8fafc; border-color: #c3c9d4; }
.mf-btn-primary { border: 1px solid #4338ca; background: #4338ca; color: #fff; box-shadow: 0 1px 3px rgba(67,56,202,.4); }
.mf-btn-primary:hover { background: #3730a3; }
.mf-btn-ghost:focus-visible, .mf-btn-primary:focus-visible { outline: 2px solid #4338ca; outline-offset: 2px; }

/* Stat cards */
.mf { margin-top: 0; }
.mf-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-top: 22px; }
.mf-stat {
  text-align: left; cursor: pointer; background: #fff; border-radius: 14px; padding: 16px 17px;
  transition: all .12s; outline: none; font-family: inherit;
}
.mf-stat:hover { transform: translateY(-1px); }
.mf-stat:focus-visible { outline: 2px solid #4338ca; outline-offset: 2px; }

/* Card shell */
.mf-card {
  margin-top: 24px; background: #fff; border: 1px solid #e7eaee; border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15,23,42,.04);
}
.mf-controls { display: flex; align-items: center; gap: 12px; padding: 14px 16px; flex-wrap: wrap; }

.mf-search { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
.mf-search-ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; display: flex; }
.mf-search input {
  width: 100%; padding: 9px 12px 9px 36px; border: 1px solid #d4d8e0; border-radius: 9px;
  font-size: 13.5px; font-family: inherit; outline: none; background: #fff; color: #1e293b;
}
.mf-search input:focus { border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }

.mf-select:focus { border-color: #818cf8; box-shadow: 0 0 0 3px rgba(99,102,241,.15); }

.mf-viewtoggle { display: flex; border: 1px solid #d4d8e0; border-radius: 9px; overflow: hidden; }
.mf-viewtoggle button { padding: 8px 10px; background: #fff; color: #94a3b8; border: none; cursor: pointer; display: flex; }
.mf-viewtoggle button + button { border-left: 1px solid #e7eaee; }
.mf-viewtoggle button[data-active="true"] { background: #eef2ff; color: #4338ca; }
.mf-viewtoggle button:focus-visible { outline: 2px solid #4338ca; outline-offset: -2px; }

/* Chips */
.mf-chips { display: flex; align-items: center; gap: 8px; padding: 0 16px 14px; flex-wrap: wrap; }
.mf-chip {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px 4px 11px;
  background: #eef2ff; color: #4338ca; border: 1px solid #dfe3fb; border-radius: 20px;
  font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit;
}
.mf-chip:hover { background: #e0e7ff; }
.mf-clear { background: none; border: none; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; padding: 4px 6px; font-family: inherit; }
.mf-clear:hover { color: #334155; }

/* Table — table-layout: fixed + a <colgroup> keep every column's width constant no
   matter how long a file name or note gets; long text truncates with an ellipsis and
   the full value shows via the native title tooltip on hover instead of pushing columns. */
.mf-tablewrap { overflow-x: auto; border-top: 1px solid #eef0f3; }
.mf-table { width: 100%; border-collapse: collapse; min-width: 1120px; table-layout: fixed; }
.mf-table thead tr { background: #fafbfc; }
.mf-table th { font-size: 11px; font-weight: 600; letter-spacing: .06em; color: #94a3b8; padding: 12px 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mf-table th:not(:first-child):not(:last-child) { padding: 12px 12px; }
.mf-th-sortable:hover { color: #4338ca; background: #f5f6fb; }
.mf-th-sortable[data-active="true"] { color: #4338ca; }
.mf-table td { padding: 14px 12px; border-top: 1px solid #eef0f3; overflow: hidden; }
.mf-table td:first-child { padding: 14px 16px; }
.mf-table td:last-child { padding: 14px 16px; white-space: nowrap; }
.mf-table tbody tr { transition: background .1s; }

/* Generic single-line ellipsis truncation with a native tooltip (title attr) on the same element. */
.mf-ellip { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; max-width: 100%; }

.mf-filename {
  font-size: 13.5px; font-weight: 600; color: #1e293b; display: flex; align-items: center;
  gap: 6px; background: none; border: none; padding: 0; cursor: pointer; font-family: inherit;
  text-align: left; width: 100%; min-width: 0;
}
.mf-filename-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mf-filename:hover .mf-filename-text { color: #4338ca; }
.mf-filename:focus-visible { outline: 2px solid #4338ca; outline-offset: 2px; border-radius: 4px; }
.mf-notes {
  font-size: 12.5px; color: #64748b; line-height: 1.4; display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.mf-details {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid #d4d8e0;
  background: #fff; color: #475569; font-size: 12.5px; font-weight: 600; border-radius: 8px; cursor: pointer; font-family: inherit;
}
.mf-details:hover { background: #f1f5f9; border-color: #c3c9d4; color: #334155; }
.mf-details:focus-visible { outline: 2px solid #4338ca; outline-offset: 1px; }

/* Footer */
.mf-foot { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-top: 1px solid #eef0f3; flex-wrap: wrap; }
.mf-pgbtn {
  padding: 6px 12px; border: 1px solid #e2e6ec; background: #fff; color: #475569;
  font-size: 12.5px; font-weight: 600; border-radius: 8px; cursor: pointer; font-family: inherit;
}
.mf-pgbtn:hover:not(:disabled):not([data-active="true"]) { background: #f8fafc; }
.mf-pgbtn:disabled { color: #94a3b8; cursor: not-allowed; }
.mf-pgbtn[data-active="true"] { border-color: #4338ca; background: #4338ca; color: #fff; cursor: pointer; }

@media (prefers-reduced-motion: reduce) { .mf-stat, .mf-table tbody tr { transition: none; } .mf-stat:hover { transform: none; } }
`;

  const revisionCSS = `
/* Revision workspace — intentionally reuses the library shell, panels and tokens. */
.rw-page { min-height: 100%; display: flex; flex-direction: column; background: var(--canvas); color: var(--ink-800); }
.rw-header { display: flex; align-items: center; gap: 14px; min-height: 86px; padding: 13px 20px; background: var(--paper); border-bottom: var(--hairline); flex-wrap: wrap; }
.rw-back { display: inline-flex; align-items: center; gap: 4px; border: 0; background: transparent; padding: 6px 0; color: var(--ink-600); font: inherit; font-size: 12.5px; font-weight: 650; cursor: pointer; }
.rw-back:hover { color: var(--accent-text); }
.rw-head-copy { min-width: 280px; flex: 1; }
.rw-title-line { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rw-title-line h1 { margin: 0; color: var(--ink-900); font-size: 18px; font-weight: 700; letter-spacing: -.015em; line-height: 1.25; }
.rw-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-top: 5px; color: var(--ink-500); font-size: 11.5px; }
.rw-meta i { width: 3px; height: 3px; display: block; border-radius: 50%; background: var(--ink-300); }
.rw-save-state { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; color: var(--success-text); font-size: 11.5px; font-weight: 600; }
.rw-header-actions { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

.rw-toolbar { display: flex; align-items: center; gap: 12px; min-height: 53px; padding: 8px 16px; background: var(--paper); border-bottom: var(--hairline); }
.rw-breadcrumb { min-width: 0; display: flex; align-items: center; gap: 7px; color: var(--ink-600); font-size: 12px; }
.rw-breadcrumb > span:not(.rw-baseline) { max-width: 176px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rw-baseline { display: inline-flex; align-items: center; gap: 4px; padding: 3px 7px; border-radius: var(--r-full); background: var(--ink-100); color: var(--ink-600); font-family: var(--font-mono); font-size: 10.5px; white-space: nowrap; }
.rw-doc-mark { width: 28px; height: 22px; flex-shrink: 0; display: inline-grid; place-items: center; border: 1px solid var(--ink-200); border-radius: var(--r-xs); background: var(--accent-soft); color: var(--accent-text); font-family: var(--font-mono); font-size: 10px; font-weight: 800; letter-spacing: .025em; }
.rw-doc-mark[data-type="SIP"] { background: var(--info-soft); color: var(--info-text); }
.rw-doc-mark[data-type="LOP"] { background: var(--warning-soft); color: var(--warning-text); }
.rw-doc-mark[data-type="SUP"] { background: var(--ink-100); color: var(--ink-600); }
.rw-view-modes { display: inline-flex; align-items: center; margin-left: auto; padding: 3px; border: var(--hairline); border-radius: var(--r-md); background: var(--ink-50); overflow-x: auto; }
.rw-view-modes button { border: 0; border-radius: var(--r-sm); background: transparent; padding: 6px 9px; color: var(--ink-500); font: inherit; font-size: 11.5px; font-weight: 650; white-space: nowrap; cursor: pointer; }
.rw-view-modes button:hover { color: var(--ink-800); }
.rw-view-modes button[data-active="true"] { background: var(--paper); color: var(--accent-text); box-shadow: var(--shadow-xs); }
.rw-more { display: grid; place-items: center; width: 28px; height: 28px; border: 0; border-radius: var(--r-sm); background: transparent; color: var(--ink-600); cursor: pointer; }
.rw-more:hover { background: var(--ink-100); }

.rw-work-area { flex: 1; min-height: 620px; display: grid; grid-template-columns: 214px minmax(440px, 1fr) 326px; overflow: hidden; }
.rw-left-panel { display: flex; flex-direction: column; min-width: 0; padding: 15px 10px; border-right: var(--hairline); background: var(--paper); overflow-y: auto; }
.rw-panel-heading { padding: 0 9px 8px; color: var(--ink-500); font-size: 10.5px; font-weight: 800; letter-spacing: .075em; text-transform: uppercase; }
.rw-doc-tree, .rw-info-tree { display: flex; flex-direction: column; gap: 2px; }
.rw-tree-row, .rw-info-row { width: 100%; display: flex; align-items: center; gap: 8px; border: 0; border-radius: var(--r-sm); background: transparent; padding: 8px 9px; color: var(--ink-700); font: inherit; text-align: left; cursor: pointer; }
.rw-tree-row:hover, .rw-info-row:hover { background: var(--ink-50); }
.rw-tree-row[data-active="true"], .rw-info-row[data-active="true"] { background: var(--accent-soft); color: var(--accent-text); }
.rw-tree-row .rw-doc-mark { width: 24px; height: 20px; font-size: 9px; }
.rw-tree-main { min-width: 0; display: grid; gap: 2px; }
.rw-tree-main strong { font-size: 12.5px; font-weight: 700; }
.rw-tree-main small { color: var(--ink-500); font-size: 10.5px; }
.rw-tree-alert { margin-left: auto; color: var(--warning-text); }
.rw-left-divider { height: 1px; margin: 14px 9px; background: var(--ink-200); }
.rw-info-row { min-height: 33px; font-size: 12px; font-weight: 600; }
.rw-info-row span:not(.rw-nav-count) { flex: 1; }
.rw-nav-count { min-width: 18px; height: 18px; display: inline-grid; place-items: center; border-radius: var(--r-full); background: var(--ink-100); color: var(--ink-600); font-family: var(--font-mono); font-size: 10px; }
.rw-nav-count[data-warning="true"] { background: var(--warning-soft); color: var(--warning-text); }
.rw-team-brief { display: flex; align-items: center; gap: 9px; margin: auto 4px 0; padding: 12px 7px 1px; border-top: var(--hairline); }
.rw-team-brief > div:last-child { display: grid; gap: 2px; }
.rw-team-brief strong { color: var(--ink-700); font-size: 11.5px; }
.rw-team-brief small { color: var(--ink-500); font-size: 10.5px; }
.rw-team-avatars { display: flex; padding-left: 4px; }
.rw-team-avatars span { width: 24px; height: 24px; display: grid; place-items: center; margin-left: -4px; border: 2px solid var(--paper); border-radius: var(--r-full); background: var(--accent-soft); color: var(--accent-text); font-size: 8.5px; font-weight: 800; }
.rw-team-avatars span:nth-child(2) { background: var(--info-soft); color: var(--info-text); }
.rw-team-avatars span:nth-child(3) { background: var(--warning-soft); color: var(--warning-text); }
.rw-team-avatars span:nth-child(4) { background: var(--ink-100); color: var(--ink-600); }

.rw-editor { min-width: 0; display: flex; flex-direction: column; background: var(--canvas); }
.rw-editor-context { display: flex; align-items: center; gap: 7px; min-height: 37px; padding: 0 14px; color: var(--ink-500); font-size: 11.5px; border-bottom: var(--hairline); background: color-mix(in srgb, var(--paper) 78%, var(--canvas)); }
.rw-editor-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-300); }
.rw-editor-spacer { flex: 1; }
.rw-editor-context button { display: grid; place-items: center; min-width: 26px; min-height: 24px; border: 0; border-radius: var(--r-sm); background: transparent; color: var(--ink-600); font: inherit; font-size: 11px; cursor: pointer; }
.rw-editor-context button:hover { background: var(--ink-100); }
.rw-canvas-wrap { flex: 1; min-height: 0; display: grid; padding: 15px; background-color: var(--canvas); background-image: linear-gradient(var(--ink-100) 1px, transparent 1px), linear-gradient(90deg, var(--ink-100) 1px, transparent 1px); background-size: 22px 22px; }
.rw-canvas-wrap[data-side-by-side="true"] { grid-template-columns: repeat(2, minmax(300px, 1fr)); gap: 14px; overflow-x: auto; }
.rw-plan { position: relative; min-width: 0; height: 100%; min-height: 390px; display: flex; flex-direction: column; padding: 12px; border: var(--hairline); border-radius: var(--r-lg); background: var(--paper); box-shadow: var(--shadow-sm); overflow: hidden; }
.rw-plan-topline { display: flex; justify-content: space-between; gap: 10px; color: var(--ink-500); font-size: 10.5px; font-weight: 700; letter-spacing: .045em; text-transform: uppercase; }
.rw-plan-label { margin: -2px 0 9px; color: var(--ink-800); font-size: 12px; font-weight: 700; }
.rw-plan-svg { width: 100%; flex: 1; min-height: 260px; margin-top: 10px; }
.rw-plan-scale { display: flex; align-items: center; gap: 6px; margin: 3px 4px 0; color: var(--ink-500); font-family: var(--font-mono); font-size: 10px; }
.rw-plan-scale span { width: 56px; height: 3px; display: inline-block; background: var(--ink-600); }
.rw-canvas-foot { display: flex; align-items: center; gap: 13px; min-height: 35px; padding: 0 14px; background: var(--paper); border-top: var(--hairline); color: var(--ink-500); font-size: 10.5px; }
.rw-canvas-foot span { display: inline-flex; align-items: center; gap: 5px; }
.rw-canvas-foot i { width: 14px; height: 3px; display: block; border-radius: var(--r-full); }
.rw-canvas-foot i[data-change="new"] { background: var(--danger); }
.rw-canvas-foot i[data-change="previous"] { background: var(--success); }
.rw-canvas-foot-spacer { flex: 1; }

.rw-right-panel { min-width: 0; padding: 15px; border-left: var(--hairline); background: var(--paper); overflow-y: auto; }
.rw-side-section { padding: 0 0 15px; margin: 0 0 15px; border-bottom: var(--hairline); }
.rw-side-section:last-child { border-bottom: 0; margin-bottom: 0; }
.rw-side-section[data-focus="true"] { margin-left: -8px; margin-right: -8px; padding: 9px 8px 15px; border-radius: var(--r-md); background: var(--accent-soft); }
.rw-side-title, .rw-side-title-row { margin: 0 0 9px; color: var(--ink-800); font-size: 12.5px; font-weight: 750; }
.rw-side-title-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.rw-side-title-row .rw-side-title { margin: 0; }
.rw-key-values { display: grid; gap: 9px; margin: 0; }
.rw-key-values div { display: grid; gap: 2px; }
.rw-key-values dt { color: var(--ink-500); font-size: 10.5px; font-weight: 600; }
.rw-key-values dd { margin: 0; color: var(--ink-700); font-size: 11.5px; line-height: 1.4; }
.rw-change-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
.rw-change-grid div { display: grid; gap: 2px; padding: 8px; border: var(--hairline); border-radius: var(--r-sm); background: var(--canvas); }
.rw-change-grid strong { color: var(--ink-900); font-family: var(--font-mono); font-size: 16px; }
.rw-change-grid span { color: var(--ink-500); font-size: 10px; line-height: 1.25; }
.rw-impact-note { display: flex; align-items: flex-start; gap: 6px; margin-top: 9px; padding: 8px; border-radius: var(--r-sm); background: var(--warning-soft); color: var(--warning-text); font-size: 10.5px; line-height: 1.4; }
.rw-impact-note svg { flex-shrink: 0; margin-top: 1px; }
.rw-check-list { display: grid; gap: 7px; margin: 0; padding: 0; list-style: none; }
.rw-check-list li { display: flex; align-items: flex-start; gap: 7px; color: var(--ink-600); }
.rw-check-list li[data-tone="success"] { color: var(--success-text); }
.rw-check-list li[data-tone="warning"] { color: var(--warning-text); }
.rw-check-list li[data-tone="info"] { color: var(--info-text); }
.rw-check-list li > span { display: grid; gap: 1px; color: var(--ink-700); }
.rw-check-list strong { font-size: 11.5px; }
.rw-check-list small { color: var(--ink-500); font-size: 10px; line-height: 1.25; }
.rw-link { border: 0; background: transparent; padding: 0; color: var(--accent-text); font: inherit; font-size: 10.5px; font-weight: 700; cursor: pointer; }
.rw-link:hover { text-decoration: underline; }
.rw-comment-brief { display: flex; gap: 7px; padding: 8px 0; border-top: var(--hairline); }
.rw-comment-brief:first-of-type { border-top: 0; }
.rw-comment-brief .wm-avatar { width: 24px; height: 24px; font-size: 9px; }
.rw-comment-brief p { margin: 0; color: var(--ink-700); font-size: 10.5px; line-height: 1.38; }
.rw-comment-brief small { color: var(--ink-500); }
.rw-access-link { display: inline-flex; align-items: center; gap: 5px; margin-top: 7px; border: 0; background: transparent; padding: 0; color: var(--accent-text); font: inherit; font-size: 11px; font-weight: 700; cursor: pointer; }

.rw-bottom-bar { display: flex; align-items: center; gap: 14px; min-height: 48px; padding: 9px 18px; border-top: var(--hairline); background: var(--paper); color: var(--ink-500); font-size: 10.5px; line-height: 1.35; }
.rw-bottom-bar > span { flex: 1; }
.rw-bottom-bar > div { display: flex; gap: 12px; }
.rw-bottom-bar button { border: 0; background: transparent; padding: 3px; color: var(--ink-600); font: inherit; font-size: 11px; font-weight: 650; cursor: pointer; }
.rw-bottom-bar button:hover { color: var(--accent-text); }
.rw-bottom-bar button[data-danger="true"] { color: var(--danger-text); }
.rw-submit-note { display: flex; align-items: flex-start; gap: 9px; padding: 11px; border: var(--hairline); border-radius: var(--r-md); background: var(--ink-50); color: var(--ink-700); font-size: 12.5px; line-height: 1.45; }
.rw-submit-note svg { flex-shrink: 0; color: var(--ink-500); }
.rw-submit-summary { display: grid; grid-template-columns: auto 1fr; gap: 8px 14px; margin-top: 16px; color: var(--ink-500); font-size: 12px; }
.rw-submit-summary strong { color: var(--ink-800); }

/* Create Revision document picker */
.rp-page { min-height: 100%; display: flex; flex-direction: column; background: var(--canvas); }
.rp-breadcrumb-bar { min-height: 64px; display: flex; align-items: center; padding: 0 28px; border-bottom: var(--hairline); background: rgba(255,255,255,.94); box-shadow: 0 1px 0 rgba(10,37,64,.03); }
.rp-header { display: flex; align-items: center; gap: 15px; min-height: 86px; padding: 14px 22px; border-bottom: var(--hairline); background: var(--paper); }
.rp-head-copy { min-width: 0; flex: 1; }
.rp-head-copy h1 { margin: 0; color: var(--ink-900); font-size: 20px; font-weight: 750; letter-spacing: -.018em; }
.rp-head-copy p { margin: 4px 0 0; color: var(--ink-500); font-size: 12px; line-height: 1.4; }
.rp-head-note { display: inline-flex; align-items: center; gap: 6px; color: var(--success-text); font-size: 11.5px; font-weight: 650; white-space: nowrap; }
.rp-content { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(600px, 1fr) 334px; }
.rp-library { min-width: 0; padding: 20px 22px 30px; overflow-y: auto; }
.rp-filter-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.rp-filter-head h2, .rp-selection-head h2 { margin: 0; color: var(--ink-800); font-size: 15px; font-weight: 750; }
.rp-filter-head p { margin: 4px 0 0; color: var(--ink-500); font-size: 12px; }
.rp-reset { border: 0; background: transparent; padding: 3px; color: var(--accent-text); font: inherit; font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.rp-reset:hover { text-decoration: underline; }
.rp-filter-panel { padding: 14px; border: var(--hairline); border-radius: var(--r-lg); background: var(--paper); box-shadow: var(--shadow-xs); }
.rp-filter-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 11px; }
.rp-search-field { grid-column: 1 / -1; }
.rp-result-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 12px 2px 9px; color: var(--ink-500); font-size: 11px; }
.rp-result-meta strong { color: var(--ink-800); font-family: var(--font-mono); }
.rp-file-card { overflow: hidden; border: var(--hairline); border-radius: var(--r-lg); background: var(--paper); box-shadow: var(--shadow-xs); }
.rp-file-head, .rp-file-row { display: grid; grid-template-columns: 20px minmax(200px, 1.65fr) 94px 104px minmax(125px, 1fr) 102px 100px; align-items: center; gap: 10px; }
.rp-file-head { min-height: 38px; padding: 0 13px; background: var(--ink-50); color: var(--ink-500); font-size: 9.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
.rp-file-list { max-height: min(54vh, 520px); overflow-y: auto; }
.rp-file-row { width: 100%; min-height: 65px; border: 0; border-top: var(--hairline); background: var(--paper); padding: 8px 13px; color: var(--ink-700); font: inherit; text-align: left; cursor: pointer; }
.rp-file-row:hover { background: var(--ink-50); }
.rp-file-row[data-selected="true"] { background: var(--accent-soft); box-shadow: inset 3px 0 0 var(--accent); }
.rp-radio { width: 16px; height: 16px; display: block; border: 1.5px solid var(--ink-300); border-radius: var(--r-full); }
.rp-radio[data-selected="true"] { border: 5px solid var(--accent); }
.rp-document { min-width: 0; display: flex; align-items: center; gap: 8px; }
.rp-document > span { min-width: 0; display: grid; gap: 2px; }
.rp-document strong { overflow: hidden; color: var(--ink-800); font-family: var(--font-mono); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.rp-document small, .rp-station small { color: var(--ink-500); font-size: 10.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rp-document-type { display: flex; align-items: center; gap: 6px; min-width: 0; color: var(--ink-700); font-size: 11px; }
.rp-document-type .rw-doc-mark { width: 24px; height: 20px; font-size: 9px; }
.rp-document-type strong { font-size: 11px; }
.rp-station, .rp-generated { display: grid; gap: 2px; min-width: 0; }
.rp-station strong, .rp-generated strong { overflow: hidden; color: var(--ink-700); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.rp-updated { color: var(--ink-600); font-size: 10.5px; white-space: nowrap; }
.rp-empty { min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 26px; color: var(--ink-500); font-size: 12px; text-align: center; }
.rp-empty svg { color: var(--ink-400); }
.rp-empty strong { color: var(--ink-700); font-size: 13px; }
.rp-selection { min-width: 0; display: flex; flex-direction: column; padding: 20px; border-left: var(--hairline); background: var(--paper); }
.rp-selection-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-bottom: 13px; border-bottom: var(--hairline); }
.rp-selection-head span { color: var(--ink-500); font-size: 10.5px; }
.rp-selected-file { display: flex; align-items: flex-start; gap: 9px; padding: 15px 0; border-bottom: var(--hairline); }
.rp-selected-file > div { min-width: 0; display: grid; gap: 3px; }
.rp-selected-file strong { overflow: hidden; color: var(--ink-800); font-family: var(--font-mono); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.rp-selected-file span { color: var(--ink-500); font-size: 11px; line-height: 1.35; }
.rp-details { display: grid; gap: 11px; margin: 15px 0; }
.rp-details div { display: grid; gap: 3px; }
.rp-details dt { color: var(--ink-500); font-size: 10px; font-weight: 650; }
.rp-details dd { margin: 0; color: var(--ink-700); font-size: 11.5px; line-height: 1.4; }
.rp-lock-note { display: flex; align-items: flex-start; gap: 7px; padding: 10px; border-radius: var(--r-md); background: var(--ink-50); color: var(--ink-600); font-size: 11px; line-height: 1.45; }
.rp-lock-note svg { flex-shrink: 0; margin-top: 1px; }
.rp-no-selection { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; padding: 44px 10px; color: var(--ink-500); font-size: 11.5px; text-align: center; }
.rp-no-selection svg { color: var(--ink-400); }
.rp-no-selection strong { color: var(--ink-700); font-size: 13px; }
.rp-selection-footer { display: grid; gap: 9px; margin-top: auto; padding-top: 15px; border-top: var(--hairline); }
.rp-selection-footer .ds-btn { width: 100%; }
.rp-selection-footer span { color: var(--ink-500); font-size: 10.5px; text-align: center; }

@media (max-width: 1180px) { .rp-content { grid-template-columns: minmax(540px, 1fr) 300px; } .rp-filter-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .rp-file-head, .rp-file-row { grid-template-columns: 20px minmax(185px, 1.35fr) 82px 90px minmax(106px, .8fr) 86px 78px; gap: 7px; } }
@media (max-width: 930px) { .rp-content { grid-template-columns: 1fr; } .rp-selection { min-height: 290px; border-top: var(--hairline); border-left: 0; } .rp-file-list { max-height: 430px; } }
@media (max-width: 1240px) { .rw-work-area { grid-template-columns: 202px minmax(420px, 1fr) 292px; } .rw-header-actions { width: 100%; padding-left: 0; } }
@media (max-width: 1020px) { .rw-work-area { grid-template-columns: 196px minmax(420px, 1fr); } .rw-right-panel { display: none; } .rw-view-modes { margin-left: 0; } }
@media (max-width: 760px) { .rw-header { align-items: flex-start; padding: 12px 14px; } .rw-head-copy { order: 2; flex-basis: calc(100% - 82px); } .rw-save-state { order: 3; margin-left: auto; } .rw-header-actions { order: 4; } .rw-toolbar { align-items: flex-start; flex-wrap: wrap; padding: 9px 12px; } .rw-breadcrumb { width: calc(100% - 36px); } .rw-view-modes { width: 100%; } .rw-view-modes button { flex: 1; padding-inline: 6px; font-size: 10.5px; } .rw-work-area { grid-template-columns: 1fr; min-height: 0; overflow: visible; } .rw-left-panel { display: none; } .rw-editor { min-height: 520px; } .rw-canvas-wrap[data-side-by-side="true"] { grid-template-columns: minmax(290px, 1fr) minmax(290px, 1fr); } .rw-canvas-foot { flex-wrap: wrap; padding: 8px 12px; } .rw-bottom-bar { align-items: flex-start; flex-direction: column; } .rp-breadcrumb-bar { min-height: 56px; padding: 0 15px; } .rp-header { align-items: flex-start; padding: 13px 15px; flex-wrap: wrap; } .rp-head-copy { flex-basis: calc(100% - 94px); } .rp-head-note { margin-left: auto; } .rp-library, .rp-selection { padding: 16px; } .rp-filter-head { align-items: center; } .rp-filter-grid { grid-template-columns: 1fr; } .rp-file-head { display: none; } .rp-file-row { grid-template-columns: 18px minmax(0, 1fr) auto; gap: 8px; padding: 11px; } .rp-document { grid-column: 2; } .rp-document-type { grid-column: 2; grid-row: 2; } .rp-station { grid-column: 2; grid-row: 3; } .rp-generated { grid-column: 2; grid-row: 4; } .rp-file-row > .ds-chip { grid-column: 3; grid-row: 1; } .rp-updated { grid-column: 3; grid-row: 2; } .rp-file-list { max-height: 480px; } .rp-selection { min-height: 270px; } }
@media (prefers-reduced-motion: reduce) { .rw-view-modes button { transition: none; } }
`;

  const wmStyleEl = document.createElement("style");
  wmStyleEl.textContent = wmCSS + mfCSS + revisionCSS;
  document.head.appendChild(wmStyleEl);
})();
