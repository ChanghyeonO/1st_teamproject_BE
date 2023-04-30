const orderDAO = require('../dao/orderdao/orderDAO.js');
const userDAO = require('../dao/userdao/userDAO.js');
const productDAO = require('../dao/productdao/productDAO.js');

const orderService = {
  async createOrders(userName, products) {
    const user = await userDAO.findByUserName(userName);
    const userId = user._id;
    const orders = [];
    for (const item of products.orders) {
      const product = await productDAO.findProductByName(item.name);
      const productId = product._id;
      const count = item.count;
      orders.push({ productId, count })
    }
    await orderDAO.create({ userId, products: orders });
  },

}

module.exports =  orderService;
