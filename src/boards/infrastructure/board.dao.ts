import { BoardRepository } from '../domain/repository/board.repository';
import { Board } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getCurrentUtcDate } from '../../common/utils/date-utils';

@Injectable()
export class BoardDao implements BoardRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(board: Omit<Board, 'id'>): Promise<Board> {
    return this.prismaService.board.create({
      data: board,
    });
  }

  async findAliveBoardById(boardId: number): Promise<Board | null> {
    return this.prismaService.board.findFirst({
      where: {
        id: boardId,
        isDeleted: false,
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
}
