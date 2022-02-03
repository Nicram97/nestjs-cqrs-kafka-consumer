import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { AppService } from './app.service';
import { OrderPaymentCompletedEvent } from './order/events/order.events';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('NestjsKafka') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('kafka.test');
    this.client.subscribeToResponseOf('siema');
  }

  async onModuleDestroy() {
    // await this.client.close();
  }

  @MessagePattern('siema')
  readMessageSiema(@Payload() message: any, @Ctx() context: KafkaContext): any {
    const originalMessage: KafkaMessage = context.getMessage();
    const value = JSON.parse(JSON.stringify(originalMessage.value));
    const response =
      `Receiving a new message from topic: siema: ` +
      JSON.stringify(originalMessage.value);
    console.log(response, 'siema');

    return 'siema';
  }

  @MessagePattern('kafka.test')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext): any {
    const originalMessage: KafkaMessage = context.getMessage();
    const value = JSON.parse(JSON.stringify(originalMessage.value));
    const response =
      `Receiving a new message from topic: kafka.test: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    const orderPaymentCompletedEvent: OrderPaymentCompletedEvent =
      new OrderPaymentCompletedEvent(
        value.orderTransactionGUID,
        value.orderUser,
        value.orderItem,
        value.orderAmount,
      );
    return 'test';
  }
}
