import { BusinessException } from './business-exception';
import { CommonErrors } from '../response/errors';

export class NotAuthorizedException extends BusinessException {
  constructor(message: string = CommonErrors.AUTHORIZATION_ERROR) {
    super(message, 401);
  }
}
