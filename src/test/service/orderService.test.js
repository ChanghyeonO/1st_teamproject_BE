const orderService = require("../../service/orderService.js");
const orderDAO = require("../../dao/orderdao/orderDAO.js");
const AppError = require("../../misc/AppError.js");
const productDAO = require("../../dao/productdao/productDAO.js");
const userDAO = require("../../dao/userdao/userDAO.js");
const { ObjectId } = require("mongodb")

jest.mock("../../dao/userdao/userDAO.js");
jest.mock("../../dao/orderdao/orderDAO.js");
jest.mock("../../dao/productdao/productDAO.js");
jest.mock("mongodb");

describe("createOrders", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("CASE 1, createOrders success", async () => {
        //given
        const userName = "TeTe";
        const userId = "644541e576a3134955399e00";
        const userRoleType = "USER";
        const userPhoneNumber = "010-9999-8888";
        const userMail = "TeTe@gmail.com";
        const userAddress = "서울시 영등포구";
        const productCategory = "TEA";
        const productName = "킨토 캐스트 티포트 450ml";
        const productId = "544541e576a3134955399e00";
        const productPrice = 10000;
        const productCount = 3;
        const productColor = "stan";
        const productSpecifications = "φ80 x H95 x W140mm / 450ml / 약 260g"
        const productHandlingPrecautions = "[포트] 내열유리재 / 사용구분 : 뜨거운물 사용가능, 전자레인지용";
        const productNameAnother = "킨토 캐스트 티포트 250ml";
        const productSpecificationsAnother = "φ40 x H60 x W90mm / 250ml / 약 130g";
        const productOne = {
            productCategory,
            name: productName,
            _id: productId,
            productPrice,
            productCount,
            productColor,
            productSpecifications,
            productHandlingPrecautions
        };
        const productTwo = {
            productCategory,
            name: productNameAnother,
            _id: productId,
            productPrice,
            productCount,
            productColor,
            productSpecificationsAnother,
            productHandlingPrecautions
        };
        const orders = [productOne, productTwo]
        const products = { orders: orders };
        userDAO.findByUserName.mockResolvedValue({
            userName,
            _id: userId,
            userRoleType,
            userMail,
            userAddress
        });
        for (const order of orders) {
            productDAO.findProductByName.mockReturnValueOnce(order);
        }
        orderDAO.create.mockResolvedValue();

        //when
        const result = await orderService.createOrders(userName, products);

        //then
        expect(result).toEqual();
    });
})