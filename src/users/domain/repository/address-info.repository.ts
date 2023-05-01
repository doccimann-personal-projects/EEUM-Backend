import { AddressInfo } from '@prisma/client';

export interface AddressInfoRepository {
  create(addressInfo: Omit<AddressInfo, 'id'>): Promise<AddressInfo>;

  findByUserId(userId: number): Promise<AddressInfo | null>;

  deleteByUserId(userId: number): Promise<AddressInfo>;

  update(id: number, updateData: Partial<AddressInfo>): Promise<AddressInfo>;
}
