// shared/decorators/upload-image.decorator.ts
import { ImageProcessingInterceptor } from '@common/interceptors/image-upload.interceptor';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@shared/utils/image-upload-config.util';


export function ImageUpload(fieldName = 'image') {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, multerOptions),
      ImageProcessingInterceptor,
    ),
  );
}
