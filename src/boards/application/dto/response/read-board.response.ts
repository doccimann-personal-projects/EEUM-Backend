import { Board, BoardCategory } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';
import { ReadCommentResponse } from '../../../../comments/application/dto/response/read-comment.response';
import { BoardWithCommentsEntity } from '../../../domain/entity/board-with-comments.entity';

export class ReadBoardResponse extends PickType(CommonBoardResponse, [
  'id',
  'userId',
  'authorName',
  'category',
  'views',
  'title',
  'content',
  'createdAt',
  'commentList',
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
    commentList: Array<ReadCommentResponse>,
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
    this.commentList = commentList;
  }

  static fromEntity(board: BoardWithCommentsEntity): ReadBoardResponse {
    const {
      id,
      userId,
      authorName,
      category,
      title,
      views,
      content,
      createdAt,
      commentList,
    } = board;

    const commentResponseList = commentList?.map((comment) =>
      ReadCommentResponse.fromEntity(comment),
    );

    return new ReadBoardResponse(
      Number(id),
      Number(userId),
      authorName,
      category,
      views,
      title,
      content,
      createdAt,
      commentResponseList,
    );
  }
}
