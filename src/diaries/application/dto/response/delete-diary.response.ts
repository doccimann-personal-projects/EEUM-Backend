import { Diary } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDiaryResponse {
  @ApiProperty({
    description: '일기의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '일기를 작성한 유저의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  userId: number;

  @ApiProperty({
    description: '100자 이내로 일기 제목을 작성해주세요.',
    example: '행복한 하루',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '일기 내용을 작성해주세요.',
    example: '맛있는 음식을 먹고 좋은 사람들과 좋은 시간을 보냈다.',
    required: true,
  })
  content: string;

  @ApiProperty({
    description: '일기를 쓴 작성 날짜의 날씨를 입력해주세요.',
    example: '맑음',
    required: true,
  })
  weather: string;

  @ApiProperty({
    description: '일기를 쓴 작성 날짜를 입력해주세요.',
    example: '2022-04-05',
    required: true,
  })
  publishedDate: string;

  @ApiProperty({
    description: '일기의 생성 일자입니다',
    example: '2022-03-17T13:00:25.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '일기의 갱신 일자입니다',
    example: '2022-03-17T13:00:26.000Z',
    required: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: '일기의 삭제 일자입니다',
    example: '2022-03-18T13:00:25.000Z',
    required: true,
  })
  deletedAt: Date;

  @ApiProperty({
    description: '일기를 삭제했는지 여부입니다.',
    example: Boolean(0),
    required: true,
  })
  isDeleted: boolean;

  constructor(
    id: number,
    userId: number,
    title: string,
    content: string,
    weather: string,
    publishedDate: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    isDeleted: boolean,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.weather = weather;
    this.publishedDate = publishedDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  static fromEntity(diary: Diary): DeleteDiaryResponse {
    const {
      id,
      userId,
      title,
      content,
      weather,
      publishedDate,
      createdAt,
      updatedAt,
      deletedAt,
      isDeleted,
    } = diary;

    return new DeleteDiaryResponse(
      Number(id),
      Number(userId),
      title,
      content,
      weather,
      publishedDate.toISOString().substring(0, 10),
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
