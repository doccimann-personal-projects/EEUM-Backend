import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({
    description: '이메일을 입력하세요!',
    example: 'brian1@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호을 입력하세요!',
    example: 'brian',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
