import { Injectable } from '@nestjs/common';
import { MessageProducer } from '../../../aws/sqs/message.producer';
import { DiaryCreatedMessage } from '../../../boards/application/dto/message/diary-created.message';
import { SendMessageBatchResultEntry } from 'aws-sdk/clients/sqs';

@Injectable()
export class DiaryMessageProducer {
  // 일기 생성에 대한 메시지를 발행하는 sqs url
  private readonly createMessageQueueUrl = process.env.CREATE_DIARY_MQ_NAME;

  // Group Id
  private readonly diaryMessageGroupId = 'eeum-diary';

  constructor(private readonly messageProducer: MessageProducer) {}

  // 일기 생성 메시지를 발행하는 메소드
  async produceCreatedMessage(
    message: DiaryCreatedMessage,
  ): Promise<SendMessageBatchResultEntry[]> {
    return await this.messageProducer.produce(
      this.createMessageQueueUrl,
      message,
      this.diaryMessageGroupId,
    );
  }
}
