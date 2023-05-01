import { Inject, Injectable } from '@nestjs/common';
import { CreateDiaryDto } from '../dto/request/create-diary.request';
import { UpdateDiaryDto } from '../dto/request/update-diary.request';
import { DiaryRepository } from 'src/diaries/domain/diary.repository';
import { CreateDiaryResponse } from '../dto/response/create-diary.response';
import {
  ReadDiariesResponse,
  paginatedDiaries,
} from '../dto/response/read-diaries.response';
import { ReadDiaryResponse } from '../dto/response/read-diary.response';
import { DeleteDiaryResponse } from '../dto/response/delete-diary.response';
import { diaryEmotions } from '../dto/emotion-number';
import { recommendedFoods } from '../dto/recommendedFood-number';

@Injectable()
export class DiariesService {
  constructor(
    @Inject('DiaryRepository')
    private readonly diaryRepository: DiaryRepository,
  ) {}
  async create(createDiaryDto: CreateDiaryDto): Promise<CreateDiaryResponse> {
    // userId 로그인 구현 전 임의로 넣어놓은 userId
    const diary = createDiaryDto.toDiaryEntity(BigInt(1));
    const createdDiary = await this.diaryRepository.create(diary);
    return CreateDiaryResponse.fromEntity(createdDiary);
  }

  async findDiary(diaryId: number) {
    const foundedDiary = await this.diaryRepository.findDiary(BigInt(diaryId));
    const diary = ReadDiaryResponse.fromEntity(foundedDiary);
    diary['diaryEmotion'] =
      foundedDiary['diaryEmotionList'].length !== 0
        ? diaryEmotions.fromEntity(foundedDiary['diaryEmotionList'][0])
        : null;
    diary['recommendedFood'] =
      foundedDiary['recommendedFoodList'].length !== 0
        ? recommendedFoods.fromEntity(foundedDiary['recommendedFoodList'][0])
        : null;
    return { diary };
  }

  async getPaginatedDiaries(userId: number, page: number, elements: number) {
    const foundedDiaries: Array<paginatedDiaries> =
      await this.diaryRepository.getPaginatedDiaries(userId, page, elements);

    const totalElements: number = await this.diaryRepository.getAllDiaries();

    return ReadDiariesResponse.fromEntities(
      foundedDiaries,
      totalElements,
      page,
      elements,
    );
  }

  async deleteDiary(diaryId: number) {
    await this.diaryRepository.deleteEmotion(BigInt(diaryId));
    await this.diaryRepository.deleteFood(BigInt(diaryId));
    const deletedDiary = await this.diaryRepository.deleteDiary(diaryId);
    return DeleteDiaryResponse.fromEntity(deletedDiary);
  }
}
