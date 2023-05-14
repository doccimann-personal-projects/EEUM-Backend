import { Module } from '@nestjs/common';
import { DiariesService } from './application/service/diaries.service';
import { DiariesController } from './presentation/controller/diaries.controller';
import { DiaryDao } from './infrastructure/diary.dao';
import { UsersModule } from 'src/users/users.module';
import { AwsModule } from '../aws/aws.module';
import { DiaryMessageProducer } from './application/producer/diary-message.producer';
import { DiaryValidator } from './application/validator/diary.validator';
import { CommonModule } from '../common/common.module';
import { ApmModule } from 'nestjs-elastic-apm';

@Module({
  imports: [UsersModule, AwsModule, CommonModule, ApmModule.register()],
  controllers: [DiariesController],
  providers: [
    DiariesService,
    {
      provide: 'DiaryRepository',
      useClass: DiaryDao,
    },
    DiaryMessageProducer,
    DiaryValidator,
  ],
  exports: [DiariesService],
})
export class DiariesModule {}
