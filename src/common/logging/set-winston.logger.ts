import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import moment from 'moment-timezone';
import { utilities as nestWinstonUtilities } from 'nest-winston/dist/winston.utilities';
import { WinstonModule } from 'nest-winston';

const applicationName = process.env.APPLICATION_NAME;
const applicationEnvironment = process.env.NODE_ENV;

// Timestamp를 winston logger에 적용하는 format
const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format();
  }

  return info;
});

// 로그 파일 저장 옵션
const dailyOptions = {
  level: 'http', // http 이상의 로그만 기록
  datePattern: 'YYYY-MM-DD', // 날짜 포맷 지정
  dirname: __dirname + '/../../../logs', // 저장한 디렉토리 지정
  filename: `app.log.$DATE%`,
  maxFiles: 30, // 30일의 로그까지만 저장
  zippedArchive: true, // 로그가 쌓이면 압축
  colorize: false,
  handleExceptions: true,
  json: false,
};

const winstonConsoleTransport = new winston.transports.Console({
  level: applicationEnvironment === 'production' ? 'http' : 'silly',
  format:
    applicationEnvironment === 'production'
      ? winston.format.simple()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          nestWinstonUtilities.format.nestLike(applicationName, {
            prettyPrint: true,
          }),
        ),
});

export const winstonLogger = WinstonModule.createLogger({
  transports: [winstonConsoleTransport, new winstonDaily(dailyOptions)],
  format: winston.format.combine(
    appendTimestamp({ tz: 'Asia/Seoul' }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      const meta = stack ? { stack } : null;
      const trace = meta ? '' : JSON.stringify(meta);
      return `${timestamp} - ${level} [${process.pid}]: ${message}\n${trace}`;
    }),
  ),
});
