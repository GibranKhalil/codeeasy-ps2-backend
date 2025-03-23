import type { CreateTutorialDto } from 'src/models/tutorial/dto/create-tutorial.dto';
import type { IGenericRepository } from '../common/iGenericRepository.interface';
import type { UpdateTutorialDto } from 'src/models/tutorial/dto/update-tutorial.dto';
import type { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';

export interface ITutorialsRepository
  extends IGenericRepository<
    IPaginatedResult<Tutorial>,
    Tutorial,
    CreateTutorialDto,
    UpdateTutorialDto,
    Tutorial
  > {
  findByCreator(creatorId: number): Promise<Tutorial[]>;
  findWithRelations(id: number): Promise<Tutorial | null>;
  findAllWithRelations(): Promise<Tutorial[]>;
}
