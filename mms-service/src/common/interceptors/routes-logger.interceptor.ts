import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RoutesLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { ip, method, originalUrl, body } = req;

    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;

        console.log(
            '\x1b[34m\x1b[1m[' + ip + ' ' + method + '] ',
            '\x1b[3m' + originalUrl + '\x1b[0m');
        console.log(
            '\x1b[34m\x1b[2m' + JSON.stringify(body) + '\x1b[0m');
        console.log(
            '\x1b[36m\x1b[1m' + '=> [' + statusCode + ' ~ ' + duration + 'ms]' + '\x1b[0m');
        console.log(
            '\x1b[36m\x1b[2m' + JSON.stringify(data) + '\x1b[0m');
      }),
    );
  }
}
