import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsRepository } from './submissions.repository';
import { SnippetRepository } from '../snippet/snippet.repository';
import { GamesRepository } from '../games/games.repository';
import { TutorialRepository } from '../tutorial/tutorial.repository';
import { GameStatusUpdater } from '../games/updaters/game-status.updater';
import { SnippetStatusUpdater } from '../snippet/updaters/snippet-status.updater';
import { TutorialStatusUpdater } from '../tutorial/updaters/tutorial-status.updater';

@Module({
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    GameStatusUpdater,
    SnippetStatusUpdater,
    TutorialStatusUpdater,
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
    { provide: 'ISnippetRepository', useClass: SnippetRepository },
    { provide: 'IGamesRepository', useClass: GamesRepository },
    { provide: 'ITutorialsRepository', useClass: TutorialRepository },
  ],
})
export class SubmissionsModule {}
