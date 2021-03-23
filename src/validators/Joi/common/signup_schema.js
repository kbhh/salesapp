let Joi = require('joi')
const schemas = {
  idDeleteSchema: Joi.object().keys({
    id: Joi.string().error(() => 'Select the item to be deleted ')
  }),
};
export default schemas;
