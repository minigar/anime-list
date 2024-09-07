import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TitleService } from './titles.service';
import { Title } from '@prisma/client';
import { createTitleDto } from './title.dto';

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

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<Title> {
    return await this.titleService.deleteById(id);
  }
}
