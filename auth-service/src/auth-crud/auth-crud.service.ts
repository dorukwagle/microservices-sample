import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@shared/utils/prisma.util';
import { CreateAuthDto } from './dto/create-auth.dto';
import { comparePassword, hashPassword } from '@shared/utils/hash.util';
import { UserRole } from 'generated/prisma';
import { BadRequestException } from '@nestjs/common';
import { templateType, UtilityServiceClient } from 'src/proto/utility';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ExpiredOrInvalidStateTokenException } from '@common/exceptions/invalid-token.exception';
import { StateTokenType } from '@common/entities/state-types';
import { randomUUID } from 'node:crypto';
import { StateService } from '@shared/states/state-service';

@Injectable()
export class AuthCrudService {
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

  async verifyEmailInitiate(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { userId },
      select: { email: true, username: true },
    });

    const {otp} = await firstValueFrom(this.utilityService.createOtp({ sendTo: user!.email }));
    const token = await this.stateService.generateStateToken({
      id: randomUUID(),
      email: user!.email,
      type: StateTokenType.EMAIL_VERIFICATION,
    });

    await firstValueFrom(this.utilityService.sendEmail({
      to: {
        email: user!.email,
        name: user!.username,
      },
      subject: 'Verify your email',
      body: {
        template: templateType.verify,
        data: [
          otp.toString(),
          `${process.env.APP_DOMAIN}/v1/auth/verify-email/token/${token}`,
        ],
      },
    }));

    return { message: 'Verification OTP has been sent to your email' };
  }

  async verifyPhoneInitiate(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { userId },
      select: { contact: true, username: true },
    });

    if (!user?.contact)
      throw new NotFoundException('Please update your phone number first');

    const {otp} = await firstValueFrom(
      this.utilityService.createOtp({ sendTo: user!.contact }),
    );

    await firstValueFrom(this.utilityService.sendSms(
      { to: user!.contact, message: `Your OTP for phone verification is ${otp}` },
    ));

    return { message: 'Verification OTP has been sent to your phone number' };
  }

  async verifyEmailOtp(userId: string, otp: string) {
    const user = await this.prisma.users.findUnique({
      where: { userId },
      select: { email: true },
    });

    const validOtp = await firstValueFrom(
      this.utilityService.verifyOtp({ sendTo: user!.email, code: otp }),
    );
    if (validOtp.invalid) throw new BadRequestException('Invalid or expired OTP');

    await this.prisma.users.update({
      where: { userId },
      data: { emailVerified: true },
    });

    return { message: 'Email verified successfully' };
  }

  async verifyEmailToken(token: string) {
    const payload = await this.stateService.verifyStateToken(token);
    if (payload.type !== StateTokenType.EMAIL_VERIFICATION)
      throw new ExpiredOrInvalidStateTokenException();

    const user = await this.prisma.users.findUnique({
      where: { email: payload.email },
      select: { email: true, username: true },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.users.update({
      where: { email: payload.email },
      data: { emailVerified: true },
    });

    return { message: 'Email verified successfully' };
  }

  async verifyPhoneOtp(userId: string, otp: string) {
    const user = await this.prisma.users.findUnique({
      where: { userId },
      select: { contact: true },
    });

    if (!user?.contact)
      throw new NotFoundException('Please update your contact number first');

    const validOtp = await firstValueFrom(
      this.utilityService.verifyOtp({ sendTo: user!.contact, code: otp }),
    );
    if (validOtp.invalid) throw new BadRequestException('Invalid or expired OTP');

    await this.prisma.users.update({
      where: { userId },
      data: { contactVerified: true },
    });

    return { message: 'Phone number verified successfully' };
  }

  async updateUsername(userId: string, username: string) {
    const user = await this.prisma.users.findUnique({
      where: { username },
      select: { username: true },
    });

    if (user) throw new BadRequestException('Username is already taken');

    await this.prisma.users.update({
      where: { userId },
      data: { username },
    });

    return { message: 'Username updated successfully' };
  }

  async updateEmail(userId: string, email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: { email: true },
    });

    if (user) throw new BadRequestException('Email is already taken');

    await this.prisma.users.update({
      where: { userId },
      data: { email, emailVerified: false },
    });

    return { message: 'Email updated successfully' };
  }

  async updateContact(userId: string, contact: string) {
    const user = await this.prisma.users.findUnique({
      where: { contact },
      select: { contact: true },
    });

    if (user) throw new BadRequestException('Phone number is already taken');

    await this.prisma.users.update({
      where: { userId },
      data: { contact, contactVerified: false },
    });

    return { message: 'Phone number updated successfully' };
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { userId },
      select: { password: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Current password is incorrect');

    await this.prisma.users.update({
      where: { userId },
      data: { password: await hashPassword(newPassword) },
    });

    return { message: 'Password updated successfully' };
  }
}
