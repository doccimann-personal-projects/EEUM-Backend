import { Diary } from '@prisma/client';
import { SearchOption } from '../application/dto/request/search-option.request';

export interface DiaryRepository {
  create(diary: Omit<Diary, 'id'>): Promise<Diary>;

  findOne(diaryId: bigint): Promise<Diary>;

  findLists(query: SearchOption): Promise<object>;
}
