// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController'); // Ensure getMe is imported
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); 

module.exports = router;