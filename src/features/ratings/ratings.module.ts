import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { RatingController } from './ratings.controller';
import { RatingService } from './ratings.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
