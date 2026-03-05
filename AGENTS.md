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
| i18n | i18next + react-i18next | Latest |

- Tailwind v4 uses the new `@theme` directive in `src/index.css` (no `tailwind.config.js`).
- All styles use Tailwind utility classes. Minimal custom CSS in `App.css`.
- There is **no** component library. All UI is hand-built with Tailwind.
- **i18n is required** - all user-facing text must use translation keys from `src/i18n/locales/`

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

## 10. Theme Support

The app supports both dark and light themes with a toggle in the settings.

### 10.1 Dark Theme (Default)

This is the primary theme with the industrial athletic palette described above.

### 10.2 Light Theme

When light mode is enabled, the CSS variables are inverted:

```css
html.light {
  --color-obsidian: #faf9f7;
  --color-carbon: #ffffff;
  --color-graphite: #f5f4f1;
  --color-steel: #e8e6e1;
  --color-iron: #d4d2cc;
  --color-silver: #7a7873;
  --color-chalk: #2d2c2a;
  --color-white: #1a1918;
  --color-muted: #efede9;
  --color-lime: #7abf1a;
  --color-lime-dim: #5fa615;
}
```

To toggle theme programmatically:
```jsx
const toggleTheme = () => {
  setTheme(prev => prev === 'light' ? 'dark' : 'light');
};
```

---

## 11. Dark Theme Rules

The app has light mode support, but dark theme is the default and primary experience.

1. **Never use pure white backgrounds.** The lightest background is `muted` (`#1f1f1f`) in dark mode.
2. **Text hierarchy:** `white` → `chalk` → `silver` (primary → secondary → muted).
3. **Borders are always subtle:** `steel` (`#2a2a2a`) — barely visible separation.
4. **Accent is electric lime** (`#c6f135`) for all primary interactive elements.
5. **Glow effects** use `lime-glow` for active states.
6. **No drop shadows on cards.** Only the active tab indicator gets a subtle glow.

---

## 11. File-by-File Theme Reference

| File | Theme Elements |
|---|---|
| `index.html` | Google Fonts (Syne, DM Sans), theme-color meta `#080808`, viewport-fit=cover |
| `src/index.css` | `@theme` color tokens, font imports, base styles, safe area CSS vars |
| `src/App.css` | Minimal utilities, Recharts overrides, scrollbar styles |
| `src/App.jsx` | Shell layout, bottom nav (5 tabs), slide menu, import/export, safe area handling |
| `src/hooks/useDeviceInsets.js` | Hook for detecting notch and software navigation insets |
| `src/hooks/useTheme.js` | Theme state management (dark/light toggle) |
| `src/i18n/index.js` | i18n configuration with react-i18next |
| `src/components/ui/` | Global reusable UI components (Button, Input, Card, Modal, etc.) |
| `src/features/dashboard/Dashboard.jsx` | Stat cards, area/bar charts |
| `src/features/weight/WeightTracker.jsx` | Form inputs, line chart, trend badges |
| `src/features/workout/WorkoutChecklist.jsx` | Exercise list, check states |
| `src/features/workout/ManageWorkouts.jsx` | Day pills, exercise editor with ExercisePicker |
| `src/features/workout/ExercisePicker.jsx` | Searchable dropdown for exercise selection |
| `src/features/equipment/EquipmentTracker.jsx` | Equipment list with categories, search, video modal |
| `src/features/settings/Settings.jsx` | Profile and password management |
| `src/features/auth/AuthForm.jsx` | Login/register form |
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
13. **i18n required** - All user-facing text must use `useTranslation` hook with keys from `src/i18n/locales/`. Never hardcode display text.
14. **DRY Principle** - Follow the project structure in Section 17. Reuse global components from `src/components/ui/`.
15. **Feature organization** - Each feature should be in `src/features/<feature-name>/` with its own components, hooks (if specific), and utilities if needed.
16. **Barrel exports** - Each directory must have an `index.js` file exporting its contents for clean imports.

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
5 tabs in order: Home → Workout → Equipment → Progress → Settings
- Routes: `/dashboard`, `/checklist`, `/equipment`, `/weight`, `/settings`
- Bottom nav with active indicator glow

---

## 15. Android PWA & Build

### 15.1 Build Scripts

```bash
# Build release APK (web assets + Android)
./scripts/build-release.sh

# Or manually:
cd client && npm run build
cd client/android && ./gradlew assembleRelease
```

### 15.2 APK Locations

- `client/public/app-release.apk` - served on website
- `client/dist/app-release.apk` - bundled with build

### 15.3 Safe Area Insets (Notch/Navigation)

The app handles device cutouts and software navigation:

- **Hook**: `src/hooks/useDeviceInsets.js`
- **Detection**: Uses CSS `env(safe-area-inset-*)` + fallback calculation
- **State**: `hasNotch`, `hasBottomInset`, `top`, `bottom`

**Usage in components:**
```jsx
const { top: safeAreaTop, bottom: safeAreaBottom, hasNotch, hasBottomInset } = useDeviceInsets();

// Apply to header
style={{ paddingTop: hasNotch ? `${safeAreaTop + 14}px` : undefined }}

// Apply to bottom nav
style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 8}px` : undefined }}
```

### 15.4 CSS Variables for Safe Areas

In `index.css`:
```css
:root {
  --sat: env(safe-area-inset-top);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
  --sar: env(safe-area-inset-right);
}
```

### 15.5 Native App Detection

```js
const isNativeApp = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.userAgent.includes('wv');
```

---

## 16. Project Structure

```
workout-tracker/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/ui/   # Global reusable UI components
│   │   │   ├── index.jsx     # Barrel exports
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── ExerciseItem.jsx
│   │   │   ├── TipBox.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ChartTooltip.jsx
│   │   │   └── LanguageSwitcher.jsx
│   │   │
│   │   ├── features/         # Feature-based modules
│   │   │   ├── dashboard/    # Dashboard feature
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── index.js
│   │   │   ├── workout/       # Workout feature
│   │   │   │   ├── WorkoutChecklist.jsx
│   │   │   │   ├── ManageWorkouts.jsx
│   │   │   │   ├── ExercisePicker.jsx
│   │   │   │   └── index.js
│   │   │   ├── weight/        # Weight tracking feature
│   │   │   │   ├── WeightTracker.jsx
│   │   │   │   └── index.js
│   │   │   ├── equipment/     # Equipment feature
│   │   │   │   ├── EquipmentTracker.jsx
│   │   │   │   └── index.js
│   │   │   ├── exercises/     # Exercises feature
│   │   │   │   ├── ExercisesTracker.jsx
│   │   │   │   └── index.js
│   │   │   ├── settings/      # Settings feature
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── index.js
│   │   │   ├── auth/          # Auth feature
│   │   │   │   ├── AuthForm.jsx
│   │   │   │   └── index.js
│   │   │   ├── about/         # About feature
│   │   │   │   ├── AboutPage.jsx
│   │   │   │   └── index.js
│   │   │   └── index.js       # Feature barrel exports
│   │   │
│   │   ├── hooks/            # Global hooks
│   │   │   ├── useDeviceInsets.js
│   │   │   ├── useTheme.js
│   │   │   └── index.js
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   └── index.js
│   │   │
│   │   ├── constants/         # App constants
│   │   │   └── index.js
│   │   │
│   │   ├── types/             # Type definitions
│   │   │   └── index.js
│   │   │
│   │   ├── i18n/              # Internationalization
│   │   │   ├── index.js        # i18n config
│   │   │   └── locales/
│   │   │       ├── en.json     # English
│   │   │       ├── es.json     # Spanish
│   │   │       └── nl.json     # Dutch
│   │   │
│   │   ├── services/          # API services
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx           # Main app with routing
│   │   ├── index.css         # Tailwind theme & base styles
│   │   └── main.jsx           # Entry point
│   ├── android/               # Android native project
│   ├── public/                # Static assets + APK
│   ├── capacitor.config.json  # Capacitor config
│   └── package.json
├── server/                    # Node.js backend
│   ├── routes/                # API routes
│   ├── models/               # Mongoose models
│   └── index.js              # Express server
├── scripts/                   # Build scripts
│   └── build-release.sh      # Build release APK
└── AGENTS.md                  # This file
```

---

## 17. DRY Principle & Global Architecture

### 17.1 Global UI Components (`src/components/ui/`)

All reusable UI primitives are centralized here. Each component must be imported from the barrel export:

```jsx
import { Button, Input, Card, Modal, StatCard, Badge, SearchInput, PageHeader, ExerciseItem, TipBox, EmptyState, ChartTooltip, LanguageSwitcher } from '@/components/ui';
```

| Component | Purpose |
|---|---|
| `Button` | Primary, secondary, danger, ghost variants with loading state |
| `Input` | Text, password, number inputs with label and error support |
| `Card` | Default, secondary, elevated, gradient variants |
| `Modal` | Base modal with ConfirmModal, AlertModal, VideoModal |
| `StatCard` | Dashboard statistics with icon, label, value, trend |
| `Badge` | Status badges with color variants |
| `SearchInput` | Search input with clear button |
| `PageHeader` | Page title and subtitle with action slot |
| `ExerciseItem` | Workout exercise item with completion toggle and PR editing |
| `TipBox` | Tip/pro tip boxes with variants |
| `EmptyState` | Empty state with icon, title, message |
| `ChartTooltip` | Consistent chart tooltips |
| `LanguageSwitcher` | Dropdown language selector |

### 17.2 Global Hooks (`src/hooks/`)

```jsx
import { useDeviceInsets, useTheme } from '@/hooks';
```

- **useDeviceInsets**: Returns `{ top, bottom, hasNotch, hasBottomInset }` for safe area handling
- **useTheme**: Returns `{ theme, setTheme, toggleTheme, isDark, isLight }` for theme management

### 17.3 Global Utils (`src/utils/`)

Centralized utility functions for reuse across features:
- Date formatting: `formatDate`, `formatDateShort`, `getTodayName`, `getTomorrowName`, `getDateKey`
- Weight utilities: `formatWeight`, `getWeightTrend`, `calculateWeightChange`
- Common: `getInitials`, `debounce`, `groupBy`, `sortByDate`, `downloadJSON`, `readJSONFile`

### 17.4 Global Constants (`src/constants/`)

Centralized app constants:
- `DAYS_OF_WEEK`, `WEIGHT_UNITS`, `DIFFICULTY_LEVELS`, `EQUIPMENT_CATEGORIES`
- `ROUTES`, `STORAGE_KEYS`, `CHART_CONFIG`, `APP_NAME`

### 17.5 Feature Structure

Each feature lives in `src/features/<feature-name>/` with:
- Main component (`Dashboard.jsx`, `WeightTracker.jsx`, etc.)
- Sub-components specific to the feature
- `index.js` barrel export

```jsx
// Importing features
import { Dashboard } from '@/features/dashboard';
import { WorkoutChecklist, ManageWorkouts } from '@/features/workout';
```

### 17.6 Using Global Components

When building new features, always use global components first:

```jsx
import { PageHeader, Card, Button, Input, Badge, TipBox } from '@/components/ui';
import { useTranslation } from 'react-i18next';

function MyFeature() {
  const { t } = useTranslation();
  
  return (
    <div>
      <PageHeader title={t('myFeature.title')} subtitle={t('myFeature.subtitle')} />
      <Card>
        <Button>{t('common.save')}</Button>
      </Card>
    </div>
  );
}
```

---

## 18. Internationalization (i18n)

### 18.1 Supported Languages
- English (en) - Default
- Spanish (es)
- Dutch (nl)

### 18.2 Adding New Translations

1. Add translation keys to `src/i18n/locales/en.json`
2. Add same keys to other locale files (`es.json`, `nl.json`)
3. Use in components:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('myComponent.title')}</h1>;
}
```

### 18.3 Language Switcher

The `LanguageSwitcher` component is available in the side menu. It:
- Shows current language with flag
- Dropdown to select between EN/ES/NL
- Persists selection to localStorage

### 18.4 Translation Key Structure

```json
{
  "app": { "name": "...", "tagline": "..." },
  "nav": { "home": "...", "workout": "...", ... },
  "auth": { "signIn": "...", "signUp": "...", ... },
  "dashboard": { "streak": "...", ... },
  "workout": { "title": "...", ... },
  "settings": { "title": "...", ... },
  "common": { "save": "...", "cancel": "...", ... },
  "importExport": { ... }
}
```
```
