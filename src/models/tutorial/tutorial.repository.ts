import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import type { ITutorialsRepository } from 'src/@types/interfaces/repositories/iTutorialRepository.interface';
import type { CreateTutorialDto } from './dto/create-tutorial.dto';
import type { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Injectable()
export class TutorialRepository implements ITutorialsRepository {
  private repository = this.dataSource.getRepository(Tutorial);

  constructor(private readonly dataSource: DataSource) {}

  async find(): Promise<Tutorial[]> {
    return this.repository.find();
  }

  async findOneBy(options: object): Promise<Tutorial | null> {
    return this.repository.findOne({ where: options });
  }

  async findByCreator(creatorId: number): Promise<Tutorial[]> {
    return this.repository.find({
      where: { creator: { id: creatorId } },
      relations: ['creator', 'tags'],
    });
  }

  async findWithRelations(id: number): Promise<Tutorial | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['creator', 'tags'],
    });
  }

  async findAllWithRelations(): Promise<Tutorial[]> {
    return this.repository.find({
      relations: ['creator', 'tags'],
    });
  }

  create(entity: CreateTutorialDto): Tutorial {
    return this.repository.create(entity);
  }

  async save(entity: CreateTutorialDto): Promise<Tutorial> {
    return this.repository.save(entity);
  }

  async update(id: number, entity: UpdateTutorialDto): Promise<void> {
    await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
