import { Game } from 'src/models/games/entities/game.entity';
import { Role } from 'src/models/roles/entities/role.entity';
import { Snippet } from 'src/models/snippet/entities/snippet.entity';
import { Submission } from 'src/models/submissions/entities/submission.entity';
import { Tutorial } from 'src/models/tutorial/entities/tutorial.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
  pid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  githubId?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Tutorial, (tutorial) => tutorial.creator)
  tutorials: Tutorial[];

  @OneToMany(() => Snippet, (snippet) => snippet.creator)
  snippets: Snippet[];

  @OneToMany(() => Game, (game) => game.creator)
  games: Game[];

  @OneToMany(() => Snippet, (snippet) => snippet.lastModifier)
  snippetLastModifier: Snippet[];

  @ManyToMany(() => Snippet, (snippet) => snippet.modifiers)
  snippetModifiers: Snippet[];

  @ManyToMany(() => Submission, (submission) => submission.creator)
  submissions: Submission[];

  @ManyToMany(() => Role, (role: Role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];
}
