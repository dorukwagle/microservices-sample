import { Injectable } from '@nestjs/common';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import UserSchema from '../schema/user.schema';

@Injectable()
export class CreateAuthValidationPipe extends ZodValidationPipe {
  constructor() {
    super(UserSchema);
  }
}
