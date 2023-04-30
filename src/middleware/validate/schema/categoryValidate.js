const Joi = require('joi');
const pino = require('pino')();
const { PRODUCT_CATEGORY } = require('../../../util/commonenum/PRODUCT_CATEGORY');
const AppError = require("../../../misc/AppError.js");
const commonErrors = require("../../../misc/commonErrors.js");

const categorySchema = Joi.string().valid(...Object.values(PRODUCT_CATEGORY));

// req type = string
const validateCategory = async (req, res, next) => {
    const category = req.query.category;
    const result = categorySchema.validate(category);
    if (result.error) {
     pino.error(result.error.details);
     return next(new AppError(
       commonErrors.inputError,
       400,
       "Bad Request"
     ));
   }
  next();
};

module.exports = { validateCategory, categorySchema };