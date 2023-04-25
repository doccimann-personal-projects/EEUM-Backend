import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  PaginatedSuccessResult,
  SingleSuccessResult,
} from '../response/success-response.format';
import { Request, Response } from 'express';
import { ResultFactory } from '../response/result.factory';

/* 성공 응답을 내보내기 전에 데이터 포맷을 맞추고 로깅하는 인터셉터 */
@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data) => this.bundleResponse(data, context)));
  }

  // 응답을 번들링해서 반환해주는 메소드
  private bundleResponse(
    data: any,
    ctx: ExecutionContext,
  ): SingleSuccessResult<any> | PaginatedSuccessResult<any> {
    const host = ctx.switchToHttp();
    const request = host.getRequest<Request>();
    const response = host.getResponse<Response>();

    // 데이터가 페이지네이션 된 결과인 경우에는 statusCode만 분기하고 그대로 반환
    if (data instanceof PaginatedSuccessResult) {
      response.statusCode = data.items.length !== 0 ? 200 : 204;
      this.logSuccess(request, response);
      return data;
    }

    // 이외의 경우에는 단일 데이터 결과이기 때문에 null or undefined 체크만 하고 응답 형태로 가공하여 반환
    response.statusCode = data ? 200 : 204;
    this.logSuccess(request, response);
    return ResultFactory.getSingleSuccessResult(data);
  }

  // 성공 로그를 찍는 메소드
  private logSuccess(request: Request, response: Response): void {
    const logMessage = `[${request.method}] ${response.statusCode} ${request.originalUrl} ${request.ip}`;

    Logger.log(logMessage);
  }
}
