import express from 'express';
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js';
import { protectRoute, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling user authentication/registration

router.route('/').post(registerUser).get(protectRoute, verifyAdmin, getUsers);
router.route('/login').post(authUser);
router
  .route('/profile')
  .get(protectRoute, getUserProfile)
  .put(protectRoute, updateUserProfile);

export default router;
