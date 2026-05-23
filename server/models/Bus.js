import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['AC Seater', 'AC Sleeper', 'Non-AC Seater', 'Non-AC Sleeper'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 40,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    departureTime: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model('Bus', busSchema);
export default Bus;
