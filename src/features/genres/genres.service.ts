import { Injectable } from '@nestjs/common';
import { BusinessError } from 'src/common/errors/businessErrors/businessError';
import { DatabaseService } from 'src/data/database.service';
import { GenreErrorKey } from './genreErrorKey';

@Injectable()
export class GenreService {
  constructor(private readonly db: DatabaseService) {}
  async getList() {
    return this.db.genre.findMany({});
  }

  async getByName(name: string) {
    const genre = await this.db.genre.findUnique({
      where: { name },
      include: { titles: { select: { id: true, name: true } } },
    });
    if (!genre) throw new BusinessError(GenreErrorKey.GENRE_DOES_NOT_EXISTS);
    return genre;
  }

  async create(name: string) {
    const genre = await this.db.genre.findUnique({ where: { name } });
    if (genre) throw new BusinessError(GenreErrorKey.GENRE_NAME_EXISTS);

    const createGenre = await this.db.genre.create({ data: { name } });
    return createGenre;
  }

  async deleteById(id: number) {
    const genre = await this.db.genre.findUnique({ where: { id } });
    if (!genre) throw new BusinessError(GenreErrorKey.GENRE_DOES_NOT_EXISTS);
    await this.db.genre.delete({ where: { id } });
  }
}
