import express from 'express';
import {
  authUser,
  getUserProfile,
  registerUser,
} from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling user authentication/registration

router.route('/').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').get(protectRoute, getUserProfile);

export default router;
