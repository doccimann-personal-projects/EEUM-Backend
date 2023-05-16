import { Test, TestingModule } from '@nestjs/testing';
import { UsersServiceImpl } from './users.service.impl';
import { UsersService } from './users.service';
import { UserRepository } from '../../domain/repository/user.repository';
import { AddressInfoRepository } from '../../domain/repository/address-info.repository';
import { UserValidator } from '../validator/user.validator';
import { AddressInfoDao } from '../../infrastructure/address-info.dao';
import { UserDao } from '../../infrastructure/user.dao';
import { PrismaModule } from '../../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AddressInfo, Gender, Role, Status, User } from '@prisma/client';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { ResourceDuplicatedException } from '../../../common/customExceptions/resource-duplicated.exception';
import { ValidationResult } from '../../../common/validation/validation.result';
import { CreateUserResponse } from '../dto/response/create-user.response';
import { LoginUserRequest } from '../dto/request/login-user.request';
import { ResourceNotFoundException } from '../../../common/customExceptions/resource-not-found.exception';
import * as bcrypt from 'bcrypt';
import { LoginUserResponse } from '../dto/response/login-user.response';
import { JwtPayload } from '../dto/jwt-payload';
import { ReadUserResponse } from '../dto/response/read-user.response';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';
import { UpdateUserRequest } from '../dto/request/update-user.request';

describe('UsersService', () => {
  let userRepository: UserRepository;
  let addressInfoRepository: AddressInfoRepository;
  let userValidator: UserValidator;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3h' },
        }),
        PassportModule.register({
          defaultStrategy: 'jwt',
          session: false,
        }),
      ],
      providers: [
        UserValidator,
        UsersServiceImpl,
        {
          provide: 'UserRepository',
          useClass: UserDao,
        },
        {
          provide: 'AddressInfoRepository',
          useClass: AddressInfoDao,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>('UserRepository');
    addressInfoRepository = module.get<AddressInfoRepository>(
      'AddressInfoRepository',
    );
    userValidator = module.get<UserValidator>(UserValidator);
    userService = module.get<UsersService>(UsersServiceImpl);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(addressInfoRepository).toBeDefined();
    expect(userValidator).toBeDefined();
    expect(userService).toBeDefined();
  });

  // 회원가입 테스트
  describe('signup', () => {
    it('이미 존재하는 이메일로 회원가입을 시도한다', async () => {
      /* given */
      const existingEmail = 'brian@example.com';
      const nickname = 'Brian';
      const createRequest = getCreateRequest(existingEmail, nickname);
      const requestedUser: Omit<User, 'id'> = createRequest.toUserEntity();
      const existingUser: User = { id: BigInt(1), ...requestedUser };

      // findRegisteredUserByEmail을 모킹하는 객체
      const findByEmailRepositoryMock = jest
        .spyOn(userRepository, 'findRegisteredUserByEmail')
        .mockResolvedValue(existingUser);

      /* when */
      const validationResult = await userValidator.isCreatable(createRequest);

      /* then */
      // 1. repository의 findRegistereduserByEmail이 정확히 한 번 호출됨을 검증
      expect(findByEmailRepositoryMock).toHaveBeenCalledTimes(1);

      // 2. 중복된 이메일임을 userValidator가 인식한다
      expect(validationResult).toEqual(
        ValidationResult.getFailureResult(
          new ResourceDuplicatedException('중복된 이메일입니다'),
        ),
      );

      // 3. 중복된 이메일에 의해 exception이 발생해야한다
      await expect(async () =>
        userService.signup(createRequest),
      ).rejects.toThrow(ResourceDuplicatedException);
    });

    it('중복된 닉네임으로 회원가입을 시도한다', async () => {
      /* given */
      const email = 'brian@example.com';
      const existingNickname = 'Brian';
      const createRequest = getCreateRequest(email, existingNickname);
      const requestedUser: Omit<User, 'id'> = createRequest.toUserEntity();
      const createdUser: User = { id: BigInt(1), ...requestedUser };

      // findRegisteredUserByNickname 을 모킹하는 객체
      const findByNicknameRepositoryMock = jest
        .spyOn(userRepository, 'findRegisteredUserByNickname')
        .mockResolvedValue(createdUser);

      /* When */
      const validationResult = await userValidator.isCreatable(createRequest);

      /* Then */
      // 1. repository의 mock이 정확히 1회 호출되었음을 보장해야한다
      expect(findByNicknameRepositoryMock).toHaveBeenCalledTimes(1);

      // 2. validation 결과 ResourceDuplicationException을 반환해야한다
      expect(validationResult).toStrictEqual(
        ValidationResult.getFailureResult(
          new ResourceDuplicatedException('중복된 닉네임입니다'),
        ),
      );

      // 3. userService는 ResourceDuplicationException을 뱉어야한다
      await expect(async () =>
        userService.signup(createRequest),
      ).rejects.toThrow(ResourceDuplicatedException);
    });

    it('닉네임과 이메일이 중복되지 않으면 회원가입을 성공 처리한다', async () => {
      /* given */
      const email = 'brian@example.com';
      const nickname = 'Brian';
      const createRequest = getCreateRequest(email, nickname);
      const requestedUser: Omit<User, 'id'> = createRequest.toUserEntity();
      const createdUser: User = { id: BigInt(1), ...requestedUser };
      const requestedAddress: Omit<AddressInfo, 'id'> =
        createRequest.toAddressInfoEntity(createdUser.id);
      const createdAddress: AddressInfo = {
        id: BigInt(1),
        ...requestedAddress,
      };
      const createdUserResponse = CreateUserResponse.fromEntities(
        createdUser,
        createdAddress,
      );

      const findByEmailMock = jest
        .spyOn(userRepository, 'findRegisteredUserByEmail')
        .mockResolvedValue(null);

      const findByNicknameMock = jest
        .spyOn(userRepository, 'findRegisteredUserByNickname')
        .mockResolvedValue(null);

      const createUserMock = jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(createdUser);

      const createAddressMock = jest
        .spyOn(addressInfoRepository, 'create')
        .mockResolvedValue(createdAddress);

      /* When */
      const createUserResponse = await userService.signup(createRequest);

      /* Then */
      expect(findByEmailMock).toHaveBeenCalledTimes(1);
      expect(findByNicknameMock).toHaveBeenCalledTimes(1);
      expect(createUserMock).toHaveBeenCalledTimes(1);
      expect(createAddressMock).toHaveBeenCalledTimes(1);
      expect(createUserResponse).toEqual(createdUserResponse); // 성공적으로 값을 반환하기를 기대한다
    });
  });

  describe('로그인 테스트', () => {
    it('존재하지 않는 이메일로 로그인 시도', async () => {
      /* Mock */
      const email = 'brian@example.com';
      const password = 'brianpassword!';
      const loginRequest = getLoginRequest(email, password);

      const findByEmailMock = jest
        .spyOn(userRepository, 'findRegisteredUserByEmail')
        .mockResolvedValue(null);

      /* When and Then */
      // 해당하는 이메일 계정이 없기를 기대한다
      await expect(() => userService.login(loginRequest)).rejects.toThrow(
        ResourceNotFoundException,
      );
      // 이메일을 기반으로 조회하는 로직이 1회 호출되기를 기대한다
      expect(findByEmailMock).toHaveBeenCalledTimes(1);
    });

    it('일치하지 않는 비밀번호로 로그인 시도', async () => {
      /* Given */
      const email = 'brian@example.com';
      const wrongPassword = 'wrongPassword!';
      const realPassword = 'realPassword!';

      const hashedPassword = await bcrypt.hash(realPassword, 10);
      const loginRequest = getLoginRequest(email, wrongPassword);

      const foundUser = getUser(email, 'brian', hashedPassword);

      const findByEmailMock = jest
        .spyOn(userRepository, 'findRegisteredUserByEmail')
        .mockResolvedValue(foundUser);

      /* When and Then */
      // 패스워드가 틀렸기 때문에 에러가 반환되기를 기대한다
      await expect(async () => userService.login(loginRequest)).rejects.toThrow(
        ResourceNotFoundException,
      );
      // 이메일을 기반으로 1회 조회하기를 기대한다
      expect(findByEmailMock).toHaveBeenCalledTimes(1);
    });

    it('로그인 성공', async () => {
      /* Mock */
      const email = 'brian@example.com';
      const password = 'brianpassword!';

      const hashedPassword = await bcrypt.hash(password, 10);
      const loginRequest = getLoginRequest(email, password);

      const foundUser = getUser(email, 'brian', hashedPassword);

      const findByEmailMock = jest
        .spyOn(userRepository, 'findRegisteredUserByEmail')
        .mockResolvedValue(foundUser);

      /* When */
      const loginResponse = await userService.login(loginRequest);

      /* Then */
      // 이메일을 기반으로 1회 조회하기를 기대한다
      expect(findByEmailMock).toHaveBeenCalledTimes(1);
      // 정상적으로 반환되었는지만 체크한다
      expect(loginResponse).toBeInstanceOf(LoginUserResponse);
    });
  });

  describe('jwt payload를 기반으로 user를 가져온다', () => {
    it('id가 유효하지 않는 경우', async () => {
      /* Given */
      const id = 1;
      const jwtPayload = getJwtPayload(id, 'brian@example.com');

      // id를 기반으로 user를 찾지 못하는 경우
      const findByIdMock = jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(null);

      /* When and Then */
      await expect(async () =>
        userService.getUserFromPayload(jwtPayload),
      ).rejects.toThrow(ResourceNotFoundException);

      expect(findByIdMock).toHaveBeenCalledTimes(1);
    });

    it('탈퇴한 회원 대상으로 인증을 시도하는 경우', async () => {
      /* Given */
      const id = 1;
      const email = 'brian@example.com';
      const jwtPayload = getJwtPayload(id, email);

      const user = getUser(email, 'brian', 'brianPas');
      const foundUser: User = {
        ...user,
        id: BigInt(id),
        status: Status.UNREGISTERED,
      };

      const findByIdMock = jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(foundUser);

      /* When and Then */
      // Status가 Unregistered이기 때문에 조회에 실패한다
      await expect(async () =>
        userService.getUserFromPayload(jwtPayload),
      ).rejects.toThrow(ResourceNotFoundException);

      expect(findByIdMock).toHaveBeenCalledTimes(1);
    });

    it('성공 케이스', async () => {
      /* Given */
      const id = 1;
      const email = 'brian@example.com';
      const jwtPayload = getJwtPayload(id, email);

      const user = getUser(email, 'brian', 'brianPas');
      const foundUser: User = {
        ...user,
        id: BigInt(id),
        status: Status.REGISTERED,
      };

      const findByIdMock = jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(foundUser);

      /* When */
      const result = await userService.getUserFromPayload(jwtPayload);

      /* Then */
      expect(findByIdMock).toHaveBeenCalledTimes(1); // mock이 단 1회 호출
      expect(result).toEqual(foundUser); // 실패 없이 foundUser가 그대로 반환되길 기대한다
    });
  });

  describe('유저 프로필 조회', () => {
    it('성공적으로 유저 프로필을 조회하는 경우', async () => {
      /* Given */
      const user = getUser('brian@example.com', 'brian', 'brian');
      const foundAddressInfo: AddressInfo = getAddressInfo(Number(user.id));
      const readResponse = ReadUserResponse.fromEntities(
        user,
        foundAddressInfo,
      );

      const findAddressByUserIdMock = jest
        .spyOn(addressInfoRepository, 'findByUserId')
        .mockResolvedValue(foundAddressInfo);

      /* When */
      const profile = await userService.getProfile(user);

      /* Then */
      expect(findAddressByUserIdMock).toHaveBeenCalledTimes(1);
      expect(profile).toEqual(readResponse);
    });
  });

  describe('회원탈퇴', () => {
    it('인증된 유저와 요청 유저의 식별자가 다른 경우', async () => {
      /* Given */
      const targetUserId = 1;
      const user = getUser('brian@example.com', 'brian', 'brian');
      const foundUser: User = {
        ...user,
        id: BigInt(2),
      };

      /* When and Then */
      // 조회하고자 하는 userId와 실제 token에 실린 user의 정보가 다르기 때문에 에러를 반환한다
      await expect(async () =>
        userService.withdrawUser(foundUser, targetUserId),
      ).rejects.toThrow(NotAuthorizedException);
    });

    it('성공 케이스', async () => {
      /* Given */
      const targetUserId = 1;
      const user = getUser('brian@example.com', 'brian', 'brian');
      const foundUser: User = {
        ...user,
        id: BigInt(targetUserId),
      };
      const foundAddress = getAddressInfo(targetUserId);

      // mocking
      const deleteUserMock = jest
        .spyOn(userRepository, 'deleteById')
        .mockResolvedValue(foundUser);

      const deleteAddressMock = jest
        .spyOn(addressInfoRepository, 'deleteByUserId')
        .mockResolvedValue(foundAddress);

      /* When */
      const deleteResponse = await userService.withdrawUser(
        foundUser,
        targetUserId,
      );

      /* Then */
      // user table에 삭제 요청이 이루어졌는가
      expect(deleteUserMock).toHaveBeenCalledTimes(1);
      // address table에 삭제 요청이 들어갔는가
      expect(deleteAddressMock).toHaveBeenCalledTimes(1);

      // Assertions
      // 삭제 대상 유저와 삭제된 유저의 식별자는 같아야한다
      expect(deleteResponse.id === Number(foundUser.id)).toEqual(true);
      // 삭제 대상 유저 이메일이 일치하는가
      expect(deleteResponse.email === foundUser.email).toEqual(true);
    });
  });

  describe('회원정보 수정', () => {
    it('인증된 유저와 요청 유저의 식별자가 다른 경우', async () => {
      /* Given */
      const targetUserId = 1;
      const user = getUser('brian@example.com', 'brian', 'brian');
      const foundUser: User = {
        ...user,
        id: BigInt(2),
      };
      const updateRequest = {} as UpdateUserRequest;

      /* When */
      const validationResult = await userValidator.isUpdatable(
        foundUser,
        targetUserId,
      );

      /* Then */
      expect(validationResult).toEqual(
        ValidationResult.getFailureResult(
          new NotAuthorizedException('허용되지 않은 접근입니다'),
        ),
      );
      await expect(async () =>
        userService.update(foundUser, targetUserId, updateRequest),
      ).rejects.toThrow(NotAuthorizedException);
    });

    it('중복된 닉네임으로 변경하려는 경우', async () => {
      /* Given */
      const targetUserId = 1;
      const beforeNickname = 'BrianDYKim'; // 바꾸기 이전 닉네임
      const afterNickname = 'AndyKim'; // 바꾸려고 시도하는 닉네임
      const user = getUser('brian@example.com', 'brian', 'brian');
      const foundUser: User = {
        ...user,
        id: BigInt(targetUserId),
        nickname: beforeNickname,
      };
      const foundUserByNickname: User = {
        ...user,
        id: BigInt(2),
        nickname: afterNickname,
      };
      const updateRequest = {} as UpdateUserRequest;

      // 닉네임을 교체하려는 유저는 아니지만, 바꾸려는 닉네임을 가지고있는 유저는 존재한다
      const findByNicknameMock = jest
        .spyOn(userRepository, 'findRegisteredUserByNickname')
        .mockResolvedValue(foundUserByNickname);

      /* When */
      const validationResult = await userValidator.isUpdatable(
        foundUser,
        targetUserId,
      );

      /* Then */
      // 닉네임 기반 조회를 1회 시행한다
      expect(findByNicknameMock).toHaveBeenCalledTimes(1);
      // 닉네임이 겹치는 유저가 있기 때문에 에러를 기대한다
      expect(validationResult).toEqual(
        ValidationResult.getFailureResult(
          new ResourceDuplicatedException('중복된 닉네임입니다'),
        ),
      );
      await expect(async () =>
        userService.update(foundUser, targetUserId, updateRequest),
      ).rejects.toThrow(ResourceDuplicatedException);
    });

    it('성공 케이스', async () => {
      /* Given */
      const targetUserId = 1;
      const user = getUser('brian@example.com', 'brian', 'brian');
      const foundUser: User = {
        ...user,
        id: BigInt(targetUserId),
        firstName: 'Brian',
      };
      const afterFirstName = 'Andy';
      const updateRequest = new UpdateUserRequest('asd', afterFirstName);

      // 중복된 닉네임을 가진 유저는 없는 경우
      const findByNicknameMock = jest
        .spyOn(userRepository, 'findRegisteredUserByNickname')
        .mockResolvedValue(null);

      /* When */
      const updateResponse = await userService.update(
        foundUser,
        targetUserId,
        updateRequest,
      );

      /* Then */
      // 닉네임 기반 조회는 1회 시행한다
      expect(findByNicknameMock).toHaveBeenCalledTimes(1);
      // firstName이 성공적으로 변환되었음을 기대한다
      const isFirstNameTransformed =
        updateResponse.nameInfo.firstName === afterFirstName;
      expect(isFirstNameTransformed).toEqual(true);
    });
  });

  // 주어진 정보를 가진 user를 생성하는 메소드
  function getUser(email: string, nickname: string, password: string): User {
    return {
      id: BigInt(1),
      birthDate: 0,
      birthMonth: 0,
      birthYear: 0,
      createdAt: undefined,
      deletedAt: undefined,
      email: email,
      firstName: '',
      gender: undefined,
      isDeleted: false,
      lastName: '',
      nickname: nickname,
      password: password,
      phoneNumber: '',
      profilePhotoUrl: '',
      role: undefined,
      status: Status.REGISTERED,
      updatedAt: undefined,
    };
  }

  // 주소 정보를 생성하는 메소드
  function getAddressInfo(userId: number): AddressInfo {
    return {
      id: BigInt(1),
      userId: BigInt(userId),
      zipCode: 30000,
      mainAddress: '경상북도 포항시 북구',
      detailAddress: '영일대 해수욕장',
      createdAt: new Date(),
      deletedAt: undefined,
      isDeleted: false,
      updatedAt: undefined,
    };
  }

  // 생성 요청 dto를 생성하는 메소드
  function getCreateRequest(
    email: string,
    nickname: string,
  ): CreateUserRequest {
    return new CreateUserRequest(
      email,
      'qwe',
      'qwe',
      'qwe',
      nickname,
      '010-1111-1111',
      Gender.MALE,
      0,
      0,
      0,
      '',
      0,
      '',
      '',
    );
  }

  // 로그인 요청 dto를 생성하는 메소드
  function getLoginRequest(email: string, password: string): LoginUserRequest {
    return new LoginUserRequest(email, password);
  }

  // Jwt Payload를 생성하는 메소드
  function getJwtPayload(
    id: number,
    email: string,
    role: Role = Role.USER,
  ): JwtPayload {
    return { id, email, role };
  }
});
