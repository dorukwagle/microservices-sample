import { Module } from '@nestjs/common';
import { UtilityGrpcController } from './utility.controller';
import { MailService } from 'src/mailer/mail-service';
import { SmsService } from 'src/sms/sms-service';
import { OtpService } from 'src/otp/otp-service';

@Module({
  controllers: [UtilityGrpcController],
  providers: [MailService, SmsService, OtpService],
})
export class UtilityModule {}
