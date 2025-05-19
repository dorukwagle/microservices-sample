import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RouteController } from './route.controller';

@Module({
  imports: [HttpModule],
  controllers: [RouteController],
})
export class RoutesModule {}
