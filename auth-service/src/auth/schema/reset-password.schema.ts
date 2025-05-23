import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  search: z.string(),
  otp: z.string(),
  password: z.string()
    .min(8)
    .max(32)
});
