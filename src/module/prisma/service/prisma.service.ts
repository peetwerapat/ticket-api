import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Prisma, PrismaClient } from '@prisma/client';

const configService = new ConfigService();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const options =
      configService.get('ENV') === 'DEV'
        ? {
            log: [
              { emit: 'event', level: 'query' as Prisma.LogLevel },
              {
                emit: 'stdout',
                level: 'query' as Prisma.LogLevel,
              },
              {
                emit: 'stdout',
                level: 'error' as Prisma.LogLevel,
              },
              {
                emit: 'stdout',
                level: 'info' as Prisma.LogLevel,
              },
              {
                emit: 'stdout',
                level: 'warn' as Prisma.LogLevel,
              },
            ] as Prisma.LogDefinition[],
          }
        : undefined;
    super(options);
    if (configService.get('ENV') === 'DEV') {
      this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);
      process.on('query', (e: Prisma.QueryEvent) => this.logger.debug(`${e.query} ${e.params}`));
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      app.close().then(() => {});
    });
  }
}
