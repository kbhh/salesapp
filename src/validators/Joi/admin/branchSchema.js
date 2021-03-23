let Joi = require("joi");
const schemas = {
  branchSchema: Joi.object().keys({
    name: Joi.string().error(() => " Name must be a string "),
    country: Joi.string().error(() => " Select country correctly "),
    region: Joi.string().error(() => "Select Region Correctly"),
    city: Joi.string().error(() => "City must be a string "),
    specificAdress: Joi.string().error(
      () => "Specific Address must be a string "
    ),
    managerName: Joi.string().error(() => "Contact Person must be a string "),
    managerPhoneNumber: Joi.string().error(
      () => "Contact Phone Number must be a string "
    ),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
};
export default schemas;
