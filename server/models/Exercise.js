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
    enum: [
      'bodyweight',
      'dumbbells',
      'barbell',
      'kettlebell',
      'machine',
      'bands',
      'medicine ball',
      'none'
    ]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  videoUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return (
          !v || /^https?:\/\/(www\.)?(youtube\.com|vimeo\.com|\.mp4|youtu\.be)(\/|\?)/i.test(v)
        );
      },
      message: 'Please provide a valid video URL'
    }
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
