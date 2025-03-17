import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("games")
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column()
  short_description: string

  @Column()
  category: string

  @Column("simple-array", { nullable: true })
  tags: string[]

  @Column()
  version: string

  @Column()
  file_size: number

  @Column()
  cover_image_url: string

  @Column("simple-array")
  screenshots: string[]

  @Column()
  game_description_url: string

  @Column()
  file_url: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

