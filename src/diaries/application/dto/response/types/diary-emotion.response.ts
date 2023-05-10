import { ApiProperty } from '@nestjs/swagger';
import { DiaryEmotion } from '@prisma/client';

export class DiaryEmotionResponse {
  @ApiProperty({
    description: '걱정 수치입니다',
    example: '12.10',
    required: true,
  })
  worryScore: number;

  @ApiProperty({
    description: '분노 수치입니다',
    example: '12.10',
    required: true,
  })
  angryScore: number;

  @ApiProperty({
    description: '행복 수치입니다',
    example: '12.10',
    required: true,
  })
  happyScore: number;

  @ApiProperty({
    description: '설렘 수치입니다',
    example: '12.10',
    required: true,
  })
  excitedScore: number;

  @ApiProperty({
    description: '슬픔 수치입니다',
    example: '12.10',
    required: true,
  })
  sadScore: number;

  constructor(
    worryScore: number,
    angryScore: number,
    happyScore: number,
    excitedScore: number,
    sadScore: number,
  ) {
    this.worryScore = worryScore;
    this.angryScore = angryScore;
    this.happyScore = happyScore;
    this.excitedScore = excitedScore;
    this.sadScore = sadScore;
  }

  static fromPartialEntity(
    diaryEmotion: Partial<DiaryEmotion>,
  ): DiaryEmotionResponse {
    const { worryScore, angryScore, happyScore, excitedScore, sadScore } =
      diaryEmotion;

    return new DiaryEmotionResponse(
      Number(worryScore),
      Number(angryScore),
      Number(happyScore),
      Number(excitedScore),
      Number(sadScore),
    );
  }
}
