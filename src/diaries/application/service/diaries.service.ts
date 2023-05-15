import { Inject, Injectable } from '@nestjs/common';
import { CreateDiaryRequest } from '../dto/request/create-diary.request';
import { DiaryRepository } from 'src/diaries/domain/repository/diary.repository';
import { CreateDiaryResponse } from '../dto/response/create-diary.response';
import { PaginatedDiaryResponse } from '../dto/response/paginated-diary.response';
import { ReadDiaryResponse } from '../dto/response/read-diary.response';
import { DeleteDiaryResponse } from '../dto/response/delete-diary.response';
import { DiaryMessageProducer } from '../producer/diary-message.producer';
import { DiaryCreatedMessage } from '../../../boards/application/dto/message/diary-created.message';
import { PrismaService } from '../../../prisma/prisma.service';
import { DiaryValidator } from '../validator/diary.validator';

@Injectable()
export class DiariesService {
  constructor(
    @Inject('DiaryRepository')
    private readonly diaryRepository: DiaryRepository,
    private readonly diaryValidator: DiaryValidator,
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

  async findDiary(diaryId: number): Promise<ReadDiaryResponse | null> {
    const foundDiary = await this.diaryRepository.findUndeletedDetailDiary(
      diaryId,
    );

    return foundDiary ? ReadDiaryResponse.fromDetailEntity(foundDiary) : null;
  }

  async getPaginatedDiaries(
    userId: number,
    page: number,
    elements: number,
  ): Promise<[Array<PaginatedDiaryResponse>, number]> {
    const [foundDiaries, totalElements] = await Promise.all([
      this.diaryRepository.getPaginatedDiaries(userId, page, elements),
      this.diaryRepository.count(),
    ]);

    const diariesResponse = foundDiaries?.map((diary) =>
      PaginatedDiaryResponse.fromPartialEntity(diary),
    );

    return [diariesResponse, totalElements];
  }

  async deleteDiary(diaryId: number): Promise<DeleteDiaryResponse | null> {
    const validationResult = await this.diaryValidator.isDeletable(diaryId);

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    await this.diaryRepository.deleteEmotion(diaryId);
    await this.diaryRepository.deleteFood(diaryId);
    const deletedDiary = await this.diaryRepository.deleteDiary(diaryId);
    return deletedDiary ? DeleteDiaryResponse.fromEntity(deletedDiary) : null;
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
