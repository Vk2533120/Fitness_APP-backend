const express = require('express');
const router = express.Router();
const FitnessClass = require('../models/Class');

// GET /api/classes?type=&minDuration=&date=
router.get('/', async (req, res) => {
  try {
    const { type, minDuration, date } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (minDuration) filter.duration = { $gte: parseInt(minDuration) };
    if (date) {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59);
      filter.date = { $gte: dayStart, $lte: dayEnd };
    }

    const classes = await FitnessClass.find(filter);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/classes
router.post('/', async (req, res) => {
    try {
      const { title, description, type, duration, date, startTime, endTime, capacity } = req.body;
      const newClass = new FitnessClass({
        title,
        description,
        type,
        duration,
        date,
        startTime,
        endTime,
        capacity,
        spotsLeft: capacity,
      });
  
      await newClass.save();
      res.status(201).json(newClass);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create class', error: err.message });
    }
  });
  


module.exports = router;
