import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(readonly message: string, readonly statusCode: number) {
    super(message, statusCode);
  }
}
