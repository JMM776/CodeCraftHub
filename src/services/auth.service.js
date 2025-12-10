const userService = require('./user.service');
const { generateToken } = require('../utils/token.utils');

const loginUser = async ({ email, password }) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });
  return { user: { id: user._id, email: user.email, name: user.name, role: user.role }, token };
};

module.exports = { loginUser };
