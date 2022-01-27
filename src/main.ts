import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'cqrs_main_producer',
          brokers: ['localhost:29092'],
        },
        consumer: {
          groupId: 'cqrs_main_producer_groupId',
        },
      },
    },
  );
  await app.listen();
  console.log('Microservice running');
}
bootstrap();
