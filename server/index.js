const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Fallback JWT secret for local dev
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  process.env.JWT_SECRET = 'ironclaw-dev-secret-key';
}

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const exercisesRoutes = require('./routes/exercises');
const equipmentRoutes = require('./routes/equipment');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow all CORS requests
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
app.use(express.json());

// Database connection
async function connectDB() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    // Seed if database is empty (first run with volume-mounted MongoDB)
    await seedIfEmpty();
  } else {
    // Use in-memory MongoDB for local development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('In-memory MongoDB connected');
    await seedData();
  }
}

async function seedIfEmpty() {
  const Exercise = require('./models/Exercise');
  const count = await Exercise.countDocuments();
  if (count === 0) {
    console.log('Empty database detected, seeding...');
    const exercises = require('./scripts/exerciseData');
    await Exercise.insertMany(exercises);
    console.log(`Seeded ${exercises.length} exercises`);

    const equipmentModel = mongoose.model('Equipment');
    const equipmentList = require('./scripts/equipmentData');
    await equipmentModel.insertMany(equipmentList);
    console.log(`Seeded ${equipmentList.length} equipment items`);
  } else {
    console.log(`Database already has ${count} exercises, skipping seed`);
  }
}

async function seedData() {
  const Exercise = require('./models/Exercise');
  const exercises = require('./scripts/exerciseData');
  await Exercise.insertMany(exercises);
  console.log(`Seeded ${exercises.length} exercises`);

  // Seed equipment via the Equipment model defined in the equipment route
  const equipmentModel = mongoose.model('Equipment');
  const equipmentList = require('./scripts/equipmentData');
  await equipmentModel.insertMany(equipmentList);
  console.log(`Seeded ${equipmentList.length} equipment items`);

  // Seed test user with weekly schedule
  const User = require('./models/User');
  const allExercises = await Exercise.find();
  const byName = {};
  allExercises.forEach(ex => { byName[ex.name] = ex._id.toString(); });

  const weeklySchedule = new Map([
    ['Monday', [
      { id: byName['Bench Press'], sets: 4, reps: '8' },
      { id: byName['Incline Bench Press'], sets: 3, reps: '10' },
      { id: byName['Chest Fly'], sets: 3, reps: '12' },
      { id: byName['Tricep Pushdown'], sets: 3, reps: '12' },
      { id: byName['Overhead Tricep Extension'], sets: 3, reps: '10' },
    ]],
    ['Tuesday', [
      { id: byName['Deadlift'], sets: 4, reps: '5' },
      { id: byName['Barbell Row'], sets: 4, reps: '8' },
      { id: byName['Lat Pulldown'], sets: 3, reps: '10' },
      { id: byName['Face Pull'], sets: 3, reps: '15' },
      { id: byName['Bicep Curl'], sets: 3, reps: '12' },
      { id: byName['Hammer Curl'], sets: 3, reps: '10' },
    ]],
    ['Wednesday', [
      { id: byName['Squat'], sets: 4, reps: '8' },
      { id: byName['Leg Press'], sets: 3, reps: '12' },
      { id: byName['Romanian Deadlift'], sets: 3, reps: '10' },
      { id: byName['Leg Extension'], sets: 3, reps: '12' },
      { id: byName['Leg Curl'], sets: 3, reps: '12' },
      { id: byName['Calf Raise'], sets: 4, reps: '15' },
    ]],
    ['Thursday', [
      { id: byName['Overhead Press'], sets: 4, reps: '8' },
      { id: byName['Lateral Raise'], sets: 4, reps: '15' },
      { id: byName['Rear Delt Fly'], sets: 3, reps: '12' },
      { id: byName['Shrug'], sets: 3, reps: '12' },
      { id: byName['Plank'], sets: 3, reps: '60' },
      { id: byName['Cable Crunch'], sets: 3, reps: '15' },
    ]],
    ['Friday', [
      { id: byName['Dumbbell Bench Press'], sets: 4, reps: '10' },
      { id: byName['Cable Crossover'], sets: 3, reps: '12' },
      { id: byName['Seated Cable Row'], sets: 4, reps: '10' },
      { id: byName['Pull-up'], sets: 3, reps: '8' },
      { id: byName['Preacher Curl'], sets: 3, reps: '10' },
      { id: byName['Skull Crusher'], sets: 3, reps: '10' },
    ]],
    ['Saturday', [
      { id: byName['Front Squat'], sets: 4, reps: '8' },
      { id: byName['Bulgarian Split Squat'], sets: 3, reps: '10' },
      { id: byName['Hip Thrust'], sets: 4, reps: '10' },
      { id: byName['Hanging Leg Raise'], sets: 3, reps: '12' },
      { id: byName['Russian Twist'], sets: 3, reps: '20' },
      { id: byName['Running'], sets: 1, reps: '20' },
    ]],
    ['Sunday', []],
  ]);

  const testUser = new User({
    email: 'test@ironlog.com',
    password: 'test1234',
    name: 'Test Athlete',
    age: 25,
    height: 175,
    weight: 75,
    weightUnit: 'kg',
    weeklySchedule,
    weightLog: [
      { date: new Date('2026-02-01'), weight: 78 },
      { date: new Date('2026-02-08'), weight: 77.5 },
      { date: new Date('2026-02-15'), weight: 77.2 },
      { date: new Date('2026-02-22'), weight: 76.8 },
      { date: new Date('2026-03-01'), weight: 76.1 },
      { date: new Date('2026-03-07'), weight: 75 },
    ],
  });
  await testUser.save();
  console.log('Seeded test user');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/equipment', equipmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Workout Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = app;
