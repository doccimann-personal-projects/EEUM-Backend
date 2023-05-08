import { Inject, Injectable } from '@nestjs/common';
import { CreateDiaryRequest } from '../dto/request/create-diary.request';
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
import { User } from '@prisma/client';
import { MessageProducer } from '../../../messaging/message.producer';
import { DiaryMessageProducer } from '../producer/diary-message.producer';
import { DiaryCreatedMessage } from '../../../boards/application/dto/message/diary-created.message';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DiariesService {
  constructor(
    @Inject('DiaryRepository')
    private readonly diaryRepository: DiaryRepository,
    private readonly diaryMessageProducer: DiaryMessageProducer,
    private readonly prismaService: PrismaService,
  ) {}
  async create(
    // user: User,
    createDiaryRequest: CreateDiaryRequest,
  ): Promise<CreateDiaryResponse> {
    return this.prismaService.$transaction(async () =>
      this.getCreateTransaction(createDiaryRequest),
    );
  }

  async findDiary(diaryId: number) {
    const foundedDiary = await this.diaryRepository.findDiary(BigInt(diaryId));
    const diary = ReadDiaryResponse.fromEntity(foundedDiary);
    // id, emotion, createdAt
    diary['diaryEmotion'] =
      foundedDiary['diaryEmotionList'].length !== 0
        ? diaryEmotions.fromEntity(foundedDiary['diaryEmotionList'])
        : null;
    // id, foodName, createdAt
    // 이후에 사진 URL로 변경 예정
    diary['recommendedFood'] =
      foundedDiary['recommendedFoodList'].length !== 0
        ? recommendedFoods.fromEntity(foundedDiary['recommendedFoodList'])
        : null;
    return { diary };
  }

  async getPaginatedDiaries(userId: bigint, page: number, elements: number) {
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

  // 일기 생성에 대한 트랜잭션을 처리하는 메소드
  async getCreateTransaction(
    createDiaryRequest: CreateDiaryRequest,
  ): Promise<CreateDiaryResponse> {
    // const diary = createDiaryRequest.toDiaryEntity(user.id);
    const diary = createDiaryRequest.toDiaryEntity(BigInt(1));
    const createdDiary = await this.diaryRepository.create(diary);

    // 일기 생성 이후, 일기 생성에 대한 메시지를 발행한다
    const createdMessage = DiaryCreatedMessage.fromEntity(createdDiary);
    await this.diaryMessageProducer.produceCreatedMessage(createdMessage);

    // 응답 dto 반환
    return CreateDiaryResponse.fromEntity(createdDiary);
  }
}
