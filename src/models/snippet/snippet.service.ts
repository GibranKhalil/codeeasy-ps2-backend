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

    const newSnippet = this.snippetsRepository.create({
      ...createSnippetDto,
      creator,
    });

    return this.snippetsRepository.save(newSnippet);
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

  remove(id: number) {
    return this.snippetsRepository.delete(id);
  }
}
