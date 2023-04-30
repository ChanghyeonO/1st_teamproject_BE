const Joi = require('joi');
const logger = require("../../../util/logger/logger.js");
const AppError = require("../../../misc/AppError.js");
const commonErrors = require("../../../misc/commonErrors.js");

const orderSchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9가-힣\\s.,/#-]{1,500}$')),
    count: Joi.number().integer().positive().required(),
});

// req type = string
const validateOrder = async (req, res, next) => {
  const orders = req.body.orders;
  for (let order of orders) {
    const result = orderSchema.validate(order);
    if (result.error) {
      logger.info(result.error.details);
      return next(new AppError(
        commonErrors.inputError,
        400,
        "Bad Request"
      ));
    }
  }
  next();
};

module.exports = { validateOrder };