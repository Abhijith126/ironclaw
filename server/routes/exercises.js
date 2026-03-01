const express = require('express');
const auth = require('../middleware/auth');
const Exercise = require('../models/Exercise');
const router = express.Router();

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
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
    const exercises = await Exercise.find({ category }).sort({ name: 1 });

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
    const exercises = await Exercise.find({ muscleGroup }).sort({ name: 1 });

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
    const exercises = await Exercise.find({ equipment }).sort({ name: 1 });

    res.json({ exercises });
  } catch (error) {
    console.error('Get exercises by equipment error:', error);
    res.status(500).json({ message: 'Server error while fetching exercises' });
  }
});

// Get a specific exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json({ exercise });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ message: 'Server error while fetching exercise' });
  }
});

// Create a new exercise (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, muscleGroup, equipment, difficulty, description, imageUrl, videoUrl } =
      req.body;

    // Check if exercise already exists
    const existingExercise = await Exercise.findOne({ name });
    if (existingExercise) {
      return res.status(400).json({ message: 'Exercise already exists' });
    }

    const exercise = new Exercise({
      name,
      category,
      muscleGroup,
      equipment,
      difficulty,
      description,
      imageUrl,
      videoUrl
    });

    await exercise.save();

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ message: 'Server error while creating exercise' });
  }
});

// Update an exercise (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, muscleGroup, equipment, difficulty, description, imageUrl, videoUrl } =
      req.body;

    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Update exercise fields
    if (name) exercise.name = name;
    if (category) exercise.category = category;
    if (muscleGroup) exercise.muscleGroup = muscleGroup;
    if (equipment) exercise.equipment = equipment;
    if (difficulty) exercise.difficulty = difficulty;
    if (description) exercise.description = description;
    if (imageUrl !== undefined) exercise.imageUrl = imageUrl;
    if (videoUrl !== undefined) exercise.videoUrl = videoUrl;

    await exercise.save();

    res.json({
      message: 'Exercise updated successfully',
      exercise
    });
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ message: 'Server error while updating exercise' });
  }
});

// Delete an exercise (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ message: 'Server error while deleting exercise' });
  }
});

module.exports = router;
