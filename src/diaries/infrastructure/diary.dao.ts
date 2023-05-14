import { DiaryRepository } from '../domain/repository/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { count } from '../application/dto/response/delete-diary.response';
import { DetailDiaryEntity } from '../domain/entity/detail-diary.entity';
import { getCurrentUtcDate } from '../../common/utils/date-utils';

@Injectable()
export class DiaryDao implements DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(diary: Omit<Diary, 'id'>): Promise<Diary> {
    return this.prismaService.diary.create({
      data: diary,
    });
  }

  async findUndeletedDetailDiary(diaryId: number): Promise<DetailDiaryEntity> {
    return this.prismaService.diary.findFirst({
      where: {
        id: diaryId,
        isDeleted: false,
      },
      include: {
        diaryEmotionList: {
          select: {
            angryScore: true,
            worryScore: true,
            happyScore: true,
            excitedScore: true,
            sadScore: true,
          },
        },
        recommendedFoodList: {
          select: {
            foodName: true,
          },
        },
      },
    });
  }

  async findUndeletedDiary(diaryId: number): Promise<Diary | null> {
    return this.prismaService.diary.findFirst({
      where: {
        id: diaryId,
        isDeleted: false,
      },
    });
  }

  async getPaginatedDiaries(
    userId: number,
    page: number,
    elements: number,
  ): Promise<Array<Partial<DetailDiaryEntity>>> {
    return this.prismaService.diary.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
      skip: elements * (page - 1),
      take: elements,
      select: {
        id: true,
        title: true,
        publishedDate: true,
        recommendedFoodList: {
          select: {
            foodName: true,
          },
        },
        diaryEmotionList: {
          select: {
            angryScore: true,
            worryScore: true,
            happyScore: true,
            excitedScore: true,
            sadScore: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(): Promise<number> {
    return this.prismaService.diary.count({
      where: { isDeleted: false },
    });
  }

  async deleteDiary(diaryId: number): Promise<Diary | null> {
    // diaryId는 unique한 값이기 때문에 1개만 삭제가 이루어진다
    const deletedDiary = await this.prismaService.diary.update({
      where: {
        id: diaryId,
      },
      data: {
        updatedAt: getCurrentUtcDate(),
        deletedAt: getCurrentUtcDate(),
        isDeleted: true,
      },
    });

    return deletedDiary ? deletedDiary : null;
  }

  async deleteEmotion(diaryId: number): Promise<count> {
    return this.prismaService.diaryEmotion.updateMany({
      where: {
        diaryId: diaryId,
      },
      data: {
        updatedAt: getCurrentUtcDate(),
        deletedAt: getCurrentUtcDate(),
        isDeleted: true,
      },
    });
  }

  async deleteFood(diaryId: number): Promise<count> {
    return this.prismaService.recommendedFood.updateMany({
      where: {
        diaryId: diaryId,
      },
      data: {
        updatedAt: getCurrentUtcDate(),
        deletedAt: getCurrentUtcDate(),
        isDeleted: true,
      },
    });
  }
}
