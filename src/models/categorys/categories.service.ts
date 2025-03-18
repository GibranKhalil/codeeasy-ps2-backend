import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategoriesRepository } from 'src/@types/interfaces/repositories/iCategoriesRepository.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoriesRepository')
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  findOne(id: number) {
    return this.categoriesRepository.findOneBy({ id });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }
}
