const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

// Register new user
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return ApiResponse.error(res, 'Email already registered', 400);
    }

    const user = await userService.createUser({ email, password, name });
    return ApiResponse.success(res, { id: user._id, email: user.email, name: user.name }, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return ApiResponse.success(res, result, 'Login successful');
  } catch (err) {
    return ApiResponse.error(res, err.message, 401);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.findUserById(userId);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse.success(res, user, 'User profile fetched');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};