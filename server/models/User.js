const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    min: [13, 'You must be at least 13 years old'],
    max: [120, 'Please enter a valid age']
  },
  height: {
    type: Number,
    min: [50, 'Please enter a valid height in cm'],
    max: [300, 'Please enter a valid height in cm']
  },
  weight: {
    type: Number,
    min: [20, 'Please enter a valid weight in kg'],
    max: [500, 'Please enter a valid weight in kg']
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'lbs'],
    default: 'kg'
  },
  profilePicture: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  weeklySchedule: {
    type: Map,
    of: [
      {
        id: String,
        name: String,
        imageUrl: String,
        sets: Number,
        reps: String,
        pr: {
          weight: Number,
          reps: Number
        }
      }
    ],
    default: new Map()
  },
  weightLog: {
    type: [
      {
        date: { type: Date, required: true },
        weight: { type: Number, required: true }
      }
    ],
    default: []
  },
  workoutLog: {
    type: [
      {
        date: { type: Date, required: true },
        exerciseId: { type: String, required: true },
        completed: { type: Boolean, default: true }
      }
    ],
    default: []
  },
  currentStreak: {
    type: Number,
    default: 0
  }
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
