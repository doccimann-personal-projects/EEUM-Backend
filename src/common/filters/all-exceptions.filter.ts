import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResultFactory } from '../response/result.factory';

/* 모든 예외를 잡아내는 클래스 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(status)
      .json(ResultFactory.getFailureResult(exception.message));
  }
}
