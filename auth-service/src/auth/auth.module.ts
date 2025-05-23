import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MultiFactor } from './multi-factor.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UTILITY_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'utility',
          protoPath: join(__dirname, '../../../proto/utility.proto'),
          url: process.env.UTILITY_SERVICE_URL,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MultiFactor],
})
export class AuthModule {}
