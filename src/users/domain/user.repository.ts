import { User } from '@prisma/client';

export interface UserRepository {
  // User를 생성하는 메소드
  create(user: Omit<User, 'id'>): Promise<User>;

  // email을 통해서 가입된 user를 찾아오는 메소드
  findRegisteredUserByEmail(email: string): Promise<User | null>;

  // nickname을 통해서 user를 찾아오는 메소드
  findRegisteredUserByNickname(nickname: string): Promise<User | null>;
}
