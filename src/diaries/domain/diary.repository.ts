import { Diary } from '@prisma/client';
import { paginatedDiaries } from '../application/dto/response/read-diaries.response';
import { diaryDetails } from '../application/dto/response/read-diary.response';

import { count } from '../application/dto/response/delete-diary.response';

export interface DiaryRepository {
  create(diary: Omit<Diary, 'id'>): Promise<Diary>;

  findDiary(diaryId: bigint): Promise<diaryDetails>;

  getPaginatedDiaries(
    userId: bigint,
    page: number,
    elements: number,
  ): Promise<Array<paginatedDiaries>>;

  getAllDiaries(): Promise<number>;

  deleteDiary(diaryId: number): Promise<Diary>;

  deleteEmotion(diaryId: bigint): Promise<count>;

  deleteFood(diaryId: bigint): Promise<count>;
}
