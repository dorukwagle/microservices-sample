// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.20.3
// source: utility.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "utility";

export enum templateType {
  welcome = 0,
  otp = 1,
  reset = 2,
  verify = 3,
  UNRECOGNIZED = -1,
}

export interface Otp {
  id: string;
  sentTo: string;
  otp: string;
}

export interface To {
  email: string;
  name: string;
}

export interface MailContent {
  template: templateType;
  data: string[];
}

export interface SendEmailRequest {
  to: To | undefined;
  subject: string;
  body: MailContent | undefined;
}

export interface SendSmsRequest {
  to: string;
  message: string;
}

export interface OtpRequest {
  sendTo: string;
}

export interface VerifyOtpRequest {
  sendTo: string;
  code: string;
}

export interface GenerateOtpResponse {
  otp: number;
}

export interface VerifyOtpResponse {
  otpRecord?: Otp | undefined;
  invalid?: boolean | undefined;
}

export interface SendMailResponse {
  statusCode: number;
}

export interface SendSmsResponse {
  statusCode: number;
}

export const UTILITY_PACKAGE_NAME = "utility";

export interface UtilityServiceClient {
  sendEmail(request: SendEmailRequest): Observable<SendMailResponse>;

  sendSms(request: SendSmsRequest): Observable<SendSmsResponse>;

  createOtp(request: OtpRequest): Observable<GenerateOtpResponse>;

  verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse>;
}

export interface UtilityServiceController {
  sendEmail(request: SendEmailRequest): Promise<SendMailResponse> | Observable<SendMailResponse> | SendMailResponse;

  sendSms(request: SendSmsRequest): Promise<SendSmsResponse> | Observable<SendSmsResponse> | SendSmsResponse;

  createOtp(request: OtpRequest): Promise<GenerateOtpResponse> | Observable<GenerateOtpResponse> | GenerateOtpResponse;

  verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> | Observable<VerifyOtpResponse> | VerifyOtpResponse;
}

export function UtilityServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendEmail", "sendSms", "createOtp", "verifyOtp"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UtilityService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UtilityService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const UTILITY_SERVICE_NAME = "UtilityService";
