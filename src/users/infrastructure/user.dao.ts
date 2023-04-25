import { UserRepository } from '../domain/user.repository';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDao implements UserRepository {
  async create(user: User): Promise<User> {
    // TODO
  }
}
