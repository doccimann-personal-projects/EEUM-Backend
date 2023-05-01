import { PickType } from '@nestjs/swagger';
import { CommonUserResponse } from './common/common-user.response';
import { User } from '@prisma/client';

export class DeleteUserResponse extends PickType(CommonUserResponse, [
  'id',
  'email',
] as const) {
  constructor(id: number, email: string) {
    super();

    this.id = id;
    this.email = email;
  }

  static fromEntity(user: User): DeleteUserResponse {
    const { id, email } = user;
    return new DeleteUserResponse(Number(id), email);
  }
}
