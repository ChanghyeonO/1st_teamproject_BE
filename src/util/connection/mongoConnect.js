const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const connectToMongoDB = async () => {
  mongoose.connection.on('connecting', () => {
    console.log('Mongoose가 MongoDB 서버에 연결중입니다!');
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose가 MongoDB에 정상적으로 연결되었습니다.');
  });
  mongoose.connection.on('disconnecting', () => {
    console.log('Mongoose가 MongoDB와의 연결을 끊고 있습니다!');
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose가 MongoDB와의 연결을 정상적으로 끊었습니다.');
  });
  mongoose.connection.on('error', (error) => {
    console.log(`Mongoose에서 에러가 발생하였습니다: ${error}`);
  });

    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        minPoolSize: 4, // min pool size 설정
        maxPoolSize: 100, // max pool size 설정
      }
    );
};

module.exports = {
  mongoose,
  connectToMongoDB,
};
