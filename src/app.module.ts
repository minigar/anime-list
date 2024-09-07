import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { TitleModule } from './features/titles/titles.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TitleModule],
})
export class AppModule {}
