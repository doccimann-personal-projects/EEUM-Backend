import { BusinessException } from '../customExceptions/business-exception';

export class ValidationResult {
  private constructor(
    readonly success: boolean,
    readonly exception?: BusinessException,
  ) {}

  static getSuccessResult(): ValidationResult {
    return new ValidationResult(true);
  }

  static getFailureResult(exception: BusinessException): ValidationResult {
    return new ValidationResult(false, exception);
  }
}
