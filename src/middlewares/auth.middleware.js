const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const { jwtSecret } = require('../config/auth.config');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Authorization token missing', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return ApiResponse.error(res, 'Invalid or expired token', 401);
  }
};

module.exports = authMiddleware;