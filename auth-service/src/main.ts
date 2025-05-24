import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './shared/logger/logger.service';
import { AllExceptionsFilter } from './common/filters/global-exception.filter';
import initializeSwagger from './shared/utils/initialize-swagger.util';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggerService)));

  app.setGlobalPrefix('api/auth');

  // create auth microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, '../../proto/auth.proto'),
      url: '0.0.0.0:40010'
    },
  });

  app.startAllMicroservices();

  // setup swagger docs
  initializeSwagger(app, app.get(Reflector));

  await app.listen(4001);
}
bootstrap();
