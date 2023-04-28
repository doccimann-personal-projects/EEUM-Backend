import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty({
    description: 'jwt 토큰 값입니다.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoiYnJpYW4xMEBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjgyNjY5MTkwLCJleHAiOjE2ODI2Nzk5OTB9.x3x3UPhjwq6HG6CUEXQ0fi-goQYrryN8ab79HhiefhI',
    required: true,
  })
  jwtToken: string;

  constructor(jwtToken: string) {
    this.jwtToken = jwtToken;
  }
}
