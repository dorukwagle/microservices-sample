import { Module } from '@nestjs/common';
import { MmsController } from './mms.controller';
import { MmsService } from './mms.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'mms-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [MmsController],
  providers: [MmsService],
})
export class MmsModule {}
