// src/shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './utils/prisma.util';
import { LoggerService } from './logger/logger.service';
import { MailService } from './mailer/mail-service';
import { SmsService } from './sms/sms-service';
import { StateService } from './states/state-service';
import { OtpService } from './otp/otp-service';

@Global()
@Module({
  providers: [
    PrismaService,
    LoggerService,
    MailService,
    StateService,
    SmsService,
    OtpService,
  ],
  exports: [
    PrismaService,
    LoggerService,
    MailService,
    StateService,
    SmsService,
    OtpService,
  ],
})
export class SharedModule {}
