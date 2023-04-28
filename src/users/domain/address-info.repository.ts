import { AddressInfo } from '@prisma/client';

export interface AddressInfoRepository {
  create(addressInfo: Omit<AddressInfo, 'id'>): Promise<AddressInfo>;

  findByUserId(userId: number): Promise<AddressInfo | null>;
}
