import { Diary } from '@prisma/client';
import { paginatedDiaries } from '../application/dto/response/read-diaries.response';

export interface DiaryRepository {
  create(diary: Omit<Diary, 'id'>): Promise<Diary>;

  findOne(diaryId: bigint): Promise<Diary>;

  getPaginatedDiaries(
    page: number,
    elements: number,
  ): Promise<Array<paginatedDiaries>>;

  getAllDiaries(): Promise<number>;
}
