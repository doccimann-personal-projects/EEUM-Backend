import { ApiProperty } from '@nestjs/swagger';
import { RecommendedFood } from '@prisma/client';

export class RecommendedFoodResponse {
  @ApiProperty({
    description: '음식 이름입니다',
    example: '삼계탕',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: '음식 사진 url 입니다',
    example: 'http://my-food.image.com',
    required: true,
  })
  imageUrl: string;

  private constructor(name: string, imageUrl: string) {
    this.name = name;
    this.imageUrl = imageUrl;
  }

  static fromEntity(food: Partial<RecommendedFood>): RecommendedFoodResponse {
    const { foodName, imageUrl } = food;
    console.log(food);
    return new RecommendedFoodResponse(foodName, imageUrl);
  }
}
