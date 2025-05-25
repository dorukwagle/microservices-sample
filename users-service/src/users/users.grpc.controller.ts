import { Controller } from "@nestjs/common";
import { UsersGrpcService } from "./users.grpc.service";
import { GrpcMethod } from "@nestjs/microservices";
import { from } from "rxjs";
import { ProfileInfoRequest, RegisterUserProfileRequest } from "@proto/users";


@Controller() 
export class UsersGrpcController {
    constructor(private readonly usersGrpcService: UsersGrpcService) {}

    @GrpcMethod('UsersService', 'RegisterUserProfile')
    registerUserProfile({userId}: RegisterUserProfileRequest) {
        return from(this.usersGrpcService.registerUserProfile(userId));
    }

    @GrpcMethod('UsersService', 'GetProfileInfo')
    getProfileInfo({userId}: ProfileInfoRequest) {
        return from(this.usersGrpcService.getProfileInfo(userId));
    }
}
