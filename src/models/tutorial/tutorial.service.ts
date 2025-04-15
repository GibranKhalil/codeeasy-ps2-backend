import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { ICategoriesRepository } from 'src/@types/interfaces/repositories/iCategoriesRepository.interface';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { UpdateResult } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { User } from '../users/entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { Interactions } from 'src/@types/interactions.type';
import { Category } from '../categorys/entities/category.entity';

@Injectable()
export class TutorialService {
  private readonly logger = new Logger(TutorialService.name);
  constructor(
    @Inject('ITutorialsRepository')
    private readonly tutorialRepository: ITutorialsRepository,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ICategoriesRepository')
    private readonly categoriesRepository: ICategoriesRepository,
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createTutorialDto: CreateTutorialDto,
    coverImage: Express.Multer.File,
  ) {
    const category = await this.categoriesRepository.findOneBy({
      id: createTutorialDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const creator = await this.usersRepository.findOneBy({
      id: createTutorialDto.creatorId,
    });

    if (!creator) {
      throw new NotFoundException('Criador não encontrado');
    }

    const tutorial = await this.createAndSubmitTutorial(
      { ...createTutorialDto, category, creator },
      coverImage,
    );

    await this.createSubmissionForTutorial(tutorial, creator);

    return tutorial;
  }

  async createAndSubmitTutorial(
    createTutorialDto: CreateTutorialDto,
    coverImage: Express.Multer.File,
  ) {
    let coverImage_url: string = '';

    try {
      if (coverImage) {
        coverImage_url = await this.storageService.uploadFile(
          coverImage.buffer,
          coverImage.originalname,
          coverImage.mimetype,
        );
      }

      const newTutorial = this.tutorialRepository.create({
        ...createTutorialDto,
        coverImage_url,
        tags: Array.isArray(createTutorialDto.tags)
          ? createTutorialDto.tags
          : String(createTutorialDto.tags)?.split(',') || [],
      });

      const tutorial = await this.tutorialRepository.save(newTutorial);

      return tutorial;
    } catch (error) {
      console.error('Erro ao criar jogo:', error);

      if (coverImage_url) {
        await this.storageService.deleteFile(coverImage_url.split('/').pop()!);
      }

      throw new InternalServerErrorException(
        'Erro ao criar tutorial! Tente novamente.',
      );
    }
  }

  async createSubmissionForTutorial(tutorial: Tutorial, creator: User) {
    const newSubmission = this.submissionRepository.create({
      title: `Tutorial: ${tutorial.title}`,
      type: 'tutorial',
      tutorial,
      creator,
    });

    return await this.submissionRepository.save(newSubmission);
  }

  async addInteraction(pid: string, interactionDto: keyof Interactions) {
    const tutorial = await this.tutorialRepository.findOne({
      where: { pid },
    });

    if (!tutorial) {
      throw new NotFoundException('Tutorial não encontrado');
    }

    return await this.tutorialRepository.addInteraction(
      tutorial.id,
      interactionDto,
    );
  }

  async findSimilars(page = 1, limit = 10, pid: string) {
    const tutorial = await this.tutorialRepository.findOne({
      where: { pid },
      relations: ['category'],
    });

    if (!tutorial) {
      throw new NotFoundException('Tutorial não encontrado');
    }

    const { tags, category } = tutorial;

    return await this.tutorialRepository.findByTagsAndCategory(page, limit, {
      category: category.id,
      tags,
      pid,
    });
  }

  findFeaturedTutorialsWithCreator() {
    return this.tutorialRepository.findFeaturedTutorialsWithCreator();
  }

  findAll(page = 1, limit = 10, filters?: { category?: number }) {
    return this.tutorialRepository.find(page, limit, filters);
  }

  findOneByPid(pid: string) {
    return this.tutorialRepository.findOne({
      where: { pid },
      relations: ['creator', 'category'],
    });
  }

  findByCreator(creatorId: number, pagination: PaginationParams) {
    return this.tutorialRepository.findByCreator(creatorId, pagination);
  }

  findOne(id: number) {
    return this.tutorialRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateTutorialDto: UpdateTutorialDto,
    creator_id: number,
    newCoverImage?: Express.Multer.File,
  ) {
    const tutorial = await this.tutorialRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!tutorial) {
      throw new NotFoundException('Tutorial não encontrado');
    }

    if (Number(creator_id) !== tutorial.creator.id) {
      throw new BadRequestException(
        'Apenas o criador do tutorial pode editá-lo',
      );
    }

    let category = tutorial.category;
    if (updateTutorialDto.categoryId) {
      category = (await this.categoriesRepository.findOneBy({
        id: updateTutorialDto.categoryId,
      })) as Category;

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    let newCoverImageUrl: string | undefined;

    if (newCoverImage) {
      try {
        newCoverImageUrl = await this.storageService.uploadFile(
          newCoverImage.buffer,
          newCoverImage.originalname,
          newCoverImage.mimetype,
        );
      } catch (error) {
        console.error('Erro ao fazer upload da nova imagem:', error);
        throw new InternalServerErrorException(
          'Erro ao atualizar a imagem de capa',
        );
      }
    }

    if (newCoverImageUrl && tutorial.coverImage_url) {
      const oldFileName = tutorial.coverImage_url.split('/').pop();
      if (oldFileName) {
        try {
          await this.storageService.deleteFile(oldFileName);
        } catch (error) {
          console.warn('Erro ao excluir imagem anterior:', error);
        }
      }
    }

    const updatedData = {
      ...updateTutorialDto,
      coverImage_url: newCoverImageUrl ?? tutorial.coverImage_url,
      tags: Array.isArray(updateTutorialDto.tags)
        ? updateTutorialDto.tags
        : String(updateTutorialDto.tags)?.split(',') || [],
    };

    delete (updatedData as CreateTutorialDto).categoryId;
    delete (updatedData as CreateTutorialDto).creatorId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete (updatedData as any).coverImage;

    await this.tutorialRepository.update(id, updatedData);

    return this.tutorialRepository.findOne({ where: { id } });
  }

  async updateStatus(
    pid: string,
    status: eContentStatus,
  ): Promise<UpdateResult> {
    const entity = await this.findTutorialIdByPid(pid);

    if (!entity) {
      this.logAndThrowNotFound(pid);
    }

    return this.performUpdate(entity.id, status, pid);
  }

  private async findTutorialIdByPid(pid: string) {
    return this.tutorialRepository.findOneBy({ pid });
  }

  private logAndThrowNotFound(pid: string): never {
    this.logger.warn(
      `Tutorial com PID ${pid} não encontrado para atualização.`,
    );
    throw new NotFoundException(`Tutorial com PID ${pid} não encontrado.`);
  }

  private async performUpdate(
    id: number,
    status: eContentStatus,
    pid: string,
  ): Promise<UpdateResult> {
    const updateResult = await this.tutorialRepository.update(id, { status });

    if (!updateResult.affected || updateResult.affected <= 0) {
      this.logAndThrowUpdateError(id, pid, status);
    }

    this.logger.log(
      `Status do Tutorial ${id} (PID: ${pid}) atualizado para ${status}.`,
    );
    return updateResult;
  }

  private logAndThrowUpdateError(
    id: number,
    pid: string,
    status: eContentStatus,
  ): never {
    this.logger.error(
      `Falha ao atualizar status do Tutorial ${id} (PID: ${pid}) para ${status}. Nenhum registro afetado.`,
    );
    throw new InternalServerErrorException(
      'Não foi possível atualizar o status do tutorial.',
    );
  }

  remove(id: number) {
    return this.tutorialRepository.delete(id);
  }
}
