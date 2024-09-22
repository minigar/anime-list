import { ListDto } from './list.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ListService } from './lists.service';
import { CurrentUser } from 'src/common/decarators';
import { GoogleVerificationGuard } from 'src/common/guards';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  @UseGuards(GoogleVerificationGuard)
  async getList(@CurrentUser('id', ParseIntPipe) userId: number) {
    return await this.listService.getList(userId);
  }

  @Get(':id')
  @UseGuards(GoogleVerificationGuard)
  async getById(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.listService.getById(userId, id);
  }

  @Post()
  @UseGuards(GoogleVerificationGuard)
  async create(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Body() { name }: ListDto,
  ) {
    return await this.listService.create(userId, name);
  }

  @Put(':id')
  @UseGuards(GoogleVerificationGuard)
  async updateById(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() { name }: ListDto,
  ) {
    return await this.listService.updateById(userId, id, name);
  }

  @Delete(':id')
  @UseGuards(GoogleVerificationGuard)
  async deleteById(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.listService.deleteById(userId, id);
  }

  @Patch(':id/titles/:titleId')
  @UseGuards(GoogleVerificationGuard)
  async addToList(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('titleId', ParseIntPipe) titleId: number,
  ) {
    return await this.listService.addToList(userId, id, titleId);
  }
}
