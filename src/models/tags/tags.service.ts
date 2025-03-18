import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private tagsRepository: Repository<Tag>) {}

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
