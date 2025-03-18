import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateSnippetDto } from 'src/models/snippet/dto/create-snippet.dto';
import { UpdateSnippetDto } from 'src/models/snippet/dto/update-snippet.dto';

export interface ISnippetRepository
  extends IGenericRepository<
    Snippet,
    Snippet,
    CreateSnippetDto,
    UpdateSnippetDto,
    Snippet
  > {
  findAllWithRelations(): Promise<Snippet[]>;
  findWithRelations(id: number): Promise<Snippet | null>;
  findByCreator(creatorId: number): Promise<Snippet[]>;
}
