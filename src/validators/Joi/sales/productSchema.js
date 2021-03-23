let Joi = require("joi");
const schemas = {
  branchSchema: Joi.object().keys({
    productType: Joi.string()
      .required()
      .error(() => " Product Type must be a string "),
    description: Joi.string().error(
      () => " Description Type must be a string "
    ),
  }),
  priceSchema: Joi.object().keys({
    store: Joi.string()
      .required()
      .error(() => " Store must be a string "),
    packageType: Joi.string()
      .required()
      .error(() => " Package Type must be a string "),
    unitPrice: Joi.number()
      .required()
      .error(() => " Price Type must be a number "),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
};
export default schemas;
