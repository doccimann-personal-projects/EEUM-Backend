import { Board, BoardCategory } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';

export class CreateBoardResponse extends PickType(CommonBoardResponse, [
  'id',
  'userId',
  'authorName',
  'category',
  'views',
  'title',
  'content',
  'createdAt',
] as const) {
  constructor(
    id: number,
    userId: number,
    authorName: string,
    category: BoardCategory,
    views: number,
    title: string,
    content: string,
    createdAt: Date,
  ) {
    super();

    this.id = id;
    this.userId = userId;
    this.authorName = authorName;
    this.category = category;
    this.views = views;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(board: Board): CreateBoardResponse {
    const {
      id,
      userId,
      authorName,
      category,
      title,
      views,
      content,
      createdAt,
    } = board;

    return new CreateBoardResponse(
      Number(id),
      Number(userId),
      authorName,
      category,
      views,
      title,
      content,
      createdAt,
    );
  }
}
