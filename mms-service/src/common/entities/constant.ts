import { join } from 'path';

const IS_PUBLIC_KEY = 'isPublic';
const UPLOADS_DIR = join(process.cwd(), 'storage/uploads');
const IMAGES_UPLOAD_DIR = join(UPLOADS_DIR, 'images');
const TEMP_UPLOAD_DIR = join(UPLOADS_DIR, 'temp');
type IMAGE_SIZE_TYPES = 'small' | 'medium' | 'large';

export {
  IS_PUBLIC_KEY,
  IMAGES_UPLOAD_DIR,
  TEMP_UPLOAD_DIR,
  IMAGE_SIZE_TYPES,
};
