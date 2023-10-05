import winston, { createLogger, format, transports } from 'winston';
import httpContext from 'express-http-context';

const Logger:winston.Logger = createLogger({
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  transports: [new transports.Console()],
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message }) => {
      const requestId:string = httpContext.get('requestId');
      const requestIdText:string = requestId ? `[${requestId}] ` : '';
      return `[${timestamp}] ${requestIdText}${level}: ${message}`;
    })
  )
});

export function updateLoggerLevel():void {
  Logger.level = process.env.LOG_LEVEL;
}

export default Logger;