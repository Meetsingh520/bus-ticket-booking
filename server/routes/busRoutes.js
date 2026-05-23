import express from 'express';
import { getBuses, getBusById, createBus, deleteBus } from '../controllers/busController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBuses)
  .post(protect, admin, createBus);

router.route('/:id')
  .get(getBusById)
  .delete(protect, admin, deleteBus);

export default router;
