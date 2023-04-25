import {
  PaginatedSuccessResult,
  SingleSuccessResult,
} from './success-response.format';
import { FailureResult } from './failure-response.format';

export class ResultFactory {
  static getSingleSuccessResult<T>(item: T): SingleSuccessResult<T> {
    return SingleSuccessResult.of(item);
  }

  static getPaginatedSuccessResult<T>(
    totalElements: number,
    page: number,
    limit: number,
    items: Array<T>,
  ): PaginatedSuccessResult<T> {
    return PaginatedSuccessResult.of(totalElements, page, limit, items);
  }

  static getFailureResult(message: string): FailureResult {
    return FailureResult.of(message);
  }
}
