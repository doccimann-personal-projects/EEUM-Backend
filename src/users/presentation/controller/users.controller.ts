import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { UsersService } from '../../application/service/users.service';
import { CreateUserRequest } from '../../application/dto/request/create-user.request';
import { UpdateUserRequestDto } from '../../application/dto/request/update-user.request.dto';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';

@Controller('api/users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  async signup(@Body() createRequest: CreateUserRequest) {
    return await this.usersService.signup(createRequest);
  }
}
