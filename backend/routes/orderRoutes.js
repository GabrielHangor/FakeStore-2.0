import express from 'express';
import { addOrderItems } from '../controllers/orderController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling user authentication/registration

router.route('/').post(protectRoute, addOrderItems);

export default router;
