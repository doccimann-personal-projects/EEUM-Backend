import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from '../dto/request/create-user.request';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  create(createUserDto: CreateUserRequest) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserRequestDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
