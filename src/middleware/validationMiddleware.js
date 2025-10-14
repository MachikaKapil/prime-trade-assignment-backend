// backend/src/middleware/validationMiddleware.js

/**
 * Middleware to validate request bodies using a Joi schema
 * or any other validation function you provide.
 * 
 * Example:
 * router.post('/', validate(taskSchema), createTask);
 */

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    next();
  };
};

module.exports = validate;
