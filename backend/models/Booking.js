// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This references your User model
    },
    class: { // Assuming 'class' is a fitness class or session
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Class', // This references your Class model (e.g., a specific workout class)
    },
    trainer: { // Optional: if you want to store the assigned trainer directly in the booking
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Assuming a trainer is always assigned
      ref: 'User', // Assuming trainers are also User documents
    },
    bookingDate: { // The date/time of the booked class/session
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    // Add other relevant fields like price, duration, notes, etc.
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Booking', bookingSchema);