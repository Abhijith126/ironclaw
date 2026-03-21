# Architecture Overview

Iron Log is a mobile-first PWA workout tracking application with a React frontend and Express backend.

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Frontend | React + TypeScript | 19.x | SPA with client-side routing |
| Build | Vite | 7.x | With Tailwind CSS v4 plugin |
| Styling | Tailwind CSS | v4 | Custom theme tokens in `index.css` |
| Charts | Recharts | 3.x | Weight tracking charts |
| Icons | Lucide React | 0.575+ | Only icon library used |
| i18n | i18next + react-i18next | - | EN, ES, NL locales |
| PWA | vite-plugin-pwa | 1.x | Service worker with workbox |
| Backend | Express | 5.x | REST API, CommonJS modules |
| Database | MongoDB + Mongoose | 9.x | In-memory fallback for local dev |
| Auth | JWT + bcrypt | - | 7-day token expiry |
| External API | wger.de | v2 | Exercise/equipment data source |
| Mobile | Capacitor | - | Android APK build |

## Project Structure

```
ironclaw/
├── client/                     # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/ui/      # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├── features/           # Feature modules (dashboard, workout, weight, etc.)
│   │   │   ├── auth/           # Login/register
│   │   │   ├── dashboard/      # Home dashboard
│   │   │   ├── workout/        # Workout checklist + exercise picker + manage
│   │   │   ├── exercises/      # Exercise browser
│   │   │   ├── weight/         # Weight tracking with charts
│   │   │   ├── equipment/      # Equipment browser
│   │   │   ├── settings/       # User settings
│   │   │   └── about/          # About page
│   │   ├── hooks/              # Custom hooks (useTheme, useDayCarousel, etc.)
│   │   ├── contexts/           # React contexts (AuthContext)
│   │   ├── services/           # API client (axios instance + endpoint wrappers)
│   │   ├── constants/          # App constants, routes, chart config
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Utility functions
│   │   └── i18n/               # Translation files (en, es, nl)
│   ├── android/                # Capacitor Android project
│   ├── vite.config.ts          # Vite + Tailwind + PWA config
│   └── nginx.conf              # Production nginx config (Docker)
│
├── server/                     # Express backend (CommonJS)
│   ├── index.js                # Server entry, DB connection, seeding
│   ├── middleware/auth.js      # JWT auth middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # User with weeklySchedule, weightLog, workoutLog
│   │   ├── Workout.js          # Workout with exercises and sets
│   │   ├── Exercise.js         # Exercise catalog
│   │   └── Equipment.js        # Gym equipment
│   ├── routes/                 # Express route handlers
│   │   ├── auth.js             # Register, login, Google OAuth, token verify
│   │   ├── users.js            # Profile, schedule, weight log, workout log
│   │   ├── workouts.js         # CRUD workouts with set-level completion
│   │   ├── exercises.js        # Exercise catalog (read-only, wger-sourced)
│   │   └── equipment.js        # Equipment from wger API
│   ├── services/wger.js        # wger.de API client with 24h cache
│   └── scripts/                # Seed scripts for exercises and equipment
│
├── docker-compose.yml          # MongoDB + server + client containers
├── deploy.sh                   # Production deploy script
└── AGENTS.md                   # AI agent coding guidelines
```

## Data Flow

```
Browser/PWA
    │
    ├── AuthContext (JWT in localStorage)
    │       │
    │       ▼
    ├── api.ts (axios instance, auto-attaches Bearer token)
    │       │
    │       ▼
    └── Express API (port 3001)
            │
            ├── auth middleware (JWT verify → User lookup)
            │
            ├── MongoDB (user data, schedules, logs)
            │
            └── wger.de API (exercise/equipment catalog, 24h cached)
```

## Key Architectural Decisions

1. **User-centric data model**: Weekly schedules, weight logs, and workout logs are embedded in the User document (not separate collections). This simplifies queries but means all user data is in one document.

2. **In-memory MongoDB for dev**: When `MONGODB_URI` is not set, the server uses `mongodb-memory-server` and auto-seeds test data including a test user (`test@ironlog.com` / `test1234`).

3. **Exercise data is read-only**: Exercises are seeded from `exerciseData.js` on first run. The POST/PUT/DELETE endpoints on `/api/exercises` return 403. New exercises come from the wger API sync scripts.

4. **Client-side exercise caching**: The API service (`api.ts`) caches exercise data in memory after the first fetch, providing `getExerciseMap()` and `getExerciseNameMap()` helpers.

5. **Feature-based organization**: Frontend code is organized by feature (`features/workout/`, `features/weight/`, etc.) with barrel exports via `index.ts` files.

6. **Dual theme support**: Dark theme is primary. Light theme overrides CSS custom properties via `html.light` class in `index.css`.
