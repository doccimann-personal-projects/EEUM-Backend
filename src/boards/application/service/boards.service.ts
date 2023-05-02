import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardRequest } from '../dto/request/create-board.request';
import { BoardRepository } from '../../domain/repository/board.repository';
import { CreateBoardResponse } from '../dto/response/create-board.response';
import { ReadBoardResponse } from '../dto/response/read-board.response';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteBoardResponse } from '../dto/response/delete-board.response';
import { BoardValidator } from '../validator/board-validator';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BoardRepository')
    private readonly boardRepository: BoardRepository,
    private readonly boardValidator: BoardValidator,
    private readonly prismaService: PrismaService,
  ) {}

  // 게시글 생성
  async create(
    createRequest: CreateBoardRequest,
  ): Promise<CreateBoardResponse> {
    return this.prismaService.$transaction(async () =>
      this.createTransaction(createRequest),
    );
  }

  // 게시글 상세 조회
  async getDetailBoard(boardId: number): Promise<ReadBoardResponse | null> {
    return this.prismaService.$transaction(async () =>
      this.getDetailBoardTransaction(boardId),
    );
  }

  // 게시글 삭제
  async deleteBoard(boardId: number): Promise<DeleteBoardResponse> {
    return this.prismaService.$transaction(async () =>
      this.deleteBoardTransaction(boardId),
    );
  }

  private async createTransaction(
    createRequest: CreateBoardRequest,
  ): Promise<CreateBoardResponse> {
    const board = createRequest.toBoardEntity(BigInt(1111));
    const createdBoard = await this.boardRepository.create(board);

    return CreateBoardResponse.fromEntity(createdBoard);
  }

  private async getDetailBoardTransaction(
    boardId: number,
  ): Promise<ReadBoardResponse | null> {
    const foundBoard = await this.boardRepository.findAliveBoardById(boardId);
    return foundBoard ? ReadBoardResponse.fromEntities(foundBoard) : null;
  }

  async deleteBoardTransaction(boardId: number) {
    // 우선 삭제 가능한 상태인지 검증한다
    const validationResult = await this.boardValidator.isDeletable(boardId);

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    const deleteBoard = await this.boardRepository.deleteById(boardId);
    return DeleteBoardResponse.fromEntities(deleteBoard);
  }
}
