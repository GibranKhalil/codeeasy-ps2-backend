import { Injectable } from '@nestjs/common';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';
import { DataSource } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';

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

  async findOneBy(options: object): Promise<Game | null> {
    return await this.repository.findOne({ where: options });
  }
  async save(entity: CreateGameDto): Promise<Game> {
    return await this.repository.save(entity);
  }
  create(entity: CreateGameDto): Game {
    return this.repository.create(entity);
  }
  async update(id: number, entity: UpdateGameDto): Promise<void> {
    await this.repository.update(id, entity);
  }
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
