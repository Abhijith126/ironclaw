# PR (Personal Record) Feature Specification

## Overview

Add the ability for users to track their Personal Records (PRs) for exercises in their workout schedule. PRs are stored per user per scheduled exercise and displayed on the Dashboard for today's workout.

## Goals

1. Allow users to set initial PRs when creating workout schedules
2. Display current PRs on the Workout Checklist
3. Allow users to update PRs after completing workouts
4. Show today's workout PRs on the Dashboard for motivation
5. Add weight unit preference (lbs/kg) in Settings

---

## Data Model Changes

### 1. User Model - Add weightUnit preference

```javascript
// In User.js - add to schema
weightUnit: {
  type: String,
  enum: ['kg', 'lbs'],
  default: 'kg'
}
```

### 2. Weekly Schedule - Add PR to each exercise

Current structure:
```javascript
weeklySchedule: Map<dayName, [
  { id: "exerciseId", sets: Number, reps: String }
]>
```

New structure:
```javascript
weeklySchedule: Map<dayName, [
  { 
    id: "exerciseId", 
    sets: Number, 
    reps: String,
    pr: { weight: Number, reps: Number }  // NEW
  }
]>
```

---

## API Changes

### 1. Update Profile Endpoint
Add `weightUnit` to allowed fields in `PUT /users/profile`

### 2. Update Weekly Schedule Endpoint
Ensure PR field is preserved when updating schedule

---

## Frontend Changes

### 1. Settings Page (`Settings.jsx`)

- Add weight unit selector (kg/lbs) in profile section
- Display current unit next to weight fields (e.g., "70 kg")

**UI Pattern:**
```
┌─────────────────────────────────────┐
│  Weight Unit                        │
│  [kg] [lbs]                        │
└─────────────────────────────────────┘
```

### 2. Manage Workouts (`ManageWorkouts.jsx`)

When editing exercises in a day's schedule:
- Add PR input fields (weight + reps)
- Show current PR if already set

**UI Pattern:**
```
┌─────────────────────────────────────┐
│  Chest Press Machine                │
│  Sets: [3]  Reps: [10]             │
│  PR: [32] kg × [10] reps           │
└─────────────────────────────────────┘
```

### 3. Workout Checklist (`WorkoutChecklist.jsx`)

- Display current PR next to each exercise
- Allow editing PR after completing exercise

**UI Pattern:**
```
┌─────────────────────────────────────┐
│  ✓ Chest Press Machine              │
│    PR: 32 kg × 10 reps             │
│    [Update PR]                      │
└─────────────────────────────────────┘
```

### 4. Dashboard (`Dashboard.jsx`)

- Show today's scheduled exercises with their PRs
- Display "Set PR" if no PR configured

**UI Pattern:**
```
┌─────────────────────────────────────┐
│  TODAY'S PRs                        │
│                                     │
│  Chest Press: 32 kg × 10 reps      │
│  Lat Pulldown: 40 kg × 12 reps     │
│  Leg Press: 80 kg × 15 reps        │
└─────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Backend

1. **Update User Model**
   - Add `weightUnit` field with default `kg`

2. **Update Profile Routes**
   - Add `weightUnit` to allowed update fields

3. **Test existing endpoints**
   - Ensure weekly schedule with PRs saves correctly

### Phase 2: Settings

1. **Add weight unit selector**
   - Add to profile section
   - Persist to user profile

### Phase 3: Manage Workouts

1. **Add PR input fields**
   - When adding/editing exercises
   - Weight input + reps input
   - Show unit label (kg/lbs)

### Phase 4: Workout Checklist

1. **Display PR**
   - Show PR next to each exercise
   - Show "Set PR" if none exists

2. **Update PR**
   - Allow editing after completion
   - Save to weekly schedule

### Phase 5: Dashboard

1. **Show today's PRs**
   - Get today's day name
   - Fetch schedule for that day
   - Display exercises with PRs

---

## Edge Cases & Considerations

1. **Exercise matching**: Since exercise IDs change on seed, use exercise names for matching PRs in schedule

2. **Unit conversion**: Store preference only, don't convert values. User enters in their preferred unit

3. **Empty PRs**: Handle gracefully - show "Set PR" prompt instead of breaking

4. **Multiple exercises same name**: Schedule stores by exercise ID, so each scheduled instance has its own PR

5. **First-time users**: No PRs set initially - encourage setting them in Manage Workouts

---

## File Changes Summary

### Backend
- `server/models/User.js` - Add weightUnit field
- `server/routes/users.js` - Add weightUnit to profile update

### Frontend
- `src/components/Settings.jsx` - Add weight unit selector
- `src/components/ManageWorkouts.jsx` - Add PR inputs
- `src/components/WorkoutChecklist.jsx` - Display and update PRs
- `src/components/Dashboard.jsx` - Show today's PRs

---

## Future Enhancements (Out of Scope)

- PR celebrations/notifications
- PR history tracking
- Automatic PR detection (user beats PR → auto-prompt)
- Leaderboards
- Export PR data
