import express from 'express';
import { getRoutes, createRoute, deleteRoute } from '../controllers/routeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRoutes)
  .post(protect, admin, createRoute);

router.route('/:id')
  .delete(protect, admin, deleteRoute);

export default router;
