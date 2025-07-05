const FitnessClass = require('../models/Class');

exports.createClass = async (req, res) => {
    const { title, description, type, duration, date, startTime, endTime, capacity } = req.body;
  
    try {
      const newClass = await Class.create({
        title,
        description,
        type,
        duration,
        date,
        startTime,
        endTime,
        capacity,
        spotsLeft: capacity,
        trainer: req.user._id,
      });
  
      res.status(201).json(newClass);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  exports.getAllClasses = async (req, res) => {
    const { type, minDuration, date } = req.query;
  
    let filter = {};
  
    if (type) filter.type = type;
    if (minDuration) filter.duration = { $gte: parseInt(minDuration) };
    if (date) filter.date = date;
  
    try {
      const classes = await Class.find(filter);
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
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
