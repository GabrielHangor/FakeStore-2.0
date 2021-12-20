import express from 'express';
import {
  getProductById,
  getProducts,
} from '../controllers/productController.js';

const router = express.Router();

// routes handling requests from the client

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;
