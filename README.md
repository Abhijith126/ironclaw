# 💪 Health & Fitness Tracker

A zero-budget, offline-capable workout and weight tracking PWA built with React + Vite.

## Features

- **Workout Schedules** - Push/Pull/Legs or Full Body routines with daily checkboxes
- **Weekly Reset** - Auto-resets every Monday for fresh start
- **Dashboard Stats** - Streak tracking, completion rates, graphs
- **Weight Tracker** - Log weight with trend visualization
- **PWA Ready** - Install on Android/desktop, works offline
- **Data Persistence** - LocalStorage (no server needed)
- **Zero Budget** - Free hosting on Vercel/Netlify

## Tech Stack

- React 18 + Vite
- Recharts (graphs)
- Lucide React (icons)
- Vite PWA Plugin (installable app)
- LocalStorage (data persistence)

## Getting Started

### Development

```bash
cd workout-tracker
npm install
npm run dev
```

Open browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Production files in `dist/` folder.

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Or drag the `dist/` folder to [Vercel](https://vercel.com/import).

## Project Structure

```
src/
├── App.jsx                 # Main app with tabs & state
├── App.css                 # Global styles
├── data/
│   └── workoutTypes.js    # Workout schedules & routines
├── components/
│   ├── WorkoutChecklist.jsx  # Daily workout checklist
│   ├── Dashboard.jsx         # Stats & charts
│   └── WeightTracker.jsx     # Weight logging & graph
└── assets/                # Static assets (icons, etc.)
```

## Phase 2 Enhancements (Planned)

- [ ] YouTube exercise guide integration (video embeds)
- [ ] Image-based exercise instructions
- [ ] Select from multiple workout programs (starting strength, bro split, custom)
- [ ] Body measurement tracking (chest, waist, arms, etc.)
- [ ] Export data as CSV/JSON
- [ ] Dark mode toggle
- [ ] Shared workout calendars (Firebase)
- [ ] PWA push notifications for workout reminders
- [ ] Exercise library with proper form tips

## Usage

1. **First Run:** Go to Weight tab, log your starting weight
2. **Daily:** Check Workout tab, mark exercises complete
3. **Track:** View Dashboard for trends and stats
4. **Weekly:** Auto-resets every Monday - keep the streak alive!

## Data Storage

All data stored in browser's LocalStorage:
- `workout-tracker-data` - Main app state (schedule, completion, weight logs)

To backup: Open browser DevTools → Application → Storage → Local Storage → copy data

## Customization

Edit `src/data/workoutTypes.js` to:
- Change workout routine
- Modify exercises/sets/reps
- Add custom programs

## Browser Support

- Chrome/Edge (desktop + Android)
- Safari (iOS)
- Firefox

Works offline after first load (PWA installed).

---

**Built with React + Vite. Zero budget, maximum gains. 🏋️**
