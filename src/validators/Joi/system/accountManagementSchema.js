let Joi = require("joi");
const schemas = {
  canbeCreatedBySchema: Joi.array().items(
    Joi.object().keys({
      createdBy: Joi.string()
        .required()
        .error(() => " Select the Account Creater/s "),
    })
  ),
  canbeVerifiedBySchema: Joi.array().items(
    Joi.object().keys({
      verifiedBy: Joi.string()
        .required()
        .error(() => " Select the Verifier Creater/s "),
    })
  ),
  roleSchema: Joi.object().keys({
    role: Joi.string()
      .required()
      .error(() => " Select the Account Creater/s "),
    isSuper: Joi.boolean()
      .required()
      .error(() => " Select the supperiority level "),
    sameOffice: Joi.boolean()
      .required()
      .error(() => " Select the Account Creater/s "),
  }),
  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
};
export default schemas;
