import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './ratings.service';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decarators';
import { RatingDto } from './rating.dto';
import { GoogleVerificationGuard } from 'src/common/guards';

@Controller('titles/:titleId/rate')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(GoogleVerificationGuard)
  async upsert(
    @Param('titleId', ParseIntPipe) titleId: number,
    @CurrentUser() { id }: User,
    @Body() { value }: RatingDto,
  ) {
    return await this.ratingService.upsert(titleId, id, value);
  }

  @Delete(':id')
  @UseGuards(GoogleVerificationGuard)
  async deleteById(
    @Param('titleId', ParseIntPipe) titleId: number,
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.ratingService.deleteById(titleId, user.id, id);
  }
}
