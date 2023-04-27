import { Diary } from '@prisma/client';

export class CreateDiaryResponse {
  constructor(
    readonly id: number,
    readonly userId: number,
    readonly recommandedFoodList: number[],
    readonly diaryEmotionList: number[],
    readonly title: string,
    readonly content: string,
    readonly weather: string,
    readonly publishedDate: Date,
    readonly createdAt: Date,
  ) {}

  static fromEntity(diary: Diary): CreateDiaryResponse {
    const { id, userId, title, content, weather, publishedDate, createdAt } =
      diary;

    // 추후에 감정분석과 연계돼서 작성 예정
    const recommandedFoodList: number[] = [];
    const diaryEmotionList: number[] = [];

    return new CreateDiaryResponse(
      Number(id),
      Number(userId),
      recommandedFoodList,
      diaryEmotionList,
      title,
      content,
      weather,
      publishedDate,
      createdAt,
    );
  }
}
