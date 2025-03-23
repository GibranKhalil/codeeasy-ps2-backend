import { Inject, Injectable } from '@nestjs/common';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Injectable()
export class TutorialService {
  constructor(
    @Inject('ITutorialsRepository')
    private readonly tutorialRepository: ITutorialsRepository,
  ) {}

  create(createTutorialDto: CreateTutorialDto) {
    return this.tutorialRepository.save(createTutorialDto);
  }

  findAll(page = 1, limit = 10) {
    return this.tutorialRepository.find(page, limit);
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
