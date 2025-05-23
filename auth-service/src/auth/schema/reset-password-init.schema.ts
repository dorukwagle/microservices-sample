import { z } from 'zod';

export const ResetPasswordInitSchema = z.object({
    search: z.string(),
});