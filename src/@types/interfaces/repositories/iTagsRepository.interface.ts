import type { Tag } from 'src/models/tags/entities/tag.entity';
import type { IGenericRepository } from '../common/iGenericRepository.interface';
import type { CreateTagDto } from 'src/models/tags/dto/create-tag.dto';
import type { UpdateTagDto } from 'src/models/tags/dto/update-tag.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';

export interface ITagsRepository
  extends IGenericRepository<
    IPaginatedResult<Tag>,
    Tag,
    CreateTagDto,
    UpdateTagDto,
    Tag
  > {
  findByName(name: string): Promise<Tag | null>;
  findWithRelations(id: number): Promise<void>;
  findAllWithRelations(): Promise<Tag[]>;
}
