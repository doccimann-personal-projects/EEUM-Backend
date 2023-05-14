import { BoardRepository } from '../domain/repository/board.repository';
import { Board, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getCurrentUtcDate } from '../../common/utils/date-utils';
import { commentBoard } from '../application/dto/response/read-board.response';

@Injectable()
export class BoardDao implements BoardRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(board: Omit<Board, 'id'>): Promise<Board> {
    return this.prismaService.board.create({
      data: board,
    });
  }

  async findAliveBoardById(boardId: number): Promise<commentBoard | null> {
    return this.prismaService.board.findFirst({
      where: {
        id: boardId,
        isDeleted: false,
      },
      include: {
        commentList: {
          where: { isDeleted: Boolean(0) },
        },
      },
    });
  }

  async deleteById(boardId: number): Promise<Board> {
    return this.prismaService.board.update({
      where: {
        id: boardId,
      },
      data: {
        isDeleted: true,
        updatedAt: getCurrentUtcDate(),
        deletedAt: getCurrentUtcDate(),
      },
    });
  }

  async getTotalCount(): Promise<number> {
    return this.prismaService.board.count({
      where: {
        isDeleted: false,
      },
    });
  }

  async getBoardsByPagination(
    page: number,
    elements: number,
    words: string,
  ): Promise<Array<Board>> {
    return this.prismaService.board.findMany({
      skip: elements * (page - 1),
      take: elements,
      where: {
        isDeleted: false,
        title: {
          search: words + '* *' + words,
        },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
  }

  updateCommentCount(id: number, counts: number): Promise<Board> {
    return this.prismaService.board.update({
      where: { id: id },
      data: { commentCount: counts },
    });
  }
}
