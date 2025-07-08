const Booking = require('../models/Booking');
const FitnessClass = require('../models/Class'); // Needed to get class details
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  const { fitnessClass, date, time } = req.body;
  try {
    // Save booking
    const booking = new Booking({
      user: req.user._id,
      fitnessClass,
      date,
      time
    });
    await booking.save();

    // Get class and user details
    const cls = await FitnessClass.findById(fitnessClass);
    const user = req.user; // assuming user is attached by auth middleware

    // Send confirmation email
    await sendEmail(
      user.email,
      'Booking Confirmation - Fitness Class',
      `Hi ${user.name},\n\nYou have successfully booked "${cls.title}" on ${date} at ${time}.\n\nThank you for using our service.\n\nStay fit,\nFitness365`
    );

    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getUserBookings = async (req, res) => {
    try {
        // Find bookings for the authenticated user
        const bookings = await Booking.find({ user: req.user._id })
                                    .populate('class', 'title date startTime') // Populate class details
                                    .populate('trainer', 'name'); // Populate trainer details
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate('fitnessClass');
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
  
      if (booking.user.toString() !== req.user._id.toString())
        return res.status(401).json({ message: 'Unauthorized' });
  
      booking.status = 'cancelled';
      await booking.save();
  
      const user = req.user;
      const cls = booking.fitnessClass;
  
      // 📩 Send email to user
      await sendEmail(
        user.email,
        'Booking Cancelled',
        `Hi ${user.name},\n\nYour booking for "${cls.title}" on ${booking.date} at ${booking.time} has been cancelled.\n\nThank you.`
      );
  
      // 📩 Send email to trainer
      const trainer = await User.findById(cls.trainerId);
      if (trainer) {
        await sendEmail(
          trainer.email,
          'A Booking Was Cancelled',
          `Hi ${trainer.name},\n\n${user.name} has cancelled their booking for "${cls.title}" on ${booking.date} at ${booking.time}.`
        );
      }
  
      res.json({ message: 'Booking cancelled and notification sent' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
exports.rescheduleBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.user.toString() !== req.user._id.toString())
        return res.status(401).json({ message: 'Unauthorized' });
  
      const { date, time } = req.body;
      booking.date = date;
      booking.time = time;
      await booking.save();
  
      res.json({ message: 'Booking rescheduled successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};