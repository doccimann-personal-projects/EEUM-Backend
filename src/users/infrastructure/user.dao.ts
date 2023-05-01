import { UserRepository } from '../domain/repository/user.repository';
import { Status, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getUserSoftDeleteData } from '../domain/extensions/user.extensions';
import { UserWithAddressInfo } from '../domain/entity/user-with-address-info';

@Injectable()
export class UserDao implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(user: Omit<User, 'id'>): Promise<User> {
    return this.prismaService.user.create({
      data: user,
    });
  }

  async findRegisteredUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        email: email,
        status: Status.REGISTERED,
      },
      include: {
        addressInfo: true,
      },
    });
  }

  async findRegisteredUserByNickname(nickname: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        nickname: nickname,
        status: Status.REGISTERED,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  async deleteById(id: number): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: getUserSoftDeleteData(),
    });
  }

  async findRegisteredUserJoinAddressInfoById(
    id: number,
  ): Promise<UserWithAddressInfo | null> {
    return this.prismaService.user.findFirst({
      where: {
        id: id,
      },
      include: {
        addressInfo: true,
      },
    });
  }

  async update(userId: number, updateData: Partial<User>): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });
  }
}
