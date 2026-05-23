import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
    },
    estimatedDuration: {
      type: String, // e.g., "5h 30m"
    },
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model('Route', routeSchema);
export default Route;
