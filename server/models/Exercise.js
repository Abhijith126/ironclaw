const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Exercise category is required'],
    enum: ['upper body', 'lower body', 'core', 'cardio', 'full body', 'flexibility']
  },
  muscleGroup: {
    type: String,
    required: [true, 'Muscle group is required'],
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardiovascular', 'full body']
  },
  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
    enum: [
      'barbell',
      'dumbbells',
      'cable',
      'machine',
      'bodyweight',
      'kettlebell',
      'none',
      'other'
    ]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  howTo: {
    steps: [{ type: String }],
    tips: [{ type: String }],
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  demoUrl: {
    type: String
  },
  explainUrl: {
    type: String
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
exerciseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exercise', exerciseSchema);
