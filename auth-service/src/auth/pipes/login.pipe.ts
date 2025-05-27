import { Injectable } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import LoginSchema from '../schema/login.schema';

@Injectable()
export class LoginValidationPipe extends ZodValidationPipe {
  constructor() {
    super(LoginSchema);
  }
}