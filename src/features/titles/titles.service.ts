import { HttpStatus, Injectable } from '@nestjs/common';
import { Title, User } from '@prisma/client';
import { DatabaseService } from 'src/data/database.service';
import { createTitleDto, PaginationInterface } from './title.dto';
import { BusinessError } from 'src/common/errors/businessErrors/businessError';
import { TitleErrorKeys } from './titles.errorKeys';

@Injectable()
export class TitleService {
  constructor(private readonly db: DatabaseService) {}
  async getList(filterDto: PaginationInterface): Promise<Title[]> {
    console.log(filterDto);
    return await this.db.title.findMany({
      skip: (filterDto.page - 1) * filterDto.perPage,
      take: Number(filterDto.perPage),
    });
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

  async create(
    {
      name,
      description,
      premiereYear,
      imgUrl,
      releasedEpisodes,
      episodes,
    }: createTitleDto,
    userId: number,
  ): Promise<Title> {
    console.log(userId);
    const user: User = await this.db.user.findUnique({
      where: { id: userId, role: 'ADMIN' },
    });

    if (!user)
      throw new BusinessError('you are not an admin!, or user not found');

    const title = await this.db.title.findFirst({ where: { name } });

    if (title) throw new BusinessError(TitleErrorKeys.TITLE_ALREADY_EXISTS);

    const createdTitle = await this.db.title.create({
      data: {
        name,
        description,
        premiereYear,
        imgUrl,
        releasedEpisodes,
        episodes,
        createdBy: { connect: user },
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
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

  async addGenres(titleName: string, genres: string[]) {
    const title = await this.db.title.findUnique({
      where: { name: titleName },
    });

    if (!title) throw new BusinessError(TitleErrorKeys.TITLE_NOT_FOUND);

    const existingGenres = await this.db.genre.findMany({
      where: { name: { in: genres } },
    });

    const genreNames = existingGenres.map((genre) => genre.name);

    return await this.db.title.update({
      where: { name: titleName },
      data: {
        genres: {
          connect: genreNames.map((name) => ({ name })),
        },
      },
      select: {
        id: true,
        name: true,
        genres: { select: { id: true, name: true } },
      },
    });
  }
}
