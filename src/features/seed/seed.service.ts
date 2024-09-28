import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/data/database.service';

@Injectable()
export class SeedService {
  constructor(private readonly db: DatabaseService) {}

  async seed() {
    await this.db.title.deleteMany();
    await this.db.list.deleteMany();
    await this.db.genre.deleteMany();
    await this.db.user.deleteMany();

    const listNames = ['favorite', 'all', 'plans', 'watching', 'watched'];

    const genres = [
      'Action',
      'Romance',
      'Fantasy',
      'Adventure',
      'Drama',
      'Horror',
      'Comedy',
      'Slice of Life',
      'Sci-Fi',
      'Mystery',
      'Supernatural',
      'Psychological',
      'Mecha',
      'Thriller',
      'Sports',
      'Historical',
      'Music',
      'Ecchi',
      'Shounen',
      'Shoujo',
    ];

    const animeList = [
      { name: 'Attack on Titan', premiereYear: 2013, episodes: 75 },
      { name: 'My Hero Academia', premiereYear: 2016, episodes: 88 },
      { name: 'Naruto', premiereYear: 2002, episodes: 220 },
      { name: 'One Piece', premiereYear: 1999, episodes: 1071 },
      { name: 'Demon Slayer', premiereYear: 2019, episodes: 44 },
      { name: 'Jujutsu Kaisen', premiereYear: 2020, episodes: 24 },
      { name: 'Spy x Family', premiereYear: 2022, episodes: 25 },
      { name: 'Tokyo Revengers', premiereYear: 2021, episodes: 37 },
      { name: 'Chainsaw Man', premiereYear: 2022, episodes: 12 },
      { name: 'Death Note', premiereYear: 2006, episodes: 37 },
      { name: 'Bleach', premiereYear: 2004, episodes: 366 },
      { name: 'Sword Art Online', premiereYear: 2012, episodes: 96 },
      { name: 'Black Clover', premiereYear: 2017, episodes: 170 },
      { name: 'Hunter x Hunter', premiereYear: 2011, episodes: 148 },
      { name: 'Dragon Ball Z', premiereYear: 1989, episodes: 291 },
      { name: 'Fairy Tail', premiereYear: 2009, episodes: 328 },
      { name: 'Fruits Basket', premiereYear: 2019, episodes: 63 },
      { name: 'Neon Genesis Evangelion', premiereYear: 1995, episodes: 26 },
      { name: 'Cowboy Bebop', premiereYear: 1998, episodes: 26 },
      { name: 'Steins;Gate', premiereYear: 2011, episodes: 24 },
    ];

    const createdGenres = await Promise.all(
      genres.map((genre) => this.db.genre.create({ data: { name: genre } })),
    );

    const users = await Promise.all(
      Array.from({ length: 20 }).map((_, i) =>
        this.db.user.create({
          data: {
            name: `user${i + 1}`,
            email: `user${i + 1}@gmail.com`,
            role: i === 0 ? 'ADMIN' : null,
            list: {
              createMany: {
                data: listNames
                  .sort(() => 0.5 - Math.random())
                  .slice(0, Math.floor(Math.random() * listNames.length) + 1)
                  .map((l) => ({ name: l })),
              },
            },
          },
        }),
      ),
    );

    await Promise.all(
      animeList.map((anime) => {
        const randomGenres = createdGenres
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .map((genre) => ({ id: genre.id }));

        const randomUser = users[Math.floor(Math.random() * users.length)];

        return this.db.title.create({
          data: {
            name: anime.name,
            description: `Description of ${anime.name}`,
            premiereYear: anime.premiereYear,
            episodes: anime.episodes,
            imgUrl: `https://anime-list-bucket.s3.eu-north-1.amazonaws.com/${anime.name
              .toLowerCase()
              .replace(/\s+/g, '-')}.jpg`,
            releasedEpisodes: anime.episodes - 1,
            createdBy: { connect: { id: randomUser.id } },
            genres: { connect: randomGenres },
          },
        });
      }),
    );
  }
}
