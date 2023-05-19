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
import { Mutex } from 'async-mutex';

@Injectable()
export class CommentsService {
  private readonly mutex: Mutex = new Mutex();

  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => BoardsService))
    private readonly boardsService: BoardsService,
  ) {}

  async create(
    createComment: CreateCommentRequest,
    user: User,
    boardId: number,
  ): Promise<CreateCommentResponse> {
    const comment = createComment.toCommentEntity(
      user.id,
      user.nickname,
      BigInt(boardId),
    );
    const createdComment = await this.commentRepository.create(comment);

    const release = await this.mutex.acquire();

    // 댓글 개수 증가 부분은 mutex로 처리
    try {
      // board의 댓글 개수 증가
      await this.boardsService.increaseCommentCountTransaction(boardId);
      return CreateCommentResponse.fromEntity(createdComment);
    } finally {
      release();
    }
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
    user: User,
  ): Promise<DeleteCommentResponse> {
    const deletedComment = await this.commentRepository.deleteComment(
      commentId,
      user.id,
    );

    const release = await this.mutex.acquire();

    try {
      await this.boardsService.decreaseCommentCountTransaction(boardId);
      return DeleteCommentResponse.fromEntity(deletedComment);
    } finally {
      release();
    }
  }

  async deleteComments(boardId: number): Promise<count> {
    return this.commentRepository.deleteCommentsByBoardId(boardId);
  }
}
