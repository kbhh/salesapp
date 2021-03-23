let Joi = require("joi");
const schemas = {
  vehcilecompaniesSchema: Joi.object().keys({
    companyName: Joi.string()
      .required()
      .error(() => " Company Name must be a string "),
  }),
  agreementSchema: Joi.object().keys({
    startDate: Joi.date()
      .required()
      .error(() => " Agreement Start Date must be a date "),
    endDate: Joi.date()
      .required()
      .error(() => " Agreement End Date must be a date "),
  }),

  VerifySchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
  }),
  VerifyAgreementSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    agreementId: Joi.string()
      .required()
      .error(() => "Select the agreement"),
  }),
  citySchema: Joi.object().keys({
    city: Joi.string()
      .required()
      .error(() => "City must be a string"),
    agreementId: Joi.string()
      .required()
      .error(() => "Select the agreement"),
  }),
  cityStatusSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "Status must be a string"),
    agreementId: Joi.string()
      .required()
      .error(() => "Select the agreement"),
    assignedId: Joi.string()
      .required()
      .error(() => "Select the assigned city"),
  }),
};
export default schemas;
