const Joi = require("joi");

module.exports = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.empty": "Username is required.",
        "string.min": "Username must be at least 3 characters.",
        "string.max": "Username cannot be longer than 100 characters."
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Email is required.",
        "string.email": "Email must be a valid email address."
      }),

    phone: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required.",
        "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number starting with 6-9."
      }),

    profession: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "Profession is required.",
        "string.min": "Profession must be at least 2 characters.",
        "string.max": "Profession cannot be longer than 100 characters."
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message });  // 👈 send actual Joi message in "message"
  }

  next();
};
