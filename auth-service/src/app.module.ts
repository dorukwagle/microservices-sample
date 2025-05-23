import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { SessionAuthGuard } from './common/guards/session-auth.guard';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionAuthGuard,
    },
  ],
  imports: [
    AuthModule,
    SharedModule,
  ],
})
export class AppModule {}
