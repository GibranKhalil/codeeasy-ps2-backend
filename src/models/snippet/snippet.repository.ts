import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Snippet } from './entities/snippet.entity';
import type { ISnippetRepository } from 'src/@types/interfaces/repositories/iSnippetRepository.interface';
import type { CreateSnippetDto } from './dto/create-snippet.dto';
import type { UpdateSnippetDto } from './dto/update-snippet.dto';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';

@Injectable()
export class SnippetRepository implements ISnippetRepository {
  private repository = this.dataSource.getRepository(Snippet);

  constructor(private readonly dataSource: DataSource) {}

  async findByCreator(creatorId: number): Promise<Snippet[]> {
    return this.repository.find({
      where: { creator: { id: creatorId } },
      relations: ['creator', 'lastModifier', 'modifiers', 'tags'],
    });
  }

  async findWithRelations(id: number): Promise<Snippet | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['creator', 'lastModifier', 'modifiers', 'tags'],
    });
  }

  private async findAllWithCreatorRelation(
    page: number,
    limit: number,
  ): Promise<IPaginatedResult<Snippet>> {
    const queryBuilder = this.repository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.creator', 'creator')
      .select([
        's.id',
        's.pid',
        's.title',
        's.description',
        's.language',
        's.code',
        's.createdAt',
        'creator.avatarUrl',
        'creator.username',
        'creator.pid',
      ])
      .where('s.status = :status', { status: eContentStatus.APPROVED });

    const total = await queryBuilder.getCount();
    queryBuilder.skip((page - 1) * limit).take(limit);
    const data = await queryBuilder.getMany();
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

  async findAllWithRelations(): Promise<Snippet[]> {
    return this.repository.find({
      relations: ['creator', 'lastModifier', 'modifiers', 'tags'],
    });
  }

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Snippet>> {
    return this.findAllWithCreatorRelation(page, limit);
  }
  async findOneBy(options: object): Promise<Snippet | null> {
    return this.repository.findOne({ where: options });
  }
  async save(entity: CreateSnippetDto): Promise<Snippet> {
    return this.repository.save(entity);
  }
  create(entity: CreateSnippetDto): Snippet {
    return this.repository.create(entity);
  }

  async update(id: number, entity: UpdateSnippetDto): Promise<void> {
    await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
