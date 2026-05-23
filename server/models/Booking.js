import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    seats: [
      {
        seatNumber: { type: String, required: true },
        passengerName: { type: String, required: true },
        passengerAge: { type: Number, required: true },
        passengerGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Cancelled'],
      default: 'Pending',
    },
    paymentDetails: {
      transactionId: { type: String },
      paymentMethod: { type: String },
      paidAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
