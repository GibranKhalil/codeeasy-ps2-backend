import { Module } from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { TutorialController } from './tutorial.controller';
import { TutorialRepository } from './tutorial.repository';
import { SubmissionsRepository } from '../submissions/submissions.repository';
import { UsersRepository } from '../users/users.repository';
import { CategoriesRepository } from '../categorys/categories.repository';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [TutorialController],
  providers: [
    TutorialService,
    StorageService,
    { provide: 'ITutorialsRepository', useClass: TutorialRepository },
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
    { provide: 'IUsersRepository', useClass: UsersRepository },
    { provide: 'ICategoriesRepository', useClass: CategoriesRepository },
  ],
})
export class TutorialModule {}
