import Joi from "joi"

const validationSchema = { 
  userAccounts: Joi.object().keys({ 
    orgName: Joi.string().required().error(() => 'Select organization'),
    fullName: Joi.string().required().error(() => 'Full Name must be a string'),
    email: Joi.string().email().required().error(() => 'Invalid email address'),
    username: Joi.string().required().error(() => 'Username must be string'),    
    password: Joi.string().required().error(() => 'Password must be a string'),
    phoneNumber: Joi.string().required().min(9).max(16).error(() => 'Phone number must be a string in the format +(251)91*******'),
    itemid: Joi.string().allow('').optional(),
    role : Joi.string().required().error(() => 'Select Role'),
    status: Joi.string().required().error(() => 'Status must be a string '),
  }).options({abortEarly : false}) 
}; 
module.exports = validationSchema;