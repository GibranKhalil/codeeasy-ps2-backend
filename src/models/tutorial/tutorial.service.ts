import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { ICategoriesRepository } from 'src/@types/interfaces/repositories/iCategoriesRepository.interface';

@Injectable()
export class TutorialService {
  constructor(
    @Inject('ITutorialsRepository')
    private readonly tutorialRepository: ITutorialsRepository,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ICategoriesRepository')
    private readonly categoriesRepository: ICategoriesRepository,
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
  ) {}

  async create(createTutorialDto: CreateTutorialDto) {
    if (!createTutorialDto.creatorId) {
      throw new BadRequestException(
        'É preciso que o tutorial tenha um criador',
      );
    }

    if (!createTutorialDto.categoryId) {
      throw new BadRequestException(
        'É preciso que o tutorial tenha uma categoria',
      );
    }

    const creator = await this.usersRepository.findOneBy({
      id: createTutorialDto.creatorId,
    });

    if (!creator) {
      throw new NotFoundException('Criador não encontrado');
    }

    const category = await this.categoriesRepository.findOneBy({
      id: createTutorialDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const newTutorial = this.tutorialRepository.create({
      ...createTutorialDto,
      creator,
      category,
    });

    const tutorial = await this.tutorialRepository.save(newTutorial);

    const newSubmission = this.submissionRepository.create({
      title: `Tutorial: ${tutorial.title}`,
      type: 'tutorial',
      tutorial,
      creator,
    });

    await this.submissionRepository.save(newSubmission);

    return tutorial;
  }

  findFeaturedTutorialsWithCreator() {
    return this.tutorialRepository.findFeaturedTutorialsWithCreator();
  }

  findAll(page = 1, limit = 10) {
    return this.tutorialRepository.find(page, limit);
  }

  findByCreator(creatorId: number, pagination: PaginationParams) {
    return this.tutorialRepository.findByCreator(creatorId, pagination);
  }

  findOne(id: number) {
    return this.tutorialRepository.findOneBy({ id });
  }

  update(id: number, updateTutorialDto: UpdateTutorialDto) {
    return this.tutorialRepository.update(id, updateTutorialDto);
  }

  remove(id: number) {
    return this.tutorialRepository.delete(id);
  }
}
