import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardRequest } from '../dto/request/create-board.request';
import { UpdateBoardRequestDto } from '../dto/request/update-board.request';
import { BoardRepository } from '../../domain/board.repository';
import { CreateBoardResponse } from '../dto/response/create-board.response';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BoardRepository')
    private readonly boardRepository: BoardRepository,
    private readonly prismaService: PrismaService,
  ) {}

  // 트랜잭션 단위로 게시글 생성 로직을 처리하는 메소드
  async create(createRequest: CreateBoardRequest) {
    const board = createRequest.toBoardEntity(BigInt(1111));
    console.log(typeof board);
    console.log(board);
    console.log(createRequest);
    const createdBoard = await this.boardRepository.create(board);

    // 2. 응답 DTO를 정의하고 반환 API 확인하기
    return CreateBoardResponse.fromEntities(createdBoard);
  }
}
