const express = require('express');
const equipmentList = require('../scripts/equipmentData');
const router = express.Router();

// Build lookup map once at startup
const equipmentById = new Map();
equipmentList.forEach((eq) => equipmentById.set(eq.id, eq));

// Get all equipment (supports ?search= and ?category= query params)
router.get('/', (req, res) => {
  const { search, category } = req.query;
  let filtered = equipmentList;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((eq) =>
      eq.machineName.toLowerCase().includes(q)
    );
  }

  if (category) {
    const cat = category.toLowerCase();
    filtered = filtered.filter(
      (eq) => eq.category.toLowerCase() === cat
    );
  }

  res.json({ equipment: filtered });
});

// Get equipment categories
router.get('/categories', (_req, res) => {
  const categories = [...new Set(equipmentList.map((eq) => eq.category))];
  res.json({ categories });
});

// Get single equipment by ID
router.get('/:id', (req, res) => {
  const equipment = equipmentById.get(req.params.id);
  if (!equipment) {
    return res.status(404).json({ message: 'Equipment not found' });
  }
  res.json({ equipment });
});

module.exports = router;
