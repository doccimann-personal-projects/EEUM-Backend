import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentRequest } from '../dto/request/create-comment.request';
import { UpdateCommentDto } from '../dto/request/update-comment.request';
import { CommentRepository } from 'src/comments/domain/comment.repository';
import { User } from '@prisma/client';
import { CreateCommentResponse } from '../dto/response/create-comment.response';
import {
  ReadCommentResponse,
  commentInfo,
} from '../dto/response/read-comment.response';
import { BoardsService } from 'src/boards/application/service/boards.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    private readonly BoardsService: BoardsService,
  ) {}

  async create(
    createComment: CreateCommentRequest,
    user: User,
    boardId: number,
  ): Promise<CreateCommentResponse> {
    const comment = createComment.toCommentEntity(user.id, BigInt(boardId));
    const [createdComment, commentCounts] = await Promise.all([
      await this.commentRepository.create(comment),
      await this.commentRepository.commentCount(boardId),
    ]);
    this.BoardsService.increaseCommentCount(boardId, commentCounts);
    return CreateCommentResponse.fromEntity(createdComment);
  }

  async findComment(
    comments: Array<commentInfo>,
  ): Promise<ReadCommentResponse> {
    return ReadCommentResponse.fromEntity(comments);
  }
}
