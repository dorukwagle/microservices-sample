import {
    Body,
    Controller,
    Post,
    Req,
    Res
} from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { ApiBadRequestResponse, ApiBody, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BiometricRegisterDto } from './dto/biometric-register.dto';
import { from } from 'rxjs';
import { BiometricLoginDto } from './dto/biometric-login.dto';
import { BiometricRegisterValidationPipe } from './pipes/biometric-register.pipe';
import { BiometricLoginValidationPipe } from './pipes/biometric-login.pipe';
import { sessionCookieOptions } from './auth.controller';
import { Request, Response } from 'express';
import { extractDeviceInfo } from '@shared/utils/device-info.utils';
import { Public } from './decorators/public.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { Session } from './decorators/session.decorator';
import { Sessions } from 'generated/prisma';

@ApiTags('Biometrics Authentication')
@Controller('auth/biometrics')
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @ApiOperation({ summary: 'Register biometrics for the first time to use it', description: 'Send the deviceId and public key. you need to generate the public/private assymetric key pairs' })
  @ApiOkResponse({ description: 'Successful registration', example: {message: 'Biometrics registered successfully'} })
  @ApiCookieAuth()
  @Post('register')
  registerBiometrics(@Body(BiometricRegisterValidationPipe) registerDto: BiometricRegisterDto, @Session() session: Sessions) {
    return from(this.biometricService.registerBiometrics(session.userId, registerDto));
  }

  @ApiOperation({ summary: 'Request login challenge', description: 'Initiate biometric authentication' })
  @ApiOkResponse({ description: 'Successful challenge request', example: {challenge: 'sdlhjfklsd324093284032sldkjf'} })
  @ApiBody({description: 'Your unique device id used while registering biometrics', schema: {example: {deviceId: '1234567890'}}})
  @Public()
  @Post('request-login')
  requestLoginChallenge(@Body('deviceId') deviceId: string) {
    return from(this.biometricService.requestLoginChallenge(deviceId));
  }

  @ApiOperation({ summary: 'Verify biometric authentication', description: 'Verify biometric authentication: Make sure to sign the challenge using ' })
  @ApiOkResponse({ description: 'Successful verification returns user object along with sessionId in the cookie header', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'When the biometric verification fails', example:{ message: 'Invalid biometric data'}})
  @ApiUnauthorizedResponse({ description: 'When biometric signature fails', example: {message: 'Biometric signature verification failed'}})
  @Public()
  @Post('verify-login')
  async verifyBiometric(@Body(BiometricLoginValidationPipe) data: BiometricLoginDto, @Res({passthrough: true}) res: Response, @Req() req: Request) {
    const session = await this.biometricService.verifyBiometric(data, extractDeviceInfo(req));

    res.cookie('sessionId', session.sessionId, sessionCookieOptions as any);
    return session.user;
  }
}
