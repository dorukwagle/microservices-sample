import { All, Controller, Next, Req, Res, ServiceUnavailableException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";


@Controller('/v1/mms')
export class ProxyController {
  constructor() {}

  private proxy = createProxyMiddleware({
    target: process.env.MMS_SERVICE, // file service
    changeOrigin: true,
    pathRewrite: { '^/v1/mms': '/api/mms' },
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.headers['x-session-header']) {
          proxyReq.setHeader(
            'x-session-header',
            req.headers['x-session-header'],
          );
        }
      },
      error: (err, req: Request, res: Response) => {
        console.error('\x1b[31m[Proxy Error]', err.message, '\x1b[0m');

        if (!res.headersSent) {
          res.status(503).json({
            statusCode: 503,
            message: 'MMS service currently unavailable',
            error: (err as any).code,
            timestamp: new Date(),
            path: req.originalUrl
          });
        }
      },
}
  });

  @All()
  forward(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    this.proxy(req, res, next);
  }

  @All('*rest')
  forwardRest(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    this.proxy(req, res, next);
  }
}