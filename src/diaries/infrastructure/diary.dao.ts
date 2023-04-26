import { DiaryRepository } from '../domain/diary.repository';
import { Diary } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// 아직 도엽님이 작성하신 코드에서 PrismaService를 사용하는 코드가 이해되지 않아서 원래 제가 쓰던 방식으로 임의 작성했습니다. 이후 변경 예정입니다.
const prisma = new PrismaClient();

@Injectable()
export class DiaryDao implements DiaryRepository {
  async create(diary: Diary): Promise<Diary> {
    // TODO
    return await prisma.diary.create({
      data: diary,
    });
  }
}
