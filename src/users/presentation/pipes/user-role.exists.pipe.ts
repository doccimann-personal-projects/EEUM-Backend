import { Injectable, PipeTransform } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { NotAuthorizedException } from '../../../common/customExceptions/not-authorized.exception';

type ValidationTypes = User;

@Injectable()
export class UserRoleExistsPipe implements PipeTransform {
  private readonly authorizationRoles = [Role.USER, Role.ADMIN];

  transform(value: ValidationTypes): ValidationTypes {
    const authResult = this.authorizationRoles
      .map((role) => role === value.role)
      .includes(true);

    if (!authResult) {
      throw new NotAuthorizedException('허용되지 않은 접근입니다');
    }

    return value;
  }
}
