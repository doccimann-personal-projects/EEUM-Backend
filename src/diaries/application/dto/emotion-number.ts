export class diaryEmotions {
  diaryEmotionList: Array<toIntDiaryEmotions>;

  constructor(diaryEmotionList: Array<toIntDiaryEmotions>) {
    this.diaryEmotionList = diaryEmotionList;
  }

  static fromEntity(
    diaryEmotion: Array<toDiaryEmotions>,
  ): Array<toIntDiaryEmotions> {
    const diaryEmotionList: Array<toIntDiaryEmotions> = diaryEmotion.reduce(
      (map: Array<toIntDiaryEmotions>, value: toDiaryEmotions) => {
        const obj: toIntDiaryEmotions = {
          id: Number(value['id']),
          emotion: value['emotion'],
          createdAt: value['createdAt'],
        };
        map.push(obj);
        return map;
      },
      [],
    );
    return diaryEmotionList;
  }
}

export interface toDiaryEmotions {
  id: bigint;
  emotion: string;
  createdAt: Date;
}

export interface toIntDiaryEmotions {
  id: number;
  emotion: string;
  createdAt: Date;
}
