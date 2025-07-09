// backend/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router(); // <--- This line is critical
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for submitting feedback (private, only logged-in users)
router.post('/', protect, submitFeedback);

// Route for getting feedback (private, access depends on role/query)
router.get('/', protect, getFeedback);

module.exports = router; // <--- This line is ABSOLUTELY CRITICAL