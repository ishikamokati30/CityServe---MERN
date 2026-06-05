const express = require('express');
const router = express.Router();
const City = require('../models/City');

// GET /api/cities - public, no auth needed
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().sort('name');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cities - add a city
router.post('/', async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
