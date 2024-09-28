import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [DatabaseModule],
  providers: [SeedService],
  controllers: [SeedController],
  exports: [SeedService],
})
export class SeedModule {}
