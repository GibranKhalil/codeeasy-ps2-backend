import { Game } from 'src/models/games/entities/game.entity';
import { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Tutorial, (tutorial) => tutorial.category)
  tutorials: Tutorial[];

  @OneToMany(() => Game, (game) => game.category)
  games: Game[];
}
