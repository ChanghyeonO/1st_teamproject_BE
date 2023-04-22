// add libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path')
const passport = require('passport');
const AppError = require('./misc/AppError.js');
const commonErrors = require('./misc/commonErrors.js');
require('./util/auth/passport.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// variable
const productRouter = require('./router/product/product_router.js');
const authRouter = require('./router/auth/auth_router.js');
const orderRouter = require('./router/order/order_router');


// port
const app = express();
const PORT = process.env.PORT;


// use libararies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize()); // passport 미들웨어 등록


// router
app.use('/products', productRouter);
app.use('/auth', authRouter);
app.use(orderRouter);


// error 처리 핸들러
app.use((error, req, res, next) => {
  console.log(error);
  res.statusCode = error.httpCode ?? 500;
  res.json({
    error: error.message,
    data: null,
  });
});


// URL Not found Handler
app.use((req, res, next) => {
  next(
    new AppError(
      commonErrors.resourceNotFoundError,
      404,
      "Resource not found"
    )
  );
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});