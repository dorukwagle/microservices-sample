import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FileProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'http://localhost:3004', // file service
    changeOrigin: true,
    pathRewrite: { '^/v1/files': '/api/files' },
    on: {
      proxyReq: (proxyReq, req, res) => {
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
    this.proxy(req, res, next);
  }
}
