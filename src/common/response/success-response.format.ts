/* 성공에 대한 응답 포맷을 정의하는 공용 인터페이스 */
export class SingleSuccessResult<T> {
  success: boolean;
  item: T;

  private constructor(item: T) {
    this.item = item;
    this.success = true;
  }

  static of<T>(item: T): SingleSuccessResult<T> {
    return new SingleSuccessResult(item);
  }
}

/* 페이지네이션 된 성공 응답 포맷을 정의하는 공용 인터페이스 */
export class PaginatedSuccessResult<T> {
  success: boolean;
  totalPages: number;
  totalElements: number;
  page: number;
  numOfItems: number;
  items: Array<T>;

  private constructor(
    totalPages: number,
    totalElements: number,
    page: number,
    numOfItems: number,
    items: Array<T>,
  ) {
    this.success = true;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.page = page;
    this.numOfItems = numOfItems;
    this.items = items;
  }

  static of<T>(
    totalElements: number,
    page: number,
    limit: number,
    items: Array<T>,
  ): PaginatedSuccessResult<T> {
    const totalPages = Math.ceil(totalElements / limit);

    return new PaginatedSuccessResult(
      totalPages,
      totalElements,
      page,
      items.length,
      items,
    );
  }
}
