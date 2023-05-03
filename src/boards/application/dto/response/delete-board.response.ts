import { Board } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';

export class DeleteBoardResponse extends PickType(CommonBoardResponse, [
  'id',
  'deletedAt',
  'isDeleted',
] as const) {
  constructor(id: number, deletedAt: Date, isDeleted: boolean) {
    super();

    this.id = id;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  static fromEntities(board: Board): DeleteBoardResponse {
    const { id, deletedAt, isDeleted } = board;

    return new DeleteBoardResponse(Number(id), deletedAt, isDeleted);
  }
}
