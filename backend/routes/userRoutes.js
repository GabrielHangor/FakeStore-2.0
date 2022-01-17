import express from 'express';
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protectRoute, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protectRoute, verifyAdmin, getUsers);
router.route('/login').post(authUser);

router
  .route('/profile')
  .get(protectRoute, getUserProfile)
  .put(protectRoute, updateUserProfile);

router
  .route(`/:id`)
  .delete(protectRoute, verifyAdmin, deleteUser)
  .get(protectRoute, verifyAdmin, getUserById)
  .put(protectRoute, verifyAdmin, updateUser);

export default router;
