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

  // 게시글 생성
  async create(createRequest: CreateBoardRequest) {
    const board = createRequest.toBoardEntity(BigInt(1111));
    const createdBoard = await this.boardRepository.create(board);

    return CreateBoardResponse.fromEntities(createdBoard);
  }

  // 게시글 조회
  async getBoardById(boardId: number) {
    const foundBoard = await this.boardRepository.findById(boardId);
    return ReadBoardResponse.fromEntities(foundBoard);
  }

  /*
  async getBoardAll(page: PageRequest){
    const total = await this.boardRepository.findLists(page);
    return ReadBoardAllResponse.
  }*/

  // 게시글 삭제
  async unregisterBoard(boardId: number) {
    const deleteBoard = await this.boardRepository.deleteById(boardId);
    return DeleteBoardResponse.fromEntities(deleteBoard);
  }
}
