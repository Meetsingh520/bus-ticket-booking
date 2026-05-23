import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const addBookingItems = async (req, res) => {
  const { bus, travelDate, seats, totalAmount } = req.body;

  if (seats && seats.length === 0) {
    res.status(400).json({ message: 'No seats selected' });
    return;
  } else {
    try {
      const booking = new Booking({
        user: req.user._id,
        bus,
        travelDate,
        seats,
        totalAmount,
      });

      const createdBooking = await booking.save();
      
      // Update available seats count in Bus (simplified version, should ideally check specific date availability)
      // Since it's a simple model, we assume generic seats count decrement or we just track via bookings
      res.status(201).json(createdBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('bus').populate({
      path: 'bus',
      populate: {
        path: 'route'
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate({
      path: 'bus',
      populate: { path: 'route' }
    });

    if (booking) {
      // Check if user is admin or the booking belongs to the user
      if (req.user.role === 'admin' || booking.user._id.toString() === req.user._id.toString()) {
        res.json(booking);
      } else {
        res.status(403).json({ message: 'Not authorized to view this booking' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking to paid
// @route   PUT /api/bookings/:id/pay
// @access  Private
export const updateBookingToPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = 'Paid';
      booking.paymentDetails = {
        transactionId: req.body.id,
        paymentMethod: req.body.paymentMethod || 'Card',
        paidAt: Date.now(),
      };

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      
      booking.status = 'Cancelled';
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'id name').populate('bus');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
