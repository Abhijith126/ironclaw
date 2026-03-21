# API Reference

Base URL: `http://localhost:3001/api` (dev) or `/api` (production via nginx proxy)

All authenticated endpoints require `Authorization: Bearer <jwt_token>` header.
The axios client in `client/src/services/api.ts` attaches this automatically from `localStorage`.

---

## Auth (`/api/auth`)

### POST `/auth/register`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "age": 25,
  "height": 175,
  "weight": 75
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { "id", "email", "name", "age", "height", "weight" }
}
```

### POST `/auth/login`
Authenticate with email/password. Rejects Google OAuth users.

**Request:**
```json
{ "email": "user@example.com", "password": "password123" }
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { "id", "email", "name", "age", "height", "weight", "profilePicture" }
}
```

### POST `/auth/google`
Google OAuth login/register. Creates user if not exists, links Google ID to existing email if found.

**Request:**
```json
{ "googleId": "google_id", "email": "user@gmail.com", "name": "John" }
```

**Response (200):** Same shape as login.

### GET `/auth/verify`
Verify JWT token validity. **Requires auth header.**

**Response (200):**
```json
{
  "valid": true,
  "user": { "id", "email", "name", "age", "height", "weight", "profilePicture" }
}
```

---

## Users (`/api/users`) — All routes require auth

### GET `/users/profile`
**Response:**
```json
{
  "user": {
    "id", "email", "name", "age", "height", "weight",
    "weightUnit", "profilePicture", "createdAt", "lastLogin"
  }
}
```

### PUT `/users/profile`
Update profile fields. All fields optional.

**Request:**
```json
{ "name": "New Name", "age": 26, "height": 180, "weight": 80, "weightUnit": "kg", "profilePicture": "url" }
```

### PUT `/users/password`
**Request:**
```json
{ "currentPassword": "old", "newPassword": "new123" }
```

### DELETE `/users/profile`
Delete account and all associated workouts.

### GET `/users/weekly-schedule`
**Response:**
```json
{
  "weeklySchedule": {
    "Monday": [
      { "id": "exercise_id", "name": "Bench Press", "imageUrl": "url", "sets": 4, "reps": "8", "pr": { "weight": 100, "reps": 8 } }
    ],
    "Tuesday": [...],
    ...
  }
}
```

### PUT `/users/weekly-schedule`
**Request:**
```json
{
  "weeklySchedule": {
    "Monday": [{ "id": "ex_id", "name": "Bench Press", "imageUrl": "url", "sets": 4, "reps": "8" }],
    "Tuesday": [],
    ...
  }
}
```
Validates day names (Monday-Sunday) and array structure.

### GET `/users/weight-log`
**Response:**
```json
{ "weightLog": [{ "date": "2026-03-01T00:00:00Z", "weight": 75 }] }
```

### POST `/users/weight-log`
**Request:**
```json
{ "weight": 74.5, "date": "2026-03-15" }
```
`date` is optional (defaults to now).

### GET `/users/workout-log`
**Response:**
```json
{
  "workoutLog": [{ "date": "2026-03-15T10:00:00Z", "exerciseId": "ex_id", "completed": true }],
  "currentStreak": 5
}
```

### POST `/users/workout-log`
Toggle exercise completion for today. Updates or creates entry. Recalculates streak.

**Request:**
```json
{ "exerciseId": "ex_id", "completed": true }
```

---

## Workouts (`/api/workouts`) — All routes require auth

### GET `/workouts`
List all workouts for current user, sorted by `createdAt` descending.

### GET `/workouts/:id`
Get a specific workout by MongoDB ObjectId.

### POST `/workouts`
**Request:**
```json
{
  "name": "Push Day",
  "type": "strength",
  "exercises": [
    {
      "exerciseId": "ex_id",
      "exerciseName": "Bench Press",
      "sets": [
        { "setNumber": 1, "reps": 8, "weight": 80, "duration": null }
      ]
    }
  ]
}
```
`type` must be one of: `strength`, `cardio`, `flexibility`, `hiit`, `other`.

### PUT `/workouts/:id`
Same shape as POST. Partial updates supported.

### DELETE `/workouts/:id`

### PATCH `/workouts/:id/complete`
Mark entire workout as completed (sets `completedAt`).

### PATCH `/workouts/:workoutId/exercises/:exerciseIndex/sets/:setIndex/complete`
Mark a specific set as completed. Auto-marks exercise as completed when all sets are done.

---

## Exercises (`/api/exercises`) — No auth required

### GET `/exercises`
Returns all exercises from the database.

**Response:**
```json
{
  "exercises": [
    {
      "id": "bench_press",
      "name": "Bench Press",
      "category": "upper body",
      "muscleGroup": "chest",
      "equipment": "barbell",
      "difficulty": "intermediate",
      "description": "...",
      "howTo": { "steps": ["..."], "tips": ["..."] },
      "imageUrl": "url",
      "videoUrl": "url",
      "demoUrl": "url",
      "explainUrl": "url"
    }
  ]
}
```

### GET `/exercises/category/:category`
Filter by category. Case-insensitive match.

### GET `/exercises/muscle/:muscleGroup`
Filter by muscle group. Case-insensitive partial match.

### GET `/exercises/equipment/:equipment`
Filter by equipment type. Case-insensitive partial match.

### GET `/exercises/:id`
Get single exercise by its string `id` field (not MongoDB `_id`).

### POST/PUT/DELETE — Disabled (returns 403)
Exercises are managed via seed scripts and wger sync, not through the API.

---

## Equipment (`/api/equipment`) — No auth required

### GET `/equipment`
Fetches from wger API (24h cached). Supports `?search=` query param.

### GET `/equipment/categories`
Returns hardcoded list: `['Cardio', 'Strength', 'Core', 'Free Weights', 'Functional']`

### GET `/equipment/:id`
Get single equipment by wger ID.

---

## Health Check

### GET `/api/health`
**Response:**
```json
{ "message": "Workout Tracker API is running", "timestamp": "2026-03-15T10:00:00Z" }
```
