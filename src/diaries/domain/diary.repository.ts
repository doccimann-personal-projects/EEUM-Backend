import { Diary } from '@prisma/client';

export interface DiaryRepository {
  create(diary: Omit<Diary, 'id'>): Promise<Diary>;
}
