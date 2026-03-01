export const EXERCISE_CATEGORIES = {
  chest: {
    name: 'Chest',
    exercises: [
      { id: 'bench-press', name: 'Bench Press', equipment: 'barbell' },
      { id: 'incline-bench-press', name: 'Incline Bench Press', equipment: 'barbell' },
      { id: 'db-bench-press', name: 'Dumbbell Bench Press', equipment: 'dumbbell' },
      { id: 'db-incline-press', name: 'Dumbbell Incline Press', equipment: 'dumbbell' },
      { id: 'chest-fly', name: 'Chest Fly', equipment: 'dumbbell' },
      { id: 'pec-deck', name: 'Pec Deck', equipment: 'machine' },
      { id: 'cable-crossover', name: 'Cable Crossover', equipment: 'cable' },
      { id: 'push-up', name: 'Push-up', equipment: 'bodyweight' },
      { id: 'dip-chest', name: 'Chest Dip', equipment: 'bodyweight' },
      { id: 'chest-press-machine', name: 'Chest Press Machine', equipment: 'machine' },
    ],
  },
  back: {
    name: 'Back',
    exercises: [
      { id: 'deadlift', name: 'Deadlift', equipment: 'barbell' },
      { id: 'barbell-row', name: 'Barbell Row', equipment: 'barbell' },
      { id: 'pull-up', name: 'Pull-up', equipment: 'bodyweight' },
      { id: 'chin-up', name: 'Chin-up', equipment: 'bodyweight' },
      { id: 'lat-pulldown', name: 'Lat Pulldown', equipment: 'cable' },
      { id: 'seated-row', name: 'Seated Cable Row', equipment: 'cable' },
      { id: 'db-row', name: 'Dumbbell Row', equipment: 'dumbbell' },
      { id: 't-bar-row', name: 'T-Bar Row', equipment: 'barbell' },
      { id: 'face-pull', name: 'Face Pull', equipment: 'cable' },
      { id: 'back-extension', name: 'Back Extension', equipment: 'machine' },
      { id: 'cable-lat-pulldown', name: 'Cable Lat Pulldown', equipment: 'cable' },
    ],
  },
  shoulders: {
    name: 'Shoulders',
    exercises: [
      { id: 'overhead-press', name: 'Overhead Press', equipment: 'barbell' },
      { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', equipment: 'dumbbell' },
      { id: 'arnold-press', name: 'Arnold Press', equipment: 'dumbbell' },
      { id: 'lateral-raise', name: 'Lateral Raise', equipment: 'dumbbell' },
      { id: 'front-raise', name: 'Front Raise', equipment: 'dumbbell' },
      { id: 'rear-delt-fly', name: 'Rear Delt Fly', equipment: 'dumbbell' },
      { id: 'upright-row', name: 'Upright Row', equipment: 'barbell' },
      { id: 'shrug', name: 'Shrug', equipment: 'dumbbell' },
      { id: 'shoulder-press-machine', name: 'Shoulder Press Machine', equipment: 'machine' },
      { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', equipment: 'cable' },
    ],
  },
  legs: {
    name: 'Legs',
    exercises: [
      { id: 'squat', name: 'Squat', equipment: 'barbell' },
      { id: 'front-squat', name: 'Front Squat', equipment: 'barbell' },
      { id: 'leg-press', name: 'Leg Press', equipment: 'machine' },
      { id: 'hack-squat', name: 'Hack Squat', equipment: 'machine' },
      { id: 'lunge', name: 'Lunge', equipment: 'dumbbell' },
      { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', equipment: 'dumbbell' },
      { id: 'leg-extension', name: 'Leg Extension', equipment: 'machine' },
      { id: 'leg-curl', name: 'Leg Curl', equipment: 'machine' },
      { id: 'rdl', name: 'Romanian Deadlift', equipment: 'barbell' },
      { id: 'hip-thrust', name: 'Hip Thrust', equipment: 'barbell' },
      { id: 'calf-raise', name: 'Calf Raise', equipment: 'machine' },
      { id: 'goblet-squat', name: 'Goblet Squat', equipment: 'dumbbell' },
      { id: 'seated-calf-raise', name: 'Seated Calf Raise', equipment: 'machine' },
      { id: 'standing-calf-raise', name: 'Standing Calf Raise', equipment: 'machine' },
      { id: 'adductor-machine', name: 'Adductor Machine', equipment: 'machine' },
      { id: 'abductor-machine', name: 'Abductor Machine', equipment: 'machine' },
      { id: 'glute-ham-raise', name: 'Glute Ham Raise', equipment: 'machine' },
    ],
  },
  arms: {
    name: 'Arms',
    exercises: [
      { id: 'curl', name: 'Bicep Curl', equipment: 'dumbbell' },
      { id: 'hammer-curl', name: 'Hammer Curl', equipment: 'dumbbell' },
      { id: 'preacher-curl', name: 'Preacher Curl', equipment: 'barbell' },
      { id: 'cable-curl', name: 'Cable Curl', equipment: 'cable' },
      { id: 'incline-curl', name: 'Incline Dumbbell Curl', equipment: 'dumbbell' },
      { id: 'concentration-curl', name: 'Concentration Curl', equipment: 'dumbbell' },
      { id: 'tricep-pushdown', name: 'Tricep Pushdown', equipment: 'cable' },
      { id: 'skull-crusher', name: 'Skull Crusher', equipment: 'barbell' },
      { id: 'tricep-dip', name: 'Tricep Dip', equipment: 'bodyweight' },
      { id: 'overhead-extension', name: 'Overhead Tricep Extension', equipment: 'dumbbell' },
      { id: 'tricep-kickback', name: 'Tricep Kickback', equipment: 'dumbbell' },
      { id: 'tricep-machine', name: 'Tricep Machine', equipment: 'machine' },
      { id: 'ez-bar-curl', name: 'EZ Bar Curl', equipment: 'barbell' },
      { id: 'ez-bar-skull-crusher', name: 'EZ Bar Skull Crusher', equipment: 'barbell' },
    ],
  },
  core: {
    name: 'Core',
    exercises: [
      { id: 'plank', name: 'Plank', equipment: 'bodyweight' },
      { id: 'crunch', name: 'Crunch', equipment: 'bodyweight' },
      { id: 'leg-raise', name: 'Leg Raise', equipment: 'bodyweight' },
      { id: 'russian-twist', name: 'Russian Twist', equipment: 'bodyweight' },
      { id: 'cable-woodchop', name: 'Cable Woodchop', equipment: 'cable' },
      { id: 'ab-wheel', name: 'Ab Wheel Rollout', equipment: 'other' },
      { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', equipment: 'bodyweight' },
      { id: 'dead-bug', name: 'Dead Bug', equipment: 'bodyweight' },
      { id: 'ab-crunch-machine', name: 'Ab Crunch Machine', equipment: 'machine' },
      { id: 'cable-crunch', name: 'Cable Crunch', equipment: 'cable' },
      { id: 'captain-chair-leg-raise', name: "Captain's Chair Leg Raise", equipment: 'machine' },
    ],
  },
  cardio: {
    name: 'Cardio',
    exercises: [
      { id: 'treadmill', name: 'Treadmill', equipment: 'cardio' },
      { id: 'running', name: 'Running', equipment: 'cardio' },
      { id: 'cycling', name: 'Cycling', equipment: 'cardio' },
      { id: 'rowing', name: 'Rowing', equipment: 'cardio' },
      { id: 'elliptical', name: 'Elliptical', equipment: 'cardio' },
      { id: 'stair-climber', name: 'Stair Climber', equipment: 'cardio' },
      { id: 'jump-rope', name: 'Jump Rope', equipment: 'cardio' },
      { id: 'burpee', name: 'Burpee', equipment: 'bodyweight' },
      { id: 'mountain-climber', name: 'Mountain Climber', equipment: 'bodyweight' },
    ],
  },
};

export const EQUIPMENT_TYPES = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  cardio: 'Cardio',
  other: 'Other',
};

export function getAllExercises() {
  const exercises = [];
  Object.entries(EXERCISE_CATEGORIES).forEach(([categoryKey, category]) => {
    category.exercises.forEach((exercise) => {
      exercises.push({
        ...exercise,
        category: categoryKey,
        categoryName: category.name,
      });
    });
  });
  return exercises;
}

export function getExerciseById(id) {
  for (const category of Object.values(EXERCISE_CATEGORIES)) {
    const found = category.exercises.find((e) => e.id === id);
    if (found) return found;
  }
  return null;
}
