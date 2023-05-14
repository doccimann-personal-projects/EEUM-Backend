import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCommentRequest } from '../dto/request/create-comment.request';
import { UpdateCommentDto } from '../dto/request/update-comment.request';
import { CommentRepository } from 'src/comments/domain/comment.repository';
import { User } from '@prisma/client';
import { CreateCommentResponse } from '../dto/response/create-comment.response';
import { BoardsService } from 'src/boards/application/service/boards.service';
import {
  DeleteCommentResponse,
  count,
} from '../dto/response/delete-comment.response';
import { UpdateCommentResponse } from '../dto/response/update-comment.response';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => BoardsService))
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
    this.BoardsService.updateCommentCount(boardId, commentCounts);
    return CreateCommentResponse.fromEntity(createdComment);
  }

  async update(
    updateComment: UpdateCommentDto,
    commentId: number,
  ): Promise<UpdateCommentResponse> {
    const comment = await this.commentRepository.updateComment(
      updateComment,
      commentId,
    );
    return UpdateCommentResponse.fromEntity(comment);
  }

  async deleteComment(
    boardId: number,
    commentId: number,
  ): Promise<DeleteCommentResponse> {
    const [deletedComment, commentCounts] = await Promise.all([
      await this.commentRepository.deleteComment(commentId),
      await this.commentRepository.commentCount(boardId),
    ]);
    this.BoardsService.updateCommentCount(boardId, commentCounts);
    return DeleteCommentResponse.fromEntity(deletedComment);
  }

  async deleteComments(boardId: number): Promise<count> {
    return this.commentRepository.deleteComments(boardId);
  }
}
