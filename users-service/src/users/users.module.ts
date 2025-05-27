import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersMicroController } from './users.micro.controller';
import { UsersMicroService } from './users.micro.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  controllers: [UsersController, UsersMicroController],
  providers: [UsersService, UsersMicroService],
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
  ],
})
export class UsersModule {}
