import { z } from 'zod';

export const BiometricLoginSchema = z.object({
  challenge: z.string(),
  signedChallenge: z.string(),
  deviceId: z.string(),
});
