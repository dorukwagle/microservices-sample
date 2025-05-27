// src/shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './utils/prisma.util';
import { LoggerService } from './logger/logger.service';

@Global()
@Module({
  providers: [
    PrismaService,
    LoggerService,
  ],
  exports: [
    PrismaService,
    LoggerService,
  ],
})
export class SharedModule {}
