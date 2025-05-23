import { createZodDto } from "@anatine/zod-nestjs";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import LoginSchema from "../schema/login.schema";

export class LoginDto extends createZodDto(LoginSchema) {
  @ApiPropertyOptional({
    example: 'doruk',
    type: 'string',
    description: 'Username of the user',
  })
  username?: string;
  @ApiPropertyOptional({
    example: 'doruk@example.com',
    type: 'string',
    description: 'Email of the user',
  })
  email?: string;
  @ApiPropertyOptional({
    example: '+1234567890',
    type: 'string',
    description: 'Phone number of the user',
  })
  phone?: string;
  @ApiProperty({
    example: '12345678',
    type: 'string',
    description: 'Password of the user',
    minimum: 8,
  })
  password: string;

  @ApiPropertyOptional({
    example: '12345678',
    type: 'string',
    description: 'Unique device identifier of a user. This is used to identify the device of the user. Also used for sending notifications or is used for biometric registration.',
  })
  deviceId?: string;
}
