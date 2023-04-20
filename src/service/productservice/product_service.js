const productDAO = require('../../dao/productdao/productDAO');
const { PRODUCT_CATEGORY } = require('../../commonenum/product_category');

const productService = {
  async getProduct(category) {
    let products;
    switch (category) {
      case PRODUCT_CATEGORY.TEA:
        return products = await productDAO.findProductsByCategory('TEA');
      case PRODUCT_CATEGORY.MUG:
        return products = await productDAO.findProductsByCategory('MUG');
      case PRODUCT_CATEGORY.TUMBLER:
        return products = await productDAO.findProductsByCategory('TUMBLER');
      default:
        throw {
          name: "ValidationError",
          message: `Invalid, product Enum이 일치하지 않습니다 Error: ${category}`,
          code: "INVALID_CATEGORY",
        };
    }
  },
};

module.exports = productService;