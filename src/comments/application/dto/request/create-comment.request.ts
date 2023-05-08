import { Comment } from '@prisma/client';
import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRequest {
  @ApiProperty({
    description: '150자 이내로 댓글을 작성해주세요.',
    example: '좋은 게시물이네요!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
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
