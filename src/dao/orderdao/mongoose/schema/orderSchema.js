const mongoose = require("mongoose");

// order은 userId를 참조한다.
// products는 productDAO의 수량을 참조한다.
// count 는 제품의 구매 갯수를 의미한다. price는 각 제품의 가격을 의미한다.
// totalPrice는 제품들의 총 price이다.
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userSchema",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productSchema",
          required: true,
        },
        count: {
          type: Number,
          required: true,
          validate: {
            validator: function (v) {
              return v >= 0;
            },
            message: () => `수량은 음수일 수 없습니다.`,
          },
        },
      },
    ],
  },

  {
    timestamps: true,
    collection: "orders", // 주의 collection 이름을 명시하지 않으면 아래 mongoose.model의 첫 번째 인자로 전달된 값을 복수형으로 해서 사용한다.
  }
);

module.exports = orderSchema;
