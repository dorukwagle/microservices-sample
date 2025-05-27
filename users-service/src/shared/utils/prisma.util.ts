import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';

const databaseUrl: { [key: string]: string } = {
  production: process.env.PRODUCTION_DATABASE_URL || '',
  development: process.env.DEV_DATABASE_URL || '',
  test: process.env.TEST_DATABASE_URL || '',
};

const prisma = new PrismaClient({
  datasourceUrl: databaseUrl[process.env.NODE_ENV || 'development'],
}).$extends({
  query: {
    $allModels: {
      $allOperations({ model, operation, query, args }) {
        if (operation.includes('create')) return query(args);
        if (!operation.includes('delete')) {
          // @ts-ignore
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ datasourceUrl: databaseUrl[process.env.NODE_ENV || 'development'] });
    Object.assign(this, prisma);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
