import express from 'express';
import {
  addBookingItems,
  getBookingById,
  updateBookingToPaid,
  getMyBookings,
  getBookings,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addBookingItems)
  .get(protect, admin, getBookings);

router.route('/mybookings').get(protect, getMyBookings);

router.route('/:id').get(protect, getBookingById);
router.route('/:id/pay').put(protect, updateBookingToPaid);
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;
