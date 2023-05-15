import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { DiariesModule } from './diaries/diaries.module';
import { CommentsModule } from './comments/comments.module';
import { AwsModule } from './aws/aws.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    DiariesModule,
    BoardsModule,
    CommentsModule,
    AwsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
