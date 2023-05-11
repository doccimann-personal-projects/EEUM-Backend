import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { SendMessageBatchResultEntry } from 'aws-sdk/clients/sqs';
import { v4 } from 'uuid';

@Injectable()
export class MessageProducer {
  constructor(private readonly sqsService: SqsService) {}

  // 메시지를 발행하는 메소드
  async produce(
    queueName: string,
    payload: any,
    groupId: string,
    messageId: string = v4(),
    deduplicationId: string = v4(),
  ): Promise<SendMessageBatchResultEntry[]> {
    const message = JSON.stringify(payload);

    const sqsMessage = {
      id: messageId,
      body: message,
      groupId: groupId,
      deduplicationId: deduplicationId,
    };

    return await this.sqsService.send(queueName, sqsMessage);
  }
}
