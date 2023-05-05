import { DiaryRepository } from '../domain/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginatedDiaries } from '../application/dto/response/read-diaries.response';
import { diaryDetails } from '../application/dto/response/read-diary.response';
import { count } from '../application/dto/response/delete-diary.response';

@Injectable()
export class DiaryDao implements DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(diary: Omit<Diary, 'id'>): Promise<Diary> {
    return this.prismaService.diary.create({
      data: diary,
    });
  }

  async findDiary(diaryId: bigint): Promise<diaryDetails> {
    return this.prismaService.diary.findUnique({
      where: { id: diaryId },
      include: {
        recommendedFoodList: {
          select: {
            id: true,
            foodName: true,
            createdAt: true,
          },
        },
        diaryEmotionList: {
          select: {
            id: true,
            emotion: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getPaginatedDiaries(
    userId: bigint,
    page: number,
    elements: number,
  ): Promise<Array<paginatedDiaries>> {
    return await this.prismaService.diary.findMany({
      where: {
        userId: userId,
        isDeleted: Boolean(0),
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
            emotion: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllDiaries(): Promise<number> {
    return await this.prismaService.diary.count();
  }

  async deleteDiary(diaryId: number): Promise<Diary> {
    return await this.prismaService.diary.update({
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
    return await this.prismaService.diaryEmotion.updateMany({
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
    return await this.prismaService.recommendedFood.updateMany({
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
