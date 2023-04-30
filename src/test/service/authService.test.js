const authService = require("../../service/authService.js");
const userDAO = require("../../dao/userdao/userDAO.js");
const AppError = require("../../misc/AppError.js");
const { hashPassword, comparePassword } = require("../../util/encrypt/hashPassword.js");

jest.mock("../../dao/userdao/userDAO.js");
jest.mock("../../util/encrypt/hashPassword.js");

describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("CASE 1, createUser success", async () => {
    //given
    const userName = "john123";
    const password = "abc123456789";
    const roleType = "user";
    const phoneNumber = "123-1234-5678";
    const mail = "john123@example.com";
    const address = "서울시 동작구";
    const hashedPassword = "mocked_hashed_password";

    userDAO.findByUserName.mockResolvedValue(null);
    userDAO.create.mockResolvedValue({
      userName,
      password: hashedPassword,
      roleType,
      phoneNumber,
      mail,
      address,
    });

    hashPassword.mockResolvedValue(hashedPassword);

    //when
    const result = await authService.createUser(
      userName,
      password,
      roleType,
      phoneNumber,
      mail,
      address
    );

    //then
    expect(userDAO.findByUserName).toHaveBeenCalledWith(userName);
    expect(hashPassword).toHaveBeenCalledWith(password);
    expect(userDAO.create).toHaveBeenCalledWith({
      userName,
      password: hashedPassword,
      roleType,
      phoneNumber,
      mail,
      address,
    });
    expect(result).toEqual({
      userName,
      password: hashedPassword,
      roleType,
      phoneNumber,
      mail,
      address,
    });
  });

  test("CASE 2, Failed, User already exists", async () => {
    //given
    const userName = "john123";
    const password = "abc123456789";
    const roleType = "user";
    const phoneNumber = "123-1234-5678";
    const mail = "john123@example.com";
    const address = "서울시 동작구";

    userDAO.findByUserName.mockResolvedValue({
      userName,
      password,
      roleType,
      phoneNumber,
      mail,
      address,
    });

    //when
    await expect(
      authService.createUser(
        userName,
        password,
        roleType,
        phoneNumber,
        mail,
        address
      )
    ).rejects.toThrow(AppError); // then
  });
});

describe("authenticateUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test("CASE 1, authenticateUser success", async () => {
        //given
        const userName = "john123";
        const password = "abc123456789";
        const roleType = "user";
        const phoneNumber = "123-1234-5678";
        const mail = "john123@example.com";
        const address = "서울시 동작구";
        const hashedPasswordForFind = "mocked_hashed_password_for_find";
        const hashedPasswordForCreate = "hashed_password_for_create";
      
        hashPassword.mockResolvedValue(hashedPasswordForCreate);
        comparePassword.mockResolvedValue(true);
      
        userDAO.findByUserName.mockResolvedValue({
          userName,
          password: hashedPasswordForFind,
          roleType,
          phoneNumber,
          mail,
          address,
        });
        userDAO.create.mockResolvedValue({
          userName,
          password: hashedPasswordForCreate,
          roleType,
          phoneNumber,
          mail,
          address,
        });
      
        //when
        const result = await authService.authenticateUser(userName, password);

        //then
        expect(userDAO.findByUserName).toHaveBeenCalledWith(userName);
        expect(comparePassword).toHaveBeenCalledWith(
          password,
          hashedPasswordForFind
        );  
        expect(result).toEqual(undefined);
    });

    test("CASE 2, Failed, comparePassword is not matched", async() => {
        //given
        const userName = "john123";
        const password = "abc123456789";
        const roleType = "user";
        const phoneNumber = "123-1234-5678";
        const mail = "john123@example.com";
        const address = "서울시 동작구";
        const mockErrorData = new AppError("Unauthorized");
    
        userDAO.findByUserName.mockResolvedValue({
            userName,
            password,
            roleType,
            phoneNumber,
            mail,
            address
        });
        comparePassword.mockRejectedValue(mockErrorData);
    
        //when
        await expect(authService.authenticateUser(userName, password)).rejects.toThrow(
            "Unauthorized" //then
          );
        expect(userDAO.findByUserName).toHaveBeenCalledWith(userName); //then
    });
});
