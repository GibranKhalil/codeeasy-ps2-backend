import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { Interactions } from 'src/@types/interactions.type';

@Injectable()
export class TutorialRepository implements ITutorialsRepository {
  private repository = this.dataSource.getRepository(Tutorial);

  constructor(private readonly dataSource: DataSource) {}

  async find(
    page = 1,
    limit = 10,
    filters?: { category?: number },
  ): Promise<IPaginatedResult<Tutorial>> {
    const queryBuilder = this.repository.createQueryBuilder('tutorial');

    queryBuilder
      .leftJoinAndSelect('tutorial.category', 'category')
      .leftJoinAndSelect('tutorial.creator', 'creator');

    queryBuilder
      .select([
        'tutorial.id',
        'tutorial.title',
        'tutorial.pid',
        'tutorial.excerpt',
        'tutorial.readTime',
        'tutorial.coverImage_url',
        'tutorial.status',
        'tutorial.tags',
        'tutorial.createdAt',
        'category.name',
        'creator.username',
        'creator.avatarUrl',
      ])
      .where('tutorial.status = :status', { status: eContentStatus.APPROVED });

    if (filters?.category && Number(filters?.category)) {
      queryBuilder.andWhere('category.id = :category', {
        category: Number(filters?.category),
      });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('tutorial.createdAt', 'DESC')
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
      relations: ['creator', 'category'],
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
      relations: ['creator', 'category'],
    });
  }

  async findAllWithRelations(): Promise<Tutorial[]> {
    return this.repository.find({
      relations: ['creator', 'category'],
    });
  }

  async findByTagsAndCategory(
    page = 1,
    limit = 10,
    filters?: { category?: number; tags?: string[]; pid?: string },
  ): Promise<IPaginatedResult<Tutorial>> {
    const queryBuilder = this.repository.createQueryBuilder('tutorial');

    queryBuilder
      .leftJoinAndSelect('tutorial.category', 'category')
      .leftJoinAndSelect('tutorial.creator', 'creator');

    queryBuilder
      .select([
        'tutorial.id',
        'tutorial.title',
        'tutorial.pid',
        'tutorial.excerpt',
        'tutorial.readTime',
        'tutorial.coverImage_url',
        'tutorial.status',
        'tutorial.tags',
        'tutorial.createdAt',
        'category.name',
        'creator.username',
        'creator.avatarUrl',
      ])
      .where('tutorial.status = :status', { status: eContentStatus.APPROVED });

    if (filters?.category && Number(filters?.category)) {
      queryBuilder.andWhere('category.id = :category', {
        category: Number(filters?.category),
      });
    }

    if (
      filters?.tags &&
      Array.isArray(filters.tags) &&
      filters.tags.length > 0
    ) {
      queryBuilder.andWhere('tutorial.tags @> :tags', { tags: filters.tags });
    }

    if (filters?.pid) {
      queryBuilder.andWhere('tutorial.pid <> :pid', { pid: filters.pid });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('tutorial.createdAt', 'DESC')
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

  async findOne(options: object): Promise<Tutorial | null> {
    return this.repository.findOne(options);
  }

  create(entity: CreateTutorialDto): Tutorial {
    return this.repository.create(entity);
  }

  async addInteraction(id: number, interactionDto: keyof Interactions) {
    const allowedFields: (keyof Interactions)[] = ['likes', 'views'];

    if (!allowedFields.includes(interactionDto)) {
      throw new Error('Campo de interação inválido.');
    }

    const qb = this.repository
      .createQueryBuilder()
      .update(Tutorial)
      .where('id = :id', { id });

    qb.set({
      [interactionDto]: () => `"${interactionDto}" + 1`,
    });

    await qb.execute();

    return;
  }

  async save(entity: CreateTutorialDto): Promise<Tutorial> {
    return this.repository.save(entity);
  }

  async update(id: number, entity: UpdateTutorialDto): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
