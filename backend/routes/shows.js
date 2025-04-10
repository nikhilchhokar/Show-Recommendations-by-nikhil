const express = require('express');
const router = express.Router();
const Show = require('../models/Show');

// Get all shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.findAll();
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new show
router.post('/', async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a show
router.delete('/:id', async (req, res) => {
  try {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    await show.destroy();
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 