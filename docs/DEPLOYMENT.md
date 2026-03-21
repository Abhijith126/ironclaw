# Deployment & Infrastructure

## Architecture (Production)

```
Browser → nginx (port 3002)
              ├── Static files (React build)
              ├── /api/* → proxy to Express (port 3001)
              └── /* → index.html (SPA fallback)
                          │
           Express (port 3001)
              └── MongoDB (port 27017)
```

All three services run as Docker containers on a bridge network (`workout-app-network`).

## Docker Compose Services

| Service | Image | Container Name | Exposed Ports |
|---------|-------|----------------|---------------|
| mongodb | `mongo:7` | `workout-mongodb` | Internal only |
| server | Built from `./server/Dockerfile` | `workout-server` | Internal only (3001) |
| client | Built from `./client/Dockerfile` | `workout-client` | `3002:80` |

### Volumes
- MongoDB data: `~/docker/ironclaw/data:/data/db`

### Environment Variables

**Server container:**
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/workout-tracker
JWT_SECRET=${JWT_SECRET}      # from host .env
```

**Client build arg:**
```
VITE_API_URL=/api             # relative path, proxied by nginx
```

## Nginx Configuration (`client/nginx.conf`)

- Gzip enabled for text/JS/CSS/JSON
- Static assets cached for 1 year (`Cache-Control: public, immutable`)
- `/api/` proxied to `http://server:3001`
- Service worker served directly
- All other routes fall back to `index.html` (SPA)

## Deploy Script (`deploy.sh`)

Steps:
1. Stop and remove old containers
2. Copy APK to `client/dist/downloads/` (if exists)
3. `docker-compose up -d --build`
4. Prune dangling images
5. Show container status

Run: `./deploy.sh`

## Environment Setup

### Required `.env` file (project root)
```
MONGODB_URI=mongodb://localhost:27017/workout-tracker
JWT_SECRET=your-secret-key
```

### Server `.env` (`server/.env`)
```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/workout-tracker
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5175
```

### Client env (via Vite)
```
VITE_API_URL=http://localhost:3001/api    # dev (default if unset)
VITE_API_URL=/api                         # production (Docker build arg)
```

## Local Development

```bash
# Terminal 1 - Backend (auto-seeds with in-memory MongoDB)
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

- Frontend: http://localhost:5175
- Backend: http://localhost:3001
- Test user (in-memory mode): `test@ironlog.com` / `test1234`

When `MONGODB_URI` is not set, the server uses `mongodb-memory-server` and seeds test data automatically.

## Android APK Build

The project uses Capacitor for Android builds:
- Capacitor config: `client/android/`
- Package: `com.ironlog.app`
- Keystore: `client/android/workout-app.keystore`
- Built APK served at: `/downloads/app.apk`
- Build script: `build-release.sh`

## Database Seeding

### Auto-seed (first run with persistent MongoDB)
When the database is empty, `server/index.js` automatically seeds exercises and equipment from:
- `server/scripts/exerciseData.js`
- `server/scripts/equipmentData.js`

### Manual seed scripts
```bash
cd server
node scripts/seedExercises.js     # Seed exercise catalog
node scripts/seedEquipment.js     # Seed equipment catalog
node scripts/syncWgerExercises.js # Sync from wger.de API
```

## External Dependencies

### wger.de API
- Used for equipment data fetching (live, 24h cached)
- Exercise sync available via scripts
- API key configured in `server/services/wger.js`
- Base URL: `https://wger.de/api/v2`
