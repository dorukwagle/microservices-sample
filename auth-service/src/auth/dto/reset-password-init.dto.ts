import { ApiProperty } from '@nestjs/swagger';
import { ResetPasswordInitSchema } from '../schema/reset-password-init.schema';
import { createZodDto } from '@anatine/zod-nestjs';

export class ResetPasswordInitDto extends createZodDto(ResetPasswordInitSchema) {
  @ApiProperty({
    description: 'Search term to find the user (email or phone number)',
    example: 'user@example.com',
  })
  search: string;
}