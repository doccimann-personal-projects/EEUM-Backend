import { Module } from '@nestjs/common';
import { BoardsService } from './application/service/boards.service';
import { BoardsController } from './presentation/controller/boards.controller';
import { BoardDao } from './infrastructure/board.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { BoardValidator } from './application/validator/board-validator';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    {
      provide: 'BoardRepository',
      useClass: BoardDao,
    },
    BoardValidator,
  ],
  exports: [BoardsService],
})
export class BoardsModule {}
