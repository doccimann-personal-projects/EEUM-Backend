import { ApiProperty } from '@nestjs/swagger';

export class ProfileUploadResponse {
  @ApiProperty({
    description: '이미지 url 값입니다',
    example: 'https://any-profile',
    required: true,
  })
  profileImageUrl: string | null;

  constructor(profileImageUrl: string | null) {
    this.profileImageUrl = profileImageUrl;
  }
}
