import { AddressInfoRepository } from '../domain/repository/address-info.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddressInfo } from '@prisma/client';
import { getAddressInfoSoftDeleteData } from '../domain/extensions/address-info.extensions';

@Injectable()
export class AddressInfoDao implements AddressInfoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(addressInfo: Omit<AddressInfo, 'id'>): Promise<AddressInfo> {
    return this.prismaService.addressInfo.create({
      data: addressInfo,
    });
  }

  async findByUserId(userId: number): Promise<AddressInfo | null> {
    return this.prismaService.addressInfo.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  deleteByUserId(userId: number): Promise<AddressInfo> {
    return this.prismaService.addressInfo.update({
      where: {
        userId: userId,
      },
      data: getAddressInfoSoftDeleteData(),
    });
  }

  async update(
    id: number,
    updateData: Partial<AddressInfo>,
  ): Promise<AddressInfo> {
    return this.prismaService.addressInfo.update({
      where: {
        id: id,
      },
      data: updateData,
    });
  }
}
