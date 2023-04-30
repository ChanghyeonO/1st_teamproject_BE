const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Seoul'); // 한국 시간으로 설정

const logsDir = path.join(__dirname, '../../../logs');
fs.existsSync(logsDir) || fs.mkdirSync(logsDir);

// 오늘 날짜로 파일명 생성
const logFileName = `access_${moment().format('YYYY-MM-DD')}.log`;
const logFile = path.join(logsDir, logFileName);
const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' });

module.exports = { accessLogStream, logFile };