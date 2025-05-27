import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, hashPassword } from '@shared/utils/hash.util';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordInitDto } from './dto/reset-password-init.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { StateService } from '@shared/states/state-service';
import { StateTokenType } from '../common/entities/state-types';
import { PrismaService } from '@shared/utils/prisma.util';
import { MultiAuth, UserRole } from 'generated/prisma';
import { SESSION_VALIDITY_MILLIS } from '../common/entities/constant';
import { ClientGrpc } from '@nestjs/microservices';
import { templateType, UtilityServiceClient } from 'src/proto/utility';
import { firstValueFrom } from 'rxjs';
import { CreateAuthDto } from '../auth-crud/dto/create-auth.dto';


@Injectable()
export class AuthService {
  private readonly utilityService: UtilityServiceClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly stateService: StateService,
    @Inject('UTILITY_SERVICE') private readonly client: ClientGrpc,
  ) {
    this.utilityService =
      this.client.getService<UtilityServiceClient>('UtilityService');
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

  async login(credentials: LoginDto, deviceInfo: string) {
    const { username, email, phone, password } = credentials;
    const name = username || email || phone;

    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: name }, { email: name }, { contact: name }],
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // if device id is given, ensure it's unique
    if (credentials.deviceId) {
      await this.prisma.sessions.deleteMany({
        where: {
          deviceId: credentials.deviceId,
        },
      });
    }

    const expires =
      user.multiAuth === 'NONE'
        ? new Date(Date.now() + 3 * 60 * 1000) // 3 minutes
        : new Date(Date.now() + SESSION_VALIDITY_MILLIS); // 1 week

    const session = await this.prisma.sessions.create({
      data: {
        userId: user.userId,
        expiresAt: expires,
        roles: user.roles as any,
        sessionToken: `${randomUUID()}-${randomUUID()}`,
        deviceInfo,
        deviceId: credentials.deviceId,
      },
      select: {
        id: true,
        sessionToken: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    return session;
  }

  async extendAuthSession(id: string) {
    const session = await this.prisma.sessions.update({
      where: {
        id,
      },
      data: {
        expiresAt: new Date(Date.now() + SESSION_VALIDITY_MILLIS),
      },
      select: {
        id: true,
        sessionToken: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });
    return session;
  }

  async logout(sessionToken: string) {
    await this.prisma.sessions.delete({
      where: {
        sessionToken,
      },
    });
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.prisma.sessions.deleteMany({
      where: {
        userId,
      },
    });
    return { message: 'Logged out successfully from all devices' };
  }

  async logoutOthers(userId: string, sessionToken: string) {
    await this.prisma.sessions.deleteMany({
      where: {
        userId,
        NOT: {
          sessionToken,
        },
      },
    });
    return { message: 'Logged out successfully from all other devices' };
  }

  async activeDevices(userId: string) {
    return this.prisma.sessions.findMany({
      where: {
        userId,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        deviceInfo: true,
      },
    });
  }

  async multiFactorToggle(userId: string, authType: MultiAuth) {
    const user = await this.prisma.users.findUnique({
      where: {
        userId,
      },
      select: {
        contact: true,
        contactVerified: true,
        emailVerified: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');

    if (authType === 'PHONE' && !(user.contact && user.contactVerified))
      throw new BadRequestException(
        'Unable to set PHONE as multi factor auth. Please update & verify your phone number',
      );

    if (authType === 'EMAIL' && !user.emailVerified)
      throw new BadRequestException(
        'Unable to set EMAIL as multi factor auth. Please verify your email address',
      );

    await this.prisma.users.update({
      where: {
        userId,
      },
      data: {
        multiAuth: authType,
      },
    });
    return { message: 'Multi factor authentication updated successfully' };
  }

  async resetPasswordInit({ search }: ResetPasswordInitDto) {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: search }, { email: search }, { contact: search }],
      },
    });
    if (!user)
      return { message: 'Password reset otp and link has been sent to you' };

    const { otp } = await firstValueFrom(
      this.utilityService.createOtp({ sendTo: search }),
    );
    const resetToken = await this.stateService.generateStateToken(
      {
        id: randomUUID(),
        userId: user.userId,
        type: StateTokenType.PASSWORD_RESET,
      },
      '5m',
    ); // 5min expiration

    // send otp, reset token & login token
    if (user.contact)
      await firstValueFrom(
        this.utilityService.sendSms({
          to: user.contact,
          message: `Your OTP for password reset is: ${otp}. Please do not share this with anyone.`,
        }),
      );

    await firstValueFrom(
      this.utilityService.sendEmail({
        to: {
          email: user.email,
          name: user.username,
        },
        subject: 'Password Reset',
        body: {
          template: templateType.reset,
          data: [
            otp.toString(),
            `${process.env.APP_DOMAIN}/api/auth/reset-password/token/${resetToken}`,
          ],
        },
      }),
    );

    return {
      message: 'Password reset otp and link has been sent to you',
    };
  }

  async resetPasswordOtp({ search, otp, password }: ResetPasswordDto) {
    const res = await firstValueFrom(
      this.utilityService.verifyOtp({ sendTo: search, code: otp }),
    );
    if (res.invalid) throw new BadRequestException('Invalid OTP');

    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: search }, { email: search }, { contact: search }],
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    await this.prisma.users.update({
      where: {
        userId: user.userId,
      },
      data: {
        password: await hashPassword(password),
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  async resetPasswordToken(token: string, password: string) {
    const decodedToken = await this.stateService.verifyStateToken(token);
    if (decodedToken.type !== StateTokenType.PASSWORD_RESET)
      throw new BadRequestException('Invalid token');

    const user = await this.prisma.users.findUnique({
      where: {
        userId: decodedToken.userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.users.update({
      where: {
        userId: user.userId,
      },
      data: {
        password: await hashPassword(password),
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }
}
