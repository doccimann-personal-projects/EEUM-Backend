import { Comment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentResponse {
  @ApiProperty({
    description: '댓글의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '댓글의 삭제 일자입니다.',
    example: '2022-04-19T13:00:25.000Z',
    required: true,
  })
  deletedAt: Date;

  @ApiProperty({
    description: '댓글의 삭제 여부입니다.',
    example: Boolean(0),
    required: true,
  })
  isDeleted: boolean;

  constructor(id: number, deletedAt: Date, isDeleted: boolean) {
    this.id = id;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  static fromEntity(comment: Comment): DeleteCommentResponse {
    const { id, deletedAt, isDeleted } = comment;
    return new DeleteCommentResponse(Number(id), deletedAt, isDeleted);
  }
}

export interface count {
  count: number;
}
