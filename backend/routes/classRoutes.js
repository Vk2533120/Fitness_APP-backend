// backend/routes/classRoutes.js
const express = require('express');
const router = express.Router();
const FitnessClass = require('../models/Class');
const { protect } = require('../middleware/authMiddleware'); // <-- ENSURE THIS IS IMPORTED!

// GET /api/classes?type=&minDuration=&date=
router.get('/', async (req, res) => {
    console.log('--- GET /api/classes route hit ---'); // Log when GET route is hit
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
        console.log('Successfully retrieved classes:', classes.length); // Log success
        res.json(classes);
    } catch (err) {
        console.error('Error in GET /api/classes:', err.message); // Log error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/classes
// IMPORTANT: You need to apply the 'protect' middleware here to get req.user
router.post('/', protect, async (req, res) => { // <-- ADD 'protect' middleware here
    console.log('--- POST /api/classes route hit ---'); // Log when POST route is hit
    console.log('Request Body in classRoutes:', req.body); // Log request body
    console.log('Authenticated User in classRoutes (req.user):', req.user); // Log req.user
    
    // IMPORTANT: Verify the fields you are destructuring match your frontend and Class.js schema
    // Based on previous discussions, your Class.js schema has:
    // title, description, type, duration, date, startTime, endTime, capacity, spotsLeft, trainer, price
    // Your frontend AddClassForm.jsx sends:
    // title, description, type, date, startTime, endTime, duration, price, capacity
    try {
        const { title, description, type, duration, date, startTime, endTime, capacity, price } = req.body; // <-- ENSURE 'price' is destructured

        // Manual validation for required fields if not handled by Mongoose schema 'required: true'
        if (!title || !description || !type || !duration || !date || !startTime || !endTime || !capacity || price === undefined) {
            console.error('Missing required fields in POST /api/classes');
            return res.status(400).json({ message: 'Please provide all required class details.' });
        }

        // The 'trainer' field comes from the authenticated user, which is populated by the 'protect' middleware.
        if (!req.user || req.user.role !== 'trainer') {
            console.error('Unauthorized: User is not logged in or not a trainer.');
            return res.status(403).json({ message: 'Unauthorized: Only trainers can create classes.' });
        }
        const trainerId = req.user._id;

        const newClass = new FitnessClass({
            title,
            description,
            type,
            duration: parseInt(duration),
            date,
            startTime,
            endTime,
            capacity: parseInt(capacity),
            spotsLeft: parseInt(capacity), // Initialize spotsLeft
            trainer: trainerId, // Assign the trainer ID from the authenticated user
            price: parseFloat(price), // Use parseFloat if price is numeric
        });

        console.log('Attempting to save new class:', newClass); // Log class object before saving
        await newClass.save();
        console.log('Class saved successfully:', newClass._id); // Log success
        res.status(201).json({ message: 'Class added successfully!', class: newClass }); // Consistent response format
    } catch (err) {
        console.error('Error in POST /api/classes:', err); // Log the full error object
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Class validation failed: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Failed to create class', error: err.message });
    }
});

module.exports = router;