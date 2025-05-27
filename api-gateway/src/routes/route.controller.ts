import {
  All,
  BadGatewayException,
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
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Controller('/v1/*serviceApi')
export class RouteController {
  constructor(
    private readonly httpService: HttpService,
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
    @Param('serviceApi') serviceApi: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: any,
    @Headers('x-session-header') sessionHeader: string,
  ) {
    const { serviceUrl, requiresAuth } = this.services[serviceApi[0]] || { serviceUrl: undefined, requiresAuth: false };

    if (!serviceUrl) throw new BadGatewayException('Service not found');

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
    
    const response = await firstValueFrom(this.httpService.request(config));
    
   res.status(response.status);
   res.set(response.headers);

   return response.data;
  }
}
