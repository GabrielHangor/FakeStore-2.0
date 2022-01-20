import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import { protectRoute, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling user authentication/registration

router
  .route('/')
  .post(protectRoute, addOrderItems)
  .get(protectRoute, verifyAdmin, getAllOrders);
router.route('/myorders').get(protectRoute, getMyOrders);
router.route('/:id').get(protectRoute, getOrderById);
router.route('/:id/pay').put(protectRoute, updateOrderToPaid);

export default router;
