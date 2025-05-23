import { Injectable } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BiometricLoginSchema } from '../schema/biometric-login.schema';

@Injectable()
export class BiometricLoginValidationPipe extends ZodValidationPipe {
  constructor() {
    super(BiometricLoginSchema);
  }
}
