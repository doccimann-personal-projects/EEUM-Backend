import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateBoardRequest } from '../dto/request/create-board.request';
import { BoardRepository } from '../../domain/repository/board.repository';
import { CreateBoardResponse } from '../dto/response/create-board.response';
import { ReadBoardResponse } from '../dto/response/read-board.response';
import { PrismaService } from '../../../prisma/prisma.service';
import { Board, User } from '@prisma/client';
import { BoardValidator } from '../validator/board-validator';
import { DeleteBoardResponse } from '../dto/response/delete-board.response';
import { PaginatedBoardResponse } from '../dto/response/paginated-board.response';
import { isValidPaginationRequest } from '../../../common/utils/pagination-utils';
import { RequestNotValidException } from '../../../common/customExceptions/request-not-valid.exception';
import { CommentsService } from 'src/comments/application/service/comments.service';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BoardRepository')
    private readonly boardRepository: BoardRepository,
    private readonly boardValidator: BoardValidator,
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}

  // 게시글 생성
  async create(
    createRequest: CreateBoardRequest,
    user: User,
  ): Promise<CreateBoardResponse> {
    return this.prismaService.$transaction(async () =>
      this.createTransaction(createRequest, user),
    );
  }

  // 게시글 상세 조회
  async getDetailBoard(boardId: number): Promise<ReadBoardResponse | null> {
    return this.prismaService.$transaction(async () =>
      this.getDetailBoardTransaction(boardId),
    );
  }

  // 게시글 삭제
  async deleteBoard(user: User, boardId: number): Promise<DeleteBoardResponse> {
    return this.prismaService.$transaction(async () =>
      this.deleteBoardTransaction(user, boardId),
    );
  }

  // 페이지네이션 기반으로 게시글 조회
  async getPaginatedBoards(
    page: number,
    elements: number,
    words: string,
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    return this.prismaService.$transaction(async () =>
      this.getPaginatedBoardsTransaction(page, elements, words),
    );
  }

  private async createTransaction(
    createRequest: CreateBoardRequest,
    user: User,
  ): Promise<CreateBoardResponse> {
    const board = createRequest.toBoardEntity(user);
    const createdBoard = await this.boardRepository.create(board);

    return CreateBoardResponse.fromEntity(createdBoard);
  }

  private async getDetailBoardTransaction(
    boardId: number,
  ): Promise<ReadBoardResponse | null> {
    const foundBoard = await this.boardRepository.findAliveBoardById(boardId);
    return foundBoard ? ReadBoardResponse.fromEntity(foundBoard) : null;
  }

  async deleteBoardTransaction(user: User, boardId: number) {
    // 우선 삭제 가능한 상태인지 검증한다
    const validationResult = await this.boardValidator.isDeletable(
      user,
      boardId,
    );

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    const deleteBoard = await this.boardRepository.deleteById(boardId);
    this.commentsService.deleteComments(boardId);
    return DeleteBoardResponse.fromEntities(deleteBoard);
  }

  private async getPaginatedBoardsTransaction(
    page: number,
    elements: number,
    words: string,
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    // 페이지네이션 요청이 옳은지 검증
    const isValidRequest = isValidPaginationRequest(page, elements);

    if (!isValidRequest) {
      throw new RequestNotValidException('요청이 올바르지 않습니다');
    }

    // 결과물들을 가져온다
    const [boards, totalCount] = await Promise.all([
      this.boardRepository.getBoardsByPagination(page, elements, words),
      this.boardRepository.getTotalCount(),
    ]);

    // 결과물들을 응답 객체로 변환한다
    const responseList = boards?.map((board) =>
      PaginatedBoardResponse.fromEntity(board),
    );

    return [responseList, totalCount];
  }

  // 게시물의 commentCount를 증가/감소 시킴
  async updateCommentCount(id: number, counts: number) {
    return this.boardRepository.updateCommentCount(id, counts);
  }
}
