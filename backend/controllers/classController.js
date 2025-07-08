const FitnessClass = require('../models/Class');
const User = require('../models/User'); // Make sure to import User if you haven't already

exports.createClass = async (req, res) => {
    const { title, description, type, duration, date, startTime, endTime, capacity } = req.body;

    try {
      const newClass = await FitnessClass.create({ // Use FitnessClass here consistently
        title,
        description,
        type,
        duration,
        date,
        startTime,
        endTime,
        capacity,
        spotsLeft: capacity,
        trainer: req.user._id, // Assign the ID of the authenticated user as the trainer
      });

      res.status(201).json(newClass);
    } catch (err) {
      console.error(err); // Log the actual error for debugging
      res.status(500).json({ message: 'Server error: ' + err.message }); // Send actual error message
    }
};


exports.getAllClasses = async (req, res) => {
    const { type, minDuration, date } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (minDuration) filter.duration = { $gte: parseInt(minDuration) };
    if (date) filter.date = date;

    try {
        // --- IMPORTANT CHANGE HERE: Populate the 'trainer' field ---
        const classes = await FitnessClass.find(filter)
                                         .populate('trainer', 'name email'); // Populates trainer object, selecting 'name' and 'email'

        res.status(200).json(classes);
    } catch (err) {
        console.error(err); // Log the actual error for debugging
        res.status(500).json({ message: 'Server error: ' + err.message }); // Send actual error message
    }
};


exports.getClassById = async (req, res) => {
    try {
        const classItem = await FitnessClass.findById(req.params.id).populate('trainer', 'name email'); // Also specify fields for consistency
        if (!classItem) return res.status(404).json({ message: 'Class not found' });
        res.json(classItem);
    } catch (err) {
        console.error(err); // Log the actual error for debugging
        res.status(500).json({ message: err.message });
    }
};