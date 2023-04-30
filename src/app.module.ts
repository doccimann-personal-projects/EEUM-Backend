import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { DiariesModule } from './diaries/diaries.module';

@Module({
  imports: [UsersModule, DiariesModule, BoardsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
