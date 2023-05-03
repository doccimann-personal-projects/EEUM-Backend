import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';
import { Board, BoardCategory } from '@prisma/client';

export class PaginatedBoardResponse extends PickType(CommonBoardResponse, [
  'id',
  'authorName',
  'category',
  'views',
  'title',
  'content',
  'createdAt',
] as const) {
  constructor(
    id: number,
    authorName: string,
    category: BoardCategory,
    views: number,
    title: string,
    content: string,
    createdAt: Date,
  ) {
    super();

    this.id = id;
    this.authorName = authorName;
    this.category = category;
    this.views = views;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(board: Board): PaginatedBoardResponse {
    const { id, authorName, category, views, title, content, createdAt } =
      board;

    return new PaginatedBoardResponse(
      Number(id),
      authorName,
      category,
      views,
      title,
      content,
      createdAt,
    );
  }
}
