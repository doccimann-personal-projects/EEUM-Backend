import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ReadUserResponse } from '../../application/dto/response/read-user.response';

/* Jwt Guard를 타고 난 뒤 인증 결과를 반환하는데 사용하는 데코레이터 */
export const JwtAuthResult = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.user as ReadUserResponse;
  },
);
