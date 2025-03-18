import type { Tag } from 'src/models/tags/entities/tag.entity';
import type { User } from 'src/models/users/entities/user.entity';

export class CreateTutorialDto {
  title: string;
  excerpt: string;
  readTime: number;
  tags: Tag[];
  content: string;
  creator: User;
  coverImage_url: string;
}
