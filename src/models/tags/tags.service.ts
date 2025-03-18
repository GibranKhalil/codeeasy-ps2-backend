import { Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ITagsRepository } from 'src/@types/interfaces/repositories/iTagsRepository.interface';

@Injectable()
export class TagsService {
  constructor(
    @Inject('ITagsRepository') private readonly tagsRepository: ITagsRepository,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagsRepository.save(createTagDto);
  }

  findAll() {
    return this.tagsRepository.find();
  }

  findOne(id: number) {
    return this.tagsRepository.findOneBy({ id });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagsRepository.update(id, updateTagDto);
  }

  remove(id: number) {
    return this.tagsRepository.delete(id);
  }
}
