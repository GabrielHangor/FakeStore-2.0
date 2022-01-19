import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { protectRoute, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling requests from the client

router
  .route('/')
  .get(getProducts)
  .post(protectRoute, verifyAdmin, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .delete(protectRoute, verifyAdmin, deleteProduct)
  .put(protectRoute, verifyAdmin, updateProduct);

export default router;
