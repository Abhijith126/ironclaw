const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/workout-tracker';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  category: { type: String, required: true, enum: ['upper body', 'lower body', 'core', 'cardio', 'full body', 'flexibility'] },
  muscleGroup: { type: String, required: true, enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardiovascular', 'full body'] },
  equipment: { type: String, required: true, enum: ['barbell', 'dumbbells', 'cable', 'machine', 'bodyweight', 'kettlebell', 'none', 'other'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  description: { type: String },
  imageUrl: { type: String },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

const exercises = [
  // Chest
  { name: 'Chest Press Machine', category: 'upper body', muscleGroup: 'chest', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Incline Bench Press', category: 'upper body', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Pec Deck', category: 'upper body', muscleGroup: 'chest', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Bench Press', category: 'upper body', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Push-up', category: 'upper body', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Dumbbell Bench Press', category: 'upper body', muscleGroup: 'chest', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Chest Fly', category: 'upper body', muscleGroup: 'chest', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Cable Crossover', category: 'upper body', muscleGroup: 'chest', equipment: 'cable', difficulty: 'beginner' },
  
  // Back
  { name: 'Lat Pulldown', category: 'upper body', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Seated Cable Row', category: 'upper body', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Pull-up', category: 'upper body', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
  { name: 'T-Bar Row', category: 'upper body', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Face Pull', category: 'upper body', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Barbell Row', category: 'upper body', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Deadlift', category: 'upper body', muscleGroup: 'back', equipment: 'barbell', difficulty: 'advanced' },
  { name: 'Dumbbell Row', category: 'upper body', muscleGroup: 'back', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Chin-up', category: 'upper body', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
  
  // Shoulders
  { name: 'Shoulder Press Machine', category: 'upper body', muscleGroup: 'shoulders', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Lateral Raise', category: 'upper body', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Rear Delt Fly', category: 'upper body', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Dumbbell Shoulder Press', category: 'upper body', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Overhead Press', category: 'upper body', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Arnold Press', category: 'upper body', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'intermediate' },
  { name: 'Front Raise', category: 'upper body', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Upright Row', category: 'upper body', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Shrug', category: 'upper body', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner' },
  
  // Arms
  { name: 'Tricep Pushdown', category: 'upper body', muscleGroup: 'arms', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Cable Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Hammer Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Overhead Tricep Extension', category: 'upper body', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Bicep Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Tricep Dip', category: 'upper body', muscleGroup: 'arms', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Preacher Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Skull Crusher', category: 'upper body', muscleGroup: 'arms', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Tricep Kickback', category: 'upper body', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Incline Dumbbell Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Concentration Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'EZ Bar Curl', category: 'upper body', muscleGroup: 'arms', equipment: 'barbell', difficulty: 'beginner' },
  { name: 'EZ Bar Skull Crusher', category: 'upper body', muscleGroup: 'arms', equipment: 'barbell', difficulty: 'intermediate' },
  
  // Legs
  { name: 'Squat', category: 'lower body', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Leg Press', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Leg Curl', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Leg Extension', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Hip Thrust', category: 'lower body', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Calf Raise', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Romanian Deadlift', category: 'lower body', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Abductor Machine', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Front Squat', category: 'lower body', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate' },
  { name: 'Hack Squat', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'intermediate' },
  { name: 'Lunge', category: 'lower body', muscleGroup: 'legs', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Bulgarian Split Squat', category: 'lower body', muscleGroup: 'legs', equipment: 'dumbbells', difficulty: 'intermediate' },
  { name: 'Goblet Squat', category: 'lower body', muscleGroup: 'legs', equipment: 'dumbbells', difficulty: 'beginner' },
  { name: 'Seated Calf Raise', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Standing Calf Raise', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Adductor Machine', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner' },
  { name: 'Glute Ham Raise', category: 'lower body', muscleGroup: 'legs', equipment: 'machine', difficulty: 'intermediate' },
  
  // Core
  { name: 'Plank', category: 'core', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Cable Crunch', category: 'core', muscleGroup: 'core', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Russian Twist', category: 'core', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Leg Raise', category: 'core', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'intermediate' },
  { name: 'Crunch', category: 'core', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Cable Woodchop', category: 'core', muscleGroup: 'core', equipment: 'cable', difficulty: 'beginner' },
  { name: 'Ab Wheel Rollout', category: 'core', muscleGroup: 'core', equipment: 'other', difficulty: 'advanced' },
  { name: 'Hanging Leg Raise', category: 'core', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'advanced' },
  { name: 'Dead Bug', category: 'core', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner' },
  { name: 'Ab Crunch Machine', category: 'core', muscleGroup: 'core', equipment: 'machine', difficulty: 'beginner' },
  { name: "Captain's Chair Leg Raise", category: 'core', muscleGroup: 'core', equipment: 'machine', difficulty: 'intermediate' },
  
  // Cardio
  { name: 'Running', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  { name: 'Cycling', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  { name: 'Rowing', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  { name: 'Elliptical', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  { name: 'Stair Climber', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  { name: 'Jump Rope', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  { name: 'Burpee', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'bodyweight', difficulty: 'advanced' },
  { name: 'Mountain Climber', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'bodyweight', difficulty: 'intermediate' },
  { name: 'Treadmill', category: 'cardio', muscleGroup: 'cardiovascular', equipment: 'none', difficulty: 'beginner' },
  
  // Full Body
  { name: 'Burpees', category: 'full body', muscleGroup: 'full body', equipment: 'bodyweight', difficulty: 'advanced' },
  { name: 'Kettlebell Swings', category: 'full body', muscleGroup: 'full body', equipment: 'kettlebell', difficulty: 'intermediate' },
  
  // Flexibility
  { name: 'Forward Fold', category: 'flexibility', muscleGroup: 'full body', equipment: 'none', difficulty: 'beginner' },
  { name: 'Cat-Cow Stretch', category: 'flexibility', muscleGroup: 'core', equipment: 'none', difficulty: 'beginner' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
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
