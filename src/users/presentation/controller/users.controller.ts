import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from '../../application/service/users.service';
import { CreateUserRequest } from '../../application/dto/request/create-user.request';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserResponse } from '../../application/dto/response/create-user.response';
import { FailureResult } from '../../../common/response/failure-response.format';
import { LoginUserRequest } from '../../application/dto/request/login-user.request';
import { LoginUserResponse } from '../../application/dto/response/login-user.response';
import { JwtAuthResult } from '../decorators/jwt-auth.result';
import { UserRoleExistsPipe } from '../pipes/user-role.exists.pipe';
import { ReadUserResponse } from '../../application/dto/response/read-user.response';
import { User } from '@prisma/client';
import { DeleteUserResponse } from '../../application/dto/response/delete-user.response';
import { UpdateUserResponse } from '../../application/dto/response/update-user.response';
import { UpdateUserRequest } from '../../application/dto/request/update-user.request';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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

  @ApiOperation({
    summary: '일반 사용자 로그인입니다',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공 응답입니다',
    type: LoginUserResponse,
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @Post('/login')
  async jwtLogin(@Body() loginRequest: LoginUserRequest) {
    return await this.usersService.login(loginRequest);
  }

  @ApiOperation({
    summary: '일반 사용자 프로필 조회입니다',
  })
  @ApiBearerAuth('accesskey')
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공 응답입니다',
    type: ReadUserResponse,
  })
  @ApiResponse({
    status: 401,
    description: '프로필 조회 실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  async getProfile(
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ): Promise<ReadUserResponse> {
    return await this.usersService.getProfile(user);
  }

  @ApiOperation({
    summary: '회원탈퇴 입니다',
  })
  @ApiBearerAuth('accesskey')
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 성공 응답입니다',
    type: DeleteUserResponse,
  })
  @ApiResponse({
    status: 401,
    description: '회원탈퇴 실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async unregister(
    @Param('id', ParseIntPipe) userId: number,
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ): Promise<DeleteUserResponse> {
    return await this.usersService.unregisterUser(user, userId);
  }

  @ApiOperation({
    summary: '유저 정보 수정입니다',
  })
  @ApiBearerAuth('accesskey')
  @ApiResponse({
    status: 200,
    description: '회원정보 수정 성공 응답입니다',
    type: UpdateUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: '회원정보 수정 실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 401,
    description: '회원정보 수정 과정에서 인증 실패 응답입니다',
    type: FailureResult,
  })
  @ApiResponse({
    status: 500,
    description: '내부 서버 에러입니다',
    type: FailureResult,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateRequest: UpdateUserRequest,
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ): Promise<UpdateUserResponse> {
    return await this.usersService.update(user, userId, updateRequest);
  }
}
