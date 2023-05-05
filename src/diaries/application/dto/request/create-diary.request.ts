import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { Diary } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryRequest {
  @ApiProperty({
    description: '100자 이내로 일기 제목을 작성해주세요.',
    example: '행복한 하루',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: '일기 내용을 작성해주세요.',
    example: '맛있는 음식을 먹고 좋은 사람들과 좋은 시간을 보냈다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '일기를 쓴 작성 날짜의 날씨를 입력해주세요.',
    example: '맑음',
    required: false,
  })
  @IsString()
  @IsOptional()
  weather?: string;

  @ApiProperty({
    description: '일기를 쓴 작성 날짜를 입력해주세요.',
    example: '2022-04-05',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publishedDate: string;

  // diary entity로 변환
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
