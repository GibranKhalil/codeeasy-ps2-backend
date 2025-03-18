import type { Tag } from 'src/models/tags/entities/tag.entity';
import type { IGenericRepository } from '../common/iGenericRepository.interface';
import type { CreateTagDto } from 'src/models/tags/dto/create-tag.dto';
import type { UpdateTagDto } from 'src/models/tags/dto/update-tag.dto';

export interface ITagsRepository
  extends IGenericRepository<Tag, Tag, CreateTagDto, UpdateTagDto, Tag> {
  findByName(name: string): Promise<Tag | null>;
  findWithRelations(id: number): Promise<void>;
  findAllWithRelations(): Promise<Tag[]>;
}
