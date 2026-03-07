const mongoose = require('mongoose');
const equipmentList = require('./equipmentData');
const Equipment = require('../models/Equipment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Equipment.deleteMany({});
    console.log('Cleared existing equipment');

    await Equipment.insertMany(equipmentList);
    console.log(`Seeded ${equipmentList.length} equipment items`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
