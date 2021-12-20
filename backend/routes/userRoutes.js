import express from 'express';
import { authUser } from '../controllers/userController.js';

const router = express.Router();

// routes handling user authentication

router.route('/login').post(authUser);

export default router;
