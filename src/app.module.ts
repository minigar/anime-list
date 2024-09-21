import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { TitleModule } from './features/titles/titles.module';
import { UploadModule } from './features/upload/upload.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GenreModule } from './features/genres/genres.module';
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
    AuthModule,
    TitleModule,
    UploadModule,
    GenreModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
