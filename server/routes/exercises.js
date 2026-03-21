const express = require('express');
const exercises = require('../scripts/exerciseData');
const router = express.Router();

// Build lookup maps once at startup
const exerciseById = new Map();
exercises.forEach((ex) => exerciseById.set(ex.id, ex));

// Get all exercises
router.get('/', (_req, res) => {
  res.json({ exercises });
});

// Get exercises by category
router.get('/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const filtered = exercises.filter(
    (ex) => ex.category.toLowerCase() === category
  );
  res.json({ exercises: filtered });
});

// Get exercises by muscle group
router.get('/muscle/:muscleGroup', (req, res) => {
  const muscleGroup = req.params.muscleGroup.toLowerCase();
  const filtered = exercises.filter((ex) =>
    ex.muscleGroup.toLowerCase().includes(muscleGroup)
  );
  res.json({ exercises: filtered });
});

// Get exercises by equipment
router.get('/equipment/:equipment', (req, res) => {
  const equipment = req.params.equipment.toLowerCase();
  const filtered = exercises.filter((ex) =>
    ex.equipment.toLowerCase().includes(equipment)
  );
  res.json({ exercises: filtered });
});

// Get a specific exercise by ID
router.get('/:id', (req, res) => {
  const exercise = exerciseById.get(req.params.id);
  if (!exercise) {
    return res.status(404).json({ message: 'Exercise not found' });
  }
  res.json({ exercise });
});

module.exports = router;
