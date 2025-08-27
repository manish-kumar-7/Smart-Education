const Joi = require("joi");

module.exports = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
  .pattern(/^[6-9]\d{9}$/) 
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit Indian mobile number starting with 6-9.'
  }),

    profession: Joi.string().min(2).max(100).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }

  next();
};
