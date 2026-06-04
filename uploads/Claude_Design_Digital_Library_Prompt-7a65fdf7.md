# Claude Design Prompt — Digital Library (Station Registry Screen)
# Indian Railways ESP/SIP Platform
# Paste this entire prompt into Claude Design as one message.
# Attach all 7 files from ESP_To_SIP.zip as reference before sending.

---

## CONTEXT

I am building the Indian Railways ESP/SIP/LOP Documentation Platform. I have already created a component library (uploaded: tokens.css, components-nav.jsx, components-data.jsx, components-forms.jsx, icons.jsx, app.jsx, Design System.html). This screen MUST be built using ONLY the existing components and design tokens from that library. Do not invent new colors, new typography, or new component styles. Extend the existing CSS patterns.

This screen is the **Digital Library — Station Registry**. It is the landing screen of the Digital Library module.

The platform navigation already has: Home, Digital Library, Workspace, Approvals, Settings.

---

## CRITICAL — WHAT THIS SCREEN IS AND IS NOT

The Digital Library is a CENTRALIZED REPOSITORY — a station registry and source of truth. Think Autodesk BIM Document Management, Aconex, SharePoint — but in an Indian Railway context.

This screen exists to let a railway officer FIND any station within their authority, SEE at a glance what documents exist and what is missing, TRUST which records are current, and TRACE provenance — WITHOUT doing any work here.

This screen IS:
- a station registry / browse view
- a discovery and search layer
- a repository showing document presence, absence, and status
- an upload entry point

This screen IS NOT:
- a workflow dashboard (that is Home)
- a validation center (that is Workspace)
- an execution workspace (that is Workspace)
- an approval screen (that is Approvals)

DO NOT add: validation interfaces, SOD rule output, editors, canvases, approve/reject buttons, task queues, "my work today" lists, execution steppers, or programme KPI dashboards. Status badges are allowed. Workflow actions are not. The library shows STATE and RECORD; it never hosts WORK.

When an officer needs to act on a document, this screen LINKS OUT to Workspace — it does not host the work.

---

## USERS

Sr DSTE, Sr DEN, Engineering Officers, S&T Officers, Admins, Railway Board users. Age 40-60+. They prefer clarity, predictability, visible information, minimal navigation. They scan, they do not explore. Information must be on the surface, not buried behind hovers or deep clicks. No startup-style minimalism — this audience wants meaningful information density done cleanly.

---

## EXISTING DESIGN SYSTEM (from tokens.css — use these exact tokens)

**Colors:**
- `--ink-900: #0E1B2C` — primary text, active nav
- `--ink-800: #182838`, `--ink-700: #2A3B4E` — secondary text
- `--ink-600: #475569` — icons, muted text
- `--ink-500: #64748B` — labels, placeholders
- `--ink-400: #94A3B8` — muted
- `--ink-300: #CBD3DC` — dividers
- `--ink-200: #E4E8EE` — borders (--hairline)
- `--ink-100: #EFF2F6` — subtle backgrounds
- `--ink-50: #F6F8FA` — hover backgrounds
- `--canvas: #FAFAF7` — page background
- `--paper: #FFFFFF` — card/sidebar background
- `--accent: oklch(0.68 0.14 35)` — primary CTA, active accent (warm terracotta)
- `--accent-soft / --accent-text` — accent tints
- `--success / --success-soft / --success-text` — green, complete, approved
- `--warning / --warning-soft / --warning-text` — amber, in progress, pending
- `--danger / --danger-soft / --danger-text` — red, missing, failed, overdue
- `--info / --info-soft / --info-text` — blue, processing, informational

**Type:** `--font-sans` (Inter), `--font-mono` (JetBrains Mono — use for station codes, plan numbers, chainages)

**Radii:** `--r-xs:4px --r-sm:6px --r-md:8px --r-lg:12px --r-xl:16px --r-full:999px`

**Shadows:** `--shadow-xs`, `--shadow-sm`, `--shadow-md`

**Existing components to reuse — do not rebuild these:**
- `.ds-sidebar` and full sidebar structure from components-nav.jsx
- `.ds-header`, `.ds-breadcrumb`, `.ds-header-spacer`, `.ds-header-actions`, `.ds-icon-btn`
- `.ds-fsearch` filter-search with `.ds-fchip` filter chips
- `.ds-chip` status chips with `data-tone="success|warning|danger|info|accent|neutral"`
- `.ds-tabs` / `.ds-pilltabs` for tabs
- The data table component from components-data.jsx
- `.icon` SVG icon system from icons.jsx — use `<Icon name="..." />`
- Buttons from components-forms.jsx
- Empty state component if one exists in the library

---

## SCREEN STRUCTURE

Outer layout: `display: grid; grid-template-columns: 244px 1fr; height: 100vh; overflow: hidden`.

Left: the existing Sidebar component, with "Digital Library" as the active nav item.
Right: the Digital Library content — a flex column, full height.

### SIDEBAR (reuse existing Sidebar)

Update nav structure to: Home / [MANAGE group] Digital Library (active), Workspace / [REVIEW group] Approvals / [SYSTEM group] Help, Settings. Brand mark "IR", title "Indian Railways", sub "ESP · SIP · LOP Platform". Footer user: "SB", "Sri Babu", "Sr. DSTE · SCR". Digital Library is the active item.

---

## RIGHT SIDE — DIGITAL LIBRARY CONTENT

A flex column: a header region (fixed), then a scrollable body.

### REGION 1 — Page Header (fixed, white, border-bottom hairline, padding 16px 28px)

Top row:
- Left: Title "Digital Library" — 20px, font-weight 700, `--ink-900`. Below it, sub-text: "Central repository of all station records, drawings and survey data" — 12px, `--ink-500`.
- Right: Primary action button (reuse button component, accent/primary variant): "+ Add Station". Next to it, a secondary button: "Upload Documents" with an upload icon. Next to that, a secondary icon-button for "Export Register" (download icon).

### REGION 2 — Hierarchy Scope Bar (fixed, below header, white, border-bottom hairline, padding 12px 28px)

This is the organizational scoping spine. The officer must always see where they are in Zone → Division → Section.

A horizontal row:
- Label "Scope:" — 11px, `--ink-500`, font-weight 600
- Three cascading dropdown selectors (reuse form select styling — height 34px, hairline border, `--r-md` radius, mono-friendly):
  - Zone — default "SCR — South Central Railway"
  - Division — default "Vijayawada Division"
  - Section — default "All Sections"
- A vertical hairline divider
- A scope summary text: "247 stations in scope" — 12px, `--ink-500`
- Push to the right: a small breadcrumb-style indicator showing the active path: "SCR › Vijayawada › All Sections" using `.ds-breadcrumb` styling.

The scope bar controls everything below it. Changing scope re-filters the registry.

### REGION 3 — Search & Filter Bar (fixed, below scope bar, white, border-bottom hairline, padding 12px 28px)

Reuse the `.ds-fsearch` component pattern.
- A wide search input with search icon — placeholder: "Search by station name or code…"
- A "Filters" button (secondary, filter icon)
- A "Sort" button (secondary, sort icon)
- Below the search row, a row of filter chips (`.ds-fchip`) showing active filters. Pre-populate a few realistic ones:
  - "Document type: ESP" (active)
  - "Status: In Progress" (active)
  - "Missing: Survey Data"
  - "Source: any"
  - "+ Add filter" (dashed chip)
- On the far right of the search row: a view-toggle pill group (`.ds-pilltabs`) — "Table" (active) / "Cards". (Build only the Table view fully; Cards can be a placeholder toggle.)

### REGION 4 — Registry Summary Strip (fixed, below filter bar, padding 10px 28px, background --ink-50, border-bottom hairline)

A thin horizontal strip of small inline stat items — NOT KPI cards (this is a repository, not a dashboard). Just compact text counts separated by dividers:
- "247 Stations" 
- "189 with ESP" 
- "92 with SIP" 
- "34 with LOP" 
- "41 missing survey data" (this count in `--danger-text`)
- "12 uploads processing" (in `--info-text`)

Each is small: 12px, count in font-weight 700 `--ink-900`, label in `--ink-500`. These are glanceable repository facts, not metrics with deltas.

### REGION 5 — Station Registry Table (scrollable body, the primary object of the screen)

This is the heart of the screen. Reuse the existing data table component. Padding around it: 0 (table goes edge to edge of the scroll area) or 16px 28px — pick what looks cleaner with the existing table style.

The table lists stations. It must show document presence, absence, and status at a glance — absence is as important as presence.

**Columns:**

1. **Station** — two lines: station name (13px, font-weight 600, `--ink-900`) + station code in a mono pill (`--ink-100` background, `--ink-600`, `--font-mono`, 10px). e.g. "Bisalwas Kalan" / "BIWK".

2. **Section** — section name, 12px `--ink-600`. e.g. "Nagda–Ratlam".

3. **ESP** — a document-status cell. Show either:
   - a `.ds-chip` with the document state, OR
   - "—" in `--ink-300` if no ESP exists (absence shown clearly).
   States to represent: "Not uploaded" (neutral/empty), "Processing" (info tone), "Extracted" (info tone), "Validated" (accent tone), "Approved" (success tone).

4. **SIP** — same pattern as ESP column.

5. **LOP** — same pattern.

6. **Survey Data** — a small indicator showing which survey data types exist for the station. Show small mono tags or dots for: LiDAR, Ortho, Total Station. Present = filled/colored, missing = faint/outline. If nothing uploaded, show "—" in `--danger-text` faintly (missing survey data is a flagged condition).

7. **Versions** — a small count, e.g. "ESP v3 · SIP v1" in `--font-mono`, 11px `--ink-500`. Indicates how many versions exist; the latest is implied as current.

8. **Last Activity** — relative time + who, two lines: "2 days ago" (12px `--ink-600`) / "by K. Naidu" (10px `--ink-400`).

9. **Completeness** — a calm, glanceable health indicator of how complete the station's records are. A small horizontal segmented bar (e.g. 5 segments: Survey, ESP, SIP, LOP, TOC) where completed segments are `--success` and missing are `--ink-200`. Plus a small "3/5" label. NOT a percentage with a delta — this is repository completeness, not a KPI.

10. **(Row action)** — a single "Open →" link/button per row, `--accent-text`, that hands off to the Workspace/Station Record. This is the link-out. NO inline workflow buttons (no Validate, no Approve here). Optionally a kebab/overflow menu with repository-only actions: "View versions", "Download", "View audit trail", "Edit metadata".

**Table behavior:**
- Header row: `--ink-50` background, 11px uppercase `--ink-500` font-weight 600, sticky on scroll.
- Rows: hover `--ink-50`, cursor pointer (clicking the row opens the Station Record), border-bottom hairline.
- Row density: comfortable but information-dense — this audience wants to see many stations without scrolling excessively. Aim ~14-16 visible rows.
- Show a header checkbox + per-row checkboxes for bulk selection. When rows are selected, a bulk action bar appears (see Region 6).

**Provide ~12 sample station rows** with realistic, varied data so the screen shows every state:
- Stations fully complete (all approved, 5/5)
- Stations mid-process (ESP approved, SIP processing)
- Stations just started (only survey data, no ESP)
- Stations with missing survey data (flagged danger)
- Stations with uploads currently processing
- A newly added station with nothing (empty-ish row)

Use real-sounding South Central Railway station names and codes: Bisalwas Kalan (BIWK), Vijayawada Junction (BZA), Guntur Junction (GNT), Tenali Junction (TEL), Ongole (OGL), Eluru (EE), Rajahmundry (RJY), Bhimavaram Town (BVRT), Nidadavolu (NDD), Kakinada Port (COA), Nuzvid (NZD), Chirala (CLX).

### REGION 6 — Bulk Action Bar (appears only when rows are selected)

A bar that slides in above or below the table when ≥1 row is checked:
- "[N] stations selected" text
- Repository-only bulk actions: "Export selected", "Download documents", "Add to ...". 
- NO bulk validate, NO bulk approve.
- A "Clear selection" link.

### EMPTY / PARTIAL STATES

- If the scope filter returns no stations: a clean empty state (reuse the library's empty-state component) — "No stations match this scope" with a "Clear filters" action.
- If a scope has stations but none have documents yet: the table still lists them, with document columns showing "—". The screen must gracefully represent the early, sparse state — not assume every station is fully populated.

---

## INTERACTION & STATE NOTES

- Scope dropdowns (Zone/Division/Section): `useState`. Changing them updates the breadcrumb path and the scope-summary count.
- Search input: `useState`, filters the table rows by station name/code.
- Filter chips: `useState`, toggle active/remove.
- View toggle (Table/Cards): `useState` — build Table fully, Cards as a stub.
- Row checkboxes + header checkbox: `useState` selection set; selection drives the bulk action bar.
- Sort button: `useState` for sort column/direction.
- All data is hardcoded — no API calls.
- Clicking a row or "Open →" should be wired to a console.log or a stub handler representing navigation to the Station Record screen (which is a separate screen, not built here).

---

## DESIGN DISCIPLINE — RE-CHECK BEFORE FINALIZING

Confirm the output does NOT contain: validation UI, SOD output, editors, approve/reject buttons, task lists, execution steppers, or KPI cards with deltas. If any appeared, remove them — they belong in Workspace, Approvals, or Home.

Confirm the output DOES contain: hierarchy scoping, fast search, filtering, a dense station registry table showing document presence/absence/status, version indicators, provenance (who/when), completeness indicators, upload entry points, bulk export, and a clean link-out to Workspace.

---

## OUTPUT

Export as a single self-contained React component called `DigitalLibraryPage`. Inject CSS the same way the existing library components do (a `const css` string appended via a style tag). Reuse existing component classes wherever possible; only add new CSS for genuinely new structures (scope bar, registry summary strip, document-status table cells), and when adding new CSS, follow the existing naming and token conventions exactly.

At 1440px wide the result should look like a calm, authoritative, information-dense enterprise document repository — comparable to Autodesk BIM Document Management or Aconex — not a consumer dashboard.
