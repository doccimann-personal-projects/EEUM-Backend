import { CommentRepository } from '../domain/comment.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';

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
}
