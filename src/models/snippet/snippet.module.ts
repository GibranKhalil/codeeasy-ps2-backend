import { Module } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';

@Module({
  controllers: [SnippetController],
  providers: [SnippetService],
})
export class SnippetModule {}
