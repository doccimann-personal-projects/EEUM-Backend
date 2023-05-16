import { Module } from '@nestjs/common';
import { UsersServiceImpl } from './application/service/users.service.impl';
import { UsersController } from './presentation/controller/users.controller';
import { UserDao } from './infrastructure/user.dao';
import { UserValidator } from './application/validator/user.validator';
import { AddressInfoDao } from './infrastructure/address-info.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './presentation/jwt/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { ApmModule } from 'nestjs-elastic-apm';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    ApmModule.register(),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserService',
      useClass: UsersServiceImpl,
    },
    {
      provide: 'UserRepository',
      useClass: UserDao,
    },
    {
      provide: 'AddressInfoRepository',
      useClass: AddressInfoDao,
    },
    UserValidator,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: ['UserService', JwtAuthGuard],
})
export class UsersModule {}
