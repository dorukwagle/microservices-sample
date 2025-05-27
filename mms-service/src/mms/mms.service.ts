import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";


@Injectable()
export class MmsService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitmqService: ClientProxy,
  ) {}

  async changeProfilePicture(userId: string, image: string) {
    this.rabbitmqService.emit('PROFILE_IMAGE_UPLOAD', {
      userId,
      imageUrl: image,
    });

    // clean up the storage
    // const dirs: IMAGE_SIZE_TYPES[] = ['small', 'medium', 'large'];
    // dirs.forEach(async (dir) => {
    //   await fs.unlink(path.join(IMAGES_UPLOAD_DIR, dir, image));
    // });

    return {
      message: 'Profile picture changed successfully',
      profilePicture: image,
    };
  }
}
