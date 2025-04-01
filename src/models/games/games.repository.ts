import { Injectable } from '@nestjs/common';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { PaginationParams } from 'src/@types/paginationParams.type';

@Injectable()
export class GamesRepository implements IGamesRepository {
  private repository = this.dataSource.getRepository(Game);

  constructor(private readonly dataSource: DataSource) {}

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Game>> {
    const queryBuilder = this.repository.createQueryBuilder('game');

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
  ): Promise<IPaginatedResult<Game>> {
    const { limit = 10, page = 1 } = pagination;

    const skip = (page - 1) * limit;

    const [games, total] = await this.repository.findAndCount({
      where: { creator: { id: creatorId } },
      relations: ['creator', 'tags', 'category'],
      take: limit,
      skip: skip,
      order: {
        createdAt: 'DESC',
      },
    });

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
