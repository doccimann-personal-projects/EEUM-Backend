import { DiaryRepository } from '../domain/repository/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { count } from '../application/dto/response/delete-diary.response';
import { DetailDiaryEntity } from '../domain/entity/detail-diary.entity';

@Injectable()
export class DiaryDao implements DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(diary: Omit<Diary, 'id'>): Promise<Diary> {
    return this.prismaService.diary.create({
      data: diary,
    });
  }

  async findUndeletedDiary(diaryId: bigint): Promise<DetailDiaryEntity> {
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

  async getPaginatedDiaries(
    userId: bigint,
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

  async deleteDiary(diaryId: number): Promise<Diary> {
    return this.prismaService.diary.update({
      where: {
        id: diaryId,
      },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
        isDeleted: Boolean(1),
      },
    });
  }

  async deleteEmotion(diaryId: bigint): Promise<count> {
    return this.prismaService.diaryEmotion.updateMany({
      where: {
        diaryId: diaryId,
      },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
        isDeleted: Boolean(1),
      },
    });
  }

  async deleteFood(diaryId: bigint): Promise<count> {
    return this.prismaService.recommendedFood.updateMany({
      where: {
        diaryId: diaryId,
      },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
        isDeleted: Boolean(1),
      },
    });
  }
}
