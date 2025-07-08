// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Class',
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Keep this commented out for now if you want it optional
      // required: true,
    },
    bookingDate: { // <-- UNCOMMENT THIS AND MAKE IT REQUIRED
      type: Date,
      required: true, // It's crucial this is present and required.
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled','completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);