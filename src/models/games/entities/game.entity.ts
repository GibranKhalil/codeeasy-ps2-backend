import { Interactions } from 'src/@types/interactions.type';
import type { Category } from 'src/models/categorys/entities/category.entity';
import { Tag } from 'src/models/tags/entities/tag.entity';
import { User } from 'src/models/users/entities/user.entity';

export class Game {
  id: number;
  title: string;
  excerpt: string;
  category: Category;
  version: string;
  tags: Tag[];
  fileSize: number;
  coverImage_url: string;
  screenshots: string[];
  description: string;
  game_url: string;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
  interactions: Interactions;
}
