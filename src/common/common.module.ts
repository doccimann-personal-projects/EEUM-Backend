import { Global, Module } from '@nestjs/common';
import { ApmModule, ApmService } from 'nestjs-elastic-apm';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { ApmInterceptor } from './interceptors/apm.interceptor';

@Global()
@Module({
  imports: [ApmModule.register()],
  providers: [ApmInterceptor, SuccessInterceptor, ApmService],
  exports: [ApmInterceptor, SuccessInterceptor],
})
export class CommonModule {}
