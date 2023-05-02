import { Board, BoardCategory } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';

export class ReadBoardResponse extends PickType(CommonBoardResponse, [
  'id',
  'userId',
  'category',
  'views',
  'title',
  'content',
  'createdAt',
] as const) {
  constructor(
    id: number,
    userId: number,
    category: BoardCategory,
    views: number,
    title: string,
    content: string,
    createdAt: Date,
  ) {
    super();

    this.id = id;
    this.userId = userId;
    this.category = category;
    this.views = views;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntities(board: Board): ReadBoardResponse {
    const { id, userId, category, title, views, content, createdAt } = board;

    return new ReadBoardResponse(
      Number(id),
      Number(userId),
      category,
      views,
      title,
      content,
      createdAt,
    );
  }
}
