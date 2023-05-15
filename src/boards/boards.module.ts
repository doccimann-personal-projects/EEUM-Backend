import { Module, forwardRef } from '@nestjs/common';
import { BoardsService } from './application/service/boards.service';
import { BoardsController } from './presentation/controller/boards.controller';
import { BoardDao } from './infrastructure/board.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { BoardValidator } from './application/validator/board-validator';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from 'src/comments/comments.module';
import { ApmModule } from 'nestjs-elastic-apm';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    forwardRef(() => CommentsModule),
    ApmModule.register(),
    CommonModule,
  ],
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
