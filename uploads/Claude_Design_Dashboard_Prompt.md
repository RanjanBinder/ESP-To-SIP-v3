# Claude Design Prompt — Dashboard + Sidebar
# Indian Railways ESP/SIP Platform
# Paste this entire prompt into Claude Design as one message.

---

## CONTEXT

I am building the Indian Railways ESP/SIP/LOP Documentation Platform. I have already created a component library (uploaded as ESP_To_SIP.zip) with a full design system. This dashboard must be built using ONLY the existing components and design tokens from that library. Do not invent new styles — reference the existing system throughout.

The platform is used by Sr. DSTE, Sr. DEN, AEN, SSE railway officers aged 40-55. It is a safety-critical, government-grade engineering tool. The UI must feel authoritative, clean, and functional — not decorative.

---

## EXISTING DESIGN SYSTEM (from tokens.css)

Use these exact tokens everywhere:

**Color tokens:**
- `--ink-900: #0E1B2C` — primary text, active nav bg
- `--ink-800: #182838` — dark hover states
- `--ink-700: #2A3B4E` — secondary text
- `--ink-600: #475569` — icon color, muted text
- `--ink-500: #64748B` — placeholder, labels
- `--ink-400: #94A3B8` — muted icons
- `--ink-300: #CBD3DC` — dividers
- `--ink-200: #E4E8EE` — borders (--hairline)
- `--ink-100: #EFF2F6` — subtle backgrounds
- `--ink-50:  #F6F8FA` — hover backgrounds
- `--canvas:  #FAFAF7` — page background
- `--paper:   #FFFFFF` — card/sidebar background
- `--accent:  oklch(0.68 0.14 35)` — primary CTA, active state accent (warm terracotta)
- `--accent-soft: oklch(0.96 0.04 35)` — accent tinted background
- `--accent-text: oklch(0.45 0.13 35)` — accent text
- `--success: oklch(0.62 0.13 155)` — green / approved / complete
- `--success-soft: oklch(0.96 0.04 155)`
- `--success-text: oklch(0.42 0.12 155)`
- `--warning: oklch(0.78 0.13 78)` — amber / in progress / pending
- `--warning-soft: oklch(0.97 0.05 85)`
- `--warning-text: oklch(0.45 0.10 70)`
- `--danger: oklch(0.60 0.18 25)` — red / violation / rejected / overdue
- `--danger-soft: oklch(0.96 0.04 25)`
- `--danger-text: oklch(0.45 0.16 25)`
- `--info: oklch(0.62 0.13 240)` — blue / informational / processing
- `--info-soft: oklch(0.96 0.04 240)`
- `--info-text: oklch(0.42 0.13 240)`

**Typography:**
- `--font-sans: "Inter", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`
- `--font-mono: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace`

**Radii:** `--r-xs:4px --r-sm:6px --r-md:8px --r-lg:12px --r-xl:16px --r-full:999px`

**Shadows:**
- `--shadow-xs: 0 1px 0 rgba(14,27,44,0.04)`
- `--shadow-sm: 0 1px 2px rgba(14,27,44,0.06), 0 1px 0 rgba(14,27,44,0.03)`
- `--shadow-md: 0 4px 12px -2px rgba(14,27,44,0.08), 0 2px 4px -1px rgba(14,27,44,0.04)`

**Existing component classes to reuse:**
- `.ds-sidebar`, `.ds-sidebar-item`, `.ds-sidebar-badge`, `.ds-sidebar-section`
- `.ds-chip` with `data-tone="success|warning|danger|info|accent|neutral"`
- `.ds-kpi` — KPI card with `.ds-kpi-value`, `.ds-kpi-head`, `.ds-kpi-delta`
- `.ds-header`, `.ds-breadcrumb`, `.ds-header-spacer`, `.ds-header-actions`
- `.icon` — SVG icons, stroke-based, currentColor
- `.ds-tab`, `.ds-tabs`, `.ds-pilltab`, `.ds-pilltabs`

---

## WHAT TO BUILD

Build a single React component called `DashboardPage` that renders a complete dashboard screen. This is the **Home** page — the first thing a railway officer sees after login.

The page must have two parts:
1. **Sidebar** (left, fixed 244px) — updated with the correct Indian Railways navigation
2. **Dashboard content** (right, flex-1) — the actual dashboard

---

## PART 1 — SIDEBAR (modify existing Sidebar component)

Use the existing `.ds-sidebar` CSS and component structure from `components-nav.jsx`. Update the navigation structure to match the Indian Railways platform:

### Brand header
- Mark: "IR" text (not "ES") — keep existing `.ds-sidebar-mark` styling
- Title: "Indian Railways" — keep `.ds-sidebar-title`
- Sub: "ESP · SIP · LOP Platform" — keep `.ds-sidebar-sub`

### Remove the project switcher row (`.ds-sidebar-project`) entirely — not needed.

### Navigation groups — replace the existing groups with:

**No group label — standalone item:**
- Home (icon: home or grid) — `data-active="true"` since we are on dashboard
- Badge: none

**Group label: MANAGE**
- Digital Library (icon: book or library) — badge: "247" with neutral tone
- Workspace (icon: layout or layers) — badge: "9" with accent tone (9 active tasks)

**Group label: REVIEW**
- Approvals (icon: check-circle or clipboard-check) — badge: "5" with danger tone

**Group label: SYSTEM**
- Help (icon: help-circle or question-mark)
- Settings (icon: settings or gear)

### Active state
Home is active. Use existing `data-active="true"` on the nav item which applies `.ds-sidebar-item[data-active="true"]` — dark `--ink-900` background, white text and icon.

### Badge styling
Use existing `.ds-sidebar-badge` with `data-tone`:
- Neutral tone for counts like "247"
- Accent tone for personal work count "9"
- No custom badge for danger — use `data-tone="accent"` on Approvals badge but style the count in a danger-colored way, OR simply add a red dot indicator next to Approvals instead of a number badge. Pick what looks cleaner.

### Footer
- Initials: "AV"
- Name: "Ashwini Vaishnaw"
- Role: "Sr. DSTE · SCR"
- Keep the settings gear button on the right

---

## PART 2 — DASHBOARD CONTENT AREA

The right side of the screen. Flex column layout. Background: `--canvas`.

### 2A — Top Bar (Dashboard Header)

A white header bar, `border-bottom: var(--hairline)`, `padding: 16px 28px`.

Left side:
- Page title: "Dashboard" — 20px, font-weight 700, `--ink-900`, letter-spacing -0.02em
- Date subtitle below: "Wednesday, 14 May 2026" — 12px, `--ink-500`

Right side — filter controls in a horizontal row with 8px gaps:
- Small label "Viewing:" — 11px, `--ink-500`, font-weight 600
- Four dropdowns styled as compact filter selects (height 34px, border `var(--hairline)`, radius `var(--r-md)`, padding 0 10px, font-size 13px, `--ink-900` text, font-weight 600, background `var(--paper)`):
  - Zone: "SCR — South Central Railway"
  - Division: "Vijayawada Division"
  - Section: "All Sections"
  - Date: A compact date-range selector showing "01 Apr – 14 May 2026"
- Divider: 1px `--ink-200` vertical line, height 20px
- Refresh button: Use existing button component, secondary variant, small, with refresh icon, "Refresh" label
- Updated timestamp: "Updated 4 mins ago" — 11px, `--ink-400`

### 2B — Scrollable Content Area

`flex: 1`, `overflow-y: auto`, `padding: 24px 28px`, `display: flex`, `flex-direction: column`, `gap: 24px`

---

#### SECTION 1 — KPI STRIP

Six `.ds-kpi` cards in a `display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px`.

Use the existing KPI card component structure. Each card:
- White background `var(--paper)`, border `var(--hairline)`, radius `var(--r-lg)`, padding 18px
- Top left accent bar: 3px wide, full card height, absolutely positioned left edge — use the semantic color for each card's accent

The six cards (left to right):

**Card 1 — Total Stations**
- Icon: building or map-pin, color `--ink-400`
- Label: "Total Stations"
- Value: "247"
- Delta: none
- Meta: "in your scope"
- Left accent: `--ink-300`

**Card 2 — Fully Complete**
- Icon: check-circle, color `var(--success)`
- Label: "Fully Complete"
- Value: "97" — colored `var(--success-text)`
- Delta: "↑ 12 this month" — `data-dir="up"` green
- Left accent: `var(--success)`

**Card 3 — In Progress**
- Icon: clock or loader
- Label: "In Progress"
- Value: "108" — colored `var(--warning-text)`
- Delta: none
- Meta: "across all stages"
- Left accent: `var(--warning)`

**Card 4 — Pending My Action**
- Icon: alert-circle or inbox
- Label: "Pending My Action"
- Value: "14" — colored `var(--danger-text)`
- Delta: "5 overdue" — `data-dir="down"` red
- Left accent: `var(--danger)`

**Card 5 — Discrepancies**
- Icon: zap or flag
- Label: "Open Discrepancies"
- Value: "43" — colored `var(--info-text)`
- Delta: none
- Meta: "unresolved"
- Left accent: `var(--info)`

**Card 6 — Completion %**
- Icon: pie-chart or trending-up
- Label: "Completion Rate"
- Value: "39%"
- Delta: "↑ 5% vs last month" — `data-dir="up"` green
- Left accent: `var(--accent)`
- Include a small sparkline SVG (8 data points trending upward) using existing `.ds-kpi-spark` class

All cards: `cursor: pointer`, hover adds `--shadow-sm` and slightly darker border. Clicking a card should visually indicate it's been selected (add a subtle `--accent-soft` tint to the background).

---

#### SECTION 2 — TWO COLUMN LAYOUT

`display: grid; grid-template-columns: 1fr 440px; gap: 20px`

**Left column — Document Lifecycle Funnel**

A white card, border `var(--hairline)`, radius `var(--r-lg)`, overflow hidden.

Card header (padding 18px 20px, border-bottom `var(--hairline)`):
- Title: "Document Lifecycle" — 14px, font-weight 700, `--ink-900`
- Sub: "247 stations total" — 12px, `--ink-500`
- Right side: `.ds-pilltabs` toggle — "This Month" (active) / "All Time"

Card body (padding 16px 20px):

Six stage rows. Each row (padding 10px 14px, border-radius `var(--r-md)`, hover `--ink-50` bg, cursor pointer, flex, gap 14px, align-items center):

Row structure:
- Left: colored stage dot (10px circle) or small colored bar (3px × 28px, border-radius 2px)
- Middle flex-1: stage name (13px font-weight 600 `--ink-900`) + stage description (11px `--ink-500`)
- Right: count (18px font-weight 700, colored to match stage)

The six stages:

1. **Not Started** — neutral `--ink-400` — "No documents uploaded yet" — count: **42**
2. **Data Ingested** — info `--info` — "ESP uploaded, survey data received" — count: **38**
3. **ESP Validated** — accent `--accent` — "SOD rules passed, awaiting approval" — count: **29**
4. **SIP In Progress** — warning `--warning` — "SIP generated or under validation" — count: **41**
5. **LOP In Progress** — `oklch(0.62 0.13 190)` (teal) — "LOP generated, under review" — count: **28**
6. **Complete** — success `--success` — "All three documents approved" — count: **97**

Below the rows, add a proportional distribution bar (height 6px, border-radius 99px, overflow hidden, margin-top 16px). A single `<div>` with a flex row of colored segments. Each segment's width is proportional to the count. Add a small legend below (dot + label + count, 11px, `--ink-500`) in a flex row with gap 14px.

**Right column — My Recent Activity**

A white card, border `var(--hairline)`, radius `var(--r-lg)`, overflow hidden.

Card header (padding 14px 16px, border-bottom `var(--hairline)`, flex, align-center, justify-between):
- Left: flex row gap 10px
  - Icon container: 28x28px, radius `var(--r-md)`, background `var(--accent-soft)`, center, clock or activity icon in `var(--accent-text)` color
  - Flex column: "My Recent Activity" (13px bold `--ink-900`) + "Last 7 days · Click any row to resume" (11px `--ink-400`)
- Right: `.ds-pilltabs` — "All" (active) / "ESP" / "SIP" / "LOP"

Card body (max-height 380px, overflow-y auto):

Grouped by day. Day group header:
- Sticky, z-index 1, background `--ink-50`, padding 8px 16px
- Text: "Today — Wednesday, 14 May" — 10px, font-weight 700, uppercase, letter-spacing 0.06em, `--ink-400`
- Border-top and border-bottom: `var(--hairline)` (skip border-top on first group)

Each activity row (flex, gap 12px, align-start, padding 10px 16px, border-bottom `var(--hairline)`, cursor pointer, hover background `--ink-50`, transition 120ms):

- Doc type badge (32x20px, border-radius `var(--r-xs)`, font-family mono, font-size 9px, font-weight 800, flex-shrink 0, margin-top 2px):
  - ESP: background `var(--info-soft)`, color `var(--info-text)`
  - SIP: background `var(--accent-soft)`, color `var(--accent-text)`
  - LOP: background `var(--warning-soft)`, color `var(--warning-text)`
  - TOC: background `var(--success-soft)`, color `var(--success-text)`
  - LIB: background `var(--ink-100)`, color `var(--ink-600)`

- Content (flex-1, min-width 0):
  - Action text: 13px, font-weight 600, `--ink-900`, single line, overflow ellipsis
  - Station row (margin-top 2px): 11px `--ink-600` station name + station code in monospace pill (`--ink-100` bg, `--ink-500` color, 10px, padding 0 4px, radius `var(--r-xs)`)
  - Progress indicator (only for "In Progress" rows): flex row, gap 6px — mini progress bar (60px wide, 4px tall, `--ink-200` bg, `--accent` fill) + "47% complete" in 10px `--ink-500`. On hover: hide progress bar, show "→ Resume at Step 4" in 10px `--accent-text` font-weight 600.

- Right side (flex column, align-end, gap 4px, flex-shrink 0):
  - Time: 10px `--ink-400`
  - Status chip: use existing `.ds-chip` component:
    - "In progress" → `data-tone="info"` (pulsing dot)
    - "Pending approval" → `data-tone="warning"`
    - "Approved ✓" → `data-tone="success"`
    - "Rejected" → `data-tone="danger"`
    - "Done" → `data-tone="neutral"`

Show these sample activity rows:

**Today — Wednesday, 14 May:**
1. SIP badge — "Resumed ESP validation" — Bisalwas Kalan (BIWK) — In progress, 47% — 2:30 PM
2. ESP badge — "Submitted ESP for approval" — Guntur Junction (GNT) — Pending approval — 11:00 AM
3. ESP badge — "Fixed 3 SOD rule violations" — Bisalwas Kalan (BIWK) — Done — 9:15 AM

**Yesterday — Tuesday, 13 May:**
4. SIP badge — "Generated SIP draft" — Tenali Junction (TEL) — Done — 4:45 PM
5. LIB badge — "Uploaded Survey Data" — Vijayawada Junction (BZA) — Done — 2:00 PM
6. ESP badge — "Submitted ESP for approval" — Tenali Junction (TEL) — Approved ✓ — 11:30 AM

**Monday, 12 May:**
7. SIP badge — "Opened SIP editor" — Bhimavaram Town (BVRT) — In progress (2 violations left) — 3:20 PM
8. LOP badge — "Generated LOP draft" — Rajahmundry (RJY) — Done — 10:00 AM

Card footer (padding 10px 16px, border-top `var(--hairline)`, flex, justify-between, align-center, background `--ink-50`):
- Left: "8 actions this week" — 11px `--ink-400`
- Right: "View full history →" link — 11px `--accent-text` font-weight 600, cursor pointer, hover underline

---

#### SECTION 3 — THREE COLUMN LAYOUT

`display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px`

**Column 1 — Pending My Approval**

White card, same card structure.

Header: "Pending My Approval" + red chip badge "5" (danger tone, solid variant) on the right.

Body: List of 5 items. Each item (flex, align-center, gap 12px, padding 10px 16px, border-bottom `var(--hairline)`, cursor pointer, hover `--ink-50`):
- Left: doc type square badge (same as activity badge but 30x22px)
- Middle (flex-1):
  - Station name: 12px font-weight 600 `--ink-900`, truncate
  - Meta: doc version + submitted by — 10px `--ink-500`
- Right:
  - Status chip (small) using `.ds-chip`
  - Age: "12d ago" — 10px `--ink-400` font-weight 600

Items:
1. SIP — Vijayawada Junction (BZA) — SIP v1.2 · R. Sharma — "Overdue" danger chip — 12d ago
2. ESP — Guntur Junction (GNT) — ESP v2.0 · K. Naidu — "Overdue" danger chip — 8d ago
3. SIP — Tenali Junction (TEL) — SIP v1.0 · S. Reddy — "Pending" warning chip — 3d ago
4. ESP — Ongole (OGL) — ESP v1.0 · V. Kumar — "Pending" warning chip — 1d ago
5. LOP — Rajahmundry (RJY) — LOP v1.0 · P. Rao — "Review" info chip — Today

Footer: "View all approvals →" link right-aligned, same style as activity card footer.

**Column 2 — Discrepancy Hotspots**

White card.

Header: "Discrepancy Hotspots" + small ".ds-chip" neutral "43 open".

Body: List of 6 stations. Each item (flex, align-center, gap 10px, padding 9px 16px, border-bottom `var(--hairline)`, cursor pointer, hover `--ink-50`):
- Left: count badge (28x24px, border-radius `var(--r-sm)`, font-size 11px, font-weight 700, center):
  - ≥10 discrepancies: danger soft background + danger text
  - 4-9: warning soft + warning text
- Middle (flex-1):
  - Station name: 12px font-weight 600 `--ink-900`
  - Description: 10px `--ink-500`, truncate
- Right: doc type label (10px font-weight 600 `--ink-600`)

Items:
1. "12" — Vijayawada Junction (BZA) — "Track spacing violations · 3 critical" — ESP
2. "9" — Bisalwas Kalan (BIWK) — "SOD rule failures · Signal placement" — SIP
3. "6" — Tenali Junction (TEL) — "Platform offset violations" — ESP
4. "5" — Guntur Junction (GNT) — "Turnout chainage mismatch" — ESP
5. "4" — Rajahmundry (RJY) — "OHE clearance issues" — LOP
6. "3" — Ongole (OGL) — "Missing LC gate annotation" — SIP

Footer: "View all discrepancies →" link.

**Column 3 — Overdue / Stalled**

White card.

Header: "Overdue / Stalled" + danger chip "6".

Body: List of 6 items. Each item (flex, align-center, gap 10px, padding 9px 16px, border-bottom `var(--hairline)`, cursor pointer, hover `--ink-50`):
- Left (flex-1):
  - Station name: 12px font-weight 600 `--ink-900`
  - Description: 10px `--ink-500`, what's stalled
- Right flex row gap 8px:
  - Doc type: 10px font-weight 600 `--ink-600`
  - Days overdue: "12d" — 11px font-weight 700 `var(--danger-text)`

Items:
1. Vijayawada Junction (BZA) — "ESP validation started · no activity" — ESP — 12d
2. Guntur Junction (GNT) — "Awaiting approval · submitted 8d ago" — ESP — 8d
3. Eluru (EE) — "Survey data not uploaded · stalled" — ESP — 30d
4. Secunderabad Jn (SC) — "SIP validation incomplete · 5 violations" — SIP — 15d
5. Nanded (NED) — "Not started · added 45 days ago" — ESP — 45d
6. Kurnool City (KRNT) — "LOP draft not submitted" — LOP — 22d

Footer: "View all stalled stations →" link.

---

#### SECTION 4 — DIVISION PROGRESS TABLE

Full-width white card.

Card header (padding 18px 20px, border-bottom `var(--hairline)`, flex, justify-between, align-center):
- Left: "Division-wise Progress" — 14px bold `--ink-900`
- Right: "Drill down →" accent link

Use the existing table component from `components-data.jsx`. Table with columns:

**Columns:** Division | Stations | ESP | SIP | LOP | Overall | Status

**Thead:** `--ink-50` background, 11px uppercase `--ink-500` font-weight 600, padding 10px 20px, border-bottom `var(--hairline)`.

**Tbody rows:** hover `--ink-50`, cursor pointer, border-bottom `var(--hairline)`. Padding 12px 20px per cell.

**Division cell** (two lines): division name (13px font-weight 600 `--ink-900`) + sub (10px `--ink-400` "SCR · N stations").

**ESP/SIP/LOP cells:** Each shows a mini progress bar. Flex row, gap 8px, align-center:
- Bar: height 6px, width 80px, `--ink-200` bg, radius 99px, overflow hidden. Fill div: height 100%, colored background, radius 99px.
- Percentage: 11px font-weight 700 `--ink-900`, min-width 36px text-right.

Bar colors: ESP → `--info`, SIP → `--accent`, LOP → `--warning`.

**Overall cell:** Percentage number, 13px font-weight 700, colored:
- ≥60%: `--success-text`
- 30-59%: `--warning-text`
- <30%: `--danger-text`

**Status cell:** `.ds-chip` with dot:
- "On track" → success tone
- "At risk" → warning tone
- "Lagging" → danger tone

Four division rows:
1. Vijayawada | 89 | 72% | 58% | 34% | 55% | On track
2. Guntur | 64 | 60% | 40% | 18% | 39% | At risk
3. Hyderabad | 71 | 88% | 74% | 52% | 71% | On track
4. Secunderabad | 23 | 30% | 14% | 4% | 16% | Lagging

---

## COMPONENT AND STATE NOTES

**Interactivity:**
- Zone/Division/Section dropdowns: `useState` to hold selected values. Changing any filter should update the filter display only (not re-compute data — data is static for this mockup).
- KPI cards: `useState` to track which card is selected. Selected card gets `--accent-soft` background tint.
- Activity filter tabs (All/ESP/SIP/LOP): `useState` — filter the activity list by badge type.
- My Workspace column tabs in the lifecycle funnel: `useState` — toggle the pill tab active state.

**No external API calls** — all data is hardcoded as shown above.

**Layout:**
- Outer wrapper: `display: grid; grid-template-columns: 244px 1fr; height: 100vh; overflow: hidden`
- Sidebar: `height: 100vh; overflow-y: auto; flex-shrink: 0`
- Right side: `display: flex; flex-direction: column; height: 100vh; overflow: hidden`
- Top bar: `flex-shrink: 0`
- Content area: `flex: 1; overflow-y: auto`

**Do not use external CSS libraries** — all styles must use the design tokens and extend the existing component CSS patterns from the library files.

---

## OUTPUT

Export as a single React component called `DashboardPage`. The component should be self-contained and renderable in isolation. Include all necessary CSS in a `<style>` tag injected via `useEffect` or via a `const css = \`...\`` approach consistent with how the existing components work (they append CSS via a style tag).

The rendered result at 1440px wide should look like a polished, production-grade railway operations dashboard — not a prototype.
