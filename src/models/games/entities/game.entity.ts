import type { Interactions } from 'src/@types/interactions.type';
import { Category } from 'src/models/categorys/entities/category.entity';
import { Tag } from 'src/models/tags/entities/tag.entity';
import { User } from 'src/models/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column()
  version: string;

  @Column()
  fileSize: number;

  @Column({ type: 'text' })
  coverImage_url: string;

  @Column('text', { array: true })
  screenshots: string[];

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  game_url: string;

  @Column({ type: 'int', default: 0 })
  downloads: Interactions['downloads'];

  @Column({ type: 'int', default: 0 })
  views: Interactions['views'];

  @Column({ type: 'int', default: 0 })
  stars: Interactions['stars'];

  @Column({ type: 'int', default: 0 })
  likes: Interactions['likes'];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (creator) => creator.games)
  creator: User;

  @ManyToOne(() => Category, (category) => category.games, {
    nullable: false,
  })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.games)
  @JoinTable()
  tags: Tag[];
}
