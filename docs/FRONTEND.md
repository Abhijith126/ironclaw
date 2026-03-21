# Frontend Architecture

## Entry Point

`client/src/main.tsx` → renders `AppWrapper` from `App.tsx`.

```
AppWrapper (AuthProvider)
  └── App (Router, auth gate)
       ├── /auth → AuthForm (when not logged in)
       └── /* → ProtectedRoute → AppContent
                ├── Header (sticky, with app name + date)
                ├── Routes (main content area)
                │   ├── /dashboard → Dashboard
                │   ├── /checklist → WorkoutChecklist
                │   ├── /exercises → ExercisesTracker
                │   ├── /weight → WeightTracker
                │   ├── /settings → Settings
                │   └── /about → AboutPage
                └── Bottom Nav (5 tabs: Home, Workout, Exercises, Progress, Profile)
```

## Routing

Routes are defined as constants in `client/src/constants/index.ts`:

```typescript
ROUTES = {
  DASHBOARD: '/dashboard',
  WORKOUT: '/checklist',
  EQUIPMENT: '/equipment',
  EXERCISES: '/exercises',
  WEIGHT: '/weight',
  SETTINGS: '/settings',
  ABOUT: '/about',
  AUTH: '/auth',
}
```

`ProtectedRoute` component redirects to `/auth` when no user is in context.

## State Management

### AuthContext (`client/src/contexts/AuthContext.tsx`)

Global auth state via React Context. Provides:

| Method | Description |
|--------|-------------|
| `user` | Current user object or null |
| `isLoading` | True during initial auth check |
| `login(user)` | Set user + persist to localStorage |
| `logout()` | Clear token + user from localStorage |
| `updateUser(data)` | PATCH profile via API + update context |
| `refreshUser()` | Re-fetch profile from API |

Token is stored in `localStorage` under key `token`. User data under key `user`.

### Local Component State

Features manage their own state with `useState`/`useEffect`. No global state library (Redux, Zustand) is used.

## Custom Hooks (`client/src/hooks/`)

| Hook | File | Purpose |
|------|------|---------|
| `useDeviceInsets` | `useDeviceInsets.ts` | Returns safe area insets (`top`, `bottom`) for notch/navigation bar |
| `useTheme` | `useTheme.ts` | Dark/light theme toggle, persists to localStorage |
| `useExerciseMap` | `useExerciseMap.ts` | Fetches and caches exercise ID→name/image map |
| `useDayCarousel` | `useDayCarousel.ts` | Day-of-week carousel logic for workout views |
| `useImportExport` | `useImportExport.ts` | Import/export weekly schedule as JSON files |
| `useAppNavigation` | `useAppNavigation.ts` | Bottom tab navigation state and routing |

## UI Components (`client/src/components/ui/`)

All reusable components are exported from `client/src/components/ui/index.tsx`:

| Component | Description |
|-----------|-------------|
| `Button` | Primary/secondary/danger variants, supports loading state |
| `Input` | Styled text input with label support |
| `Card` | Container with `bg-graphite border-steel rounded-2xl` |
| `Modal` | Overlay modal with backdrop |
| `ConfirmModal` | Modal with confirm/cancel actions |
| `AlertModal` | Success/error alert modal |
| `Badge` | Small label badge |
| `PageHeader` | Page title with optional back button |
| `StatCard` | Metric display card |
| `ExerciseItem` | Exercise row with image, sets, reps |
| `DayCarousel` | Horizontal day-of-week selector |
| `SearchInput` | Search input with icon |
| `WeightChart` | Recharts line chart for weight history |
| `ChartTooltip` | Custom tooltip for Recharts |
| `EmptyState` | Placeholder for empty data views |
| `Loader` | Loading spinner |
| `TipBox` | Info/tip callout box |
| `SettingsMenuItem` | Settings page menu item |
| `LanguageSwitcher` | Language selector dropdown |

## Feature Modules (`client/src/features/`)

Each feature follows this pattern:

```
features/<name>/
  ├── <Name>.tsx     # Main component
  └── index.ts       # Barrel export: export { Name } from './<Name>';
```

| Feature | Components | Key Functionality |
|---------|------------|-------------------|
| `auth` | `AuthForm` | Login/register forms, Google OAuth |
| `dashboard` | `Dashboard` | Daily overview, streak, today's workout summary |
| `workout` | `WorkoutChecklist`, `ManageWorkouts`, `ExercisePicker` | Today's exercises with completion toggle, schedule editor |
| `exercises` | `ExercisesTracker` | Browse/search exercise catalog |
| `weight` | `WeightTracker` | Log weight, view chart trends |
| `equipment` | `EquipmentTracker` | Browse gym equipment |
| `settings` | `Settings` | Profile edit, theme toggle, import/export, logout |
| `about` | `AboutPage` | App info |

## API Client (`client/src/services/api.ts`)

Axios instance with:
- Base URL from `VITE_API_URL` env var (default: `http://localhost:3001/api`)
- Request interceptor auto-attaches JWT from localStorage
- Organized endpoint wrappers: `authAPI`, `userAPI`, `workoutAPI`, `exerciseAPI`, `equipmentAPI`
- Exercise caching: `getExercises()`, `getExerciseMap()`, `getExerciseNameMap()`, `transformExercisesForPicker()`

## i18n

Three locales supported: English (`en`), Spanish (`es`), Dutch (`nl`).

Translation files: `client/src/i18n/locales/{en,es,nl}.json`

All user-facing text must use `useTranslation()`:
```tsx
const { t } = useTranslation();
return <span>{t('dashboard.title')}</span>;
```

## PWA Configuration

Defined in `client/vite.config.ts`:
- Auto-update service worker registration
- Standalone display mode, portrait orientation
- Workbox runtime caching for API requests (NetworkFirst, 24h expiry)
- Excludes `.apk` files from precache
- Theme color: `#080808` (obsidian)
