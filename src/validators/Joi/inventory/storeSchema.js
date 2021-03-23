let Joi = require("joi");
const schemas = {
  storeSchema: Joi.object().keys({
    storeName: Joi.string().error(() => " Store Name must be a string "),
    country: Joi.string().error(() => " Select country correctly "),
    region: Joi.string().error(() => "Select Region Correctly"),
    city: Joi.string().error(() => "City must be a string "),
    specificAdress: Joi.string().error(
      () => "Specific Address must be a string "
    ),
  }),
  productSchema: Joi.object().keys({
    productType: Joi.string()
      .required()
      .error(() => " Product Type must be a string "),
    packageType: Joi.string()
      .required()
      .error(() => " Package Type must be a string "),
  }),
  depositSchema: Joi.object().keys({
    depositedAmount: Joi.number()
      .required()
      .error(() => " Product Type must be a string "),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
};
export default schemas;
