import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { SessionAuthGuard } from './common/guards/session-auth.guard';
import { AuthCrudModule } from './auth-crud/auth-crud.module';

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
    AuthCrudModule,
    SharedModule,
  ],
})
export class AppModule {}
