export class FailureResult {
  success: boolean;
  message: string;

  private constructor(message: string) {
    this.success = false;
    this.message = message;
  }

  static of(message: string) {
    return new FailureResult(message);
  }
}
