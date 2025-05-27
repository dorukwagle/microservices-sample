import { Module } from '@nestjs/common';
import { UtilityModule } from './utility/utility.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, UtilityModule],
})
export class AppModule {}
