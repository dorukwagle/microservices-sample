import { MultiAuth } from 'generated/prisma';
import { z } from 'zod';

export const MultiFactorToggleSchema = z.object({
    authType: z.nativeEnum(MultiAuth)
});