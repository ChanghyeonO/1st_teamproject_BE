const express = require('express');
const http = require("http");
const { connectToMongoDB } = require("./util/connection/mongoConnect.js");
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path')
const passport = require('passport');
const AppError = require('./misc/AppError.js');
const commonErrors = require('./misc/commonErrors.js');
const morgan = require('morgan');
const { accessLogStream } = require("./util/logger/accessLogStream.js");
const logger = require("./util/logger/logger.js");
const moment = require('moment-timezone');  
require('./middleware/passport/passport.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
morgan.token('date', () => moment().tz('Asia/Seoul').format('DD/MMM/YYYY:HH:mm:ss ZZ'));
const productRouter = require('./router/productRouter.js');
const authRouter = require('./router/authRouter.js');
const orderRouter = require('./router/orderRouter');
const PORT = process.env.PORT;

const createApp = async () => {
  // DB Connect
  await connectToMongoDB();

  logger.info("Express server Initializing");
  const expressApp = express();

  // express settings
  expressApp.set("trust proxy", 1);
  expressApp.use(bodyParser.urlencoded({ extended: true }));
  expressApp.use(bodyParser.json());
  expressApp.use(cors({
    origin: true,
    credentials: true,
  }));
  expressApp.use(cookieParser());
  expressApp.use(passport.initialize()); // passport 미들웨어 등록
  expressApp.use(morgan('combined', { stream: accessLogStream, immediate: true}, logger )); // morgan을 이용한 일별 로깅

  // router
  expressApp.use('/api/product', productRouter);
  expressApp.use('/api/auth', authRouter);
  expressApp.use('/api/order', orderRouter);

  // Health check API
  expressApp.get("/health", (req, res, next) => {
    res.json({
      status: "OK",
    });
  });
  
  // Set URL Not found Handler
  expressApp.use((req, res, next) => {
    next(
      new AppError(
        commonErrors.resourceNotFoundError,
        404,
        "Resource not found"
      )
    );
  });

  // Set Error Handler
  expressApp.use((error, req, res, next) => {
    logger.info(error);
    res.statusCode = error.httpCode ?? 500;
    res.json({
      error: error.message,
      data: null,
    });
  });

  const server = http.createServer(expressApp);

  const app = {
    start() {
      server.listen(PORT);
      server.on("listening", () => {
        logger.info(`Server is listening on port ${PORT}`);
      })
    },
    stop() {
      logger.info("Stopping server operations");
      this.isShuttingDown = true;
      return new Promise((resolve, reject) => {
        server.close(async (error) => {
          if (error !== undefined) {
            logger.info(`- Failed to stop the HTTP server: ${error.message}`);
            reject(error);
          }
          await loader.disconnectMongoDB();
          this.isShuttingDown = false;
          resolve();
        });
      });
    },
    isShuttingDown: false, // 서버가 중지하는 상태인지를 확인하는 플래그
    _app: expressApp,
  };
  return app;
}

module.exports = createApp;