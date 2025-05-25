import User from './user.schema';

const UpdateUserSchema = User.omit({
  password: true,
  email: true,
  phone: true,
}).partial();

export default UpdateUserSchema;
