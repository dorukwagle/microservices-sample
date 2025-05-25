import { Injectable } from '@nestjs/common';
import UpdateUser from '../schema/update-user.schema';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';

@Injectable()
export class UpdateUserValidationPipe extends ZodValidationPipe {
  constructor() {
    super(UpdateUser);
  }
}
