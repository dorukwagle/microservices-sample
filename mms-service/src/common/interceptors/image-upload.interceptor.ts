// shared/interceptors/image-processing.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';
import { randomUUID } from 'crypto';
import { IMAGES_UPLOAD_DIR, IMAGE_SIZE_TYPES } from '@common/entities/constant';

const sizes: Record<IMAGE_SIZE_TYPES, number | null> = {
  small: 64,
  medium: 256,
  large: null, // keep full size but compress
};

@Injectable()
export class ImageProcessingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const file = req.file;

    if (!file) return next.handle(); // no file, continue

    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}-${Date.now()}${ext}`;

    await Promise.all(
      Object.entries(sizes).map(async ([folder, width]) => {
        const outputDir = path.join(IMAGES_UPLOAD_DIR, folder);
        const exists = await fs
          .stat(outputDir)
          .then(() => true)
          .catch(() => false);
        if (!exists) await fs.mkdir(outputDir, { recursive: true });

        const outputPath = path.join(outputDir, filename);
        let transformer = sharp(file.path).rotate();

        if (ext === '.jpg' || ext === '.jpeg')
          transformer = transformer.jpeg({ quality: 90 });

        if (ext === '.png') transformer = transformer.png({ quality: 90 });

        if (width) transformer = transformer.resize({ width });

        await transformer.toFile(outputPath);
      }),
    );

    req.processedImage = filename;

    // Clean temp file
    await fs.unlink(file.path);

    return next.handle().pipe(
      tap(() => {
        // Do nothing, already processed
      }),
    );
  }
}
