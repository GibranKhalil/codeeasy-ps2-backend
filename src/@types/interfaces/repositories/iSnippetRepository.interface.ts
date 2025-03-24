import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { UpdateSnippetDto } from 'src/models/snippet/dto/update-snippet.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';

export interface ISnippetRepository
  extends IGenericRepository<
    IPaginatedResult<Snippet>,
    Snippet,
    Partial<Snippet>,
    UpdateSnippetDto,
    Snippet
  > {
  findAllWithRelations(): Promise<Snippet[]>;
  findFeaturedSnippetsWithCreator(): Promise<Snippet[]>;
  findWithRelations(id: number): Promise<Snippet | null>;
  findByCreator(creatorId: number): Promise<Snippet[]>;
}
