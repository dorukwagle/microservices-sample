import { IS_PUBLIC_KEY } from '@common/entities/constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@shared/utils/prisma.util';
import { Request } from 'express';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  private readonly loginMessage = 'Please login first';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();

    const payload = request.headers['x-session-header'];

    if (!payload || typeof payload !== 'string')
      throw new UnauthorizedException(this.loginMessage);

    // Attach user to request object
    request.session = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8'),
    );

    return true;
  }
}
