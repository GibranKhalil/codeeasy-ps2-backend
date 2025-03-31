import { Category } from 'src/models/categorys/entities/category.entity';
import { Tag } from 'src/models/tags/entities/tag.entity';
import { User } from 'src/models/users/entities/user.entity';

export class CreateGameDto {
  title: string;
  excerpt: string;
  version: string;
  fileSize: number;
  creator?: User; // esse campo não vem do front, é preenchido pelo service
  creatorId?: number; // esse campo vem do front e não é opcional
  category: Category;
  tags?: Tag[];
  coverImage_url: string;
  screenshots: string[];
  game_url: string;
  description: string;
}
