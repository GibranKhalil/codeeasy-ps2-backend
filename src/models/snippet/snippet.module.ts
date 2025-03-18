import { Module } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';
import { SnippetRepository } from './snippet.repository';

@Module({
  controllers: [SnippetController],
  providers: [
    SnippetService,
    { provide: 'ISnippetRepository', useClass: SnippetRepository },
  ],
})
export class SnippetModule {}
