const authService = require("../service/authService.js");
const { createAccessTokenWithLogin } = require('../middleware/jwt/jwtUtils.js');
const buildResponse = require("../util/response/buildResponse.js");
const logger = require("../util/logger/logger.js");

const authController = {
    async postSignup(req, res, next) {
      const { userName, password, roleType, phoneNumber, mail, address } = req.body;
      try {
        await authService.createUser(userName, password, roleType, phoneNumber, mail, address);
        return res.status(200).json(buildResponse(null, null));
      } catch (error) {
        next(error);
      }
    },
    
    async getAuthenticateStatus(req, res, next) {
      return res.status(200).json(buildResponse(null, null));
    },

    async postLogin(req, res, next) {
      const { userName, password } = req.body;
      try {
        await authService.authenticateUser(userName, password);
        const accessToken = await createAccessTokenWithLogin(userName);
        res.cookie('access_token', accessToken, { httpOnly: true });
        return res.status(200).json(buildResponse(null, null));
      } catch (error) {
        logger.info(error);
        next(error);
      }
    },

    async postLogout(req, res, next) {
      try {
        res.clearCookie("access_token");
        return res.status(200).json(buildResponse(null, null))
      } catch(error) {
        next(error);
      }
    }
};
  
module.exports = authController;
  