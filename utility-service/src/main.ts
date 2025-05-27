import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AllExceptionsFilter } from './common/filters/global-exception.filter';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'utility',
        protoPath: join(__dirname, '../../proto/utility.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );

    app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggerService)));


  await app.listen();
}
bootstrap();

