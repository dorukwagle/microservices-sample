import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import UpdatePasswordSchema from '../schema/update-password.schema';


export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {
  @ApiProperty({
    example: 'Current Password',
    type: 'string',
    description: 'Current password of the user',
  })
  currentPassword: string;

  @ApiProperty({
    example: 'New Password',
    type: 'string',
    description: 'New password of the user',
  })
  newPassword: string;
}
