const express = require('express');
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  rescheduleBooking  
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
// GET /api/bookings/my-bookings
router.get('/my-bookings', protect, getUserBookings);
// router.get('/', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id', protect, rescheduleBooking);


module.exports = router;
