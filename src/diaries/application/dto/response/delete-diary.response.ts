import { Diary, RecommendedFood, DiaryEmotion } from '@prisma/client';

export class DeleteDiaryResponse {
  id: number;
  userId: number;
  recommendedFoodList: Array<RecommendedFood>;
  diaryEmotionList: Array<DiaryEmotion>;
  title: string;
  content: string;
  weather: string;
  publishedDate: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;

  constructor(
    id: number,
    userId: number,
    recommendedFoodList: Array<RecommendedFood>,
    diaryEmotionList: Array<DiaryEmotion>,
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
    this.recommendedFoodList = recommendedFoodList;
    this.diaryEmotionList = diaryEmotionList;
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

    // 추후에 감정분석과 연계돼서 작성 예정
    const recommendedFoodList: Array<RecommendedFood> = [];
    const diaryEmotionList: Array<DiaryEmotion> = [];
    return new DeleteDiaryResponse(
      Number(id),
      Number(userId),
      recommendedFoodList,
      diaryEmotionList,
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
