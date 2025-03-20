import { eSnippetEngine } from 'src/@types/enums/eSnippetEngine.enum';
import type { eSnippetLanguage } from 'src/@types/enums/eSnippetLanguage.enum';
import type { User } from 'src/models/users/entities/user.entity';

export class CreateSnippetDto {
  title: string;
  description: string;
  code: string;
  language: eSnippetLanguage;
  creator: User;
  engine?: eSnippetEngine;
}
