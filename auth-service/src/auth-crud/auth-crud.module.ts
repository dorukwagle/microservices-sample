import { Module } from "@nestjs/common";
import { AuthCrudController } from "./auth-crud.controller";
import { AuthCrudService } from "./auth-crud.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AuthCrudGrpcController } from "./auth-crud.grpc.controller";
import { AuthCrudGrpcService } from "./auth-crud.grpc.service";

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
      {
        name: 'USERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: join(__dirname, '../../../proto/users.proto'),
          url: process.env.USERS_SERVICE_URL,
        },
      },
    ]),
  ],
  controllers: [AuthCrudController, AuthCrudGrpcController],
  providers: [AuthCrudService, AuthCrudGrpcService],
})
export class AuthCrudModule {}