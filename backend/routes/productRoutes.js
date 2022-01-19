import express from 'express';
import {
  deleteProduct,
  getProductById,
  getProducts,
} from '../controllers/productController.js';
import { protectRoute, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling requests from the client

router.route('/').get(getProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protectRoute, verifyAdmin, deleteProduct);

export default router;
