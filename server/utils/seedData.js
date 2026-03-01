const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');

const exercises = [
  // Upper Body
  {
    name: 'Push-ups',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    imageUrl: 'https://example.com/pushups.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  {
    name: 'Pull-ups',
    category: 'upper body',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'A compound exercise that primarily targets the latissimus dorsi and other back muscles.',
    imageUrl: 'https://example.com/pullups.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5s'
  },
  {
    name: 'Bench Press',
    category: 'upper body',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    description: 'A compound exercise that targets the chest, shoulders, and triceps using a barbell.',
    imageUrl: 'https://example.com/benchpress.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg'
  },
  {
    name: 'Dumbbell Shoulder Press',
    category: 'upper body',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the deltoid muscles of the shoulders.',
    imageUrl: 'https://example.com/shoulderpress.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR--bMc'
  },
  {
    name: 'Bicep Curls',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the biceps brachii muscles.',
    imageUrl: 'https://example.com/bicepcurls.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo'
  },
  {
    name: 'Tricep Dips',
    category: 'upper body',
    muscleGroup: 'arms',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the triceps muscles using parallel bars or a bench.',
    imageUrl: 'https://example.com/tricepdips.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=0326dy_-CzM'
  },

  // Lower Body
  {
    name: 'Squats',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
    imageUrl: 'https://example.com/squats.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U'
  },
  {
    name: 'Lunges',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes unilaterally.',
    imageUrl: 'https://example.com/lunges.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U'
  },
  {
    name: 'Deadlifts',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'advanced',
    description: 'A compound exercise that targets the hamstrings, glutes, and lower back.',
    imageUrl: 'https://example.com/deadlifts.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q'
  },
  {
    name: 'Leg Press',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes using a leg press machine.',
    imageUrl: 'https://example.com/legpress.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2UpsGdJrL4E'
  },
  {
    name: 'Calf Raises',
    category: 'lower body',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the calf muscles.',
    imageUrl: 'https://example.com/calfraises.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc'
  },

  // Core
  {
    name: 'Plank',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isometric exercise that targets the core muscles, including the abdominals and lower back.',
    imageUrl: 'https://example.com/plank.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
  },
  {
    name: 'Russian Twists',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    description: 'An isolation exercise that targets the obliques and other core muscles.',
    imageUrl: 'https://example.com/russiantwists.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI'
  },
  {
    name: 'Leg Raises',
    category: 'core',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    description: 'An isolation exercise that targets the lower abdominal muscles.',
    imageUrl: 'https://example.com/legraises.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=JyI0Ui3om24'
  },

  // Cardio
  {
    name: 'Running',
    category: 'cardio',
    muscleGroup: 'cardiovascular',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A cardiovascular exercise that improves heart health and burns calories.',
    imageUrl: 'https://example.com/running.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=OQ5jsbhAv_M'
  },
  {
    name: 'Cycling',
    category: 'cardio',
    muscleGroup: 'cardiovascular',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A cardiovascular exercise that improves heart health and works the lower body muscles.',
    imageUrl: 'https://example.com/cycling.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=OQ5jsbhAv_M'
  },
  {
    name: 'Jumping Jacks',
    category: 'cardio',
    muscleGroup: 'cardiovascular',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A full-body cardiovascular exercise that increases heart rate and burns calories.',
    imageUrl: 'https://example.com/jumpingjacks.jpg',
    videoUrl: 'https://youtube.com/watch?v=OQ5jsbhAv_M'
  },

  // Full Body
  {
    name: 'Burpees',
    category: 'full body',
    muscleGroup: 'full body',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    description: 'A full-body exercise that combines a squat, push-up, and jump to improve strength and cardiovascular fitness.',
    imageUrl: 'https://example.com/burpees.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=auBLPXO8Fww'
  },
  {
    name: 'Kettlebell Swings',
    category: 'full body',
    muscleGroup: 'full body',
    equipment: 'kettlebell',
    difficulty: 'intermediate',
    description: 'A full-body exercise that targets the posterior chain and improves cardiovascular fitness.',
    imageUrl: 'https://example.com/kettlebellswings.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=YSxHifyI6s8'
  },

  // Flexibility
  {
    name: 'Forward Fold',
    category: 'flexibility',
    muscleGroup: 'full body',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A flexibility exercise that stretches the hamstrings, lower back, and calves.',
    imageUrl: 'https://example.com/forwardfold.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=OQ5jsbhAv_M'
  },
  {
    name: 'Cat-Cow Stretch',
    category: 'flexibility',
    muscleGroup: 'core',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'A flexibility exercise that improves spinal mobility and stretches the back muscles.',
    imageUrl: 'https://example.com/catcow.jpg',
    videoUrl: 'https://youtube.com/watch?v=OQ5jsbhAv_M'
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