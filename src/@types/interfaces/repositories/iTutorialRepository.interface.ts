import type { CreateTutorialDto } from 'src/models/tutorial/dto/create-tutorial.dto';
import type { IGenericRepository } from '../common/iGenericRepository.interface';
import type { UpdateTutorialDto } from 'src/models/tutorial/dto/update-tutorial.dto';
import type { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';

export interface ITutorialsRepository
  extends IGenericRepository<
    IPaginatedResult<Tutorial>,
    Tutorial,
    CreateTutorialDto,
    UpdateTutorialDto,
    Tutorial
  > {
  addInteraction(id: number, interactionDto: string): unknown;
  findFeaturedTutorialsWithCreator(): Promise<Tutorial[]>;
  findByCreator(
    creatorId: number,
    pagination: PaginationParams,
  ): Promise<IPaginatedResult<Tutorial>>;
  findWithRelations(id: number): Promise<Tutorial | null>;
  findAllWithRelations(): Promise<Tutorial[]>;
  findByTagsAndCategory(
    page: number,
    limit: number,
    filters?: { category?: number; tags?: string[]; pid?: string },
  ): Promise<IPaginatedResult<Tutorial>>;
}
