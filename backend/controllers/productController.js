import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler'; // handling errors

// @description Fetching all products from the DB
// @route GET /api/products
// @access Public
const getProducts = expressAsyncHandler(async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword.replace(
            /[-[\]{}()*+?.,\\/^$|#\s]/g,
            '\\$&'
          ),
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @description Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = expressAsyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Новый товар',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Новый бренд',
    category: 'Новая категория',
    countInStock: 0,
    numReviews: 0,
    description: 'Новое описание',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @description Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = expressAsyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Товар не найден');
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @description Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = expressAsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Товар не найден');
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Пользователь уже оставил отзыв под данным товаром');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, review) => review.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Отзыв добавлен' });
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
