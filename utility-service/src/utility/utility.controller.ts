import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  OtpRequest,
  SendEmailRequest,
  SendSmsRequest,
  VerifyOtpRequest,
} from '../proto/utility';
import { SmsService } from 'src/sms/sms-service';
import { OtpService } from 'src/otp/otp-service';
import { MailService } from 'src/mailer/mail-service';
import { from } from 'rxjs';

@Controller()
export class UtilityGrpcController {
  constructor(
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  @GrpcMethod('UtilityService', 'SendEmail')
  sendEmail({to, body, subject}: SendEmailRequest) {
    return this.mailService.sendMail(to!, subject, body as any);
  }

  @GrpcMethod('UtilityService', 'SendSms')
  sendSms({to, message}: SendSmsRequest) {
    return this.smsService.sendSms(to, message);
  }

  @GrpcMethod('UtilityService', 'CreateOtp')
  createOtp({sendTo}: OtpRequest) {
    return from(this.otpService.generateOtp(sendTo));
  }

  @GrpcMethod('UtilityService', 'VerifyOtp')
  verifyOtp(data: VerifyOtpRequest) {
    return from(this.otpService.verifyOtp(data.sendTo, data.code));
  }
}
