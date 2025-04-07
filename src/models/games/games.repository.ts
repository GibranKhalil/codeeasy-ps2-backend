import { Injectable } from '@nestjs/common';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { Interactions } from 'src/@types/interactions.type';

@Injectable()
export class GamesRepository implements IGamesRepository {
  private repository = this.dataSource.getRepository(Game);

  constructor(private readonly dataSource: DataSource) {}

  async find(
    page = 1,
    limit = 10,
    filters?: { category?: number },
  ): Promise<IPaginatedResult<Game>> {
    const queryBuilder = this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.category', 'category')
      .leftJoinAndSelect('game.creator', 'creator')
      .where('game.status = :status', { status: eContentStatus.APPROVED });

    if (filters?.category && Number(filters?.category)) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: Number(filters.category),
      });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(options: object): Promise<Game | null> {
    return await this.repository.findOne(options);
  }

  async findFeaturedGamesWithCreator(): Promise<Game[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.creator', 'creator')
      .leftJoinAndSelect('g.category', 'category')
      .select([
        'g.id',
        'g.pid',
        'g.title',
        'g.excerpt',
        'g.version',
        'g.downloads',
        'g.fileSize',
        'g.coverImage_url',
        'creator.avatarUrl',
        'creator.username',
        'creator.pid',
        'category.name',
      ])
      .limit(3)
      .where('g.status = :status', { status: eContentStatus.APPROVED })
      .orderBy('g.views', 'DESC');

    return queryBuilder.getMany();
  }

  async findByCreator(
    creatorId: number,
    pagination: PaginationParams,
    excludePid?: string,
  ): Promise<IPaginatedResult<Game>> {
    const { limit = 10, page = 1 } = pagination;

    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.creator', 'creator')
      .leftJoinAndSelect('game.category', 'category')
      .where('creator.id = :creatorId AND game.status = :status', {
        creatorId,
        status: eContentStatus.APPROVED,
      });

    if (excludePid) {
      queryBuilder.andWhere('game.pid != :excludePid', { excludePid });
    }

    const total = await queryBuilder.getCount();

    const games = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('game.createdAt', 'DESC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: games,
      meta: {
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        limit,
        page,
        total,
        totalPages,
      },
    };
  }

  async findOneBy(options: object): Promise<Game | null> {
    return await this.repository.findOne({ where: options });
  }

  async save(entity: CreateGameDto): Promise<Game> {
    return await this.repository.save(entity);
  }

  async addInteraction(id: number, interactionDto: keyof Interactions) {
    const allowedFields: (keyof Interactions)[] = [
      'likes',
      'views',
      'stars',
      'downloads',
    ];

    if (!allowedFields.includes(interactionDto)) {
      throw new Error('Campo de interação inválido.');
    }

    const qb = this.repository
      .createQueryBuilder()
      .update(Game)
      .where('id = :id', { id });

    qb.set({
      [interactionDto]: () => `"${interactionDto}" + 1`,
    });

    await qb.execute();

    return;
  }

  create(entity: CreateGameDto): Game {
    return this.repository.create(entity);
  }

  async update(id: number, entity: UpdateGameDto): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
