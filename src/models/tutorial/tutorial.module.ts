import { Module } from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { TutorialController } from './tutorial.controller';
import { TutorialRepository } from './tutorial.repository';

@Module({
  controllers: [TutorialController],
  providers: [
    TutorialService,
    { provide: 'ITutorialsRepository', useClass: TutorialRepository },
  ],
})
export class TutorialModule {}
