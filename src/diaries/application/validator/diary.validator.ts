import { Inject, Injectable } from '@nestjs/common';
import { DiaryRepository } from '../../domain/repository/diary.repository';
import { ValidationResult } from '../../../common/validation/validation.result';
import { ResourceNotFoundException } from '../../../common/customExceptions/resource-not-found.exception';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';

@Injectable()
export class DiaryValidator {
  constructor(
    @Inject('DiaryRepository')
    private readonly diaryRepository: DiaryRepository,
  ) {}

  async isDeletable(
    diaryId: number,
    userId: number,
  ): Promise<ValidationResult> {
    const foundDiary = await this.diaryRepository.findUndeletedDiary(diaryId);

    if (!foundDiary) {
      return ValidationResult.getFailureResult(
        new ResourceNotFoundException('해당되는 일기가 없습니다'),
      );
    }

    if (Number(foundDiary.userId) !== userId) {
      return ValidationResult.getFailureResult(
        new NotAuthorizedException('잘못된 접근입니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }
}
