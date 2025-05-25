import { Injectable } from '@nestjs/common';
import User from '../schema/user.schema';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';

@Injectable()
export class CreateUserValidationPipe extends ZodValidationPipe {
  constructor() {
    super(User);
  }
}
