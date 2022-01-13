import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
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

  @MessagePattern('kafka.test')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext): void {
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
    this.client.emit('kafka.test.reply', orderPaymentCompletedEvent);
  }
}
