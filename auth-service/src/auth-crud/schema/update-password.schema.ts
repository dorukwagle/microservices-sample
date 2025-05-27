import { z } from 'zod';

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(32),
  newPassword: z.string().min(8).max(32),
});

export default UpdatePasswordSchema;
