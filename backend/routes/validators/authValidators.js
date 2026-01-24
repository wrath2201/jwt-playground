const Joi = require('joi');

// REGISTER
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
  .min(8)
  .max(72)
  .pattern(/^(?=.*[A-Za-z])(?=.*[^A-Za-z]).+$/)
  .required()
  .message({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 72 characters',
    'string.pattern.base':
        'Password must contain at least one letter and one non-letter character',
  }),
});

// LOGIN
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// REFRESH TOKEN (body-based, if still needed anywhere)
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
};
