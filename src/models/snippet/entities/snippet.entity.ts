import type { eSnippetLanguage } from 'src/@types/enums/eSnippetLanguage.enum';
import type { Interactions } from 'src/@types/interactions.type';
import type { Tag } from 'src/models/tags/entities/tag.entity';
import type { User } from 'src/models/users/entities/user.entity';

export class Snippet {
  id: number;
  creator: User;
  title: string;
  description: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifier: User;
  modifiers: User[];
  language: eSnippetLanguage;
  interactions: Interactions;
  commentsCount: number;
  tags: Tag[];
}
