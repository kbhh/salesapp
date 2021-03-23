let Joi = require("joi");
const schemas = {
  carriageTypeSchema: Joi.object().keys({
    carriageType: Joi.string()
      .required()
      .error(() => " Carriage Type must be a string "),
  }),
  carriageSchema: Joi.object().keys({
    carriageCapacity: Joi.number()
      .required()
      .error(() => " Carriage Capacity must be a number "),
    packageType: Joi.string()
      .required()
      .error(() => " Package Type must be a string "),
  }),

  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
  VerifyCarriageSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    carriageId: Joi.string()
      .required()
      .error(() => "Select the carriage"),
  }),
};
export default schemas;
