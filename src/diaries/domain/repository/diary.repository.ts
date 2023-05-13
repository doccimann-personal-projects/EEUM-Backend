import { Diary } from '@prisma/client';
import { count } from '../../application/dto/response/delete-diary.response';
import { DetailDiaryEntity } from '../entity/detail-diary.entity';

export interface DiaryRepository {
  create(diary: Omit<Diary, 'id'>): Promise<Diary>;

  findUndeletedDiary(diaryId: bigint): Promise<DetailDiaryEntity | null>;

  getPaginatedDiaries(
    userId: bigint,
    page: number,
    elements: number,
  ): Promise<Array<Partial<DetailDiaryEntity>>>;

  count(): Promise<number>;

  deleteDiary(diaryId: number): Promise<Diary>;

  deleteEmotion(diaryId: bigint): Promise<count>;

  deleteFood(diaryId: bigint): Promise<count>;
}
