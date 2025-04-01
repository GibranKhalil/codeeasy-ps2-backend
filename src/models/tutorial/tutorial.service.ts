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
