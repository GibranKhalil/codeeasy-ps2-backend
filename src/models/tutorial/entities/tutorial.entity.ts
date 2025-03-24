import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { Interactions } from 'src/@types/interactions.type';
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

@Entity('tutorials')
export class Tutorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
  pid: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column()
  readTime: number;

  @Column()
  coverImage_url: string;

  @Column()
  content: string;

  @Column({ default: eContentStatus.PENDING })
  status: eContentStatus;

  @Column({ type: 'int', default: 0 })
  views: Interactions['views'];

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

  @ManyToOne(() => User, (creator) => creator.tutorials)
  creator: User;

  @ManyToOne(() => Category, (category) => category.tutorials, {
    nullable: false,
  })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.tutorials)
  @JoinTable()
  tags: Tag[];
}
