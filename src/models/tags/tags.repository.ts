import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { Tag } from './entities/tag.entity';
import type { CreateTagDto } from './dto/create-tag.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
import { ITagsRepository } from 'src/@types/interfaces/repositories/iTagsRepository.interface';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';

@Injectable()
export class TagsRepository implements ITagsRepository {
  private repository = this.dataSource.getRepository(Tag);

  constructor(private readonly dataSource: DataSource) {}

  async findByName(name: string): Promise<Tag | null> {
    return await this.repository.findOneBy({ name });
  }

  async findWithRelations(id: number): Promise<void> {
    await this.repository.findOne({
      where: { id },
      relations: ['snippets', 'tutorials'],
    });
  }

  async findAllWithRelations(): Promise<Tag[]> {
    return await this.repository.find({
      relations: ['snippets', 'tutorials'],
    });
  }

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Tag>> {
    const queryBuilder = this.repository.createQueryBuilder('tag');

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

  async findOneBy(options: object): Promise<Tag | null> {
    return this.repository.findOne({ where: options });
  }

  async findOne(options: object): Promise<Tag | null> {
    return this.repository.findOne(options);
  }

  async save(entity: CreateTagDto): Promise<Tag> {
    return this.repository.save(entity);
  }

  create(entity: CreateTagDto): Tag {
    return this.repository.create(entity);
  }

  async update(id: number, entity: UpdateTagDto): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
