// Board를 검증하는 메소드
import { Injectable } from '@nestjs/common';
import { BoardRepository } from '../../domain/repository/board.repository';

@Injectable()
export class BoardValidator {
  constructor(private readonly boardRepository: BoardRepository) {}

  // board가 삭제 가능한지 검증하는 메소드
}
