import { Controller } from "@nestjs/common";
import { AuthCrudGrpcService } from "./auth-crud.grpc.service";
import { GrpcMethod } from "@nestjs/microservices";
import { from } from "rxjs";


@Controller()
export class AuthCrudGrpcController {
    constructor(private readonly authCrudGrpcService: AuthCrudGrpcService) {}

    @GrpcMethod('AuthService', 'GetAuthInfo')
    getAuthInfo(data: { userId: string }) {
        return from(this.authCrudGrpcService.getAuthInfo(data.userId));
    }
}