import { CreateUserRequest } from '../dto/request/create-user.request';
import { CreateUserResponse } from '../dto/response/create-user.response';
import { LoginUserRequest } from '../dto/request/login-user.request';
import { LoginUserResponse } from '../dto/response/login-user.response';
import { JwtPayload } from '../dto/jwt-payload';
import { User } from '@prisma/client';
import { DeleteUserResponse } from '../dto/response/delete-user.response';
import { UpdateUserRequest } from '../dto/request/update-user.request';
import { UpdateUserResponse } from '../dto/response/update-user.response';
import { ReadUserResponse } from '../dto/response/read-user.response';

export interface UsersService {
  // 회원가입을 처리하는 메소드
  signup(createRequest: CreateUserRequest): Promise<CreateUserResponse>;

  // 로그인을 처리하는 메소드
  login(loginRequest: LoginUserRequest): Promise<LoginUserResponse>;

  // payload로부터 user entity를 가져오는 메소드
  getUserFromPayload(payload: JwtPayload): Promise<User>;

  getProfile(user: User): Promise<ReadUserResponse>;

  // 회원탈퇴를 수행하는 메소드
  withdrawUser(user: User, userId: number): Promise<DeleteUserResponse>;

  // 유저를 업데이트 처리하는 메소드
  update(
    user: User,
    userId: number,
    updateRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse>;
}
