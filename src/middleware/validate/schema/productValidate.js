const Joi = require('joi');
const logger = require("../../../util/logger/logger.js");
const { PRODUCT_CATEGORY } = require('../../../util/commonenum/PRODUCT_CATEGORY');
const AppError = require("../../../misc/AppError.js");
const commonErrors = require("../../../misc/commonErrors.js");
const { ObjectId } = require("mongodb");

const productIdSchema = Joi.object({
    id: Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.message('Invalid ObjectId');
      }
      return value;
    }, 'MongoDB ObjectId').required()
  }
);

const productsSchema = Joi.object({
    category: Joi.string().valid(...Object.values(PRODUCT_CATEGORY)),
    name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9가-힣\\s.,/#-]{1,500}$')).required(),
    price: Joi.string().pattern(new RegExp('^[0-9]{1,10}$')).required(),
    count: Joi.string().pattern(new RegExp('^[0-9]{1,10}$')).required(),
    color: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{1,100}$')),
    specifications: Joi.string().pattern(new RegExp('^[a-zA-Z0-9가-힣\\s.,/#-]{1,5000}$')),
    handlingPrecautions: Joi.string().pattern(new RegExp('^[a-zA-Z0-9가-힣\\s.,/#-]{1,5000}$')),
});

// req type = string
const validateProducts = async (req, res, next) => {
  const products = req.body.products;
  for (let product of products) {
    const result = productsSchema.validate(product);
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

const validateProductId = async (req, res, next) => {
  const productId = { id: req.query.id };
  const result = productIdSchema.validate(productId);
  if (result.error) {
    logger.info(result.error.details);
    return next(new AppError(
      commonErrors.inputError,
      400,
      "Bad Request"
    ));
  }
  next();
}

module.exports = { validateProducts, validateProductId };