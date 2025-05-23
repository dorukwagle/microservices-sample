import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formatted = result.error.format();
      const errors: Record<string, string[]> = {};
      for (const key in formatted) {
        if (key === '_errors') continue;
        const field = formatted[key];
        errors[key] = field?._errors[0] ?? [];
      }

      throw new BadRequestException({
        message: 'Input validation failed',
        errors,
      });
    }
    return result.data;
  }
}
