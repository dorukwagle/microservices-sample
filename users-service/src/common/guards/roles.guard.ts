import { ROLES_KEY } from '@common/entities/constant';
import UserRole from '@common/entities/user-role';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { session }: Request = context.switchToHttp().getRequest();

    if (!session) return false;

    const userRoles = session.roles as UserRole[];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
