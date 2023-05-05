import { Module } from '@nestjs/common';
import { DiariesService } from './application/service/diaries.service';
import { DiariesController } from './presentation/controller/diaries.controller';
import { DiaryDao } from './infrastructure/diary.dao';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DiariesController],
  providers: [
    DiariesService,
    {
      provide: 'DiaryRepository',
      useClass: DiaryDao,
    },
  ],
  exports: [DiariesService],
})
export class DiariesModule {}
