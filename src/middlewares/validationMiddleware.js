import Joi from 'joi'; 

const middleware = (schema, property) => { 
  return (req, res, next) => { 
    const { error } = Joi.validate(req[property], schema , {abortEarly: false}); 
    const valid = error == null;     
    if (valid) { 
      next(); 
    } 
    else { 
      const { details } = error; 
      const messages = details.map(i => i.message).join(',')
      res.json({ 
        error: true,
        message: messages
       }) 
    } 
  } 
} 
export default middleware;