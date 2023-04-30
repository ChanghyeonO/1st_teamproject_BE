const createApp = require('../src/app.js');
const path = require('path');
const logger = require('../src/util/logger/logger.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const main = async () => {
    const appRunner = await createApp();

    // 어플리케이션상에서 catch못한 에러를 logging
    process.on("uncaughtException", (error) => {
        logger.error(`uncaughtException: ${error}`);
    });

    appRunner.start();
}

main();
