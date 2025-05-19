import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MmsProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: process.env.MMS_SERVICE, // file service
    changeOrigin: true,
    pathRewrite: { '^/v1/mms': '/api/mms' },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log("proxy request received");
        if (req.headers['x-session-header']) {
          proxyReq.setHeader(
            'x-session-header',
            req.headers['x-session-header'],
          );
        }
      },
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    console.log("proxy request received");
    this.proxy(req, res, next);
  }
}
