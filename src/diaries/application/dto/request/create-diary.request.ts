import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { Diary } from '@prisma/client';

export class CreateDiaryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  weather?: string;

  @IsString()
  @IsNotEmpty()
  publishedDate: string;

  toDiaryEntity(userId: bigint): Omit<Diary, 'id'> {
    return {
      userId: userId,
      title: this.title,
      content: this.content,
      weather: this.weather,
      publishedDate: new Date(this.publishedDate),
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isDeleted: false,
    };
  }
}
