import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { from } from 'rxjs';
import { AuthCrudService } from './auth-crud.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateAuthValidationPipe } from './pipes/create-auth.pipe';
import { Sessions } from 'generated/prisma';
import { Session } from '@common/decorators/session.decorator';
import { UpdatePasswordValidationPipe } from './pipes/update-password-validation.pipe';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Registration & Updates')
@Controller()
export class AuthCrudController {
  constructor(private readonly authCrudService: AuthCrudService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({
    description: 'When username, email or phone is already taken',
    example: { username: 'Username is already taken' },
  })
  @ApiBadRequestResponse({ description: 'Data validation errors' })
  @Public()
  @Post('register')
  create(@Body(CreateAuthValidationPipe) createUserDto: CreateAuthDto) {
    return from(this.authCrudService.create(createUserDto));
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Initiate email verification, send otp/link to the email',
  })
  @ApiOkResponse({
    example: { message: 'Verification OTP has been sent to your email' },
  })
  @Get('initiate/verify-email')
  verifyEmail(@Session() session: Sessions) {
    return from(this.authCrudService.verifyEmailInitiate(session.userId));
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Initiate phone number verification, send otp to the phone number',
  })
  @ApiOkResponse({
    example: { message: 'Verification OTP has been sent to your phone number' },
  })
  @ApiNotFoundResponse({
    description: "If the user doesn't have a phone number",
    example: { message: 'Please update your phone number first.' },
  })
  @Get('initiate/verify-phone')
  verifyPhone(@Session() session: Sessions) {
    return from(this.authCrudService.verifyPhoneInitiate(session.userId));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Verify email using the OTP sent' })
  @ApiOkResponse({ example: { message: 'Email verified successfully' } })
  @ApiBadRequestResponse({
    description: 'When the OTP is invalid or expired',
    example: { message: 'Invalid or expired OTP' },
  })
  @Get('verify-email/otp/:otp')
  verifyEmailOtp(@Session() session: Sessions, @Param('otp') otp: string) {
    return from(this.authCrudService.verifyEmailOtp(session.userId, otp));
  }

  @ApiOperation({ summary: 'Verify email using the temporary link' })
  @ApiOkResponse({ example: { message: 'Email verified successfully' } })
  @ApiBadRequestResponse({
    description: 'When the token is invalid or expired',
    example: { message: 'Invalid or expired token' },
  })
  @Public()
  @Get('verify-email/token/:token')
  verifyEmailToken(@Param('token') token: string) {
    return from(this.authCrudService.verifyEmailToken(token));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Verify phone number using the OTP sent' })
  @ApiOkResponse({ example: { message: 'Phone number verified successfully' } })
  @ApiBadRequestResponse({
    description: 'When the OTP is invalid or expired',
    example: { message: 'Invalid or expired OTP' },
  })
  @Get('verify-phone/otp/:otp')
  verifyPhoneOtp(@Session() session: Sessions, @Param('otp') otp: string) {
    return from(this.authCrudService.verifyPhoneOtp(session.userId, otp));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update username' })
  @ApiOkResponse({ example: { message: 'Username updated successfully' } })
  @ApiBadRequestResponse({
    description: 'When the username is already taken',
    example: { message: 'Username is already taken' },
  })
  @Patch('username')
  updateUsername(
    @Session() session: Sessions,
    @Body('username') username: string,
  ) {
    return from(this.authCrudService.updateUsername(session.userId, username));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update email' })
  @ApiOkResponse({ example: { message: 'Email updated successfully' } })
  @ApiBadRequestResponse({
    description: 'When the email is already taken',
    example: { message: 'Email is already taken' },
  })
  @Patch('email')
  updateEmail(@Session() session: Sessions, @Body('email') email: string) {
    return from(this.authCrudService.updateEmail(session.userId, email));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update phone number' })
  @ApiOkResponse({ example: { message: 'Phone number updated successfully' } })
  @ApiBadRequestResponse({
    description: 'When the phone number is already taken',
    example: { message: 'Phone number is already taken' },
  })
  @Patch('phone')
  updatePhone(@Session() session: Sessions, @Body('contact') contact: string) {
    return from(this.authCrudService.updateContact(session.userId, contact));
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update password' })
  @ApiOkResponse({ example: { message: 'Password updated successfully' } })
  @ApiBadRequestResponse({
    description: 'When the current password is incorrect',
    example: { message: 'Current password is incorrect' },
  })
  @Patch('password')
  updatePassword(
    @Session() session: Sessions,
    @Body(UpdatePasswordValidationPipe) password: UpdatePasswordDto,
  ) {
    return from(
      this.authCrudService.updatePassword(
        session.userId,
        password.currentPassword,
        password.newPassword,
      ),
    );
  }
}
