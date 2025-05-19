import {
  All,
  Body,
  Controller,
  Headers,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('/v1/:service')
export class RouteController {
  constructor(private readonly httpService: HttpService) {}

  @All('*')
  async forward(
    @Param('service') service: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Headers('x-session-header') sessionHeader: string,
  ) {
    const url = `http://${this.resolveTarget(service)}/api/${service}${req.path}`;

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

    try {
      const response = await firstValueFrom(this.httpService.request(config));
      res.status(response.status).json(response.data);
    } catch (err) {
      res.status(500).json({ error: 'Service communication failed' });
    }
  }

  resolveTarget(service: string): string {
    switch (service) {
      case 'auth':
        return 'localhost:3001';
      case 'users':
        return 'localhost:3002';
      case 'stock':
        return 'localhost:3003';
      default:
        return 'localhost:3004';
    }
  }
}
