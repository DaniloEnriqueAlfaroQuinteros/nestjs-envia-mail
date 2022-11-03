import { Injectable } from '@nestjs/common';
import winston = require('winston');
import { createLogger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Console } from 'winston/lib/winston/transports';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Injectable()
export class LoggerService {
  private logger: any;

  constructor(private readonly configService: ConfigService) {
    const consoleTransport = new Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(
          'v' + process.env.npm_package_version,
          {
            prettyPrint: true,
          },
        ),
      ),
    });

    const level: string = configService.get<string>('log.level') || 'info';
    this.logger = createLogger({
      level: level,
      transports: [consoleTransport],
    });
  }

  /**
   * Write a 'log' level log.
   */
  info(message: string, headers?: Record<string, any>) {
    // add your tailored logic here
    this.logger.info(message, this.buildMessage(headers));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, exception: Error, headers?: Record<string, any>) {
    // add your tailored logic here
    this.logger.error(message, this.buildMessage(headers, exception));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any) {
    // add your tailored logic here
    this.logger.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any) {
    // add your tailored logic here
    this.logger.debug(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any) {
    // add your tailored logic here
    this.logger.verbose(message);
  }

  private buildMessage(headers?: Record<string, any>, exception?: Error): any {
    if (headers && exception) {
      return {
        dominio: headers['x-saesa-dominio'],
        subdominio: headers['x-saesa-sub-dominio'],
        transactionid: headers['x-saesa-transaction-id'],
        exception: exception,
        stack: exception.stack,
      };
    } else if (headers) {
      return {
        dominio: headers['x-saesa-dominio'],
        subdominio: headers['x-saesa-sub-dominio'],
        transactionid: headers['x-saesa-transaction-id'],
      };
    } else if (exception) {
      return {
        exception: exception,
        stack: exception.stack,
      };
    }
    return {};
  }
}
