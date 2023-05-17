import { BoardRepository } from '../domain/repository/board.repository';
import { Board, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getCurrentUtcDate } from '../../common/utils/date-utils';
import {
  getTransformCommentCountData,
  getTransformViewsData,
} from '../domain/extensions/board-entity.extension';
import { BoardWithCommentsEntity } from '../domain/entity/board-with-comments.entity';

@Injectable()
export class BoardDao implements BoardRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(board: Omit<Board, 'id'>): Promise<Board> {
    return this.prismaService.board.create({
      data: board,
    });
  }

  async findById(id: number): Promise<Board | null> {
    return this.prismaService.board.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
    });
  }

  async findDetailBoardById(
    boardId: number,
  ): Promise<BoardWithCommentsEntity | null> {
    return this.prismaService.board.findFirst({
      where: {
        id: boardId,
        isDeleted: false,
      },
      include: {
        commentList: {
          where: { isDeleted: false },
        },
      },
    });
  }

  async findAllBoardsByUserId(
    userId: number,
    page: number,
    elements: number,
  ): Promise<Array<Board>> {
    return this.prismaService.board.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
      skip: elements * (page - 1),
      take: elements,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
  }

  async updateBoardById(
    board: Partial<Board>,
    boardId: number,
  ): Promise<Board> {
    const { title, content, category } = board;
    return this.prismaService.board.update({
      where: {
        id: boardId,
      },
      data: {
        title: title,
        content: content,
        category: category,
        updatedAt: getCurrentUtcDate(),
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

  async getCountByUserId(userId: number): Promise<number> {
    return this.prismaService.board.count({
      where: {
        userId: userId,
        isDeleted: false,
      },
    });
  }

  async getBoardsByPagination(
    page: number,
    elements: number,
  ): Promise<Array<Board>> {
    return this.prismaService.board.findMany({
      skip: elements * (page - 1),
      take: elements,
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
  }

  async getSearchedBoardsByPagination(
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
          search: `${words}* *${words}`,
        },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
  }

  async updateViewCountById(boardId: number, count: number): Promise<Board> {
    const board = await this.findById(boardId);

    if (!board) {
      return null;
    }

    // 업데이트 데이터를 가져온다
    const updateData = getTransformViewsData(board, count);

    return this.prismaService.board.update({
      where: { id: boardId },
      data: updateData,
    });
  }

  async updateCommentCountById(
    boardId: number,
    count: number,
  ): Promise<Board | null> {
    const board = await this.findById(boardId);

    if (!board) {
      return null;
    }

    const updateData = getTransformCommentCountData(board, count);

    return this.prismaService.board.update({
      where: {
        id: boardId,
      },
      data: updateData,
    });
  }
}
