// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const FitnessClass = require('../models/Class');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Change: Rename createBooking to something more standard like bookClass as per your frontend API call
exports.bookClass = async (req, res) => { // Renamed from createBooking to bookClass
  // --- IMPORTANT CHANGES HERE ---
  // 1. Destructure 'class' as 'classId' to avoid conflict with JS keyword 'class'.
  // 2. Destructure 'bookingDate' as this is what frontend sends and backend model expects.
  const { class: classId, trainer, bookingDate } = req.body; // 'trainer' is also expected in payload

  try {
    // Get the user ID from the authenticated request
    const userId = req.user._id;

    // Create booking
    const booking = new Booking({
      user: userId,
      class: classId, // Assign the received classId to the 'class' field in the schema
      trainer: trainer, // Assign trainer (will be undefined if not provided by frontend)
      bookingDate: bookingDate // Assign the received bookingDate to the 'bookingDate' field in the schema
      // status will default to 'pending' as per schema
    });
    await booking.save();

    // Get class and user details for email
    // Use `classId` to find the class
    const cls = await FitnessClass.findById(classId).populate('trainer', 'name email'); // Populate trainer for email if needed
    const user = req.user; // assuming user is attached by auth middleware

    // Send confirmation email
    await sendEmail(
      user.email,
      'Booking Confirmation - Fitness Class',
      `Hi ${user.name},\n\nYou have successfully booked "${cls.title}" on ${new Date(bookingDate).toLocaleDateString()} at ${new Date(bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.\n\nThank you for using our service.\n\nStay fit,\nFitness365`
    );

    // If a trainer is associated with the class, send them an email too
    if (cls.trainer && cls.trainer.email) {
      await sendEmail(
        cls.trainer.email,
        'New Class Booking Notification',
        `Hi ${cls.trainer.name},\n\nA new booking has been made for your class "${cls.title}" on ${new Date(bookingDate).toLocaleDateString()} at ${new Date(bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by ${user.name}.`
      );
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking error:', err); // Log the full error for debugging
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// ... (keep getUserBookings, cancelBooking, rescheduleBooking as they are, but check populate in cancelBooking)
// In cancelBooking, you have `booking.fitnessClass`. It should be `booking.class` because that's the field name.
// Also `cls.trainerId` should be `cls.trainer._id` after population.

exports.cancelBooking = async (req, res) => {
    try {
      // populate 'class' not 'fitnessClass'
      const booking = await Booking.findById(req.params.id).populate('class'); // Changed from fitnessClass to class
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      if (booking.user.toString() !== req.user._id.toString())
        return res.status(401).json({ message: 'Unauthorized' });

      booking.status = 'cancelled';
      await booking.save();

      const user = req.user;
      const cls = booking.class; // Changed from fitnessClass to class

      // 📩 Send email to user
      await sendEmail(
        user.email,
        'Booking Cancelled',
        `Hi ${user.name},\n\nYour booking for "${cls.title}" on ${new Date(booking.bookingDate).toLocaleDateString()} at ${new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} has been cancelled.\n\nThank you.`
      );

      // 📩 Send email to trainer
      // Ensure cls.trainer is populated in your getClassById or similar if trainer email needed
      // Or populate trainer directly in this query if it's stored in booking
      const trainer = await User.findById(cls.trainer); // cls.trainer holds the ID from Class schema
      if (trainer) {
        await sendEmail(
          trainer.email,
          'A Booking Was Cancelled',
          `Hi ${trainer.name},\n\n${user.name} has cancelled their booking for "${cls.title}" on ${new Date(booking.bookingDate).toLocaleDateString()} at ${new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
        );
      }

      res.json({ message: 'Booking cancelled and notification sent' });
    } catch (err) {
      console.error('Cancel booking error:', err);
      res.status(500).json({ message: err.message });
    }
  };

exports.rescheduleBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.user.toString() !== req.user._id.toString())
        return res.status(401).json({ message: 'Unauthorized' });

      const { bookingDate } = req.body; // Expect bookingDate, not separate date and time
      booking.bookingDate = new Date(bookingDate); // Update the Date object
      await booking.save();

      res.json({ message: 'Booking rescheduled successfully' });
    } catch (err) {
      console.error('Reschedule booking error:', err);
      res.status(500).json({ message: err.message });
    }
};