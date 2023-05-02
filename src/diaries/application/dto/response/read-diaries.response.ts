import { ApiProperty } from '@nestjs/swagger';

export class ReadDiariesResponse {
  @ApiProperty({
    description: '현재 목록에 페이지 값입니다.',
    example: 1,
    required: true,
  })
  page: number;

  @ApiProperty({
    description: '현 페이지에서 보일 목록의 개수입니다.',
    example: 1,
    required: true,
  })
  elements: number;

  @ApiProperty({
    description: '일기 목록의 총 개수입니다.',
    example: 1,
    required: true,
  })
  totalElements: number;

  @ApiProperty({
    description: '목록에서 보일 일기의 간략한 내용입니다.',
    example: {
      id: 1,
      title: '좋은 하루',
      publishedDate: '2020-04-21',
      diaryEmotion: '기쁨',
      recommendedFood: '햄버거',
    },
    required: true,
  })
  diaries: Array<toIntPaginatedDiaries>;

  constructor(
    page: number,
    elements: number,
    totalElements: number,
    diaries: Array<toIntPaginatedDiaries>,
  ) {
    this.page = page;
    this.elements = elements;
    this.totalElements = totalElements;
    this.diaries = diaries;
  }

  static fromEntities(
    foundDiaries: Array<paginatedDiaries>,
    totalElements: number,
    page: number,
    elements: number,
  ): ReadDiariesResponse {
    const diaries: Array<toIntPaginatedDiaries> = foundDiaries.reduce(
      (map: Array<toIntPaginatedDiaries>, value: paginatedDiaries) => {
        const emotion =
          value['diaryEmotionList'].length !== 0
            ? value['diaryEmotionList'][0]['emotion']
            : null;
        const food =
          value['recommendedFoodList'].length !== 0
            ? value['recommendedFoodList'][0]['foodName']
            : null;
        const obj: toIntPaginatedDiaries = {
          id: Number(value['id']),
          title: value['title'],
          publishedDate: value['publishedDate'].toISOString().substring(0, 10),
          diaryEmotion: emotion,
          recommendedFood: food,
        };
        map.push(obj);
        return map;
      },
      [],
    );
    return new ReadDiariesResponse(page, elements, totalElements, diaries);
  }
}

export class paginatedDiaries {
  id: bigint | number;
  title: string;
  publishedDate: Date;
  diaryEmotionList: Array<emotionName>;
  recommendedFoodList: Array<foodName>;
}

export class toIntPaginatedDiaries {
  id: number;
  title: string;
  publishedDate: string;
  diaryEmotion: string;
  recommendedFood: string;
}

interface emotionName {
  emotion: string;
}

interface foodName {
  foodName: string;
}
