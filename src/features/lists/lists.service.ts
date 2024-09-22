import { Injectable } from '@nestjs/common';
import { BusinessError } from 'src/common/errors/businessErrors/businessError';
import { DatabaseService } from 'src/data/database.service';
import { ListErrorKey } from './ListErrorKey';
import { TitleErrorKeys } from '../titles/titles.errorKeys';

const ListIncludes = {
  titles: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class ListService {
  constructor(private readonly db: DatabaseService) {}

  async getList(userId: number) {
    return await this.db.user.findUnique({
      where: { id: userId },
      select: {
        list: {
          select: { id: true, name: true, createdAt: true, updatedAt: true },
        },
      },
    });
  }

  async getById(userId: number, id: number) {
    const list = await this.db.list.findUnique({
      where: { id, userId },
      include: ListIncludes,
    });

    if (!list) throw new BusinessError(ListErrorKey.LIST_NOT_FOUND);

    return list;
  }

  async create(userId: number, name: string) {
    const list = await this.db.list.findUnique({
      where: { userId_name: { name, userId } },
    });

    if (list) throw new BusinessError(ListErrorKey.LIST_EXISTS);

    return await this.db.list.create({
      data: {
        userId,
        name,
      },
    });
  }

  async updateById(userId: number, id: number, name: string) {
    const list = await this.db.list.findUnique({ where: { id, userId } });

    if (!list) throw new BusinessError(ListErrorKey.LIST_NOT_FOUND);
    return await this.db.list.update({
      where: { id },
      data: { name },
      include: ListIncludes,
    });
  }

  async deleteById(userId: number, id: number) {
    const list = await this.db.list.delete({ where: { id } });

    if (!list) throw new BusinessError(ListErrorKey.LIST_NOT_FOUND);

    await this.db.list.delete({ where: { id, userId } });

    return;
  }

  async addToList(userId: number, id: number, titleId: number) {
    const title = await this.db.title.findUnique({ where: { id: titleId } });

    if (!title) throw new BusinessError(TitleErrorKeys.TITLE_NOT_FOUND);

    const list = await this.db.list.findUnique({ where: { id, userId } });

    if (!list) throw new BusinessError(ListErrorKey.LIST_NOT_FOUND);

    const updatedList = await this.db.list.update({
      where: { id },
      data: {
        titles: {
          connect: { id: titleId },
        },
      },
      include: ListIncludes,
    });

    await this.db.list.update({
      where: { userId_name: { userId, name: 'All' } },
      data: {
        titles: {
          connect: { id: titleId },
        },
      },
    });

    return updatedList;
  }
}
