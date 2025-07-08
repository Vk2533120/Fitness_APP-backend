const express = require('express');
const router = express.Router();
const {
    bookClass,
  getUserBookings,
  cancelBooking,
  rescheduleBooking  
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');


console.log(typeof bookClass, typeof protect)
router.post('/', protect, bookClass);// GET /api/bookings/my-bookings
router.get('/my-bookings', protect, getUserBookings);
// router.get('/', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id', protect, rescheduleBooking);


module.exports = router;
