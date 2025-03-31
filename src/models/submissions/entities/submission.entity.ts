import { Game } from 'src/models/games/entities/game.entity';
import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import { User } from 'src/models/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export type SubmissionType = 'snippet' | 'tutorial' | 'game';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ['snippet', 'tutorial', 'game'] })
  type: SubmissionType;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: SubmissionStatus;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  submittedAt: Date;

  @OneToOne(() => Snippet, { nullable: true, cascade: true })
  @JoinColumn()
  snippet?: Snippet;

  @OneToOne(() => Tutorial, { nullable: true, cascade: true })
  @JoinColumn()
  tutorial?: Tutorial;

  @OneToOne(() => Game, { nullable: true, cascade: true })
  @JoinColumn()
  game?: Game;

  @ManyToOne(() => User, (creator) => creator.submissions, { nullable: false })
  @JoinColumn({ name: 'creatorId' })
  creator: User;
}
