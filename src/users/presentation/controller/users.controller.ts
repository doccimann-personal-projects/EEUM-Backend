import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete,
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
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { DeleteUserResponse } from '../../application/dto/response/delete-user.response';

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
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/profile')
  async getProfile(
    @Param('id', ParseIntPipe) userId: number,
    @JwtAuthResult(UserRoleExistsPipe) user: User, // Guard를 통해 인증된 결과에서 USER Role이 존재하는지 검증한 결과를 받아온다
  ): Promise<ReadUserResponse> {
    const result = await this.usersService.getProfile(user, userId);
    console.log(result);
    return result;
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
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/un-register')
  async unregister(
    @Param('id', ParseIntPipe) userId: number,
    @JwtAuthResult(UserRoleExistsPipe) user: User,
  ): Promise<DeleteUserResponse> {
    return await this.usersService.unregisterUser(user, userId);
  }
}
