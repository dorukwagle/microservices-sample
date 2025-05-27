import { z } from 'zod';

const LoginSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string({ required_error: 'Password is required' }),
  deviceId: z.string().optional(),
}).refine((obj) => (obj.username || obj.email || obj.phone), {
  message: 'Either username, email or phone is required',
});

export default LoginSchema;
