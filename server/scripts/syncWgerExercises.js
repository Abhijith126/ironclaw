const mongoose = require('mongoose');

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

async function sync() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use existing exerciseData with local images
    const exerciseData = require('./exerciseData');
    console.log(`Loaded ${exerciseData.length} exercises from local data`);

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');

    // Transform data to match schema
    const exercisesToInsert = exerciseData.map(ex => ({
      id: ex.id,
      name: ex.name,
      category: ex.category || 'other',
      muscleGroup: ex.muscleGroup || 'other',
      equipment: ex.equipment || 'other',
      difficulty: ex.difficulty || 'beginner',
      description: ex.description || '',
      howTo: ex.howTo || { steps: [], tips: [] },
      imageUrl: ex.imageUrl || null,
      muscles: ex.muscles || [],
      musclesSecondary: ex.musclesSecondary || [],
      equipmentList: ex.equipmentList || []
    }));

    await Exercise.insertMany(exercisesToInsert);
    console.log(`Seeded ${exercisesToInsert.length} exercises`);

    process.exit(0);
  } catch (error) {
    console.error('Sync error:', error);
    process.exit(1);
  }
}

sync();
