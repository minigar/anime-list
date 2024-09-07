import { HttpStatus, Injectable } from '@nestjs/common';
import { Title } from '@prisma/client';
import { DatabaseService } from 'src/data/database.service';
import { createTitleDto } from './title.dto';
import { BusinessError } from 'src/common/errors/businessErrors/businessError';
import { TitleErrorKeys } from './titles.errorKeys';

@Injectable()
export class TitleService {
  constructor(private readonly db: DatabaseService) {}
  async getList(): Promise<Title[]> {
    return await this.db.title.findMany();
  }

  async getById(id: number): Promise<Title> {
    const title = await this.db.title.findUnique({ where: { id } });
    if (!title)
      throw new BusinessError(
        TitleErrorKeys.TITLE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    return title;
  }

  async create({
    name,
    description,
    premiereYear,
  }: createTitleDto): Promise<Title> {
    const title = await this.db.title.findUnique({ where: { name } });

    if (title) throw new BusinessError(TitleErrorKeys.TITLE_ALREADY_EXISTS);

    const createdTitle = await this.db.title.create({
      data: { name, description, premiereYear },
    });

    return createdTitle;
  }

  async deleteById(id: number): Promise<Title> {
    let title: Title;
    try {
      title = await this.db.title.delete({ where: { id } });
    } catch (e) {
      throw new BusinessError(e);
    }
    return title;
  }
}
