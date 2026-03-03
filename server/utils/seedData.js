const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');

const exercises = [
  // Chest
  {
    name: 'Chest Press Machine',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the chest muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Incline Bench Press',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A barbell exercise that targets the upper chest.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Pec Deck',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the chest muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Bench Press',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A compound exercise that targets the chest, shoulders, and triceps using a barbell.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Push-ups',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    imageUrl: '',
    videoUrl: ''
  },

  // Back
  {
    name: 'Lat Pulldown',
    category: 'upper body',
    muscleGroup: 'back',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the latissimus dorsi muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Seated Cable Row',
    category: 'upper body',
    muscleGroup: 'back',
    equipment: 'cable',
    difficulty: 'beginner',
    description: 'A cable exercise that targets the middle back muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Pull-ups',
    category: 'upper body',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'A compound exercise that primarily targets the latissimus dorsi and other back muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'T-Bar Row',
    category: 'upper body',
    muscleGroup: 'back',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A barbell exercise that targets the back muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Face Pull',
    category: 'upper body',
    muscleGroup: 'back',
    equipment: 'cable',
    difficulty: 'beginner',
    description: 'A cable exercise that targets the rear deltoids and upper back.',
    imageUrl: '',
    videoUrl: ''
  },

  // Shoulders
  {
    name: 'Shoulder Press Machine',
    category: 'upper body',
    muscleGroup: 'shoulders',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the shoulder muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Lateral Raise',
    category: 'upper body',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the lateral deltoid muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Rear Delt Fly',
    category: 'upper body',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the rear deltoid muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Dumbbell Shoulder Press',
    category: 'upper body',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the deltoid muscles of the shoulders.',
    imageUrl: '',
    videoUrl: ''
  },

  // Arms
  {
    name: 'Tricep Pushdown',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'cable',
    difficulty: 'beginner',
    description: 'A cable exercise that targets the triceps muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Cable Curl',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'cable',
    difficulty: 'beginner',
    description: 'A cable exercise that targets the biceps muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Hammer Curl',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'A dumbbell exercise that targets the biceps and forearms.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Overhead Tricep Extension',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'A dumbbell exercise that targets the triceps muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Bicep Curls',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the biceps brachii muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Tricep Dips',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the triceps muscles using parallel bars or a bench.',
    imageUrl: '',
    videoUrl: ''
  },

  // Legs
  {
    name: 'Squat',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Leg Press',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes using a leg press machine.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Leg Curl',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the hamstring muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Leg Extension',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the quadriceps muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Hip Thrust',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A barbell exercise that targets the glute muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Calf Raise',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the calf muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Romanian Deadlift',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A barbell exercise that targets the hamstrings and glutes.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Abductor Machine',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A machine exercise that targets the outer thigh muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Lunges',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes unilaterally.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Deadlifts',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'advanced',
    description: 'A compound exercise that targets the hamstrings, glutes, and lower back.',
    imageUrl: '',
    videoUrl: ''
  },

  // Core
  {
    name: 'Plank',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isometric exercise that targets the core muscles, including the abdominals and lower back.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Cable Crunch',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'cable',
    difficulty: 'beginner',
    description: 'A cable exercise that targets the abdominal muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Russian Twists',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the obliques and other core muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Leg Raises',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'An isolation exercise that targets the lower abdominal muscles.',
    imageUrl: '',
    videoUrl: ''
  },

  // Cardio
  {
    name: 'Running',
    category: 'cardio',
    muscleGroup: 'cardiovascular',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A cardiovascular exercise that improves heart health and burns calories.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Cycling',
    category: 'cardio',
    muscleGroup: 'cardiovascular',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A cardiovascular exercise that improves heart health and works the lower body muscles.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Jumping Jacks',
    category: 'cardio',
    muscleGroup: 'cardiovascular',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A full-body cardiovascular exercise that increases heart rate and burns calories.',
    imageUrl: '',
    videoUrl: ''
  },

  // Full Body
  {
    name: 'Burpees',
    category: 'full body',
    muscleGroup: 'full body',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    description: 'A full-body exercise that combines a squat, push-up, and jump to improve strength and cardiovascular fitness.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Kettlebell Swings',
    category: 'full body',
    muscleGroup: 'full body',
    equipment: 'kettlebell',
    difficulty: 'intermediate',
    description: 'A full-body exercise that targets the posterior chain and improves cardiovascular fitness.',
    imageUrl: '',
    videoUrl: ''
  },

  // Flexibility
  {
    name: 'Forward Fold',
    category: 'flexibility',
    muscleGroup: 'full body',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A flexibility exercise that stretches the hamstrings, lower back, and calves.',
    imageUrl: '',
    videoUrl: ''
  },
  {
    name: 'Cat-Cow Stretch',
    category: 'flexibility',
    muscleGroup: 'core',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A flexibility exercise that improves spinal mobility and stretches the back muscles.',
    imageUrl: '',
    videoUrl: ''
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker');
    console.log('Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Insert new exercises
    await Exercise.insertMany(exercises);
    console.log(`Seeded ${exercises.length} exercises`);

    mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
