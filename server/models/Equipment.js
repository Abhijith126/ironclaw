const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  machineName: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  zone: { type: String },
  resistanceType: { type: String },
  movementPattern: { type: String },
  primaryMuscles: [{ type: String }],
  secondaryMuscles: [{ type: String }],
  difficultyLevel: { type: String },
  notes: { type: String },
  videoUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
