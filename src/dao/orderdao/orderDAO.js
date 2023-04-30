const { Order } = require("./mongoose/model/index");
const logger = require("../../util/logger/logger.js");
const AppError = require("../../misc/AppError");
const commonErrors = require("../../misc/commonErrors");

const OrderDAO = {
  async create({ userId, products }) {
    try {
      const order = new Order({ userId: userId, products: products });
      await order.save();
      return order.toObject();
    } catch(error) {
      logger.info(error);
      throw new AppError(commonErrors.databaseError, 500, "Internal Server Error");
    }
  },

};

module.exports = OrderDAO;
