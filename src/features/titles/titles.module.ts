import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { TitleController } from './titles.controller';
import { TitleService } from './titles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
