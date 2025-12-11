/**
 * Configuration for JWT authentication
 *
 * Exports the JWT secret and token expiration time.
 * Uses environment variable JWT_SECRET if set, otherwise falls back to a default value.
 *
 * Note: For security, always set JWT_SECRET in production environments.
 */

module.exports = {
    /**
     * Secret key used to sign JWT tokens.
     * Should be a long, random string to ensure security.
     */
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  
    /**
     * JWT token expiration time.
     * Defines how long a token is valid before requiring re-authentication.
     * Format follows the string format supported by jsonwebtoken library (e.g., '1h', '30m').
     */
    jwtExpiresIn: '1h'
  };