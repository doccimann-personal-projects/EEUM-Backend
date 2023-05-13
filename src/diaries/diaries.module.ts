import { Module } from '@nestjs/common';
import { DiariesService } from './application/service/diaries.service';
import { DiariesController } from './presentation/controller/diaries.controller';
import { DiaryDao } from './infrastructure/diary.dao';
import { UsersModule } from 'src/users/users.module';
import { AwsModule } from '../aws/aws.module';
import { DiaryMessageProducer } from './application/producer/diary-message.producer';
import { DiaryValidator } from './application/validator/diary.validator';

@Module({
  imports: [UsersModule, AwsModule],
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
