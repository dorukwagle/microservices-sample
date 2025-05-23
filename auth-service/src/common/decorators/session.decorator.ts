import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Sessions } from 'generated/prisma';

export const Session = createParamDecorator(
  (data: keyof Sessions | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session as Sessions | undefined;
    return data ? session?.[data] : session;
  },
);
