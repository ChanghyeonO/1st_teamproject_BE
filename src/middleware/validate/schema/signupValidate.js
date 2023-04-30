const Joi = require('joi');
const AppError = require("../../../misc/AppError.js");
const commonErrors = require("../../../misc/commonErrors.js");
const { ROLETYPE } = require("../../../util/commonenum/ROLETYPE.js");
const pino = require('pino')();

// userName은 3~15글자 제한, password는 12~30 제한
const signupSchema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().alphanum().max(30).min(12).required(), // fixed by feed back
    roleType: Joi.string().valid(...Object.keys(ROLETYPE)).required(),
    phoneNumber: Joi.string().pattern(new RegExp('^01[0-9]-[0-9]{4}-[0-9]{4}$')),
    mail: Joi.string().email(),
    address: Joi.string().pattern(new RegExp('^[a-zA-Z0-9가-힣\\s.,/#-]{1,200}$')),
});

const validateSignup = async (req, res, next) => {
    const result = signupSchema.validate(req.body);
    if (result.error) {
        pino.error(result.error.details);
        return next(new AppError(
          commonErrors.inputError,
          400,
          "Bad Request"
       ));
      }
  next();
}

module.exports = { signupSchema, validateSignup };