import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { UpdateSnippetDto } from 'src/models/snippet/dto/update-snippet.dto';

export interface ISnippetRepository
  extends IGenericRepository<
    Snippet,
    Snippet,
    Partial<Snippet>,
    UpdateSnippetDto,
    Snippet
  > {
  findAllWithRelations(): Promise<Snippet[]>;
  findWithRelations(id: number): Promise<Snippet | null>;
  findByCreator(creatorId: number): Promise<Snippet[]>;
  findAllWithCreatorRelation(page: number, limit: number): Promise<Snippet[]>;
}
