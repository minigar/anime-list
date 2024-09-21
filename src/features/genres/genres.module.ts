import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { GenreController } from './genres.controller';
import { GenreService } from './genres.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
