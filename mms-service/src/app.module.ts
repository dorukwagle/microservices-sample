import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MmsModule } from './mms/mms.module';

@Module({
  imports: [
    MmsModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage/uploads/images'),
      serveRoot: '/images',
      exclude: ['/images/temp*'],
    }),
  ],
})
export class AppModule {}
