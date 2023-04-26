import { UserRepository } from '../domain/user.repository';
import { Status, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}