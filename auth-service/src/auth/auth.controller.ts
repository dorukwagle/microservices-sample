import {
  Controller,
  Post,
  Body,
  Delete,
  UsePipes,
  Res,
  Req,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginValidationPipe } from './pipes/login.pipe';
import { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { LoginErrorDto } from './dto/login-error.dto';
import { extractDeviceInfo } from '../shared/utils/device-info.utils';
import { UserResponseDto } from './dto/user-response.dto';
import { from } from 'rxjs';
import { Session } from './decorators/session.decorator';
import { MultiFactorToggleValidationPipe } from './pipes/multi-factor-toggle.pipe';
import { MultiFactorToggleDto } from './dto/multi-factor-toggle.dto';
import { ResetPasswordInitValidationPipe } from './pipes/reset-password-init.pipe';
import { ResetPasswordInitDto } from './dto/reset-password-init.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordPipe } from './pipes/reset-password.pipe';
import { SESSION_VALIDITY_MILLIS } from '../common/entities/constant';
import { MultiFactor } from './multi-factor.service';
import { Sessions, Users } from 'generated/prisma';


export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_VALIDITY_MILLIS, // 1 week
  domain:
    process.env.NODE_ENV === 'production'
      ? process.env.DOMAIN || 'localhost'
      : 'localhost',
};

@ApiTags('Authentications & Security')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly multiFactor: MultiFactor,
  ) {}

  @ApiCreatedResponse({
    description: 'Normal login, wihout two factor authentication',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 202,
    description: 'When two factor authentication is enabled',
    example: {
      status: 'MFA_REQUIRED',
      token: '123456',
      message: 'OTP has been sent to your phone.',
    },
  })
  @ApiUnauthorizedResponse({ type: LoginErrorDto })
  @ApiOperation({
    summary: 'Login user',
    description:
      'Login user with credentials: provide any two i.e. password & either username, email or phone',
  })
  @Public()
  @Post('login')
  @UsePipes(LoginValidationPipe)
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const session = await this.authService.login(
      credentials,
      extractDeviceInfo(req),
    );

    // if multi factor is enabled, send otp
    if (session.user.multiAuth !== 'NONE') {
      res.status(202);
      return this.multiFactor.init(
        session.user as Users,
        session as any,
        session.user.multiAuth,
      );
    }

    res.cookie('sessionId', session.sessionId, sessionCookieOptions as any);

    return session.user;
  }

  @ApiOperation({
    summary: 'Second stage of multi factor auth',
    description:
      'Send the OTP sent to your phone/email along with multi factor token in route params',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ type: LoginErrorDto })
  @ApiBody({ schema: { example: { otp: '123456' } } })
  @Public()
  @Post('login/mfa/:token')
  async mfa(
    @Param('token') token: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.multiFactor.verifyAuth(token, otp);
    const session = await this.authService.extendAuthSession(data.userId);

    res.cookie('sessionId', session.sessionId, sessionCookieOptions as any);
    return session.user;
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get active devices',
    description:
      'Get the list of all the devices in which user is currently logged in',
  })
  @ApiOkResponse({
    example: [
      { deviceInfo: 'Chrome on Windows' },
      { deviceInfo: 'Safari on Mac' },
    ],
  })
  @Get('active-devices')
  activeDevices(@Session() session: Sessions) {
    return from(this.authService.activeDevices(session.userId));
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Toggle multi factor authentication',
    description: 'Enable/disable multi factor authentication',
  })
  @ApiOkResponse({
    example: { message: 'Multi factor authentication updated successfully' },
  })
  @ApiBadRequestResponse({
    example: {
      message:
        'Unable to set PHONE as multi factor auth. Please update your phone number',
    },
  })
  @ApiBadRequestResponse({
    example: {
      message:
        'Unable to set EMAIL as multi factor auth. Please verify your email address',
    },
  })
  @Post('multi-factor-toggle')
  multiFactorToggle(
    @Session() session: Sessions,
    @Body(MultiFactorToggleValidationPipe) body: MultiFactorToggleDto,
  ) {
    return from(
      this.authService.multiFactorToggle(session.userId, body.authType),
    );
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout user from current device',
  })
  @ApiOkResponse({ example: { message: 'Logged out successfully' } })
  @Delete('logout')
  logout(@Session() session: Sessions) {
    return from(this.authService.logout(session.sessionId));
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout user from all devices',
  })
  @ApiOkResponse({
    example: { message: 'Logged out successfully from all devices' },
  })
  @Delete('logout-all')
  logoutAll(@Session() session: Sessions) {
    return from(this.authService.logoutAll(session.userId));
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout user from all the other devices',
  })
  @ApiOkResponse({
    example: { message: 'Logged out successfully from all other devices' },
  })
  @Delete('logout-others')
  logoutOthers(@Session() session: Sessions) {
    return from(
      this.authService.logoutOthers(session.userId, session.sessionId),
    );
  }

  @ApiOperation({
    summary: 'Reset Password Initiate',
    description:
      'Initiate the Reset password process, sends you reset OTP and reset link to your phone & email.',
  })
  @ApiOkResponse({
    example: { message: 'Password reset otp and link has been sent to you' },
  })
  @Public()
  @Post('reset-password/init')
  resetPasswordInit(
    @Body(ResetPasswordInitValidationPipe) body: ResetPasswordInitDto,
  ) {
    return from(this.authService.resetPasswordInit(body));
  }

  @ApiOperation({
    summary: 'Reset Password via otp',
    description: 'Reset your password with the reset OTP',
  })
  @ApiOkResponse({ example: { message: 'Password reset successfully' } })
  @ApiBadRequestResponse({ example: { message: 'Invalid OTP' } })
  @Public()
  @Post('reset-password/otp')
  resetPasswordOtp(@Body(ResetPasswordPipe) body: ResetPasswordDto) {
    return from(this.authService.resetPasswordOtp(body));
  }

  @ApiOperation({
    summary: 'Reset Password via reset token',
    description: 'Reset your password with the reset link sent via email',
  })
  @ApiOkResponse({ example: { message: 'Password reset successfully' } })
  @ApiBadRequestResponse({ example: { message: 'Invalid OTP' } })
  @ApiBadRequestResponse({
    description: 'When the password length is invalid',
    example: { message: 'Password must be between 8 to 32 characters long' },
  })
  @Public()
  @Post('reset-password/token/:token')
  resetPasswordToken(
    @Body('password') password: string,
    @Param('token') token: string,
  ) {
    const len = password.length;
    if (len < 8 || len > 32)
      throw new BadRequestException(
        'Password must be between 8 to 32 characters long',
      );

    return from(this.authService.resetPasswordToken(token, password));
  }
}
