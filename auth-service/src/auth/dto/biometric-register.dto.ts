import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import { BiometricRegisterSchema } from '../schema/biometric-register.schema';

export class BiometricRegisterDto extends createZodDto(BiometricRegisterSchema) {
  @ApiProperty({
    example: '1234567890abcdef',
    description:
      'Unique device identifier of a device. This is used to identify the device of the user.',
  })
  readonly deviceId: string;

  @ApiProperty({
    example: '3423532532253254654345',
    description:
      'Public key used for biometric authentication. Ensure the public key is exported in SPKI (X.509 SubjectPublicKeyInfo) format',
  })
  readonly publicKey: string;
}
