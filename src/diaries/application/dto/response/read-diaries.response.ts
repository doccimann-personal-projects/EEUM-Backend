export class ReadDiariesResponse {
  page: number;
  elements: number;
  totalElements: number;
  diaries: Array<paginatedDiaries>;

  constructor(
    page: number,
    elements: number,
    totalElements: number,
    diaries: Array<paginatedDiaries>,
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
        const obj: toIntPaginatedDiaries = {
          id: Number(value['id']),
          title: value['title'],
        };
        map.push(obj);
        return map;
      },
      [],
    );
    return new ReadDiariesResponse(page, elements, totalElements, diaries);
  }
}

export interface paginatedDiaries {
  id: bigint | number;
  title: string;
}

interface toIntPaginatedDiaries {
  id: number;
  title: string;
}
