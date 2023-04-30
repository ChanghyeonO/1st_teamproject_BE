const productService = require("../../service/productService.js");
const productDAO = require("../../dao/productdao/productDAO.js");
const AppError = require("../../misc/AppError.js");
const { PRODUCT_CATEGORY } = require("../../util/commonenum/PRODUCT_CATEGORY.js");
const { ObjectId } = require("mongodb");

jest.mock("../../dao/productdao/productDAO.js");
jest.mock("mongodb");

describe("getProducts", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    let testCount = 0;

    for (const CATEGORY in PRODUCT_CATEGORY) {
        testCount++;

    test(`CASE 1-${testCount}, getProducts success, category is ${CATEGORY}`, async () => {
        //given
        const selectedCategory = CATEGORY;
        const name = "킨토 캐스트 티포트 450ml";
        const price = 10000;
        const count = 10;
        const color = "stan";
        const specifications = "φ80 x H95 x W140mm / 450ml / 약 260g"
        const handlingPrecautions = "[포트] 내열유리재 / 사용구분 : 뜨거운물 사용가능, 전자레인지용";

        const nameAnother = "킨토 캐스트 티포트 250ml";
        const specificationsAnother = "φ40 x H60 x W90mm / 250ml / 약 130g"

        const offset = 0;
        const limit = 20;

        productDAO.findProductsByCategory.mockResolvedValue({
            category: selectedCategory,
            name,
            price,
            count,
            color,
            specifications,
            handlingPrecautions
        },
        {
            category: selectedCategory,
            nameAnother,
            price,
            count,
            color,
            specificationsAnother,
            handlingPrecautions
        });

        //when
        const result = await productService.getProducts(CATEGORY, offset, limit);
        expect(productDAO.findProductsByCategory).toHaveBeenCalledWith(CATEGORY, offset, limit);

        //then
        expect(result).toEqual({
            category: selectedCategory,
            name,
            price,
            count,
            color,
            specifications,
            handlingPrecautions
        },
        {
            category: selectedCategory,
            nameAnother,
            price,
            count,
            color,
            specificationsAnother,
            handlingPrecautions
        });
    });
  }

  test("CASE 2, Failed: category does not match CATEGORY-ENUM", async() => {
    //given
    const nullCategory = null;
    const offset = 0;
    const limit = 100;

    //when
    const result = productService.getProducts(nullCategory, offset, limit);

    //then
    expect(result).rejects.toThrow(AppError);
  });

  test("CASE 3, Failed, findProductsByCategory Error", async() => {
    //given
    const category = "TEA";
    const offset = 0;
    const limit = 20;

    productDAO.findProductsByCategory.mockRejectedValue(new AppError);

    //when
    const result = productService.getProducts(category, offset, limit);

    //then
    expect(result).rejects.toThrow(AppError);
  });
})

describe("addProduct", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("CASE 1, addProduct success", async () => {
         //given
        const selectedCategory = "TEA";
        const name = "킨토 캐스트 티포트 450ml";
        const price = 10000;
        const count = 10;
        const color = "stan";
        const specifications = "φ80 x H95 x W140mm / 450ml / 약 260g"
        const handlingPrecautions = "[포트] 내열유리재 / 사용구분 : 뜨거운물 사용가능, 전자레인지용";

        const nameAnother = "킨토 캐스트 티포트 250ml";
        const specificationsAnother = "φ40 x H60 x W90mm / 250ml / 약 130g"
        
        const productOne = {
            category: selectedCategory,
            name,
            price,
            count,
            color,
            specifications,
            handlingPrecautions
        };
        const productTwo = {
            category: selectedCategory,
            nameAnother,
            price,
            count,
            color,
            specificationsAnother,
            handlingPrecautions
        };

        productDAO.createMany.mockResolvedValue([productOne, productTwo]);

        //when 
        const result = await productService.addProduct([productOne, productTwo]);

        //then
        expect(productDAO.createMany).toHaveBeenCalledWith([productOne, productTwo]);
        expect(result).toEqual([productOne, productTwo]);
    });

    test("CASE 2, Failed, creatMany Error", async () => {
        //given
        const selectedCategory = "TEA";
        const name = "킨토 캐스트 티포트 450ml";
        const price = 10000;
        const count = 10;
        const color = "stan";
        const specifications = "φ80 x H95 x W140mm / 450ml / 약 260g"
        const handlingPrecautions = "[포트] 내열유리재 / 사용구분 : 뜨거운물 사용가능, 전자레인지용";
        const nameAnother = "킨토 캐스트 티포트 250ml";
        const specificationsAnother = "φ40 x H60 x W90mm / 250ml / 약 130g"
        const productOne = {
          category: selectedCategory,
          name,
          price,
          count,
          color,
          specifications,
          handlingPrecautions
        };
        const productTwo = {
          category: selectedCategory,
          nameAnother,
          price,
          count,
          color,
          specificationsAnother,
          handlingPrecautions
        };
        const error = new AppError("createManyError", 500, "Internal Server Error");
        productDAO.createMany.mockRejectedValue(error);
      
        //when
        const result = productService.addProduct([productOne, productTwo]);
      
        //then
        expect(productDAO.createMany).toHaveBeenCalledWith([productOne, productTwo]);
        await expect(result).rejects.toThrow(error);
      });
});

describe("detailProduct", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("CASE 1, detailProduct success", async () => {
        //given
        const id = new ObjectId("644541e576a3134955399e00");
        const selectedCategory = "TEA";
        const name = "킨토 캐스트 티포트 450ml";
        const price = 10000;
        const count = 10;
        const color = "stan";
        const specifications = "φ80 x H95 x W140mm / 450ml / 약 260g"
        const handlingPrecautions = "[포트] 내열유리재 / 사용구분 : 뜨거운물 사용가능, 전자레인지용";
        const product = {
            category: selectedCategory,
            name,
            price,
            count,
            color,
            specifications,
            handlingPrecautions
        };
        productDAO.findProductById.mockResolvedValue(product);

        //when
        const result = await productService.detailProduct(id);

        //then
        expect(productDAO.findProductById).toHaveBeenCalledWith(id);
        expect(result).toEqual(product);
    });


    test("CASE 2, Failed, findProductById Error", async () => {
        //given 
        const id = new ObjectId("644541e576a3134955399e00");
        const selectedCategory = "TEA";
        const name = "킨토 캐스트 티포트 450ml";
        const price = 10000;
        const count = 10;
        const color = "stan";
        const specifications = "φ80 x H95 x W140mm / 450ml / 약 260g"
        const handlingPrecautions = "[포트] 내열유리재 / 사용구분 : 뜨거운물 사용가능, 전자레인지용";
        const product = {
            category: selectedCategory,
            name,
            price,
            count,
            color,
            specifications,
            handlingPrecautions
        };
        const error = new AppError("findProductById", 500, "Internal Server Error");
        productDAO.findProductById.mockRejectedValue(error);

        //when
        const result = productService.detailProduct(id);

        //then
        expect(productDAO.findProductById).toHaveBeenCalledWith(id);
        expect(result).rejects.toThrow(error);
    });
})
