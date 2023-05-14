import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { DiariesModule } from './diaries/diaries.module';
import { CommentsModule } from './comments/comments.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    UsersModule,
    DiariesModule,
    BoardsModule,
    CommentsModule,
    ConfigModule.forRoot(),
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
