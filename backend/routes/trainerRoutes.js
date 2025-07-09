// backend/routes/trainerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerProfile,
  updateTrainerProfile,
  addReviewToTrainer,
  getTrainerReviews,
  uploadTrainerFiles // For multer middleware
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists in your backend root
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.get('/', getTrainers);
router.get('/:id', getTrainerProfile);

// Route for updating profile (e.g., text fields)
router.put('/profile', protect, authorize(['trainer']), updateTrainerProfile);

// Route for uploading profile picture and video
router.post(
  '/profile/upload',
  protect,
  authorize(['trainer']),
  upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'videoIntro', maxCount: 1 }]),
  uploadTrainerFiles
);

// Review routes
router.post('/:id/reviews', protect, authorize(['user']), addReviewToTrainer);
router.get('/:id/reviews', getTrainerReviews);

module.exports = router;