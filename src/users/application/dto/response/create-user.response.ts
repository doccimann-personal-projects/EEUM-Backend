import { AddressInfo, Gender, Role, Status, User } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { Address, BirthInfo, NameInfo } from './common/response.types';
import { CommonUserResponse } from './common/common-user.response';

export class CreateUserResponse extends PickType(CommonUserResponse, [
  'id',
  'email',
  'nameInfo',
  'nickname',
  'phoneNumber',
  'gender',
  'birthInfo',
  'profilePhotoUrl',
  'role',
  'status',
  'addressInfo',
  'createdAt',
] as const) {
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
    super();
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
