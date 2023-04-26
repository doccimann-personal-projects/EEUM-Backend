import { AddressInfo } from '@prisma/client';

export interface AddressInfoRepository {
  create(addressInfo: Omit<AddressInfo, 'id'>): Promise<AddressInfo>;
}
