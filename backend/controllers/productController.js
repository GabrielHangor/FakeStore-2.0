import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler'; // handling errors

// @description Fetching all products from the DB
// @route GET /api/products
// @access Public
const getProducts = expressAsyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @description Fetching single product from the DB
// @route GET /api/products/:id
// @access Public
const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Товар не найден');
  }
});

// @description Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Товар не найден');
  }

  await product.remove();
  res.json({ message: 'Товар удален из базы данных' });
});

export { getProductById, getProducts, deleteProduct };
