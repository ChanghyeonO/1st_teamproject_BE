const { User } = require("./mongoose/model/index");
const logger = require("../../util/logger/logger.js");
const AppError = require("../../misc/AppError");
const commonErrors = require("../../misc/commonErrors");

const UserDAO = {
  async create({ userName, password, roleType, phoneNumber, mail, address }) {
    try {
      const user = new User({ userName, password, roleType, phoneNumber, mail, address });
      await user.save()
      return user.toObject();
    } catch (error) {
      logger.info(error);
      throw new AppError(`Failed to create user: ${error.message}`, 500, "Internal Server Error");
    }
  },

  async findByUserName(userName) {
    const user = await User.findOne({ userName }).lean().catch((error) => {
      logger.info(error);
      throw new AppError(`Failed to findOne userName: ${error.message}`, 500, "Internal Server Error");
    });
    return user;
  }
};

module.exports = UserDAO;
