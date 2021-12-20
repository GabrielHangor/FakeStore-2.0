import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler'; // handling errors

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
      token: null,
    });
  } else {
    res.status(401);
    throw new Error('Неверный логин или пароль');
  }
});

export { authUser };
