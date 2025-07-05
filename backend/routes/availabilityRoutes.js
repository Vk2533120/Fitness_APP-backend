const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

router.post('/', async (req, res) => {
  const { trainerId, weekday, start, end } = req.body;

  try {
    const availability = new Availability({ trainerId, weekday, start, end });
    await availability.save();
    res.status(201).json(availability);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
