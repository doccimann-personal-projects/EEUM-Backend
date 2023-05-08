import { Diary } from '@prisma/client';

export class DiaryCreatedMessage {
  constructor(readonly id: number) {}

  static fromEntity(diary: Diary): DiaryCreatedMessage {
    const id = Number(diary.id);
    return new DiaryCreatedMessage(id);
  }
}
