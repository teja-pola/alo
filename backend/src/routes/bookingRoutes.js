const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  updateDeliveryDetails,
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.post('/:id/cancel', protect, cancelBooking);
router.put('/:id/delivery', protect, updateDeliveryDetails);

module.exports = router; 