import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    const exitHandler = async () => {
      try {
        await app.close();
      } catch (e) {
        console.log('Error during shutdown', e);
      } finally {
        process.exit(0);
      }
    };

    process.on('SIGINT', () => {
      exitHandler();
    });

    process.on('SIGTERM', () => {
      exitHandler();
    });

    process.on('SIGUSR2', () => {
      exitHandler();
    });
  }
}
