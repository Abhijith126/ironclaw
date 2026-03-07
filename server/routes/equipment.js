const express = require('express');
const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { machineName: { $regex: search, $options: 'i' } },
        { primaryMuscles: { $regex: search, $options: 'i' } },
        { secondaryMuscles: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const equipment = await Equipment.find(query).sort({ machineName: 1 });
    res.json({ equipment });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error while fetching equipment' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Equipment.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Not found' });
    }
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ equipment });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error while fetching equipment' });
  }
});

module.exports = router;
