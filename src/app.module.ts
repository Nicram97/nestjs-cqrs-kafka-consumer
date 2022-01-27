import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NestjsKafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'cqrs_consumer',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'cqrs_consumer_groupId',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
