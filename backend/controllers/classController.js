const FitnessClass = require('../models/Class');
const User = require('../models/User'); 
exports.createClass = async (req, res) => {
    // --- CHANGES HERE TO MATCH FRONTEND formData NAMES ---
    const {
        title,         // Now directly matches frontend formData.title
        description,
        type,          // Now directly matches frontend formData.type
        duration,
        date,
        startTime,     // Now directly matches frontend formData.startTime
        endTime,       // Now directly matches frontend formData.endTime
        capacity,      // Now directly matches frontend formData.capacity
        price          // If you add 'price' to Class.js schema, this will be used
    } = req.body;

    // The trainer ID should come from the authenticated user
    const trainerId = req.user?._id; // Ensure req.user exists and has _id

    if (!trainerId || req.user.role !== 'trainer') {
        return res.status(403).json({ message: 'Unauthorized: Only trainers can create classes.' });
    }

    // Add validation for required fields if not already done by Mongoose
    if (!title || !description || !type || !date || !startTime || !endTime || !duration || !capacity || !price) {
        return res.status(400).json({ message: 'Please fill in all required class fields.' });
    }


    try {
        const newClass = await FitnessClass.create({
            title,
            description,
            type,
            duration: parseInt(duration),
            date,
            startTime,
            endTime,
            capacity: parseInt(capacity),
            spotsLeft: parseInt(capacity), // Initialize spotsLeft
            trainer: trainerId, // Assign the ID of the authenticated trainer user
            // price: parseFloat(price), // Uncomment this line if you add 'price' to your Class.js schema
        });
        res.status(201).json({ message: 'Class added successfully!', class: newClass });
    } catch (err) {
        console.error('Error creating class:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Class validation failed: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error: ' + err.message });
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
