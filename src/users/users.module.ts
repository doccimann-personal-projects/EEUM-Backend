import { Module } from '@nestjs/common';
import { UsersService } from './application/service/users.service';
import { UsersController } from './presentation/controller/users.controller';
import { UserDao } from './infrastructure/user.dao';
import { UserValidator } from './application/validator/user.validator';
import { AddressInfoDao } from './infrastructure/address-info.dao';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserDao,
    },
    {
      provide: 'AddressInfoRepository',
      useClass: AddressInfoDao,
    },
    UserValidator,
  ],
  exports: [UsersService],
})
export class UsersModule {}
