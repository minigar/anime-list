import { HttpStatus, Injectable } from '@nestjs/common';
import { Title, User } from '@prisma/client';
import { DatabaseService } from 'src/data/database.service';
import {
  createTitleDto,
  GenreQuerySortInteface,
  PaginationInterface,
  TitleSortInterface,
} from './title.dto';
import { BusinessError } from 'src/common/errors/businessErrors/businessError';
import { TitleErrorKeys } from './titles.errorKeys';
import { GenreService } from '../genres/genres.service';

@Injectable()
export class TitleService {
  constructor(
    private readonly db: DatabaseService,
    private readonly genreService: GenreService,
  ) {}
  async getList(
    paginationInterface: PaginationInterface,
    sortingInterface: TitleSortInterface,
    genres: GenreQuerySortInteface,
  ): Promise<Title[]> {
    const includeGenres =
      genres?.include?.map((str) => parseInt(str.toString(), 10)) || [];
    const excludeGenres =
      genres?.exclude?.map((str) => parseInt(str.toString(), 10)) || [];

    const validIncludeGenres = includeGenres.filter(
      (id) => !excludeGenres.includes(id),
    );

    return await this.db.title.findMany({
      skip: (paginationInterface.page - 1) * paginationInterface.perPage,
      take: Number(paginationInterface.perPage),
      orderBy: {
        [sortingInterface.sortBy || 'createdAt']:
          sortingInterface.sortOrder || 'desc',
      },
      where: {
        AND: [
          // If genres.include exists, include the relevant genre condition
          ...(genres?.include?.length
            ? [
                {
                  genres: {
                    some: {
                      id: {
                        in: validIncludeGenres,
                      },
                    },
                  },
                },
              ]
            : []),
          ...(genres?.exclude?.length
            ? [
                {
                  genres: {
                    none: {
                      id: {
                        in: excludeGenres,
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      }, //TODO: add genre validation in dto prefered
      include: { genres: { select: { id: true, name: true } } },
    });
  }

  async getListByListName(userId: number, listName: string) {
    //add pagination + filter TODO:
    return await this.db.list.findUnique({
      where: { userId_name: { name: listName, userId } },
      include: {
        titles: true,
      },
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
