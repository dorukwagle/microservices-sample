import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import UserSchema from '../schema/user.schema';

export class CreateAuthDto extends createZodDto(UserSchema) {
  @ApiProperty({
    example: 'testuser',
    type: 'string',
    description: 'Username of the user',
    uniqueItems: true,
  })
  username: string;

  @ApiProperty({
    example: 'doruk@example.com',
    type: 'string',
    description: 'Email address of the user',
    uniqueItems: true,
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    type: 'string',
    description: 'Phone/contact number of the user',
    uniqueItems: true,
    required: false,
  })
  contact?: string;

  @ApiProperty({
    example: 'testpassword',
    type: 'string',
    description: 'Password for the user account',
    minLength: 8,
  })
  password: string;
}
