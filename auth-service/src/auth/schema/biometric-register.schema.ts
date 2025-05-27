import { z } from "zod";

export const BiometricRegisterSchema = z.object({
  deviceId: z.string(),
  publicKey: z.string(),
});
