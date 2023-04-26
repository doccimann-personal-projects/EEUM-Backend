export class ValidationResult {
  private constructor(readonly success: boolean, readonly message?: string) {}

  static getSuccessResult(): ValidationResult {
    return new ValidationResult(true);
  }

  static getFailureResult(message: string): ValidationResult {
    return new ValidationResult(false, message);
  }
}
