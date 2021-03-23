let Joi = require("joi");
const schemas = {
  rolesSchema: Joi.array().items(
    Joi.object().keys({
      role: Joi.string()
        .required()
        .error(() => " Select the Role "),
    })
  ),
  authorizationSchema: Joi.object().keys({
    path: Joi.string()
      .required()
      .error(() => " path must be string "),
    category: Joi.string()
      .required()
      .error(() => " category must be string "),
    description: Joi.string().error(() => " description must be string "),
  }),
};
export default schemas;
