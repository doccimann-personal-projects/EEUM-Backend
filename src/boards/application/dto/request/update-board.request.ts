import { BoardCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardRequest {
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
}
