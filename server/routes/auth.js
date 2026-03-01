const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, age, height, weight } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      age,
      height,
      weight
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);
    console.log('Password to check:', password);

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Save if password was migrated from plaintext to hash
    if (user.isModified('password')) {
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google OAuth callback (placeholder for now)
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    // Find user by Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email });

      if (user) {
        // Update existing user with Google ID
        user.googleId = googleId;
      } else {
        // Create new user
        user = new User({
          googleId,
          email,
          name,
          password: 'google_oauth_placeholder' // This won't be used for Google auth
        });
      }

      await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        height: user.height,
        weight: user.weight,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
