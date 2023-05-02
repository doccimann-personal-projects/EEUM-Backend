import { BusinessException } from './business-exception';
import { CommonErrors } from '../response/errors';

export class RequestNotValidException extends BusinessException {
  constructor(message: string = CommonErrors.REQUEST_VALIDATION_ERROR) {
    super(message, 400);
  }
}
