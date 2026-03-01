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
    enum: ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'cardio']
  },
  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
    enum: [
      'barbell',
      'dumbbell',
      'cable',
      'machine',
      'bodyweight',
      'cardio',
      'other'
    ]
  },
  imageUrl: {
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
