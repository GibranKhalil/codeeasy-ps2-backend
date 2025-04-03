import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { Category } from 'src/models/categorys/entities/category.entity';
import { User } from 'src/models/users/entities/user.entity';

export class CreateGameDto {
  title: string;
  excerpt: string;
  version: string;
  fileSize: number;
  creator?: User; // esse campo não vem do front, é preenchido pelo service
  creatorId?: number; // esse campo vem do front e não é opcional
  category: Category; // esse campo não vem do front, é preenchido pelo service
  category_id?: string; // esse campo vem do front e não é opcional
  tags?: string[];
  coverImage_url: string;
  screenshots: string[];
  game_url: string;
  description: string;
  status?: eContentStatus;
}
