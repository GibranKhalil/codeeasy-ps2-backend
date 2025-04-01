import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsRepository } from './submissions.repository';
import { SnippetRepository } from '../snippet/snippet.repository';
import { GamesRepository } from '../games/games.repository';
import { TutorialRepository } from '../tutorial/tutorial.repository';

@Module({
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
    { provide: 'ISnippetRepository', useClass: SnippetRepository },
    { provide: 'IGamesRepository', useClass: GamesRepository },
    { provide: 'ITutorialsRepository', useClass: TutorialRepository },
  ],
})
export class SubmissionsModule {}
