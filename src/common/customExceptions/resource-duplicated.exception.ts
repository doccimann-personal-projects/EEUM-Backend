import { BusinessException } from './business-exception';
import { CommonErrors } from '../response/errors';

export class ResourceDuplicatedException extends BusinessException {
  constructor(
    readonly message: string = CommonErrors.RESOURCE_DUPLICATION_ERROR,
  ) {
    super(message, 400);
  }
}
