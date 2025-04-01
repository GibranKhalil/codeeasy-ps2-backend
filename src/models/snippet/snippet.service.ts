import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { ISnippetRepository } from 'src/@types/interfaces/repositories/iSnippetRepository.interface';
import { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { UpdateResult } from 'typeorm';

@Injectable()
export class SnippetService {
  private readonly logger = new Logger(SnippetService.name);

  constructor(
    @Inject('ISnippetRepository')
    private readonly snippetsRepository: ISnippetRepository,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
  ) {}

  async create(createSnippetDto: CreateSnippetDto) {
    if (!createSnippetDto.creatorId) {
      throw new BadRequestException('É preciso que o snippet tenha um criador');
    }

    const creator = await this.usersRepository.findOneBy({
      id: createSnippetDto.creatorId,
    });

    if (!creator) {
      throw new NotFoundException('Criador não encontrado');
    }

    delete createSnippetDto.creatorId;

    const newSnippet = this.snippetsRepository.create({
      ...createSnippetDto,
      creator,
    });

    const snippet = await this.snippetsRepository.save(newSnippet);

    const newSubmission = this.submissionRepository.create({
      title: `Snippet: ${snippet.title}`,
      type: 'snippet',
      snippet,
      creator,
    });

    await this.submissionRepository.save(newSubmission);

    return snippet;
  }

  findByCreator(creatorId: number, pagination: PaginationParams) {
    return this.snippetsRepository.findByCreator(creatorId, pagination);
  }

  findFeaturedContent() {
    return this.snippetsRepository.findFeaturedSnippetsWithCreator();
  }

  findAll(page = 1, limit = 10) {
    return this.snippetsRepository.find(page, limit);
  }

  findOne(id: number) {
    return this.snippetsRepository.findOneBy({ id });
  }

  update(id: number, updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsRepository.update(id, updateSnippetDto);
  }

  async updateStatus(
    pid: string,
    status: eContentStatus,
  ): Promise<UpdateResult> {
    const entity = await this.findSnippetIdByPid(pid);

    if (!entity) {
      this.logAndThrowNotFound(pid);
    }

    return this.performUpdate(entity.id, status, pid);
  }

  private async findSnippetIdByPid(pid: string) {
    return await this.snippetsRepository.findOneBy({ pid });
  }

  private logAndThrowNotFound(pid: string): never {
    this.logger.warn(`Snippet com PID ${pid} não encontrado para atualização.`);
    throw new NotFoundException(`Snippet com PID ${pid} não encontrado.`);
  }

  private async performUpdate(
    id: number,
    status: eContentStatus,
    pid: string,
  ): Promise<UpdateResult> {
    const updateResult = await this.snippetsRepository.update(id, { status });

    if (!updateResult.affected || updateResult.affected <= 0) {
      this.logAndThrowUpdateError(id, pid, status);
    }

    this.logger.log(
      `Status do Snippet ${id} (PID: ${pid}) atualizado para ${status}.`,
    );
    return updateResult;
  }

  private logAndThrowUpdateError(
    id: number,
    pid: string,
    status: eContentStatus,
  ): never {
    this.logger.error(
      `Falha ao atualizar status do Snippet ${id} (PID: ${pid}) para ${status}. Nenhum registro afetado.`,
    );
    throw new InternalServerErrorException(
      'Não foi possível atualizar o status do snippet.',
    );
  }

  remove(id: number) {
    return this.snippetsRepository.delete(id);
  }
}
