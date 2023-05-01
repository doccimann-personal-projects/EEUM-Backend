export class recommendedFoods {
  id: number;
  emotion: string;
  createdAt: Date;

  constructor(id: number, emotion: string, createdAt: Date) {
    this.id = id;
    this.emotion = emotion;
    this.createdAt = createdAt;
  }

  static fromEntity(diaryEmotion: toRecommendedFoods) {
    const { id, foodName, createdAt } = diaryEmotion;
    return new recommendedFoods(Number(id), foodName, createdAt);
  }
}

export interface toRecommendedFoods {
  id: bigint;
  foodName: string;
  createdAt: Date;
}

export interface toIntRecommendedFoods {
  foodId: number;
  foodName: string;
  createdAt: Date;
}
