const orderService = require("../service/orderService.js");
const buildResponse = require("../util/response/buildResponse.js");

const orderController = {
  async postOrder(req, res, next) {
    const products = req.body;
    const userName = req.user.userName;
    try {
      await orderService.createOrders(userName, products);
      return res.status(200).json(buildResponse(null, null));
    } catch (error) {
      next(error);
    }
  },

  
}

module.exports = orderController;