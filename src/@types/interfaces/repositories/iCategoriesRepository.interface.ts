import { Category } from 'src/models/categorys/entities/category.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateCategoryDto } from 'src/models/categorys/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/models/categorys/dto/update-category.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';

export interface ICategoriesRepository
  extends IGenericRepository<
    IPaginatedResult<Category>,
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
    Category
  > {
  findByName(name: string): Promise<Category | null>;
  findWithRelations(id: number): Promise<Category | null>;
  findAllWithRelations(): Promise<Category[]>;
}
