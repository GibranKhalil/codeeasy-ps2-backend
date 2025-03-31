import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesRepository } from './games.repository';
import { UsersRepository } from '../users/users.repository';
import { SubmissionsRepository } from '../submissions/submissions.repository';

@Module({
  controllers: [GamesController],
  providers: [
    GamesService,
    { provide: 'IGamesRepository', useClass: GamesRepository },
    { provide: 'IUsersRepository', useClass: UsersRepository },
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
  ],
})
export class GamesModule {}
