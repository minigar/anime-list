import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { TitleController } from './titles.controller';
import { TitleService } from './titles.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { GenreModule } from '../genres/genres.module';

@Module({
  imports: [DatabaseModule, AuthModule, UploadModule, GenreModule],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
