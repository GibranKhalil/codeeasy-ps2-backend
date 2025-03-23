import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import type { eSnippetEngine } from 'src/@types/enums/eSnippetEngine.enum';
import type { eSnippetLanguage } from 'src/@types/enums/eSnippetLanguage.enum';
import type { Interactions } from 'src/@types/interactions.type';
import { Tag } from 'src/models/tags/entities/tag.entity';
import { User } from 'src/models/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('snippets')
export class Snippet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
  pid: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  code: string;

  @Column()
  language: eSnippetLanguage;

  @Column()
  engine: eSnippetEngine;

  @Column({ default: eContentStatus.PENDING })
  status: eContentStatus;

  @Column({ type: 'int', default: 0 })
  views: Interactions['views'];

  @Column({ type: 'int', default: 0 })
  likes: Interactions['likes'];

  @Column({ type: 'int', default: 0 })
  forks: Interactions['forks'];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (creator) => creator.snippets, { nullable: false })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToOne(() => User, (user) => user.snippetLastModifier, {
    nullable: true,
  })
  @JoinColumn({ name: 'lastModifierId' })
  lastModifier: User;

  @ManyToMany(() => User, (user) => user.snippetModifiers)
  modifiers: User[];

  @ManyToMany(() => Tag, (tag) => tag.snippets)
  @JoinTable()
  tags: Tag[];
}
