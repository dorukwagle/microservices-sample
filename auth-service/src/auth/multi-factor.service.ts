import { StateTokenType } from '@common/entities/state-types';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { StateService } from '@shared/states/state-service';
import { PrismaService } from '@shared/utils/prisma.util';
import { MultiAuth, Sessions, Users } from 'generated/prisma';
import { firstValueFrom } from 'rxjs';
import { templateType, UtilityServiceClient } from 'src/proto/utility';


@Injectable()
export class MultiFactor {
  private readonly utilityService: UtilityServiceClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly stateService: StateService,
    @Inject('UTILITY_SERVICE') private readonly client: ClientGrpc,
  ) {
    this.utilityService = this.client.getService<UtilityServiceClient>('UtilityService');
  }

  async init(user: Users, tempSession: Sessions, authType: MultiAuth) {
    const {otp} = await firstValueFrom(this.utilityService.createOtp({sendTo: user.contact}));

    const authToken = this.stateService.generateStateToken({
      id: tempSession.id,
      userId: user.userId,
      type: StateTokenType.MULTI_FACTOR_AUTH,
    }, '3m');

    if (authType === "PHONE" && user.contact) 
      await firstValueFrom(this.utilityService.sendSms({to: user.contact, message: `Your OTP for multi factor authentication is: ${otp}. Please do not share this with anyone.`}));
    if (authType === "EMAIL") {
      await firstValueFrom(this.utilityService.sendEmail({
        to: {
          email: user.email,
          name: user.username
        }, 
        subject: 'OTP for Multi Factor Authentication',
        body: {
          template: templateType.otp,
          data: [otp.toString()]
        }
      }));

    return {
        status: 'MFA_REQUIRED',
        token: authToken,
        message: `OTP has been sent to your ${authType.toLowerCase()}.`
    };
  }
}

  async verifyAuth(token: string, otp: string) {
    const state = await this.stateService.verifyStateToken(token);
    if (state.type !== StateTokenType.MULTI_FACTOR_AUTH) 
        throw new BadRequestException('Invalid token');

    const user = await this.prisma.users.findUnique({ where: { userId: state.userId } });
    if (!user) throw new BadRequestException('User not found');

    const {invalid} = await firstValueFrom(this.utilityService.verifyOtp({sendTo: user.contact, code: otp}));
    if (invalid) throw new BadRequestException('Invalid OTP');

    return {...user, state };
  }
}
