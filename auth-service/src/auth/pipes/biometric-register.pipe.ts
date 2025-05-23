import { Injectable } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BiometricRegisterSchema } from '../schema/biometric-register.schema';


@Injectable()
export class BiometricRegisterValidationPipe extends ZodValidationPipe {
  constructor() {
    super(BiometricRegisterSchema);
  }
} 