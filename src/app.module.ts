import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { TitleModule } from './features/titles/titles.module';
import { UploadModule } from './features/upload/upload.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GenreModule } from './features/genres/genres.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { ListModule } from './features/lists/lists.module';
import { SeedModule } from './features/seed/seed.module';
import { RatingModule } from './features/ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: seconds(config.getOrThrow<number>('UPLOAD_RATE_TTL_LONG')),
          limit: config.getOrThrow<number>('UPLOAD_RATE_LIMIT_LONG'),
        },
      ],
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        ttl: configService.getOrThrow('CACHE_TTL'),
        store: redisStore,
        host: configService.getOrThrow('REDIS_HOST'),
        port: configService.getOrThrow('REDIS_PORT'),
        max: configService.getOrThrow('CACHE_MAX'),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),

    AuthModule,
    TitleModule,
    UploadModule,
    GenreModule,
    ListModule,
    SeedModule,
    RatingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
