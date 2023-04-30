const mongoose = require("mongoose");
const soldProductSchema = require("../schema/soldproductSchema");

const SoldProduct = mongoose.model("soldProduct", soldProductSchema);

module.exports = { SoldProduct };
