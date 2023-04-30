import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user.repository';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { ValidationResult } from '../../../common/validation/validation.result';

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
      return ValidationResult.getFailureResult('중복된 이매일입니다');
    }

    // 2. nickname이 중복인가?
    const findByNickname =
      await this.userRepository.findRegisteredUserByNickname(nickname);

    if (findByNickname) {
      return ValidationResult.getFailureResult('중복된 닉네임입니다');
    }

    return ValidationResult.getSuccessResult();
  }
}
