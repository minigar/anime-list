import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/data/database.module';
import { TitleController } from './titles.controller';
import { TitleService } from './titles.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [DatabaseModule, AuthModule, UploadModule],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
