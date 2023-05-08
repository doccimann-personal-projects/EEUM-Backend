import { User } from '@prisma/client';
import { UserWithAddressInfo } from '../entity/user-with-address-info';

export interface UserRepository {
  // User를 생성하는 메소드
  create(user: Omit<User, 'id'>): Promise<User>;

  // email을 통해서 가입된 user를 찾아오는 메소드
  findRegisteredUserByEmail(email: string): Promise<User | null>;

  // nickname을 통해서 user를 찾아오는 메소드
  findRegisteredUserByNickname(nickname: string): Promise<User | null>;

  // id를 이용해 user를 찾아오는 메소드
  findById(id: number): Promise<User | null>;

  // id를 이용해 user를 삭제하는 메소드
  deleteById(id: number): Promise<User>;

  // user와 addressInfo를 조인한 엔티티를 탐색하는 메소드
  findRegisteredUserJoinAddressInfoById(
    id: number,
  ): Promise<UserWithAddressInfo | null>;

  // user를 업데이트하는 메소드
  update(userId: number, updateData: Partial<User>): Promise<User>;
}
