import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RouteController } from './route.controller';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [ProxyController, RouteController],
  // controllers: [RouteController, ProxyController]
})
export class RoutesModule {}
