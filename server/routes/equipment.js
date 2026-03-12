const express = require('express');
const wger = require('../services/wger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const equipment = await wger.fetchEquipment();
    
    let filtered = equipment;
    
    if (search) {
      filtered = equipment.filter(eq => 
        eq.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const mapped = filtered.map(eq => ({
      id: eq.id,
      machineName: eq.name,
      category: 'Equipment',
      primaryMuscles: [],
      secondaryMuscles: [],
      difficultyLevel: null,
      notes: null
    }));
    
    res.json({ equipment: mapped });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error while fetching equipment' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = ['Cardio', 'Strength', 'Core', 'Free Weights', 'Functional'];
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await wger.fetchEquipment();
    
    const eq = equipment.find(e => e.id === parseInt(id));
    
    if (!eq) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ 
      equipment: {
        id: eq.id,
        machineName: eq.name,
        category: 'Equipment',
        primaryMuscles: [],
        secondaryMuscles: [],
        difficultyLevel: null,
        notes: null
      }
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error while fetching equipment' });
  }
});

module.exports = router;
