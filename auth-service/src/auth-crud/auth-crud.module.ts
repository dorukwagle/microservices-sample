import { Module } from "@nestjs/common";
import { AuthCrudController } from "./auth-crud.controller";
import { AuthCrudService } from "./auth-crud.service";

@Module({
  controllers: [AuthCrudController],
  providers: [AuthCrudService],
})
export class AuthCrudModule {}