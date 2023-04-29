import { Board } from '@prisma/client';

export class DeleteBoardResponse {
  id: number;
  deletedAt: Date;
  isDeleted: boolean;

  constructor(id: number, deletedAt: Date, isDeleted: boolean) {
    this.id = id;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  static fromEntities(board: Board): DeleteBoardResponse {
    const { id, deletedAt, isDeleted } = board;

    return new DeleteBoardResponse(Number(id), deletedAt, isDeleted);
  }
}
