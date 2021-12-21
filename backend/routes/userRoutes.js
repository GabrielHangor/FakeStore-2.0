import express from 'express';
import { authUser, getUserProfile } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling user authentication

router.route('/login').post(authUser);
router.route('/profile').get(protectRoute, getUserProfile);

export default router;
