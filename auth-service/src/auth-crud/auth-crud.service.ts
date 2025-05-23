import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/utils/prisma.util';
import { CreateAuthDto } from './dto/create-auth.dto';
import { hashPassword } from '@shared/utils/hash.util';
import { UserRole } from 'generated/prisma';
import { BadRequestException } from '@nestjs/common';
import { UtilityServiceClient } from 'src/proto/utility';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthCrudService {
  private readonly utilityService: UtilityServiceClient;

  constructor(private readonly prisma: PrismaService, 
    @Inject('UTILITY_SERVICE') private readonly client: ClientGrpc) 
    {
    this.utilityService = this.client.getService<UtilityServiceClient>('UtilityService');
  }

  async create(createUserDto: CreateAuthDto) {
    const { username, email, contact, password } = createUserDto;

    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }, { contact }],
      },
    });

    if (existingUser) {
      const { username: u, email: e } = existingUser;
      throw new BadRequestException(
        `${username === u ? 'Username' : email === e ? 'Email' : 'Contact'} already taken`,
      );
    }

    const hashedPassword = await hashPassword(password);

    return this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        roles: [UserRole.USER],
      },
      omit: {
        password: true,
      },
    });
  }
}
