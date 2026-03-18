const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Workout = require('../models/Workout');
const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -googleId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, age, height, weight, weightUnit, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (age !== undefined) user.age = age;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (weightUnit !== undefined) user.weightUnit = weightUnit;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        weightUnit: user.weightUnit,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a Google OAuth user
    if (!user.password || user.googleId) {
      return res.status(400).json({ message: 'Password cannot be changed for OAuth accounts' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

// Get user's weekly schedule
router.get('/weekly-schedule', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const schedule = {};
    if (user.weeklySchedule) {
      for (const [day, dayExercises] of user.weeklySchedule) {
        schedule[day] = dayExercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          imageUrl: ex.imageUrl,
          sets: ex.sets,
          reps: ex.reps,
          pr: ex.pr || null,
        }));
      }
    }

    res.json({ weeklySchedule: schedule });
  } catch (error) {
    console.error('Weekly schedule fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching weekly schedule' });
  }
});

// Update user's weekly schedule
router.put('/weekly-schedule', auth, async (req, res) => {
  try {
    const { weeklySchedule } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the schedule structure
    if (!weeklySchedule || typeof weeklySchedule !== 'object') {
      return res.status(400).json({ message: 'Weekly schedule is required' });
    }
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of Object.keys(weeklySchedule)) {
      if (!validDays.includes(day)) {
        return res.status(400).json({ message: `Invalid day: ${day}` });
      }
      if (!Array.isArray(weeklySchedule[day])) {
        return res.status(400).json({ message: `${day} must be an array` });
      }
    }

    // Update the weekly schedule
    user.weeklySchedule = new Map(Object.entries(weeklySchedule));
    await user.save();

    const responseSchedule = {};
    for (const [day, dayExercises] of user.weeklySchedule) {
      responseSchedule[day] = dayExercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        imageUrl: ex.imageUrl,
        sets: ex.sets,
        reps: ex.reps,
        pr: ex.pr || null,
      }));
    }

    res.json({
      message: 'Weekly schedule updated successfully',
      weeklySchedule: responseSchedule
    });
  } catch (error) {
    console.error('Weekly schedule update error:', error);
    res.status(500).json({ message: 'Server error while updating weekly schedule' });
  }
});

// Delete user account
router.delete('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Workout.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
});

// Get user's weight log
router.get('/weight-log', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ weightLog: user.weightLog || [] });
  } catch (error) {
    console.error('Weight log fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching weight log' });
  }
});

// Add weight entry
router.post('/weight-log', auth, async (req, res) => {
  try {
    const { weight, date } = req.body;

    if (!weight || weight <= 0) {
      return res.status(400).json({ message: 'Valid weight is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const weightEntry = {
      date: date ? new Date(date) : new Date(),
      weight: parseFloat(weight)
    };

    if (!user.weightLog) {
      user.weightLog = [];
    }
    user.weightLog.push(weightEntry);
    await user.save();

    res.status(201).json({
      message: 'Weight logged successfully',
      weightLog: user.weightLog
    });
  } catch (error) {
    console.error('Weight log error:', error);
    res.status(500).json({ message: 'Server error while logging weight' });
  }
});

// Get workout log
router.get('/workout-log', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      workoutLog: user.workoutLog || [],
      currentStreak: user.currentStreak || 0
    });
  } catch (error) {
    console.error('Workout log fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching workout log' });
  }
});

// Log workout completion
router.post('/workout-log', auth, async (req, res) => {
  try {
    const { exerciseId, completed } = req.body;

    if (!exerciseId) {
      return res.status(400).json({ message: 'Exercise ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toDateString();

    if (!user.workoutLog) {
      user.workoutLog = [];
    }

    const existingIndex = user.workoutLog.findIndex(
      (w) =>
        new Date(w.date).toDateString() === today && w.exerciseId === exerciseId
    );

    if (existingIndex >= 0) {
      user.workoutLog[existingIndex].completed = completed;
    } else {
      user.workoutLog.push({
        date: new Date(),
        exerciseId: exerciseId,
        completed: completed !== false
      });
    }

    user.currentStreak = calculateStreak(user.workoutLog);

    await user.save();

    res.status(201).json({
      message: 'Workout logged successfully',
      workoutLog: user.workoutLog,
      currentStreak: user.currentStreak
    });
  } catch (error) {
    console.error('Workout log error:', error);
    res.status(500).json({ message: 'Server error while logging workout' });
  }
});

function calculateStreak(workoutLog) {
  if (!workoutLog || workoutLog.length === 0) return 0;

  const sorted = [...workoutLog]
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const workoutDate = new Date(sorted[i].date);
    workoutDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (workoutDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (i === 0 && workoutDate.getTime() === expectedDate.getTime() - 86400000) {
      // Yesterday counts if today not done yet
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

module.exports = router;
