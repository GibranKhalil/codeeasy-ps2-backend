import { Game } from 'src/models/games/entities/game.entity';
import type { Snippet } from 'src/models/snippet/entities/snippet.entity';
import type { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';

export class Tag {
  id: number;
  name: string;
  snippets: Snippet[];
  tutorials: Tutorial[];
  games: Game[];
}
