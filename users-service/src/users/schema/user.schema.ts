import { z } from 'zod';

const UserSchema = z.object({
  fullName: z
    .string({ required_error: 'Full Name is required' })
    .refine((val) => val.split(' ').length >= 2, 'Please enter your full name'),
  username: z
    .string({ required_error: 'Username is required' })
    .min(5, 'Must be at least 5 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email'),
  phone: z
    .string({ required_error: 'Phone is required' })
    .min(10, 'Phone must be at least 10 characters long'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long'),
});

export default UserSchema;
