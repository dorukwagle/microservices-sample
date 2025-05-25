import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '@shared/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = isHttpException
      ? exception.getResponse()
      : { message: 'Internal server error' };

    const stack = (exception as any)?.stack || 'No stack trace available';

    // Log only server-side or unknown errors (500+)
    if (status >= 500) {
      this.logger.error(
        JSON.stringify({
          method: request.method,
          url: request.url,
          statusCode: status,
          message: (errorResponse as any).message || 'Internal server error',
          stack,
        }),
        stack,
      );
    }
    const res = {
      message: 'No one knows, what happened',
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof errorResponse === 'object' ? errorResponse : {}),
    };

    const { ip, method, url } = request;
    if (process.env.NODE_ENV === 'development')
      console.log(
        `\x1b[1m\x1b[35m[${ip} ${method} => ${status}] \x1b[1m\x1b[3m${url}\x1b[0m\x1b[35m\n\x1b[2m${JSON.stringify(res)}\x1b[0m`,
      );
    
    response.status(status).json(res);
  }
}
