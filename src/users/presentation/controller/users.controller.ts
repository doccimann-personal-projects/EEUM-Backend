import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Param,
  ParseIntPipe,
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
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';
import { AuthGuard } from '@nestjs/passport';

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
    description: '로그인 성공 응답입니다',
    type: ReadUserResponse,
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
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/profile')
  async getProfile(
    @Param('id', ParseIntPipe) userId: number,
    @JwtAuthResult(UserRoleExistsPipe) authResult: ReadUserResponse, // Guard를 통해 인증된 결과에서 USER Role이 존재하는지 검증한 결과를 받아온다
  ): Promise<ReadUserResponse> {
    // userId와 id가 일치하지 않으면 예외를 발생시켜야함
    if (authResult.id !== userId) {
      throw new NotAuthorizedException('허용되지 않은 접근입니다');
    }

    return authResult;
  }
}
