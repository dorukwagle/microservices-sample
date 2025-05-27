import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import { BiometricLoginSchema } from '../schema/biometric-login.schema';

export class BiometricLoginDto extends createZodDto(BiometricLoginSchema) {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: 'string',
    description: 'Base64 encoded challenge string',
  })
  challenge: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: 'string',
    description: 'Base64 encoded signed challenge. Ensure the challenge is signed using ieee-p1363 dsa encoding. Also ensure you use P-256 (aka: prime256v1) curve',
  })
  signedChallenge: string;

  @ApiProperty({
    example: '1234567890abcdef',
    type: 'string',
    description: 'Unique device identifier sent during biometric registration. The same id is used for notification purpose, so make sure you send the same.',
  })
  deviceId: string;
}
