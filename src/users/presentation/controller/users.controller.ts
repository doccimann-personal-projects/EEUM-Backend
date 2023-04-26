import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { UsersService } from '../../application/service/users.service';
import { CreateUserRequest } from '../../application/dto/request/create-user.request';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SingleSuccessResult } from '../../../common/response/success-response.format';
import { CreateUserResponse } from '../../application/dto/response/create-user.response';
import { FailureResult } from '../../../common/response/failure-response.format';

@ApiTags('인증/인가')
@Controller('api/users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '일반 사용자 회원가입입니다',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공 응답입니다',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: '실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @Post('/sign-up')
  async signup(@Body() createRequest: CreateUserRequest) {
    return await this.usersService.signup(createRequest);
  }
}
