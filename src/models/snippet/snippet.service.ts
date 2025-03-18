import { Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { ISnippetRepository } from 'src/@types/interfaces/repositories/iSnippetRepository.interface';

@Injectable()
export class SnippetService {
  constructor(private snippetsRepository: ISnippetRepository) {}

  create(createSnippetDto: CreateSnippetDto) {
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
