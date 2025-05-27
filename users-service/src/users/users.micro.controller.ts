import { Controller } from '@nestjs/common';
import { UsersMicroService } from './users.micro.service';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import { from } from 'rxjs';
import { ProfileInfoRequest, RegisterUserProfileRequest } from '@proto/users';

@Controller()
export class UsersMicroController {
  constructor(private readonly usersMicroService: UsersMicroService) {}

  @GrpcMethod('UsersService', 'RegisterUserProfile')
  registerUserProfile({ userId }: RegisterUserProfileRequest) {
    return from(this.usersMicroService.registerUserProfile(userId));
  }

  @GrpcMethod('UsersService', 'GetProfileInfo')
  getProfileInfo({ userId }: ProfileInfoRequest) {
    return from(this.usersMicroService.getProfileInfo(userId));
  }

  @EventPattern('PROFILE_IMAGE_UPLOAD')
  handleProfileImageUpload(data: { userId: string; imageUrl: string }) {
    return this.usersMicroService.updateProfilePicture(data.userId, data.imageUrl);
  }
}
