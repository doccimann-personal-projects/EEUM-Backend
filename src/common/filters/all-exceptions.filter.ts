import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ResultFactory } from '../response/result.factory';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { winstonLogger } from "../logging/set-winston.logger";

/* 모든 예외를 잡아내는 클래스 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = winstonLogger;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json(ResultFactory.getFailureResult(exception.message));
  }
}
