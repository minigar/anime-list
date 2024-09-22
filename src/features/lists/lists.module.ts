import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { ListController } from './lists.controller';
import { ListService } from './lists.service';

@Module({
  imports: [DatabaseModule],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}
