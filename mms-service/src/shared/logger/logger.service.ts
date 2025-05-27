import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }), // Log stack trace if error
      winston.format.json(),
    );

    const transportFile = new winston.transports.DailyRotateFile({
      filename: 'storage/logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
      level: 'error',
    });

    const transportConsole = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      transports: [transportConsole, transportFile],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(
      typeof message === 'string' ? message : JSON.stringify(message),
      { context },
    );
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(
      typeof message === 'string' ? message : JSON.stringify(message),
      {
        context,
        stack: trace,
      },
    );
  }

  warn(message: any, context?: string) {
    this.logger.warn(
      typeof message === 'string' ? message : JSON.stringify(message),
      { context },
    );
  }

  debug?(message: any, context?: string) {
    this.logger.debug?.(
      typeof message === 'string' ? message : JSON.stringify(message),
      { context },
    );
  }

  verbose?(message: any, context?: string) {
    this.logger.verbose?.(
      typeof message === 'string' ? message : JSON.stringify(message),
      { context },
    );
  }
}
