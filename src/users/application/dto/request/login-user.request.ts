import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
