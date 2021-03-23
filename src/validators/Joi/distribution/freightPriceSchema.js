let Joi = require("joi");
const schemas = {
  citySchema: Joi.object().keys({
    city: Joi.string()
      .required()
      .error(() => " City must be a string "),
    store: Joi.string()
      .required()
      .error(() => " Store must be a string "),
  }),
  priceSchema: Joi.object().keys({
    freightId: Joi.string()
      .required()
      .error(() => " Select the freight city "),
    carriageId: Joi.string()
      .required()
      .error(() => " Select the Carriage"),
    // carriageType: Joi.string()
    //   .required()
    //   .error(() => " Carriage Type must be a string "),
    // packageType: Joi.string()
    //   .required()
    //   .error(() => " Package Type must be a string "),
    price: Joi.number()
      .required()
      .error(() => " Price Type must be a number "),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
  VerifyCitySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    freightId: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
  VerifyPriceSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    priceId: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
};
export default schemas;
