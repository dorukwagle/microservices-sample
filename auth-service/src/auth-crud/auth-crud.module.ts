import { Module } from "@nestjs/common";
import { AuthCrudController } from "./auth-crud.controller";
import { AuthCrudService } from "./auth-crud.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [ClientsModule.register([
    {
      name: 'UTILITY_SERVICE',
      transport: Transport.GRPC,
      options: {
        package: 'utility',
        protoPath: join(__dirname, '../../../proto/utility.proto'),
        url: process.env.UTILITY_SERVICE_URL,
      },
    },
  ])],
  controllers: [AuthCrudController],
  providers: [AuthCrudService],
})
export class AuthCrudModule {}