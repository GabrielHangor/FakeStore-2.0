import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';

const router = express.Router();

// @description Fetching all products from the DB
// @route GET /api/products
// @access Public
router.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products);
  })
);

// @description Fetching single product from the DB
// @route GET /api/products/:id
// @access Public
router.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Товар не найден' });
    }
  })
);

export default router;
