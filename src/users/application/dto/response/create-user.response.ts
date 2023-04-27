import { AddressInfo, Gender, Role, Status, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty({
    description: '식별자 값입니다.',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '이메일을 입력해주세요! 중복은 허용하지 않습니다!',
    example: 'test@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '식별자 값입니다.',
    example: { firstName: '도엽', lastName: '김' },
    required: true,
  })
  nameInfo: NameInfo;

  @ApiProperty({
    description: '닉네임을 입력해주세요! 중복은 허용하지 않습니다!',
    example: 'Brian',
    required: true,
  })
  nickname: string;

  @ApiProperty({
    description: '휴대폰 번호를 입력하세요! 한국 휴대폰 번호만 허용합니다!',
    example: '010-1234-1234',
    required: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: '성별을 입력하세요! MALE, FEMALE 둘 중 하나만 가능합니다!',
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
    description: '프로필 사진 url을 입력하세요! 없다면 안 던져도 됩니다!',
    examples: [null, 'http://any-prpfile'],
    required: true,
  })
  profilePhotoUrl: string | null;

  @ApiProperty({
    description: '사용자 권한입니다.',
    example: 'USER',
    default: 'USER',
    required: true,
  })
  role: Role;

  @ApiProperty({
    description: '회원의 상태 값입니다. 기본값은 REGISTERED 입니다.',
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

interface NameInfo {
  firstName: string;
  lastName: string;
}

interface BirthInfo {
  year: number;
  month: number;
  date: number;
}

interface Address {
  zipCode: number;
  mainAddress: string;
  detailAddress: string;
}
