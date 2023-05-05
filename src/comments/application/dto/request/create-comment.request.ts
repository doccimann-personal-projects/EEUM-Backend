import { Comment } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';

export class CreateCommentRequest {
  @IsString()
  @MaxLength(150)
  content: string;

  toCommentEntity(userId: bigint, boardId: bigint): Omit<Comment, 'id'> {
    return {
      userId: userId,
      boardId: boardId,
      content: this.content,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isDeleted: false,
    };
  }
}
