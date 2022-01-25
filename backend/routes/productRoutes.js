import express from 'express';
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from '../controllers/productController.js';
import { protectRoute, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// routes handling requests from the client

router
  .route('/')
  .get(getProducts)
  .post(protectRoute, verifyAdmin, createProduct);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protectRoute, verifyAdmin, deleteProduct)
  .put(protectRoute, verifyAdmin, updateProduct);
router.route('/:id/reviews').post(protectRoute, createProductReview);

export default router;
