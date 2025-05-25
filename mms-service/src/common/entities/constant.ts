import { join } from 'path';

const DEFAULT_PAGE_SIZE = Number(process.env.PAGE_SIZE || 9);
const ROLES_KEY = 'roles';
const IS_PUBLIC_KEY = 'isPublic';
const SESSION_VALIDITY_MILLIS = 7 * 24 * 60 * 60 * 1000; // 7 days
const UPLOADS_DIR = join(process.cwd(), 'storage/uploads');
const IMAGES_UPLOAD_DIR = join(UPLOADS_DIR, 'images');
const TEMP_UPLOAD_DIR = join(UPLOADS_DIR, 'temp');
type IMAGE_SIZE_TYPES = 'small' | 'medium' | 'large';

export {
  DEFAULT_PAGE_SIZE,
  ROLES_KEY,
  IS_PUBLIC_KEY,
  SESSION_VALIDITY_MILLIS,
  IMAGES_UPLOAD_DIR,
  TEMP_UPLOAD_DIR,
  IMAGE_SIZE_TYPES,
};
