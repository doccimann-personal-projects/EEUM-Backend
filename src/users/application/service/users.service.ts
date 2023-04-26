import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { UserRepository } from '../../domain/user.repository';
import { CreateUserResponse } from '../dto/response/create-user.response';
import { UserValidator } from '../validator/user.validator';
import { ResourceDuplicatedException } from '../../../common/customExceptions/resource-duplicated.exception';
import { AddressInfoRepository } from '../../domain/address-info.repository';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('AddressInfoRepository')
    private readonly addressInfoRepository: AddressInfoRepository,
    private readonly userValidator: UserValidator,
    private readonly prismaService: PrismaService,
  ) {}

  // 트랜잭션 단위로 회원가입 로직을 처리하는 메소드
  async signup(createRequest: CreateUserRequest): Promise<CreateUserResponse> {
    // 트랜잭션을 이용해서 생성 요청을 처리
    return await this.prismaService.$transaction(async () =>
      this.getSignupTransaction(createRequest),
    );
  }

  // 회원가입 트랜잭션 내부의 로직을 정의하는 private 메소드
  private async getSignupTransaction(
    createRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    // 1. 생성 이전에 검증
    const validationResult = await this.userValidator.isCreatable(
      createRequest,
    );

    if (!validationResult.success) {
      throw new ResourceDuplicatedException(validationResult.message);
    }

    // 2. password를 bcrypt를 이용해 해싱
    const hashedRequest = await createRequest.getHashedRequest();

    // 3. 요청 dto로부터 user 엔티티 추출 후 생성 쿼리를 이용해 사용자 생성
    const user = hashedRequest.toUserEntity();

    const createdUser = await this.userRepository.create(user);

    // 4. 요청 dto로부터 addressInfo 엔티티 추출 후 생성 쿼리를 이용해 주소 생성
    const addressInfo = hashedRequest.toAddressInfoEntity(createdUser.id);

    const createdAddressInfo = await this.addressInfoRepository.create(
      addressInfo,
    );

    // 5. 응답 DTO를 정의하고 반환
    return CreateUserResponse.fromEntities(createdUser, createdAddressInfo);
  }
}
