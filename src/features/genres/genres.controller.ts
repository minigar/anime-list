import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { GenreDto } from './genre.dto';
import { Throttle } from '@nestjs/throttler';
import { AdminGuard, GoogleVerificationGuard } from 'src/common/guards';

@Controller('genres')
@Throttle({ default: { limit: 20, ttl: 2000 } })
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
  @Get()
  async getList() {
    return await this.genreService.getList();
  }

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
