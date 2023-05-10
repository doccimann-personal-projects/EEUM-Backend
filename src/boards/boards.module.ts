import { Module, forwardRef } from '@nestjs/common';
import { BoardsService } from './application/service/boards.service';
import { BoardsController } from './presentation/controller/boards.controller';
import { BoardDao } from './infrastructure/board.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { BoardValidator } from './application/validator/board-validator';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [PrismaModule, UsersModule, forwardRef(() => CommentsModule)],
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
