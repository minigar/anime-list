import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './data/database.module';
import { AuthModule } from './features/auth.module';
@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
