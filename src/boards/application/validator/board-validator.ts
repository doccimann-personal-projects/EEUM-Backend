import { Inject, Injectable } from '@nestjs/common';
import { BoardRepository } from '../../domain/repository/board.repository';
import { ValidationResult } from '../../../common/validation/validation.result';
import { ResourceNotFoundException } from '../../../common/customExceptions/resource-not-found.exception';
import { User } from '@prisma/client';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';

@Injectable()
export class BoardValidator {
  constructor(
    @Inject('BoardRepository')
    private readonly boardRepository: BoardRepository,
  ) {}

  // board가 삭제 가능한지 검증하는 메소드
  async isDeletable(user: User, boardId: number): Promise<ValidationResult> {
    const foundBoard = await this.boardRepository.findAliveBoardById(boardId);

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
}
