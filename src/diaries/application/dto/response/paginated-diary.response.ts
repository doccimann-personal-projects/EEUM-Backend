import { ApiProperty } from '@nestjs/swagger';
import { DetailDiaryEntity } from '../../../domain/entity/detail-diary.entity';
import { DiaryEmotion } from '@prisma/client';
import { getDateResponse } from '../../../../common/utils/date-utils';

export class PaginatedDiaryResponse {
  @ApiProperty({
    description: '일기의 식별자 값입니다.',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '일기의 제목입니다',
    example: '행복한 하루',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '일기의 등록 일자입니다',
    example: '2022-04-15',
    required: true,
  })
  publishedDate: string;

  @ApiProperty({
    description: '일기에 가장 많이 담긴 감정입니다',
    example: '분노',
    required: true,
  })
  emotion: string;

  @ApiProperty({
    description: '추천 음식 이름입니다',
    example: '떡볶이',
    required: true,
  })
  recommendedFood: string;

  constructor(
    id: number,
    title: string,
    publishedDate: string,
    emotion: string,
    recommendedFood: string,
  ) {
    this.id = id;
    this.title = title;
    this.publishedDate = publishedDate;
    this.emotion = emotion;
    this.recommendedFood = recommendedFood;
  }

  static fromPartialEntity(
    detailDiary: Partial<DetailDiaryEntity>,
  ): PaginatedDiaryResponse {
    const { id, title, publishedDate, diaryEmotionList, recommendedFoodList } =
      detailDiary;

    // 음식 이름 추출
    const food = recommendedFoodList[0]
      ? recommendedFoodList[0].foodName
      : null;

    // 감정 추출
    const emotionName = diaryEmotionList[0]
      ? this.getHighestEmotion(diaryEmotionList[0])
      : null;

    return new PaginatedDiaryResponse(
      Number(id),
      title,
      getDateResponse(publishedDate),
      emotionName,
      food,
    );
  }

  // 가장 수치가 높은 감정을 추출하는 메소드
  private static getHighestEmotion(emotion: Partial<DiaryEmotion>): string {
    const emotionsScoreMap = {
      worry: emotion.worryScore,
      angry: emotion.angryScore,
      happy: emotion.happyScore,
      excited: emotion.excitedScore,
      sad: emotion.sadScore,
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
    );

    return emotionNameMap[highestEmotion];
  }
}
