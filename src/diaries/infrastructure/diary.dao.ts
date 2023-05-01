import { DiaryRepository } from '../domain/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginatedDiaries } from '../application/dto/response/read-diaries.response';

@Injectable()
export class DiaryDao implements DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(diary: Omit<Diary, 'id'>): Promise<Diary> {
    return this.prismaService.diary.create({
      data: diary,
    });
  }

  async findOne(diaryId: bigint): Promise<Diary> {
    return this.prismaService.diary.findUnique({ where: { id: diaryId } });
  }

  async getPaginatedDiaries(
    page: number,
    elements: number,
  ): Promise<Array<paginatedDiaries>> {
    return await this.prismaService.diary.findMany({
      skip: elements * (page - 1),
      take: elements,
      select: {
        id: true,
        title: true,
      },
    });
  }

  async getAllDiaries(): Promise<number> {
    return await this.prismaService.diary.count();
  }
}
