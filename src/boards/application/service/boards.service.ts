import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardRequest } from '../dto/request/create-board.request';
import { BoardRepository } from '../../domain/repository/board.repository';
import { CreateBoardResponse } from '../dto/response/create-board.response';
import { ReadBoardResponse } from '../dto/response/read-board.response';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteBoardResponse } from '../dto/response/delete-board.response';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BoardRepository')
    private readonly boardRepository: BoardRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    createRequest: CreateBoardRequest,
  ): Promise<CreateBoardResponse> {
    return this.prismaService.$transaction(async () =>
      this.createTransaction(createRequest),
    );
  }

  async getDetailBoard(boardId: number): Promise<ReadBoardResponse | null> {
    return this.prismaService.$transaction(async () =>
      this.getDetailBoardTransaction(boardId),
    );
  }

  // 게시글 생성
  private async createTransaction(
    createRequest: CreateBoardRequest,
  ): Promise<CreateBoardResponse> {
    const board = createRequest.toBoardEntity(BigInt(1111));
    const createdBoard = await this.boardRepository.create(board);

    return CreateBoardResponse.fromEntity(createdBoard);
  }

  // 게시글 조회
  private async getDetailBoardTransaction(
    boardId: number,
  ): Promise<ReadBoardResponse | null> {
    const foundBoard = await this.boardRepository.findById(boardId);
    return foundBoard ? ReadBoardResponse.fromEntities(foundBoard) : null;
  }

  // 게시글 삭제
  async unregisterBoard(boardId: number) {
    const deleteBoard = await this.boardRepository.deleteById(boardId);
    return DeleteBoardResponse.fromEntities(deleteBoard);
  }
}
