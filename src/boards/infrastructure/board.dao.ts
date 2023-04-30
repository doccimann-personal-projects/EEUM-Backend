import { BoardRepository } from '../domain/board.repository';
import { Board } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BoardDao implements BoardRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(board: Omit<Board, 'id'>): Promise<Board> {
    return this.prismaService.board.create({
      data: board,
    });
  }
}
