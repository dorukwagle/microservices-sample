import { createZodDto } from '@anatine/zod-nestjs';
import { ApiPropertyOptional } from '@nestjs/swagger';
import UpdateUserSchema from '../schema/update-user.schema';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {
  @ApiPropertyOptional({
    example: 'Updated User',
    type: 'string',
    description: 'Full name of the user',
  })
  fullName?: string;

  @ApiPropertyOptional({
    example: 'updateduser',
    type: 'string',
    description: 'Username of the user',
    uniqueItems: true,
  })
  username?: string;
}
