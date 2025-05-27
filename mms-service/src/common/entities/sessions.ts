import UserRole from './user-role';

interface Sessions {
  userId: string;
  sessionToken: string;
  roles: UserRole[];
}

export default Sessions;
