const mongoose = require("mongoose");
const PRODUCT_CATEGORY = require("../../../../util/commonenum/PRODUCT_CATEGORY.js");

// category는 Enum 으로 분류한다
// price 는 음수가 들어갈 수 없게 validate 한다.
// soldCount 는 팔린 제품의 양을 의미한다. 음수가 들어갈 수 없게 validate 한다.
// specifications, handlingPrecautions는 제외된다.
const soldProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userSchema",
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORY),
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: () => `가격은 음수일 수 없습니다.`,
      },
      required: true,
    },
    soldCount: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: () => `판매수량은 음수일 수 없습니다.`,
      },
      required: true,
    },
    color: {
      type: String,
    },
  },

  {
    timestamps: true,
    collection: "soldproducts", // 주의 collection 이름을 명시하지 않으면 아래 mongoose.model의 첫 번째 인자로 전달된 값을 복수형으로 해서 사용한다.
  }
);

module.exports = soldProductSchema;
