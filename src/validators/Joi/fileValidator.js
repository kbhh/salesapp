import Joi from "joi";
const validator = (schema) => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(",");
      res.status(422).json({ 
        error: true,
        statusCode: 422,
        message: message
      });
    }
  };
};

const imageValidator = (req, file, cb) => {
  if (file) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = "Only image files are allowed!";
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  } else {
    return cb(new Error("No File Provided"), false);
  }
};

module.exports = { 
  validator, 
  imageValidator 
};

// module.exports = imageValidator
// module.exports = validator
