const mongoose = require('mongoose');
const exercises = require('./exerciseData');
const Exercise = require('../models/Exercise');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker';

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
