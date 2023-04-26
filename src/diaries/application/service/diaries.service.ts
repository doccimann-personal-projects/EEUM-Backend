import { Inject, Injectable } from '@nestjs/common';
import { CreateDiaryDto } from '../dto/request/create-diary.dto';
import { UpdateDiaryDto } from '../dto/request/update-diary.dto';
import { DiaryRepository } from 'src/diaries/domain/diary.repository';

@Injectable()
export class DiariesService {
  constructor(
    @Inject('DiaryRepository')
    private readonly diaryRepository: DiaryRepository,
  ) {}
  async create(createDiaryDto: CreateDiaryDto) {
    // userId 로그인 구현 전 임의로 넣어놓은 userId
    // 이 부분에서 Do not know how to serialize a BigInt 에러가 납니다.
    // 만약 dto에서 Number로 감싸면 Type 'number' is not assignable to type 'bigint' 에러가 발생합니다.
    // Do not know how to serialize a BigInt 에러와 별개로 db에 데이터는 잘 저장됩니다.
    // 여기서 '1', dto에서 userId:string으로 받았을 때와 1, userId:number로 받았을 때 똑같이 에러가 발생합니다. BigInt를 사용하지않고 number 그대로를 넣어도 에러가 발생합니다.
    const diary = createDiaryDto.toDiaryEntity('1');
    return await this.diaryRepository.create(diary);
  }
}
