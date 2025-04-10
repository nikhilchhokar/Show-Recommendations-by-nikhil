const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');

// Get all recommendations
router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new recommendation
router.post('/', async (req, res) => {
  try {
    const recommendation = await Recommendation.create(req.body);
    res.status(201).json(recommendation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a recommendation
router.delete('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findByPk(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    await recommendation.destroy();
    res.json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 