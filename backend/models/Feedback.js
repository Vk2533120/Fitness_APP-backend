// backend/models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User model (the user who provides feedback)
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Trainer is optional, can be general app feedback
      ref: 'User', // References the User model (the trainer being rated)
    },
    rating: {
      type: Number,
      required: function() { return this.trainer !== undefined; }, // Rating is required if a trainer is specified
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    // You could add a type if you want to distinguish 'trainer_feedback' from 'app_feedback'
    type: {
      type: String,
      enum: ['trainer', 'app'], // 'trainer' for trainer-specific, 'app' for general app feedback
      default: 'app',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);