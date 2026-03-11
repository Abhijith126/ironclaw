const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Workout type is required'],
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'other']
  },
  exercises: [
    {
      exerciseId: {
        type: String,
        required: true
      },
      exerciseName: {
        type: String,
        required: true
      },
      sets: [
        {
          setNumber: {
            type: Number,
            required: true
          },
          reps: {
            type: Number,
            min: 1,
            max: 100
          },
          weight: {
            type: Number,
            min: 0
          },
          duration: {
            type: Number,
            min: 0
          },
          completed: {
            type: Boolean,
            default: false
          }
        }
      ],
      completed: {
        type: Boolean,
        default: false
      }
    }
  ],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
workoutSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);
