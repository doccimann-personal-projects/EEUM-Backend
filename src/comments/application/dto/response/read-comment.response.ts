import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';

export class ReadCommentResponse {
  @ApiProperty({
    description: '댓글의 식별자입니다',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '댓글의 내용입니다',
    example: '댓글 내요옹',
    required: true,
  })
  content: string;

  @ApiProperty({
    description: '댓글 생성일자 입니다',
    example: new Date(),
    required: true,
  })
  createdAt: Date;

  constructor(id: number, content: string, createdAt: Date) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromEntity(comment: Comment): ReadCommentResponse {
    const { id, content, createdAt } = comment;

    return new ReadCommentResponse(Number(id), content, createdAt);
  }
}