import { ApiProperty } from '@nestjs/swagger';
import { DetailDiaryEntity } from '../../../domain/entity/detail-diary.entity';
import { DiaryEmotionResponse } from './types/diary-emotion.response';

export class ReadDiaryResponse {
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
    description: '추천 음식의 리스트입니다',
    example: ['떡볶이'],
    required: true,
  })
  recommendedFoodList: Array<string>;

  @ApiProperty({
    description: '일기에 담긴 감정 점수 목록입니다',
    example: null,
    required: true,
  })
  emotionScores: DiaryEmotionResponse | null;

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

  constructor(
    id: number,
    userId: number,
    title: string,
    content: string,
    emotionScores: DiaryEmotionResponse | null,
    recommendedFoodList: Array<string>,
    weather: string,
    publishedDate: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.emotionScores = emotionScores;
    this.recommendedFoodList = recommendedFoodList;
    this.weather = weather;
    this.publishedDate = publishedDate;
    this.createdAt = createdAt;
  }

  static fromDetailEntity(diary: DetailDiaryEntity): ReadDiaryResponse {
    const {
      id,
      userId,
      title,
      content,
      diaryEmotionList,
      recommendedFoodList,
      weather,
      publishedDate,
      createdAt,
    } = diary;

    const emotionScores = diaryEmotionList[0]
      ? DiaryEmotionResponse.fromPartialEntity(diaryEmotionList[0])
      : null;

    const foodList = recommendedFoodList?.map((food) => food.foodName);

    return new ReadDiaryResponse(
      Number(id),
      Number(userId),
      title,
      content,
      emotionScores,
      foodList,
      weather,
      publishedDate.toISOString().substring(0, 10),
      createdAt,
    );
  }
}
