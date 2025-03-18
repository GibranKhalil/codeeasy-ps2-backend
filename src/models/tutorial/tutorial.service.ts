import { Injectable } from '@nestjs/common';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Injectable()
export class TutorialService {
  constructor(private readonly tutorialRepository: ITutorialsRepository) {}

  create(createTutorialDto: CreateTutorialDto) {
    return this.tutorialRepository.save(createTutorialDto);
  }

  findAll() {
    return this.tutorialRepository.find();
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
