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
      status: undefined,
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
});
