const Joi = require('joi');

// Validate required environment variables
const envSchema = Joi.object({
  MONGO_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(10).required(),
  PORT: Joi.number().default(3000),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET,
};
