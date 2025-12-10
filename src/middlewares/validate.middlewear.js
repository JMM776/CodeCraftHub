const ApiResponse = require('../utils/apiResponse');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return ApiResponse.error(res, 'Validation error', 400, error.details.map(d => d.message));
    }
    next();
  };
};

module.exports = validateRequest;
