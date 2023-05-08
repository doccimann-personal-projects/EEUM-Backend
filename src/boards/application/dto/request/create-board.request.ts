import { Board, BoardCategory, User } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardRequest {
  @ApiProperty({
    description: '게시물 카테고리입니다',
    example: BoardCategory.RECIPE,
    required: true,
  })
  @IsEnum(BoardCategory)
  @IsNotEmpty()
  category: BoardCategory;

  @ApiProperty({
    description: '게시물 제목입니다',
    example: '게시물 제목',
    required: true,
  })
  @IsString()
  @Length(1, 150)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '게시물 내용입니다',
    example: '게시물 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  // entity로 변환하는 메소드
  toBoardEntity(user: User): Omit<Board, 'id' | 'commentCount'> {
    return {
      authorName: user.nickname,
      userId: user.id,
      category: this.category,
      title: this.title,
      views: 0,
      content: this.content,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isDeleted: false,
    };
  }
}
