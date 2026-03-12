const express = require('express');
const Exercise = require('../models/Exercise');
const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find({}).lean();
    res.json({ exercises });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ message: 'Server error while fetching exercises' });
  }
});

// Get exercises by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const exercises = await Exercise.find({ 
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    }).lean();
    
    res.json({ exercises });
  } catch (error) {
    console.error('Get exercises by category error:', error);
    res.status(500).json({ message: 'Server error while fetching exercises' });
  }
});

// Get exercises by muscle group
router.get('/muscle/:muscleGroup', async (req, res) => {
  try {
    const { muscleGroup } = req.params;
    const exercises = await Exercise.find({ 
      muscleGroup: { $regex: new RegExp(muscleGroup, 'i') }
    }).lean();
    
    res.json({ exercises });
  } catch (error) {
    console.error('Get exercises by muscle group error:', error);
    res.status(500).json({ message: 'Server error while fetching exercises' });
  }
});

// Get exercises by equipment
router.get('/equipment/:equipment', async (req, res) => {
  try {
    const { equipment } = req.params;
    const exercises = await Exercise.find({ 
      equipment: { $regex: new RegExp(equipment, 'i') }
    }).lean();
    
    res.json({ exercises });
  } catch (error) {
    console.error('Get exercises by equipment error:', error);
    res.status(500).json({ message: 'Server error while fetching exercises' });
  }
});

// Get a specific exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findOne({ id }).lean();
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json({ exercise });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ message: 'Server error while fetching exercise' });
  }
});

// Create a new exercise (admin only) - Disabled, using wger
router.post('/', async (req, res) => {
  res.status(403).json({ message: 'Cannot create exercises - using wger API' });
});

// Update an exercise (admin only) - Disabled
router.put('/:id', async (req, res) => {
  res.status(403).json({ message: 'Cannot update exercises - using wger API' });
});

// Delete an exercise (admin only) - Disabled
router.delete('/:id', async (req, res) => {
  res.status(403).json({ message: 'Cannot delete exercises - using wger API' });
});

module.exports = router;
