// src/shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './utils/prisma.util';
import { LoggerService } from './logger/logger.service';
import { StateService } from './states/state-service';

@Global()
@Module({
  providers: [
    PrismaService,
    LoggerService,
    StateService
  ],
  exports: [
    PrismaService,
    LoggerService,
    StateService
  ],
})
export class SharedModule {}
