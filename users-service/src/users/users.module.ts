import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersGrpcController } from './users.grpc.controller';
import { UsersGrpcService } from './users.grpc.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  controllers: [UsersController, UsersGrpcController],
  providers: [UsersService, UsersGrpcService],
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:40010',
          package: 'auth',
          protoPath: join(__dirname, '../../../proto/auth.proto'),
        },
      },
    ]),
  ]
})
export class UsersModule {}
