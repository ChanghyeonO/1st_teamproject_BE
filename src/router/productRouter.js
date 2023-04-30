const express = require("express");
const router = express.Router();
const passport = require("passport");
const productController = require("../controller/productController.js");
const { validateCategory } = require("../middleware/validate/schema/categoryValidate.js");
const { validateProducts, validateProductId } = require("../middleware/validate/schema/productValidate.js");

// URL = /product

// queryString 의 PRODUCT_CATEGORY를 분별하여 productArray를 return
router.get("/list", 
  validateCategory,
  productController.getProducts
);

router.get("/detail",
  validateProductId,
  productController.getOneProduct
);

// need admin verify
router.post("/add",
  passport.authenticate('http-only-cookie-use-admin', { session: false, failWithError: true }),
  validateProducts,
  productController.postProducts
);

module.exports = router;
