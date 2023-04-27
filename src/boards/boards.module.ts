import { Module } from '@nestjs/common';
import { BoardsService } from './application/service/boards.service';
import { BoardsController } from './presentation/controller/boards.controller';
import { BoardDao } from './infrastructure/board.dao';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    {
      provide: 'BoardRepository',
      useClass: BoardDao,
    },
  ],
  exports: [BoardsService],
})
export class BoardsModule {}
