import { ApiProperty } from '@nestjs/swagger';

export class FailureResult {
  @ApiProperty({
    description: '성공 여부입니다',
    example: false,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    description: '에러 메시지입니다',
    example: 'Resource duplicated',
    default: true,
  })
  message: string;

  private constructor(message: string) {
    this.success = false;
    this.message = message;
  }

  static of(message: string) {
    return new FailureResult(message);
  }
}
