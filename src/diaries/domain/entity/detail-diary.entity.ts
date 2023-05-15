import { Diary, DiaryEmotion, RecommendedFood } from '@prisma/client';

// Diary와 diaryEmotionList, recommendedFoodList를 join해서 가져올 때의 타입 정의
export type DetailDiaryEntity = Diary & {
  readonly diaryEmotionList: Partial<DiaryEmotion>[];
  readonly recommendedFoodList: Partial<RecommendedFood>[];
};
