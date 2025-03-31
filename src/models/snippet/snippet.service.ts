import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { ISnippetRepository } from 'src/@types/interfaces/repositories/iSnippetRepository.interface';
import { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';

@Injectable()
export class SnippetService {
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

  async publishSnippet(id: number) {
    const snippet = await this.snippetsRepository.findOneBy({ id });

    if (!snippet) {
      throw new NotFoundException('Snippet não encontrado');
    }

    await this.snippetsRepository.update(snippet.id, {
      status: eContentStatus.APPROVED,
    });

    const submission = await this.submissionRepository.findOne({
      where: {
        type: 'snippet',
        snippet: { id: snippet.id },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submissão não encontrada');
    }

    await this.submissionRepository.update(submission.id, {
      status: 'approved',
    });
  }

  remove(id: number) {
    return this.snippetsRepository.delete(id);
  }
}
