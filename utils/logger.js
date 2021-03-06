const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');
require('moment-timezone');

const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장
const { combine, printf } = winston.format;

moment.tz.setDefault('Asia/Seoul');
const timeStamp = () => moment().format('YYYY-MM-DD HH:mm:ss');

// Define log format
const logFormat = printf(info => {
    return `${timeStamp()} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const logger = winston.createLogger({
    format: combine(logFormat),
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 5, // 5일치 로그 파일 저장
            zippedArchive: false,
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
            filename: `%DATE%.error.log`,
            maxFiles: 5,
            zippedArchive: false,
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // 색깔 넣어서 출력
                winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
            ),
        }),
    );
}

module.exports = logger;
