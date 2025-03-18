import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';

@Module({
  controllers: [TagsController],
  providers: [
    TagsService,
    { provide: 'ITagsRepository', useClass: TagsRepository },
  ],
})
export class TagsModule {}
