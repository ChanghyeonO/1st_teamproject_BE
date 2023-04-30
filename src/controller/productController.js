const productService = require("../service/productService.js");
const buildResponse = require("../util/response/buildResponse.js");

const productController = {
  async getProducts(req, res, next) {
    const category = req.query.category; 
    const offset = parseInt(req.query.offset ? req.query.offset : 0);
    const limit = parseInt(req.query.limit ? req.query.limit : 100);
    try {
      const products = await productService.getProducts(category, offset, limit);
      return res.status(200).json(buildResponse(null, products));
    } catch (error) {
      next(error);
    }
  },

  async postProducts(req, res, next) {
    const products = req.body.products;
    try {
      await productService.addProduct(products);
      return res.status(200).json(buildResponse(null, null));
    } catch(error) {
      next(error);
    }
  },

  async getOneProduct(req, res, next) {
    const id = req.query.id;
    try {
      const product = await productService.detailProduct(id);
      return res.status(200).json(buildResponse(null, product));
    } catch (error) {
      next(error);
    }
  }
};
  
module.exports = productController;