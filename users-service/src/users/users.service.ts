import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '@shared/utils/prisma.util';
import Paginator from '@shared/utils/pagination.util';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from 'generated/prisma';
import { AuthServiceClient } from '@proto/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  private readonly authService: AuthServiceClient;
  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE') authClient: ClientGrpc,
  ) {
    this.authService = authClient.getService<AuthServiceClient>('AuthService');
  }

  async findAll({ seed, ...query }: QueryUserDto) {
    return new Paginator<Prisma.UsersFindManyArgs>(
      this.prisma,
      'users',
      {
        where: {
          OR: [
            { fullName: { contains: seed } },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      query,
    ).get();
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { user: authInfo } = await firstValueFrom(this.authService.getAuthInfo({ userId: id }));

    return {
      ...user,
      ...authInfo
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto) throw new BadRequestException('Nothing to update');

    return this.prisma.users.update({
      where: {
        userId: id,
      },
      data: updateUserDto,
    });
  }

  // async disable(id: string) {
  //   const { count } = await this.prisma.users.updateMany({
  //     where: {
  //       userId: id,
  //     },
  //     data: {
  //       status: AccountStatus.DISABLED,
  //     },
  //   });

  //   if (!count) throw new NotFoundException('User not found');
  //   return { message: 'User disabled successfully' };
  // }

  // async enable(id: string) {
  //   const { count } = await this.prisma.users.updateMany({
  //     where: {
  //       userId: id,
  //     },
  //     data: {
  //       status: AccountStatus.ACTIVE,
  //     },
  //   });

  //   if (!count) throw new NotFoundException('User not found');
  //   return { message: 'User enabled successfully' };
  // }

  // async changeProfilePicture(userId: string, image: string) {
  //   const user = await this.prisma.users.findUnique({
  //     where: { userId },
  //     select: { profilePicture: true },
  //   });

  //   await this.prisma.users.update({
  //     where: { userId },
  //     data: { profilePicture: image },
  //   });

  //   // clean up the storage
  //   const dirs: IMAGE_SIZE_TYPES[] = ['small', 'medium', 'large'];
  //   dirs.forEach(async (dir) => {
  //     await fs.unlink(path.join(IMAGES_UPLOAD_DIR, dir, image));
  //   });

  //   return {
  //     message: 'Profile picture changed successfully',
  //     profilePicture: image,
  //   };
  // }
}
