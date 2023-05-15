import { Diary } from '@prisma/client';
import { count } from '../../application/dto/response/delete-diary.response';
import { DetailDiaryEntity } from '../entity/detail-diary.entity';

export interface DiaryRepository {
  create(diary: Omit<Diary, 'id'>): Promise<Diary>;

  // 삭제되지 않은 일기를 가져오면서, 관련된 엔티티들을 가져오는 메소드
  findDetailDiaryByIdAndUserId(
    diaryId: number,
    userId: number,
  ): Promise<DetailDiaryEntity | null>;

  findUndeletedDiary(diaryId: number): Promise<Diary | null>;

  getPaginatedDiaries(
    userId: number,
    page: number,
    elements: number,
  ): Promise<Array<Partial<DetailDiaryEntity>>>;

  count(): Promise<number>;

  // 특정 유저의 일기 총 개수를 반환하는 메소드
  countByUserId(userId: number): Promise<number>;

  deleteDiary(diaryId: number): Promise<Diary | null>;

  deleteEmotion(diaryId: number): Promise<count>;

  deleteFood(diaryId: number): Promise<count>;
}
