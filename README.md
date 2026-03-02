# Iron Log - Workout Tracker

A mobile-first PWA workout tracking application with dark theme and electric lime accent.

## Features

- **User Authentication** - Register/login with email or Google Auth
- **Workout Scheduling** - Create weekly workout routines with exercises
- **Exercise Picker** - Searchable dropdown with 60+ exercises across 7 categories
- **Workout Logging** - Track daily workout completions
- **Weight Tracking** - Log weight over time with trend charts
- **Equipment Guide** - Browse gym equipment with tutorial videos
- **Import/Export** - Share workout schedules via JSON files
- **PWA Support** - Installable as a mobile app

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 19.x |
| Build tool | Vite | 7.x |
| Styling | Tailwind CSS v4 | 4.x |
| HTTP client | Axios | 1.x |
| Charts | Recharts | 3.x |
| Routing | React Router | 7.x |
| Icons | Lucide React | 0.575+ |
| PWA | vite-plugin-pwa | 1.x |
| Date utils | date-fns | 4.x |
| Backend | Express | 5.x |
| Database | MongoDB/Mongoose | 9.x |
| Auth | JWT, bcrypt | - |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Start MongoDB (if local)
mongod
```

### Development

```bash
# Terminal 1 - Start backend
cd server && npm run dev

# Terminal 2 - Start frontend
cd client && npm run dev
```

- Frontend: http://localhost:5175
- Backend API: http://localhost:3001

### Production Build

```bash
# Build frontend
cd client && npm run build

# Preview production build
cd client && npm run preview
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API client
│   │   ├── data/         # Static data (exercises.js)
│   │   └── App.jsx       # Main app with routing
│   └── vite.config.js    # Vite + PWA + Tailwind config
│
├── server/                # Express backend
│   ├── routes/           # API endpoints
│   ├── models/           # MongoDB schemas
│   ├── middleware/       # Auth middleware
│   └── index.js          # Server entry
│
└── agent.md              # Design system & guidelines
```

## Environment Variables

### Server (.env)

```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/workout-tracker
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5175
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/weekly-schedule` - Get workout schedule
- `PUT /api/users/weekly-schedule` - Update schedule
- `GET /api/users/weight-log` - Get weight history
- `POST /api/users/weight-log` - Add weight entry
- `GET /api/users/workout-log` - Get workout completions
- `POST /api/users/workout-log` - Log workout

### Exercises
- `GET /api/exercises` - Get all exercises

### Equipment
- `GET /api/equipment` - Get all equipment (supports search & category filters)
- `GET /api/equipment/categories` - Get equipment categories

## Design System

See [agent.md](./agent.md) for detailed design guidelines including:
- Color palette (dark theme with electric lime accent)
- Typography (Syne + DM Sans)
- Component patterns
- Chart theming
- Spacing & layout conventions

## License

MIT
