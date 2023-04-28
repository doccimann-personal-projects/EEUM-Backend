import { Inject, Injectable } from '@nestjs/common';
import { CreateDiaryDto } from '../dto/request/create-diary.request';
import { UpdateDiaryDto } from '../dto/request/update-diary.request';
import { DiaryRepository } from 'src/diaries/domain/diary.repository';
import { CreateDiaryResponse } from '../dto/response/create-diary.response';
import { SearchOption } from '../../application/dto/request/search-option.request';
import { SearchOptionResponse } from '../dto/response/search-option.response';

@Injectable()
export class DiariesService {
  constructor(
    @Inject('DiaryRepository')
    private readonly diaryRepository: DiaryRepository,
  ) {}
  async create(createDiaryDto: CreateDiaryDto) {
    // userId 로그인 구현 전 임의로 넣어놓은 userId
    const diary = createDiaryDto.toDiaryEntity(BigInt(1));
    const createdDiary = await this.diaryRepository.create(diary);
    return CreateDiaryResponse.fromEntity(createdDiary);
  }

  async findOne(diaryId: number) {
    const foundedDiary = await this.diaryRepository.findOne(BigInt(diaryId));
    return CreateDiaryResponse.fromEntity(foundedDiary);
  }

  async findLists(query: SearchOption) {
    const foundedDiaries = await this.diaryRepository.findLists(query);
    return SearchOptionResponse.fromEntities(
      foundedDiaries['foundDiaries'],
      foundedDiaries['totalElements'],
      foundedDiaries['totalPages'],
      query,
    );
  }
}
