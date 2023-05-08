import { Global, Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageProducer } from './message.producer';

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SQS_SECRET_KEY_ID,
  },
});

@Module({
  imports: [
    SqsModule.registerAsync({
      useFactory: () => ({
        consumers: [],
        producers: [],
      }),
    }),
  ],
  providers: [MessageProducer],
  exports: [MessageProducer],
})
export class MessagingModule {}
