import { AddressInfo, Gender, Role, Status, User } from '@prisma/client';

export class CreateUserResponse {
  constructor(
    readonly id: number,
    readonly email: string,
    readonly nameInfo: NameInfo,
    readonly nickname: string,
    readonly phoneNumber: string,
    readonly gender: Gender,
    readonly birthInfo: BirthInfo,
    readonly profilePhotoUrl: string | undefined,
    readonly role: Role,
    readonly status: Status,
    readonly addressInfo: Address,
    readonly createdAt: Date,
  ) {}

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
