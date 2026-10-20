---
name: CampusPulse
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#3e2400'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c3800'
  on-tertiary-container: '#ef9900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 4rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  metric-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  label-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects a balanced atmosphere of academic authority and forward-thinking student agency. It serves university students, faculty, and administrative staff who require high throughput, timely task execution, and clear visibility over schedules, deadlines, and grades. The aesthetic blends contemporary collegiate heritage with modern software precision—avoiding both dusty administrative bureaucracy and overly playful consumer trends.

The design movement is **Corporate / Modern** augmented with tailored editorial clarity. Visual priority relies on structured grids, crisp information density, deliberate typographic hierarchy, and purposeful status accents. The interface feels dependable, disciplined, and calm under high cognitive loads, delivering quiet reassurance during critical academic crunch periods.

## Colors

The system employs a functional, high-contrast academic palette anchored in deep institutional blues, disciplined slates, and surgical intent-driven signals.

- **Primary (`#1E3A8A`)**: Deep collegiate navy serving as the foundational anchor for structural surfaces, primary branding landmarks, top-level navigation states, and authoritative visual elements.
- **Secondary (`#2563EB`)**: Cobalt blue utilized for interactive callouts, active focus rings, primary action buttons, active tab indicators, and dynamic data visualizations.
- **Tertiary (`#F59E0B`)**: Warm academic amber reserved strictly for imminent deadlines (e.g., due within 24 hours), pending grade syncs, caution advisories, and time-sensitive alerts.
- **Critical / Urgent (`#EF4444`)**: Coral red applied sparingly for overdue submissions, grade disputes, attendance penalties, and destructive actions.
- **Success / Mint (`#10B981`)**: Emerald green signaling completed assignments, verified credits, dean's list marks, and successful submissions.
- **Neutrals**:
  - Ground Base: `#F8FAFC` (Canvas background, reducing eye strain during extended study sessions).
  - Surface Card: `#FFFFFF` (Pristine elevation over canvas).
  - Subdued Surface: `#F1F5F9` (Nested modules, table header tracks, code block backdrops).
  - Hairline Border: `#E2E8F0` (Card boundaries, dividers, calendar time slots).
  - Subtle Border: `#CBD5E1` (Input element rests, secondary chip outlines).
  - Muted Text: `#64748B` (Metadata, timestamps, course codes, label captions).
  - Core Slate: `#0F172A` (Headings, primary data values, high-contrast body copy).

## Typography

Plus Jakarta Sans is utilized system-wide to unite geometric contemporary precision with warm, open counters. Its clean rendering preserves legibility across complex multi-column grade books, dense syllabi, and multi-day schedule matrices.

### Numerical Hierarchy & Tabular Formatting
All instances representing numerical information—such as GPA scores, course registration numbers (CRN), room designations, time countdowns, and percentage meters—must enable tabular lining figures (`font-variant-numeric: tabular-nums`). This guarantees alignment across dense columnar dashboards.

### Responsive Rules
Large titles (`display-lg` and `headline-xl`) drop to mobile-specific alternatives below the 768px threshold to prevent title truncation and irregular line-wrapping in narrow viewports.

## Layout & Spacing

The layout philosophy centers on a fluid 12-column responsive grid engineered to support high-density academic workflows without visual fatigue.

### Breakpoints & Grid Composition
- **Desktop (>= 1280px)**: 12-column grid, `margin`: `2rem`, `gutter`: `1.5rem`. Max container width capped at 1440px for dashboard readouts to maintain optimal line lengths.
- **Tablet (768px – 1279px)**: 8-column grid, `margin`: `1.5rem`, `gutter`: `1rem`. Secondary analytical panels collapse below primary course feeds.
- **Mobile (< 768px)**: 4-column grid, `margin`: `1rem`, `gutter`: `1rem`. Side navigations convert to a permanent bottom taskbar or full-screen drawer; multi-column timetable schedules switch into chronological vertical feeds.

### Layout Rhythm
Spacers strictly modulate density. The `space-xs` and `space-sm` tokens are assigned to internal component micro-clusters (e.g., tag icons, input label offsets, checklist items). The `space-md` and `space-lg` tokens frame card padding and form sections. The `space-xl` token controls macro page gaps and distinct dashboard sections.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: low-contrast geometric outlines paired with cool-tinted, diffuse ambient shadows. This prevents the cluttered look that heavy drop shadows cause in data-dense layouts.

- **Level 0 (Flat / Canvas)**: Background `#F8FAFC`, no shadow, zero elevation.
- **Level 1 (Card / Rest Surface)**: Pure `#FFFFFF` surface accompanied by a hairline border (`1px solid #E2E8F0`) and an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Interactive / Hover & Active Cards)**: Elevated state when cards or list items are hovered: `0 4px 6px -1px rgba(30, 58, 138, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`, with border shifting to `#CBD5E1`.
- **Level 3 (Flyouts, Menus & Dropdowns)**: Contextual selectors, notification trays, and search command palettes: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`, enclosed with a `1px solid #E2E8F0` border.
- **Level 4 (Modals & Urgent Overlays)**: Assignment submission panels, exam verification dialogs: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, framed over a backdrop scrim tinted with `#0F172A` at 40% opacity.

## Shapes

The design system adopts a controlled `Rounded` corner language (radius factor 2). This delivers an approachable feel without compromising structural order or data alignment.

- **Base Radius (`0.5rem` / 8px)**: Applied to text input fields, buttons, dropdown triggers, and role badges.
- **Large Radius (`rounded-lg`, `1rem` / 16px)**: Applied to assignment cards, timetable modules, dynamic widget containers, and modals.
- **Extra Large Radius (`rounded-xl`, `1.5rem` / 24px)**: Reserved for hero overview banners and prominent quick-stat headers.
- **Pill Radius (`9999px`)**: Exclusively reserved for status chips, course tag pills, deadline pills, and counter dots.

## Components

### Buttons
- **Primary**: Solid background `#2563EB`, text `#FFFFFF`, radius `0.5rem`. On hover, transitions to `#1E3A8A`. Height: 40px (desktop), 44px (mobile touch targets).
- **Secondary**: Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. On hover, background shifts to `#F1F5F9`.
- **Urgent / Destructive**: Background `#EF4444`, text `#FFFFFF`. Used for dropping courses or discarding drafts.
- **Ghost**: Zero border, text `#2563EB`, padding `space-xs space-sm`. Hover gives `#F1F5F9`.

### Chips & Role Badges
- **Role Badges**: Uppercase micro-typography (`label-xs`).
  - *Student*: Subtle slate background `#F1F5F9`, text `#0F172A`.
  - *Faculty / TA*: Light navy wash `#EFF6FF`, text `#1E3A8A`, border `1px solid #BFDBFE`.
  - *Admin*: Deep indigo fill `#1E3A8A`, text `#FFFFFF`.
- **Status Chips**: Pill-shaped (`9999px`), padding `0.25rem 0.625rem`.
  - *Urgent Deadline*: Soft amber fill `#FEF3C7`, text `#B45309`, left dot in `#F59E0B`.
  - *Critical / Past Due*: Soft red fill `#FEE2E2`, text `#B91C1C`, left dot in `#EF4444`.
  - *Completed*: Soft emerald fill `#D1FAE5`, text `#047857`, left dot in `#10B981`.

### Cards
- **Base Style**: Background `#FFFFFF`, border `1px solid #E2E8F0`, border-radius `1rem`, padding `space-lg`.
- **Course & Deadline Cards**: Incorporate an intentional 4px left-hand border accent representing course color coding (e.g., Biology: `#10B981`, Calculus: `#2563EB`, Literature: `#F59E0B`). Includes a dedicated top-right zone for deadline badges with tabular time readouts.

### Input Fields
- **Default**: Height 42px, radius `0.5rem`, border `1px solid #CBD5E1`, background `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`.
- **Active / Focused**: Border color `#2563EB`, with a concentric focus ring of `0 0 0 3px rgba(37, 99, 235, 0.15)`.
- **Error State**: Border `#EF4444`, ring `0 0 0 3px rgba(239, 68, 68, 0.15)`.

### Checkboxes & Radio Buttons
- Form controls measure 18px by 18px with `0.25rem` radius for checkboxes and circular radius for radios.
- Unchecked: Border `1.5px solid #CBD5E1`, fill `#FFFFFF`.
- Checked: Fill `#2563EB`, border `#2563EB`, crisp white indicator tick or dot.

### Lists & Data Rows
- Row items possess a minimum tap height of 52px, delimited by `1px solid #F1F5F9` bottom rules.
- Hovering initiates an instantaneous transition to `#F8FAFC`. Columns maintain explicit spacing: left-aligned subject title, fixed-width badge center, and right-aligned tabular date/time.

### Specialized Academic Modules
- **Countdown Pill**: Compact inline timer (`label-sm`, tabular numerals) featuring a dynamic pulse indicator for assignments due in under 2 hours.
- **GPA / Progress Arc**: Thick-stroke SVG circular gauge utilizing `#10B981` (on-track) or `#F59E0B` (warning), with centered high-contrast metric typography (`metric-num`).