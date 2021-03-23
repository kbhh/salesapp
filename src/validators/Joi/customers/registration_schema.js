let Joi = require("joi");
const schemas = {
  accountSchema: Joi.object().keys({
    username: Joi.string()
      .required()
      .error(() => "Username field is required!"),
    password: Joi.string()
      .required()
      .error(() => "Password must be a string"),
    email: Joi.string()
      .email()
      .required()
      .error(() => "Email is not in the correct format"),
  }),
  addressSchema: Joi.object().keys({
    country: Joi.string().error(() => " Select country correctly "),
    region: Joi.string().error(() => "Select Region Correctly"),
    city: Joi.string().error(() => "City must be a string "),
    specificAdress: Joi.string().error(
      () => "Specific Address must be a string "
    ),
    contactPerson: Joi.string().error(() => "Contact Person must be a string "),
    contactPhoneNumber: Joi.string().error(
      () => "Contact Phone Number must be a string "
    ),
  }),
  registrationSchema: Joi.object().keys({
    class: Joi.string().error(() => " Company Class must be a string "),
    companyName: Joi.string().error(() => " Company Name must be a string "),
    licenseNumber: Joi.string().error(() => "License Number must be a string"),
    tinNumber: Joi.string().error(() => "Tin Number must be a string "),
    payment: Joi.string()
      .required()
      .error(() => "Select Payment Method"),
    priority: Joi.string()
      .required()
      .error(() => "Select Priority Level"),
  }),
  updateregistrationSchema: Joi.object().keys({
    class: Joi.string().error(() => " Company Class must be a string "),
    companyName: Joi.string().error(() => " Company Name must be a string "),
    licenseNumber: Joi.string().error(() => "License Number must be a string"),
    tinNumber: Joi.string().error(() => "Tin Number must be a string "),
  }),
  LoginSchema: Joi.object().keys({
    password: Joi.string()
      .required()
      .error(() => "Password must be a string"),
    username: Joi.string()
      .required()
      .error(() => "Email is not in the correct format"),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
  paymentMethodSchema: Joi.object().keys({
    method: Joi.string()
      .required()
      .error(() => "Select the Correct Payment Method"),
  }),
  prioritySchema: Joi.object().keys({
    priorityLevel: Joi.string()
      .required()
      .error(() => "Select the Correct Payment Method"),
  }),
};
export default schemas;
