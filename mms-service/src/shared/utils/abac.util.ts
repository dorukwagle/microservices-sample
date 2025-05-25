import { Samples, Users, Sessions, UserRole } from "@prisma/client";

type Action =
  | 'create'
  | 'view'
  | 'update'
  | 'delete'
  | 'viewAll'
  | 'updateAll'
  | 'deleteAll';
interface Resource {
  samples: {
    datatype: Samples;
  };
  users: {
    datatype: Users;
  };
}

type Role = UserRole;

type Permissions = {
  [key in Role]: {
    [resource in keyof Resource]?: {
      [action in Action]?:
        | boolean
        | ((
            user: Users | Sessions,
            data: Resource[keyof Resource]['datatype'],
          ) => boolean);
    };
  };
};

const UserPermissions: Permissions = {
  ADMIN: {
    samples: {
      create: true,
      viewAll: true,
      updateAll: true,
      deleteAll: true,
    },
    users: {
      view: true,
      update: (user, profile) => user.userId === profile.userId,
    },
  },
  USER: {
    samples: {
      create: true,
      view: true,
      viewAll: true,
      update: (user, sample) => user.userId === sample.userId,
      delete: true,
    },
  },
};

const hasAccess = (
  user: Users | Sessions,
  resource: keyof Resource,
  action: Action,
  data?: Resource[keyof Resource]['datatype'],
) => {
  if (!Array.isArray(user.roles)) return false;

  for (const roleName of user.roles as Role[]) {
    const role = UserPermissions[roleName];
    if (!role) continue;
    if (!role[resource]) continue;
    if (!role[resource][action]) continue;

    if (typeof role[resource][action] === 'boolean' && role[resource][action]) 
      return true;
    if (data && role[resource][action](user, data)) 
      return true;
  }

  return false;
};

export default hasAccess;
