import Order from '../models/orderModel.js';
import expressAsyncHandler from 'express-async-handler'; // handling errors

// @description Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = expressAsyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Товары в корзине отсутствуют');
  }

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

// @description Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Заказ не найден');
  }

  res.json(order);
});

export { addOrderItems, getOrderById };
