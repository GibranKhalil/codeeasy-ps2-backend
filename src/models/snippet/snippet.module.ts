import { Module } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';
import { SnippetRepository } from './snippet.repository';
import { UsersRepository } from '../users/users.repository';
import { SubmissionsRepository } from '../submissions/submissions.repository';

@Module({
  controllers: [SnippetController],
  providers: [
    SnippetService,
    { provide: 'ISnippetRepository', useClass: SnippetRepository },
    { provide: 'IUsersRepository', useClass: UsersRepository },
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
  ],
})
export class SnippetModule {}
