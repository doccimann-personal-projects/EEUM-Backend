import { Comment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentResponse {
  @ApiProperty({
    description: '댓글의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '작성자의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  userId: number;

  @ApiProperty({
    description: '게시물의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  boardId: number;

  @ApiProperty({
    description: '150자 이내로 댓글 내용을 작성해주세요.',
    example: '좋은 게시물 감사합니다.',
    required: true,
  })
  content: string;

  @ApiProperty({
    description: '댓글의 생성 일자입니다.',
    example: '2022-04-17T13:00:25.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '댓글의 업데이트 일자입니다.',
    example: '2022-04-18T13:00:25.000Z',
    required: true,
  })
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    boardId: number,
    content: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.boardId = boardId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static fromEntity(comment: Comment): UpdateCommentResponse {
    const { id, userId, boardId, content, createdAt, updatedAt } = comment;
    return new UpdateCommentResponse(
      Number(id),
      Number(userId),
      Number(boardId),
      content,
      createdAt,
      updatedAt,
    );
  }
}
