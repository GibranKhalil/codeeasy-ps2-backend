import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('snippets')
export class Snippet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  language: string;

  @Column({ type: 'uuid' })
  author: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'uuid', nullable: true })
  last_modifier: string;

  @Column('simple-array', { nullable: true })
  modifiers: string[];

  @Column()
  code_url: string;

  @Column('simple-array', { nullable: true })
  tags: string[];
}