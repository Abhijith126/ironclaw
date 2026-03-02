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
| HTTP client | axios | 1.x |

- Tailwind v4 uses the new `@theme` directive in `src/index.css` (no `tailwind.config.js`).
- All styles use Tailwind utility classes. Minimal custom CSS in `App.css`.
- There is **no** component library. All UI is hand-built with Tailwind.

---

## 2. Color Palette

### 2.1 Tailwind Theme Colors (`src/index.css` → `@theme`)

All colors are defined in `@theme` block using CSS variables. Use Tailwind classes like `bg-obsidian`, `text-lime`, `border-steel`, etc.

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `obsidian` | `--color-obsidian` | `#080808` | Page background, app shell |
| `carbon` | `--color-carbon` | `#111111` | Header background, sidebar, tooltips |
| `graphite` | `--color-graphite` | `#1a1a1a` | Card backgrounds, nav bar |
| `steel` | `--color-steel` | `#2a2a2a` | Borders, grid lines, dividers |
| `iron` | `--color-iron` | `#404040` | Unchecked icons, secondary borders |
| `silver` | `--color-silver` | `#888888` | Muted text, labels, chart ticks |
| `chalk` | `--color-chalk` | `#d4d4d4` | Body text, secondary content |
| `white` | `--color-white` | `#fafafa` | Primary text, headings, values |
| `lime` | `--color-lime` | `#c6f135` | **Primary accent** — buttons, active tabs, highlights |
| `lime-dim` | `--color-lime-dim` | `#a3cc29` | Hover state for lime buttons |
| `lime-glow` | `--color-lime-glow` | `rgba(198, 241, 53, 0.15)` | Glow effects, focus rings |
| `success` | `--color-success` | `#22c55e` | Completed states, positive trends |
| `warning` | `--color-warning` | `#f59e0b` | Warning states |
| `danger` | `--color-danger` | `#ef4444` | Delete/remove actions, negative trends |
| `muted` | `--color-muted` | `#1f1f1f` | Secondary backgrounds, input fields |

### 2.2 Semantic Color Roles

| Role | Token | Usage |
|---|---|---|
| Background (page) | `bg-obsidian` | `<body>`, app shell |
| Background (card) | `bg-graphite` | All cards, sections |
| Background (input) | `bg-muted` | Form inputs, secondary cards |
| Border | `border-steel` | All borders, dividers |
| Text (primary) | `text-white` | Headings, values, exercise names |
| Text (secondary) | `text-chalk` | Body copy, descriptions |
| Text (muted) | `text-silver` | Labels, subtitles, timestamps |
| Primary action | `bg-lime`, `text-lime` | Buttons, active states, highlights |
| Primary action hover | `hover:bg-lime-dim` | Button hover states |
| Success | `text-success`, `bg-success/15` | Completed checkmarks, positive trends |
| Danger | `text-danger`, `border-danger` | Delete/remove buttons |

### 2.3 Hardcoded Values in Components

Recharts and some inline styles use hardcoded hex values. Keep these in sync:

| Hex | Where Used | Equivalent Token |
|---|---|---|
| `#c6f135` | Chart strokes, fills, dots | `lime` |
| `#080808` | Body background | `obsidian` |
| `#111111` | Tooltip bg | `carbon` |
| `#1a1a1a` | Card bg, chart grid | `graphite` |
| `#2a2a2a` | Grid lines, borders | `steel` |
| `#888888` | Chart tick fill | `silver` |
| `#404040` | Axis strokes | `iron` |
| `#d4d4d4` | Body text | `chalk` |
| `#fafafa` | Primary text | `white` |
| `#22c55e` | Success states | `success` |
| `#ef4444` | Danger states | `danger` |

---

## 3. Typography

### 3.1 Font Families

| Token | CSS Variable | Font Stack | Usage |
|---|---|---|---|
| Display | `--font-display` | `'Syne', system-ui, sans-serif` | Headings, titles, app name |
| Body | `--font-body` | `'DM Sans', system-ui, sans-serif` | Body text, labels, buttons |

**Google Fonts import** (in `index.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Syne:wght@400..800&display=swap');
```

### 3.2 Text Sizes & Styles

| Element | Classes | Example |
|---|---|---|
| App title | `font-display font-extrabold text-xl tracking-[0.15em] text-lime` | "IRON LOG" |
| Card title | `font-display text-xl font-bold text-white` | Today's Workout |
| Section heading | `font-display text-xs font-bold uppercase tracking-wider text-silver` | "WEIGHT PROGRESS" |
| Stat value | `font-display text-2xl font-bold text-white` | "12", "75.5" |
| Stat label | `text-[10px] font-bold uppercase tracking-wider text-silver` | "STREAK", "WEIGHT LOG" |
| Body text | `text-sm text-silver` | Descriptions, tips |
| Small text | `text-xs text-silver` | Timestamps, helper text |
| Button text | `font-semibold text-sm` | "Mark Complete", "Add" |
| Nav label | `text-[10px] font-bold uppercase tracking-wider` | Tab labels |

---

## 4. Component Patterns & Styling

### 4.1 Cards

```
bg-graphite border border-steel rounded-2xl p-5
```

- All cards use `rounded-2xl` (16px radius)
- Padding is `p-5` (1.25rem / 20px)
- Border: 1px solid `steel`

### 4.2 Secondary Cards

```
bg-muted border border-steel rounded-xl p-4
```

### 4.3 Buttons

**Primary action (lime):**
```
flex items-center justify-center gap-2 py-3.5 bg-lime text-obsidian font-semibold rounded-xl hover:bg-lime-dim transition-colors active:scale-[0.98]
```

**Secondary button:**
```
flex items-center justify-center gap-2 py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors active:scale-[0.98]
```

**Danger button:**
```
flex items-center justify-center gap-2 py-2.5 border border-danger/30 rounded-lg text-danger text-sm font-semibold hover:bg-danger/10 transition-colors active:scale-[0.98]
```

### 4.4 Form Inputs

```
px-4 py-3.5 bg-muted border border-steel rounded-xl text-white placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all
```

- Min-height: `3.5rem` (56px) for touch targets
- Padding: `0.875rem 1rem`

### 4.5 Bottom Navigation

```
fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] bg-gradient-to-t from-obsidian via-carbon to-transparent border-t border-steel
```

- Active tab: `text-lime`, indicator bar with glow
- Inactive tab: `text-silver`
- Icon size: `22px`

### 4.6 Exercise Items

```
flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left w-full
```

Completed state:
```
bg-success/10 border-success/20
```

### 4.7 Day Selector Pills

Active:
```
bg-lime border-lime
```

Inactive:
```
bg-muted border-steel active:scale-95
```

---

## 5. Chart Theming (Recharts)

All charts follow the same dark theme:

| Property | Value |
|---|---|
| `CartesianGrid` stroke | `#2a2a2a` (steel), `strokeDasharray="3 3"` |
| `XAxis` / `YAxis` stroke | `#2a2a2a` (steel) |
| Tick text | `fontSize: 10, fill: '#888888'` (silver) |
| Tooltip bg | `#111111` (carbon) |
| Tooltip border | `1px solid #2a2a2a` (steel), `borderRadius: '8px'` |
| Primary data stroke/fill | `#c6f135` (lime) |
| Area gradient | From `#c6f135` opacity 0.3 → 0 |
| Bar fill (active) | `#c6f135` (lime) |
| Bar fill (inactive) | `#2a2a2a` (steel) |
| Bar radius | `[4, 4, 0, 0]` (top rounded) |
| Line dot | `r: 3, fill: '#c6f135'`, active dot `r: 5` |
| Chart height | `200px` (dashboard), `180px` (weight tracker) |

---

## 6. Spacing & Layout

| Concept | Value |
|---|---|
| Page horizontal padding | `px-5` (1.25rem) |
| Header padding | `px-5 py-3.5` |
| Bottom nav safe area | `pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]` |
| Content bottom padding | `pb-24` (6rem) |
| Card gap | `gap-4` (1rem) |
| Stat card grid | `grid grid-cols-3 gap-3` |
| Border radius (cards) | `rounded-2xl` (16px) |
| Border radius (buttons) | `rounded-xl` (12px) |
| Border radius (inputs) | `rounded-xl` (12px) |
| Border radius (small elements) | `rounded-lg` (8px), `rounded` (4px) |
| Min touch target | `3.5rem` (56px) for buttons/inputs |

---

## 7. Animations & Transitions

| Effect | Classes | Usage |
|---|---|---|
| Button press | `active:scale-[0.98]` | Tactile feedback |
| Card hover | `hover:border-iron` | Subtle lift |
| Tab switch | `transition-colors duration-200` | State changes |
| Menu open/close | `transition-transform duration-300`, `transition-opacity duration-300` | Slide menu |
| Focus ring | `focus:ring-2 focus:ring-lime/20` | Accessibility |
| Loading spinner | `animate-spin` | Loading states |

---

## 8. PWA & Meta Theme

| Property | Value |
|---|---|
| `<meta name="theme-color">` | `#080808` |
| PWA `theme_color` | `#080808` |
| PWA `background_color` | `#080808` |
| Display mode | `standalone` |
| Orientation | `portrait` |
| Viewport | `width=device-width, initial-scale=1.0, viewport-fit=cover` |

---

## 9. Icon System

- **Library:** Lucide React
- **Default size:** `22px` (nav), `18px` (buttons), `28px` (stat cards)
- **Stroke width:** `2` default, `2.5` for active nav tab
- **Color:** Inherits from parent text color via Tailwind classes
- **Icons used:** `LayoutDashboard`, `Dumbbell`, `Scale`, `TrendingUp`, `TrendingDown`, `Calendar`, `Flame`, `CheckCircle`, `Circle`, `PlusCircle`, `Save`, `Trash2`, `Plus`, `Menu`, `X`, `LogOut`, `Mail`, `Lock`, `User`, `ArrowRight`, `Target`, `Edit`, `ChevronDown`, `ChevronUp`, `Cpu`, `Download`, `Upload`, `Play`, `Search`

---

## 10. Dark Theme Rules

This app is **dark-mode only**. There is no light mode.

1. **Never use pure white backgrounds.** The lightest background is `muted` (`#1f1f1f`).
2. **Text hierarchy:** `white` → `chalk` → `silver` (primary → secondary → muted).
3. **Borders are always subtle:** `steel` (`#2a2a2a`) — barely visible separation.
4. **Accent is electric lime** (`#c6f135`) for all primary interactive elements.
5. **Glow effects** use `lime-glow` for active states.
6. **No drop shadows on cards.** Only the active tab indicator gets a subtle glow.

---

## 11. File-by-File Theme Reference

| File | Theme Elements |
|---|---|
| `index.html` | Google Fonts (Syne, DM Sans), theme-color meta `#080808` |
| `src/index.css` | `@theme` color tokens, font imports, base styles |
| `src/App.css` | Minimal utilities, Recharts overrides, scrollbar styles |
| `src/App.jsx` | Shell layout, bottom nav (4 tabs), slide menu, import/export |
| `src/components/AuthForm.jsx` | Login/register form with lime accent |
| `src/components/Dashboard.jsx` | Stat cards, area/bar charts |
| `src/components/WeightTracker.jsx` | Form inputs, line chart, trend badges |
| `src/components/WorkoutChecklist.jsx` | Exercise list, check states |
| `src/components/ManageWorkouts.jsx` | Day pills, exercise editor with ExercisePicker |
| `src/components/ExercisePicker.jsx` | Searchable dropdown for exercise selection |
| `src/components/EquipmentTracker.jsx` | Equipment list with categories, search, video modal |
| `src/components/Modal.jsx` | Reusable Modal, ConfirmModal, AlertModal |
| `src/services/api.js` | Axios client, auth interceptors, exercise/equipment caches |

---

## 12. Rules for AI Agents

1. **Read this file before making any UI changes.**
2. **Use Tailwind `*-obsidian/graphite/steel/lime` classes** for colors — do not introduce new hex values unless absolutely necessary.
3. **If you must use a raw hex**, pick from the palette in Section 2 and document it here.
4. **Keep Recharts configs consistent** with Section 5 values.
5. **Maintain the dark-only aesthetic** — no light backgrounds, no white cards.
6. **Respect touch targets** — minimum `3.5rem` (56px) for interactive elements.
7. **Use `rounded-2xl`** for cards, `rounded-xl` for buttons/inputs.
8. **Fonts:** Use `font-display` (Syne) for headings, default body font (DM Sans) for everything else.
9. **Icons:** Use Lucide React. Don't introduce a second icon library.
10. **New CSS variables** should be added to `@theme` in `index.css`.
11. **Avoid inline `<style>` tags** — use Tailwind classes instead.
12. **Update this file** when adding new colors, fonts, or design patterns.

---

## 13. Backend Architecture

### Database Models

| Model | Purpose |
|-------|---------|
| `User` | User data, weightLog, workoutLog, weeklySchedule |
| `Exercise` | Exercise definitions (82 exercises across 7 categories) |
| `Equipment` | Gym equipment with video URLs (39 items) |

### Routes

| Route File | Endpoints |
|------------|-----------|
| `routes/auth.js` | `/register`, `/login`, `/verify` |
| `routes/users.js` | Profile, weekly schedule, weight log, workout log |
| `routes/exercises.js` | CRUD for exercises |
| `routes/equipment.js` | List equipment with search/filter |

### Seed Scripts

```bash
# Seed exercises to database
node server/seedExercises.js

# Seed equipment to database  
node server/seedEquipment.js
```

---

## 14. Frontend Data Flow

### Exercise Caching
Exercises are cached in memory after first fetch to prevent duplicate API calls:
- `exerciseCache` - raw exercise array
- `exerciseMapCache` - map by MongoDB `_id`
- `exerciseNameMapCache` - map by exercise name (for import matching)

### Import/Export
- **Export**: Converts schedule to use exercise names (not IDs) for portability
- **Import**: Validates JSON, maps names back to local exercise IDs using name lookup

### Navigation
4 tabs in order: Home → Workout → Equipment → Progress
- Routes: `/dashboard`, `/checklist`, `/equipment`, `/weight`
- Bottom nav with active indicator glow
