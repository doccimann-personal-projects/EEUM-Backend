import { Comment } from '@prisma/client';

export class CreateCommentResponse {
  id: number;
  userId: number;
  boardId: number;
  content: string;
  createdAt: Date;

  constructor(
    id: number,
    userId: number,
    boardId: number,
    content: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.boardId = boardId;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(comment: Comment): CreateCommentResponse {
    const { id, userId, boardId, content, createdAt } = comment;
    return new CreateCommentResponse(
      Number(id),
      Number(userId),
      Number(boardId),
      content,
      createdAt,
    );
  }
}
