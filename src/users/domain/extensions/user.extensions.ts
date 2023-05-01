import { Status, User } from '@prisma/client';
import { getCurrentUtcDate } from '../../../common/utils/date-utils';

// soft-delete 쿼리에 사용할 쿼리를 가져오는 함수
export function getUserSoftDeleteData(): Partial<User> {
  return {
    isDeleted: true,
    updatedAt: getCurrentUtcDate(),
    deletedAt: getCurrentUtcDate(),
    status: Status.UNREGISTERED,
  };
}
