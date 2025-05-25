import { Injectable } from '@nestjs/common';
import QueryUserSchema from '../schema/query-user.schema';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';

@Injectable()
export class QueryUserValidationPipe extends ZodValidationPipe {
  constructor() {
    super(QueryUserSchema);
  }
}
