import { SearchOption } from '../request/search-option.request';

export class SearchOptionResponse {
  page: number;
  elements: number;
  totalPages: number;
  totalElements: number;
  diaries: object;

  constructor(
    page: number,
    elements: number,
    totalPages: number,
    totalElements: number,
    diaries: object,
  ) {
    this.page = page;
    this.elements = elements;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.diaries = diaries;
  }

  static fromEntities(
    foundDiaries: object[],
    totalPages: number,
    totalElements: number,
    query: SearchOption,
  ): SearchOptionResponse {
    const searchOptions = query.toSearchEntity();
    const { page, elements } = searchOptions;
    const diaries = foundDiaries.reduce((map: object[], value: Object) => {
      const obj: object = { id: Number(value['id']), title: value['title'] };
      map.push(obj);
      return map;
    }, []);
    return new SearchOptionResponse(
      page,
      elements,
      totalPages,
      totalElements,
      diaries,
    );
  }
}
