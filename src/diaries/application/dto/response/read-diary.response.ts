import { ApiProperty } from '@nestjs/swagger';
import { DetailDiaryEntity } from '../../../domain/entity/detail-diary.entity';
import { DiaryEmotionResponse } from './types/diary-emotion.response';
import { DiaryEmotion } from '@prisma/client';
import { RecommendedFoodResponse } from './types/recommended-food.response';

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
    description: '추천된 음식입니다',
    example: { name: '떡볶이', imageUrl: 'http://tteokbokki.com' },
    required: true,
  })
  recommendedFood: RecommendedFoodResponse | null;

  @ApiProperty({
    description: '일기에 담긴 주요 감정입니다',
    example: '슬픔',
    required: true,
  })
  emotion: string | null;

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
    emotion: string | null,
    emotionScores: DiaryEmotionResponse | null,
    recommendedFood: RecommendedFoodResponse | null,
    weather: string,
    publishedDate: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.emotion = emotion;
    this.emotionScores = emotionScores;
    this.recommendedFood = recommendedFood;
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

    const highestEmotion = diaryEmotionList[0]
      ? this.getHighestEmotion(diaryEmotionList[0])
      : null;

    const emotionScores = diaryEmotionList[0]
      ? DiaryEmotionResponse.fromPartialEntity(diaryEmotionList[0])
      : null;

    const recommendedFood = recommendedFoodList[0]
      ? RecommendedFoodResponse.fromEntity(recommendedFoodList[0])
      : null;

    return new ReadDiaryResponse(
      Number(id),
      Number(userId),
      title,
      content,
      highestEmotion,
      emotionScores,
      recommendedFood,
      weather,
      publishedDate.toISOString().substring(0, 10),
      createdAt,
    );
  }

  // 가장 수치가 높은 감정을 추출하는 메소드
  private static getHighestEmotion(emotion: Partial<DiaryEmotion>): string {
    const emotionsScoreMap: { [key: string]: number } = {
      worry: Number(emotion.worryScore),
      angry: Number(emotion.angryScore),
      happy: Number(emotion.happyScore),
      excited: Number(emotion.excitedScore),
      sad: Number(emotion.sadScore),
    };

    const emotionNameMap = {
      worry: '걱정',
      angry: '분노',
      happy: '행복',
      excited: '설렘',
      sad: '슬픔',
    };

    const highestEmotion: string = Object.keys(emotionsScoreMap).reduce(
      (prev, current) => {
        return emotionsScoreMap[prev] > emotionsScoreMap[current]
          ? prev
          : current;
      },
      'worry',
    );

    return emotionNameMap[highestEmotion];
  }
}
