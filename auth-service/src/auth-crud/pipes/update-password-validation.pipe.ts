import { Injectable } from '@nestjs/common';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import UpdatePasswordSchema from '../schema/update-password.schema';


@Injectable()
export class UpdatePasswordValidationPipe extends ZodValidationPipe {
  constructor() {
    super(UpdatePasswordSchema);
  }
}
