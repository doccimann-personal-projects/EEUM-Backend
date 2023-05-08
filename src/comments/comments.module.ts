import { Module } from '@nestjs/common';
import { CommentsService } from './application/service/comments.service';
import { CommentsController } from './presentation/controller/comments.controller';
import { UsersModule } from 'src/users/users.module';
import { CommentDao } from './infrastructure/comment.dao';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  imports: [UsersModule, BoardsModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: 'CommentRepository',
      useClass: CommentDao,
    },
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
