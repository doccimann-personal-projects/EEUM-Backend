import { Inject, Injectable } from '@nestjs/common';
import { BoardRepository } from '../../domain/repository/board.repository';
import { ValidationResult } from '../../../common/validation/validation.result';
import { ResourceNotFoundException } from '../../../common/customExceptions/resource-not-found.exception';
import { User } from '@prisma/client';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';
import { isValidPaginationRequest } from '../../../common/utils/pagination-utils';
import { RequestNotValidException } from '../../../common/customExceptions/request-not-valid.exception';

@Injectable()
export class BoardValidator {
  constructor(
    @Inject('BoardRepository')
    private readonly boardRepository: BoardRepository,
  ) {}

  // board가 삭제 가능한지 검증하는 메소드
  async isDeletable(user: User, boardId: number): Promise<ValidationResult> {
    const foundBoard = await this.boardRepository.findDetailBoardById(boardId);

    // 일단 작성자 본인이 아니라면
    if (foundBoard.userId !== user.id) {
      return ValidationResult.getFailureResult(
        new NotAuthorizedException('삭제 권한이 없습니다'),
      );
    }

    // 아예 존재하지 않거나, 혹은 이미 삭제되었다면
    if (!foundBoard || foundBoard.isDeleted) {
      return ValidationResult.getFailureResult(
        new ResourceNotFoundException('게시물이 존재하지 않습니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }

  // 나의 게시물 조회가 가능한지 검증하는 메소드
  isReadableByUser(
    user: User,
    userId: number,
    page: number,
    elements: number,
  ): ValidationResult {
    // 페이지네이션 요청이 옳은지 검증
    const isValidRequest = isValidPaginationRequest(page, elements);

    if (!isValidRequest) {
      return ValidationResult.getFailureResult(
        new RequestNotValidException('요청이 올바르지 않습니다'),
      );
    }

    // 요청한 유저와 조회 대상의 유저가 일치하는지 검증
    if (Number(user.id) !== userId) {
      return ValidationResult.getFailureResult(
        new NotAuthorizedException('권한이 없습니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }

  // 게시물이 수정 가능한지 판단하는 메소드
  async isUpdatable(user: User, boardId: number): Promise<ValidationResult> {
    const foundBoard = await this.boardRepository.findById(boardId);

    // 게시글이 존재하지 않는 경우
    if (!foundBoard) {
      return ValidationResult.getFailureResult(
        new ResourceNotFoundException('게시글이 존재하지 않습니다'),
      );
    }

    // 게시글의 주인과 요청하는 유저가 다른 경우
    if (foundBoard.userId !== user.id) {
      return ValidationResult.getFailureResult(
        new NotAuthorizedException('권한이 없습니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }
}
