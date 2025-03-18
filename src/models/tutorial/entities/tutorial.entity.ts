import { Interactions } from 'src/@types/interactions.type';
import type { Tag } from 'src/models/tags/entities/tag.entity';
import type { User } from 'src/models/users/entities/user.entity';

export class Tutorial {
  id: number;
  title: string;
  excerpt: string;
  readTime: number;
  tags: Tag[];
  coverImage_url: string;
  content: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  interactions: Interactions;
}
