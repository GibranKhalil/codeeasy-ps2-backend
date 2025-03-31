import { ICategoriesRepository } from 'src/@types/interfaces/repositories/iCategoriesRepository.interface';
import { Category } from './entities/category.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  private repository = this.dataSource.getRepository(Category);

  constructor(private readonly dataSource: DataSource) {}

  async findByName(name: string): Promise<Category | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async findWithRelations(id: number): Promise<Category | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['tutorials'],
    });
  }

  async findAllWithRelations(): Promise<Category[]> {
    return await this.repository.find({
      relations: ['tutorials'],
    });
  }

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Category>> {
    const queryBuilder = this.repository.createQueryBuilder('category');

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

  async findOne(options: object): Promise<Category | null> {
    return await this.repository.findOne(options);
  }

  async findOneBy(options: object): Promise<Category | null> {
    return await this.repository.findOne({ where: options });
  }
  async save(entity: CreateCategoryDto): Promise<Category> {
    return await this.repository.save(entity);
  }
  create(entity: CreateCategoryDto): Category {
    return this.repository.create(entity);
  }
  async update(id: number, entity: UpdateCategoryDto): Promise<void> {
    await this.repository.update(id, entity);
  }
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
