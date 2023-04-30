const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const User = require("../../dao/userdao/mongoose/model/userModel");
const path = require('path');
const logger = require("../../util/logger/logger.js");
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })

const cookieExtractor = function(req) {
  const token = req?.cookies?.['access_token'];  // 하나라도 없으면 undefined가 된다. => 연속 ?구문 feedback
  return token 
};

passport.use(
  'http-only-cookie',
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true // req를 콜백 함수에 전달하도록 추가
    },
    function (req, jwtPayload, done) {
      if (Date.now() > jwtPayload.expires) {
        return done(null, false);
      }
      return done(null, true);
    }
  )
);

passport.use(
  'http-only-cookie-use-user',
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true // req를 콜백 함수에 전달하도록 추가
    },
    function (req, jwtPayload, done) // req 인수 추가
    {
      // JWT에서 추출한 정보를 이용하여 사용자 조회하기
      User.findOne({ userName: jwtPayload.userName })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, false);
      });
    }
  )
);

passport.use(
  'http-only-cookie-use-admin',
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true // req를 콜백 함수에 전달하도록 추가
    },
    function (req, jwtPayload, done) // req 인수 추가
    {
      // JWT에서 추출한 정보를 이용하여 사용자 조회하기
      User.findOne({ userName: jwtPayload.userName })
        .then((user) => {
          if (user && user.roleType === 'ADMIN') { // role이 ADMIN인 경우만 허용
            logger.info("Admin user accessed API");
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, false);
      });
    }
  )
);

module.exports = passport;