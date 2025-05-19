import {
  All,
  Body,
  Controller,
  Headers,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom, from } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Controller('/v1/:service')
export class RouteController {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  private readonly services: Record<
    string,
    { serviceUrl: string | undefined; requiresAuth: boolean }
  > = {
    auth: { serviceUrl: process.env.AUTH_SERVICE, requiresAuth: false },
    users: { serviceUrl: process.env.USERS_SERVICE, requiresAuth: true },
    // mms: { serviceUrl: process.env.MMS_SERVICE, requiresAuth: false },
  };

  @All()
  async forward(
    @Param('service') service: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: any,
    @Headers('x-session-header') sessionHeader: string,
  ) {
    const { serviceUrl, requiresAuth } = this.services[service];

    if (!serviceUrl) throw new NotFoundException('Service not found');

    if (requiresAuth && !sessionHeader)
      throw new UnauthorizedException('Please Login First');

    const url = `${serviceUrl}${req.path}`.replace('/v1', '/api');
    const method = req.method.toLowerCase();
    const config = {
      method,
      url,
      headers: {
        ...req.headers,
        'x-session-header': sessionHeader,
      },
      data: body,
      params: req.query,
      validateStatus: () => true,
    };
    console.log("sending request to service...", url);
    return from(firstValueFrom(this.httpService.request(config)));
  }
}
