import { z } from 'zod';

const UserSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(5, 'Must be at least 5 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email'),
  contact: z
    .string()
    .min(10, 'Contact number must be at least 10 characters long')
    .optional(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long'),
});

export default UserSchema;