import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { ApmService } from 'nestjs-elastic-apm';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  constructor(private readonly apmService: ApmService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const routeName = context.getHandler().name;

    // 트랜잭션 이름 설정
    const transactionName = `HTTP ${request.method} ${routeName}`;

    const transaction = this.apmService.startTransaction(transactionName);

    return next.handle().pipe(tap(() => transaction.end()));
  }
}
