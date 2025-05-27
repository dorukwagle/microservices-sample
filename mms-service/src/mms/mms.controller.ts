import { Session } from "@common/decorators/session.decorator";
import { ImageUpload } from "@common/decorators/upload-image.decorator";
import Sessions from "@common/entities/sessions";
import { Controller, Patch, UploadedFile } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { from } from "rxjs";
import { MmsService } from "./mms.service";


@Controller('images')
export class MmsController {
  constructor(private readonly mmsService: MmsService) {}

  @ApiCookieAuth()
  @ApiOperation({
    summary:
      'Change current user profile picture. Deletes the old images from storage.',
  })
  @ApiOkResponse({
    example: {
      message: 'Profile picture changed successfully',
      profilePicture: 'profile-picture.jpg',
    },
  })
  @Patch('profile-picture')
  @ImageUpload('profilePicture')
  changeProfilePicture(
    @Session() session: Sessions,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return from(
      this.mmsService.changeProfilePicture(session.userId, file.filename),
    );
  }
}
