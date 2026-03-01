# Workout Tracker — Design System & Agent Guidelines

> **Purpose:** This document is the single source of truth for every color, font, spacing convention, component pattern, and design decision used in this app. Any AI agent making changes **must** read this file first and follow these rules to keep the UI consistent.

---

## 1. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Build tool | Vite | 7.x |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) | 4.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 0.575+ |
| PWA | vite-plugin-pwa | 1.x |
| Date utils | date-fns | 4.x |

- Tailwind v4 uses the new `@theme` directive in `src/index.css` (no `tailwind.config.js`).
- Custom CSS design tokens live in `src/App.css` using `:root` CSS variables.
- There is **no** component library (no shadcn, no MUI). All UI is hand-built with Tailwind utility classes.

---

## 2. Color Palette

### 2.1 Tailwind Theme Colors (`src/index.css` → `@theme`)

These are the **primary design tokens** referenced via Tailwind classes like `bg-gym-black`, `text-gym-accent`, etc.

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `gym-black` | `--color-gym-black` | `#0d0d0d` | Page background, app shell |
| `gym-charcoal` | `--color-gym-charcoal` | `#1a1a1a` | Card backgrounds, nav bar, tooltip bg |
| `gym-steel` | `--color-gym-steel` | `#2d2d2d` | Borders, grid lines (charts), dividers |
| `gym-slate` | `--color-gym-slate` | `#404040` | Unchecked circle icons, chart axis strokes |
| `gym-zinc` | `--color-gym-zinc` | `#71717a` | Muted/secondary text, labels, chart tick text |
| `gym-silver` | `--color-gym-silver` | `#a1a1aa` | Body text, tooltip label text |
| `gym-accent` | `--color-gym-accent` | `#f97316` | **Primary accent** – buttons, active tab, chart lines/bars, links, focus rings |
| `gym-accent-dim` | `--color-gym-accent-dim` | `#ea580c` | Hover state for accent buttons |
| `gym-success` | `--color-gym-success` | `#22c55e` | Success states, completed checkmarks, positive weight trend |
| `gym-muted` | `--color-gym-muted` | `#27272a` | Secondary card bg, form input bg, empty-state bg |

### 2.2 CSS Custom Properties (`src/App.css` → `:root`)

These are **secondary tokens** used mainly in `ManageWorkouts.jsx` via `var(--accent)` syntax in inline Tailwind classes.

| Variable | Value | Mapped To / Usage |
|---|---|---|
| `--accent` | `#06b6d4` | Cyan accent for schedule editor (day pills, add button) |
| `--accent-2` | `#ec4899` | Pink accent (used in gradient overlays) |
| `--success` | `#10b981` | Save button in schedule editor |
| `--danger` | `#ef4444` | Remove/delete buttons |
| `--muted-bg` | `rgba(255,255,255,0.02)` | Subtle background tint |
| `--card-bg` | `rgba(17,24,39,0.6)` | Glass-morphism card bg |
| `--glass` | `rgba(255,255,255,0.03)` | Glass overlay |

### 2.3 Hardcoded Hex Values in Components

These appear directly in Recharts config and component JSX. Keep them in sync with the tokens above.

| Hex | Where Used | Equivalent Token |
|---|---|---|
| `#f97316` | Chart strokes, fills, dots (`Dashboard.jsx`, `WeightTracker.jsx`) | `gym-accent` |
| `#1a1a1a` | Tooltip `backgroundColor` | `gym-charcoal` |
| `#2d2d2d` | `CartesianGrid` stroke, tooltip border | `gym-steel` |
| `#71717a` | Chart tick `fill` | `gym-zinc` |
| `#404040` | Chart axis `stroke` | `gym-slate` |
| `#a1a1aa` | Tooltip `labelStyle.color` | `gym-silver` |
| `#27272a` | Bar fill for "Scheduled" bars in Dashboard | `gym-muted` |
| `#22c55e` | (via class) success states | `gym-success` |

### 2.4 Semantic Color Roles

| Role | Light/Value | Where |
|---|---|---|
| **Background (page)** | `#0d0d0d` (gym-black) | `<body>`, app shell |
| **Background (card)** | `#1a1a1a` (gym-charcoal) | All cards, nav, tooltips |
| **Background (input/secondary)** | `#27272a` (gym-muted) | Form inputs, secondary cards |
| **Border** | `#2d2d2d` (gym-steel) | All card borders, dividers, chart grids |
| **Text (primary)** | `#ffffff` (white) | Headings, values, exercise names |
| **Text (secondary)** | `#a1a1aa` (gym-silver) | Body copy, descriptions |
| **Text (muted/label)** | `#71717a` (gym-zinc) | Labels, subtitles, timestamps |
| **Primary action** | `#f97316` (gym-accent) | Buttons, active states, chart strokes |
| **Primary action hover** | `#ea580c` (gym-accent-dim) | Button hover |
| **Success** | `#22c55e` (gym-success) | Completed states, positive trends |
| **Danger** | `#ef4444` (--danger) | Delete/remove actions |
| **Editor accent** | `#06b6d4` (--accent cyan) | Schedule editor active pill, add button |
| **Negative trend** | `red-400` (Tailwind built-in) | Weight gain indicator |

---

## 3. Typography

### 3.1 Font Families

| Token | CSS Variable | Font Stack | Usage |
|---|---|---|---|
| Display | `--font-display` | `'Syne', system-ui, sans-serif` | Defined in `@theme` but **not loaded via Google Fonts** |
| Body | `--font-body` | `'DM Sans', system-ui, sans-serif` | Defined in `@theme` but **not loaded via Google Fonts** |
| (Loaded) Display | — | `'Rubik', 'IBM Plex Sans', system-ui, sans-serif` | `.font-display` class in `App.css`; actually loaded in `index.html` |
| (Loaded) Body | — | `'IBM Plex Sans', system-ui, -apple-system, sans-serif` | `body` rule in `App.css`; actually loaded in `index.html` |

> ⚠️ **Note for agents:** The `@theme` declares `Syne` and `DM Sans`, but the Google Fonts `<link>` in `index.html` loads **Rubik** and **IBM Plex Sans**. The CSS in `App.css` overrides `body` and `.font-display` to use the actually-loaded fonts. Respect the **loaded** fonts when adding new components.

**Actually used fonts (from `index.html` Google Fonts link):**
- **Rubik** — weights: 400, 500, 600, 700, 800 → used for display/headings via `.font-display`
- **IBM Plex Sans** — weights: 400, 500, 600, 700 → used for body text

### 3.2 Text Sizes & Styles

| Element | Classes | Example |
|---|---|---|
| App title | `font-display font-bold text-xl tracking-tight text-white` | "Workout Tracker" |
| App subtitle | `text-gym-zinc text-sm` | "Build the habit. Track the gains." |
| Section heading | `text-sm font-semibold text-white uppercase tracking-wider` | "Weight Trend" |
| Card title | `text-lg font-bold text-white` | Today's workout name |
| Overline label | `text-xs font-medium text-gym-zinc uppercase tracking-wider` | "Streak", "This Week" |
| Stat value | `text-2xl font-bold text-white` | "1 days", "0/3" |
| Body text | `text-sm text-gym-silver` | Descriptions, tips |
| Small muted text | `text-xs text-gym-zinc` | Timestamps, helper text |
| Button text | `font-medium text-sm` | "Mark Complete", "Add" |
| Editor overline | `text-xs text-gym-zinc uppercase tracking-widest font-bold` | "Editing" |
| Editor day title | `font-display text-2xl text-white` | Day name in editor |
| Nav label | `text-xs font-medium` | Tab labels |

---

## 4. Component Patterns & Styling

### 4.1 Cards

```
bg-gym-charcoal rounded-xl p-5 border border-gym-steel
```

- All cards use `rounded-xl` (12px radius)
- Padding is `p-5` (1.25rem / 20px)
- Border: 1px solid `gym-steel`
- No box-shadow (flat dark aesthetic)

### 4.2 Secondary/Muted Cards

```
bg-gym-muted rounded-xl p-5 border border-gym-steel
```

### 4.3 Buttons

**Primary action (accent):**
```
px-4 py-2 rounded-lg bg-gym-accent text-white hover:bg-gym-accent-dim font-medium text-sm transition-colors
```

**Success state button:**
```
bg-gym-success/20 text-gym-success cursor-default
```

**Toggle/edit button:**
```
px-3 py-1 rounded bg-gym-muted text-white
```

**Icon button (editor):**
```
icon-btn px-4 py-3 rounded-lg bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors
```

**Danger/remove button:**
```
w-full py-3 rounded-lg bg-[var(--danger)]/20 text-[var(--danger)] font-bold active:scale-95 transition-transform
```

### 4.4 Form Inputs

```
w-full px-4 py-2.5 bg-gym-muted border border-gym-steel rounded-lg text-white placeholder-gym-zinc focus:ring-2 focus:ring-gym-accent focus:border-gym-accent outline-none transition
```

- Min-height: `2.875rem` (46px) for touch targets
- Padding: `0.875rem 1rem`

### 4.5 Bottom Navigation

```
fixed bottom-0 left-0 right-0 z-50 bg-gym-charcoal/95 backdrop-blur-md border-t border-gym-steel
```

- Active tab: `text-gym-accent`, icon `strokeWidth: 2.5`
- Inactive tab: `text-gym-zinc hover:text-gym-silver`, icon `strokeWidth: 2`
- Icon size: `22px`
- Label: `text-xs font-medium`

### 4.6 Exercise Rows

```
row-gradient p-4 rounded-xl flex flex-col gap-3 exercise-row
```

Where `row-gradient` is:
```css
background: linear-gradient(135deg, rgba(6,182,212,.08), rgba(236,72,153,.04));
border: 1px solid rgba(6,182,212,.1);
```

### 4.7 Day Selector Pills (Schedule Editor)

Active:
```
bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white shadow-lg shadow-[var(--accent)]/30
```

Inactive:
```
bg-gym-muted text-gym-zinc hover:bg-gym-charcoal
```

---

## 5. Chart Theming (Recharts)

All charts follow the same dark theme:

| Property | Value |
|---|---|
| `CartesianGrid` stroke | `#2d2d2d` (gym-steel), `strokeDasharray="3 3"` |
| `XAxis` / `YAxis` stroke | `#404040` (gym-slate) |
| Tick text | `fontSize: 11, fill: '#71717a'` (gym-zinc) |
| Tooltip bg | `backgroundColor: '#1a1a1a'` (gym-charcoal) |
| Tooltip border | `1px solid #2d2d2d` (gym-steel), `borderRadius: '8px'` |
| Tooltip label color | `#a1a1aa` (gym-silver) |
| Primary data stroke/fill | `#f97316` (gym-accent) |
| Area gradient | From `#f97316` opacity 0.4 → 0 |
| Secondary bar fill | `#27272a` (gym-muted) |
| Bar radius | `[4, 4, 0, 0]` (top rounded) |
| Line dot | `r: 4, fill: '#f97316'`, active dot `r: 6` |
| Chart height | `260px` (dashboard), `280px` (weight tracker) |

---

## 6. Spacing & Layout

| Concept | Value |
|---|---|
| Page horizontal padding | `px-4` (1rem) |
| Header top padding | `pt-[max(1.5rem,env(safe-area-inset-top))]` |
| Bottom nav safe area | `padding-bottom: max(1rem, env(safe-area-inset-bottom))` |
| Content bottom padding | `pb-24` (6rem, clearance for fixed nav) |
| Section/card gap | `space-y-5` (1.25rem) |
| Stat card grid | `grid grid-cols-1 sm:grid-cols-3 gap-3` |
| Border radius (cards) | `rounded-xl` (12px) |
| Border radius (buttons) | `rounded-lg` (8px) |
| Border radius (inputs) | `rounded-lg` (8px) |
| Border radius (exercise row) | `rounded-xl` (12px) or `14px` via `.exercise-row` |
| Min touch target | `2.875rem` (46px) for buttons/inputs |

---

## 7. Animations & Transitions

| Name | CSS | Usage |
|---|---|---|
| `popIn` | `opacity 0→1, translateY(10px)→0, scale(.98)→1` over `0.2s` | Card entrance (`.pop-in`) |
| Exercise row press | `transform: scale(0.99)` on `:active` | Tactile feedback |
| Button press | `active:scale-95` | Delete buttons |
| Icon button hover | `transform: scale(0.92)` on `:active` | Icon SVG feedback |
| Mobile action btn hover | `translateY(-2px)` | Lift effect |
| Mobile action btn press | `translateY(1px) scale(0.98)` | Press down effect |
| General transitions | `transition-colors`, `transition-all duration-200` | State changes |
| Easing | `cubic-bezier(.4,.0,.2,1)` (standard Material easing) | Most transitions |

---

## 8. PWA & Meta Theme

| Property | Value |
|---|---|
| `<meta name="theme-color">` | `#0d0d0d` |
| PWA `theme_color` | `#0d0d0d` |
| PWA `background_color` | `#0d0d0d` |
| Display mode | `standalone` |
| Orientation | `portrait` |
| Viewport | `width=device-width, initial-scale=1.0, viewport-fit=cover` |

---

## 9. Icon System

- **Library:** Lucide React
- **Default size:** `22px` (nav), `28px` (stat cards), `18-20px` (inline/buttons)
- **Stroke width:** `2` default, `2.5` for active nav tab
- **Color:** Inherits from parent text color via Tailwind utility classes
- **Icons used:** `LayoutDashboard`, `Dumbbell`, `Scale`, `TrendingUp`, `TrendingDown`, `Calendar`, `Flame`, `CheckCircle`, `Circle`, `PlusCircle`, `Save`, `Trash2`, `Plus`

---

## 10. Dark Theme Rules

This app is **dark-mode only**. There is no light mode toggle or `prefers-color-scheme` media query.

1. **Never use pure white backgrounds.** The lightest background is `gym-muted` (`#27272a`).
2. **Text hierarchy:** `white` → `gym-silver` → `gym-zinc` (primary → secondary → muted).
3. **Borders are always subtle:** `gym-steel` (`#2d2d2d`) — barely visible separation.
4. **Accent is orange** (`#f97316`) for all primary interactive elements.
5. **Glass/translucency** is used sparingly: nav bar `bg-gym-charcoal/95 backdrop-blur-md`, editor header.
6. **No drop shadows on cards.** Only the active day pill gets `shadow-lg shadow-[var(--accent)]/30`.

---

## 11. File-by-File Theme Reference

| File | Theme Elements |
|---|---|
| `index.html` | Google Fonts (Rubik, IBM Plex Sans), theme-color meta `#0d0d0d` |
| `src/index.css` | `@theme` color tokens, base `html`/`body` styles |
| `src/App.css` | `:root` CSS variables, `.font-display`, component classes, animations |
| `src/App.jsx` | Shell layout (`bg-gym-black`), bottom nav, tab colors |
| `src/components/Dashboard.jsx` | Stat cards, chart configs (hardcoded hex values) |
| `src/components/WeightTracker.jsx` | Form inputs, chart config, trend colors |
| `src/components/WorkoutChecklist.jsx` | Exercise list, check states, secondary cards |
| `src/components/ManageWorkouts.jsx` | Day pills, exercise editor, `var(--accent/success/danger)` |

---

## 12. Rules for AI Agents

1. **Read this file before making any UI changes.**
2. **Use Tailwind `gym-*` classes** for colors — do not introduce new hex values unless absolutely necessary.
3. **If you must use a raw hex**, pick from the palette in Section 2 and document it here.
4. **Keep Recharts configs consistent** with Section 5 values.
5. **Maintain the dark-only aesthetic** — no light backgrounds, no white cards.
6. **Respect touch targets** — minimum `2.875rem` (46px) for interactive elements.
7. **Use `rounded-xl`** for cards, `rounded-lg` for buttons/inputs.
8. **Fonts:** Use `font-display` (Rubik) for headings, default body font (IBM Plex Sans) for everything else.
9. **Icons:** Use Lucide React. Don't introduce a second icon library.
10. **New CSS variables** should be added to the `:root` block in `App.css` and documented here.
11. **New Tailwind theme tokens** should be added to the `@theme` block in `index.css` and documented here.
12. **Update this file** when adding new colors, fonts, or design patterns.
