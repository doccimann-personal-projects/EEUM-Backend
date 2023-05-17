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
import { UpdateBoardRequest } from '../dto/request/update-board.request';
import { UpdateBoardResponse } from '../dto/response/update-board.response';
import { Mutex } from 'async-mutex';
import { BoardWithCommentsEntity } from '../../domain/entity/board-with-comments.entity';

@Injectable()
export class BoardsService {
  private readonly mutex = new Mutex();
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

  // 나의 게시물 찾기
  async getAllBoardsByUserId(
    user: User,
    userId: number,
    page: number,
    elements: number,
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    return this.prismaService.$transaction(async () =>
      this.getAllBoardsByUserIdTransaction(user, userId, page, elements),
    );
  }

  async updateBoard(
    user: User,
    boardId: number,
    updateRequest: UpdateBoardRequest,
  ): Promise<any> {
    return this.prismaService.$transaction(async () =>
      this.updateBoardTransaction(user, boardId, updateRequest),
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
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    return this.prismaService.$transaction(async () =>
      this.getPaginatedBoardsTransaction(page, elements),
    );
  }

  // 페이지네이션 기반으로 게시글 검색
  async getSearchedBoards(
    page: number,
    elements: number,
    words: string,
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    return this.prismaService.$transaction(async () =>
      this.getSearchedBoardsTransaction(page, elements, words),
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
    const foundBoard = await this.boardRepository.findDetailBoardById(boardId);

    if (!foundBoard) {
      return null;
    }

    const release = await this.mutex.acquire();

    try {
      const countUpdatedBoard = await this.boardRepository.updateViewCountById(
        boardId,
        1,
      );
      const updatedEntity: BoardWithCommentsEntity = {
        commentList: foundBoard.commentList,
        ...countUpdatedBoard,
      };
      return ReadBoardResponse.fromEntity(updatedEntity);
    } finally {
      release();
    }
  }

  // 나의 게시물 모두를 페이지네이션 기반으로 조회하는 메소드
  private async getAllBoardsByUserIdTransaction(
    user: User,
    userId: number,
    page: number,
    elements: number,
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    const validationResult = this.boardValidator.isReadableByUser(
      user,
      userId,
      page,
      elements,
    );

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    const [boards, count] = await Promise.all([
      this.boardRepository.findAllBoardsByUserId(userId, page, elements),
      this.boardRepository.getCountByUserId(userId),
    ]);

    const responseList = boards?.map((board) =>
      PaginatedBoardResponse.fromEntity(board),
    );

    return [responseList, count];
  }

  private async updateBoardTransaction(
    user: User,
    boardId: number,
    updateRequest: UpdateBoardRequest,
  ): Promise<UpdateBoardResponse> {
    const validationResult = await this.boardValidator.isUpdatable(
      user,
      boardId,
    );

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    const updatedBoard = await this.boardRepository.updateBoardById(
      updateRequest,
      boardId,
    );
    return UpdateBoardResponse.fromEntity(updatedBoard);
  }

  // 댓글의 개수를 증가시키는 메소드
  async increaseCommentCountTransaction(
    boardId: number,
  ): Promise<Board | null> {
    return await this.boardRepository.updateCommentCountById(boardId, 1);
  }

  // 댓글의 개수를 감소시키는 메소드
  async decreaseCommentCountTransaction(
    boardId: number,
  ): Promise<Board | null> {
    return await this.boardRepository.updateCommentCountById(boardId, -1);
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
    await this.commentsService.deleteComments(boardId);
    return DeleteBoardResponse.fromEntities(deleteBoard);
  }

  private async getPaginatedBoardsTransaction(
    page: number,
    elements: number,
  ): Promise<[Array<PaginatedBoardResponse>, number]> {
    // 페이지네이션 요청이 옳은지 검증
    const isValidRequest = isValidPaginationRequest(page, elements);

    if (!isValidRequest) {
      throw new RequestNotValidException('요청이 올바르지 않습니다');
    }

    // 결과물들을 가져온다
    const [boards, totalCount] = await Promise.all([
      this.boardRepository.getBoardsByPagination(page, elements),
      this.boardRepository.getTotalCount(),
    ]);

    // 결과물들을 응답 객체로 변환한다
    const responseList = boards?.map((board) =>
      PaginatedBoardResponse.fromEntity(board),
    );

    return [responseList, totalCount];
  }

  private async getSearchedBoardsTransaction(
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
      this.boardRepository.getSearchedBoardsByPagination(page, elements, words),
      this.boardRepository.getTotalCount(),
    ]);

    // 결과물들을 응답 객체로 변환한다
    const responseList = boards?.map((board) =>
      PaginatedBoardResponse.fromEntity(board),
    );

    return [responseList, totalCount];
  }
}
