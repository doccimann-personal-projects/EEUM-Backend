import { ApiProperty } from '@nestjs/swagger';
import { Address, BirthInfo, NameInfo } from './response.types';
import { Gender, Role, Status } from '@prisma/client';

/* 응답 DTO 공통부를 정의하는 클래스 */
export class CommonUserResponse {
  @ApiProperty({
    description: '사용자 식별자',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: '이메일',
    example: 'test@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: '이름 정보',
    example: { firstName: '도엽', lastName: '김' },
    required: true,
  })
  nameInfo: NameInfo;

  @ApiProperty({
    description: '닉네임',
    example: 'Brian',
    required: true,
  })
  nickname: string;

  @ApiProperty({
    description: '휴대폰번호',
    example: '010-1234-1234',
    required: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: '성별',
    examples: ['MALE', 'FEMALE'],
    required: true,
  })
  gender: Gender;

  @ApiProperty({
    description: '생년월일 정보입니다.',
    example: { year: 1999, month: 3, date: 25 },
    required: true,
  })
  birthInfo: BirthInfo;

  @ApiProperty({
    description: '프로필 사진 url',
    examples: [null, 'http://any-prpfile'],
    required: true,
  })
  profilePhotoUrl: string | null;

  @ApiProperty({
    description: '사용자 권한',
    example: 'USER',
    default: 'USER',
    required: true,
  })
  role: Role;

  @ApiProperty({
    description: '회원의 상태 값',
    example: 'REGISTERED',
    required: true,
  })
  status: Status;

  @ApiProperty({
    description: '주소 정보입니다.',
    example: {
      zipCode: 30000,
      mainAddress: '서울시 강남구 신사동',
      detailAddress: '신사역 1번 출구',
    },
    required: true,
  })
  addressInfo: Address;

  @ApiProperty({
    description: '생성 일자입니다',
    example: '2023-04-26T13:10:48.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일자입니다',
    example: '2023-04-26T13:10:48.000Z',
    required: false,
  })
  updatedAt: Date;
}
