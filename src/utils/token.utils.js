const jwt = require('jsonwebtoken');

// Secret key for signing tokens (in production, use environment variables)
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Function to generate a JWT token with a payload and expiration
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Function to verify a JWT token and return the decoded payload
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null; // or throw error based on your error handling strategy
  }
}

module.exports = {
  generateToken,
  verifyToken,
};