const express = require('express');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const router = express.Router();

// Get all workouts for the current user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('exercises.exerciseId', 'name category muscleGroup');

    res.json({ workouts });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Server error while fetching workouts' });
  }
});

// Get a specific workout by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('exercises.exerciseId', 'name category muscleGroup');

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ workout });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ message: 'Server error while fetching workout' });
  }
});

// Create a new workout
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, exercises } = req.body;

    const workout = new Workout({
      userId: req.user._id,
      name,
      type,
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: ex.sets.map((set) => ({
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
          duration: set.duration
        }))
      }))
    });

    await workout.save();

    res.status(201).json({
      message: 'Workout created successfully',
      workout
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ message: 'Server error while creating workout' });
  }
});

// Update a workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, exercises } = req.body;

    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update workout fields
    if (name) workout.name = name;
    if (type) workout.type = type;
    if (exercises) {
      workout.exercises = exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: ex.sets.map((set) => ({
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
          duration: set.duration
        }))
      }));
    }

    await workout.save();

    res.json({
      message: 'Workout updated successfully',
      workout
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: 'Server error while updating workout' });
  }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Server error while deleting workout' });
  }
});

// Mark a workout as completed
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    workout.completed = true;
    workout.completedAt = new Date();
    await workout.save();

    res.json({
      message: 'Workout marked as completed',
      workout
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({ message: 'Server error while marking workout as completed' });
  }
});

// Mark a specific exercise set as completed
router.patch(
  '/:workoutId/exercises/:exerciseIndex/sets/:setIndex/complete',
  auth,
  async (req, res) => {
    try {
      const { workoutId, exerciseIndex, setIndex } = req.params;

      const workout = await Workout.findOne({
        _id: workoutId,
        userId: req.user._id
      });

      if (!workout) {
        return res.status(404).json({ message: 'Workout not found' });
      }

      if (!workout.exercises[exerciseIndex] || !workout.exercises[exerciseIndex].sets[setIndex]) {
        return res.status(404).json({ message: 'Exercise or set not found' });
      }

      workout.exercises[exerciseIndex].sets[setIndex].completed = true;

      // Check if all sets in the exercise are completed
      const allSetsCompleted = workout.exercises[exerciseIndex].sets.every((set) => set.completed);
      workout.exercises[exerciseIndex].completed = allSetsCompleted;

      await workout.save();

      res.json({
        message: 'Set marked as completed',
        workout
      });
    } catch (error) {
      console.error('Complete set error:', error);
      res.status(500).json({ message: 'Server error while marking set as completed' });
    }
  }
);

module.exports = router;
