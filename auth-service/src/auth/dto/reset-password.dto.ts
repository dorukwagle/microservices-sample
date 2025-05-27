import { ApiProperty } from '@nestjs/swagger';
import { ResetPasswordSchema } from '../schema/reset-password.schema';
import { createZodDto } from '@anatine/zod-nestjs';

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {
  @ApiProperty({
    description: 'Search term to find the user (email, phone number or username)',
    example: 'user@gmail.com',
  })
  search: string;

  @ApiProperty({
    description: 'One-time password sent to the user',
    example: '123456',
  })
  otp: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'SecurePassword123!',
  })
  password: string;
}