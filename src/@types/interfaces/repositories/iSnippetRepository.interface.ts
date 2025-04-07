import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { UpdateSnippetDto } from 'src/models/snippet/dto/update-snippet.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { CreateSnippetDto } from 'src/models/snippet/dto/create-snippet.dto';

export interface ISnippetRepository
  extends IGenericRepository<
    IPaginatedResult<Snippet>,
    Snippet,
    CreateSnippetDto,
    UpdateSnippetDto,
    Snippet
  > {
  addInteraction(id: number, interactionDto: string): unknown;
  findAllWithRelations(): Promise<Snippet[]>;
  findFeaturedSnippetsWithCreator(): Promise<Snippet[]>;
  findWithRelations(id: number): Promise<Snippet | null>;
  findByCreator(
    creatorId: number,
    pagination: PaginationParams,
  ): Promise<IPaginatedResult<Snippet>>;
}
