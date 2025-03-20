import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { ISnippetRepository } from 'src/@types/interfaces/repositories/iSnippetRepository.interface';

@Injectable()
export class SnippetService {
  constructor(
    @Inject('ISnippetRepository')
    private readonly snippetsRepository: ISnippetRepository,
  ) {}

  create(createSnippetDto: CreateSnippetDto) {
    if (!createSnippetDto.creator.id) {
      throw new BadRequestException('É preciso que o snippet tenha um criador');
    }
    return this.snippetsRepository.save(createSnippetDto);
  }

  findAll() {
    return this.snippetsRepository.find();
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
