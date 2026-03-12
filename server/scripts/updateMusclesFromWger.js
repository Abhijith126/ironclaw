const mongoose = require('mongoose');
const wger = require('../services/wger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker';

const exerciseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  muscleGroup: { type: String },
  equipment: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  description: { type: String },
  howTo: {
    steps: [{ type: String }],
    tips: [{ type: String }],
  },
  imageUrl: { type: String },
  videoUrl: { type: String },
  muscles: [{ type: String }],
  musclesSecondary: [{ type: String }],
  equipmentList: [{ type: String }],
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);

async function updateMuscles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all local exercises
    const localExercises = await Exercise.find({});
    console.log(`Found ${localExercises.length} local exercises`);

    // Manual muscle mappings based on exercise category/equipment
    const muscleMappings = {
      'chest': {
        'upper body': ['Chest', 'Anterior Deltoid', 'Triceps'],
        'chest': ['Pectoralis Major', 'Anterior Deltoid', 'Triceps']
      },
      'back': {
        'upper body': ['Latissimus Dorsi', 'Rhomboids', 'Biceps'],
        'back': ['Latissimus Dorsi', 'Trapezius', 'Rhomboids']
      },
      'shoulders': {
        'upper body': ['Deltoids', 'Trapezius'],
        'shoulders': ['Deltoids', 'Trapezius']
      },
      'arms': {
        'upper body': ['Biceps', 'Triceps', 'Forearms'],
        'arms': ['Biceps', 'Triceps']
      },
      'legs': {
        'lower body': ['Quadriceps', 'Hamstrings', 'Glutes'],
        'legs': ['Quadriceps', 'Hamstrings', 'Glutes']
      },
      'abs': {
        'core': ['Rectus Abdominis', 'Obliques'],
        'abs': ['Rectus Abdominis', 'Obliques', 'Transverse Abdominis']
      },
      'calves': {
        'lower body': ['Gastrocnemius', 'Soleus'],
        'calves': ['Gastrocnemius', 'Soleus']
      },
      'cardio': {
        'cardio': ['Heart', 'Quadriceps', 'Calves'],
        'cardiovascular': ['Heart', 'Full Body']
      }
    };

    let updated = 0;

    for (const localEx of localExercises) {
      const category = (localEx.category || '').toLowerCase();
      const muscleGroup = (localEx.muscleGroup || '').toLowerCase();
      const equipment = (localEx.equipment || '').toLowerCase();
      
      // Determine primary and secondary muscles based on exercise type
      let muscles = [];
      let musclesSecondary = [];
      
      if (category === 'upper body' || muscleGroup === 'chest' || localEx.name.toLowerCase().includes('chest') || localEx.name.toLowerCase().includes('bench') || localEx.name.toLowerCase().includes('fly') || localEx.name.toLowerCase().includes('press')) {
        if (localEx.name.toLowerCase().includes('chest') || localEx.name.toLowerCase().includes('fly') || localEx.name.toLowerCase().includes('pec')) {
          muscles = ['Chest'];
          musclesSecondary = ['Anterior Deltoid', 'Triceps'];
        } else if (localEx.name.toLowerCase().includes('row') || localEx.name.toLowerCase().includes('pull') || localEx.name.toLowerCase().includes('lat') || localEx.name.toLowerCase().includes('back') || localEx.name.toLowerCase().includes('deadlift')) {
          muscles = ['Latissimus Dorsi', 'Trapezius'];
          musclesSecondary = ['Rhomboids', 'Biceps'];
        } else if (localEx.name.toLowerCase().includes('shoulder') || localEx.name.toLowerCase().includes('deltoid') || localEx.name.toLowerCase().includes('press') || localEx.name.toLowerCase().includes('raise') || localEx.name.toLowerCase().includes('arnold')) {
          muscles = ['Deltoids'];
          musclesSecondary = ['Trapezius', 'Triceps'];
        } else if (localEx.name.toLowerCase().includes('curl') || localEx.name.toLowerCase().includes('bicep') || localEx.name.toLowerCase().includes('hammer')) {
          muscles = ['Biceps'];
          musclesSecondary = ['Forearms'];
        } else if (localEx.name.toLowerCase().includes('tricep') || localEx.name.toLowerCase().includes('pushdown') || localEx.name.toLowerCase().includes('dip') || localEx.name.toLowerCase().includes('extension')) {
          muscles = ['Triceps'];
          musclesSecondary = ['Anterior Deltoid'];
        } else if (localEx.name.toLowerCase().includes('shrug')) {
          muscles = ['Trapezius'];
          musclesSecondary = ['Deltoids'];
        } else {
          muscles = ['Chest', 'Back', 'Shoulders'];
        }
      } else if (category === 'lower body' || muscleGroup === 'legs' || localEx.name.toLowerCase().includes('squat') || localEx.name.toLowerCase().includes('leg') || localEx.name.toLowerCase().includes('lunge') || localEx.name.toLowerCase().includes('hip') || localEx.name.toLowerCase().includes('thrust') || localEx.name.toLowerCase().includes('calf') || localEx.name.toLowerCase().includes('rdl')) {
        if (localEx.name.toLowerCase().includes('squat') || localEx.name.toLowerCase().includes('leg press') || localEx.name.toLowerCase().includes('extension') || localEx.name.toLowerCase().includes('lunge') || localEx.name.toLowerCase().includes('hack')) {
          muscles = ['Quadriceps', 'Glutes'];
          musclesSecondary = ['Hamstrings'];
        } else if (localEx.name.toLowerCase().includes('deadlift') || localEx.name.toLowerCase().includes('rdl') || localEx.name.toLowerCase().includes('curl') || localEx.name.toLowerCase().includes('hamstring') || localEx.name.toLowerCase().includes('good morning')) {
          muscles = ['Hamstrings', 'Glutes'];
          musclesSecondary = ['Lower Back'];
        } else if (localEx.name.toLowerCase().includes('calf') || localEx.name.toLowerCase().includes('raise')) {
          muscles = ['Gastrocnemius', 'Soleus'];
          musclesSecondary = [];
        } else if (localEx.name.toLowerCase().includes('hip') || localEx.name.toLowerCase().includes('thrust') || localEx.name.toLowerCase().includes('glute')) {
          muscles = ['Glutes'];
          musclesSecondary = ['Hamstrings', 'Quadriceps'];
        } else if (localEx.name.toLowerCase().includes('adduction') || localEx.name.toLowerCase().includes('abduction')) {
          muscles = ['Hip Adductors', 'Hip Abductors'];
          musclesSecondary = ['Glutes'];
        } else {
          muscles = ['Quadriceps', 'Hamstrings', 'Glutes'];
        }
      } else if (category === 'core' || muscleGroup === 'abs' || localEx.name.toLowerCase().includes('crunch') || localEx.name.toLowerCase().includes('sit') || localEx.name.toLowerCase().includes('plank') || localEx.name.toLowerCase().includes('ab') || localEx.name.toLowerCase().includes('leg raise') || localEx.name.toLowerCase().includes('russian') || localEx.name.toLowerCase().includes('cable rotation')) {
        muscles = ['Rectus Abdominis', 'Obliques'];
        musclesSecondary = ['Transverse Abdominis'];
      } else if (category === 'cardio' || localEx.name.toLowerCase().includes('run') || localEx.name.toLowerCase().includes('bike') || localEx.name.toLowerCase().includes('elliptical') || localEx.name.toLowerCase().includes('row') || localEx.name.toLowerCase().includes('jump')) {
        muscles = ['Heart', 'Quadriceps'];
        musclesSecondary = ['Calves', 'Glutes'];
      } else {
        muscles = [muscleGroup || category];
      }

      await Exercise.updateOne(
        { _id: localEx._id },
        { $set: { muscles, musclesSecondary } }
      );
      updated++;
    }

    console.log(`Updated ${updated} exercises with muscles`);
    
    // Show sample
    const sample = await Exercise.findOne({ name: 'Bench Press' });
    console.log('Sample (Bench Press):', sample.muscles, sample.musclesSecondary);
    
    process.exit(0);
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
}

updateMuscles();
