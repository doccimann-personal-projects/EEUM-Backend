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

  constructor(
    id: number,
    userId: number,
    boardId: number,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    isDeleted: boolean,
  ) {
    this.id = id;
    this.userId = userId;
    this.boardId = boardId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  static fromEntity(comment: Comment): DeleteCommentResponse {
    const {
      id,
      userId,
      boardId,
      content,
      createdAt,
      updatedAt,
      deletedAt,
      isDeleted,
    } = comment;
    return new DeleteCommentResponse(
      Number(id),
      Number(userId),
      Number(boardId),
      content,
      createdAt,
      updatedAt,
      deletedAt,
      isDeleted,
    );
  }
}

export interface count {
  count: number;
}
