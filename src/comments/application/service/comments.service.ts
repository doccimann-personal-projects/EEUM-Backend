import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentRequest } from '../dto/request/create-comment.request';
import { UpdateCommentDto } from '../dto/request/update-comment.request';
import { CommentRepository } from 'src/comments/domain/comment.repository';
import { User } from '@prisma/client';
import { CreateCommentResponse } from '../dto/response/create-comment.response';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
  ) {}
  async create(createComment: CreateCommentRequest, user: User) {
    const boardId = BigInt(1);
    const comment = createComment.toCommentEntity(user.id, boardId);
    const createdComment = await this.commentRepository.create(comment);
    return CreateCommentResponse.fromEntity(createdComment);
  }
}
