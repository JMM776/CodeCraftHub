const User = require('../models/user.model');

const createUser = async ({ email, password, name }) => {
  const user = new User({ email, password, name });
  return user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserById = async (id) => {
  return User.findById(id).select('-password'); // exclude password
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
