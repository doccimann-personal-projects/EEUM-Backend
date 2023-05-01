import { PickType } from '@nestjs/swagger';
import { CreateUserResponse } from './create-user.response';
import { AddressInfo, User } from '@prisma/client';
import { Address, BirthInfo, NameInfo } from './common/response.types';
import { CommonUserResponse } from './common/common-user.response';

export class ReadUserResponse extends PickType(CommonUserResponse, [
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
  /* 엔티티로부터 프로필 조회 dto를 추출하는 메소드 */
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
