const mongoose = require("mongoose");
const PRODUCT_CATEGORY = require("../../../../util/commonenum/PRODUCT_CATEGORY.js");

// category는 Enum 으로 분류한다
// price 는 음수가 들어갈 수 없게 validate 한다.
// count 는 제품의 남은 수량을 의미한다. 구매시 차감된다.
// specifications, handlingPrecautions가 추가된다.
const productSchema = new mongoose.Schema(
  {
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
    count: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: () => `수량은 음수일 수 없습니다.`,
      },
      required: true,
    },
    color: {
      type: String,
    },
    specifications: {
      type: String,
    },
    handlingPrecautions: {
      type: String,
    },
  },

  {
    timestamps: true,
    collection: "products", // 주의 collection 이름을 명시하지 않으면 아래 mongoose.model의 첫 번째 인자로 전달된 값을 복수형으로 해서 사용한다.
  }
);

module.exports = productSchema;
