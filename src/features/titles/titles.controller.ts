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
import { TitleService } from './titles.service';
import { Title } from '@prisma/client';
import { createTitleDto } from './title.dto';
import { AdminGuard, GoogleVerificationGuard } from 'src/common/guards';

@Controller('titles')
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

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
  @Post()
  async create(
    @Body() { name, description, premiereYear }: createTitleDto,
  ): Promise<Title> {
    return await this.titleService.create({
      name,
      description,
      premiereYear,
    });
  }

  @UseGuards(GoogleVerificationGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<Title> {
    return await this.titleService.deleteById(id);
  }
}
