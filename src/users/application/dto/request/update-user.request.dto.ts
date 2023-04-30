import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequest } from './create-user.request';

export class UpdateUserRequestDto extends PartialType(CreateUserRequest) {}
