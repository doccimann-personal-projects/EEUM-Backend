import { Board, BoardCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardRequest {
  @IsEnum(BoardCategory)
  @IsNotEmpty()
  category: BoardCategory;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  // user entity로 변환하는 메소드
  toBoardEntity(userId: bigint): Omit<Board, 'id'> {
    return {
      userId: userId,
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