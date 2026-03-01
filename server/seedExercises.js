const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  category: { type: String, required: true, enum: ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'cardio'] },
  equipment: { type: String, required: true, enum: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'cardio', 'other'] },
  imageUrl: { type: String },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

const exercises = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', category: 'chest', equipment: 'barbell' },
  { id: 'incline-bench-press', name: 'Incline Bench Press', category: 'chest', equipment: 'barbell' },
  { id: 'db-bench-press', name: 'Dumbbell Bench Press', category: 'chest', equipment: 'dumbbell' },
  { id: 'db-incline-press', name: 'Dumbbell Incline Press', category: 'chest', equipment: 'dumbbell' },
  { id: 'chest-fly', name: 'Chest Fly', category: 'chest', equipment: 'dumbbell' },
  { id: 'pec-deck', name: 'Pec Deck', category: 'chest', equipment: 'machine' },
  { id: 'cable-crossover', name: 'Cable Crossover', category: 'chest', equipment: 'cable' },
  { id: 'push-up', name: 'Push-up', category: 'chest', equipment: 'bodyweight' },
  { id: 'dip-chest', name: 'Chest Dip', category: 'chest', equipment: 'bodyweight' },
  { id: 'chest-press-machine', name: 'Chest Press Machine', category: 'chest', equipment: 'machine' },
  
  // Back
  { id: 'deadlift', name: 'Deadlift', category: 'back', equipment: 'barbell' },
  { id: 'barbell-row', name: 'Barbell Row', category: 'back', equipment: 'barbell' },
  { id: 'pull-up', name: 'Pull-up', category: 'back', equipment: 'bodyweight' },
  { id: 'chin-up', name: 'Chin-up', category: 'back', equipment: 'bodyweight' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'back', equipment: 'cable' },
  { id: 'seated-row', name: 'Seated Cable Row', category: 'back', equipment: 'cable' },
  { id: 'db-row', name: 'Dumbbell Row', category: 'back', equipment: 'dumbbell' },
  { id: 't-bar-row', name: 'T-Bar Row', category: 'back', equipment: 'barbell' },
  { id: 'face-pull', name: 'Face Pull', category: 'back', equipment: 'cable' },
  { id: 'back-extension', name: 'Back Extension', category: 'back', equipment: 'machine' },
  { id: 'cable-lat-pulldown', name: 'Cable Lat Pulldown', category: 'back', equipment: 'cable' },
  
  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', category: 'shoulders', equipment: 'barbell' },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: 'dumbbell' },
  { id: 'arnold-press', name: 'Arnold Press', category: 'shoulders', equipment: 'dumbbell' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'shoulders', equipment: 'dumbbell' },
  { id: 'front-raise', name: 'Front Raise', category: 'shoulders', equipment: 'dumbbell' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', category: 'shoulders', equipment: 'dumbbell' },
  { id: 'upright-row', name: 'Upright Row', category: 'shoulders', equipment: 'barbell' },
  { id: 'shrug', name: 'Shrug', category: 'shoulders', equipment: 'dumbbell' },
  { id: 'shoulder-press-machine', name: 'Shoulder Press Machine', category: 'shoulders', equipment: 'machine' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'shoulders', equipment: 'cable' },
  
  // Legs
  { id: 'squat', name: 'Squat', category: 'legs', equipment: 'barbell' },
  { id: 'front-squat', name: 'Front Squat', category: 'legs', equipment: 'barbell' },
  { id: 'leg-press', name: 'Leg Press', category: 'legs', equipment: 'machine' },
  { id: 'hack-squat', name: 'Hack Squat', category: 'legs', equipment: 'machine' },
  { id: 'lunge', name: 'Lunge', category: 'legs', equipment: 'dumbbell' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'legs', equipment: 'dumbbell' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'legs', equipment: 'machine' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'legs', equipment: 'machine' },
  { id: 'rdl', name: 'Romanian Deadlift', category: 'legs', equipment: 'barbell' },
  { id: 'hip-thrust', name: 'Hip Thrust', category: 'legs', equipment: 'barbell' },
  { id: 'calf-raise', name: 'Calf Raise', category: 'legs', equipment: 'machine' },
  { id: 'goblet-squat', name: 'Goblet Squat', category: 'legs', equipment: 'dumbbell' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'legs', equipment: 'machine' },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', category: 'legs', equipment: 'machine' },
  { id: 'adductor-machine', name: 'Adductor Machine', category: 'legs', equipment: 'machine' },
  { id: 'abductor-machine', name: 'Abductor Machine', category: 'legs', equipment: 'machine' },
  { id: 'glute-ham-raise', name: 'Glute Ham Raise', category: 'legs', equipment: 'machine' },
  
  // Arms
  { id: 'curl', name: 'Bicep Curl', category: 'arms', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'arms', equipment: 'dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', category: 'arms', equipment: 'barbell' },
  { id: 'cable-curl', name: 'Cable Curl', category: 'arms', equipment: 'cable' },
  { id: 'incline-curl', name: 'Incline Dumbbell Curl', category: 'arms', equipment: 'dumbbell' },
  { id: 'concentration-curl', name: 'Concentration Curl', category: 'arms', equipment: 'dumbbell' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'arms', equipment: 'cable' },
  { id: 'skull-crusher', name: 'Skull Crusher', category: 'arms', equipment: 'barbell' },
  { id: 'tricep-dip', name: 'Tricep Dip', category: 'arms', equipment: 'bodyweight' },
  { id: 'overhead-extension', name: 'Overhead Tricep Extension', category: 'arms', equipment: 'dumbbell' },
  { id: 'tricep-kickback', name: 'Tricep Kickback', category: 'arms', equipment: 'dumbbell' },
  { id: 'tricep-machine', name: 'Tricep Machine', category: 'arms', equipment: 'machine' },
  { id: 'ez-bar-curl', name: 'EZ Bar Curl', category: 'arms', equipment: 'barbell' },
  { id: 'ez-bar-skull-crusher', name: 'EZ Bar Skull Crusher', category: 'arms', equipment: 'barbell' },
  
  // Core
  { id: 'plank', name: 'Plank', category: 'core', equipment: 'bodyweight' },
  { id: 'crunch', name: 'Crunch', category: 'core', equipment: 'bodyweight' },
  { id: 'leg-raise', name: 'Leg Raise', category: 'core', equipment: 'bodyweight' },
  { id: 'russian-twist', name: 'Russian Twist', category: 'core', equipment: 'bodyweight' },
  { id: 'cable-woodchop', name: 'Cable Woodchop', category: 'core', equipment: 'cable' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'core', equipment: 'other' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'core', equipment: 'bodyweight' },
  { id: 'dead-bug', name: 'Dead Bug', category: 'core', equipment: 'bodyweight' },
  { id: 'ab-crunch-machine', name: 'Ab Crunch Machine', category: 'core', equipment: 'machine' },
  { id: 'cable-crunch', name: 'Cable Crunch', category: 'core', equipment: 'cable' },
  { id: 'captain-chair-leg-raise', name: "Captain's Chair Leg Raise", category: 'core', equipment: 'machine' },
  
  // Cardio
  { id: 'treadmill', name: 'Treadmill', category: 'cardio', equipment: 'cardio' },
  { id: 'running', name: 'Running', category: 'cardio', equipment: 'cardio' },
  { id: 'cycling', name: 'Cycling', category: 'cardio', equipment: 'cardio' },
  { id: 'rowing', name: 'Rowing', category: 'cardio', equipment: 'cardio' },
  { id: 'elliptical', name: 'Elliptical', category: 'cardio', equipment: 'cardio' },
  { id: 'stair-climber', name: 'Stair Climber', category: 'cardio', equipment: 'cardio' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'cardio', equipment: 'cardio' },
  { id: 'burpee', name: 'Burpee', category: 'cardio', equipment: 'bodyweight' },
  { id: 'mountain-climber', name: 'Mountain Climber', category: 'cardio', equipment: 'bodyweight' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');
    
    await Exercise.insertMany(exercises);
    console.log(`Seeded ${exercises.length} exercises`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
