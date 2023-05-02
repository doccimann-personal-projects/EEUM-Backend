export class diaryEmotions {
  id: number;
  emotion: string;
  createdAt: Date;

  constructor(id: number, emotion: string, createdAt: Date) {
    this.id = id;
    this.emotion = emotion;
    this.createdAt = createdAt;
  }

  static fromEntity(diaryEmotion: toDiaryEmotions) {
    const { id, emotion, createdAt } = diaryEmotion;
    return new diaryEmotions(Number(id), emotion, createdAt);
  }
}

export interface toDiaryEmotions {
  id: bigint;
  emotion: string;
  createdAt: Date;
}

export interface toIntDiaryEmotions {
  emotionId: number;
  emotion: string;
  createdAt: Date;
}
