import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user.repository';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { ValidationResult } from '../../../common/validation/validation.result';
import { User } from '@prisma/client';
import { ResourceDuplicatedException } from '../../../common/customExceptions/resource-duplicated.exception';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';

@Injectable()
export class UserValidator {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async isCreatable(
    createRequest: CreateUserRequest,
  ): Promise<ValidationResult> {
    const { email, nickname } = createRequest;

    // 1. email이 중복인가?
    const findByEmail = await this.userRepository.findRegisteredUserByEmail(
      email,
    );

    if (findByEmail) {
      return ValidationResult.getFailureResult(
        new ResourceDuplicatedException('중복된 이메일입니다'),
      );
    }

    // 2. nickname이 중복인가?
    const findByNickname =
      await this.userRepository.findRegisteredUserByNickname(nickname);

    if (findByNickname) {
      return ValidationResult.getFailureResult(
        new ResourceDuplicatedException('중복된 닉네임입니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }

  // 수정 가능한 요청인지 검증하는 메소드
  async isUpdatable(user: User, userId: number): Promise<ValidationResult> {
    // 1. user의 id와 userId가 일치하는가?
    if (Number(user.id) !== userId) {
      return ValidationResult.getFailureResult(
        new NotAuthorizedException('허용되지 않은 접근입니다'),
      );
    }

    // 2. 바꾸려는 닉네임이 중복인가?
    const findByNickname =
      await this.userRepository.findRegisteredUserByNickname(user.nickname);

    if (userId !== Number(findByNickname.id) && findByNickname) {
      return ValidationResult.getFailureResult(
        new ResourceDuplicatedException('중복된 닉네임입니다'),
      );
    }

    return ValidationResult.getSuccessResult();
  }
}
