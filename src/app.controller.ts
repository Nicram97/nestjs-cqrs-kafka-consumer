import { Controller, Inject } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { plainToClass } from 'class-transformer';
import { AppService } from './app.service';
import {
  OrderInventoryCheckedEvent,
  OrderPaymentCompletedEvent,
} from './order/events/order.events';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('NestjsKafka') private readonly client: ClientKafka,
  ) {}

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
    return 'test';
  }

  @EventPattern('kafka.event')
  readTestEvent(data: Record<string, unknown>): void {
    console.log(`Received event on kafka.event topic `, data);
    this.client.emit('kafka.event.response', { foo: 'response Event' });
  }

  @EventPattern('kafka.order')
  processOrderPayment(data: Record<string, unknown>): void {
    const orderData: OrderInventoryCheckedEvent = plainToClass(
      OrderInventoryCheckedEvent,
      data.value,
    );
    console.log('Payment completed');
    const orderPaymentCompletedEvent: OrderPaymentCompletedEvent =
      new OrderPaymentCompletedEvent(
        orderData.orderTransactionGUID,
        orderData.orderUser,
        orderData.orderItem,
        orderData.orderAmount,
      );
    this.client.emit(
      'kafka.order.response',
      JSON.stringify(orderPaymentCompletedEvent),
    );
  }
}
