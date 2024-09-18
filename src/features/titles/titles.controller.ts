import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TitleService } from './titles.service';
import { Title } from '@prisma/client';
import { AdminGuard, GoogleVerificationGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decarators';
import { UploadService } from '../upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('titles')
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async getList(): Promise<Title[]> {
    return await this.titleService.getList();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Title> {
    return await this.titleService.getById(id);
  }

  @UseGuards(GoogleVerificationGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('titleImg'))
  @Post()
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,

    @Req()
    req: Request,
    @CurrentUser() { id },
  ): Promise<Title> {
    const imgUrl = await this.uploadService.getS3FileUrl(
      file.originalname,
      file.buffer,
    );

    const name: string = req.body.name;
    const description: string = req.body.description;
    const premiereYear: number = parseInt(req.body.premiereYear, 10);
    const releasedEpisodes: number = parseInt(req.body.releasedEpisodes, 10);
    const episodes: number = parseInt(req.body.episodes, 10);

    return await this.titleService.create(
      {
        name,
        description,
        premiereYear,
        imgUrl,
        releasedEpisodes,
        episodes,
      },
      id,
    );
  }

  @UseGuards(GoogleVerificationGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<Title> {
    return await this.titleService.deleteById(id);
  }
}
