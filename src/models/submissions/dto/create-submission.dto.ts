import { Game } from 'src/models/games/entities/game.entity';
import {
  SubmissionStatus,
  SubmissionType,
} from '../entities/submission.entity';
import { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { User } from 'src/models/users/entities/user.entity';

export class CreateSubmissionDto {
  type: SubmissionType;
  snippet?: Snippet;
  tutorial?: Tutorial;
  game?: Game;
  comment?: string;
  title: string;
  creator: User;
  status?: SubmissionStatus;
}
