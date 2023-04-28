import { AddressInfoRepository } from '../domain/address-info.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddressInfo } from '@prisma/client';

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
}
