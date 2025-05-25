import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';
import { TEMP_UPLOAD_DIR } from '@common/entities/constant';

if (!existsSync(TEMP_UPLOAD_DIR))
  mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });

export const multerOptions: multer.Options = {
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, TEMP_UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
};
