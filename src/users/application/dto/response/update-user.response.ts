import { PickType } from '@nestjs/swagger';
import { CommonUserResponse } from './common/common-user.response';
import { AddressInfo, Gender, Role, Status, User } from '@prisma/client';
import { Address, BirthInfo, NameInfo } from './common/response.types';

export class UpdateUserResponse extends PickType(CommonUserResponse, [
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
  'updatedAt',
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
    updatedAt: Date,
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
    this.updatedAt = updatedAt;
  }

  static fromEntites(user: User, addressInfo: AddressInfo): UpdateUserResponse {
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
      updatedAt,
    } = user;

    const { zipCode, mainAddress, detailAddress } = addressInfo;

    const nameInfo: NameInfo = { firstName, lastName };
    const birthInfo: BirthInfo = {
      year: birthYear,
      month: birthMonth,
      date: birthDate,
    };
    const address: Address = { zipCode, mainAddress, detailAddress };

    return new UpdateUserResponse(
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
      updatedAt,
    );
  }
}
