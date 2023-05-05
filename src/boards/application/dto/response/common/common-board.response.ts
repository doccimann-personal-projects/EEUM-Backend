import { BoardCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { toIntCommentInfo } from '../read-board.response';

export class CommonBoardResponse {
  @ApiProperty({
    description: '게시판 식별자 값입니다',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '유저의 식별자 값입니다',
    example: 1,
    required: true,
  })
  userId: number;

  @ApiProperty({
    description: '유저의 닉네임 값입니다',
    example: 'Brian',
    required: true,
  })
  authorName: string;

  @ApiProperty({
    description: '게시판 카테고리 정보입니다',
    example: BoardCategory.RECIPE,
    required: true,
  })
  category: BoardCategory;

  @ApiProperty({
    description: '게시판 조회수 정보입니다',
    example: 0,
    required: true,
  })
  views: number;

  @ApiProperty({
    description: '게시판 제목입니다',
    example: '제목',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '게시판 내용입니다',
    example: '내요옹',
    required: true,
  })
  content: string;

  @ApiProperty({
    description: '생성 일자입니다',
    example: Date.now(),
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일자입니다',
    example: Date.now(),
    required: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: '삭제 일자입니다',
    example: Date.now(),
    required: true,
  })
  deletedAt: Date;

  @ApiProperty({
    description: '삭제 여부입니다',
    example: false,
    required: true,
  })
  isDeleted: boolean;

  commentCount: number;

  commentList: Array<toIntCommentInfo>;
}
