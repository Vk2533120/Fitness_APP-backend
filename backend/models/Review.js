// backend/models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the Trainer (User model)
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User who wrote the review
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Rating from 1 to 5 stars
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to calculate average rating and review count for a trainer
reviewSchema.statics.getAverageRating = async function(trainerId) {
  const obj = await this.aggregate([
    {
      $match: { trainer: trainerId }
    },
    {
      $group: {
        _id: '$trainer',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await mongoose.model('User').findByIdAndUpdate(trainerId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0, // Round to 1 decimal place
      reviewCount: obj[0] ? obj[0].reviewCount : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save and remove
reviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.trainer);
});

reviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.trainer);
});


module.exports = mongoose.model('Review', reviewSchema);