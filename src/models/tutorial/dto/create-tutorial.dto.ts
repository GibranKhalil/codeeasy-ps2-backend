import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { Category } from 'src/models/categorys/entities/category.entity';
import type { Tag } from 'src/models/tags/entities/tag.entity';
import { User } from 'src/models/users/entities/user.entity';

export class CreateTutorialDto {
  title: string;
  excerpt: string;
  readTime: number;
  tags?: Tag[];
  content: string;
  creatorId?: number; // esse campo vem do front e não é opcional
  coverImage_url: string;
  creator?: User; // esse campo não vem do front, é preenchido pelo service
  categoryId?: number;
  category?: Category;
  status?: eContentStatus;
}
