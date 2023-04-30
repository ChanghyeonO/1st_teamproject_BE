const productDAO = require('../dao/productdao/productDAO');
const { PRODUCT_CATEGORY } = require('../util/commonenum/PRODUCT_CATEGORY');
const AppError = require('../misc/AppError');
const logger = require("../util/logger/logger.js");

const productService = {
  async getProducts(category, offset, limit) {
    switch (category) {
      case PRODUCT_CATEGORY.TEA:
        return await productDAO.findProductsByCategory('TEA', offset, limit);
      case PRODUCT_CATEGORY.MUG:
        return await productDAO.findProductsByCategory('MUG', offset, limit);
      case PRODUCT_CATEGORY.TUMBLER:
        return await productDAO.findProductsByCategory('TUMBLER', offset, limit);
      default:
        logger.info("category ENUM is not matched");
        throw new AppError("Wrong category Error", 400, "Bad request");
    }
  },

  async addProduct(products) {
    const createProducts = await productDAO.createMany(products);
    return createProducts;
  },

  async detailProduct(id) {
    const product = await productDAO.findProductById(id);
    return product;
  },
}

module.exports = productService;