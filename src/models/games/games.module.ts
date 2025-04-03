import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesRepository } from './games.repository';
import { UsersRepository } from '../users/users.repository';
import { SubmissionsRepository } from '../submissions/submissions.repository';
import { StorageService } from '../storage/storage.service';
import { CategoriesRepository } from '../categorys/categories.repository';

@Module({
  controllers: [GamesController],
  providers: [
    GamesService,
    StorageService,
    { provide: 'IGamesRepository', useClass: GamesRepository },
    { provide: 'IUsersRepository', useClass: UsersRepository },
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
    { provide: 'ICategoriesRepository', useClass: CategoriesRepository },
  ],
})
export class GamesModule {}
