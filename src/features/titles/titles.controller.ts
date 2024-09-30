import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PaginationDto } from './title.dto';

@Controller('titles')
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  async getList(@Query() { page, perPage }: PaginationDto) {
    console.log(page, perPage);
    return await this.titleService.getList({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
    });
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
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

  @Patch(':titleName/genres')
  async addGenres(
    @Param('titleName') titleName: string,
    @Body('genres') genres: string[],
  ) {
    return this.titleService.addGenres(titleName, genres);
  }
}
