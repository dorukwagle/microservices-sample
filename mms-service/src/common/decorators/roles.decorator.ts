import { ROLES_KEY } from '@common/entities/constant';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
