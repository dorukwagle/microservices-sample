import { Module } from '@nestjs/common';
import { UtilityModule } from './utility/utility.module';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/global-exception.filter';

@Module({
  imports: [SharedModule, UtilityModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
