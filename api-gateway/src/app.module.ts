import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RoutesLoggerInterceptor } from './interceptors/routes-logger.interceptor';
import { FileProxyMiddleware } from './middlewares/file-proxy.middleware';
import { SessionMiddleware } from './middlewares/session.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RoutesLoggerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');

    consumer.apply(FileProxyMiddleware).forRoutes('/v1/files/(.*)');
  }
}
