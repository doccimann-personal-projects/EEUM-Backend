import { Gender, Role, Status, User, AddressInfo } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({
    description: '이메일을 입력해주세요! 중복은 허용하지 않습니다!',
    example: 'test@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호를 입력해주세요',
    example: 'qwejkg123@',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '이름을 입력하시면 됩니다!',
    example: '도엽',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: '성을 입력하세요!',
    example: '김',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: '닉네임을 입력해주세요! 중복은 허용하지 않습니다!',
    example: 'Brian',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '휴대폰 번호를 입력하세요! 한국 휴대폰 번호만 허용합니다!',
    example: '010-1234-1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @ApiProperty({
    description: '성별을 입력하세요! MALE, FEMALE 둘 중 하나만 가능합니다!',
    enum: Gender,
    enumName: 'Gender',
    example: Gender.MALE,
    required: true,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: '출생 연도를 입력하세요!',
    example: 1999,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  birthYear: number;

  @ApiProperty({
    description: '출생 일자를 입력하세요!',
    example: 3,
    required: true,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  birthMonth: number;

  @ApiProperty({
    description: '출생 일자를 입력하세요!',
    example: 25,
    required: true,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  birthDate: number;

  @ApiProperty({
    description: '프로필 사진 url을 입력하세요! 없다면 안 던져도 됩니다!',
    example: 'http://any-profile',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @ApiProperty({
    description: '우편번호를 입력해주세요!',
    example: 30000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  zipCode: number;

  @ApiProperty({
    description: '메인 주소를 입력해주세요!',
    example: '서울특별시 강남구 신사동',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mainAddress: string;

  @ApiProperty({
    description: '상세 주소를 입력해주세요!',
    example: '신사역 1번 출구',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  detailAddress: string;

  // user entity로 변환하는 메소드
  toUserEntity(role: Role = Role.USER): Omit<User, 'id'> {
    return {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      nickname: this.nickname,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birthYear: this.birthYear,
      birthMonth: this.birthMonth,
      birthDate: this.birthDate,
      profilePhotoUrl: this.profilePhotoUrl,
      role: role,
      status: Status.REGISTERED,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isDeleted: false,
    };
  }

  // addressInfo entity로 변환하는 메소드
  toAddressInfoEntity(userId: bigint): Omit<AddressInfo, 'id'> {
    return {
      userId: userId,
      zipCode: this.zipCode,
      mainAddress: this.mainAddress,
      detailAddress: this.detailAddress,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isDeleted: false,
    };
  }

  // bcrypt를 이용해 비밀번호 해싱
  async getHashedRequest(): Promise<CreateUserRequest> {
    const { password } = this;

    const hashedPassword = await bcrypt.hash(password, 10);
    this.password = hashedPassword;

    return this;
  }
}
