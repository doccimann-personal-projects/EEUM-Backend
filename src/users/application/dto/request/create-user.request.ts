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

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phoneNumber: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @IsNotEmpty()
  birthYear: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  birthMonth: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  birthDate: number;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  zipCode: number;

  @IsString()
  @IsNotEmpty()
  mainAddress: string;

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
}
