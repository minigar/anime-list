import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { TitleController } from './titles.controller';
import { TitleService } from './titles.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
