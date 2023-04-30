const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../dao/orderdao/mongoose/model/orderModel.js');
const {
  Product,
} = require('../dao/productdao/mongoose/model/productModel.js');
const orderController = require('../controller/orderController.js');
const SoldProduct = require('../dao/soldproductdao/mongoose/model/soldproductModel.js');
const UserDAO = require('../dao/userdao/userDAO.js');
const {
  validateOrder,
} = require('../middleware/validate/schema/orderValidate.js');
const User = require('../dao/userdao/mongoose/model/userModel.js');
const buildResponse = require('../util/response/buildResponse.js');

// /order/
router.post(
  '/',
  passport.authenticate('http-only-cookie-use-user', {
    session: false,
    failWithError: true,
  }),
  validateOrder,
  orderController.postOrder
);

// user order
router.get(
  '/orders',
  passport.authenticate('http-only-cookie-use-user', {
    session: false,
    failWithError: true,
  }),
  async (req, res) => {
    const userName = req.user.userName;
    const user = await UserDAO.findByUserName(userName);
    const userId = user._id;
    const me = await User.find({ userName }).select(
      'userName phoneNumber mail address createdAt'
    );

    const order = await Order.find({ userId });

    if (order.length < 1) {
      total = {
        user: me,
        order: [],
      };
    } else {
      const products = order
        .map((v) => {
          return v.products.map((v) => {
            return v.productId;
          });
        })
        .filter((v) => {
          if (v.length !== 0) return v;
        })
        .reduce(function (acc, cur) {
          return acc.concat(cur);
        });

      const allProducts = await Promise.all(
        products.map(async (v) => {
          const r = await Product.findOne({ _id: v });
          return r;
        })
      );

      total = {
        user: me,
        order: allProducts,
        createdAt: order[0].createdAt,
      };
    }

    return res.status(200).json(buildResponse(null, total));
  }
);

module.exports = router;
