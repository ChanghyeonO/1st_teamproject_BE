const { Product } = require("./mongoose/model/productModel");
const logger = require("../../util/logger/logger.js");
const AppError = require("../../misc/AppError");
const commonErrors = require("../../misc/commonErrors");

const productDAO = {
  async create({ category, name, price, count, color, specifications, handlingPrecautions }) {
    try {
      const product = new Product({ category, name, price, count, color, specifications, handlingPrecautions });
      await product.save();
      return product.toObject();
    } catch (error) {
      logger.info(error);
      throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
    }
  },

  async createMany(products) {
    const results = await Product.insertMany(products).catch((error) => {
      logger.info(error);
      throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
    });
    return results.map(result => result.toObject());
  },

  async findProductsByCategory(category, offset, limit) {
    const products = await Product.find({ category }, { _id: 1, category: 1, name: 1, price: 1, count: 1, updatedAt:1, createdAt: 1}, { count: { $gte: 1 }})
                                  .skip(offset)
                                  .limit(limit)
                                  .exec()
                                  .catch((error) => {
                                    logger.info(error);
                                    throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
                                  });
    return products;
  },

  async findProductById(id) {
    const product = await Product.findById(id).lean().select("-__v").catch((error) => {
      logger.info(error);
      throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
    });
    return product;
  },

  async findProductByIdAndDelete(id) {
    const product = await Product.findByIdAndRemove(id).catch((error) => {
      logger.info(error);
      throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
    });
    return product;
  },

  async findProductByName(productName) {
    const product = await Product.findOne({ name: productName }).catch((error) => {
      logger.info(error);
      throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
    });
    return product;   
  },


};

module.exports = productDAO;