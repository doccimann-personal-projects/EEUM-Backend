import { BusinessException } from './business-exception';
import { CommonErrors } from '../response/errors';

export class ResourceNotFoundException extends BusinessException {
  constructor(message: string = CommonErrors.RESOURCE_NOT_FOUND_ERROR) {
    super(message, 400);
  }
}
