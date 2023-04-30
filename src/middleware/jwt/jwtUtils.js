const jwt = require("jsonwebtoken");
const AppError = require('../../misc/AppError.js');
const commonErrors = require('../../misc/commonErrors.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// 로그인시에 AccessToken 발급
const createAccessTokenWithLogin = async (userName) => {
  const token = new Promise((resolve, reject) => {
    jwt.sign({ userName },  process.env.JWT_SECRET, { expiresIn: "2h" }, (err, token) => {
      if (err) reject(new AppError(commonErrors.authenticationError, 401, "Unauthorized"));
      resolve(token);
    });
  })
  return token;
};

module.exports = { createAccessTokenWithLogin };
