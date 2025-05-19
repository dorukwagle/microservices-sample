import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cookie from 'cookie';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionCookie = cookies['sessionToken'];
    const sessionBearer = req.headers['authorization']?.split(' ');
    const bearerToken = sessionBearer && sessionBearer[1];

    const sessionToken = sessionCookie || bearerToken;

    if (!sessionToken) return next();

    const session = await new PrismaClient().sessions.findUnique({
      where: {
        sessionToken,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        userId: true,
        roles: true,
        sessionToken: true,
      },
    });

    if (!session) return next();

    // Base64 encode user session info
    const payload = Buffer.from(JSON.stringify(session)).toString('base64');

    req.headers['x-session-header'] = payload;

    next();
  }
}
