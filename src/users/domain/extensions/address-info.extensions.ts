import { AddressInfo } from '@prisma/client';
import { getCurrentUtcDate } from '../../../common/utils/date-utils';

export function getAddressInfoSoftDeleteData(): Partial<AddressInfo> {
  return {
    isDeleted: true,
    deletedAt: getCurrentUtcDate(),
    updatedAt: getCurrentUtcDate(),
  };
}
