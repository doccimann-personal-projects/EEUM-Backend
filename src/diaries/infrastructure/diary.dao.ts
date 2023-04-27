import { DiaryRepository } from '../domain/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DiaryDao implements DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(diary: Omit<Diary, 'id'>): Promise<Diary> {
    return this.prismaService.diary.create({
      data: diary,
    });
  }
}
