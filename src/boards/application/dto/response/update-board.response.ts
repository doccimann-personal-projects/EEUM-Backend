import { Board, BoardCategory } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';

export class UpdateBoardResponse extends PickType(CommonBoardResponse, [
  'id',
  'userId',
  'authorName',
  'category',
  'views',
  'title',
  'content',
  'updatedAt',
] as const) {
  constructor(
    id: number,
    userId: number,
    authorName: string,
    category: BoardCategory,
    views: number,
    title: string,
    content: string,
    updatedAt: Date,
  ) {
    super();

    this.id = id;
    this.userId = userId;
    this.authorName = authorName;
    this.category = category;
    this.views = views;
    this.title = title;
    this.content = content;
    this.updatedAt = updatedAt;
  }

  static fromEntity(board: Board): UpdateBoardResponse {
    const {
      id,
      userId,
      authorName,
      category,
      title,
      views,
      content,
      updatedAt,
    } = board;

    return new UpdateBoardResponse(
      Number(id),
      Number(userId),
      authorName,
      category,
      views,
      title,
      content,
      updatedAt,
    );
  }
}
