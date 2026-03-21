# Data Models

## MongoDB Schemas (server/models/)

### User (`server/models/User.js`)

The User document is the central data store. Weekly schedules, weight logs, and workout logs are all embedded.

```javascript
{
  email:            String,     // required, unique, lowercase, trimmed, validated
  password:         String,     // required, min 6 chars, auto-hashed via bcrypt (salt rounds: 12)
  name:             String,     // required, trimmed
  age:              Number,     // min: 13, max: 120
  height:           Number,     // min: 50, max: 300 (cm)
  weight:           Number,     // min: 20, max: 500 (kg)
  weightUnit:       String,     // enum: ['kg', 'lbs'], default: 'kg'
  profilePicture:   String,     // default: null
  role:             String,     // enum: ['user', 'admin'], default: 'user'
  googleId:         String,     // unique, sparse index (for OAuth users)
  createdAt:        Date,       // default: Date.now
  lastLogin:        Date,       // default: Date.now, updated on each login

  // Embedded: Map<DayOfWeek, Exercise[]>
  weeklySchedule:   Map of [{
    id:       String,
    name:     String,
    imageUrl: String,
    sets:     Number,
    reps:     String,
    pr:       { weight: Number, reps: Number }
  }],

  // Embedded: Weight history
  weightLog: [{
    date:   Date,     // required
    weight: Number    // required
  }],

  // Embedded: Daily exercise completions
  workoutLog: [{
    date:       Date,     // required
    exerciseId: String,   // required
    completed:  Boolean   // default: true
  }],

  currentStreak: Number   // default: 0, recalculated on each workout log POST
}
```

**Pre-save hook:** Hashes password with bcrypt if modified.
**Instance method:** `comparePassword(candidate)` — compares with bcrypt, auto-migrates plaintext passwords to hashed.

### Exercise (`server/models/Exercise.js`)

Read-only catalog of exercises, seeded from `exerciseData.js`.

```javascript
{
  id:           String,   // required, unique, indexed (e.g. "bench_press")
  name:         String,   // required, unique, trimmed (e.g. "Bench Press")
  category:     String,   // required, enum: ['upper body', 'lower body', 'core', 'cardio', 'full body', 'flexibility']
  muscleGroup:  String,   // required, enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardiovascular', 'full body']
  equipment:    String,   // required, enum: ['barbell', 'dumbbells', 'cable', 'machine', 'bodyweight', 'kettlebell', 'none', 'other']
  difficulty:   String,   // enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner'
  description:  String,   // max 500 chars
  howTo: {
    steps:      [String],
    tips:       [String]
  },
  imageUrl:     String,
  videoUrl:     String,
  demoUrl:      String,
  explainUrl:   String,
  createdAt:    Date,
  updatedAt:    Date      // auto-updated via pre-save hook
}
```

### Workout (`server/models/Workout.js`)

Named workout sessions with exercises and individual set tracking.

```javascript
{
  userId:       ObjectId,   // ref: 'User', required
  name:         String,     // required, trimmed
  type:         String,     // required, enum: ['strength', 'cardio', 'flexibility', 'hiit', 'other']
  exercises: [{
    exerciseId:   String,   // required
    exerciseName: String,   // required
    sets: [{
      setNumber:  Number,   // required
      reps:       Number,   // min: 1, max: 100
      weight:     Number,   // min: 0
      duration:   Number,   // min: 0 (seconds)
      completed:  Boolean   // default: false
    }],
    completed:    Boolean   // default: false (auto-set when all sets completed)
  }],
  completed:    Boolean,    // default: false
  completedAt:  Date,       // default: null
  createdAt:    Date,
  updatedAt:    Date        // auto-updated via pre-save hook
}
```

### Equipment (`server/models/Equipment.js`)

Gym equipment catalog, seeded from `equipmentData.js`.

```javascript
{
  machineName:      String,   // required, unique
  category:         String,   // required
  zone:             String,
  resistanceType:   String,
  movementPattern:  String,
  primaryMuscles:   [String],
  secondaryMuscles: [String],
  difficultyLevel:  String,
  notes:            String,
  videoUrl:         String,
  createdAt:        Date,     // via timestamps: true
  updatedAt:        Date      // via timestamps: true
}
```

---

## Frontend TypeScript Types (`client/src/types/index.ts`)

```typescript
type WeightUnit = 'kg' | 'lbs';

interface User {
  id: string;
  name: string;
  email: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  weightUnit: WeightUnit;
  weeklySchedule?: WeeklySchedule;
}

interface Exercise {
  id: string;
  name?: string;
  imageUrl?: string;
  sets: number;
  reps: number | string;
  pr: { weight: number; reps: number } | null;
}

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

interface WorkoutLog {
  id: string;
  exerciseId: string;
  date: string;
  completed: boolean;
}

interface Equipment {
  id: string;
  machineName: string;
  category: string;
  difficultyLevel: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  videoUrl: string | null;
  notes: string | null;
  movementPattern: string | null;
}

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type WeeklySchedule = Record<DayOfWeek, Exercise[]>;

interface Alert {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  showInTab: boolean;
}
```

---

## API Service Types (`client/src/services/api.ts`)

These types are used internally by the API caching layer (not exported from `types/`):

```typescript
// From getExercises() — raw API exercise shape
interface APIExercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  imageUrl?: string;
}

// From getExerciseMap() — keyed by exercise ID
interface ExerciseMapEntry {
  name: string;
  equipment: string;
  imageUrl?: string;
}

// From getExerciseNameMap() — keyed by lowercase exercise name
interface ExerciseNameMapEntry {
  id: string;
  name: string;
  equipment: string;
}

// From transformExercisesForPicker() — grouped by category
interface CategoryEntry {
  name: string;
  exercises: { id: string; name: string; equipment: string }[];
}
```
