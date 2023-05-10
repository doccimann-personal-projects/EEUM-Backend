import { CommentRepository } from '../domain/comment.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';
import { UpdateCommentDto } from '../application/dto/request/update-comment.request';
import { count } from '../application/dto/response/delete-comment.response';

@Injectable()
export class CommentDao implements CommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(comment: Omit<Comment, 'id'>): Promise<Comment> {
    return this.prismaService.comment.create({
      data: comment,
    });
  }

  async commentCount(boardId: number): Promise<number> {
    return this.prismaService.comment.count({
      where: { boardId: BigInt(boardId), isDeleted: Boolean(0) },
    });
  }

  async updateComment(
    updateComment: UpdateCommentDto,
    commentId: number,
  ): Promise<Comment> {
    const { content } = updateComment;
    return this.prismaService.comment.update({
      where: { id: BigInt(commentId) },
      data: { content: content, updatedAt: new Date() },
    });
  }

  async deleteComment(commentId: number): Promise<Comment> {
    return this.prismaService.comment.update({
      where: { id: BigInt(commentId) },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
        isDeleted: Boolean(1),
      },
    });
  }

  deleteComments(boardId: number): Promise<count> {
    return this.prismaService.comment.updateMany({
      where: { boardId: boardId },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
        isDeleted: Boolean(1),
      },
    });
  }
}
