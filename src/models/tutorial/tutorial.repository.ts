import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { PaginationParams } from 'src/@types/paginationParams.type';

@Injectable()
export class TutorialRepository implements ITutorialsRepository {
  private repository = this.dataSource.getRepository(Tutorial);

  constructor(private readonly dataSource: DataSource) {}

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Tutorial>> {
    const queryBuilder = this.repository.createQueryBuilder('tutorial');

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

  async findOneBy(options: object): Promise<Tutorial | null> {
    return this.repository.findOne({ where: options });
  }

  async findFeaturedTutorialsWithCreator(): Promise<Tutorial[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.creator', 'creator')
      .leftJoinAndSelect('t.category', 'category')
      .select([
        't.id',
        't.pid',
        't.title',
        't.excerpt',
        't.readTime',
        't.coverImage_url',
        'creator.avatarUrl',
        'creator.username',
        'creator.pid',
        'category.name',
      ])
      .limit(3)
      .where('t.status = :status', { status: eContentStatus.APPROVED })
      .orderBy('t.views', 'DESC');

    return queryBuilder.getMany();
  }

  async findByCreator(
    creatorId: number,
    pagination: PaginationParams,
  ): Promise<IPaginatedResult<Tutorial>> {
    const { limit = 10, page = 1 } = pagination;

    const skip = (page - 1) * limit;

    const [tutorials, total] = await this.repository.findAndCount({
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
      data: tutorials,
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

  async findWithRelations(id: number): Promise<Tutorial | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['creator', 'tags', 'category'],
    });
  }

  async findAllWithRelations(): Promise<Tutorial[]> {
    return this.repository.find({
      relations: ['creator', 'tags', 'category'],
    });
  }

  async findOne(options: object): Promise<Tutorial | null> {
    return this.repository.findOne(options);
  }

  create(entity: CreateTutorialDto): Tutorial {
    return this.repository.create(entity);
  }

  async save(entity: CreateTutorialDto): Promise<Tutorial> {
    return this.repository.save(entity);
  }

  async update(id: number, entity: UpdateTutorialDto): Promise<void> {
    await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
