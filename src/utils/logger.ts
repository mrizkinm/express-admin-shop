import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

// Format custom untuk log
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

// Transport untuk log umum (info, warn, dll.)
const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%-app.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  zippedArchive: true,
});

export const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), logFormat) }),
    fileRotateTransport
  ],
});