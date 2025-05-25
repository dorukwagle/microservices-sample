import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import UserSchema from '../schema/user.schema';

export class CreateUserDto extends createZodDto(UserSchema) {
  @ApiProperty({
    example: 'Test User',
    type: 'string',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    example: 'testuser',
    type: 'string',
    description: 'Username of the user',
    uniqueItems: true
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
    description: 'Phone number of the user',
    uniqueItems: true,
  })
  phone: string;

  @ApiProperty({
    example: 'testpassword',
    type: 'string',
    description: 'Password for the user account',
    minLength: 8,
  })
  password: string;
}
