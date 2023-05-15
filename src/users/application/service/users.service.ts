import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../dto/jwt-payload';
import { Status, User } from '@prisma/client';
import { ResourceNotFoundException } from '../../../common/customExceptions/resource-not-found.exception';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { CreateUserResponse } from '../dto/response/create-user.response';
import { LoginUserRequest } from '../dto/request/login-user.request';
import { LoginUserResponse } from '../dto/response/login-user.response';
import { ReadUserResponse } from '../dto/response/read-user.response';
import { UserValidator } from '../validator/user.validator';
import { UserRepository } from '../../domain/repository/user.repository';
import { AddressInfoRepository } from '../../domain/repository/address-info.repository';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';
import { DeleteUserResponse } from '../dto/response/delete-user.response';
import { UpdateUserRequest } from '../dto/request/update-user.request';
import { UpdateUserResponse } from '../dto/response/update-user.response';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('AddressInfoRepository')
    private readonly addressInfoRepository: AddressInfoRepository,
    private readonly userValidator: UserValidator,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 트랜잭션 단위로 회원가입 로직을 처리하는 메소드
  async signup(createRequest: CreateUserRequest): Promise<CreateUserResponse> {
    return await this.prismaService.$transaction(async () =>
      this.getSignupTransaction(createRequest),
    );
  }

  // 로그인을 처리하는 메소드
  async login(loginRequest: LoginUserRequest): Promise<LoginUserResponse> {
    return await this.prismaService.$transaction(async () =>
      this.getLoginTransaction(loginRequest),
    );
  }

  // payload로부터 user entity를 가져오는 메소드
  async getUserFromPayload(payload: JwtPayload): Promise<User> {
    return this.prismaService.$transaction(async () =>
      this.getUserFromPayloadTransaction(payload),
    );
  }

  // 프로필 조회를 처리하는 메소드
  async getProfile(user: User): Promise<ReadUserResponse> {
    // 트랜잭션을 이용해서 생성 요청을 처리
    return await this.prismaService.$transaction(async () =>
      this.getProfileTransaction(user),
    );
  }

  // 회원 탈퇴를 처리하는 메소드
  async unregisterUser(
    user: User,
    userId: number,
  ): Promise<DeleteUserResponse> {
    return await this.prismaService.$transaction(async () =>
      this.unregisterUserTransaction(user, userId),
    );
  }

  // 유저를 업데이트 처리하는 메소드
  async update(
    user: User,
    userId: number,
    updateRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return await this.prismaService.$transaction(async () =>
      this.updateUserTransaction(user, userId, updateRequest),
    );
  }

  // 회원가입 트랜잭션 내부의 로직을 정의하는 private 메소드
  private async getSignupTransaction(
    createRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const validationResult = await this.userValidator.isCreatable(
      createRequest,
    );

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    const hashedRequest = await createRequest.getHashedRequest();

    const user = hashedRequest.toUserEntity();

    const createdUser = await this.userRepository.create(user);

    const addressInfo = hashedRequest.toAddressInfoEntity(createdUser.id);

    const createdAddressInfo = await this.addressInfoRepository.create(
      addressInfo,
    );

    // 5. 응답 DTO를 정의하고 반환
    return CreateUserResponse.fromEntities(createdUser, createdAddressInfo);
  }

  private async getLoginTransaction(
    loginRequest: LoginUserRequest,
  ): Promise<LoginUserResponse> {
    const { email, password } = loginRequest;

    const userByEmail = await this.userRepository.findRegisteredUserByEmail(
      email,
    );

    if (!userByEmail) {
      throw new ResourceNotFoundException(
        '사용자 이메일 또는 패스워드를 다시 확인해주세요',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userByEmail.password,
    );

    if (!isPasswordValid) {
      throw new ResourceNotFoundException(
        '사용자 이메일 또는 페스워드를 다시 확인해주세요',
      );
    }

    const payload: JwtPayload = {
      id: Number(userByEmail.id),
      email: userByEmail.email,
      role: userByEmail.role,
    };

    return new LoginUserResponse(this.jwtService.sign(payload));
  }

  private async getUserFromPayloadTransaction(
    payload: JwtPayload,
  ): Promise<User> {
    const { id } = payload;

    const foundUser = await this.userRepository.findById(id);

    if (!foundUser || foundUser.status === Status.UNREGISTERED) {
      throw new ResourceNotFoundException('올바르지 않은 접근입니다');
    }

    return foundUser;
  }

  // 프로필 조회 트랜잭션 쿼리들을 정의하는 메소드
  private async getProfileTransaction(user: User): Promise<ReadUserResponse> {
    const foundAddressInfo = await this.addressInfoRepository.findByUserId(
      Number(user.id),
    );

    return ReadUserResponse.fromEntities(user, foundAddressInfo);
  }

  // 회원탈퇴 트랜잭션 쿼리들을 정의하는 메소드
  private async unregisterUserTransaction(
    user: User,
    userId: number,
  ): Promise<DeleteUserResponse> {
    if (Number(user.id) !== userId) {
      throw new NotAuthorizedException('허용되지 않은 접근입니다');
    }

    const deletedUser = await this.userRepository.deleteById(Number(user.id));
    await this.addressInfoRepository.deleteByUserId(Number(user.id));

    return DeleteUserResponse.fromEntity(deletedUser);
  }

  // 유저 정보 업데이트 트랜잭션 쿼리들을 정의하는 메소드
  private async updateUserTransaction(
    user: User,
    userId: number,
    updateRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    // 업데이트 가능한지 검증
    const validationResult = await this.userValidator.isUpdatable(user, userId);

    if (!validationResult.success) {
      throw validationResult.exception;
    }

    // 패스워드를 해싱한다
    const hashedRequest = await updateRequest.getHashedRequest();

    // 업데이트 데이터들을 가져온다
    const userUpdateData = hashedRequest.toUserUpdateData();
    const addressInfoUpdatedata = hashedRequest.toAddressInfoUpdateData();

    // user와 addressInfo를 조인해서 가져온다
    const userWithAddress =
      await this.userRepository.findRegisteredUserJoinAddressInfoById(userId);

    // 업데이트 수행
    const updatedUser = await this.userRepository.update(
      userId,
      userUpdateData,
    );
    const updatedAddress = await this.addressInfoRepository.update(
      Number(userWithAddress.addressInfo.id),
      addressInfoUpdatedata,
    );

    return UpdateUserResponse.fromEntites(updatedUser, updatedAddress);
  }
}
