const Joi = require('joi');

const vendorRegisterSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one letter and one number',
      'any.required': 'Password is required'
    })
});

const vendorLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const firmSchema = Joi.object({
  firmname: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Firm name must be at least 3 characters',
      'any.required': 'Firm name is required'
    }),
  
  area: Joi.string()
    .required()
    .messages({
      'any.required': 'Area is required'
    }),
  
  category: Joi.string()
    .messages({
      'string.pattern.base': 'Invalid category format'
    }),
  
  region: Joi.string()
    .messages({
      'string.pattern.base': 'Invalid region format'
    }),
  
  offer: Joi.string()
    .optional()
});

const productSchema = Joi.object({
  productName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Product name must be at least 3 characters',
      'any.required': 'Product name is required'
    }),
  
  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),
  
  description: Joi.string()
    .optional(),
  
  category: Joi.string()
    .optional()
});

module.exports = {
  vendorRegisterSchema,
  vendorLoginSchema,
  firmSchema,
  productSchema
};
