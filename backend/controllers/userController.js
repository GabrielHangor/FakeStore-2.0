import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler'; // handling errors
import generateToken from '../utils/generateToken.js';

// @description Authenticate the user, get token
// @route POST /api/users/login
// @access Public
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Неверный логин или пароль');
  }
});

// @description Register a new user
// @route POST /api/users
// @access Public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Пользователь уже зарегистрирован');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Неверные данные пользователя');
  }
});

// @description Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Пользователь не найден');
  }
});

// @description Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Пользователь не найден');
  }
});

// @description Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @description Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Пользователь не найден');
  }

  await user.remove();
  res.json({ message: `Пользователь ${user.name} удален из базы данных` });
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
};
