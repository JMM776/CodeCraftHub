/**
 * Configuration file to validate and load environment variables
 * Uses Joi for schema validation to ensure required variables are set
 */

const Joi = require('joi');

// Define the schema for environment variables
const envSchema = Joi.object({
  MONGO_URI: Joi.string().uri().required(),        // MongoDB connection URI
  JWT_SECRET: Joi.string().min(10).required(),    // Secret key for JWT signing
  PORT: Joi.number().default(3000)                 // Port to run the server on
}).unknown(true); // Allow other environment variables

// Validate process.env against the schema
const { error, value: envVars } = envSchema.validate(process.env);

// If validation fails, throw an error to prevent app from starting
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export the validated and defaulted environment variables
module.exports = {
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET
};