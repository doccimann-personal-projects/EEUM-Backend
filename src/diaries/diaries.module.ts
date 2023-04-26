import { Module } from '@nestjs/common';
import { DiariesService } from './application/service/diaries.service';
import { DiariesController } from './presentation/diaries.controller';
import { DiaryDao } from './infrastructure/diary.dao';

@Module({
  controllers: [DiariesController],
  providers: [
    DiariesService,
    {
      provide: 'DiaryRepository',
      useClass: DiaryDao,
    },
  ],
})
export class DiariesModule {}
