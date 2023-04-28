import { AddressInfo, Gender, Role, Status, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Address, BirthInfo, NameInfo } from './common/response.types';

export class CreateUserResponse {
  @ApiProperty({
    description: '사용자 식별자',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '이메일',
    example: 'test@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '이름 정보',
    example: { firstName: '도엽', lastName: '김' },
    required: true,
  })
  nameInfo: NameInfo;

  @ApiProperty({
    description: '닉네임',
    example: 'Brian',
    required: true,
  })
  nickname: string;

  @ApiProperty({
    description: '휴대폰번호',
    example: '010-1234-1234',
    required: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: '성별',
    examples: ['MALE', 'FEMALE'],
    required: true,
  })
  gender: Gender;

  @ApiProperty({
    description: '생년월일 정보입니다.',
    example: { year: 1999, month: 3, date: 25 },
    required: true,
  })
  birthInfo: BirthInfo;

  @ApiProperty({
    description: '프로필 사진 url',
    examples: [null, 'http://any-prpfile'],
    required: true,
  })
  profilePhotoUrl: string | null;

  @ApiProperty({
    description: '사용자 권한',
    example: 'USER',
    default: 'USER',
    required: true,
  })
  role: Role;

  @ApiProperty({
    description: '회원의 상태 값',
    example: 'REGISTERED',
    required: true,
  })
  status: Status;

  @ApiProperty({
    description: '주소 정보입니다.',
    example: {
      zipCode: 30000,
      mainAddress: '서울시 강남구 신사동',
      detailAddress: '신사역 1번 출구',
    },
    required: true,
  })
  addressInfo: Address;

  @ApiProperty({
    description: '생성 일자입니다',
    example: '2023-04-26T13:10:48.000Z',
    required: true,
  })
  createdAt: Date;

  constructor(
    id: number,
    email: string,
    nameInfo: NameInfo,
    nickname: string,
    phoneNumber: string,
    gender: Gender,
    birthInfo: BirthInfo,
    profilePhotoUrl: string | null,
    role: Role,
    status: Status,
    addressInfo: Address,
    createdAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.nameInfo = nameInfo;
    this.nickname = nickname;
    this.phoneNumber = phoneNumber;
    this.gender = gender;
    this.birthInfo = birthInfo;
    this.profilePhotoUrl = profilePhotoUrl;
    this.role = role;
    this.status = status;
    this.addressInfo = addressInfo;
    this.createdAt = createdAt;
  }

  static fromEntities(
    user: User,
    addressInfo: AddressInfo,
  ): CreateUserResponse {
    const {
      id,
      email,
      firstName,
      lastName,
      nickname,
      phoneNumber,
      gender,
      birthYear,
      birthMonth,
      birthDate,
      profilePhotoUrl,
      role,
      status,
      createdAt,
    } = user;

    const { zipCode, mainAddress, detailAddress } = addressInfo;

    const nameInfo: NameInfo = { firstName, lastName };
    const birthInfo: BirthInfo = {
      year: birthYear,
      month: birthMonth,
      date: birthDate,
    };
    const address: Address = { zipCode, mainAddress, detailAddress };

    return new CreateUserResponse(
      Number(id),
      email,
      nameInfo,
      nickname,
      phoneNumber,
      gender,
      birthInfo,
      profilePhotoUrl,
      role,
      status,
      address,
      createdAt,
    );
  }
}
