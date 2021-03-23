let Joi = require("joi");
const schemas = {
  vehcileSchema: Joi.object().keys({
    carriageTypeId: Joi.string()
      .required()
      .error(() => " Select Carriage Type "),
    plateNumber: Joi.string()
      .required()
      .error(() => " Plate number must be a string "),
    sideNumber: Joi.string()
      .required()
      .error(() => " Side number must be a string "),
    expectedWeight: Joi.number()
      .required()
      .error(() => " Expected Weight must be a number "),
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
