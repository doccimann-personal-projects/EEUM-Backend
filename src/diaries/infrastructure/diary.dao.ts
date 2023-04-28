import { DiaryRepository } from '../domain/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchOption } from '../application/dto/request/search-option.request';

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

  async findLists(query: SearchOption) {
    const searchOptions = query.toSearchEntity();
    const { page, elements } = searchOptions;
    const foundDiaries = await this.prismaService.diary.findMany({
      skip: elements * (page - 1),
      take: elements,
      select: {
        id: true,
        title: true,
      },
    });
    const totalElements = await this.prismaService.diary.count();

    const totalPages = Math.ceil(totalElements / elements);
    return { foundDiaries, totalElements, totalPages };
  }
}
