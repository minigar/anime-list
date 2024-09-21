import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { GenreDto } from './genre.dto';
import { Throttle } from '@nestjs/throttler';
import { AdminGuard, GoogleVerificationGuard } from 'src/common/guards';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('genres')
@Throttle({ default: { limit: 20, ttl: 2000 } })
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get()
  async getList() {
    return await this.genreService.getList();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get(':name')
  async getByName(@Param('name') name: string) {
    return await this.genreService.getByName(name);
  }

  @UseGuards(GoogleVerificationGuard)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() genreDto: GenreDto) {
    return this.genreService.create(genreDto.name);
  }

  @UseGuards(GoogleVerificationGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.deleteById(id);
  }
}
