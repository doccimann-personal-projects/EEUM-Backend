import { Module } from '@nestjs/common';
import { DiariesService } from './application/service/diaries.service';
import { DiariesController } from './presentation/controller/diaries.controller';
import { DiaryDao } from './infrastructure/diary.dao';
import { UsersModule } from 'src/users/users.module';
import { MessagingModule } from '../messaging/messaging.module';
import { DiaryMessageProducer } from './application/producer/diary-message.producer';

@Module({
  imports: [UsersModule, MessagingModule],
  controllers: [DiariesController],
  providers: [
    DiariesService,
    {
      provide: 'DiaryRepository',
      useClass: DiaryDao,
    },
    DiaryMessageProducer,
  ],
  exports: [DiariesService],
})
export class DiariesModule {}
