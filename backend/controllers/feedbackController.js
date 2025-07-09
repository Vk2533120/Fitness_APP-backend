// backend/controllers/feedbackController.js
const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback'); // Import the new Feedback model

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private (User/Trainer)
const submitFeedback = asyncHandler(async (req, res) => {
  const { trainer, rating, comment, type } = req.body;

  if (!comment) {
    res.status(400);
    throw new Error('Please add a comment');
  }

  // Ensure 'user' is populated from 'protect' middleware
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  // Basic validation for trainer type feedback
  if (type === 'trainer') {
    if (!trainer) {
      res.status(400);
      throw new Error('Trainer ID is required for trainer feedback');
    }
    if (rating === undefined || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('A rating between 1 and 5 is required for trainer feedback');
    }
    // Optional: Check if the trainer ID actually corresponds to a user with role 'trainer'
    // const trainerExists = await User.findById(trainer);
    // if (!trainerExists || trainerExists.role !== 'trainer') {
    //   res.status(400);
    //   throw new Error('Invalid trainer ID provided');
    // }
  }

  // Prevent a user from giving feedback to themselves if it's trainer feedback
  if (type === 'trainer' && req.user._id.toString() === trainer) {
    res.status(400);
    throw new Error('Cannot submit feedback for your own profile');
  }

  const feedback = await Feedback.create({
    user: req.user._id,
    trainer: type === 'trainer' ? trainer : undefined, // Only set trainer if type is 'trainer'
    rating: type === 'trainer' ? rating : undefined,   // Only set rating if type is 'trainer'
    comment,
    type,
  });

  res.status(201).json({
    message: 'Feedback submitted successfully',
    data: feedback,
  });
});

// @desc    Get all feedback (for admin or specific trainer, or all for app)
// @route   GET /api/feedback
// @access  Private (Admin or Trainer for their feedback)
const getFeedback = asyncHandler(async (req, res) => {
  // If a trainerId query param is present, fetch feedback for that trainer
  const { trainerId, type } = req.query;
  let query = {};

  if (trainerId) {
    query.trainer = trainerId;
    query.type = 'trainer'; // Ensure it's trainer-specific feedback
  } else if (type === 'app') {
    query.type = 'app'; // Fetch general app feedback
  } else {
    // For general feedback list, admin can see all, trainer can see only their own, user can see their own
    if (req.user.role === 'admin') {
        // Admin sees all
    } else if (req.user.role === 'trainer') {
        query.trainer = req.user._id; // Trainer sees feedback directed at them
    } else {
        query.user = req.user._id; // User sees feedback they submitted
    }
  }

  const feedbackList = await Feedback.find(query)
    .populate('user', 'name profilePicture') // Populate user who gave feedback
    .populate('trainer', 'name profilePicture'); // Populate trainer if applicable

  res.status(200).json({
    message: 'Feedback fetched successfully',
    data: feedbackList,
  });
});

module.exports = {
  submitFeedback,
  getFeedback,
};