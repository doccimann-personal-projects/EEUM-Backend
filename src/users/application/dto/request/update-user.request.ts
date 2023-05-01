import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequest {
  @ApiProperty({
    description: '비밀번호를 입력해주세요',
    example: 'qwejkg123@',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({
    description: '이름을 입력하시면 됩니다!',
    example: '도엽',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: '성을 입력하세요!',
    example: '김',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    description: '닉네임을 입력해주세요! 중복은 허용하지 않습니다!',
    example: 'Brian',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nickname?: string;

  @ApiProperty({
    description: '휴대폰 번호를 입력하세요! 한국 휴대폰 번호만 허용합니다!',
    example: '010-1234-1234',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phoneNumber?: string;

  @ApiProperty({
    description: '프로필 사진 url을 입력하세요! 없다면 안 던져도 됩니다!',
    example: 'http://any-profile',
    required: false,
  })
  @IsOptional()
  @IsString()
  progilePhotoUrl?: string;

  @ApiProperty({
    description: '우편번호를 입력해주세요!',
    example: 30000,
    required: true,
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  zipCode?: number;

  @ApiProperty({
    description: '메인 주소를 입력해주세요!',
    example: '서울특별시 강남구 신사동',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mainAddress?: string;

  @ApiProperty({
    description: '상세 주소를 입력해주세요!',
    example: '신사역 1번 출구',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  detailAddress?: string;
}
