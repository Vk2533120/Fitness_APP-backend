// backend/controllers/trainerController.js
const User = require('../models/User');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler'); // npm install express-async-handler

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
exports.getTrainers = asyncHandler(async (req, res) => {
  const trainers = await User.find({ role: 'trainer' }).select(
    'name email profilePicture bio qualifications expertise specializations averageRating reviewCount'
  );
  res.status(200).json({ success: true, data: trainers });
});

// @desc    Get single trainer profile
// @route   GET /api/trainers/:id
// @access  Public
exports.getTrainerProfile = asyncHandler(async (req, res) => {
  const trainer = await User.findOne({ _id: req.params.id, role: 'trainer' }).select('-password'); // Exclude password
  if (!trainer) {
    return res.status(404).json({ message: 'Trainer not found' });
  }
  res.status(200).json({ success: true, data: trainer });
});

// @desc    Update trainer's own profile (text fields)
// @route   PUT /api/trainers/profile
// @access  Private/Trainer
exports.updateTrainerProfile = asyncHandler(async (req, res) => {
  const { qualifications, expertise, specializations, bio } = req.body;

  const trainer = await User.findById(req.user._id);

  if (trainer) {
    trainer.qualifications = qualifications || trainer.qualifications;
    trainer.expertise = expertise || trainer.expertise;
    trainer.specializations = specializations || trainer.specializations;
    trainer.bio = bio || trainer.bio;

    const updatedTrainer = await trainer.save();
    res.json({ success: true, data: updatedTrainer });
  } else {
    res.status(404).json({ message: 'Trainer not found' });
  }
});

// @desc    Upload trainer profile picture and video
// @route   POST /api/trainers/profile/upload
// @access  Private/Trainer
exports.uploadTrainerFiles = asyncHandler(async (req, res) => {
  const trainer = await User.findById(req.user._id);

  if (trainer) {
    if (req.files.profilePicture) {
      trainer.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }
    if (req.files.videoIntro) {
      trainer.videoIntro = `/uploads/${req.files.videoIntro[0].filename}`;
    }
    const updatedTrainer = await trainer.save();
    res.json({ success: true, data: updatedTrainer });
  } else {
    res.status(404).json({ message: 'Trainer not found' });
  }
});


// @desc    Add a review to a trainer
// @route   POST /api/trainers/:id/reviews
// @access  Private/User
exports.addReviewToTrainer = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  // Check if the user is authorized to review (e.g., they booked a class with this trainer)
  // For simplicity, we're just checking if they are a 'user' role
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only regular users can add reviews' });
  }

  // Prevent a user from reviewing themselves if they are also a trainer
  if (req.user._id.toString() === req.params.id.toString()) {
      return res.status(400).json({ message: 'You cannot review your own profile' });
  }

  // Check if user has already reviewed this trainer (optional: allow only one review per user per trainer)
  const existingReview = await Review.findOne({ trainer: req.params.id, user: req.user._id });
  if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this trainer' });
  }

  const review = await Review.create({
    trainer: req.params.id,
    user: req.user._id,
    rating,
    comment,
  });

  res.status(201).json({ success: true, data: review });
});

// @desc    Get reviews for a specific trainer
// @route   GET /api/trainers/:id/reviews
// @access  Public
exports.getTrainerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ trainer: req.params.id }).populate('user', 'name profilePicture'); // Populate user details
  res.status(200).json({ success: true, data: reviews });
});