import { BoardCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateBoardRequest {
  @IsEnum(BoardCategory)
  @IsNotEmpty()
  category: BoardCategory;

  @IsString()
  @Length(1, 150)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
