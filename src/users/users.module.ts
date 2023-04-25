import { Module } from '@nestjs/common';
import { UsersService } from './application/service/users.service';
import { UsersController } from './presentation/controller/users.controller';
import { UserDao } from './infrastructure/user.dao';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserDao,
    },
  ],
})
export class UsersModule {}
