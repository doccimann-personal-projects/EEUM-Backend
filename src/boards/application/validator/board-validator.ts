import { Inject, Injectable } from "@nestjs/common";
import { BoardRepository } from '../../domain/repository/board.repository';
import { ValidationResult } from '../../../common/validation/validation.result';
import { NotFoundException } from '../../../common/customExceptions/not-found.exception';

@Injectable()
export class BoardValidator {
  constructor(@Inject('BoardRepository') private readonly boardRepository: BoardRepository) {}

  // board가 삭제 가능한지 검증하는 메소드
  async isDeletable(boardId: number): Promise<ValidationResult> {
    const foundBoard = await this.boardRepository.findAliveBoardById(boardId);

    console.log(foundBoard);

    // 아예 존재하지 않거나, 혹은 이미 삭제되었다면
    if (!foundBoard || foundBoard.isDeleted) {
      return ValidationResult.getFailureResult(
        new NotFoundException('게시물이 존재하지 않습니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }
}
