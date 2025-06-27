const FitnessClass = require('../models/Class');

exports.createClass = async (req, res) => {
  const { title, type, duration, schedule, description, capacity } = req.body;
  try {
    const newClass = await FitnessClass.create({
      title,
      trainer: req.user._id,
      type,
      duration,
      schedule,
      description,
      capacity
    });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await FitnessClass.find().populate('trainer');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classItem = await FitnessClass.findById(req.params.id).populate('trainer');
    if (!classItem) return res.status(404).json({ message: 'Class not found' });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
