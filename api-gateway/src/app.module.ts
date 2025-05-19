import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RoutesLoggerInterceptor } from './interceptors/routes-logger.interceptor';
import { MmsProxyMiddleware } from './middlewares/mms-proxy.middleware';
import { SessionMiddleware } from './middlewares/session.middleware';
import { RoutesModule } from './routes/routes.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [RoutesModule, LoggerModule],
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
    consumer.apply(SessionMiddleware).forRoutes('*path');

    consumer.apply(MmsProxyMiddleware).forRoutes('/v1/mms/*path');
  }
}
