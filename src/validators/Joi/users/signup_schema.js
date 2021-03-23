let Joi = require("joi");
const schemas = {
  SignUpSchema: Joi.object().keys({
    fullName: Joi.string()
      .required()
      .error(() => "fullName field is required!"),
    mobileNumber: Joi.string()
      .required()
      .error(() => "mobile Number must be a string"),
    password: Joi.string()
      .required()
      .error(() => "Password must be a string"),
    username: Joi.string()
      .required()
      .error(() => "username is not in the correct format"),
    email: Joi.string()
      .email()
      .required()
      .error(() => "Email is not in the correct format"),
    gender: Joi.string()
      .required()
      .error(() => "Select Gender"),
    employeeId: Joi.string()
      .required()
      .error(() => "Employee is not in the correct format"),
    role: Joi.string()
      .required()
      .error(() => "Role must be a string"),
  }),
  adminSignUpSchema: Joi.object().keys({
    fullName: Joi.string()
      .required()
      .error(() => "fullName field is required!"),
    mobileNumber: Joi.string()
      .required()
      .error(() => "mobile Number must be a string"),
    department: Joi.string()
      .required()
      .error(() => "department field is required!"),
    division: Joi.string()
      .required()
      .error(() => "Division field is required!"),
    office: Joi.string().error(() => "Select the office!"),
    password: Joi.string()
      .required()
      .error(() => "Password must be a string"),
    username: Joi.string()
      .required()
      .error(() => "username is not in the correct format"),
    email: Joi.string()
      .email()
      .required()
      .error(() => "Email is not in the correct format"),
    gender: Joi.string()
      .required()
      .error(() => "Select Gender"),
    employeeId: Joi.string()
      .required()
      .error(() => "Employee is not in the correct format"),
    role: Joi.string()
      .required()
      .error(() => "Role must be a string"),
  }),
  updateSchema: Joi.object().keys({
    fullName: Joi.string()
      .required()
      .error(() => "fullName field is required!"),
    mobileNumber: Joi.string()
      .required()
      .error(() => "mobile Number must be a string"),
    employeeId: Joi.string().error(() => "User ID is String "),
  }),
  LoginSchema: Joi.object().keys({
    password: Joi.string()
      .required()
      .error(() => "Password must be a string"),
    username: Joi.string()
      .required()
      .error(() => "Username is not in the correct format"),
  }),
  changeRoleSchema: Joi.object().keys({
    role: Joi.string()
      .required()
      .error(() => "Role must be a string"),
  }),
  changeStatusSchema: Joi.object().keys({
    status: Joi.string()
      .required()
      .error(() => "status must be a string"),
  }),
  manualPasswordResetSchema: Joi.object().keys({
    password: Joi.string()
      .required()
      .error(() => "Password must be a string"),
  }),
};
export default schemas;
