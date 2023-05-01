import { AddressInfo, User } from '@prisma/client';

// User와 addressInfo를 join한 결과를 담는 엔티티
export interface UserWithAddressInfo extends User {
  addressInfo: AddressInfo;
}
