import { Game } from 'src/models/games/entities/game.entity';
import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Snippet, (snippet) => snippet.tags)
  snippets: Snippet[];

  @ManyToMany(() => Tutorial, (tutorial) => tutorial.tags)
  tutorials: Tutorial[];

  @ManyToMany(() => Game, (game) => game.tags)
  games: Game[];
}
