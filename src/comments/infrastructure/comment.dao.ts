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

  async findComment(boardId: bigint): Promise<Array<Comment>> {
    return this.prismaService.comment.findMany({
      where: {
        boardId: boardId,
      },
    });
  }

  async commentCount(boardId: number): Promise<number> {
    return this.prismaService.comment.count({
      where: { boardId: BigInt(boardId) },
    });
  }
}
