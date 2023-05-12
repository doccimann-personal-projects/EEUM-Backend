import { Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageProducer } from './sqs/message.producer';
import { S3FilesService } from './s3/s3-files.service';
import { S3UploadController } from './s3/s3-upload.controller';

/* AWS Credentials */
const awsCredential = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
});

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: awsCredential,
});

@Module({
  imports: [
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: process.env.CREATE_DIARY_MQ_NAME,
          queueUrl: process.env.CREATE_DIARY_MQ_URL,
          region: process.env.AWS_REGION,
        },
      ],
    }),
  ],
  controllers: [S3UploadController],
  providers: [MessageProducer, S3FilesService],
  exports: [MessageProducer, S3FilesService],
})
export class AwsModule {}
