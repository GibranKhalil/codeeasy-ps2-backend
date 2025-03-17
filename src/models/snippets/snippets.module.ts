import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { Snippet } from './entities/snippet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Snippet])],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule {}