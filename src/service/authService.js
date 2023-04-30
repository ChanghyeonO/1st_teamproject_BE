const userDAO = require('../dao/userdao/userDAO.js');
const { hashPassword, comparePassword } = require('../util/encrypt/hashPassword.js');
const AppError = require('../misc/AppError.js');
const commonErrors = require('../misc/commonErrors');
const logger = require("../util/logger/logger.js");

const authService = {
  async createUser(userName, password, roleType, phoneNumber, mail, address) {
    const existingUser = await userDAO.findByUserName(userName);
    if (existingUser) {
      logger.info("User registration failed: User already exists");
      throw new AppError("User registration failed: User already exists", 400, "Bad request");
    }
    const hashed = await hashPassword(password).catch((error) => {
      logger.info(error);
      throw new AppError("hash password fail", 500, "Internal Server Error");
    });
    const newUser = await userDAO.create({ userName, password: hashed, roleType, phoneNumber, mail, address });
    return newUser;
  },

  async authenticateUser(userName, password) {
    const findUser = await userDAO.findByUserName(userName);
    const match = await comparePassword(password, findUser.password).catch((error) => {
      logger.info(error);
      throw new AppError("comeparePassword fail", 401, "Unauthorized");
    });
    if (!match) {
      logger.info("password do not match");
      throw new AppError("Incorrect login information", 401, "Unauthorized");
    }
    return;
  },
}
  
module.exports = authService;