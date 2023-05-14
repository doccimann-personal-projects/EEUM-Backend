import { Board, BoardCategory } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CommonBoardResponse } from './common/common-board.response';

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
    commentList: Array<toIntCommentInfo>,
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

  static fromEntity(board: commentBoard): ReadBoardResponse {
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

    const commentLists: Array<toIntCommentInfo> = commentList.reduce(
      (map: Array<toIntCommentInfo>, value: commentInfo) => {
        const obj = {
          id: Number(value['id']),
          content: value['content'],
          createdAt: value['createdAt'],
        };
        map.push(obj);
        return map;
      },
      [],
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
      commentLists,
    );
  }
}

export interface commentBoard {
  id: bigint;
  userId: bigint;
  authorName: string;
  category: BoardCategory;
  views: number;
  title: string;
  content: string;
  createdAt: Date;
  commentList: Array<commentInfo>;
  isDeleted: boolean;
}

export interface toIntCommentInfo {
  id: number;
  content: string;
  createdAt: Date;
}

export interface commentInfo {
  id: bigint;
  content: string;
  createdAt: Date;
}
