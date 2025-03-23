import { Module } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';
import { SnippetRepository } from './snippet.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [SnippetController],
  providers: [
    SnippetService,
    { provide: 'ISnippetRepository', useClass: SnippetRepository },
    { provide: 'IUsersRepository', useClass: UsersRepository },
  ],
})
export class SnippetModule {}
