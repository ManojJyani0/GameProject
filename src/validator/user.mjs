import Joi from 'joi'

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  mobile: Joi.number().required().messages({
    'any.required': 'Mobile number is required'
  }),
  password: Joi.string().min(8).max(20).required(),
  confirmPassword: Joi.string().equal(Joi.ref('password')).required(),
  agreement:Joi.boolean().valid(true)
})

export const loginSchema = Joi.object({
  mobile: Joi.string().regex(/^[1-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please provide a valid 10-digit mobile number',
    'any.required': 'Mobile number is required'
  }),
  password: Joi.string().min(8).max(20).required(),
})

export const OTPValidation = Joi.object({
  sid:Joi.string().required(),
  OTP:Joi.string().required().max(6),
})