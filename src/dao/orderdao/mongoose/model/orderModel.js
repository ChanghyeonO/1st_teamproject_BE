const mongoose = require("mongoose");
const orderSchema = require("../schema/orderSchema");

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
