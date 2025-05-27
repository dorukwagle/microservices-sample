import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/global-exception.filters';
import { LoggerService } from './logger/logger.service';
import { RoutesLoggerInterceptor } from './interceptors/routes-logger.interceptor';
import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggerService)));

    if (process.env.NODE_ENV === 'production') {
      app.use(helmet());
      app.enableCors();
      app.use(compression());
    }


  if (process.env.NODE_ENV === 'development')
    app.useGlobalInterceptors(new RoutesLoggerInterceptor());

  await app.listen(process.env.GATEWAY_PORT ?? 4000);
}
bootstrap();
